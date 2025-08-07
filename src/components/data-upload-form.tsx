'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recordSchema, type RecordSchema } from '@/lib/types';
import { saveRecord } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const statusOptions = ["Marcha", "Detenido", "Lavado", "Purgado", "Local", "Remoto", "Fuera de Servicio"];

const defaultValues: RecordSchema = {
  fecha: '',
  hora: '',
  nombreOperador: '',
  caudal: 0,
  turbidezAguaCruda: 0,
  phAguaCruda: 0,
  temperatura: 0,
  turbidezAguaClarificada: 0,
  phAguaClarificada: 0,
  cloro: 0,
  pac: { ml_min: 0, ppm: 0 },
  soda: { ml_min: 0, ppm: 0 },
  ebap: { hs: 0, b1: "Marcha", b2: "Marcha", b3: "Marcha", b4: "Marcha" },
  ebac: { hs: 0, b1: "Marcha", b2: "Marcha", b3: "Marcha", b4: "Marcha" },
  filtros: { f1: "Marcha", f2: "Marcha", f3: "Marcha", f4: "Marcha" },
  observaciones: '',
};

export function DataUploadForm() {
  const { toast } = useToast();
  const form = useForm<RecordSchema>({
    resolver: zodResolver(recordSchema),
    defaultValues,
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].substring(0, 5);
    form.setValue('fecha', date);
    form.setValue('hora', time);
  }, [form]);

  async function onSubmit(data: RecordSchema) {
    const result = await saveRecord(data);
    if (result.success) {
      toast({
        title: 'Éxito',
        description: result.message,
      });
      form.reset(defaultValues);
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().split(' ')[0].substring(0, 5);
      form.setValue('fecha', date);
      form.setValue('hora', time);
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
  }

  const renderNumericInput = (name: any, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type="text" inputMode="decimal" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
  
  const renderSelectInput = (name: any, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-agua-caf', 'item-pac-soda']} className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-headline">Datos Generales</AccordionTrigger>
            <AccordionContent className="p-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hora"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nombreOperador"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Operador</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xl font-headline">Agua Cruda</AccordionTrigger>
            <AccordionContent className="p-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {renderNumericInput('caudal', 'Caudal')}
                    {renderNumericInput('turbidezAguaCruda', 'Turbidez')}
                    {renderNumericInput('phAguaCruda', 'PH')}
                    {renderNumericInput('temperatura', 'Temperatura en C°')}
                </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-agua-caf">
            <AccordionTrigger className="text-xl font-headline">Agua CAF</AccordionTrigger>
            <AccordionContent className="p-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderNumericInput('turbidezAguaClarificada', 'Turbidez')}
                    {renderNumericInput('phAguaClarificada', 'PH')}
                    {renderNumericInput('cloro', 'Cloro')}
                </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-pac-soda">
            <AccordionTrigger className="text-xl font-headline">PAC y SODA</AccordionTrigger>
            <AccordionContent className="p-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold font-headline mb-4">PAC</h3>
                  <div className="space-y-4">
                    {renderNumericInput('pac.ml_min', 'ml/min')}
                    {renderNumericInput('pac.ppm', 'ppm')}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-headline mb-4">SODA</h3>
                  <div className="space-y-4">
                    {renderNumericInput('soda.ml_min', 'ml/min')}
                    {renderNumericInput('soda.ppm', 'ppm')}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-xl font-headline">Módulo EBAP</AccordionTrigger>
            <AccordionContent className="p-2">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {renderNumericInput('ebap.hs', 'HS')}
                    {renderSelectInput('ebap.b1', 'B1')}
                    {renderSelectInput('ebap.b2', 'B2')}
                    {renderSelectInput('ebap.b3', 'B3')}
                    {renderSelectInput('ebap.b4', 'B4')}
                </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-xl font-headline">Módulo EBAC</AccordionTrigger>
            <AccordionContent className="p-2">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {renderNumericInput('ebac.hs', 'HS')}
                    {renderSelectInput('ebac.b1', 'B1')}
                    {renderSelectInput('ebac.b2', 'B2')}
                    {renderSelectInput('ebac.b3', 'B3')}
                    {renderSelectInput('ebac.b4', 'B4')}
                </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-xl font-headline">Módulo Filtros</AccordionTrigger>
            <AccordionContent className="p-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {renderSelectInput('filtros.f1', 'Filtro 1')}
                    {renderSelectInput('filtros.f2', 'Filtro 2')}
                    {renderSelectInput('filtros.f3', 'Filtro 3')}
                    {renderSelectInput('filtros.f4', 'Filtro 4')}
                </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6">
            <AccordionTrigger className="text-xl font-headline">Observaciones</AccordionTrigger>
            <AccordionContent className="p-2">
              <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anotaciones generales</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Sin novedades..." {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

        </Accordion>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
             {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Guardar Datos
          </Button>
        </div>
      </form>
    </Form>
  );
}
