'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import Image from 'next/image';
import { getSocialSettings } from '@/lib/actions/database';

interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  price?: string;
}

interface CircularCarouselProps {
  items: CarouselItem[];
}

export function CircularCarousel({ items }: CircularCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [settings, setSettings] = useState<any>(null);
  const angle = 360 / items.length;

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSocialSettings();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className="relative w-full min-h-[85vh] lg:h-[85vh] flex items-start lg:items-center justify-between overflow-visible lg:overflow-hidden mt-8 lg:mt-20 z-20 pointer-events-auto px-0">
      {/* Text Content - Left Side */}
      <div className="w-full lg:w-1/2 relative z-30 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-start w-full will-change-transform"
          >
            {/* Mobile Image Display - Optimized */}
            <div className="lg:hidden w-full aspect-square md:aspect-video rounded-[3rem] overflow-hidden mb-8 border border-white/20 shadow-2xl relative bg-muted">
              <Image 
                src={items[currentIndex].image} 
                alt={items[currentIndex].title}
                fill
                priority
                className="object-cover"
                quality={90}
              />
            </div>

            <h2 className="text-sm md:text-lg uppercase tracking-[0.3em] text-primary mb-4 font-semibold inline-block">
              {items[currentIndex].subtitle}
            </h2>
            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-[4.5rem] 2xl:text-8xl font-heading font-extrabold tracking-tighter mb-8 text-foreground leading-[1.1] md:leading-[1.05]">
              {items[currentIndex].title}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
              <MagneticButton 
                href={`https://wa.me/${settings?.whatsapp || '919495184661'}?text=${encodeURIComponent(`Hi Gateway Kitchen! I'm interested in discovering the menu for ${items[currentIndex].title}. Could you share more details?`)}`}
                className="px-8 py-4 bg-primary text-primary-foreground font-medium shadow-xl hover:shadow-primary/50 text-lg"
              >
                Discover Menu
              </MagneticButton>
              {items[currentIndex].price && (
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground/50">Price</span>
                  <span className="text-2xl font-bold font-mono">{items[currentIndex].price}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 mt-auto border-t border-border pt-8 w-full max-w-sm">
              <button 
                onClick={handlePrev}
                className="w-14 h-14 rounded-full border border-border bg-background/50 backdrop-blur-md flex items-center justify-center hover:bg-foreground hover:text-background transition-colors pointer-events-auto shadow-sm"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext}
                className="w-14 h-14 rounded-full border border-border bg-background/50 backdrop-blur-md flex items-center justify-center hover:bg-foreground hover:text-background transition-colors pointer-events-auto shadow-sm"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Circular Rotating Gallery - Right Side */}
      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] translate-x-[15%] z-10 pointer-events-none scale-[0.6] lg:scale-[0.65] xl:scale-[0.8] 2xl:scale-100 origin-right transition-transform">
        {/* The Outer Arc Background */}
        <div className="absolute inset-0 rounded-full border-[1px] border-primary/20 bg-background/30 backdrop-blur-sm shadow-[0_0_100px_rgba(16,185,129,0.1)]" />
        
        <motion.div 
          className="absolute inset-0 w-full h-full"
          animate={{ rotate: -(currentIndex * angle) }}
          transition={{ type: 'spring', stiffness: 50, damping: 20, mass: 1 }}
        >
          {items.map((item, index) => {
            const rotate = index * angle;
            const radius = 400; // Translate outward by half the width
            
            return (
              <div 
                key={item.id}
                className="absolute top-1/2 left-1/2 w-[350px] h-[350px] -ml-[175px] -mt-[175px] origin-center"
                style={{
                  transform: `rotate(${rotate}deg) translateX(-${radius}px)`,
                }}
              >
                <motion.div 
                  className="w-full h-full rounded-full overflow-hidden border-[12px] border-background shadow-2xl relative bg-foreground/5"
                  animate={{ rotate: (currentIndex * angle) - rotate }} // Counter-rotate to keep images upright
                  transition={{ type: 'spring', stiffness: 50, damping: 20, mass: 1 }}
                >
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    priority={index === currentIndex}
                    className="object-cover"
                    quality={90}
                    sizes="350px"
                  />
                  {/* Internal Glow for integration */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] pointer-events-none" />
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>

  );
}
