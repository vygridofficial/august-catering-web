'use server';

import { db } from '@/lib/firebase';

export async function getServices() {
  try {
    const snapshot = await db.collection('services').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt ?? null,
      };
    });
  } catch (err) {
    console.error('Error fetching services:', err);
    return [];
  }
}

export async function addService(data: { 
  title: string; 
  description: string; 
  style?: string; 
  isActive: boolean 
}) {
  try {
    const doc = await db.collection('services').add({
      ...data,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: doc.id };
  } catch (err) {
    console.error('Error adding service:', err);
    return { success: false };
  }
}

export async function updateServiceStatus(id: string, isActive: boolean) {
  try {
    await db.collection('services').doc(id).update({ isActive });
    return { success: true };
  } catch (err) {
    console.error('Error updating service status:', err);
    return { success: false };
  }
}

export async function deleteService(id: string) {
  try {
    await db.collection('services').doc(id).delete();
    return { success: true };
  } catch (err) {
    console.error('Error deleting service:', err);
    return { success: false };
  }
}
