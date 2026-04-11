'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

export function MagneticHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} id="hero-section" className="relative w-full h-[100svh] bg-[#050505] overflow-hidden">
      
      {/* High Quality Hero Image Background with Parallax */}
      <motion.div style={{ y: yBg }} className="absolute inset-x-0 -inset-y-[20%] z-0">
        <Image 
          src="/1.webp" 
          alt="Premium Catering Event" 
          fill 
          className="object-cover opacity-60 mix-blend-luminosity filter saturate-50"
          priority
        />
        {/* Core Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/30 via-[#050505]/40 to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_100%)] opacity-80" />
      </motion.div>

      {/* Hero Typography - Fixed visibility using Framer Motion */}
      <motion.div 
        style={{ y: yText, opacity }}
        className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center p-6"
      >
        <motion.p 
          initial={{ opacity: 0, tracking: '0em' }}
          animate={{ opacity: 1, tracking: '0.4em' }}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.2 }}
          className="text-primary text-xs sm:text-sm font-black uppercase mb-6 sm:mb-8 font-outfit"
        >
          Gastronomy Elevated
        </motion.p>

        <motion.h1 
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          className="text-[clamp(4rem,12vw,14rem)] leading-[0.8] font-heading font-black tracking-tighter text-white text-center drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
        >
          AUGUST
          <br />
          <motion.span 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.9 }}
            className="text-primary italic font-serif text-[clamp(3rem,8vw,9rem)] drop-shadow-[0_10px_30px_rgba(255,204,0,0.2)] inline-block pl-[10%]"
          >
            CATERING
          </motion.span>
        </motion.h1>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-primary text-[10px] sm:text-xs font-outfit font-bold tracking-[0.4em] uppercase z-20 flex flex-col items-center gap-6"
      >
        <span className="drop-shadow-lg">Discover</span>
        <div className="w-[1px] h-16 sm:h-20 bg-primary/20 relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 80] }} 
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            className="w-full h-1/2 bg-primary absolute top-0 shadow-[0_0_10px_rgba(255,204,0,0.8)]"
          />
        </div>
      </motion.div>
    </section>
  );
}
