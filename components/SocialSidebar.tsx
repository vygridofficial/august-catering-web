'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, Mail, MapPin, House, MessageCircle, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Instagram = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Facebook = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Globe = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
import { getSocialSettings } from '@/lib/actions/database';

export function SocialSidebar() {
  const [links, setLinks] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchSocial = async () => {
      const settings = (await getSocialSettings()) || {};
      
      const whatsapp = settings.whatsapp?.trim() || '919495184661';
      const phone = settings.phone?.trim() || '919495184661';
      const instagram = settings.instagram?.trim() || 'https://www.instagram.com/august_catering_/';
      const facebook = settings.facebook?.trim() || 'https://facebook.com/augustcatering';
      const email = settings.email?.trim() || 'hello@augustcatering.com';
      const location = settings.location?.trim() || 'https://maps.app.goo.gl/4U3iabZKjumwXa4fA';
      const justdial = 'https://www.justdial.com/Ernakulam/August-Catering-Kanjiramattom/0484PX484-X484-240913190445-D5I9_BZDET';

      const socialLinks = [
        {
          name: 'WhatsApp',
          icon: (props: any) => (
            <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          ),
          href: `https://wa.me/${whatsapp}`,
          color: 'hover:bg-[#25D366] hover:border-[#25D366]/50',
          textColor: 'hover:text-white',
          label: 'Chat on WhatsApp',
          active: !!whatsapp
        },
        {
          name: 'Call',
          icon: Phone,
          href: `tel:${phone}`,
          color: 'hover:bg-primary hover:border-primary/50',
          textColor: 'hover:text-primary-foreground',
          label: 'Call Us',
          active: !!phone
        },
        {
          name: 'Instagram',
          icon: Instagram,
          href: instagram,
          color: 'hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:border-[#ee2a7b]/50',
          textColor: 'hover:text-white',
          label: 'Follow on Instagram',
          active: !!instagram
        },
        {
          name: 'Facebook',
          icon: Facebook,
          href: facebook,
          color: 'hover:bg-[#1877F2] hover:border-[#1877F2]/50',
          textColor: 'hover:text-white',
          label: 'Follow on Facebook',
          active: !!facebook
        },
        {
          name: 'Email',
          icon: Mail,
          href: `mailto:${email}`,
          color: 'hover:bg-primary hover:border-primary/50',
          textColor: 'hover:text-primary-foreground',
          label: 'Email Us',
          active: !!email
        },
        {
          name: 'Location',
          icon: MapPin,
          href: location,
          color: 'hover:bg-primary hover:border-primary/50',
          textColor: 'hover:text-primary-foreground',
          label: 'View on Maps',
          active: !!location
        },
        {
          name: 'Justdial',
          icon: Globe,
          href: justdial,
          color: 'hover:bg-[#FF8A00] hover:border-[#FF8A00]/50',
          textColor: 'hover:text-white',
          label: 'View on Justdial',
          active: !!justdial
        }
      ].filter(link => link.active);

      const withHomeLink = pathname !== '/'
        ? [
            {
              name: 'Home',
              icon: House,
              href: '/',
              color: 'hover:bg-primary hover:border-primary/50',
              textColor: 'hover:text-primary-foreground',
              label: 'Back to Home',
              active: true,
              external: false,
            },
            ...socialLinks,
          ]
        : socialLinks;

      setLinks(withHomeLink);
    };
    fetchSocial();
  }, [pathname]);

  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null;
  }

  if (links.length === 0) return null;

  const mobileLinks = links.slice(0, 5);

  return (
    <>
      <div className="fixed right-4 bottom-4 z-[100] md:hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="mb-3 flex flex-col gap-2 items-end"
            >
              {mobileLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target={link.external === false ? undefined : '_blank'}
                  rel={link.external === false ? undefined : 'noopener noreferrer'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: index * 0.04 }}
                  className={`group flex items-center gap-3 rounded-full bg-background/90 backdrop-blur-2xl border border-foreground/10 text-foreground/80 px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.16)] ${link.color} ${link.textColor}`}
                  title={link.label}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <link.icon className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-semibold whitespace-nowrap">{link.label}</span>
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl shadow-primary/30 border border-primary/20"
          aria-label={isOpen ? 'Close social links' : 'Open social links'}
        >
          {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        </button>
      </div>

      <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col gap-3">
        {links.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.href}
            target={link.external === false ? undefined : '_blank'}
            rel={link.external === false ? undefined : 'noopener noreferrer'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            whileHover={{ x: -8, scale: 1.1 }}
            className={`group relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-background/40 backdrop-blur-2xl border border-foreground/10 text-foreground/70 transition-all duration-300 ${link.color} ${link.textColor} shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-2xl`}
            title={link.label}
          >
            <link.icon className="w-5 h-5" />

            <span className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-foreground text-background text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none translate-x-2 group-hover:translate-x-0 duration-300 shadow-2xl z-[101]">
              {link.label}
            </span>
          </motion.a>
        ))}
      </div>
    </>
  );
}
