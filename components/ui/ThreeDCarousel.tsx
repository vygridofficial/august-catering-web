'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItem {
  id: string;
  [key: string]: any;
}

interface ThreeDCarouselProps {
  items: CarouselItem[];
  renderCard: (item: CarouselItem, isActive: boolean) => React.ReactNode;
}

export function ThreeDCarousel({ items, renderCard }: ThreeDCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden py-10 flex flex-col items-center justify-center min-h-[600px] perspective-[1000px] select-none">
      <div className="relative flex justify-center items-center w-full h-[550px]">
        <AnimatePresence initial={false}>
          {items.map((item, index) => {
             // Calculate wrap-around index offsets
             let offset = index - currentIndex;
             if (offset < -Math.floor(items.length / 2)) offset += items.length;
             if (offset > Math.floor(items.length / 2)) offset -= items.length;

             const isActive = offset === 0;
             const absOffset = Math.abs(offset);
             const isVisible = absOffset <= 2; // only show up to 2 items on each side

             if (!isVisible) return null;

             const direction = Math.sign(offset);
             // More dramatic spacing and scaling to emulate 3D depth
             const xTranslation = offset * 45; // 45% translation per step relative to center
             const zTranslation = -absOffset * 100; // push background items deep into Z space
             const rotationY = -direction * 15; // rotate side panels towards the center window

             const scale = isActive ? 1 : 1 - absOffset * 0.15;
             const zIndex = 50 - absOffset;
             const opacity = isActive ? 1 : Math.max(0.4, 1 - absOffset * 0.3);
             const blur = isActive ? 0 : absOffset * 3;

             return (
               <motion.div
                 key={item.id}
                 initial={false}
                 animate={{
                   x: `${xTranslation}%`,
                   z: zTranslation,
                   rotateY: isActive ? 0 : rotationY,
                   scale,
                   zIndex,
                   opacity,
                   filter: `blur(${blur}px)`,
                 }}
                 transition={{
                   type: 'spring',
                   stiffness: 200,
                   damping: 25,
                   mass: 1,
                 }}
                 className={`absolute transform-gpu w-[85vw] md:w-[450px] h-[550px] transition-colors duration-500 rounded-[3rem] ${
                   isActive ? 'cursor-default ring-1 ring-primary/20 shadow-[0_0_80px_-20px_rgba(255,204,0,0.3)]' : 'cursor-pointer hover:ring-1 hover:ring-white/20'
                 }`}
                 onClick={() => {
                   if (!isActive) setCurrentIndex(index);
                 }}
               >
                 <div className={`w-full h-full transition-all duration-700 rounded-[3rem] overflow-hidden ${!isActive ? 'brightness-50 grayscale-[30%]' : 'brightness-105'}`}>
                   {renderCard(item, isActive)}
                 </div>
               </motion.div>
             )
          })}
        </AnimatePresence>
      </div>
      
      {/* Glassmorphic Controls */}
      <div className="flex items-center gap-8 mt-16 z-50">
        <button 
          onClick={prev} 
          className="w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center hover:bg-white/10 hover:border-primary/50 text-white/50 hover:text-white transition-all hover:scale-110 active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-3 px-6 py-4 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-md">
            {items.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${i === currentIndex ? 'w-10 bg-primary' : 'w-2 bg-white/20'}`} 
                />
            ))}
        </div>
        <button 
          onClick={next} 
          className="w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center hover:bg-white/10 hover:border-primary/50 text-white/50 hover:text-white transition-all hover:scale-110 active:scale-90"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  )
}
