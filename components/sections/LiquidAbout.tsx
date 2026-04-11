'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export function LiquidAbout() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform values for the cinematic image sequence
  // 0% - 15%: Image expands to fullscreen very aggressively on first scroll
  const widthStr = useTransform(scrollYProgress, [0, 0.15], ["35vw", "100vw"]);
  const heightStr = useTransform(scrollYProgress, [0, 0.15], ["60vh", "100vh"]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.15], ["3rem", "0rem"]);
  const brightness = useTransform(scrollYProgress, [0.15, 0.35], [1, 0.7]);
  const overlayOpacity = useTransform(brightness, [1, 0.7], [0, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  // Typography reveal follows right after expansion
  const textY = useTransform(scrollYProgress, [0.15, 0.35], [100, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);
  const pY = useTransform(scrollYProgress, [0.22, 0.42], [50, 0]);
  const pOpacity = useTransform(scrollYProgress, [0.22, 0.38], [0, 1]);
  
  // Floating elements
  const floatY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    // The container dictates the scroll distance (300vh means heavy scrolling needed to pass)
    <section ref={containerRef} className="relative w-full h-[300vh] bg-[#050505]">
      
      {/* Sticky wrapper stays pinned to the viewport while the parent scrolls */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center">
        
        {/* Background Ambience behind the image window */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
           <motion.div style={{ y: floatY }} className="w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full mix-blend-screen" />
        </div>

        {/* The Masking Container */}
        <motion.div 
          style={{
            width: widthStr,
            height: heightStr,
            borderRadius: borderRadius,
          }}
          className="relative z-10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex items-center justify-center will-change-transform"
        >
          {/* The Actual Image - Scales slightly for intrinsic parallax */}
          <motion.div 
             style={{ scale }} 
             className="absolute inset-0 w-full h-full bg-[#050505] will-change-transform"
          >
            <div className="grid grid-cols-6 grid-rows-6 w-full h-full gap-2 p-2 md:gap-4 md:p-4">
               {/* Main Focus */}
               <div className="col-span-4 row-span-4 relative rounded-[1.5rem] md:rounded-[3rem] overflow-hidden border border-white/5">
                  <Image src="/images/hero-food.png" alt="Culinary Masterpiece" fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" priority />
               </div>
               {/* Secondary Accents */}
               <div className="col-span-2 row-span-3 relative rounded-[1.5rem] md:rounded-[3rem] overflow-hidden border border-white/5">
                  <Image src="/images/hero-1.png" alt="Event Setup" fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
               </div>
               <div className="col-span-2 row-span-3 relative rounded-[1.5rem] md:rounded-[3rem] overflow-hidden border border-white/5">
                  <Image src="/images/hero-2.png" alt="Gourmet Detail" fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
               </div>
               <div className="col-span-4 row-span-2 relative rounded-[1.5rem] md:rounded-[3rem] overflow-hidden border border-white/5">
                  <Image src="/1.webp" alt="August Signature" fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" />
               </div>
            </div>
            {/* Dynamic Dark Overlay for Text Legibility */}
            <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-black pointer-events-none z-10" />
          </motion.div>

          {/* The Overlay Content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 mix-blend-normal">
            <motion.div style={{ y: textY, opacity: textOpacity }} className="flex flex-col items-center">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-[1px] bg-primary" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Philosophy</span>
                 <div className="w-12 h-[1px] bg-primary" />
              </div>

              <h2 className="text-[clamp(3.5rem,8vw,7rem)] font-heading font-black text-white leading-[0.9] tracking-tighter uppercase mb-10 drop-shadow-2xl">
                Where Taste<br />
                <span className="text-primary italic font-serif">Becomes Poetry.</span>
              </h2>
            </motion.div>

            <motion.div style={{ y: pY, opacity: pOpacity }} className="flex flex-col items-center max-w-2xl">
              <p className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed drop-shadow-lg mb-12">
                August Catering redefines gastronomy through hyper-curated dining experiences. We don't just cater events; we sculpt edible masterpieces using the finest ingredients known to Ernakulam.
              </p>

              <button className="group relative inline-flex items-center gap-6 px-12 py-5 bg-primary text-black rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(255,204,0,0.4)] overflow-hidden">
                <span className="relative z-10 flex items-center gap-3">
                  Experience The Menu
                </span>
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-primary transition-all z-10">
                  <ArrowUpRight size={14} />
                </div>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              </button>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
