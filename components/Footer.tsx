'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSocialSettings } from "@/lib/actions/database";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";

const Instagram = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);


export function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSocialSettings();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  const phone = settings?.phone || "+91 94951 84661";
  const email = settings?.email || "info@augustcatering.in";
  const phoneHref = `tel:${String(phone).replace(/[^+\d]/g, "")}`;
  const emailHref = `mailto:${email}`;

  const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Menu', href: '/menu' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="bg-[#050505] text-white py-16 md:py-32 relative overflow-hidden border-t border-white/5 font-outfit">
      {/* Cinematic Grain & Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-150 contrast-150" />
      <div className="absolute top-[-20%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/5 blur-[100px] md:blur-[140px] rounded-full" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 md:gap-16 lg:gap-24 items-start">
          
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-5 space-y-8 md:space-y-12">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden border border-white/10 group-hover:border-primary/50 transition-all duration-700">
                  <Image
                    src="/logo.jpeg"
                    alt="August Catering Logo"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 saturate-[0.8] group-hover:saturate-100"
                    priority
                  />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-heading font-black tracking-tighter text-white leading-none">AUGUST</h3>
                  <p className="text-[8px] md:text-[10px] font-bold tracking-widest text-primary uppercase mt-1">CATERING</p>
                </div>
              </div>
            </Link>
            
            <p className="text-white/40 max-w-md text-lg md:text-xl font-medium leading-[1.6]">
              Delivering exceptional culinary experiences and meticulously choreographed events since 2003. Kerala's premier catering service.
            </p>
            
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: settings?.instagram || "https://instagram.com/augustcatering" },
                { icon: Facebook, href: settings?.facebook || "https://facebook.com/augustcatering" },
                { icon: MessageCircle, href: `https://wa.me/${settings?.whatsapp || '919495184661'}` }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href} 
                  target="_blank" 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-500"
                >
                  <social.icon size={18} className="md:w-5 md:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-6 md:space-y-10">
            <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-primary/60">Our Links</h4>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-white/40 hover:text-white transition-all duration-500 text-base md:text-lg font-bold"
                  >
                    <span className="hidden md:block w-0 group-hover:w-4 h-px bg-primary transition-all duration-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-4 space-y-8 md:space-y-10">
            <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-primary/60">Contact Us</h4>
            <div className="space-y-6 md:space-y-8">
              <a href={emailHref} className="group block">
                <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-white/20 mb-2">Email Us</p>
                <div className="flex items-center justify-between border-b border-white/5 pb-3 md:pb-4 group-hover:border-primary/50 transition-colors">
                  <span className="text-lg md:text-xl font-bold text-white/60 group-hover:text-white transition-colors truncate">{email}</span>
                  <ArrowUpRight size={16} className="text-white/20 group-hover:text-primary transition-all" />
                </div>
              </a>
              <a href={phoneHref} className="group block">
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/20 mb-2">Call Us</p>
                <div className="flex items-center justify-between border-b border-white/5 pb-4 group-hover:border-primary/50 transition-colors">
                  <span className="text-xl font-bold text-white/60 group-hover:text-white transition-colors">{phone}</span>
                  <ArrowUpRight size={18} className="text-white/20 group-hover:text-primary transition-all" />
                </div>
              </a>
              <div className="group block cursor-default">
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/20 mb-2">Visit Us</p>
                <div className="text-lg font-bold text-white/40 leading-tight">
                  Thiruvaniyoor, Kochi <br />
                  Kerala, India
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-40 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2">
             <p className="text-white/20 font-bold text-[9px] uppercase tracking-wider">
               © {new Date().getFullYear()} August Catering. All Rights Reserved.
             </p>
             <p className="text-white/10 text-[8px] font-bold uppercase tracking-widest mt-1">
               Designed by <span className="text-primary/40 hover:text-primary transition-colors cursor-pointer">Vygrid</span>
             </p>
          </div>
          
          <div className="flex gap-12 text-[10px] font-bold uppercase tracking-widest text-white/20">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

