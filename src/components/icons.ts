import {
  Home,
  Car,
  UtensilsCrossed,
  HeartPulse,
  GraduationCap,
  Film,
  MoreHorizontal,
  CircleDollarSign,
  type LucideIcon,
  Wallet,
  TrendingUp,
} from 'lucide-react';
import type { Category } from '@/lib/types';

export const categoryIcons: Record<Category | 'Renda', LucideIcon> = {
  Moradia: Home,
  Transporte: Car,
  Alimentação: UtensilsCrossed,
  Saúde: HeartPulse,
  Educação: GraduationCap,
  Lazer: Film,
  Investimentos: TrendingUp,
  Outros: MoreHorizontal,
  Renda: CircleDollarSign,
};
