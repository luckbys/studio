import { BudgetDashboard } from '@/components/budget-dashboard';
import { PiggyBank } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40 text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-3">
             <PiggyBank className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Controle Fácil</h1>
          </div>
        </div>
      </header>
      <main className="flex-1">
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
