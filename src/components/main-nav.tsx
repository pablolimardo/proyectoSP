'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Cargar Datos' },
  { href: '/historial', label: 'La Planilla (Historial)' },
  { href: '/guia-dosificacion', label: 'Guía de Dosificación' },
  { href: '/guia-parshall', label: 'Guía Parshall' },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex gap-6 items-center">
      {navItems.map((item) => (
        <Link 
          key={item.href}
          href={item.href}
          className={cn(
            'text-lg font-medium transition-colors hover:text-primary',
            pathname === item.href ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
