'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { GallerySection } from '@/components/GallerySection';
import { motion } from 'framer-motion';

export function GalleryPageClient() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      <Header />

      {/* Background Ambience */}
      <div className="fixed inset-0 bg-primary/5 blur-[150px] pointer-events-none -z-10" />

      <section className="relative z-10 pt-48 pb-20">
        <div className="container mx-auto px-6 text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-8xl font-heading font-black tracking-tight leading-[0.8] mb-8"
          >
            Visual <br /> <span className="text-primary italic">Feasts</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed"
          >
            Explore our curated showcase of unforgettable culinary experiences, 
            elegant event setups, and masterpieces our chefs craft with passion.
          </motion.p>
        </div>

        <div className="container mx-auto px-6">
          <GallerySection showHeader={false} limit={40} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
