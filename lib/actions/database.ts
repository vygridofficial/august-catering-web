'use server';

import { db, admin } from '@/lib/firebase';
import { verifyAdminSession } from '@/lib/session';
import webpush from 'web-push';

const BOOKING_STATUSES = ['booking_request', 'contacted', 'confirmed', 'closed'] as const;

type NotificationType = 'booking' | 'enquiry';

interface CreateNotificationInput {
  type: NotificationType;
  sourceId: string;
  data?: any;
}

interface SendExternalAlertInput {
  type: NotificationType;
  sourceId: string;
  data?: any;
}

function isBookingLike(data: any) {
  return Boolean(
    data?.eventType ||
    data?.date ||
    data?.eventDate ||
    data?.guests ||
    data?.venue ||
    data?.menuPreference
  );
}

function resolveSubmissionStatus(data: any) {
  const requestedStatus = data?.status;
  if (BOOKING_STATUSES.includes(requestedStatus)) {
    return requestedStatus;
  }
  return 'new';
}

function resolveSubmissionKind(data: any) {
  const explicitKind = data?.kind;
  if (explicitKind === 'booking' || explicitKind === 'enquiry') {
    return explicitKind;
  }
  return isBookingLike(data) ? 'booking' : 'enquiry';
}

async function createNotification({ type, sourceId, data }: CreateNotificationInput) {
  const name = String(data?.name || 'New lead').trim();
  const phone = String(data?.phone || '').trim();
  const eventType = String(data?.eventType || '').trim();

  const title = type === 'booking' ? 'New booking request' : 'New enquiry received';
  const description = type === 'booking'
    ? `${name}${eventType ? ` • ${eventType}` : ''}${phone ? ` • ${phone}` : ''}`
    : `${name}${phone ? ` • ${phone}` : ''}`;

  await db.collection('notifications').add({
    type,
    sourceId,
    title,
    description,
    target: type === 'booking' ? '/admin/bookings' : '/admin/enquiries',
    isRead: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

function buildAlertMessage({ type, sourceId, data }: SendExternalAlertInput) {
  const label = type === 'booking' ? 'NEW BOOKING REQUEST' : 'NEW ENQUIRY';
  const name = String(data?.name || 'N/A');
  const phone = String(data?.phone || 'N/A');
  const email = String(data?.email || 'N/A');
  const eventType = String(data?.eventType || 'N/A');
  const date = String(data?.date || data?.eventDate || 'N/A');
  const guests = String(data?.guests || 'N/A');
  const venue = String(data?.venue || 'N/A');
  const message = String(data?.message || '').trim();

  const lines = [
    `Gateway Kitchen: ${label}`,
    `ID: ${sourceId}`,
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
  ];

  if (type === 'booking') {
    lines.push(`Event: ${eventType}`);
    lines.push(`Date: ${date}`);
    lines.push(`Guests: ${guests}`);
    lines.push(`Venue: ${venue}`);
  }

  if (message) {
    lines.push(`Message: ${message}`);
  }

  return lines.join('\n');
}

function truncateMessage(message: string, maxLength = 3500) {
  if (message.length <= maxLength) return message;
  return `${message.slice(0, maxLength - 3)}...`;
}

async function sendWhatsAppAlert(message: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipient = process.env.WHATSAPP_TO_NUMBER;
  if (!token || !phoneNumberId || !recipient) return;

  const endpoint = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;
  await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: recipient,
      type: 'text',
      text: {
        preview_url: false,
        body: truncateMessage(message),
      },
    }),
  });
}

