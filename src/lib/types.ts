export type Category = 'Moradia' | 'Transporte' | 'Alimentação' | 'Saúde' | 'Educação' | 'Lazer' | 'Outros';

export const categories: Category[] = ['Moradia', 'Transporte', 'Alimentação', 'Saúde', 'Educação', 'Lazer', 'Outros'];

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  name: string;
  amount: number;
  category: Category | 'Renda';
  date: string;
};
