'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getServices } from '@/lib/actions/services';
import { Skeleton } from './ui/Skeleton';
import { Sparkles, ArrowUpRight, ChefHat } from 'lucide-react';
import { StackedSlider } from './ui/StackedSlider';

export function ServicesShowcase() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const data = await getServices();
      const active = data.filter((s: any) => s.isActive);
      setServices(active);
      setLoading(false);
    };
    fetchServices();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="relative py-24 md:py-64 bg-[#050505] overflow-hidden border-t border-white/5 font-outfit">
      
      {/* Cinematic Pulse Ambience */}
      <div className="absolute top-0 right-0 w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-primary/5 rounded-full blur-[120px] md:blur-[180px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-[-10%] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-white/[0.02] rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mb-16 md:mb-32 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center md:justify-start gap-3 mb-6 md:mb-8"
          >
            <ChefHat size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Signature Collections</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            viewport={{ once: true }}
            className="text-5xl sm:text-6xl md:text-[clamp(3.5rem,8vw,6rem)] font-heading font-black text-white tracking-tighter leading-[0.9] md:leading-[0.8] uppercase"
          >
            Gastronomic <br /><span className="text-primary italic font-serif">IDENTITY.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-6 md:mt-10 text-lg md:text-2xl text-white/40 font-medium max-w-2xl leading-relaxed mx-auto md:mx-0"
          >
            A curated spectrum of service modules, engineered for elite hospitality and uncompromising quality.
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <Skeleton className="w-full h-[600px] rounded-[3.5rem] bg-white/[0.02] border border-white/5" />
               <Skeleton className="w-full h-[600px] rounded-[3.5rem] bg-white/[0.02] border border-white/5 hidden md:block" />
               <Skeleton className="w-full h-[600px] rounded-[3.5rem] bg-white/[0.02] border border-white/5 hidden md:block" />
          </div>
        ) : services.length === 0 ? (
          <div className="py-32 text-center border border-dashed border-white/10 rounded-[4rem] bg-white/[0.01]">
            <p className="text-xs font-bold uppercase tracking-widest text-white/50">
              Services will appear here soon.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
              {services.slice(0, 3).map((svc, i) => (
                <motion.div 
                  key={svc.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.2, ease: [0.19, 1, 0.22, 1] }}
                  className="relative h-[550px] md:h-[650px] w-full p-8 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] bg-[#0A0A0A] border border-white/10 shadow-2xl overflow-hidden flex flex-col justify-between group hover:border-primary/50 transition-all duration-700"
                >
                  {/* Atmospheric Glow */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-1000" />
                  
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-8 md:mb-12">
                         <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-all duration-500">
                            <Sparkles size={20} className="md:w-6 md:h-6 text-white/40 group-hover:text-primary transition-colors" />
                         </div>
                         <span className="text-[10px] md:text-[11px] font-black tracking-widest text-white/20 uppercase">Module // 0{i+1}</span>
                      </div>
                      
                      <h3 className="text-3xl md:text-5xl font-heading font-black text-white mb-6 md:mb-8 uppercase tracking-tighter leading-[0.9] md:leading-[0.85] group-hover:text-primary transition-colors duration-500">{svc.title}</h3>
                      <p className="text-white/40 text-lg font-medium leading-relaxed mb-8 line-clamp-4 group-hover:text-white/60 transition-colors duration-500">{svc.description}</p>
                    </div>
                    
                    <div className="mt-auto">
                        <div className="w-full p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between backdrop-blur-3xl group-hover:bg-white/5 transition-all duration-500">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-primary">Service Class</p>
                                <p className="text-white font-bold">{svc.style || 'Signature'}</p>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-white/5 group-hover:bg-primary flex items-center justify-center text-white/40 group-hover:text-black shadow-lg transition-all duration-500">
                                <ArrowUpRight size={24} />
                            </div>
                        </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-48"
            >
              <a 
                href="/services" 
                className="group relative inline-flex items-center gap-6 px-14 py-6 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-xs transition-all duration-700 hover:scale-105 active:scale-95 shadow-2xl hover:shadow-primary/20"
              >
                <span className="relative z-10">Access Full Registry</span>
                <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <ArrowUpRight size={16} />
                </div>
              </a>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
