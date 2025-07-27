
'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendsChartProps {
    data: {
        date: string;
        Renda: number;
        Despesa: number;
    }[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };
  

export function TrendsChart({ data }: TrendsChartProps) {
  return (
    <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart
            data={data}
            margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelStyle={{ fontWeight: 'bold' }}
                wrapperClassName="rounded-md border bg-background p-2 shadow-sm"
            />
            <Legend />
            <Line type="monotone" dataKey="Renda" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} strokeWidth={2}/>
            <Line type="monotone" dataKey="Despesa" stroke="hsl(var(--destructive))" strokeWidth={2}/>
        </LineChart>
        </ResponsiveContainer>
    </div>
  );
}
