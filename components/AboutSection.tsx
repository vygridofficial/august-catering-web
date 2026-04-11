'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Heart } from 'lucide-react';

const ABOUT_BACKDROP_IMAGES = [
  '/1.webp',
];

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeBackdrop, setActiveBackdrop] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  // High inertia stats
  const years = useTransform(scrollYProgress, [0.1, 0.4], [0, 15]);
  const clients = useTransform(scrollYProgress, [0.1, 0.5], [0, 3000]);
  const rating = useTransform(scrollYProgress, [0.1, 0.4], [0, 4.9]);

  const yearsText = useTransform(years, (latest) => `${Math.round(Number(latest))}+`);
  const clientsText = useTransform(clients, (latest) => `${Math.round(Number(latest))}+`);
  const ratingText = useTransform(rating, (latest) => `${Number(latest).toFixed(1)}★`);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBackdrop((prev) => (prev + 1) % ABOUT_BACKDROP_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative py-48 bg-transparent text-foreground overflow-hidden font-outfit"
    >
      {/* Cinematic Background Typography */}
      <motion.div
        style={{ x: y2, opacity: 0.02 }}
        className="absolute top-20 left-0 whitespace-nowrap pointer-events-none select-none"
      >
        <h2 className="text-[20vw] font-heading font-black uppercase text-white tracking-widest leading-none">
          PREMIUM CATERING
        </h2>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          
          {/* Content Array */}
          <motion.div
            style={{ y: y1, opacity }}
            className="space-y-12"
          >
            <div className="flex items-center gap-3">
               <div className="w-12 h-px bg-primary" />
               <p className="text-primary text-[10px] font-bold uppercase tracking-widest">Our Mission & Values</p>
            </div>
            
            <h2 className="text-6xl md:text-8xl font-heading font-black text-white tracking-tighter leading-[0.8] uppercase">
              The Story of <br /> <span className="text-primary italic font-serif">August.</span>
            </h2>
            
            <div className="space-y-8">
                <p className="text-2xl text-white/70 font-light leading-relaxed max-w-xl">
                  Based in Ernakulam, <span className="text-white font-bold">August Catering</span> provides a refined approach to event dining.
                </p>
                <p className="text-lg text-white/40 font-light leading-relaxed max-w-xl">
                  We specialize in crafting bespoke menus that blend traditional heritage with modern culinary techniques. Our vision is to elevate every occasion through exceptional food and service.
                </p>
            </div>

            <div className="flex flex-wrap gap-6">
              <Link href="/contact">
                <button className="group relative px-10 py-5 bg-white text-black rounded-2xl text-[10px] font-bold uppercase tracking-wider overflow-hidden transition-all shadow-2xl">
                  <span className="relative z-10 flex items-center gap-3">Contact Us <ArrowRight size={14} /></span>
                  <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                </button>
              </Link>
              
              <Link href="/gallery">
                <button className="px-10 py-5 bg-white/5 border border-white/5 text-white/40 rounded-2xl text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 hover:text-white hover:border-white/20 transition-all">
                  View Gallery
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Visual Construct */}
          <div className="relative group">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              className="relative aspect-[4/5] rounded-[4rem] overflow-hidden border border-white/5 shadow-[0_0_100px_rgba(255,183,0,0.05)] bg-[#080808]"
            >
              {/* Liquid Backdrop */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBackdrop}
                  className="absolute inset-x-[-10%] inset-y-[-10%]"
                  initial={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
                  animate={{ opacity: 0.4, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                >
                  <Image
                    src={ABOUT_BACKDROP_IMAGES[activeBackdrop]}
                    alt="August Catering atmosphere"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Glass Stats HUD */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
                {/* Center Glow */}
                <div className="w-80 h-80 bg-primary/10 rounded-full blur-[100px] absolute" />
                
                <div className="relative z-10 w-full grid grid-cols-1 gap-6">
                  {[
                    { label: 'Years of Service', value: yearsText, icon: Zap },
                    { label: 'Happy Clients', value: clientsText, icon: ShieldCheck },
                    { label: 'Average Rating', value: ratingText, icon: Heart },
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                      className="group/stat bg-white/[0.01] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 hover:border-primary/30 hover:bg-white/[0.03] transition-all duration-700"
                    >
                      <div className="flex items-center justify-between">
                         <div>
                            <motion.p className="text-4xl font-heading font-black text-white tracking-tighter">{stat.value}</motion.p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-white/20 mt-2">{stat.label}</p>
                         </div>
                         <stat.icon size={24} className="text-white/10 group-hover/stat:text-primary transition-colors duration-700" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Outlying Geometric Element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}

