import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BarChart, Lightbulb, LogIn, Wallet, Target, Check, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">ecodin</h1>
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
              Com o ecodin, você tem uma visão clara de suas rendas e despesas, com insights da nossa IA para te ajudar a economizar e atingir suas metas.
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
        <section id="features" className="py-16 bg-muted/40">
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

        {/* How it works */}
        <section id="how-it-works" className="container py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Comece a usar em 3 passos simples</h2>
            <p className="text-muted-foreground mt-2">É rápido e fácil organizar suas finanças.</p>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Crie sua Conta</h3>
              <p className="text-muted-foreground">Cadastre-se gratuitamente em menos de um minuto.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Adicione Transações</h3>
              <p className="text-muted-foreground">Registre suas rendas e despesas de forma rápida e organizada.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Receba Insights</h3>
              <p className="text-muted-foreground">Use a IA para entender seus gastos e encontrar formas de economizar.</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 bg-muted/40">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">O que nossos usuários dizem</h2>
              <p className="text-muted-foreground mt-2">Veja como o ecodin está ajudando pessoas a transformarem suas vidas financeiras.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="person photo" />
                      <AvatarFallback>JC</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Joana Costa</h3>
                      <p className="text-sm text-muted-foreground">Designer</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">"Finalmente um app financeiro que eu consigo usar! A interface é linda e a IA me deu dicas que eu nunca tinha pensado."</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                       <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="person photo" />
                       <AvatarFallback>MP</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Marcos Paulo</h3>
                      <p className="text-sm text-muted-foreground">Desenvolvedor</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">"O ecodin mudou minha relação com o dinheiro. As metas de economia são um grande motivador. Recomendo!"</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                       <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="woman photo" />
                       <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Ana Silva</h3>
                      <p className="text-sm text-muted-foreground">Autônoma</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">"Simples, direto ao ponto e muito poderoso. A melhor ferramenta para quem quer ter controle total sobre as finanças."</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight">Planos flexíveis para cada necessidade</h2>
                    <p className="text-muted-foreground mt-2">Escolha o plano que melhor se adapta à sua jornada financeira.</p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle>Grátis</CardTitle>
                            <CardDescription>Para quem está começando a organizar as finanças.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <p className="text-4xl font-bold">R$0<span className="text-xl font-normal text-muted-foreground">/mês</span></p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Transações ilimitadas</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Dashboard intuitivo</span>
                                </li>
                                 <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Metas de economia</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>2 Resumos com IA por mês</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <X className="h-4 w-4 text-destructive" />
                                    <span>Relatórios avançados</span>
                                </li>
                                 <li className="flex items-center gap-2">
                                    <X className="h-4 w-4 text-destructive" />
                                    <span>Suporte prioritário</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" asChild>
                                <Link href="/signup">Comece Grátis</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                    <Card className="border-primary flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Pro</CardTitle>
                                <Badge>Em Breve</Badge>
                            </div>
                            <CardDescription>Para quem busca controle total e insights avançados.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <p className="text-4xl font-bold">R$19,90<span className="text-xl font-normal text-muted-foreground">/mês</span></p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Tudo do plano Grátis</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Resumos com IA ilimitados</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Relatórios avançados</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Contas múltiplas</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Suporte prioritário</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="default" disabled>
                                Seja o primeiro a saber
                            </Button>
                        </CardFooter>
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
                © {new Date().getFullYear()} ecodin. Todos os direitos reservados.
            </p>
        </div>
      </footer>
    </div>
  );
}
