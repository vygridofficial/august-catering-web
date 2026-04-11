'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHeroImages } from '@/lib/actions/hero';

import Image from 'next/image';

const FALLBACK_IMAGE = '/bg1.jpg';

export function HeroImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<string[]>([FALLBACK_IMAGE]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getHeroImages();
        if (data && data.length > 0) {
          const active = data.filter((img: any) => img.isActive).map((img: any) => img.url);
          setImages(active.length > 0 ? active : [FALLBACK_IMAGE]);
        } else {
          setImages([FALLBACK_IMAGE]);
        }
      } catch (err) {
        console.error("Hero image fetch fail:", err);
        setImages([FALLBACK_IMAGE]);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-background">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ clipPath: 'circle(0% at 50% 50%)', scale: 1.05, opacity: 0 }}
          animate={{ clipPath: 'circle(150% at 50% 50%)', scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            clipPath: { duration: 1.5, ease: [0.77, 0, 0.175, 1] },
            scale: { duration: 5, ease: "linear" }, 
            opacity: { duration: 1 }
          }}
        >
          {images[currentIndex] && (
            <Image
              src={images[currentIndex]}
              alt="August Catering Premium Catering Setup"
              fill
              priority={currentIndex === 0}
              className="object-cover object-top md:object-center"
              sizes="100vw"
              quality={90}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>

  );
}
