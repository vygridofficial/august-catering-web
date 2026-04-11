'use client';

import { useState, useEffect } from 'react';
import { getReviews, approveReview, deleteReview } from '@/lib/actions/database';
import { Trash2, CheckCircle, Loader2, MessageSquareQuote, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  name: string;
  role: string;
  text: string;
  rating?: number;
  approved: boolean;
  createdAt?: any;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    // Passing false retrieves ALL reviews (both pending and approved)
    const data = await getReviews(false);
    setReviews(data as unknown as Review[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    const res = await approveReview(id);
    if (res.success) {
      toast.success('Review approved and published to the website.');
      fetchReviews();
    } else {
      toast.error('Failed to approve review.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;
    const res = await deleteReview(id);
    if (res.success) {
      toast.success('Review successfully deleted.');
      fetchReviews();
    } else {
      toast.error('Failed to delete review.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-heading font-extrabold text-foreground tracking-tight">Client Testimonials</h1>
        <p className="text-muted-foreground mt-2">Moderate submitted reviews before they appear on the public storefront.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground bg-secondary/30 rounded-3xl border border-dashed border-border">
          <MessageSquareQuote size={64} className="mb-4 opacity-50" />
          <p className="text-xl font-medium">No reviews submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className={`p-6 rounded-3xl shadow-sm border transition-all flex flex-col items-start gap-4 ${
                review.approved ? 'bg-background/40 border-border/50' : 'bg-primary/5 border-primary/30'
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div>
                  <h3 className="font-semibold text-lg">{review.name}</h3>
                  <p className="text-sm text-foreground/50">{review.role}</p>
                </div>
                {!review.approved && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-primary text-primary-foreground rounded-full animate-pulse">
                    New
                  </span>
                )}
              </div>
              
              <div className="flex-1 w-full bg-border/20 p-4 rounded-2xl">
                <div className="flex items-center gap-1 text-primary mb-3">
                  {Array.from({ length: Math.max(1, Math.min(5, review.rating || 5)) }).map((_, index) => (
                    <Star key={index} size={14} className="fill-current" />
                  ))}
                </div>
                <p className="text-foreground/80 italic text-sm leading-relaxed">"{review.text}"</p>
              </div>

              <div className="flex items-center gap-2 w-full mt-2">
                {!review.approved && (
                  <button 
                    onClick={() => handleApprove(review.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white px-4 py-3 rounded-xl font-bold transition-all text-sm"
                  >
                    <CheckCircle size={18} /> Approve
                  </button>
                )}
                
                <button 
                  onClick={() => handleDelete(review.id)}
                  className={`${review.approved ? 'flex-1' : 'w-auto'} flex items-center justify-center gap-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white px-4 py-3 rounded-xl font-bold transition-all text-sm`}
                >
                  <Trash2 size={18} /> {review.approved && 'Remove Form Site'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
