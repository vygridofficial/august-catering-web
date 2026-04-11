'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Users, Clock, ChefHat, Star, Heart, Target, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { Header } from '@/components/Header';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { icon: Clock, value: '21+', label: 'Years Of Mastery' },
  { icon: Users, value: '5000+', label: 'Events Orchestrated' },
  { icon: ChefHat, value: '30+', label: 'Visionary Chefs' },
  { icon: Star, value: '4.9★', label: 'Client Satisfaction' },
];

export function AboutPageClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  useEffect(() => {
    // Reveal animations for section headers
    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach((section) => {
      gsap.fromTo(section, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0, 
          duration: 1.5,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
          }
        }
      );
    });
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen bg-[#050505] text-white antialiased font-outfit overflow-x-hidden selection:bg-primary selection:text-black">
      <Header />

      {/* Cinematic Immersive Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ scale, opacity: 0.4 }} className="absolute inset-0 z-0">
          <Image 
            src="/1.webp" 
            alt="Masters of Gastronomy" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-transparent to-[#050505]" />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-8 block drop-shadow-lg">Excellence Since 2003</span>
            <h1 className="text-[clamp(4rem,15vw,12rem)] font-heading font-black tracking-tighter leading-[0.8] mb-8">
              CRAFTING<br />
              <span className="text-primary italic font-serif">LEGACIES.</span>
            </h1>
            <p className="max-w-xl mx-auto text-lg md:text-xl text-white/50 font-medium leading-relaxed mb-12">
              August Catering redefines the boundaries of taste. We don't just serve food; we orchestrate sensory experiences that linger long after the final course.
            </p>
          </motion.div>
        </div>

        {/* Scroll Hint */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 flex flex-col items-center gap-4 text-white/20"
        >
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">Descend</span>
          <ChevronDown size={14} />
        </motion.div>
      </section>

      {/* The Mastery Stats - Liquid Glass */}
      <section className="py-32 relative z-10 bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative p-10 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] text-center group hover:bg-white/[0.05] transition-all duration-700"
              >
                <stat.icon className="mx-auto mb-6 text-primary group-hover:scale-110 transition-transform duration-500" size={32} />
                <p className="text-5xl md:text-6xl font-heading font-black text-white tracking-tighter mb-2">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative Section - Split Parallax */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="reveal-section">
            <div className="flex items-center gap-3 mb-6">
              <Heart size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Our Philosophy</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-heading font-black text-white leading-[0.9] tracking-tight mb-8">
              Where Science Meets <span className="text-primary italic">Soul.</span>
            </h2>
            <div className="space-y-6 text-xl text-white/50 font-light leading-relaxed">
              <p>
                At August Catering, gastronomy is treated as a high-art form. Our approach balances technical precision with intuitive soul, ensuring every plate tells a distinct narrative of Kerala's heritage.
              </p>
              <p>
                From massive corporate galas to high-fashion weddings, our commitment to ingredient purity and visual choreography remains unparalleled.
              </p>
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              {['Ingredient Purity', 'Visual Choreography', 'Sensory Design'].map(tag => (
                <span key={tag} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="relative aspect-[4/5] rounded-[4rem] overflow-hidden group shadow-2xl"
          >
            <Image 
              src="/1.webp" 
              alt="Culinary Precision" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-12 left-12 right-12">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Production Insight</span>
              <p className="text-2xl font-heading font-black text-white leading-tight">Meticulous Execution. Zero Compromise.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Vision Section */}
      <section className="py-32 bg-white/[0.02] border-y border-white/5 reveal-section">
        <div className="container mx-auto px-6 text-center">
          <Target className="mx-auto mb-8 text-primary/40" size={48} />
          <h2 className="text-5xl md:text-8xl font-heading font-black text-white tracking-tighter leading-[0.8] mb-12">
            ELEVATING THE<br />
            <span className="text-primary italic font-serif">KERALA TABLE.</span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-white/40 font-light leading-relaxed mb-16 px-4">
            Our mission is simple yet profound: to set the gold standard for catering in Kerala, blending hyper-local authenticity with global sophistication to create moments that are truly timeless.
          </p>
          <div className="flex justify-center flex-wrap gap-6">
            <button className="px-10 py-5 bg-primary text-black rounded-full font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-[0_10px_30px_rgba(255,204,0,0.2)]">
              Secure An Event
            </button>
            <button className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 transition-all">
              Our Portfolios
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}
