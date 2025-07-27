'use server';

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  generateMonthlySummary,
  type GenerateMonthlySummaryOutput,
} from '@/ai/flows/generate-monthly-summary';
import {
  suggestCategory,
  type SuggestCategoryOutput,
} from '@/ai/flows/suggest-category';
import type { Transaction } from '@/lib/types';
import { auth } from '@/lib/firebase';

const FREE_PLAN_LIMIT = 2;

export async function getAiSummary(
  transactions: Transaction[],
  savingsGoal: number
): Promise<GenerateMonthlySummaryOutput | string> {
  const user = auth.currentUser;
  if (!user) {
    return 'Você precisa estar logado para gerar um resumo.';
  }

  // For now, we assume all users are on the "free" plan.
  const userPlan = 'free';

  const userDocRef = doc(db, 'users', user.uid);
  const userDocSnap = await getDoc(userDocRef);

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  if (userPlan === 'free') {
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const usageMonth = userData.aiUsageMonth;
      const usageCount = userData.aiUsageCount || 0;

      if (usageMonth === currentMonth && usageCount >= FREE_PLAN_LIMIT) {
        return 'Você atingiu seu limite de 2 resumos de IA para este mês. Para resumos ilimitados, considere o plano Pro.';
      }
    }
  }

  try {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === 'expense' && t.category !== 'Renda')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    if (income === 0 && Object.keys(expenses).length === 0) {
      return 'Adicione algumas transações de renda e despesa para gerar um resumo.';
    }

    const result = await generateMonthlySummary({
      income,
      expenses,
      savingsGoal: savingsGoal > 0 ? savingsGoal : undefined,
    });

    // Increment usage count after successful generation
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      if (userData.aiUsageMonth === currentMonth) {
        await updateDoc(userDocRef, {
          aiUsageCount: increment(1),
        });
      } else {
        // Reset count for new month
        await updateDoc(userDocRef, {
          aiUsageMonth: currentMonth,
          aiUsageCount: 1,
        });
      }
    } else {
      // First time usage, create the document
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
        aiUsageMonth: currentMonth,
        aiUsageCount: 1,
      });
    }

    return result;
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return 'Ocorreu um erro ao gerar o resumo. Por favor, tente novamente mais tarde.';
  }
}

export async function getAiCategorySuggestion(
  transactionName: string
): Promise<SuggestCategoryOutput | null> {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }

  if (!transactionName || transactionName.trim().length < 3) {
    return null;
  }

  try {
    const result = await suggestCategory({ transactionName });
    return result;
  } catch (error) {
    console.error('Error suggesting category:', error);
    return null;
  }
}
