'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function HeroContent() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSmoothScroll = useCallback((e: React.MouseEvent, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const id = href.slice(2);
      if (pathname === '/') {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        router.push(href);
      }
    }
  }, [pathname, router]);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    },
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center md:items-start justify-center p-6 md:p-12 lg:p-20 pt-32 sm:pt-40 md:pt-8 z-20 pointer-events-none w-full lg:max-w-[62vw] xl:max-w-[58vw]"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="overflow-hidden w-full text-center md:text-left">
        <h1 className="max-w-[20ch] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[clamp(4.5rem,6vw,6.25rem)] 2xl:text-[6.75rem] font-heading font-black tracking-tighter text-foreground leading-[1.05] md:leading-[1.02] text-balance drop-shadow-2xl">
          Bringing <br className="hidden md:block" />Authentic Taste{' '} <br />
          <span className="text-primary italic"> To Your Events</span>
        </h1>
      </motion.div>

      <motion.div variants={item} className="w-full text-center md:text-left">
        <p className="mt-4 md:mt-6 text-sm sm:text-lg md:text-xl text-foreground/80 max-w-xs sm:max-w-sm md:max-w-xl font-light leading-relaxed mx-auto md:mx-0">
          Elevating every occasion. August Catering brings premium culinary excellence tailored to your grandest visions.
        </p>
      </motion.div>

      <motion.div variants={item} className="mt-8 sm:mt-10 pointer-events-auto flex flex-col sm:flex-row items-center md:items-center gap-4 sm:gap-5">
        <Link href="/services" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-widest text-[11px] sm:text-sm hover:scale-105 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3">
            View Our Services
            <span className="opacity-50 tracking-normal group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </Link>
        
        <Link 
          href="/#reviews" 
          onClick={(e) => handleSmoothScroll(e, '/#reviews')}
          className="group flex items-center gap-3 px-6 py-3 rounded-full bg-background/30 hover:bg-background/50 border border-border/50 shadow-xl shadow-black/5 transition-all backdrop-blur-2xl overflow-hidden relative w-full sm:w-auto justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <div className="flex items-center gap-1.5 relative z-10 text-yellow-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={12} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <div className="flex flex-col items-start relative z-10 ml-1">
            <span className="text-[11px] font-black uppercase tracking-wider opacity-90 leading-none">4.7★</span>
            <span className="text-[10px] font-medium opacity-70 group-hover:text-primary transition-colors italic tracking-wide">Client feedback →</span>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
