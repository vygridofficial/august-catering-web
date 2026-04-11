"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSocialSettings } from "@/lib/actions/database";
import Image from "next/image";

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
  const email = settings?.email || "info@gatewaykitchen.in";
  const phoneHref = `tel:${String(phone).replace(/[^+\d]/g, "")}`;
  const emailHref = `mailto:${email}`;

  return (
    <footer className="bg-foreground text-background py-20 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="col-span-1 lg:col-span-2">
            <div className="relative w-52 h-24 mb-6">
              <Image
                src="/logo-1.png"
                alt="Gateway Kitchen"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <p className="text-background/60 max-w-sm text-lg font-light leading-relaxed">
              Elevating every occasion serving premium gastronomy for over 21
              years across Ernakulam.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-primary">
              Quick Links
            </h4>
            <ul className="space-y-4 text-background/80">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="hover:text-white transition-colors"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="hover:text-white transition-colors"
                >
                  Book Event
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="hover:text-white transition-colors"
                >
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-primary">Contact</h4>
            <ul className="space-y-4 text-background/80">
              <li>Thiruvaniyoor, Ernakulam</li>
              <li>
                <a
                  href={phoneHref}
                  className="hover:text-white transition-colors"
                >
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={emailHref}
                  className="hover:text-white transition-colors"
                >
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/50 font-light text-sm">
            © {new Date().getFullYear()} Gateway Kitchen Caterers. All rights
            reserved.
          </p>
          <p className="text-background/50 font-light text-sm">
            Powered by Vygrid
          </p>
          <div className="flex gap-6 text-sm font-light">
            <Link
              href="/privacy"
              className="text-background/50 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-background/50 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 left-6 w-48 h-48 md:w-64 md:h-64 opacity-[0.08] pointer-events-none select-none">
        <Image
          src="/logo-1.png"
          alt="Gateway Kitchen mark"
          fill
          className="object-contain"
        />
      </div>
    </footer>
  );
}
