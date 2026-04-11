'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getReviews, submitReview } from '@/lib/actions/database';
import { Plus, X, Loader2, Star } from 'lucide-react';
import { toast } from 'sonner';

import { Skeleton } from './ui/Skeleton';

export function TestimonialsMarquee() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', role: 'Guest', text: '', rating: 0 });
  const justdialUrl = 'https://www.justdial.com/Ernakulam/Gateway-Kitchen-Catering-Service-Thiruvaniyoor/0484PX484-X484-180529161552-G2Q8_BZDET';

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const data = await getReviews(true); // Fetch only approved
      if (data && data.length > 0) {
        setReviews(data);
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return toast.error('Please fill in your name and message.');
    
    setIsSubmitting(true);
    const res = await submitReview(newReview);
    if (res.success) {
      toast.success('Thank you! Your feedback has been sent for review by our team.');
      setNewReview({ name: '', role: 'Guest', text: '', rating: 0 });
      setIsModalOpen(false);
    } else {
      toast.error('Failed to submit. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <section id="reviews" className="pt-32 pb-40 bg-background relative">
      <div className="container mx-auto px-6 mb-16 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-6xl font-heading font-bold text-foreground">
          Words from <span className="text-primary italic">Clients.</span>
        </h2>
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 sm:px-8 sm:py-3 bg-secondary border border-border/50 text-foreground rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest hover:border-primary transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Leave Your Review
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={justdialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 sm:px-8 sm:py-3 bg-primary text-primary-foreground rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            View on
            Justdial
          </motion.a>
        </div>
      </div>

      <div className="relative flex overflow-x-hidden pb-10 group [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background via-background/80 to-transparent z-10" />

        {loading ? (
          <div className="flex gap-6 px-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-[300px] sm:w-[400px] md:w-[420px] h-[180px] rounded-3xl shrink-0" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="w-full text-center py-12 text-muted-foreground">
            <p className="font-medium">No reviews yet — be the first to share your experience!</p>
          </div>
        ) : (
          <motion.div
            className="flex gap-6 whitespace-nowrap px-4"
            animate={{ x: [0, -1000] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 25,
                ease: 'linear',
              },
            }}
          >
            {[...reviews, ...reviews].map((t, idx) => (
              <div
                key={idx}
                className="w-[300px] sm:w-[400px] md:w-[420px] p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-secondary/50 backdrop-blur-md border border-white/40 shadow-xl shrink-0 whitespace-normal"
              >
                <div className="flex items-center gap-1 text-primary mb-4">
                  {Number(t.rating) > 0 ? (
                    Array.from({ length: Math.min(5, Number(t.rating)) }).map((_, starIndex) => (
                      <Star key={starIndex} size={14} className="fill-current" />
                    ))
                  ) : (
                    <span className="text-xs uppercase tracking-widest text-foreground/35">No rating</span>
                  )}
                </div>
                <p className="text-base sm:text-lg text-foreground/80 font-light mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg sm:text-xl shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm sm:text-base">{t.name}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card w-full max-w-lg rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-foreground/40 hover:text-foreground hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-2xl font-heading font-bold mb-2">Share Your Experience</h3>
              <p className="text-sm text-muted-foreground mb-8">We would love to feature your glowing review on our website.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/50">Rating</label>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const value = index + 1;
                      const active = value <= newReview.rating;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: value })}
                          className={`p-2 rounded-lg transition-colors ${active ? 'text-primary bg-primary/10' : 'text-foreground/30 bg-background'}`}
                          aria-label={`Set rating to ${value}`}
                        >
                          <Star size={16} className={active ? 'fill-current' : ''} />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/50">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={newReview.name}
                    onChange={e => setNewReview({...newReview, name: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/50">Event Type (Optional)</label>
                  <input 
                    type="text" 
                    value={newReview.role}
                    onChange={e => setNewReview({...newReview, role: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Wedding Client, Corporate Event, etc."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/50">Your Review</label>
                  <textarea 
                    required
                    value={newReview.text}
                    onChange={e => setNewReview({...newReview, text: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm min-h-[120px] focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="The food was absolutely incredible..."
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-70 mt-4 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
