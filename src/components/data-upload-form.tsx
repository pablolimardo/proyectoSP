
'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recordSchema, type RecordSchema } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useFormContext_NUCLEAR } from '@/context/form-context';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { Separator } from './ui/separator';

const statusOptions = ["Marcha", "Detenido", "Lavado", "Purgado", "Local", "Remoto", "Fuera de Servicio"];

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-headline font-semibold text-primary">{children}</h2>
);


export function DataUploadForm() {
  const { toast } = useToast();
  const { formData, setFormData, resetForm } = useFormContext_NUCLEAR();
  
  const form = useForm<RecordSchema>({
    resolver: zodResolver(recordSchema),
    defaultValues: formData,
  });

  const { control, setValue } = form;
  const { isSubmitting } = form.formState;

  const caudal = useWatch({ control, name: 'caudal' });
  const pacMlMin = useWatch({ control, name: 'pac.ml_min' });
  const sodaMlMin = useWatch({ control, name: 'soda.ml_min' });

  useEffect(() => {
    if (!isNaN(caudal) && caudal > 0 && !isNaN(pacMlMin)) {
      const pacPpm = (pacMlMin * 1.26 * 60) / caudal;
      setValue('pac.ppm', parseFloat(pacPpm.toFixed(2)));
    } else {
        setValue('pac.ppm', NaN)
    }
  }, [caudal, pacMlMin, setValue]);

  useEffect(() => {
    if (!isNaN(caudal) && caudal > 0 && !isNaN(sodaMlMin)) {
      const sodaPpm = (sodaMlMin * 0.05 * 60) / caudal;
      setValue('soda.ppm', parseFloat(sodaPpm.toFixed(2)));
    } else {
        setValue('soda.ppm', NaN)
    }
  }, [caudal, sodaMlMin, setValue]);


  useEffect(() => {
    form.reset(formData);
  }, [formData, form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(value as RecordSchema);
    });
    return () => subscription.unsubscribe();
  }, [form, setFormData]);


  async function onSubmit(data: RecordSchema) {
    try {
      const newRecord = {
        ...data,
        timestamp: Timestamp.fromDate(new Date(`${data.fecha}T${data.hora}`)),
      };
      await addDoc(collection(db, "registros_planta"), newRecord);
      
      toast({
        title: 'Éxito',
        description: 'Datos guardados correctamente.',
      });
      resetForm();
    } catch (error) {
      console.error('Error saving record to Firestore:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error al guardar los datos.',
        variant: 'destructive',
      });
    }
  }

  const renderNumericInput = (name: any, label: string, readOnly = false) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
                type="text" 
                inputMode="decimal"
                readOnly={readOnly}
                {...field} 
                value={isNaN(field.value) ? '' : field.value}
                onChange={e => {
                  const value = e.target.value;
                  // Allow empty string to clear the field, parse to number otherwise
                  field.onChange(value === '' ? NaN : parseFloat(value));
                }}
                className={readOnly ? "bg-muted/50" : ""}
            />
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
          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
        
        <section className="space-y-4">
            <SectionTitle>Datos Generales</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
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
        </section>

        <Separator />
        
        <section className="space-y-4">
            <SectionTitle>Agua Cruda</SectionTitle>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                {renderNumericInput('caudal', 'Caudal')}
                {renderNumericInput('turbidezAguaCruda', 'Turbidez')}
                {renderNumericInput('phAguaCruda', 'PH')}
                {renderNumericInput('temperatura', 'Temperatura en C°')}
            </div>
        </section>

        <Separator />

        <section className="space-y-4">
            <SectionTitle>Agua CAF</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                {renderNumericInput('turbidezAguaClarificada', 'Turbidez')}
                {renderNumericInput('phAguaClarificada', 'PH')}
                {renderNumericInput('cloro', 'Cloro')}
            </div>
        </section>
        
        <Separator />

        <section className="space-y-4">
            <SectionTitle>PAC y SODA</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 border rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold font-headline mb-4">PAC</h3>
                  <div className="space-y-4">
                    {renderNumericInput('pac.ml_min', 'ml/min')}
                    {renderNumericInput('pac.ppm', 'ppm (calculado)', true)}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-headline mb-4">SODA</h3>
                  <div className="space-y-4">
                    {renderNumericInput('soda.ml_min', 'ml/min')}
                    {renderNumericInput('soda.ppm', 'ppm (calculado)', true)}
                  </div>
                </div>
              </div>
        </section>

        <Separator />

        <section className="space-y-4">
            <SectionTitle>Módulo EBAC</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                {renderSelectInput('ebac.b1', 'B1')}
                {renderSelectInput('ebac.b2', 'B2')}
                {renderSelectInput('ebac.b3', 'B3')}
                {renderSelectInput('ebac.b4', 'B4')}
            </div>
        </section>

        <Separator />
          
        <section className="space-y-4">
            <SectionTitle>Módulo EBAP</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                {renderSelectInput('ebap.b1', 'B1')}
                {renderSelectInput('ebap.b2', 'B2')}
                {renderSelectInput('ebap.b3', 'B3')}
                {renderSelectInput('ebap.b4', 'B4')}
            </div>
        </section>

        <Separator />

        <section className="space-y-6">
            <SectionTitle>Módulo Filtros</SectionTitle>
            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold font-headline mb-2">Módulo A</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {renderSelectInput('filtros.f1', 'Filtro 1')}
                    {renderSelectInput('filtros.f2', 'Filtro 2')}
                    {renderSelectInput('filtros.f3', 'Filtro 3')}
                    {renderSelectInput('filtros.f4', 'Filtro 4')}
                </div>
            </div>
             <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold font-headline mb-2">Módulo B</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {renderSelectInput('filtros.f5', 'Filtro 5')}
                    {renderSelectInput('filtros.f6', 'Filtro 6')}
                    {renderSelectInput('filtros.f7', 'Filtro 7')}
                    {renderSelectInput('filtros.f8', 'Filtro 8')}
                </div>
            </div>
        </section>
          
        <Separator />

        <section className="space-y-4">
            <SectionTitle>Observaciones</SectionTitle>
            <div className="p-4 border rounded-lg">
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
            </div>
        </section>


        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
             {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Guardar Datos
          </Button>
        </div>
      </form>
    </Form>
  );
}

    