import { NextResponse } from 'next/server';
import { admin, db, projectCollection } from '@/lib/firebase';
import { verifyAdminSession } from '@/lib/session';

function getSubscriptionDocId(endpoint: string) {
  return Buffer.from(endpoint).toString('base64url');
}

export async function POST(request: Request) {
  try {
    if (!(await verifyAdminSession())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subscription } = await request.json();
    if (!subscription?.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    const docId = getSubscriptionDocId(subscription.endpoint);
    await projectCollection('pushSubscriptions').doc(docId).set(
      {
        endpoint: subscription.endpoint,
        subscription,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}