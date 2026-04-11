'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { House, Menu, X } from 'lucide-react';
import Image from 'next/image';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleSmoothScroll = useCallback((e: React.MouseEvent, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault(); // Always prevent default to avoid double-navigation
      const id = href.slice(2);
      if (pathname === '/') {
        // Already on home — just smooth scroll
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Navigate to home page first; hash in URL will trigger native scroll on load
        router.push(href);
      }
    }
    setIsMobileMenuOpen(false);
  }, [pathname, router]);

  const handleHomeClick = useCallback((e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Menu', href: '/menu' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || pathname !== '/' ? 'bg-background/90 backdrop-blur-xl border-b border-border shadow-sm' : 'py-2 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-16 h-16 md:w-26 md:h-26 group-hover:scale-105 transition-transform">
            <Image
              src="/logo.jpeg"
              alt="August Catering Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <Link
            href="/"
            onClick={handleHomeClick}
            className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/60 transition-colors"
            aria-label="Go to homepage"
          >
            <House size={16} />
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="text-[13px] font-bold uppercase tracking-[0.15em] text-foreground/60 hover:text-primary transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
          <Link href="/book">
            <button className="bg-primary ml-60 text-primary-foreground px-8 py-3.5 rounded-full text-[13px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
              Book Event
            </button>
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={28} />
        </button>
      </div>
    </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-background flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="relative w-24 h-24">
                  <Image
                    src="/logo.jpeg"
                    alt="August Catering Logo"
                    fill
                    className="object-contain border border-amber-500/20 rounded-full"
                  />
                </div>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-foreground/60 hover:text-foreground">
                <X size={32} />
              </button>
            </div>

            <nav className="flex flex-col gap-8">
              <Link
                href="/"
                onClick={handleHomeClick}
                className="flex items-center gap-3 text-4xl font-heading font-bold text-foreground hover:text-primary transition-colors"
              >
                <House size={32} /> Home
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="text-4xl font-heading font-bold text-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/book"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4"
              >
                <button className="w-full bg-primary text-primary-foreground py-4 sm:py-6 rounded-3xl text-base sm:text-xl font-bold uppercase tracking-widest shadow-2xl shadow-primary/30">
                  Book Event
                </button>
              </Link>
            </nav>

            <div className="mt-auto border-t border-border pt-8 flex flex-col gap-4 text-foreground/40 text-sm">
              <p>© 2026 August Catering</p>
              <p>Authentic Flavors, Memorable Events</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
