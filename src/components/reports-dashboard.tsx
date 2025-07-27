
'use client';

import { useState, useMemo, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { subMonths, startOfYear, endOfYear } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { type Transaction } from '@/lib/types';
import { DateRangePicker } from '@/components/date-range-picker';
import { TrendsChart } from './trends-chart';
import { Loader2 } from 'lucide-react';

export function ReportsDashboard() {
  const { user } = useAuth();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfYear(new Date()),
    to: endOfYear(new Date()),
  });

  useEffect(() => {
    if (user) {
      setLoading(true);
      const q = query(
        collection(db, 'users', user.uid, 'transactions'),
        orderBy('date', 'asc')
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userTransactions: Transaction[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userTransactions.push({
            id: doc.id,
            ...data,
            date: (data.date as Timestamp).toDate().toISOString(),
          } as Transaction);
        });
        setAllTransactions(userTransactions);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
        setLoading(false);
    }
  }, [user]);

  const transactionsInDateRange = useMemo(() => {
    return allTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      const from = dateRange?.from;
      const to = dateRange?.to;

      if (from && to) {
        return transactionDate >= from && transactionDate <= to;
      }
      return false; 
    });
  }, [allTransactions, dateRange]);

  const groupedData = useMemo(() => {
    if (!transactionsInDateRange.length) return [];
    
    const dataMap = new Map<string, { income: number; expense: number }>();

    transactionsInDateRange.forEach(t => {
      const month = t.date.slice(0, 7); // YYYY-MM
      if (!dataMap.has(month)) {
        dataMap.set(month, { income: 0, expense: 0 });
      }

      const current = dataMap.get(month)!;
      if (t.type === 'income') {
        current.income += t.amount;
      } else {
        current.expense += t.amount;
      }
    });
    
    return Array.from(dataMap.entries()).map(([month, values]) => ({
      date: month,
      Renda: values.income,
      Despesa: values.expense,
    })).sort((a,b) => a.date.localeCompare(b.date));

  }, [transactionsInDateRange]);


  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Relatório de Tendências</CardTitle>
            <CardDescription>
              Analise a evolução de suas receitas e despesas ao longo do tempo.
            </CardDescription>
          </div>
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </CardHeader>
        <CardContent>
            {loading ? (
                 <div className="flex h-[400px] w-full items-center justify-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
            ) : groupedData.length > 0 ? (
                <TrendsChart data={groupedData} />
            ) : (
                <div className="flex h-[400px] w-full items-center justify-center text-muted-foreground">
                    <p>Nenhuma transação no período selecionado para exibir o gráfico.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
