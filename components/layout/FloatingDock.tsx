'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Info, UtensilsCrossed, Image as ImageIcon, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/about', icon: Info, label: 'About' },
  { href: '/services', icon: UtensilsCrossed, label: 'Services' },
  { href: '/gallery', icon: ImageIcon, label: 'Gallery' },
  { href: '/contact', icon: Phone, label: 'Contact' },
];

export function FloatingDock() {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <AnimatePresence>
      {scrolled && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] pointer-events-auto font-outfit">
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="flex items-center gap-1 px-3 py-3 rounded-[2.5rem] bg-black/60 backdrop-blur-3xl border border-white/5 shadow-2xl relative"
          >
            {/* Shimmer */}
            <div className="absolute inset-0 rounded-[2.5rem] opacity-20 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-30deg] animate-[shimmer_5s_infinite]" />
            </div>

            {/* Logo */}
            <Link href="/" className="ml-2 group">
              <div className="relative w-12 h-12 rounded-[1.25rem] overflow-hidden border border-white/10 group-hover:border-primary/50 transition-all duration-700">
                 <Image src="/logo.jpeg" alt="August Catering" fill className="object-cover saturate-0 group-hover:saturate-100 transition-all duration-700" />
              </div>
            </Link>
            
            <div className="w-[1px] h-6 bg-white/5 mx-3" />

            {/* Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                const isHovered = hoveredIndex === index;
                
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className="relative group p-4 rounded-2xl transition-all duration-500 hover:bg-white/5"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <item.icon 
                      size={18} 
                      strokeWidth={isActive ? 2.5 : 1.5}
                      className={`relative z-10 transition-all duration-500 ${isActive ? 'text-primary' : 'text-white/30 group-hover:text-white'}`} 
                    />
                    
                    {isActive && (
                      <motion.div 
                        layoutId="dock-active-glow"
                        className="absolute inset-0 bg-primary/5 rounded-2xl border border-primary/20"
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      />
                    )}

                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: -64 }}
                          exit={{ opacity: 0, scale: 0.9, y: -5 }}
                          className="absolute left-1/2 -translate-x-1/2 px-4 py-3 bg-black/80 backdrop-blur-3xl border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white rounded-xl whitespace-nowrap pointer-events-none shadow-2xl"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                            {item.label}
                          </div>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/80 border-r border-b border-white/10 rotate-45" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </div>

            <div className="w-[1px] h-6 bg-white/5 mx-3" />

            {/* Action button */}
            <Link href="/book" className="mr-2">
              <button className="relative px-8 py-3 bg-white text-black rounded-[1.5rem] text-[10px] font-bold uppercase tracking-wider overflow-hidden group hover:scale-[1.05] active:scale-[0.98] transition-all shadow-2xl">
                <span className="relative z-10">Book</span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              </button>
            </Link>
          </motion.div>

          <style jsx global>{`
            @keyframes shimmer {
              0% { left: -100%; }
              50% { left: 100%; }
              100% { left: 100%; }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
}
