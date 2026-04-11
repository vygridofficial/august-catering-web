import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CircularCarousel } from '@/components/CircularCarousel';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

const FALLBACK_SERVICES = [
  {
    id: '1',
    title: 'Wedding Receptions',
    subtitle: 'Grand Celebrations',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
    price: 'Starting at ₹1,50,000'
  },
  {
    id: '2',
    title: 'Corporate Galas',
    subtitle: 'Professional Dining',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
    price: 'Custom Pricing'
  },
  {
    id: '3',
    title: 'Private Omakase',
    subtitle: 'Exclusive Experience',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800',
    price: 'Starting at ₹25,000'
  }
];

const SERVICE_IMAGES = [
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
];

async function getLiveServices() {
  try {
    const snapshot = await db.collection('services').orderBy('createdAt', 'asc').get();
    const services = snapshot.docs
      .map(doc => {
        const data = doc.data() as {
          title?: string;
          style?: string;
          isActive?: boolean;
        };
        return {
          id: doc.id,
          title: data.title || 'Service',
          subtitle: data.style || 'Signature Service',
          isActive: data.isActive !== false,
        };
      })
      .filter(item => item.isActive)
      .map((item, index) => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        image: SERVICE_IMAGES[index % SERVICE_IMAGES.length],
      }));

    return services.length > 0 ? services : FALLBACK_SERVICES;
  } catch (error) {
    console.error('Error loading services page data:', error);
    return FALLBACK_SERVICES;
  }
}

export default async function ServicesPage() {
  const cateringServices = await getLiveServices();

  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <Header />
      
      <section className="pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-14 sm:pb-20 px-4 sm:px-6 container mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h1 className="text-6xl md:text-8xl font-heading font-extrabold tracking-tighter mb-6">
            Curated <span className="text-primary">Experiences</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 font-light">
            From intimate gatherings to grand celebrations, we engineer perfection onto every plate.
          </p>
        </div>

        <div className="w-full mt-4 md:mt-0 lg:-mt-20">
          <CircularCarousel items={cateringServices} />
        </div>

        <div className="max-w-5xl mx-auto mt-12 md:mt-16 rounded-[2rem] border border-border bg-secondary/20 backdrop-blur-sm p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="text-lg sm:text-xl font-heading font-bold">Services Overview</h2>
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/50">{cateringServices.length} total</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cateringServices.map((service, idx) => (
              <div key={service.id} className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mb-1">
                  {String(idx + 1).padStart(2, '0')}
                </p>
                <p className="font-semibold text-base leading-tight">{service.title}</p>
                <p className="text-sm text-foreground/60 mt-1">{service.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
