import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import { Inter } from 'next/font/google'
import './globals.css';
import { AuthProvider } from '@/hooks/use-auth';

export const metadata: Metadata = {
  title: 'ecodin',
  description: 'Sua plataforma inteligente de gestão financeira.',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
            {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
