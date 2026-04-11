'use client';

import { useState, useEffect } from 'react';
import { getGalleryItems } from '@/lib/actions/database';
import { motion } from 'framer-motion';
import { Loader2, Play, X, Maximize2 } from 'lucide-react';
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
      if (e.key === 'Escape') {
        setActiveItem(null);
      }
    };

    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const openFullscreen = async () => {
    const element = document.getElementById('gallery-lightbox-media');
    if (!element) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await element.requestFullscreen();
  };

  return (
    <section id="gallery" className="py-32 bg-background relative">
      <div className="container mx-auto px-6">
        {showHeader && (
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-foreground">
              Our Portfolio <span className="text-primary italic">Gallery.</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto font-light">
              A visual feast of our recent wedding setups, corporate galas, and signature dish presentations.
            </p>
          </div>
        )}

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {loading ? (
            Array(limit).fill(0).map((_, i) => (
              <Skeleton key={i} className="w-full aspect-[3/4] rounded-[2rem] mb-6" />
            ))
          ) : (
            images.map((img, idx) => (
            img.url ? (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(idx * 0.05, 0.4) }}
              className="relative rounded-[2rem] overflow-hidden group border border-border shadow-2xl bg-muted break-inside-avoid cursor-pointer"
              onClick={() => setActiveItem(img)}
            >
              {img.type === 'video' ? (
                <div className="relative aspect-video">
                  <video
                    src={img.url}
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    muted
                    loop
                    playsInline
                    autoPlay
                  />
                  {/* Video badge */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full text-white flex items-center gap-1.5 text-xs font-bold uppercase px-3">
                    <Play size={12} />
                    Video
                  </div>
                </div>
              ) : (
                <Image
                  src={img.url}
                  alt={img.alt || 'Gateway Kitchen Gallery Item'}
                  width={600}
                  height={800}
                  quality={90}
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <p className="text-white font-medium text-lg leading-tight">{img.alt}</p>
              </div>
            </motion.div>
            ) : null
          ))
          )}
        </div>

        {showHeader && (
          <div className="mt-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <a
                href="/gallery"
                className="inline-flex items-center gap-3 px-10 py-4 bg-foreground text-background rounded-full font-bold text-lg hover:scale-110 transition-all shadow-2xl group hover:bg-primary hover:text-primary-foreground hover:shadow-primary/20"
              >
                View Full Portfolio
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </motion.div>
          </div>
        )}
      </div>

      {activeItem && (
        <div
          className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md p-4 md:p-8 flex items-center justify-center"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-14 right-0 flex items-center gap-3">
              {activeItem.type === 'video' && (
                <button
                  onClick={openFullscreen}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm font-semibold"
                >
                  <Maximize2 size={16} /> Fullscreen
                </button>
              )}
              <button
                onClick={() => setActiveItem(null)}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm font-semibold"
              >
                <X size={16} /> Close
              </button>
            </div>

            <div id="gallery-lightbox-media" className="rounded-2xl overflow-hidden border border-white/20 bg-black">
              {activeItem.type === 'video' ? (
                <video
                  src={activeItem.url}
                  className="w-full max-h-[80vh] object-contain bg-black"
                  controls
                  autoPlay
                />
              ) : (
                <Image
                  src={activeItem.url}
                  alt={activeItem.alt || 'Gallery image'}
                  width={1600}
                  height={1000}
                  className="w-full max-h-[80vh] object-contain"
                />
              )}
            </div>

            {activeItem.alt && (
              <p className="text-white/80 mt-4 text-sm md:text-base">{activeItem.alt}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
