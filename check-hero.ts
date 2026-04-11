import { db } from './lib/firebase';

async function check() {
  const snapshot = await db.collection('hero_images').get();
  console.log('Hero Images Count:', snapshot.size);
  snapshot.docs.forEach(doc => {
    console.log(doc.id, doc.data());
  });
}

check();
