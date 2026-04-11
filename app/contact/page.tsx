import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Reach Gateway Kitchen for weddings, corporate events, private dining, and premium catering enquiries in Kerala.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header />
      <div className="pt-24">
        <ContactSection />
      </div>
      <Footer />
    </main>
  );
}