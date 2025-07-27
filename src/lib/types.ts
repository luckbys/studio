export type Category = 'Moradia' | 'Transporte' | 'Alimentação' | 'Saúde' | 'Educação' | 'Lazer' | 'Investimentos' | 'Outros';

export const categories: Category[] = ['Moradia', 'Transporte', 'Alimentação', 'Saúde', 'Educação', 'Lazer', 'Investimentos', 'Outros'];

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  name: string;
  amount: number;
  category: Category | 'Renda';
  date: string; // ISO 8601 date string
};
