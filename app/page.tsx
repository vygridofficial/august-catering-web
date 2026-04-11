import { MagneticHero } from '@/components/3d/MagneticHero';
import { LiquidAbout } from '@/components/sections/LiquidAbout';
import { ServicesShowcase } from '@/components/ServicesShowcase';
import { GallerySection } from '@/components/GallerySection';
import { TestimonialsMarquee } from '@/components/TestimonialsMarquee';

export default function Home() {
  return (
    <>
      {/* 3D Hero Orchestrator */}
      <MagneticHero />
      
      {/* ScrollTrigger GSAP Sections */}
      <div className="relative z-10 bg-background text-foreground">
        <LiquidAbout />
        <ServicesShowcase />
        <GallerySection />
        <TestimonialsMarquee />
      </div>
    </>
  );
}
