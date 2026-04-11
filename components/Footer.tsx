'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSocialSettings } from "@/lib/actions/database";
import Image from "next/image";
import { motion } from "framer-motion";

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
  const email = settings?.email || "info@augustcatering.com";
  const phoneHref = `tel:${String(phone).replace(/[^+\d]/g, "")}`;
  const emailHref = `mailto:${email}`;

  return (
    <footer className="bg-[#080808] text-foreground py-24 relative overflow-hidden border-t border-white/5">
      {/* Cinematic Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="noiseFooter"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch"/></filter>
          <rect width="100%" height="100%" filter="url(#noiseFooter)"/>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24">
          <div className="col-span-1 lg:col-span-2 space-y-8">
            <Link href="/" className="inline-block">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border border-white/10 group">
                <Image
                  src="/logo.jpeg"
                  alt="August Catering Logo"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
              </div>
            </Link>
            <div className="space-y-4">
               <h3 className="text-3xl font-heading font-black tracking-tighter text-white">AUGUST <span className="text-primary italic">CATERING</span></h3>
               <p className="text-foreground/40 max-w-sm text-lg font-light leading-relaxed font-outfit">
                 Crafting unforgettable culinary memories since 2003. We engineer premium gastronomy experiences for the most discerning palates.
               </p>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">
              Quick Links
            </h4>
            <ul className="space-y-3 text-lg font-light font-outfit">
              {['Home', 'About', 'Services', 'Menu', 'Gallery', 'Contact'].map((label) => (
                <li key={label}>
                  <Link
                    href={label === 'Home' ? '/' : `/${label.toLowerCase()}`}
                    className="text-foreground/40 hover:text-primary transition-all duration-300 hover:pl-2"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">Contact</h4>
            <ul className="space-y-4 text-lg font-light font-outfit">
              <li className="text-foreground/60 leading-tight">Thiruvaniyoor,<br/> Ernakulam, Kerala</li>
              <li>
                <a
                  href={phoneHref}
                  className="text-foreground/40 hover:text-primary transition-all duration-300"
                >
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={emailHref}
                  className="text-foreground/40 hover:text-primary transition-all duration-300"
                >
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
             <p className="text-foreground/20 font-bold text-[10px] uppercase tracking-widest">
               © {new Date().getFullYear()} AUGUST CATERING SERVICES.
             </p>
             <p className="text-foreground/10 text-[9px] uppercase tracking-widest">
               SCULPTED BY VYGRID
             </p>
          </div>
          
          <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-foreground/20">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
