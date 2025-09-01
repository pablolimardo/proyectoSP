'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';

import type { FlatPlantRecord } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

async function fetchRecords(filterDate?: Date): Promise<FlatPlantRecord[]> {
  const url = new URL('/api/records', window.location.origin);
  if (filterDate) {
    url.searchParams.append('date', filterDate.toISOString());
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  
  return data.map((record: any) => ({
    ...record,
    timestamp: new Date(record.timestamp),
  }));
}

export function HistoryClientPage() {
  const [records, setRecords] = useState<FlatPlantRecord[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    fetchRecords(date)
      .then(setRecords)
      .finally(() => setIsLoading(false));
  }, [date]);

  const handleRowClick = (id: number) => {
    router.push(`/historial/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[280px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP', { locale: es }) : <span>Filtrar por fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>
        {date && (
            <Button variant="ghost" onClick={() => setDate(undefined)} className="ml-2">Limpiar</Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Operador</TableHead>
              <TableHead>Caudal</TableHead>
              <TableHead>Cloro</TableHead>
              <TableHead>Turbidez (Clarif.)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                    Cargando datos...
                  </div>
                </TableCell>
              </TableRow>
            ) : records.length > 0 ? (
              records.map((record) => (
                <TableRow key={record.id} onClick={() => handleRowClick(record.id)} className="cursor-pointer">
                  <TableCell>{format(new Date(record.timestamp), 'dd/MM/yyyy', { locale: es })}</TableCell>
                  <TableCell>{record.hora}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{record.nombreOperador}</Badge>
                  </TableCell>
                  <TableCell>{record.caudal}</TableCell>
                  <TableCell>{record.cloro}</TableCell>
                  <TableCell>{record.turbidezAguaClarificada}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron registros para la fecha seleccionada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
