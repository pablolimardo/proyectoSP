import { z } from 'zod';

export const recordSchema = z.object({
  fecha: z.string().min(1, 'La fecha es requerida.'),
  hora: z.string().min(1, 'La hora es requerida.'),
  nombreOperador: z.string().min(3, 'El nombre del operador es requerido.'),
  caudal: z.coerce.number().min(0, 'El caudal debe ser un número positivo.'),
  
  turbidezAguaCruda: z.coerce.number(),
  phAguaCruda: z.coerce.number(),
  temperatura: z.coerce.number(),
  
  turbidezAguaClarificada: z.coerce.number(),
  phAguaClarificada: z.coerce.number(),
  
  cloro: z.coerce.number(),
  pac: z.object({
    ml_min: z.coerce.number(),
    ppm: z.coerce.number(),
  }),
  soda: z.object({
    ml_min: z.coerce.number(),
    ppm: z.coerce.number(),
  }),

  ebap: z.object({
    hs: z.coerce.number(),
    b1: z.coerce.number(),
    b2: z.coerce.number(),
    b3: z.coerce.number(),
    b4: z.coerce.number(),
  }),

  ebac: z.object({
    hs: z.coerce.number(),
    b1: z.coerce.number(),
    b2: z.coerce.number(),
    b3: z.coerce.number(),
    b4: z.coerce.number(),
  }),

  filtros: z.object({
    f1: z.coerce.number(),
    f2: z.coerce.number(),
    f3: z.coerce.number(),
    f4: z.coerce.number(),
    f5: z.coerce.number(),
  }),
  
  observaciones: z.string().optional(),
});

export type RecordSchema = z.infer<typeof recordSchema>;

export interface PlantRecord extends RecordSchema {
  id: string;
  timestamp: Date;
}
