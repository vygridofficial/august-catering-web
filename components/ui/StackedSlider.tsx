'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowUpRight } from 'lucide-react';

interface StackedSliderProps {
  items: any[];
  renderCard: (item: any, index: number) => React.ReactNode;
}

export function StackedSlider({ items, renderCard }: StackedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Stack logic: we show 3 cards. 
  // Card 0: Front (active)
  // Card 1: Behind (shifted right/slightly smaller)
  // Card 2: Further behind (shifted more right/smaller)
  
  const getVisibleItems = () => {
    const visible = [];
    for (let i = 0; i < Math.min(items.length, 3); i++) {
        visible.push(items[(currentIndex + i) % items.length]);
    }
    return visible;
  };

  const visibleItems = getVisibleItems();

  return (
    <div className="relative w-full min-h-[600px] flex items-center justify-center">
      <div className="relative w-full max-w-5xl h-[550px]">
        <AnimatePresence initial={false} mode="popLayout">
          {visibleItems.map((item, i) => {
            // i=0 is top, i=1 is middle, i=2 is bottom
            const zIndex = 30 - i;
            const xOffset = i * 40; // Shift each successive card
            const scale = 1 - i * 0.05;
            const opacity = 1 - i * 0.3;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ 
                    x: direction > 0 ? 200 : -200, 
                    opacity: 0, 
                    scale: 0.8 
                }}
                animate={{ 
                    x: xOffset, 
                    opacity: opacity, 
                    scale: scale,
                    zIndex: zIndex,
                    filter: i === 0 ? 'blur(0px)' : 'blur(2px)'
                }}
                exit={{ 
                    x: direction > 0 ? -200 : 200, 
                    opacity: 0, 
                    scale: 0.8,
                    zIndex: 0
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  opacity: { duration: 0.4 }
                }}
                className="absolute inset-0 w-full md:w-[450px] mx-auto pointer-events-none first:pointer-events-auto"
              >
                <div className="h-full w-full">
                    {renderCard(item, i)}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-8 z-50">
        <button 
          onClick={prevSlide}
          className="w-16 h-16 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center text-white/40 hover:text-white hover:border-primary/50 transition-all hover:scale-110 active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex gap-2">
            {items.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1 transition-all duration-500 rounded-full ${currentIndex === idx ? 'w-8 bg-primary' : 'w-2 bg-white/10'}`} 
                />
            ))}
        </div>

        <button 
          onClick={nextSlide}
          className="w-16 h-16 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center text-white/40 hover:text-white hover:border-primary/50 transition-all hover:scale-110 active:scale-90"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
