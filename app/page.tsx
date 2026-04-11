import { MagneticHero } from '@/components/3d/MagneticHero';
import { FloatingDock } from '@/components/layout/FloatingDock';
import { LiquidAbout } from '@/components/sections/LiquidAbout';
import { ServicesShowcase } from '@/components/ServicesShowcase';
import { GallerySection } from '@/components/GallerySection';
import { TestimonialsMarquee } from '@/components/TestimonialsMarquee';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <>
      {/* 3D Hero Orchestrator */}
      <MagneticHero />
      
      {/* ScrollTrigger GSAP Sections */}
      <div className="relative z-10 bg-background text-foreground">
        <LiquidAbout />
        
        {/* We keep the old core ones but they are now integrated below the GSAP parallax flow */}
        <ServicesShowcase />
        <GallerySection />
        <TestimonialsMarquee />
        <Footer />
      </div>

      {/* Global Navigation Override */}
      <FloatingDock />
    </>
  );
}