async function sendWebhookAlert(payload: Record<string, any>) {
  const webhookUrl = process.env.ADMIN_ALERT_WEBHOOK_URL;
  if (!webhookUrl) return;

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

let webPushConfigured = false;

function ensureWebPushConfigured() {
  if (webPushConfigured) return true;

  const subject = process.env.VAPID_SUBJECT;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!subject || !publicKey || !privateKey) {
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  webPushConfigured = true;
  return true;
}

async function sendWebPushAlert(payload: Record<string, any>) {
  if (!ensureWebPushConfigured()) return;

  const subscriptions = await db.collection('pushSubscriptions').get();
  if (subscriptions.empty) return;

  const message = JSON.stringify({
    title: payload.type === 'booking' ? 'New booking request' : 'New enquiry received',
    body: payload.message,
    target: payload.type === 'booking' ? '/admin/bookings' : '/admin/enquiries',
    sourceId: payload.sourceId,
    createdAt: payload.createdAt,
  });

  await Promise.allSettled(
    subscriptions.docs.map(async (doc) => {
      const subscription = doc.data()?.subscription;
      if (!subscription) return;

      try {
        await webpush.sendNotification(subscription, message);
      } catch (error: any) {
        const statusCode = error?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await doc.ref.delete();
        } else {
          console.error('Web push send failed:', error);
        }
      }
    })
  );
}

async function sendExternalAdminAlert(input: SendExternalAlertInput) {
  const message = buildAlertMessage(input);
  const payload = {
    app: 'gatewaykitchen-web',
    type: input.type,
    sourceId: input.sourceId,
    message,
    data: input.data || {},
    createdAt: new Date().toISOString(),
  };

  await Promise.allSettled([
    sendWhatsAppAlert(message),
    sendWebhookAlert(payload),
    sendWebPushAlert(payload),
  ]);
}

/**
 * GALLERY ACTIONS
 */
export async function getGalleryItems(limitCount = 8) {
  try {
    const snapshot = await db.collection('gallery')
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
      .get();
      
    return snapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || null,
      };
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
}

export async function addGalleryItem(url: string, alt?: string, type: 'image' | 'video' = 'image') {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    const docRef = await db.collection('gallery').add({
      url,
      alt: alt || '',
      type,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding gallery item:', error);
    return { success: false, error: 'Failed to add media' };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    await db.collection('gallery').doc(id).delete();
    return { success: true };
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return { success: false, error: 'Delete failed' };
  }
}

/**
 * ENQUIRY ACTIONS
 */
export async function submitEnquiry(data: any) {
  try {
    const status = resolveSubmissionStatus(data);
    const kind = resolveSubmissionKind(data);
    const docRef = await db.collection('enquiries').add({
      ...data,
      status,
      kind,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await createNotification({
      type: kind === 'booking' ? 'booking' : 'enquiry',
      sourceId: docRef.id,
      data,
    });

    await sendExternalAdminAlert({
      type: kind === 'booking' ? 'booking' : 'enquiry',
      sourceId: docRef.id,
      data,
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    return { success: false, error: 'Submission failed' };
  }
}

export async function submitBookingRequest(data: any) {
  return submitEnquiry({
    ...data,
    kind: 'booking',
    status: 'booking_request',
  });
}

export async function getEnquiries() {
  try {
    const snapshot = await db.collection('enquiries')
      .orderBy('createdAt', 'desc')
      .get();
      
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || null,
      };
    }).filter((item: any) => {
      if (item.kind === 'booking') return false;
      if (BOOKING_STATUSES.includes(item.status)) return false;
      if (item.status === 'new' && isBookingLike(item)) return false;
      if (!item.status && isBookingLike(item)) return false;
      return true;
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return [];
  }
}

export async function deleteEnquiry(id: string) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    await db.collection('enquiries').doc(id).delete();
    return { success: true };
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return { success: false, error: 'Delete failed' };
  }
}

export async function getBookings() {
  try {
    const snapshot = await db.collection('enquiries')
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data() as any;
      const status = BOOKING_STATUSES.includes(data.status)
        ? data.status
        : isBookingLike(data)
          ? 'booking_request'
          : 'new';

      return {
        id: doc.id,
        ...data,
        status,
        createdAt: data.createdAt?.toMillis() || null,
      };
    }).filter(item => BOOKING_STATUSES.includes(item.status));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

export async function updateBookingStatus(id: string, status: 'booking_request' | 'contacted' | 'confirmed' | 'closed') {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    await db.collection('enquiries').doc(id).update({ status });
    return { success: true };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { success: false, error: 'Update failed' };
  }
}

/**
 * NOTIFICATION ACTIONS
 */
export async function getNotifications(limitCount = 30) {
  try {
    if (!(await verifyAdminSession())) return [];
    const snapshot = await db.collection('notifications')
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data() as any;
      return {
        id: doc.id,
        ...data,
        isRead: Boolean(data.isRead),
        createdAt: data.createdAt?.toMillis() || null,
      };
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

export async function getUnreadNotificationCount() {
  try {
    if (!(await verifyAdminSession())) return 0;
    const snapshot = await db.collection('notifications')
      .where('isRead', '==', false)
      .count()
      .get();

    return snapshot.data().count;
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    return 0;
  }
}

export async function markNotificationRead(id: string) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    await db.collection('notifications').doc(id).update({ isRead: true });
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: 'Update failed' };
  }
}

