import { db } from '@/lib/firebase';
import { ServicesPageClient } from '@/components/ServicesPageClient';

export const dynamic = 'force-dynamic';

const FALLBACK_SERVICES = [
  {
    id: '1',
    title: 'Wedding Orchestration',
    subtitle: 'Grand Culinary Theatre',
    description: 'We orchestrate awe-inspiring weddings that reflect your unique love story. From an elegant multi-course dinner to dramatic live culinary stations, our bespoke menus are designed to leave a lasting impression on your guests.',
    image: '/1.webp',
  },
  {
    id: '2',
    title: 'Corporate Galas',
    subtitle: 'Executive Dining Experiences',
    description: 'Elevate your brand with sophisticated catering designed for high-profile business events. Whether launching a product or celebrating a milestone, we provide seamless, white-glove service that aligns with your corporate standards.',
    image: '/2.webp',
  },
  {
    id: '3',
    title: 'Private Omakase',
    subtitle: 'Intimate Masterclasses',
    description: 'An exclusive, immersive dining experience within the comfort of your own venue. Watch our master chefs craft exquisite tasting menus right before your eyes, pairing each course with curated wine and spirits.',
    image: '/3.webp',
  }
];

const SERVICE_IMAGES = [
  '/1.webp',
  '/2.webp',
  '/3.webp',
];

export default async function ServicesPage() {
  let cateringServices = [];

  try {
    const snapshot = await db.collection('services').orderBy('createdAt', 'asc').get();
    cateringServices = snapshot.docs
      .map((doc, index) => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          title: data.title || 'Service',
          subtitle: data.style || 'Signature Service',
          description: data.description || 'Exclusive culinary experience tailored to perfection.',
          isActive: data.isActive !== false,
          image: data.image || data.url || SERVICE_IMAGES[index % SERVICE_IMAGES.length],
        };
      })
      .filter(item => item.isActive);

    if (cateringServices.length === 0) {
      cateringServices = FALLBACK_SERVICES;
    }
  } catch (error) {
    console.error('Error loading services in Server Component:', error);
    cateringServices = FALLBACK_SERVICES;
  }

  return <ServicesPageClient services={cateringServices} />;
}
