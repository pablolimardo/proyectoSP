'use server';

import { revalidatePath } from 'next/cache';
import { recordSchema, type RecordSchema } from './types';

// This is a mock database. In a real application, you would use Firebase Firestore.
// Example: import { db } from './firebase';
const MOCK_DB = {
  records: [],
};

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
      id: new Date().getTime().toString(),
      timestamp: new Date(),
      ...validation.data,
    };
    
    // In a real application, you would save this to Firestore.
    // e.g., await db.collection('registros_planta').add(newRecord);
    // @ts-ignore
    MOCK_DB.records.push(newRecord);

    console.log('Record saved:', newRecord);
    
    // Revalidate the history page to show the new record
    revalidatePath('/historial');

    return {
      success: true,
      message: 'Datos guardados correctamente.',
    };
  } catch (error) {
    console.error('Error saving record:', error);
    return {
      success: false,
      message: 'Ocurrió un error al guardar los datos.',
    };
  }
}
