'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getServices } from '@/lib/actions/database';
import { Skeleton } from './ui/Skeleton';

gsap.registerPlugin(ScrollTrigger);

export function ServicesShowcase() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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

  useEffect(() => {
    if (services.length === 0) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (card) {
          gsap.fromTo(card, 
            { y: 100, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1.5,
              ease: "expo.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                end: "center 50%",
                scrub: 1,
              }
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [services]);

  return (
    <section ref={sectionRef} id="services" className="relative py-32 bg-[#050505] overflow-hidden border-t border-white/5">
      {/* Cinematic Edge Lighting */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4"
          >
            Capabilities
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-heading font-black text-white tracking-tight"
          >
            Curated <span className="text-primary italic font-serif">Experiences.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl text-white/50 font-outfit font-light max-w-2xl leading-relaxed"
          >
            Every occasion demands a specific atmosphere. We provide precisely curated menus that match the scale, theme, and elegance of your signature event.
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 rounded-[2rem] bg-white/5" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="py-20 text-center text-white/20 font-outfit border border-white/5 rounded-[2rem]">
            Awaiting curation...
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {services.map((svc, idx) => (
                <motion.div
                  key={svc.id}
                  ref={el => { if (el) cardsRef.current[idx] = el; }}
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="p-10 rounded-[2.5rem] bg-background/40 border border-white/5 shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-primary/30 hover:bg-background/60 transition-colors duration-500"
                >
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-3xl font-heading font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">{svc.title}</h3>
                      <p className="text-white/50 font-outfit leading-relaxed font-light mb-8 line-clamp-3">{svc.description}</p>
                    </div>
                    <div className="inline-flex items-center self-start px-4 py-2 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 border border-white/10 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {svc.style}
                    </div>
                  </div>
                  
                  {/* Subtle Amber Glow on Hover */}
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/10 blur-[60px] rounded-full group-hover:scale-150 group-hover:bg-primary/20 transition-transform duration-700 ease-in-out"></div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20"
            >
              <a 
                href="/services" 
                className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-bold uppercase tracking-[0.15em] text-sm hover:scale-[1.02] hover:bg-primary hover:text-white hover:shadow-[0_0_40px_rgba(255,204,0,0.3)] transition-all duration-300"
              >
                Explore Full Services 
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
