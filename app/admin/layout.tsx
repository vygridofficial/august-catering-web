'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Utensils, 
  MessageSquare, 
  CalendarCheck,
  Bell,
  Settings,
  Image as ImageIcon, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { getUnreadNotificationCount } from '@/lib/actions/database';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count || 0);
    };
    loadUnreadCount();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('System secured. Logged out.');
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Hero Banners', href: '/admin/hero', icon: ImageIcon },
    { name: 'Event Categories', href: '/admin/events', icon: LayoutDashboard },
    { name: 'Culinary Styles', href: '/admin/culinary', icon: Utensils },
    { name: 'Services CMS', href: '/admin/services', icon: LayoutDashboard },
    { name: 'Menu Items', href: '/admin/menu', icon: Utensils },
    { name: 'Client Reviews', href: '/admin/reviews', icon: MessageSquare },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
    { name: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Media Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Social Links', href: '/admin/social', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden relative font-outfit selection:bg-primary selection:text-black" suppressHydrationWarning>
      
      {/* Cinematic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/3 blur-[100px] rounded-full" />
      </div>

      {/* Mobile Top Bar - Liquid Glass */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 md:h-20 border-b border-white/5 bg-[#050505]/40 backdrop-blur-2xl flex items-center justify-between px-4 md:px-6 z-40">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 md:w-10 md:h-10">
            <Image 
              src="/logo.jpeg" 
              alt="August" 
              fill
              className="object-contain rounded-full border border-white/10"
            />
          </div>
          <span className="font-heading font-black text-white text-base md:text-lg tracking-tighter uppercase">August</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-white/60 hover:text-primary transition-colors bg-white/5 rounded-xl border border-white/10"
        >
          <Menu size={18} className="md:w-5 md:h-5" />
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[50] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Drawer - Dark Chrome */}
      <aside className={`
        fixed inset-y-0 left-0 z-[60] w-72 bg-[#080808]/80 backdrop-blur-3xl border-r border-white/5 flex flex-col py-8 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="px-8 mb-8 md:mb-12 flex items-center justify-between">
          <Link href="/" className="flex flex-col items-start translate-x-[-10%] group">
            <div className="relative w-20 h-20 md:w-24 md:h-24 mb-2 group-hover:scale-105 transition-transform">
              <Image 
                src="/logo.jpeg" 
                alt="August Catering" 
                fill
                className="object-contain filter brightness-110"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <ShieldCheck size={10} className="text-primary" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Command Center</span>
            </div>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-white/20 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex flex-col gap-1 w-full px-4 overflow-y-auto custom-scrollbar flex-grow pb-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const showUnread = link.href === '/admin/notifications' && unreadCount > 0;
            return (
              <Link 
                key={link.name}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  relative flex items-center justify-between px-4 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-500 font-bold text-[11px] md:text-[13px] uppercase tracking-wider
                  ${isActive 
                    ? 'bg-primary text-black shadow-[0_10px_30px_rgba(255,204,0,0.15)] scale-[1.02]' 
                    : 'text-white/30 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <div className="flex items-center gap-3 md:gap-4 relative z-10">
                  <link.icon size={isActive ? 18 : 16} className={isActive ? 'text-black' : 'text-primary/60'} />
                  <span className="flex items-center gap-2">
                    {link.name}
                    {showUnread ? (
                      <span className="inline-flex min-w-4 md:min-w-5 h-4 md:h-5 items-center justify-center rounded-full bg-white text-[9px] md:text-[10px] font-black text-black">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    ) : null}
                  </span>
                </div>
                {isActive && (
                  <motion.div layoutId="nav-active" className="absolute inset-0 bg-primary rounded-xl md:rounded-2xl z-0" />
                )}
                {isActive && <ChevronRight size={14} className="opacity-40 hidden md:block relative z-10" />}
              </Link>
            );
          })}
          
          <div className="mt-8 pt-8 border-t border-white/5">
            <button 
              onClick={handleLogout} 
              className="group flex items-center gap-4 px-6 py-5 rounded-2xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all font-black text-[13px] uppercase tracking-wider w-full"
            >
              <LogOut size={18} className="group-hover:rotate-12 transition-transform" /> 
              Secure Exit
            </button>
          </div>
        </nav>
        
        <div className="mt-auto px-10 text-[9px] font-black uppercase tracking-[0.3em] text-white/10 italic">
          v2.0.1 // Cinematic Edition
        </div>
      </aside>

      {/* Main Content Arena */}
      <main className="flex-1 overflow-y-auto overscroll-y-contain pt-24 md:pt-28 pb-12 px-4 md:px-12 lg:px-16 custom-scrollbar w-full relative z-10">
        <motion.div 
          key={pathname}
          initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-7xl mx-auto w-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

