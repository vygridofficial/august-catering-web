'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export function LiquidAbout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current || !textRef.current) return;

    // Liquid Image Parallax & Scale
    gsap.fromTo(imageRef.current,
      { scale: 1.2, y: -50, filter: 'blur(10px) brightness(0.5)' },
      {
        scale: 1,
        y: 50,
        filter: 'blur(0px) brightness(1)',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    );

    // Text Stagger Reveal
    const words = textRef.current.querySelectorAll('.word');
    gsap.fromTo(words, 
      { y: 100, opacity: 0, rotateX: -90 },
      { 
        y: 0, 
        opacity: 1, 
        rotateX: 0,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          end: 'bottom 50%',
          scrub: 1,
        }
      }
    );
    
    // Background Liquid Blur effect
    gsap.to(containerRef.current, {
      backgroundColor: 'rgba(255, 204, 0, 0.05)',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'center center',
        end: 'bottom top',
        scrub: true,
      }
    });
  }, []);

  const wrapWords = (text: string) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="inline-block overflow-hidden pb-2 mr-[0.25em]">
        <span className="word inline-block origin-bottom">{word}</span>
      </span>
    ));
  };

  return (
    <section ref={containerRef} className="relative w-full min-h-screen bg-background py-32 overflow-hidden flex items-center">
      
      {/* Liquid Glass Distorted Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Parallax Image Container */}
        <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
          <div ref={imageRef} className="absolute inset-[-10%] w-[120%] h-[120%]">
            <Image 
              src="/1.webp" 
              alt="Culinary Art" 
              fill 
              className="object-cover" 
              priority
            />
          </div>
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent pointer-events-none" />
        </div>

        {/* Text Revealer */}
        <div ref={textRef} className="space-y-8">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-foreground leading-[1.1]">
            {wrapWords("Where Taste Becomes Visual Poetry.")}
          </h2>
          <div className="w-1/4 h-1 bg-primary rounded-full" />
          <p className="text-xl md:text-2xl text-foreground/70 font-light leading-relaxed">
            August Catering redefines gastronomy through hyper-curated dining experiences. We don't just cater events; we sculpt edible masterpieces using the finest ingredients known to Ernakulam.
          </p>
          
          <div className="pt-8">
            <button className="relative px-8 py-4 rounded-full border border-primary/50 text-foreground overflow-hidden group">
              <span className="relative z-10 font-bold tracking-widest uppercase text-sm">Experience The Menu</span>
              <div className="absolute inset-0 bg-primary translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
