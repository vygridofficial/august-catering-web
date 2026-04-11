'use client';

import { useEffect, useState } from 'react';
import { deleteEnquiry, getBookings, updateBookingStatus } from '@/lib/actions/database';
import { Calendar, Loader2, Mail, MapPin, Phone, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

type BookingStatus = 'booking_request' | 'contacted' | 'confirmed' | 'closed';

interface Booking {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  eventDate?: string;
  eventType?: string;
  guests?: string | number;
  menuPreference?: string;
  venue?: string;
  kind?: string;
  message?: string;
  status: BookingStatus;
  createdAt?: number | null;
}

const BOOKING_STATUSES: BookingStatus[] = ['booking_request', 'contacted', 'confirmed', 'closed'];

function isBookingLike(item: Booking) {
  return Boolean(item.eventType || item.date || item.eventDate || item.guests || item.venue || item.menuPreference);
}

const statusOptions: Array<{ value: BookingStatus; label: string }> = [
  { value: 'booking_request', label: 'New Request' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'closed', label: 'Closed' },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadBookings = async () => {
      const data = await getBookings();
      if (!mounted) return;
      const normalized = (data as Booking[])
        .filter((item) => item.kind === 'booking' || BOOKING_STATUSES.includes(item.status) || isBookingLike(item))
        .map((item) => ({
          ...item,
          status: BOOKING_STATUSES.includes(item.status) ? item.status : 'booking_request',
        }));
      setBookings(normalized);
      setLoading(false);
    };

    loadBookings();

    return () => {
      mounted = false;
    };
  }, []);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    setBusyId(id);
    const res = await updateBookingStatus(id, status);
    if (res.success) {
      setBookings(prev => prev.map(item => (item.id === id ? { ...item, status } : item)));
      toast.success('Booking status updated.');
    } else {
      toast.error('Failed to update booking status.');
    }
    setBusyId(null);
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    const res = await deleteEnquiry(id);
    if (res.success) {
      setBookings(prev => prev.filter(item => item.id !== id));
      toast.success('Booking deleted.');
    } else {
      toast.error('Failed to delete booking.');
    }
    setBusyId(null);
  };

  return (
    <div className="w-full max-w-6xl">
      <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-2">Bookings</h1>
      <p className="text-foreground/60 mb-10 sm:mb-12 max-w-2xl">
        Manage booking requests, update lifecycle status, and clear completed items.
      </p>

      {loading ? (
        <div className="flex items-center justify-center p-14 text-foreground/40 gap-3 border border-dashed rounded-3xl">
          <Loader2 className="animate-spin" /> Loading booking requests...
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-14 text-center text-foreground/40 border border-dashed rounded-3xl">
          No booking requests found.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {bookings.map((booking) => {
            const eventDate = booking.date || booking.eventDate || 'Not provided';
            const isBusy = busyId === booking.id;

            return (
              <div
                key={booking.id}
                className="rounded-3xl border border-border bg-background/70 backdrop-blur-xl p-6 sm:p-7 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold truncate">{booking.name || 'Unnamed client'}</h3>
                    <p className="text-sm text-foreground/50 truncate">{booking.email || 'No email provided'}</p>
                  </div>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleDelete(booking.id)}
                    className="p-2 rounded-xl text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                    aria-label="Delete booking"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-3 text-sm text-foreground/80 mb-6">
                  <div className="flex items-center gap-2">
                    <Phone size={15} className="text-primary" />
                    {booking.phone ? (
                      <a href={`tel:${String(booking.phone).replace(/[^+\d]/g, '')}`} className="hover:text-primary transition-colors">
                        {booking.phone}
                      </a>
                    ) : (
                      <span>No phone provided</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={15} className="text-primary" />
                    <span className="truncate">{booking.email || 'No email provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-primary" />
                    <span>{eventDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={15} className="text-primary" />
                    <span>{booking.guests || 'N/A'} guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-primary" />
                    <span className="truncate">{booking.venue || 'Venue not specified'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
                  <div className="rounded-xl border border-border/70 bg-secondary/40 px-3 py-2">
                    <span className="text-foreground/50">Event:</span> {booking.eventType || 'Not selected'}
                  </div>
                  <div className="rounded-xl border border-border/70 bg-secondary/40 px-3 py-2">
                    <span className="text-foreground/50">Menu:</span> {booking.menuPreference || 'Not selected'}
                  </div>
                </div>

                {booking.message ? (
                  <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4 mb-5 text-sm text-foreground/75 italic">
                    &ldquo;{booking.message}&rdquo;
                  </div>
                ) : null}

                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/50">Status</label>
                  <select
                    value={booking.status}
                    disabled={isBusy}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                    className="min-w-[170px] rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary outline-none disabled:opacity-60"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
