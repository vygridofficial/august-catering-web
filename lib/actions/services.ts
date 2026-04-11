'use server';

import { db, projectCollection } from '@/lib/firebase';

export async function getServices() {
  try {
    const snapshot = await projectCollection('services').get();
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
    const doc = await projectCollection('services').add({
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
    await projectCollection('services').doc(id).update({ isActive });
    return { success: true };
  } catch (err) {
    console.error('Error updating service status:', err);
    return { success: false };
  }
}

export async function deleteService(id: string) {
  try {
    await projectCollection('services').doc(id).delete();
    return { success: true };
  } catch (err) {
    console.error('Error deleting service:', err);
    return { success: false };
  }
}
