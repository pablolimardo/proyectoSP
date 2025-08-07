import type { PlantRecord } from './types';
import { db } from './firebase';

const RECORDS_COLLECTION = 'plant-records';

const sampleRecords: Omit<PlantRecord, 'id'>[] = [
    {
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

// Function to seed the database with initial data
async function seedDatabase() {
    const recordsCollection = db.collection(RECORDS_COLLECTION);
    const snapshot = await recordsCollection.limit(1).get();
    
    if (snapshot.empty) {
        console.log('No records found, seeding database...');
        const batch = db.batch();
        sampleRecords.forEach(record => {
            const docRef = recordsCollection.doc();
            batch.set(docRef, record);
        });
        await batch.commit();
        console.log('Database seeded successfully.');
    }
}

// Seed the database on startup
seedDatabase().catch(console.error);


export async function getRecords(filterDate?: Date): Promise<PlantRecord[]> {
  console.log('Fetching records from Firestore...', { filterDate });
  let query: FirebaseFirestore.Query = db.collection(RECORDS_COLLECTION).orderBy('timestamp', 'desc');

  if (filterDate) {
    const startOfDay = new Date(filterDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(filterDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    query = query.where('timestamp', '>=', startOfDay).where('timestamp', '<=', endOfDay);
  }
  
  const snapshot = await query.get();
  
  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Firestore Timestamp to JS Date
      timestamp: data.timestamp.toDate(),
    } as PlantRecord;
  });
}

export async function getRecordById(id: string): Promise<PlantRecord | null> {
    console.log(`Fetching record with id: ${id} from Firestore`);
    const docRef = db.collection(RECORDS_COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return null;
    }

    const data = doc.data()!;
    return {
      id: doc.id,
      ...data,
      timestamp: data.timestamp.toDate(),
    } as PlantRecord;
}

export async function addRecord(record: Omit<PlantRecord, 'id'>): Promise<void> {
    console.log('Adding new record to Firestore...');
    await db.collection(RECORDS_COLLECTION).add(record);
}
