'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, BellOff, CheckCheck, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/lib/actions/database';

type NotificationItem = {
  id: string;
  type: 'booking' | 'enquiry';
  title: string;
  description?: string;
  target?: string;
  sourceId?: string;
  isRead: boolean;
  createdAt: number | null;
};

function formatTime(value: number | null) {
  if (!value) return 'Just now';
  const date = new Date(value);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const res = await getNotifications(50);
      if (!mounted) return;
      setItems(res as NotificationItem[]);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleRead = async (id: string) => {
    const res = await markNotificationRead(id);
    if (!res.success) {
      toast.error('Could not update notification.');
      return;
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
  };

  const handleReadAll = async () => {
    setBusy(true);
    const res = await markAllNotificationsRead();
    if (res.success) {
      setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
      toast.success('All notifications marked as read.');
    } else {
      toast.error('Could not update notifications.');
    }
    setBusy(false);
  };

  const unreadCount = items.filter((item) => !item.isRead).length;

  return (
    <div className="w-full max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-2">Notifications</h1>
          <p className="text-foreground/60">Real-time admin alerts for new bookings and enquiries.</p>
        </div>
        <button
          type="button"
          disabled={busy || unreadCount === 0}
          onClick={handleReadAll}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-5 py-3 text-sm font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
        >
          <CheckCheck size={16} />
          Mark All Read
        </button>
      </div>

      <div className="rounded-3xl border border-border/70 bg-background/60 backdrop-blur-xl p-5 sm:p-7">
        {loading ? (
          <div className="flex items-center justify-center p-14 text-foreground/40 gap-3">
            <Loader2 className="animate-spin" /> Loading notifications...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-foreground/40 border border-dashed rounded-3xl">
            <BellOff className="mx-auto mb-3" />
            No notifications yet.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-4 sm:p-5 transition-colors ${
                  item.isRead
                    ? 'border-border/60 bg-background/50'
                    : 'border-primary/40 bg-primary/[0.06]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Bell size={14} className={item.isRead ? 'text-foreground/40' : 'text-primary'} />
                      <p className="font-semibold tracking-tight">{item.title}</p>
                      {!item.isRead ? <span className="text-[10px] uppercase tracking-widest font-bold text-primary">New</span> : null}
                    </div>
                    <p className="text-sm text-foreground/70 break-words">{item.description || 'New activity received.'}</p>
                    <p className="text-xs text-foreground/40 mt-2">{formatTime(item.createdAt)}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!item.isRead ? (
                      <button
                        type="button"
                        onClick={() => handleRead(item.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-xs font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition-colors"
                      >
                        <CheckCircle2 size={14} /> Read
                      </button>
                    ) : null}

                    <Link
                      href={item.target || '/admin'}
                      className="inline-flex items-center gap-1 rounded-xl bg-foreground/5 px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Open <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
