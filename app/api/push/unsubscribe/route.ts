import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyAdminSession } from '@/lib/session';

function getSubscriptionDocId(endpoint: string) {
  return Buffer.from(endpoint).toString('base64url');
}

export async function POST(request: Request) {
  try {
    if (!(await verifyAdminSession())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { endpoint } = await request.json();
    if (!endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    await db.collection('pushSubscriptions').doc(getSubscriptionDocId(endpoint)).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing push subscription:', error);
    return NextResponse.json({ error: 'Failed to remove subscription' }, { status: 500 });
  }
}