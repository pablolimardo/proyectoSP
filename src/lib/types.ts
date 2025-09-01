import { z } from 'zod';

const statusEnum = z.enum(["Marcha", "Detenido", "Lavado", "Purgado", "Local", "Remoto", "Fuera de Servicio"]);

export const recordSchema = z.object({
  fecha: z.string().min(1, 'La fecha es requerida.'),
  hora: z.string().min(1, 'La hora es requerida.'),
  nombreOperador: z.string().min(3, 'El nombre del operador es requerido.'),
  caudal: z.coerce.number({invalid_type_error: 'Debe ser un número'}).min(0, 'El caudal debe ser un número positivo.'),
  
  turbidezAguaCruda: z.coerce.number({invalid_type_error: 'Debe ser un número'}),
  phAguaCruda: z.coerce.number({invalid_type_error: 'Debe ser un número'}),
  temperatura: z.coerce.number({invalid_type_error: 'Debe ser un número'}),
  
  turbidezAguaClarificada: z.coerce.number({invalid_type_error: 'Debe ser un número'}),
  phAguaClarificada: z.coerce.number({invalid_type_error: 'Debe ser un número'}),
  
  cloro: z.coerce.number({invalid_type_error: 'Debe ser un número'}),
  pac: z.object({
    ml_min: z.coerce.number({invalid_type_error: 'Debe ser un número'}),
    ppm: z.coerce.number().optional(),
  }),
  soda: z.object({
    ml_min: z.coerce.number({invalid_type_error: 'Debe ser un número'}),
    ppm: z.coerce.number().optional(),
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

export interface FlatPlantRecord {
  id: number;
  fecha: string;
  hora: string;
  nombreOperador: string;
  caudal: number;
  turbidezAguaCruda?: number;
  phAguaCruda?: number;
  temperatura?: number;
  turbidezAguaClarificada?: number;
  phAguaClarificada?: number;
  cloro?: number;
  pac_ml_min?: number;
  pac_ppm?: number;
  soda_ml_min?: number;
  soda_ppm?: number;
  ebap_b1?: string;
  ebap_b2?: string;
  ebap_b3?: string;
  ebap_b4?: string;
  ebac_b1?: string;
  ebac_b2?: string;
  ebac_b3?: string;
  ebac_b4?: string;
  filtros_f1?: string;
  filtros_f2?: string;
  filtros_f3?: string;
  filtros_f4?: string;
  filtros_f5?: string;
  filtros_f6?: string;
  filtros_f7?: string;
  filtros_f8?: string;
  observaciones?: string;
  timestamp: Date;
}