export async function markAllNotificationsRead() {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };

    const unread = await db.collection('notifications').where('isRead', '==', false).get();
    if (unread.empty) return { success: true };

    const batch = db.batch();
    unread.docs.forEach((doc) => {
      batch.update(doc.ref, { isRead: true });
    });
    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error: 'Update failed' };
  }
}

/**
 * MENU ACTIONS
 */
export async function getMenuItems() {
  try {
    const snapshot = await db.collection('menu')
      .orderBy('createdAt', 'desc')
      .get();
      
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || null,
      };
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return [];
  }
}

export async function addMenuItem(data: any) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    const docRef = await db.collection('menu').add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding menu item:', error);
    return { success: false, error: 'Add failed' };
  }
}

export async function deleteMenuItem(id: string) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    await db.collection('menu').doc(id).delete();
    return { success: true };
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return { success: false, error: 'Delete failed' };
  }
}

/**
 * DASHBOARD STATS
 */
export async function getDashboardStats() {
  try {
    const [enquiriesSnapshot, menu] = await Promise.all([
      db.collection('enquiries').get(),
      db.collection('menu').count().get(),
    ]);

    let newBookings = 0;
    let totalBookings = 0;
    let newEnquiries = 0;

    enquiriesSnapshot.docs.forEach((doc) => {
      const data = doc.data() as any;
      const status = BOOKING_STATUSES.includes(data.status)
        ? data.status
        : isBookingLike(data)
          ? 'booking_request'
          : 'new';

      if (BOOKING_STATUSES.includes(status)) {
        totalBookings += 1;
        if (status === 'booking_request') {
          newBookings += 1;
        }
        return;
      }

      if (status === 'new') {
        newEnquiries += 1;
      }
    });

    return {
      newBookings,
      totalBookings,
      newEnquiries,
      menuItems: menu.data().count,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { newBookings: 0, totalBookings: 0, newEnquiries: 0, menuItems: 0 };
  }
}

export async function getRecentActivity(limitCount = 5) {
  try {
    const snapshot = await db.collection('enquiries')
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
      .get();
      
    return snapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || null,
      };
    }).filter((item: any) => {
      if (BOOKING_STATUSES.includes(item.status)) return false;
      if (item.status === 'new' && isBookingLike(item)) return false;
      if (!item.status && isBookingLike(item)) return false;
      return true;
    }).slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

/**
 * SERVICES / EVENTS CMS
 */
export async function getServices() {
  try {
    const snapshot = await db.collection('services').orderBy('createdAt', 'asc').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        isActive: data.isActive !== false,
        createdAt: data.createdAt ? data.createdAt.toMillis() : null,
      };
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function addService(data: { 
  title: string; 
  description: string; 
  style: string; 
  color: string; 
}) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    const res = await db.collection('services').add({
      ...data,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, id: res.id };
  } catch (error) {
    console.error('Error adding service:', error);
    return { success: false, error: 'Add failed' };
  }
}

export async function updateServiceStatus(id: string, isActive: boolean) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    await db.collection('services').doc(id).update({ isActive });
    return { success: true };
  } catch (error) {
    console.error('Error updating service status:', error);
    return { success: false, error: 'Update failed' };
  }
}

