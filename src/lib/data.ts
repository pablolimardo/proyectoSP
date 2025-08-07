import type { PlantRecord } from './types';

const MOCK_DATA: PlantRecord[] = [
    {
        id: '1',
        fecha: '2023-10-27',
        hora: '10:00',
        nombreOperador: 'Juan Pérez',
        timestamp: new Date('2023-10-27T10:00:00'),
        caudal: 120,
        turbidezAguaCruda: 5.5,
        phAguaCruda: 7.2,
        temperatura: 22,
        turbidezAguaClarificada: 0.8,
        phAguaClarificada: 7.5,
        cloro: 1.2,
        pac: { ml_min: 15, ppm: 30 },
        soda: { ml_min: 5, ppm: 10 },
        ebap: { hs: 2.1, b1: 'Marcha', b2: 'Marcha', b3: 'Detenido', b4: 'Marcha' },
        ebac: { hs: 2.0, b1: 'Marcha', b2: 'Marcha', b3: 'Marcha', b4: 'Purgado' },
        filtros: { f1: 'Marcha', f2: 'Lavado', f3: 'Marcha', f4: 'Fuera de Servicio' },
        observaciones: 'Operación normal.'
    },
    {
        id: '2',
        fecha: '2023-10-27',
        hora: '14:00',
        nombreOperador: 'Maria Garcia',
        timestamp: new Date('2023-10-27T14:00:00'),
        caudal: 118,
        turbidezAguaCruda: 5.8,
        phAguaCruda: 7.1,
        temperatura: 23,
        turbidezAguaClarificada: 0.9,
        phAguaClarificada: 7.4,
        cloro: 1.3,
        pac: { ml_min: 16, ppm: 32 },
        soda: { ml_min: 5.2, ppm: 10.4 },
        ebap: { hs: 2.2, b1: 'Marcha', b2: 'Marcha', b3: 'Marcha', b4: 'Marcha' },
        ebac: { hs: 2.1, b1: 'Marcha', b2: 'Marcha', b3: 'Marcha', b4: 'Marcha' },
        filtros: { f1: 'Marcha', f2: 'Marcha', f3: 'Marcha', f4: 'Marcha' },
        observaciones: 'Se realizó retrolavado en filtro 2.'
    }
];

// This function simulates fetching all records.
// In a real app, you would query Firestore and filter by date.
export async function getRecords(filterDate?: Date): Promise<PlantRecord[]> {
  console.log('Fetching records...', { filterDate });
  // In a real app, you would connect to Firestore here.
  // For now, we return mock data.
  if (filterDate) {
    const formattedFilterDate = filterDate.toISOString().split('T')[0];
    return MOCK_DATA.filter(record => record.fecha === formattedFilterDate);
  }
  return MOCK_DATA;
}

// This function simulates fetching a single record by its ID.
export async function getRecordById(id: string): Promise<PlantRecord | null> {
    console.log(`Fetching record with id: ${id}`);
    const record = MOCK_DATA.find(r => r.id === id);
    return record || null;
}
