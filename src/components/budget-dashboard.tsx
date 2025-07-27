
'use client';

import { useState, useMemo, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowDown,
  ArrowUp,
  Banknote,
  BarChart,
  DollarSign,
  Landmark,
  Loader2,
  MoreHorizontal,
  Plus,
  Trash,
  Wand2,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { categories, type Transaction, type Category } from '@/lib/types';
import { categoryIcons } from '@/components/icons';
import { getAiSummary } from '@/app/actions';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  amount: z.coerce.number().positive('O valor deve ser positivo.'),
  category: z.string().min(1, 'A categoria é obrigatória.'),
});

const initialTransactions: Transaction[] = [
  { id: '1', type: 'income', name: 'Salário', amount: 5000, category: 'Renda', date: new Date(new Date().setDate(1)).toISOString() },
  { id: '2', type: 'expense', name: 'Aluguel', amount: 1500, category: 'Moradia', date: new Date(new Date().setDate(5)).toISOString() },
  { id: '3', type: 'expense', name: 'Supermercado', amount: 800, category: 'Alimentação', date: new Date(new Date().setDate(10)).toISOString() },
  { id: '4', type: 'expense', name: 'Internet', amount: 100, category: 'Moradia', date: new Date(new Date().setDate(12)).toISOString() },
  { id: '5', type: 'expense', name: 'Transporte', amount: 250, category: 'Transporte', date: new Date(new Date().setDate(15)).toISOString() },
];


export function BudgetDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isAddTransactionOpen, setAddTransactionOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isSummaryLoading, setSummaryLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      name: '',
      amount: 0,
      category: '',
    },
  });

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    };
  }, [transactions]);
  
  const expenseByCategory = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        if (t.category !== 'Renda') {
            const key = t.category;
            if (!acc[key]) {
              acc[key] = { name: key, total: 0 };
            }
            acc[key].total += t.amount;
        }
        return acc;
      }, {} as Record<Category, { name: Category; total: number }>);
  }, [transactions]);
  
  const chartData = Object.values(expenseByCategory).sort((a,b) => b.total - a.total);

  const onSubmit = (values: z.infer<typeof transactionSchema>) => {
    const newTransaction: Transaction = {
      id: uuidv4(),
      type: values.type,
      name: values.name,
      amount: values.amount,
      category: values.type === 'income' ? 'Renda' : (values.category as Category),
      date: new Date().toISOString(),
    };
    setTransactions((prev) => [...prev, newTransaction]);
    toast({
      title: 'Transação Adicionada',
      description: `${values.name} foi adicionado com sucesso.`,
    });
    form.reset();
    setAddTransactionOpen(false);
  };
  
  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast({
        title: 'Transação Removida',
        variant: 'destructive',
    });
  }

  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    setAiSummary('');
    const summary = await getAiSummary(transactions, 0);
    setAiSummary(summary);
    setSummaryLoading(false);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renda Total</CardTitle>
            <Banknote className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">Total de rendimentos no período</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesa Total</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">Total de gastos no período</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <Landmark className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-destructive'}`}>
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-muted-foreground">Balanço final do período</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Transações Recentes</CardTitle>
                <CardDescription>Visualize e gerencie suas movimentações financeiras.</CardDescription>
              </div>
               <Dialog open={isAddTransactionOpen} onOpenChange={setAddTransactionOpen}>
                <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4"/> Adicionar Transação</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Adicionar nova transação</DialogTitle>
                    <DialogDescription>Preencha os detalhes da sua renda ou despesa.</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="income">Renda</SelectItem>
                                    <SelectItem value="expense">Despesa</SelectItem>
                                </SelectContent>
                                </Select>
                            </FormItem>
                            )}
                        />
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl><Input placeholder="Ex: Salário, Aluguel" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Valor</FormLabel>
                            <FormControl><Input type="number" placeholder="R$ 100,00" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        {form.watch('type') === 'expense' && (
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione uma categoria" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        )}
                        <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit">Adicionar</Button>
                        </DialogFooter>
                    </form>
                    </Form>
                </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                 <TableHeader>
                    <TableRow>
                        <TableHead>Transação</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                 </TableHeader>
                <TableBody>
                  {transactions.length > 0 ? (
                    transactions
                      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((t) => {
                        const Icon = categoryIcons[t.category];
                        return (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                                 <Icon className={`h-5 w-5 ${t.type === 'income' ? 'text-green-500' : 'text-muted-foreground'}`}/>
                              </div>
                              <div className="flex flex-col">
                                 <span className="font-semibold">{t.name}</span>
                                 <span className="text-xs text-muted-foreground">{t.category}</span>
                              </div>
                          </TableCell>
                          <TableCell className="text-right">
                              <div className={`font-mono font-semibold text-base ${t.type === 'income' ? 'text-green-600' : 'text-slate-700'}`}>
                                {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                              </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteTransaction(t.id)}>
                                <Trash className="h-4 w-4 text-muted-foreground"/>
                            </Button>
                          </TableCell>
                        </TableRow>
                        );
                      })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center h-24">Nenhuma transação ainda.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <Card>
                <CardHeader>
                    <CardTitle>Gastos por Categoria</CardTitle>
                    <CardDescription>Visão geral de onde seu dinheiro está indo.</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] w-full pl-0">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={100} />
                                <Tooltip
                                  cursor={{ fill: 'hsl(var(--muted))' }}
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      return (
                                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                                          <p className="font-medium">{`${payload[0].payload.name}`}</p>
                                          <p className="text-sm text-primary font-semibold">{formatCurrency(payload[0].value as number)}</p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Bar dataKey="total" radius={[0, 4, 4, 0]} fill="hsl(var(--chart-1))" />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <p>Nenhuma despesa para exibir.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Resumo com IA</CardTitle>
                    <CardDescription>Receba insights sobre seus hábitos financeiros.</CardDescription>
                </CardHeader>
                 <CardContent className="flex flex-col h-[236px]">
                    {isSummaryLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                         <ScrollArea className="flex-1">
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                {aiSummary || 'Clique no botão abaixo para gerar um resumo financeiro com a ajuda da nossa inteligência artificial.'}
                            </p>
                        </ScrollArea>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleGenerateSummary} disabled={isSummaryLoading} className="w-full">
                        <Wand2 className="mr-2 h-4 w-4" />
                        {isSummaryLoading ? 'Gerando...' : 'Gerar Resumo'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