export async function deleteService(id: string) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    await db.collection('services').doc(id).delete();
    return { success: true };
  } catch (error) {
    console.error('Error deleting service:', error);
    return { success: false, error: 'Delete failed' };
  }
}

/**
 * EVENT TYPES ACTIONS (for dynamic booking/display)
 */
export async function getEventTypes(includeInactive = false) {
  try {
    let query = db.collection('event_types').orderBy('createdAt', 'asc');
    const snapshot = await query.get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        key: data.id || null,
        isActive: data.isActive !== false,
        createdAt: data.createdAt?.toMillis() || null,
      };
    }).filter(item => includeInactive || item.isActive);
  } catch (error) {
    console.error('Error fetching event types:', error);
    return [];
  }
}

export async function addEventType(data: any) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    const res = await db.collection('event_types').add({
      ...data,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, id: res.id };
  } catch (error) {
    console.error('Error adding event type:', error);
    return { success: false, error: 'Add failed' };
  }
}

export async function updateEventTypeStatus(id: string, isActive: boolean) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };

    const directRef = db.collection('event_types').doc(id);
    const directSnap = await directRef.get();

    if (directSnap.exists) {
      await directRef.update({ isActive });
      return { success: true };
    }

    // Legacy support: some items may pass a key like "wedding" instead of document id.
    const keySnapshot = await db.collection('event_types').where('id', '==', id).limit(1).get();
    if (!keySnapshot.empty) {
      await keySnapshot.docs[0].ref.update({ isActive });
      return { success: true };
    }

    return { success: false, error: 'Event type not found' };
  } catch (error) {
    console.error('Error updating event type status:', error);
    return { success: false, error: 'Update failed' };
  }
}

export async function deleteEventType(id: string) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };

    const directRef = db.collection('event_types').doc(id);
    const directSnap = await directRef.get();
    if (directSnap.exists) {
      await directRef.delete();
      return { success: true };
    }

    const keySnapshot = await db.collection('event_types').where('id', '==', id).limit(1).get();
    if (!keySnapshot.empty) {
      await keySnapshot.docs[0].ref.delete();
      return { success: true };
    }

    return { success: false, error: 'Event type not found' };
  } catch (error) {
    console.error('Error deleting event type:', error);
    return { success: false, error: 'Delete failed' };
  }
}

/**
 * FILE UPLOAD via Cloudinary (Free — 25GB storage, 25GB/mo bandwidth)
 * Sign up at https://cloudinary.com — get cloud_name, api_key, api_secret
 */
export async function uploadImage(formData: FormData) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    const file = formData.get('file') as File;
    if (!file) return { success: false, error: 'No file provided' };

    const { v2: cloudinary } = await import('cloudinary');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const isVideo = file.type.startsWith('video/');
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'gatewaykitchen',
          resource_type: isVideo ? 'video' : 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    return {
      success: true,
      url: result.secure_url,
      type: isVideo ? 'video' : 'image',
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return { success: false, error: 'Upload failed. Check Cloudinary credentials in .env' };
  }
}


/**
 * HERO IMAGES ACTIONS
 */
export async function getHeroImages() {
  try {
    const snapshot = await db.collection('hero_images')
      .orderBy('createdAt', 'desc')
      .get();
      
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        url: data.url,
        alt: data.alt,
        isActive: data.isActive !== false,
        createdAt: data.createdAt?.toMillis() || null,
      };
    });
  } catch (error) {
    console.error('Error fetching hero images:', error);
    return [];
  }
}

export async function addHeroImage(url: string, alt?: string) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    const docRef = await db.collection('hero_images').add({
      url,
      alt: alt || '',
      isActive: true, // New images active by default
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding hero item:', error);
    return { success: false, error: 'Failed to add image' };
  }
}

export async function updateHeroImageStatus(id: string, isActive: boolean) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    await db.collection('hero_images').doc(id).update({ isActive });
    return { success: true };
  } catch (error) {
    console.error('Error updating hero status:', error);
    return { success: false, error: 'Update failed' };
  }
}

