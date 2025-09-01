import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { records } from '@/lib/db/schema';
import { recordSchema } from '@/lib/types';
import { sql, eq, and, gte, lte } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = recordSchema.parse(json);

    const flattenedData = {
      ...data,
      timestamp: new Date(`${data.fecha}T${data.hora}`),
      pac_ml_min: data.pac.ml_min,
      pac_ppm: data.pac.ppm,
      soda_ml_min: data.soda.ml_min,
      soda_ppm: data.soda.ppm,
      ebap_b1: data.ebap.b1,
      ebap_b2: data.ebap.b2,
      ebap_b3: data.ebap.b3,
      ebap_b4: data.ebap.b4,
      ebac_b1: data.ebac.b1,
      ebac_b2: data.ebac.b2,
      ebac_b3: data.ebac.b3,
      ebac_b4: data.ebac.b4,
      filtros_f1: data.filtros.f1,
      filtros_f2: data.filtros.f2,
      filtros_f3: data.filtros.f3,
      filtros_f4: data.filtros.f4,
      filtros_f5: data.filtros.f5,
      filtros_f6: data.filtros.f6,
      filtros_f7: data.filtros.f7,
      filtros_f8: data.filtros.f8,
    };

    // Remove nested objects that are now flattened
    delete (flattenedData as any).pac;
    delete (flattenedData as any).soda;
    delete (flattenedData as any).ebap;
    delete (flattenedData as any).ebac;
    delete (flattenedData as any).filtros;

    await db.insert(records).values(flattenedData);

    return NextResponse.json({ message: 'Record created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating record:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    let query = db.select().from(records).orderBy(sql`${records.timestamp} DESC`);

    if (date) {
      const filterDate = new Date(date);
      const startOfDay = new Date(filterDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(filterDate.setHours(23, 59, 59, 999));
      
      query = db.select().from(records)
        .where(and(
          gte(records.timestamp, startOfDay),
          lte(records.timestamp, endOfDay)
        ))
        .orderBy(sql`${records.timestamp} DESC`);
    }

    const result = await query;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching records:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}