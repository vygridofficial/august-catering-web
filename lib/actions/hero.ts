'use server';

import { db } from '@/lib/firebase';

export async function getHeroImages() {
  try {
    const snapshot = await db.collection('hero_images').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt ?? null,
      };
    });
  } catch (err) {
    console.error('Error fetching hero images:', err);
    return [];
  }
}

export async function addHeroImage(url: string, alt?: string) {
  try {
    const doc = await db.collection('hero_images').add({
      url,
      alt: alt || 'August Catering Hero',
      isActive: true,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: doc.id };
  } catch (err) {
    console.error('Error adding hero image:', err);
    return { success: false };
  }
}

export async function updateHeroImageStatus(id: string, isActive: boolean) {
  try {
    await db.collection('hero_images').doc(id).update({ isActive });
    return { success: true };
  } catch (err) {
    console.error('Error updating hero image status:', err);
    return { success: false };
  }
}

export async function deleteHeroImage(id: string) {
  try {
    await db.collection('hero_images').doc(id).delete();
    return { success: true };
  } catch (err) {
    console.error('Error deleting hero image:', err);
    return { success: false };
  }
}