export async function deleteHeroImage(id: string) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    await db.collection('hero_images').doc(id).delete();
    return { success: true };
  } catch (error) {
    console.error('Error deleting hero item:', error);
    return { success: false, error: 'Delete failed' };
  }
}

/**
 * CLIENT REVIEWS (TESTIMONIALS) ACTIONS
 */
export async function submitReview(data: { name: string; role: string; text: string; rating?: number }) {
  try {
    const docRef = await db.collection('reviews').add({
      ...data,
      rating: typeof data.rating === 'number' ? data.rating : 5,
      approved: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, error: 'Submission failed' };
  }
}

export async function getReviews(onlyApproved = true) {
  try {
    // Only order by createdAt in Firestore to avoid composite index requirements
    const query: admin.firestore.Query = db.collection('reviews').orderBy('createdAt', 'desc');
    
    const snapshot = await query.get();
      
    let reviews = snapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || null,
      };
    });

    if (onlyApproved) {
      reviews = reviews.filter((rev: any) => rev.approved === true);
    }

    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export async function approveReview(id: string) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    await db.collection('reviews').doc(id).update({ approved: true });
    return { success: true };
  } catch (error) {
    console.error('Error approving review:', error);
    return { success: false, error: 'Approval failed' };
  }
}

export async function deleteReview(id: string) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    await db.collection('reviews').doc(id).delete();
    return { success: true };
  } catch (error) {
    console.error('Error deleting review:', error);
    return { success: false, error: 'Delete failed' };
  }
}
/**
 * CULINARY STYLES ACTIONS
 */
export async function getCulinaryStyles(includeInactive = false) {
  try {
    let query = db.collection('culinary_styles').orderBy('createdAt', 'asc');
    const snapshot = await query.get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        isActive: data.isActive !== false,
        createdAt: data.createdAt?.toMillis() || null,
      };
    }).filter(item => includeInactive || item.isActive);
  } catch (error) {
    console.error('Error fetching culinary styles:', error);
    return [];
  }
}

export async function addCulinaryStyle(data: { label: string; description: string; icon: string; contents: string[] }) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    const res = await db.collection('culinary_styles').add({
      ...data,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, id: res.id };
  } catch (error) {
    console.error('Error adding culinary style:', error);
    return { success: false, error: 'Add failed' };
  }
}

export async function updateCulinaryStyleStatus(id: string, isActive: boolean) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    await db.collection('culinary_styles').doc(id).update({ isActive });
    return { success: true };
  } catch (error) {
    console.error('Error updating culinary style status:', error);
    return { success: false, error: 'Update failed' };
  }
}

export async function deleteCulinaryStyle(id: string) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    await db.collection('culinary_styles').doc(id).delete();
    return { success: true };
  } catch (error) {
    console.error('Error deleting culinary style:', error);
    return { success: false, error: 'Delete failed' };
  }
}
/**
 * SOCIAL & CONTACT SETTINGS
 */
export async function getSocialSettings() {
  try {
    const doc = await db.collection('settings').doc('social').get();
    if (!doc.exists) {
      // Default fallbacks matching SocialSidebar.tsx
      return {
        whatsapp: '919495184661',
        phone: '+919495184661',
        instagram: 'https://www.instagram.com/gatewaykitchen/',
        facebook: 'https://www.facebook.com/gatewaykitchen/',
        email: 'info@gatewaykitchen.in',
        location: 'https://www.google.com/maps/search/?api=1&query=Gateway+Kitchen+Caterers+Thiruvaniyoor'
      };
    }
    const data = doc.data();
    if (data && data.updatedAt && typeof data.updatedAt.toMillis === 'function') {
      data.updatedAt = data.updatedAt.toMillis();
    }
    return data;
  } catch (error) {
    console.error('Error fetching social settings:', error);
    return null;
  }
}

export async function updateSocialSettings(data: any) {
  try {
    if (!(await verifyAdminSession())) return { success: false, error: 'Unauthorized' };
    await db.collection('settings').doc('social').set({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error updating social settings:', error);
    return { success: false, error: 'Update failed' };
  }
}
