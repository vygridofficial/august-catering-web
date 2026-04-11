'use client';

import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { GallerySection } from '@/components/GallerySection';
import { ChevronDown, Camera } from 'lucide-react';

export function GalleryPageClient() {
  return (
    <main className="min-h-screen bg-[#050505] text-white antialiased font-outfit selection:bg-primary selection:text-black overflow-x-hidden">
      <Header />

      {/* Cinematic Grain & Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[100px] rounded-full" />
      </div>

      {/* Narrative Hero */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
        <div className="container mx-auto px-6 text-center relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="w-12 h-px bg-primary/30" />
              <Camera size={16} className="text-primary/60" />
              <div className="w-12 h-px bg-primary/30" />
            </div>
            
            <h1 className="text-[clamp(4rem,12vw,10rem)] font-heading font-black tracking-tighter leading-[0.8] mb-12">
              VISUAL <br /> <span className="text-primary italic font-serif">IDENTITY.</span>
            </h1>
            
            <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium leading-relaxed mb-16 px-4">
              A high-precision visual repository of our most significant orchestrations. 
              From intimate plating to massive event architecture.
            </p>

            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center gap-3 text-white/10"
            >
              <span className="text-[8px] font-black uppercase tracking-[0.4em]">Manifest</span>
              <ChevronDown size={14} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Gallery Vault */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-[#050505] to-black">
        <div className="container mx-auto px-6">
          <GallerySection showHeader={false} limit={40} />
        </div>
      </section>

    </main>
  );
}
