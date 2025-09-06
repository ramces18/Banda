import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/providers/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'La banda del IDI',
  description: 'Sistema de gestión para La banda del IDI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("RootLayout rendering");
  
  return (
    <html lang="es" className={`dark ${inter.variable}`}>
      <body className="font-body antialiased">
        <div id="root-check" style={{ display: 'none' }}>Layout loaded</div>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
