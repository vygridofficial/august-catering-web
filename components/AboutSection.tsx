'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const ABOUT_BACKDROP_IMAGES = [
  '/1.webp',
];

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeBackdrop, setActiveBackdrop] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const years = useTransform(scrollYProgress, [0.1, 0.4], [1, 21]);
  const clients = useTransform(scrollYProgress, [0.1, 0.5], [250, 5000]);
  const rating = useTransform(scrollYProgress, [0.1, 0.4], [3.5, 4.7]);
  const yearsText = useTransform(years, (latest) => `${Math.round(Number(latest))}+`);
  const clientsText = useTransform(clients, (latest) => `${Math.round(Number(latest))}+`);
  const ratingText = useTransform(rating, (latest) => `${Number(latest).toFixed(1)}★`);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBackdrop((prev) => (prev + 1) % ABOUT_BACKDROP_IMAGES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative py-15 bg-foreground text-background overflow-hidden"
      style={{ position: 'relative' }}
    >
      {/* Decorative background typography */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-10 left-0 right-0 text-center opacity-5 pointer-events-none select-none"
      >
        <h2 className="text-[8vw] leading-none font-heading font-bold uppercase whitespace-nowrap">
          21 YEARS OF EXCELLENCE
        </h2>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            style={{ y: y1, opacity }}
            className="space-y-8"
          >
            <p className="text-primary text-xs font-black uppercase tracking-[0.3em]">Our Story</p>
            <h2 className="text-5xl md:text-7xl font-heading font-bold text-background">
              The Art of <span className="text-primary italic">Gastronomy.</span>
            </h2>
            <p className="text-xl text-background/80 font-light leading-relaxed">
              Based in Thiruvaniyoor, Ernakulam, Gateway Kitchen Catering Service has been a
              pillar of culinary excellence for over two decades.
            </p>
            <p className="text-lg text-background/60 font-light leading-relaxed">
              Our skilled and experienced chefs are proficient in a diverse variety of cuisines, ensuring a high-quality dining experience. Rated 4.7 stars by our satisfied clients, we believe that the food should not just satisfy the palate, but elevate the entire occasion.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link href="/about">
                <button className="group relative inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 overflow-hidden rounded-full border border-primary text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-foreground text-sm sm:text-base">
                  <span className="relative z-10 font-medium tracking-wider">Discover Our Story</span>
                </button>
              </Link>
              <Link href="/contact">
                <button className="group inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 overflow-hidden rounded-full bg-primary/10 text-background/70 transition-all duration-300 hover:bg-primary hover:text-primary-foreground text-sm sm:text-base">
                  <span className="font-medium tracking-wider">Contact Us</span>
                </button>
              </Link>
            </div>
          </motion.div>

          {/* About visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.5, ease: 'circOut' }}
            className="relative w-[80%] h-[80%] m-auto aspect-[4/5] rounded-[2rem] overflow-hidden bg-gradient-to-tr from-primary/20 to-transparent border border-white/10"
          >
            <div className="absolute inset-0 z-0 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={ABOUT_BACKDROP_IMAGES[activeBackdrop]}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                >
                  <Image
                    src={ABOUT_BACKDROP_IMAGES[activeBackdrop]}
                    alt="Gateway Kitchen ambience"
                    fill
                    className="object-cover opacity-75"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/20 to-foreground/42" />
            </div>

            <div className="absolute inset-0 bg-background/0 backdrop-blur-[1px] flex flex-col items-center justify-center gap-4 sm:gap-6 p-4 sm:p-8">
              <div className="w-64 h-64 bg-primary/30 rounded-full blur-[100px] absolute" />
              <div className="relative z-10 text-center space-y-3 sm:space-y-4">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 sm:px-8 sm:py-4">
                  <motion.p className="text-xl sm:text-3xl font-heading font-extrabold text-background">{yearsText}</motion.p>
                  <p className="text-background/50 text-[10px] sm:text-sm uppercase tracking-widest mt-1">Years of Excellence</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 sm:px-8 sm:py-4">
                  <motion.p className="text-xl sm:text-3xl font-heading font-extrabold text-background">{clientsText}</motion.p>
                  <p className="text-background/50 text-[10px] sm:text-sm uppercase tracking-widest mt-1">Happy Clients</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 sm:px-8 sm:py-4">
                  <motion.p className="text-xl sm:text-3xl font-heading font-extrabold text-background">{ratingText}</motion.p>
                  <p className="text-background/50 text-[10px] sm:text-sm uppercase tracking-widest mt-1">Average Rating</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
