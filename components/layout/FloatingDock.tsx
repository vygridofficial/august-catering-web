'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Info, UtensilsCrossed, Image as ImageIcon, Phone, MapPin } from 'lucide-react';
import { useRef, useState } from 'react';
import Image from 'next/image';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/#about', icon: Info, label: 'Story' },
  { href: '/services', icon: UtensilsCrossed, label: 'Services' },
  { href: '/gallery', icon: ImageIcon, label: 'Visuals' },
  { href: '/contact', icon: Phone, label: 'Contact' },
];

export function FloatingDock() {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
        className="flex items-center gap-2 px-4 py-3 rounded-3xl bg-background/30 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] shadow-primary/10"
      >
        {/* Logo Icon */}
        <Link href="/" className="mr-2">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/30">
             <Image src="/logo.jpeg" alt="August Catering" fill className="object-cover" />
          </div>
        </Link>
        
        <div className="w-[1px] h-8 bg-white/10 mx-2" />

        {/* Dock Items */}
        <div className="flex items-center gap-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            const isHovered = hoveredIndex === index;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className="relative group p-3 rounded-full transition-colors hover:bg-white/10"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <item.icon 
                  size={20} 
                  strokeWidth={1.5}
                  className={`transition-colors duration-300 ${isActive ? 'text-primary' : 'text-foreground/60 group-hover:text-foreground'}`} 
                />
                
                {isActive && (
                  <motion.div 
                    layoutId="active-dock-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-xs font-bold rounded-lg whitespace-nowrap pointer-events-none"
                    >
                      {item.label}
                      {/* Tooltip arrow */}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>

        <div className="w-[1px] h-8 bg-white/10 mx-2" />

        {/* Action Button */}
        <Link href="/book">
          <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20 whitespace-nowrap">
            Book
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
