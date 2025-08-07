'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { FilePlus2, History, Book, BookMarked } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Cargar Datos', icon: FilePlus2 },
  { href: '/historial', label: 'La Planilla (Historial)', icon: History },
  { href: '/guia-caudal', label: 'Guía de Caudal', icon: Book },
  { href: '/guia-parshall', label: 'Guía Parshall', icon: BookMarked },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu className="p-4">
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname === item.href}
              className="text-base"
              size="lg"
              asChild
            >
              <div>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
