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
} from 'lucide-react';
import type { Category } from '@/lib/types';

export const categoryIcons: Record<Category | 'Renda', LucideIcon> = {
  Moradia: Home,
  Transporte: Car,
  Alimentação: UtensilsCrossed,
  Saúde: HeartPulse,
  Educação: GraduationCap,
  Lazer: Film,
  Outros: MoreHorizontal,
  Renda: CircleDollarSign,
};
