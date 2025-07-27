import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BarChart, Lightbulb, PiggyBank, Target } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <PiggyBank className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Controle Fácil</h1>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Cadastre-se Grátis</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container grid items-center gap-12 py-12 md:py-24 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
              Organize suas finanças de um jeito fácil e inteligente.
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Com o Controle Fácil, você tem uma visão clara de suas rendas e despesas, com insights da nossa IA para te ajudar a economizar e atingir suas metas.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg">
                <Link href="/signup">Comece agora, é grátis</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image 
                src="https://placehold.co/600x400.png"
                alt="Dashboard do App"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
                data-ai-hint="dashboard finance"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/40">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight">Tudo que você precisa para uma vida financeira saudável</h2>
                    <p className="text-muted-foreground mt-2">Ferramentas poderosas e fáceis de usar.</p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex-row items-center gap-4">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                                <BarChart className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Dashboard Intuitivo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Visualize suas finanças com gráficos e relatórios claros que te ajudam a entender para onde seu dinheiro vai.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex-row items-center gap-4">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                                <Lightbulb className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Insights com IA</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Receba sugestões personalizadas da nossa inteligência artificial para otimizar seus gastos e economizar mais.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex-row items-center gap-4">
                             <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                                <Target className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Metas de Economia</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Defina metas de economia mensais e acompanhe seu progresso de forma simples e motivadora.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

         {/* Call to Action Section */}
        <section className="container py-20 text-center">
             <h2 className="text-3xl font-bold tracking-tight">Pronto para assumir o controle?</h2>
             <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Crie sua conta gratuita em segundos e dê o primeiro passo para transformar sua vida financeira.</p>
             <div className="mt-8">
                 <Button asChild size="lg">
                    <Link href="/signup">Criar minha conta agora</Link>
                </Button>
             </div>
        </section>

      </main>
      <footer className="py-6 md:px-8 md:py-0 bg-background border-t">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
                © {new Date().getFullYear()} Controle Fácil. Todos os direitos reservados.
            </p>
        </div>
      </footer>
    </div>
  );
}
