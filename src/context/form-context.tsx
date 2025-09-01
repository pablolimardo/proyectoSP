
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { RecordSchema } from '@/lib/types';

const defaultValues: RecordSchema = {
  fecha: '',
  hora: '',
  nombreOperador: '',
  caudal: NaN,
  turbidezAguaCruda: NaN,
  phAguaCruda: NaN,
  temperatura: NaN,
  turbidezAguaClarificada: NaN,
  phAguaClarificada: NaN,
  cloro: NaN,
  pac: { ml_min: 0, ppm: 0 },
  soda: { ml_min: 0, ppm: 0 },
  ebap: { b1: "Marcha", b2: "Marcha", b3: "Marcha", b4: "Marcha" },
  ebac: { b1: "Marcha", b2: "Marcha", b3: "Marcha", b4: "Marcha" },
  filtros: { f1: "Marcha", f2: "Marcha", f3: "Marcha", f4: "Marcha", f5: "Marcha", f6: "Marcha", f7: "Marcha", f8: "Marcha" },
  observaciones: '',
};

interface FormContextType {
  formData: RecordSchema;
  setFormData: React.Dispatch<React.SetStateAction<RecordSchema>>;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<RecordSchema>(() => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].substring(0, 5);
    return {
      ...defaultValues,
      fecha: date,
      hora: time,
    };
  });

  const resetForm = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].substring(0, 5);
    setFormData({
        ...defaultValues,
        fecha: date,
        hora: time
    });
  }

  return (
    <FormContext.Provider value={{ formData, setFormData, resetForm }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext_NUCLEAR() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext_NUCLEAR must be used within a FormProvider');
  }
  return context;
}
