'use client';

import { useState, useEffect } from 'react';
import { getDashboardStats, getRecentActivity } from '@/lib/actions/database';
import { 
  Users, 
  Utensils, 
  CalendarCheck,
  ClipboardList,
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Loader2,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ newBookings: 0, totalBookings: 0, newEnquiries: 0, menuItems: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const [statsData, recentData] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(5)
      ]);
      setStats(statsData || { newBookings: 0, totalBookings: 0, newEnquiries: 0, menuItems: 0 });
      setRecent(recentData || []);
      setLoading(false);
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { 
      label: 'New Bookings', 
      value: stats.newBookings, 
      icon: CalendarCheck, 
      glow: 'shadow-emerald-500/10',
      href: '/admin/bookings',
      desc: 'Pending verification'
    },
    { 
      label: 'System Reach', 
      value: stats.totalBookings, 
      icon: TrendingUp, 
      glow: 'shadow-primary/10',
      href: '/admin/bookings',
      desc: 'Total events orchestrated'
    },
    { 
      label: 'Active Enquiries', 
      value: stats.newEnquiries, 
      icon: Users, 
      glow: 'shadow-amber-500/10',
      href: '/admin/enquiries',
      desc: 'Across all platforms'
    },
    { 
      label: 'Culinary Assets', 
      value: stats.menuItems, 
      icon: Utensils, 
      glow: 'shadow-blue-500/10',
      href: '/admin/menu',
      desc: 'Global menu items'
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Syncing Intelligence...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 py-4">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(255,204,0,0.8)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Live Stats Overview</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-heading font-black tracking-tighter text-white leading-[0.9]">
            August <span className="text-primary italic">Dynamics</span>
          </h1>
          <p className="mt-4 text-white/40 text-lg font-medium max-w-xl">
            Monitoring the pulse of gastronomy. Your command center for every event, catering inquiry, and culinary asset.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/settings">
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all">
              Config
            </button>
          </Link>
        </div>
      </header>

      {/* Stats Grid - High Density Liquid Glass */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
          >
            <Link 
              href={stat.href}
              className={`group block relative p-10 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-700 ${stat.glow}`}
            >
              <div className="absolute top-8 right-8">
                <stat.icon className="text-primary/20 group-hover:text-primary transition-all group-hover:rotate-12 duration-500" size={32} />
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">{stat.label}</p>
                  <p className="text-6xl font-heading font-black tracking-tighter text-white group-hover:scale-[1.05] transition-transform duration-700 origin-left">
                    {stat.value}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                  <Activity size={10} className="text-primary" />
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{stat.desc}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity - Command Center Style */}
      <section className="relative p-1 bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative p-8 lg:p-12 bg-[#050505]/95 backdrop-blur-xl rounded-[2.9rem] border border-white/5">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                <Clock className="text-primary" size={24} />
              </div>
              <div>
                <h2 className="text-4xl font-heading font-black text-white tracking-tight">Recent Intelligence</h2>
                <p className="text-xs font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Real-time catering signal monitoring</p>
              </div>
            </div>
            <Link href="/admin/enquiries" className="group/link flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10 hover:border-primary/40 transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover/link:text-primary transition-colors">Manifest All</span>
              <ArrowRight size={14} className="text-white/20 group-hover/link:translate-x-1 transition-transform group-hover/link:text-primary" />
            </Link>
          </div>

          <div className="grid gap-4">
            {recent.length === 0 ? (
              <div className="py-24 text-center text-white/10 italic font-medium tracking-widest bg-white/[0.01] rounded-[2rem] border border-dashed border-white/5 uppercase text-[10px]">
                No active signals detected in system buffer.
              </div>
            ) : (
              recent.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-8 bg-white/[0.02] hover:bg-white/[0.04] rounded-[2rem] border border-white/5 group/item hover:border-primary/20 transition-all duration-500"
                >
                  <div className="flex items-center gap-6 min-w-0 flex-1">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-white/5 flex items-center justify-center text-primary font-black text-2xl group-hover/item:scale-105 transition-transform">
                      {item.name?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-extrabold text-xl text-white tracking-tight truncate" title={item.name}>{item.name}</h3>
                        <span className="px-2 py-0.5 bg-white/5 rounded-md text-[8px] font-black text-white/30 uppercase tracking-widest border border-white/5">Verified</span>
                      </div>
                      <p className="text-sm text-white/30 font-medium truncate" title={item.email}>{item.email}</p>
                    </div>
                  </div>
                  
                  <div className="hidden lg:flex flex-col items-center px-12 border-x border-white/5">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Signal Meta</span>
                    <p className="font-bold text-white/50 text-sm tracking-wide">{item.phone || 'Standard Handshake'}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Status</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-500/40 group-hover/item:text-emerald-500 transition-colors" size={14} />
                        <span className="text-xs font-bold text-emerald-500/60 uppercase group-hover/item:text-emerald-500">Processed</span>
                      </div>
                    </div>
                    <Link href="/admin/enquiries" className="shrink-0">
                      <button className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-white/20 group-hover/item:bg-primary group-hover/item:text-black group-hover/item:border-primary transition-all">
                        <ArrowRight size={22} className="group-hover/item:scale-110" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

