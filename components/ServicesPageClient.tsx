'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sparkles, ChefHat, GlassWater, UtensilsCrossed, ArrowDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export function ServicesPageClient({ services }: { services: Service[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <main className="min-h-screen bg-[#050505] text-white antialiased font-outfit selection:bg-primary selection:text-black overflow-x-hidden">
      <Header />

      {/* Cinematic Grain & Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      </div>
      
      <section className="relative z-10 pt-48 pb-32 px-6 container mx-auto flex flex-col items-center justify-center min-h-[80vh]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[200px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <Sparkles size={14} className="text-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Master Orchestrations</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="text-[clamp(4rem,10vw,8rem)] font-heading font-black tracking-tighter leading-[0.85] mb-10 uppercase"
          >
            CURATED <br /> <span className="text-primary italic font-serif">EXPERIENCES.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-3xl text-white/40 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Where culinary precision meets immersive event design. We engineer every plate to be a distinct masterpiece.
          </motion.p>
          
          <motion.div
             initial={{ opacity: 0, scale: 0 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 1.2, duration: 1 }}
             className="mt-24 w-12 h-12 mx-auto rounded-full border border-white/10 flex items-center justify-center text-white/30 animate-bounce"
          >
             <ArrowDown size={16} />
          </motion.div>
        </div>
      </section>

      {/* Sticky Editorial Scroll Arena */}
      <section ref={containerRef} className="relative z-10">
        {services.map((service, index) => (
           <ServiceSection key={service.id} service={service} index={index} total={services.length} scrollYProgress={scrollYProgress} />
        ))}
      </section>

      {/* Services Context - Liquid Glass Grid */}
      <section className="relative z-10 py-32 bg-[#050505] border-t border-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between gap-4 mb-20 px-2">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 shadow-2xl flex items-center justify-center">
                <ChefHat className="text-primary" size={28} />
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-white tracking-tighter uppercase">Signature <span className="text-primary italic font-serif">Solutions</span></h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div key={service.id} className="group relative p-12 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-700 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none scale-150 rotate-12">
                   {idx % 3 === 0 ? <UtensilsCrossed size={120} className="text-primary" /> : <GlassWater size={120} className="text-primary" />}
                </div>
                <div className="relative z-10 h-full flex flex-col">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-6">
                    M / {String(idx + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-3xl font-heading font-black text-white tracking-tighter mb-4 group-hover:scale-[1.02] transition-transform duration-700 origin-left uppercase leading-none">
                    {service.title}
                  </h3>
                  <p className="text-white/40 text-lg font-light leading-relaxed mb-8 flex-grow">
                    {service.description.substring(0, 100)}...
                  </p>
                  
                  <div className="pt-8 border-t border-white/5 flex items-center justify-between group-hover:border-primary/20 transition-colors">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 group-hover:text-primary transition-colors">{service.subtitle}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function ServiceSection({ service, index, total, scrollYProgress }: any) {
  const isEven = index % 2 === 0;
  
  const start = index / total;
  const end = (index + 1) / total;
  const step = 1 / total;
  const margin = step * 0.1; // 10% margin for fade
  
  const opacity = useTransform(
    scrollYProgress, 
    [
      Math.max(0, start - margin), 
      Math.max(0, start + margin), 
      Math.min(1, end - margin), 
      Math.min(1, end + margin)
    ], 
    [0.1, 1, 1, 0.1]
  );
  const scale = useTransform(scrollYProgress, [start, end], [1, 1.1]);
  const yText = useTransform(
    scrollYProgress, 
    [Math.max(0, start - step * 0.3), start], 
    [100, 0]
  );

  return (
    <div className="h-screen w-full sticky top-0 flex items-center justify-center overflow-hidden bg-[#050505]">
       <motion.div style={{ opacity }} className="absolute inset-0 z-0">
          <motion.div style={{ scale }} className="w-full h-full relative">
             <Image 
               src={service.image} 
               alt={service.title}
               fill
               className="object-cover"
               priority={index === 0}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </motion.div>
       </motion.div>
       
       <div className={`container mx-auto px-6 relative z-10 w-full flex ${isEven ? 'justify-start' : 'justify-end'}`}>
          <motion.div style={{ y: yText }} className="max-w-3xl">
             <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-[1px] bg-primary" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-primary">SCENE 0{index + 1}</span>
             </div>
             <h2 className="text-[clamp(3.5rem,8vw,7rem)] font-heading font-black text-white tracking-tighter leading-[0.85] mb-8 uppercase text-shadow-glow">
                 {service.title.split(' ')[0]} <br />
                 <span className="text-primary italic font-serif opacity-90">{service.title.split(' ').slice(1).join(' ')}</span>
             </h2>
             <p className="text-2xl md:text-4xl text-white/80 font-light mb-6">
                 {service.subtitle}
             </p>
             <p className="text-lg text-white/50 font-light max-w-xl leading-relaxed">
                 {service.description}
             </p>
          </motion.div>
       </div>
    </div>
  );
}
