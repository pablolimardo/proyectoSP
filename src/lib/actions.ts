'use server';

import { revalidatePath } from 'next/cache';
import { recordSchema, type RecordSchema } from './types';
import { addRecord } from './data';

export async function saveRecord(data: RecordSchema) {
  const validation = recordSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, revise los campos.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const newRecord = {
      timestamp: new Date(),
      ...validation.data,
    };
    
    await addRecord(newRecord);
    console.log('Record saved to Firestore:', newRecord);
    
    revalidatePath('/historial');

    return {
      success: true,
      message: 'Datos guardados correctamente.',
    };
  } catch (error) {
    console.error('Error saving record to Firestore:', error);
    return {
      success: false,
      message: 'Ocurrió un error al guardar los datos.',
    };
  }
}
