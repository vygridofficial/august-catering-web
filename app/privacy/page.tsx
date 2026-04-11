import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'August Catering privacy policy placeholder page.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header />
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-4xl space-y-8">
          <div>
            <p className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4">Legal</p>
            <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight">Privacy Policy</h1>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              This is a placeholder privacy policy page for August Catering. It explains how basic contact details, booking requests,
              and enquiry submissions may be used to respond to your request.
            </p>
            <p>
              We only collect information that is needed to manage catering enquiries, service updates, and administrative communication.
              No sale of customer data is intended.
            </p>
            <p>
              If you want the final legal copy added, replace this placeholder with approved policy text.
            </p>
          </div>
          <Link href="/contact" className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground hover:scale-105 transition-transform">
            Contact Us
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}