'use client';

import { useState, useEffect } from 'react';
import { getGalleryItems } from '@/lib/actions/database';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Play, X, Maximize2, Aperture, Eye, Camera, Layers } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from './ui/Skeleton';

interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  type?: 'image' | 'video';
}

interface GallerySectionProps {
  showHeader?: boolean;
  limit?: number;
}

export function GallerySection({ showHeader = true, limit = 12 }: GallerySectionProps) {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      const data = await getGalleryItems(limit);
      setImages(data as any[]);
      setLoading(false);
    };
    fetchGallery();
  }, [limit]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveItem(null);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const openFullscreen = async () => {
    const element = document.getElementById('gallery-lightbox-media');
    if (!element) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await element.requestFullscreen();
    }
  };

  return (
    <section id="gallery" className="py-24 md:py-48 bg-transparent relative z-10 font-outfit">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/5 blur-[100px] md:blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/5 blur-[100px] md:blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {showHeader && (
          <div className="mb-16 md:mb-32 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-3 mb-6 md:mb-8"
            >
              <Aperture size={16} className="text-primary animate-spin-slow" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Our Visual Gallery</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
              className="text-6xl md:text-9xl font-heading font-black text-white tracking-tighter leading-[0.9] md:leading-[0.8] uppercase"
            >
              Moments <br /> <span className="text-primary italic font-serif">Captured.</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 md:mt-12 text-white/30 max-w-2xl mx-auto font-medium text-base md:text-lg leading-relaxed px-4 md:px-0"
            >
              A glimpse into the exceptional events and culinary journeys curated by August Catering.
            </motion.p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] md:auto-rows-[300px] gap-4 md:gap-6">
          {loading ? (
            Array(limit).fill(0).map((_, i) => {
              const bentoClass = i % 7 === 0 ? "md:col-span-2 md:row-span-2" : 
                                 i % 7 === 3 ? "md:col-span-1 md:row-span-2" : 
                                 i % 7 === 5 ? "md:col-span-2 md:row-span-1" : "md:col-span-1 md:row-span-1";
              return (
                <Skeleton key={i} className={`w-full h-full rounded-[2rem] bg-white/5 border border-white/5 ${bentoClass}`} />
              )
            })
          ) : images.length === 0 ? (
            <div className="md:col-span-4 py-24 px-6 text-center border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01]">
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                Gallery photos will appear here soon.
              </p>
            </div>
          ) : (
            images.map((img, idx) => {
              if (!img.url) return null;
              
              const bentoClass = idx % 7 === 0 ? "md:col-span-2 md:row-span-2" : 
                                 idx % 7 === 3 ? "md:col-span-1 md:row-span-2" : 
                                 idx % 7 === 5 ? "md:col-span-2 md:row-span-1" : "md:col-span-1 md:row-span-1";

              return (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1.2, delay: (idx % 4) * 0.1, ease: [0.19, 1, 0.22, 1] }}
                  className={`relative rounded-[2rem] overflow-hidden group border border-white/5 shadow-2xl bg-[#080808] cursor-pointer block ${bentoClass}`}
                  onClick={() => setActiveItem(img)}
                >
                  <div className="relative overflow-hidden w-full h-full">
                    {img.type === 'video' ? (
                      <video
                        src={img.url}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
                        muted
                        loop
                        playsInline
                        autoPlay
                      />
                    ) : (
                      <Image
                        src={img.url}
                        alt={img.alt || 'August Catering Creation'}
                        fill
                        quality={95}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    
                    {/* Cinematic Detail Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-px bg-primary" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary">
                          {img.type === 'video' ? 'Event Video' : 'Event Photo'}
                        </span>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight mb-4">
                        {img.alt || 'August Catering Event'}
                      </h3>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/10">
                            <Eye size={12} className="text-white" />
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-white/40">View Full Image</span>
                      </div>
                    </div>
                  </div>

                  {img.type === 'video' && (
                    <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-2xl p-3 rounded-2xl text-white border border-white/10 group-hover:border-primary/50 transition-all duration-500">
                      <Play size={12} className="fill-white" />
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        {showHeader && (
          <div className="mt-32 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <a
                href="/gallery"
                className="group relative inline-flex items-center gap-6 px-16 py-7 bg-white text-black rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-[1.05] transition-all shadow-2xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-4">
                   Explore Full Gallery <ArrowIcon />
                </span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              </a>
            </motion.div>
          </div>
        )}
      </div>

      {/* Lightbox - High Fidelity HUD */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/98 backdrop-blur-3xl p-6 md:p-16 flex items-center justify-center overflow-hidden"
            onClick={() => setActiveItem(null)}
          >
            {/* HUD Background Decorations */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-10 left-10 w-px h-24 bg-gradient-to-b from-white to-transparent" />
                <div className="absolute top-10 left-10 w-24 h-px bg-gradient-to-r from-white to-transparent" />
                <div className="absolute bottom-10 right-10 w-px h-24 bg-gradient-to-t from-white to-transparent" />
                <div className="absolute bottom-10 right-10 w-24 h-px bg-gradient-to-l from-white to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="relative w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cinematic Controls */}
              <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-4 z-[310]">
                {activeItem.type === 'video' && (
                  <button
                    onClick={openFullscreen}
                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-white hover:bg-white/10 hover:border-primary transition-all duration-500"
                  >
                    <Maximize2 size={20} />
                  </button>
                )}
                <button
                  onClick={() => setActiveItem(null)}
                  className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-white hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all duration-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div id="gallery-lightbox-media" className="relative w-full h-full max-w-7xl max-h-[80vh] rounded-[4rem] overflow-hidden border border-white/5 bg-[#050505] shadow-3xl group/media">
                <div className="absolute inset-0 bg-primary/2 blur-[120px] pointer-events-none" />
                
                {activeItem.type === 'video' ? (
                  <video
                    src={activeItem.url}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                  />
                ) : (
                  <Image
                    src={activeItem.url}
                    alt={activeItem.alt || 'Gallery item'}
                    fill
                    className="object-contain p-8 md:p-4"
                    quality={90}
                    priority
                  />
                )}
                
                {/* Meta Panel UI */}
                <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Camera size={14} className="text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Gallery Details</span>
                  </div>
                  <h3 className="text-5xl font-heading font-black text-white tracking-tighter uppercase">{activeItem.alt || 'Event Moment'}</h3>
                  <div className="flex gap-6 mt-6">
                    <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-white/30 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      Captured Event
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-white/30 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Verified
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

const ArrowIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500">
        <path d="M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
