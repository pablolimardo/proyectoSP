'use client';
import Link from 'next/link';
import { CircleUser, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navItems = [
  { href: '/', label: 'Cargar Datos' },
  { href: '/historial', label: 'La Planilla (Historial)' },
  { href: '/guia-dosificacion', label: 'Guía de Dosificación' },
  { href: '/guia-parshall', label: 'Guía Parshall' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-24 items-center px-4 md:px-6">
        <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="SPSE Laboratorio Logo" width={80} height={80} />
            <span className="text-xl font-bold font-headline text-primary whitespace-nowrap">
                SPSE Laboratorio
            </span>
            </Link>
        </div>
        
        <nav className="hidden md:flex flex-1 items-center justify-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-base font-medium transition-colors hover:text-primary',
                pathname === item.href
                  ? 'text-primary'
                  : 'text-foreground/60'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <CircleUser className="h-8 w-8 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Operador</span>
            <span className="text-xs text-muted-foreground">En turno</span>
          </div>
        </div>

        <div className="md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2">
                  <Image src="/logo.jpg" alt="SPSE Laboratorio Logo" width={80} height={80} />
                  <span className="text-xl font-bold font-headline text-primary">
                    SPSE Laboratorio
                  </span>
                </Link>
                <nav className="grid gap-4">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'text-lg font-medium transition-colors hover:text-primary',
                          pathname === item.href
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto flex items-center gap-3 border-t pt-4">
                   <CircleUser className="h-8 w-8 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">Operador</span>
                      <span className="text-xs text-muted-foreground">En turno</span>
                    </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
