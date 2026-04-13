'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

export function Header() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/login');
  const isHomeRoute = pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScroll, setPrevScroll] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 50);
      
      // Hide on scroll down, show on scroll up
      if (currentScroll > 100) {
        setVisible(currentScroll < prevScroll);
      } else {
        setVisible(true);
      }
      
      setPrevScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScroll]);

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
      e.preventDefault();
      const id = href.slice(2);
      if (pathname === '/') {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
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

  if (isAdminRoute) return null;

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: visible ? 0 : "-120%", 
          opacity: visible ? 1 : 0,
        }}
        transition={{ 
          y: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.4 },
        }}
        className={`fixed top-0 left-0 right-0 z-[100] font-outfit transition-all duration-500 ${scrolled ? 'py-2 md:py-4' : 'py-4 md:py-10'} ${isHomeRoute ? 'lg:hidden' : ''}`}
      >
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="relative px-4 md:px-8 py-3 md:py-4 rounded-3xl md:rounded-[2rem] border overflow-hidden flex items-center justify-between">
            {/* Liquid Background */}
            <motion.div 
               animate={{ 
                 backgroundColor: scrolled ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0)",
                 backdropFilter: scrolled ? "blur(24px)" : "blur(0px)",
                 borderColor: scrolled ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0)",
               }}
               className="absolute inset-0 z-[-1]"
            />
            <Link href="/" onClick={handleHomeClick} className="flex items-center gap-3 md:gap-4 group relative">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl md:rounded-[1.5rem] overflow-hidden border border-white/20 group-hover:border-primary/50 transition-all duration-700 bg-black shadow-2xl">
                <Image
                  src="/logo.jpeg"
                  alt="August Catering Logo"
                  fill
                  className="object-contain p-1 saturate-[0.8] group-hover:saturate-100 transition-all duration-700"
                  priority
                />
              </div>
              <div className="flex flex-col">
                  <span className="text-lg md:text-xl font-heading font-black tracking-tighter text-white leading-none">AUGUST</span>
                  <span className="text-[8px] md:text-[10px] font-bold tracking-widest text-primary uppercase mt-1">CATERING</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-12">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="group relative py-2"
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-white/90 group-hover:text-primary transition-colors duration-500">
                    {link.name}
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:w-full" />
                </Link>
              ))}
              
              <Link href="/book">
                <button className="relative px-8 py-3 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-wider overflow-hidden group hover:scale-[1.05] active:scale-[0.98] transition-all shadow-2xl">
                  <span className="relative z-10 flex items-center gap-2">
                    Book Now <ArrowUpRight size={14} />
                  </span>
                  <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                </button>
              </Link>
            </nav>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all shadow-xl"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={20} className="md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#050505] flex flex-col font-outfit"
          >
            <div className="absolute inset-0 pointer-events-none z-0">
               <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-150 contrast-150" />
               <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 py-12 flex justify-between items-center relative z-10">
              <Link href="/" className="flex items-center gap-4" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="relative w-16 h-16 rounded-2xl border border-white/20 overflow-hidden bg-black">
                  <Image
                    src="/logo.jpeg"
                    alt="August Catering Logo"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex flex-col">
                    <span className="text-white font-black tracking-tighter uppercase leading-none">AUGUST</span>
                    <span className="text-[8px] text-primary font-bold uppercase tracking-widest mt-1">CATERING</span>
                </div>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col flex-1 justify-center px-6 relative z-10">
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-8">Navigation</p>
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className="group flex items-end gap-4 py-4"
                    >
                      <span className="text-white/10 group-hover:text-primary font-bold transition-colors duration-500">0{idx + 1}</span>
                      <span className="text-6xl sm:text-7xl font-heading font-black text-white hover:text-primary transition-all duration-500 uppercase tracking-tighter leading-none">
                        {link.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>

            <div className="p-8 border-t border-white/5 relative z-10 flex flex-col gap-8 bg-black/60 backdrop-blur-3xl">
              <Link
                href="/book"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <button className="w-full bg-primary text-black py-6 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]">
                  Book Your Event <Sparkles size={16} />
                </button>
              </Link>
              <div className="flex items-center justify-between text-white/20">
                  <p className="text-[10px] font-bold uppercase tracking-widest">© 2026 AUGUST CATERING.</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest italic font-serif">Kerala&rsquo;s Premier Caterer</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
