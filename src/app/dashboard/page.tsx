'use client';
import { BudgetDashboard } from '@/components/budget-dashboard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { PiggyBank, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <PiggyBank className="h-12 w-12 animate-pulse text-primary" />
            </div>
        )
    }

    if (!user) {
        router.push('/login');
        return null;
    }
    
  return (
    <div className="flex flex-col min-h-screen bg-muted/40 text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
             <PiggyBank className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Controle Fácil</h1>
          </div>
           <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <BudgetDashboard />
      </main>
      <footer className="py-6 md:px-8 md:py-0 bg-background border-t">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
                Criado para ajudar você a ter controle de suas finanças.
            </p>
        </div>
      </footer>
    </div>
  );
}
