'use client';

import { useState, useEffect } from 'react';
import { getEnquiries, deleteEnquiry } from '@/lib/actions/database';
import { Trash, Mail, Phone, Calendar, Loader2, PhoneCall } from 'lucide-react';
import { toast } from 'sonner';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  date?: string;
  eventType?: string;
  guests?: string | number;
  menuPreference?: string;
  venue?: string;
  status?: string;
  kind?: string;
  message: string;
  createdAt: any;
}

const BOOKING_STATUSES = ['booking_request', 'contacted', 'confirmed', 'closed'];

function isBookingLike(item: Enquiry) {
  return Boolean(item.eventType || item.date || item.eventDate || item.guests || item.venue || item.menuPreference);
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    const data = await getEnquiries();
    const filtered = (data as Enquiry[]).filter((item) => {
      if (item.kind === 'booking') return false;
      if (item.status && BOOKING_STATUSES.includes(item.status)) return false;
      if (isBookingLike(item)) return false;
      return true;
    });
    setEnquiries(filtered);
    setLoading(false);
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDelete = async (id: string) => {
    const res = await deleteEnquiry(id);
    if (res.success) {
      fetchEnquiries();
      toast.success("Enquiry successfully removed.");
    } else {
      toast.error("Failed to delete enquiry.");
    }
  };

  return (
    <div className="w-full max-w-5xl overflow-hidden">
      <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-2">Enquiries</h1>
      <p className="text-foreground/60 mb-10 sm:mb-12 max-w-2xl">Manage leads, catering requests, and contact messages.</p>

      {/* Enquiries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center p-10 sm:p-12 text-foreground/40 gap-3">
            <Loader2 className="animate-spin" /> Loading Enquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="col-span-full p-10 sm:p-12 text-center text-foreground/40 border border-dashed rounded-3xl">
            No active enquiries.
          </div>
        ) : (
          enquiries.map(enquiry => (
            <div key={enquiry.id} className="bg-background/80 backdrop-blur-xl border border-border p-5 sm:p-6 rounded-3xl shadow-sm flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDelete(enquiry.id)} className="text-destructive/50 hover:text-destructive transition-colors bg-background/50 p-2 rounded-xl backdrop-blur-md">
                  <Trash size={18} />
                </button>
              </div>

              <h3 className="font-semibold text-lg sm:text-xl mb-4 break-words pr-10">{enquiry.name}</h3>
              
              <div className="space-y-3 mb-5 sm:mb-6 flex-1 min-w-0">
                <div className="flex items-start gap-3 text-sm text-foreground/80 min-w-0">
                  <Mail size={16} className="text-primary shrink-0 mt-0.5" />
                  <span className="break-all leading-relaxed min-w-0">{enquiry.email}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-foreground/80 min-w-0">
                  <Phone size={16} className="text-primary shrink-0 mt-0.5" />
                  <a href={`tel:${String(enquiry.phone).replace(/[^+\d]/g, '')}`} className="hover:text-primary transition-colors flex items-center gap-2 break-all min-w-0 leading-relaxed">
                    <span>{enquiry.phone}</span>
                    <PhoneCall size={14} />
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground/80 min-w-0">
                  <Calendar size={16} className="text-primary shrink-0" />
                  <span className="break-words leading-relaxed">{enquiry.eventDate}</span>
                </div>
              </div>

              <div className="p-4 bg-border/20 rounded-2xl text-sm leading-relaxed text-foreground/70 italic break-words">
                "{enquiry.message}"
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
