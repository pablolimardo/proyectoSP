import type { PlantRecord } from './types';
import { db, admin } from './firebase';

const RECORDS_COLLECTION = 'registros_planta';

// This function should only be called from server-side code.
export async function getRecords(filterDate?: Date): Promise<PlantRecord[]> {
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

// This function should only be called from server-side code.
export async function getRecordById(id: string): Promise<PlantRecord | null> {
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

// This function should only be called from server-side code.
export async function addRecord(record: Omit<PlantRecord, 'id'>): Promise<void> {
    const recordWithFirestoreTimestamp = {
        ...record,
        timestamp: admin.firestore.Timestamp.fromDate(record.timestamp),
    };
    await db.collection(RECORDS_COLLECTION).add(recordWithFirestoreTimestamp);
}
