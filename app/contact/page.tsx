import { Metadata } from 'next';
import { ContactSection } from '@/components/ContactSection';

export const metadata: Metadata = {
  title: 'Contact Us | August Catering',
  description: 'Connect with our event orchestration team. Reach August Catering for weddings, corporate events, and premium inquiries.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white antialiased font-outfit selection:bg-primary selection:text-black overflow-x-hidden">
      {/* Cinematic Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 pt-48 pb-20">
        <ContactSection />
      </div>
    </main>
  );
}