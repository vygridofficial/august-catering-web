'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, Mail, MapPin, House, MessageCircle, X, ArrowRight, Share2, Terminal } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getSocialSettings } from '@/lib/actions/database';

const Instagram = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Facebook = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Globe = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

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
          color: 'group-hover:text-[#25D366]',
          glow: 'bg-[#25D366]/5',
          label: 'WhatsApp Status',
          active: !!whatsapp
        },
        {
          name: 'Call',
          icon: Phone,
          href: `tel:${phone}`,
          color: 'group-hover:text-primary',
          glow: 'bg-primary/5',
          label: 'Direct Frequency',
          active: !!phone
        },
        {
          name: 'Instagram',
          icon: Instagram,
          href: instagram,
          color: 'group-hover:text-[#ee2a7b]',
          glow: 'bg-[#ee2a7b]/5',
          label: 'Visual Archive',
          active: !!instagram
        },
        {
          name: 'Facebook',
          icon: Facebook,
          href: facebook,
          color: 'group-hover:text-[#1877F2]',
          glow: 'bg-[#1877F2]/5',
          label: 'Community Node',
          active: !!facebook
        },
        {
          name: 'Location',
          icon: MapPin,
          href: location,
          color: 'group-hover:text-primary',
          glow: 'bg-primary/5',
          label: 'Navigational Coordinate',
          active: !!location
        }
      ].filter(link => link.active);

      const withHomeLink = pathname !== '/'
        ? [
            {
              name: 'Home',
              icon: House,
              href: '/',
              color: 'group-hover:text-primary',
              glow: 'bg-primary/5',
              label: 'Return Home',
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

  return (
    <>
      {/* Cinematic Mobile HUD */}
      <div className="fixed right-4 bottom-4 z-[200] md:hidden">
        <AnimatePresence>
          {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="mb-4 flex flex-col gap-3 items-end"
              >
                {links.map((link, index) => (
                  <motion.a
                  key={link.name}
                  href={link.href}
                  target={link.external === false ? undefined : '_blank'}
                  rel={link.external === false ? undefined : 'noopener noreferrer'}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setIsOpen(false)}
                    className="flex min-w-[164px] items-center justify-between gap-3 py-2.5 px-3.5 rounded-xl bg-black/70 backdrop-blur-3xl border border-white/10 text-white/70 active:bg-primary/10 active:text-primary transition-all shadow-2xl"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em]">{link.name}</span>
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                      <link.icon className="w-4 h-4" />
                    </div>
                  </motion.a>
                ))}
              </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-2xl bg-primary text-black flex items-center justify-center shadow-[0_0_35px_rgba(255,183,0,0.2)] border border-primary/20 relative z-10"
        >
          {isOpen ? <X size={22} /> : <Terminal size={22} />}
        </motion.button>
      </div>

      {/* Cinematic Desktop Sidebar - Signal Array */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[200] hidden md:flex flex-col gap-5 font-outfit">
        {links.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.href}
            target={link.external === false ? undefined : '_blank'}
            rel={link.external === false ? undefined : 'noopener noreferrer'}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 1, duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="group relative w-14 h-14 flex items-center justify-center rounded-2xl bg-white/[0.01] backdrop-blur-3xl border border-white/5 text-white/20 transition-all duration-700 hover:border-primary/30 hover:shadow-[0_0_40px_rgba(255,183,0,0.05)]"
            title={link.label}
          >
            {/* Visual Echo */}
            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${link.glow} blur-xl`} />
            
            <link.icon className={`w-5 h-5 relative z-10 transition-all duration-500 ${link.color} group-hover:scale-110`} />

            {/* Matrix Tooltip */}
            <div className="absolute right-full mr-8 px-5 py-3 rounded-xl bg-black/80 backdrop-blur-3xl border border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none translate-x-4 group-hover:translate-x-0 overflow-hidden min-w-[180px]">
                <div className="absolute left-0 top-0 w-[2px] h-full bg-primary" />
                <p className="text-[8px] font-black uppercase tracking-[0.5em] text-primary/40 mb-1">Signal Protocol</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap">
                  {link.label}
                </p>
                {/* Micro-shimmer */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1500ms]" />
            </div>
          </motion.a>
        ))}
        
        {/* Connection Tether */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-t from-transparent via-white/5 to-transparent" />
      </div>
    </>
  );
}
