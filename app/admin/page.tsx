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
  Loader2 
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
      setStats(statsData);
      setRecent(recentData);
      setLoading(false);
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { 
      label: 'New Bookings', 
      value: stats.newBookings, 
      icon: CalendarCheck, 
      color: 'bg-emerald-500', 
      href: '/admin/bookings' 
    },
    { 
      label: 'Total Bookings', 
      value: stats.totalBookings, 
      icon: ClipboardList, 
      color: 'bg-emerald-500', 
      href: '/admin/bookings' 
    },
    { 
      label: 'New Enquiries', 
      value: stats.newEnquiries, 
      icon: Users, 
      color: 'bg-emerald-500', 
      href: '/admin/enquiries' 
    },
    { 
      label: 'Menu Items', 
      value: stats.menuItems, 
      icon: Utensils, 
      color: 'bg-emerald-500', 
      href: '/admin/menu' 
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-5xl font-heading font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-foreground/60 text-lg">Welcome back. Here's what's happening with August Catering today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link 
              href={stat.href}
              className="block group p-8 bg-background/40 backdrop-blur-xl border border-border rounded-[2.5rem] hover:border-primary/50 transition-all duration-500 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className={`${stat.color} p-4 rounded-2xl shadow-lg shadow-black/5`}>
                  <stat.icon className="text-white" size={28} />
                </div>
                <ArrowRight className="text-foreground/20 group-hover:text-primary transition-colors group-hover:translate-x-1 shrink-0" size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold uppercase tracking-widest text-foreground/40">{stat.label}</p>
                <p className="text-5xl font-heading font-bold tracking-tighter">{stat.value}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <section className="bg-background/40 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 lg:p-12 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Clock className="text-primary" size={24} />
            <h2 className="text-3xl font-heading font-bold">Recent Enquiries</h2>
          </div>
          <Link href="/admin/enquiries" className="text-sm font-bold uppercase tracking-widest text-primary hover:opacity-70 transition-opacity">
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {recent.length === 0 ? (
            <div className="py-20 text-center text-foreground/40 border border-dashed rounded-3xl">
              No recent enquiries yet.
            </div>
          ) : (
            recent.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-background/60 rounded-3xl border border-border/50 group hover:border-primary/20 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                    {item.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg leading-none mb-1 truncate" title={item.name}>{item.name}</h3>
                    <p className="text-sm text-foreground/40 break-all" title={item.email}>{item.email}</p>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-end shrink-0">
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground/30 mb-1">Event Type</span>
                  <p className="font-medium">{item.phone || 'Standard Enquiry'}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0 self-start sm:self-auto">
                  <CheckCircle2 className="text-emerald-500/40 group-hover:text-emerald-500 transition-colors" size={20} />
                  <Link href="/admin/enquiries">
                    <button className="p-3 bg-border/30 rounded-xl hover:bg-primary hover:text-white transition-all shrink-0">
                      <ArrowRight size={18} />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
