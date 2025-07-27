'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { subDays, startOfMonth, endOfMonth, startOfISOWeek, endOfISOWeek } from 'date-fns';

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
}: DateRangePickerProps) {
  const handlePresetChange = (value: string) => {
    const now = new Date();
    switch (value) {
      case 'today':
        onDateChange({ from: now, to: now });
        break;
      case 'yesterday':
        onDateChange({ from: subDays(now, 1), to: subDays(now, 1) });
        break;
      case 'this_week':
        onDateChange({ from: startOfISOWeek(now), to: endOfISOWeek(now) });
        break;
      case 'last_week':
        const lastWeekStart = startOfISOWeek(subDays(now, 7));
        const lastWeekEnd = endOfISOWeek(subDays(now, 7));
        onDateChange({ from: lastWeekStart, to: lastWeekEnd });
        break;
      case 'this_month':
        onDateChange({ from: startOfMonth(now), to: endOfMonth(now) });
        break;
      case 'last_month':
         const lastMonthStart = startOfMonth(subDays(startOfMonth(now), 1));
         const lastMonthEnd = endOfMonth(subDays(startOfMonth(now), 1));
         onDateChange({ from: lastMonthStart, to: lastMonthEnd });
        break;
      default:
        break;
    }
  };


  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal md:w-[260px]',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y', { locale: ptBR })} -{' '}
                  {format(date.to, 'LLL dd, y', { locale: ptBR })}
                </>
              ) : (
                format(date.from, 'LLL dd, y', { locale: ptBR })
              )
            ) : (
              <span>Escolha uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex items-center border-b p-2">
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Períodos pré-definidos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="yesterday">Ontem</SelectItem>
                <SelectItem value="this_week">Esta Semana</SelectItem>
                <SelectItem value="last_week">Semana Passada</SelectItem>
                <SelectItem value="this_month">Este Mês</SelectItem>
                <SelectItem value="last_month">Mês Passado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
