'use client';

import React from 'react';
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
  { href: '/historial', label: 'Historial de Planillas' },
  { href: '/guia-dosificacion', label: 'Guía de Dosificación' },
  { href: '/guia-parshall', label: 'Guía Parshall' },
];

interface HeaderProps {
  operadorNombre?: string;
  turnoSeleccionado?: string;
  onEditarOperador?: () => void;
}

export function Header({
  operadorNombre = 'BENICIO FILOSA',
  turnoSeleccionado = '06:00 a 12:00',
  onEditarOperador,
}: HeaderProps) {
  const pathname = usePathname();

  // Aseguramos que el texto del turno siempre tenga el formato consistente
  const turnoTexto = turnoSeleccionado.startsWith('Turno')
    ? turnoSeleccionado
    : `Turno ${turnoSeleccionado}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="flex h-20 items-center px-4 md:px-6">
        
        {/* LOGO E IDENTIFICACIÓN */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="SPSE Laboratorio Logo"
              width={70}
              height={70}
              priority
            />
            <span className="text-xl font-bold font-headline text-primary">
              SPSE Laboratorio
            </span>
          </Link>
        </div>

        {/* NAVEGACIÓN PRINCIPAL (ESCRITORIO) */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-base font-medium transition-colors hover:text-primary',
                pathname === item.href
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-foreground/60'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        

        {/* MENÚ MÓVIL */}
        <div className="md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 p-4 h-full">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/logo.jpg"
                    alt="SPSE Laboratorio Logo"
                    width={60}
                    height={60}
                  />
                  <span className="text-lg font-bold font-headline text-primary">
                    SPSE Laboratorio
                  </span>
                </Link>

                <nav className="grid gap-4 mt-4">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'text-lg font-medium transition-colors hover:text-primary',
                          pathname === item.href
                            ? 'text-primary font-bold'
                            : 'text-muted-foreground'
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                {/* VISUALIZADOR DE OPERADOR EN MÓVIL */}
                <div className="mt-auto border-t pt-4">
                  <div 
                    onClick={onEditarOperador}
                    className="flex items-center gap-3 p-2 rounded-lg border border-sky-100 bg-sky-50/50 cursor-pointer"
                  >
                    <CircleUser className="h-8 w-8 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-extrabold text-xs uppercase text-slate-800">
                        {operadorNombre}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {turnoTexto}
                      </span>
                    </div>
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