import { Header } from '@/components/Header';
import { AboutSection } from '@/components/AboutSection';
import { ServicesShowcase } from '@/components/ServicesShowcase';
import { TestimonialsMarquee } from '@/components/TestimonialsMarquee';
import { Footer } from '@/components/Footer';
import { MouseGlow } from '@/components/MouseGlow';
import { HeroContent } from '@/components/HeroContent';
import { GallerySection } from '@/components/GallerySection';
import { AuroraBackground } from '@/components/AuroraBackground';

export default function Home() {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <AuroraBackground className="min-h-[100svh] md:min-h-screen">
        <MouseGlow />
        <HeroContent />
      </AuroraBackground>
      
      <div className="relative z-10 bg-background text-foreground">
        <AboutSection />
        <ServicesShowcase />
        <GallerySection />
        <TestimonialsMarquee />
        <Footer />
      </div>
    </>
  );
}
