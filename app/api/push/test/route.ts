import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { db } from '@/lib/firebase';
import { verifyAdminSession } from '@/lib/session';

let configured = false;

function ensureConfigured() {
  if (configured) return true;

  const subject = process.env.VAPID_SUBJECT;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!subject || !publicKey || !privateKey) {
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
  return true;
}

export async function POST() {
  try {
    if (!(await verifyAdminSession())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!ensureConfigured()) {
      return NextResponse.json(
        { error: 'VAPID keys are missing or invalid.' },
        { status: 400 }
      );
    }

    const subscriptions = await db.collection('pushSubscriptions').get();
    if (subscriptions.empty) {
      return NextResponse.json(
        { error: 'No subscribed admin devices found.' },
        { status: 400 }
      );
    }

    const payload = JSON.stringify({
      title: 'August Catering Admin',
      body: 'Test notification from admin panel.',
      target: '/admin/notifications',
      sourceId: 'test',
      createdAt: new Date().toISOString(),
    });

    await Promise.allSettled(
      subscriptions.docs.map(async (doc) => {
        const subscription = doc.data()?.subscription;
        if (!subscription) return;

        try {
          await webpush.sendNotification(subscription, payload);
        } catch (error: unknown) {
          const statusCode =
            typeof error === 'object' && error !== null && 'statusCode' in error
              ? Number((error as { statusCode?: number }).statusCode)
              : undefined;
          if (statusCode === 404 || statusCode === 410) {
            await doc.ref.delete();
          }
        }
      })
    );

    return NextResponse.json({ success: true, message: 'Test notification dispatched.' });
  } catch (error) {
    console.error('Error sending test push notification:', error);
    return NextResponse.json({ error: 'Failed to send test notification.' }, { status: 500 });
  }
}
