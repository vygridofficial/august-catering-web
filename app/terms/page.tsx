import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'August Catering terms of service placeholder page.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-4xl space-y-8">
          <div>
            <p className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4">Legal</p>
            <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight">Terms of Service</h1>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              This is a placeholder terms page for August Catering. It covers the basic rules for using the website and submitting
              catering enquiries.
            </p>
            <p>
              Booking estimates, menu suggestions, and enquiry responses are subject to availability and final confirmation from our team.
            </p>
            <p>
              Replace this placeholder with approved terms before launch if you need formal legal coverage.
            </p>
          </div>
          <Link href="/contact" className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground hover:scale-105 transition-transform">
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}