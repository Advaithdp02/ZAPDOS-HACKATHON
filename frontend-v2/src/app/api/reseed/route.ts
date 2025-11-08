import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { reseedDatabase } from '@/lib/seed-db';

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'This feature is disabled in production.' }, { status: 403 });
  }

  try {
    const client = await clientPromise;
    await reseedDatabase(client);
    return NextResponse.json({ message: 'Database reseeded successfully.' });
  } catch (error) {
    console.error('Error reseeding database:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to reseed database: ${errorMessage}` }, { status: 500 });
  }
}
