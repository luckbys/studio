
'use client';

import { useState, useMemo, type FC, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
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
  Edit,
  Target,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DateRange } from 'react-day-picker';
import { subDays, startOfMonth, endOfMonth, startOfISOWeek, endOfISOWeek, format } from 'date-fns';
import { useDebounce } from 'use-debounce';


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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { getAiSummary, getAiCategorySuggestion } from '@/app/actions';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { type GenerateMonthlySummaryOutput } from '@/ai/flows/generate-monthly-summary';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { DateRangePicker } from '@/components/date-range-picker';

const transactionSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['income', 'expense']),
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  amount: z.coerce.number().positive('O valor deve ser positivo.'),
  category: z.string().min(1, 'A categoria é obrigatória.'),
});

const FREE_PLAN_LIMIT = 2;

export function BudgetDashboard() {
  const { user } = useAuth();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(
    null
  );
  const [aiSummary, setAiSummary] = useState<
    GenerateMonthlySummaryOutput | string
  >('');
  const [isSummaryLoading, setSummaryLoading] = useState(false);
  const [isSuggestionLoading, setSuggestionLoading] = useState(false);
  const [savingsGoal, setSavingsGoal] = useState(500);
  const { toast } = useToast();
  const [aiUsage, setAiUsage] = useState({ count: 0, limitReached: false });
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      name: '',
      amount: 0,
      category: '',
    },
  });

  const transactionName = form.watch('name');
  const [debouncedTransactionName] = useDebounce(transactionName, 750);

  useEffect(() => {
    if (user) {
      // Listen for transaction changes
      const q = query(
        collection(db, 'users', user.uid, 'transactions'),
        orderBy('date', 'desc')
      );
      const unsubscribeTransactions = onSnapshot(q, (querySnapshot) => {
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
      });

      // Listen for user data changes (for AI usage)
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const currentMonth = new Date().toISOString().slice(0, 7);
            if (userData.aiUsageMonth === currentMonth) {
                const count = userData.aiUsageCount || 0;
                setAiUsage({
                    count: count,
                    limitReached: count >= FREE_PLAN_LIMIT,
                });
            } else {
                 setAiUsage({ count: 0, limitReached: false });
            }
        } else {
             setAiUsage({ count: 0, limitReached: false });
        }
      });


      return () => {
        unsubscribeTransactions();
        unsubscribeUser();
      };
    }
  }, [user]);

  const handleCategorySuggestion = useCallback(async (name: string) => {
      if (name && name.length > 2 && form.watch('type') === 'expense') {
          setSuggestionLoading(true);
          const result = await getAiCategorySuggestion(name);
          if (result && result.category) {
              form.setValue('category', result.category);
          }
          setSuggestionLoading(false);
      }
  }, [form]);

  useEffect(() => {
    if (debouncedTransactionName) {
      handleCategorySuggestion(debouncedTransactionName);
    }
  }, [debouncedTransactionName, handleCategorySuggestion]);


  const transactions = useMemo(() => {
    return allTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      const from = dateRange?.from;
      const to = dateRange?.to;

      if (from && to) {
        return transactionDate >= from && transactionDate <= to;
      }
      if (from) {
        return transactionDate >= from;
      }
      if (to) {
        return transactionDate <= to;
      }
      return true;
    });
  }, [allTransactions, dateRange]);


  const openEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    form.reset({
      id: transaction.id,
      type: transaction.type,
      name: transaction.name,
      amount: transaction.amount,
      category: transaction.category,
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingTransaction(null);
    form.reset({
      type: 'expense',
      name: '',
      amount: 0,
      category: '',
    });
    setDialogOpen(true);
  };

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

  const savedThisMonth = useMemo(() => Math.max(0, balance), [balance]);
  const savingsProgress = useMemo(
    () => (savedThisMonth / savingsGoal) * 100,
    [savedThisMonth, savingsGoal]
  );

  const expenseByCategory = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
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

  const chartData = Object.values(expenseByCategory).sort(
    (a, b) => b.total - a.total
  );

  const onSubmit = async (values: z.infer<typeof transactionSchema>) => {
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado.',
        variant: 'destructive',
      });
      return;
    }
    
    // Create user doc if it doesn't exist
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            createdAt: serverTimestamp()
        })
    }

    const transactionData = {
      type: values.type,
      name: values.name,
      amount: values.amount,
      category: values.type === 'income' ? 'Renda' : (values.category as Category),
      date: new Date(),
    };

    try {
      if (editingTransaction && editingTransaction.id) {
        const transDocRef = doc(
          db,
          'users',
          user.uid,
          'transactions',
          editingTransaction.id
        );
        await updateDoc(transDocRef, transactionData);
        toast({
          title: 'Transação Atualizada',
          description: `${values.name} foi atualizada com sucesso.`,
        });
      } else {
        await addDoc(
          collection(db, 'users', user.uid, 'transactions'),
          transactionData
        );
        toast({
          title: 'Transação Adicionada',
          description: `${values.name} foi adicionado com sucesso.`,
        });
      }

      form.reset();
      setEditingTransaction(null);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving transaction: ', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Ocorreu um erro ao salvar a transação.',
        variant: 'destructive',
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
      toast({
        title: 'Transação Removida',
        description: 'A transação foi removida com sucesso.',
      });
    } catch (error) {
      console.error('Error deleting transaction: ', error);
      toast({
        title: 'Erro ao remover',
        description: 'Ocorreu um erro ao remover a transação.',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    setAiSummary('');
    const summary = await getAiSummary(transactions, savingsGoal);
    setAiSummary(summary);
    setSummaryLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const renderAiSummary = () => {
    if (typeof aiSummary === 'string') {
      return (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {aiSummary ||
            'Clique no botão abaixo para gerar um resumo financeiro com a ajuda da nossa inteligência artificial.'}
        </p>
      );
    }
    if (typeof aiSummary === 'object' && aiSummary !== null) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {aiSummary.summary}
          </p>

          {aiSummary.suggestions && aiSummary.suggestions.length > 0 && (
            <div>
              <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Sugestões de Economia
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {aiSummary.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }
    return (
      <p className="text-sm text-muted-foreground">
        Clique no botão abaixo para gerar um resumo financeiro com a ajuda da
        nossa inteligência artificial.
      </p>
    );
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Renda Total</CardTitle>
              <ArrowUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total de rendimentos no período
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Despesa Total
              </CardTitle>
              <ArrowDown className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total de gastos no período
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
              <Landmark className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  balance >= 0 ? 'text-sky-600' : 'text-destructive'
                }`}
              >
                {formatCurrency(balance)}
              </div>
              <p className="text-xs text-muted-foreground">
                Balanço final do período
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Meta de Economia
              </CardTitle>
              <Target className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sky-600">
                {formatCurrency(savedThisMonth)}
              </div>
              <div className="flex items-center gap-2">
                <Progress value={savingsProgress} className="h-2 flex-1" />
                <span className="text-xs font-semibold text-muted-foreground">
                  {Math.round(savingsProgress)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <Card>
              <CardHeader className="flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                 <div>
                    <CardTitle>Transações</CardTitle>
                    <CardDescription>
                      Visualize e gerencie suas movimentações financeiras.
                    </CardDescription>
                  </div>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                    <Button onClick={openAddDialog} className="w-full md:w-auto">
                      <Plus className="mr-2 h-4 w-4" /> Adicionar
                    </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transação</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="w-[100px] text-center">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length > 0 ? (
                      transactions.map((t) => {
                        const Icon = categoryIcons[t.category];
                        return (
                          <TableRow key={t.id}>
                            <TableCell className="font-medium flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                                <Icon
                                  className={`h-5 w-5 ${
                                    t.type === 'income'
                                      ? 'text-green-500'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold">{t.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {t.category}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(new Date(t.date), 'dd/MM/yyyy')}
                            </TableCell>
                            <TableCell className="text-right">
                              <div
                                className={`font-mono font-semibold text-base ${
                                  t.type === 'income'
                                    ? 'text-green-600'
                                    : 'text-slate-700'
                                }`}
                              >
                                {t.type === 'income' ? '+' : '-'}{' '}
                                {formatCurrency(t.amount)}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => openEditDialog(t)}
                                >
                                  <Edit className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <Trash className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Você tem certeza?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Essa ação não pode ser desfeita. Isso
                                        excluirá permanentemente sua transação.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancelar
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => t.id && deleteTransaction(t.id)}
                                      >
                                        Continuar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                          Nenhuma transação no período selecionado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Definir Meta de Economia</CardTitle>
                <CardDescription>
                  Use o slider para definir sua meta mensal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sua meta:</span>
                    <span className="font-bold text-lg text-primary">
                      {formatCurrency(savingsGoal)}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[savingsGoal]}
                    max={Math.max(1000, totalIncome)}
                    step={50}
                    onValueChange={(value) => setSavingsGoal(value[0])}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="h-[350px] flex flex-col">
              <CardHeader>
                <CardTitle>Gastos por Categoria</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pl-2">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ left: 20, right: 30 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: 'hsl(var(--muted-foreground))',
                          fontSize: 12,
                        }}
                        width={80}
                      />
                      <Tooltip
                        cursor={{ fill: 'hsl(var(--accent))' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <p className="font-medium">{`${payload[0].payload.name}`}</p>
                                <p className="text-sm text-primary font-semibold">
                                  {formatCurrency(payload[0].value as number)}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="total"
                        radius={[0, 4, 4, 0]}
                        fill="hsl(var(--primary))"
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <p>Nenhuma despesa para exibir.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="min-h-[350px] flex flex-col">
              <CardHeader>
                <CardTitle>Resumo com IA</CardTitle>
                 <CardDescription>
                  {aiUsage.limitReached
                    ? 'Você atingiu seu limite mensal.'
                    : `Você usou ${aiUsage.count} de ${FREE_PLAN_LIMIT} resumos este mês.`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {isSummaryLoading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <ScrollArea className="flex-1 pr-4">
                    {renderAiSummary()}
                  </ScrollArea>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleGenerateSummary}
                  disabled={isSummaryLoading || aiUsage.limitReached || transactions.length === 0}
                  className="w-full"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isSummaryLoading ? 'Gerando...' : 'Gerar Resumo'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? 'Editar Transação' : 'Adicionar Nova Transação'}
            </DialogTitle>
            <DialogDescription>
              {editingTransaction
                ? 'Atualize os detalhes da sua transação.'
                : 'Preencha os detalhes da sua renda ou despesa.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                    <FormControl>
                      <Input placeholder="Ex: Salário, Aluguel" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="number" placeholder="R$ 100,00" {...field} />
                    </FormControl>
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
                      <FormLabel>
                         <div className="flex items-center gap-2">
                           Categoria
                           {isSuggestionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                         </div>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {editingTransaction ? 'Salvar Alterações' : 'Adicionar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

    