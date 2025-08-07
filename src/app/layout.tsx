import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { MainNav } from '@/components/main-nav';
import { Toaster } from '@/components/ui/toaster';
import { CircleUser } from 'lucide-react';

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
        <SidebarProvider>
          <Sidebar>
            <div className="flex flex-col h-full">
              <header className="p-4 border-b">
                <h1 className="text-2xl font-bold font-headline text-primary">
                  WaterPlant Pro
                </h1>
              </header>
              <div className="flex-1 overflow-y-auto">
                <MainNav />
              </div>
              <footer className="p-4 mt-auto border-t">
                <div className="flex items-center gap-3">
                  <CircleUser className="h-8 w-8 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="font-semibold">Operador</span>
                    <span className="text-sm text-muted-foreground">En turno</span>
                  </div>
                </div>
              </footer>
            </div>
          </Sidebar>
          <SidebarInset>
            <main className="min-h-screen bg-background">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
