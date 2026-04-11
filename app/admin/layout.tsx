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
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { getUnreadNotificationCount } from '@/lib/actions/database';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    };
    loadUnreadCount();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Securely logged out.');
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
    { name: 'Social & Contact', href: '/admin/social', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-background/50 overflow-hidden relative" suppressHydrationWarning>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-20 border-b border-border/50 bg-background/60 backdrop-blur-xl flex items-center justify-between px-6 z-40">
        <div className="relative w-16 h-16">
          <img 
            src="/logo-1.png" 
            alt="August Catering Admin" 
            className="object-contain filter drop-shadow-lg"
          />
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-foreground/60 hover:text-primary transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Overlay (Mobile Only) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-[60] w-72 bg-background/80 backdrop-blur-2xl border-r border-border/50 flex flex-col py-8 transition-transform duration-500 ease-out overflow-y-auto
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between px-8 mb-12">
          <Link href="/" className="flex flex-col items-start">
            <div className="relative w-28 h-28 -mt-4 -mb-2">
              <img 
                src="/logo-1.png" 
                alt="August Catering" 
                className="object-contain filter drop-shadow-xl"
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/30 ml-2">Control Center</span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 text-foreground/40 hover:text-foreground self-start mt-2"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex flex-col gap-2 w-full px-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const showUnread = link.href === '/admin/notifications' && unreadCount > 0;
            return (
              <Link 
                key={link.name}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center justify-between px-6 py-4 rounded-[1.25rem] transition-all duration-300 font-bold text-sm
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]' 
                    : 'text-foreground/40 hover:bg-foreground/5 hover:text-foreground'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <link.icon size={20} />
                  <span className="flex items-center gap-2">
                    {link.name}
                    {showUnread ? (
                      <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-primary/15 px-1 text-[10px] font-black text-primary">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    ) : null}
                  </span>
                </div>
                {isActive && <ChevronRight size={14} className="opacity-50" />}
              </Link>
            );
          })}
          
          <div className="mt-8 pt-8 border-t border-border/50">
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-4 px-6 py-4 rounded-[1.25rem] text-destructive hover:bg-destructive/10 transition-all font-bold text-sm w-full"
            >
              <LogOut size={20} /> Secure Logout
            </button>
          </div>
        </nav>
        
        <div className="mt-auto px-10 text-[10px] font-bold uppercase tracking-widest text-foreground/20">
          v1.0.4 PRODUCTION
        </div>
      </aside>

      {/* Main Content Arena */}
      <main className="flex-1 overflow-y-auto overscroll-y-contain pt-28 pb-12 px-6 md:p-12 lg:p-20 custom-scrollbar w-full">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
