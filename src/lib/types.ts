import { z } from 'zod';

const statusEnum = z.enum(["Marcha", "Detenido", "Lavado", "Purgado", "Local", "Remoto", "Fuera de Servicio"]);

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
    b1: statusEnum,
    b2: statusEnum,
    b3: statusEnum,
    b4: statusEnum,
  }),

  ebac: z.object({
    b1: statusEnum,
    b2: statusEnum,
    b3: statusEnum,
    b4: statusEnum,
  }),

  filtros: z.object({
    f1: statusEnum,
    f2: statusEnum,
    f3: statusEnum,
    f4: statusEnum,
    f5: statusEnum,
    f6: statusEnum,
    f7: statusEnum,
    f8: statusEnum,
  }),
  
  observaciones: z.string().optional(),
});

export type RecordSchema = z.infer<typeof recordSchema>;

export interface PlantRecord extends RecordSchema {
  id: string;
  timestamp: Date;
}
