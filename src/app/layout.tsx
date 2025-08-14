
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { FormProvider } from '@/context/form-context';


export const metadata: Metadata = {
  title: 'WaterPlant Pro',
  description: 'Aplicación para operadores de planta de agua de Servicios Públicos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <FormProvider>
            <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-background">
                {children}
            </main>
            </div>
            <Toaster />
        </FormProvider>
      </body>
    </html>
  );
}
