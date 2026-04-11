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
            { y: 100, opacity: 0, rotateX: 20 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 1.2,
              ease: "expo.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                end: "top 50%",
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
    <section ref={sectionRef} id="services" className="relative py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-24">
          <h2 className="text-5xl md:text-7xl font-heading font-bold text-foreground">
            Curated <span className="text-primary italic">Experiences.</span>
          </h2>
          <p className="mt-6 text-xl text-muted-foreground font-light">
            Every occasion demands an atmosphere. We provide precisely curated menu that match the scale, theme, and elegance of your event.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 rounded-[3rem]" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="py-20 text-center text-foreground/20 border border-dashed rounded-[3rem]">
            No services populated yet.
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {services.map((svc, idx) => (
                <motion.div
                  key={svc.id}
                  ref={el => { if (el) cardsRef.current[idx] = el; }}
                  whileHover={{ scale: 1.02, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`p-10 rounded-[3rem] bg-gradient-to-br ${svc.color} border border-white/50 shadow-2xl shadow-black/5 backdrop-blur-xl relative overflow-hidden group`}
                >
                  {/* Glass Noise overlay */}
                  <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
                    <svg className="w-full h-full">
                       <filter id="noiseFilterSub">
                          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
                       </filter>
                       <rect width="100%" height="100%" filter="url(#noiseFilterSub)" />
                    </svg>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-3xl font-heading font-semibold text-foreground mb-4">{svc.title}</h3>
                    <p className="text-muted-foreground mb-8 leading-relaxed font-medium">{svc.description}</p>
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 backdrop-blur-md border border-white/30">
                      {svc.style}
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/40 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700 ease-in-out"></div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <a 
                href="/services" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300"
              >
                Explore Full Services <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
