'use server';

import { revalidatePath } from 'next/cache';
import { getRecordById as dbGetRecordById, getRecords as dbGetRecords } from './data';
import type { PlantRecord } from './types';


export async function getRecords(filterDate?: Date): Promise<PlantRecord[]> {
    return dbGetRecords(filterDate);
}

export async function getRecordById(id: string): Promise<PlantRecord | null> {
    try {
        const record = await dbGetRecordById(id);
        if (record) {
            revalidatePath(`/historial/${id}`);
        }
        return record;
    }
    catch (e) {
        console.error(e);
        return null;
    }
}
