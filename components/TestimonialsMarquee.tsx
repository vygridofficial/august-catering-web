'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getReviews, submitReview } from '@/lib/actions/database';
import { Plus, X, Loader2, Star, Quote, MessageSquareQuote } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from './ui/Skeleton';

export function TestimonialsMarquee() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', role: 'Guest', text: '', rating: 0 });
  const justdialUrl = 'https://www.justdial.com/Ernakulam/August-Catering-Kanjiramattom/0484PX484-X484-240913190445-D5I9_BZDET';

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const data = await getReviews(true);
      if (data && data.length > 0) {
        setReviews(data);
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return toast.error('Please provide both your name and review.');
    
    setIsSubmitting(true);
    const res = await submitReview(newReview);
    if (res.success) {
      toast.success('Thank you! Your review has been submitted for approval.');
      setNewReview({ name: '', role: 'Guest', text: '', rating: 0 });
      setIsModalOpen(false);
    } else {
      toast.error('Submission failed. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <section id="reviews" className="py-48 bg-transparent relative z-10 font-outfit overflow-hidden">
      {/* Ambient background aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-primary/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-6 mb-24 text-center relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
           <MessageSquareQuote size={16} className="text-primary animate-pulse" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Client Feedback</span>
        </div>
        <h2 className="text-6xl md:text-8xl font-heading font-black text-white tracking-tighter leading-[0.8] uppercase">
          Kind <br /> <span className="text-primary italic font-serif">Words.</span>
        </h2>
        
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
           <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="group relative px-10 py-5 bg-white text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest overflow-hidden transition-all shadow-2xl"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Plus size={14} /> Share Your Story
            </span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
          </motion.button>

          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={justdialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-5 bg-white/5 border border-white/5 text-white/40 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white hover:border-primary/20 transition-all shadow-2xl flex items-center gap-3"
          >
            <Star size={14} className="text-primary" />
            Read on Justdial
          </motion.a>
        </div>
      </div>

      {/* Marquee Body */}
      <div className="relative flex overflow-x-hidden group">
        {/* Horizontal Fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#050505] via-[#050505]/80 to-transparent z-10" />

        {loading ? (
          <div className="flex gap-10 px-10">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-[450px] h-[280px] rounded-[3rem] bg-white/5 border border-white/5 shrink-0" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="w-full text-center py-24">
            <p className="text-xs font-bold uppercase tracking-widest text-white/50">
              Be the first to share your experience.
            </p>
          </div>
        ) : (
          <motion.div
            className="flex gap-10 px-10 py-10"
            animate={{ x: [0, -2000] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 40,
                ease: 'linear',
              },
            }}
          >
            {[...reviews, ...reviews, ...reviews].map((t, idx) => (
              <div
                key={idx}
                className="w-[450px] p-10 rounded-[3rem] bg-white/[0.01] backdrop-blur-3xl border border-white/5 shadow-2xl shrink-0 whitespace-normal group/card hover:bg-white/[0.03] hover:border-primary/20 transition-all duration-700 font-outfit relative"
              >
                <Quote className="absolute top-8 right-8 text-white/5 w-16 h-16 group-hover:text-primary/10 transition-colors duration-700" />
                
                <div className="flex items-center gap-0.5 text-primary mb-8">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star 
                        key={starIndex} 
                        size={12} 
                        className={starIndex < (Number(t.rating) || 5) ? 'fill-primary' : 'text-white/10'} 
                    />
                  ))}
                </div>

                <p className="text-xl text-white/70 font-medium leading-relaxed mb-10 min-h-[120px]">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary font-bold text-xl shrink-0 group-hover:border-primary/50 transition-all duration-700">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base uppercase tracking-widest">{t.name}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/20 mt-1">{t.role || 'August Patron'}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Testimony Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#080808] w-full max-w-xl rounded-[4rem] p-12 border border-white/10 shadow-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
              
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-10 right-10 p-4 text-white/20 hover:text-white hover:bg-white/5 rounded-2xl transition-all z-10"
              >
                <X size={20} />
              </button>
              
              <div className="relative z-10">
                  <h3 className="text-4xl font-heading font-black text-white uppercase tracking-tighter mb-2">Share Review</h3>
                  <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-12">August Catering Feedback</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 pl-4">Your Name</label>
                            <input 
                                type="text" 
                                required
                                value={newReview.name}
                                onChange={e => setNewReview({...newReview, name: e.target.value})}
                                className="w-full bg-white/[0.01] border border-white/5 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="Name"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 pl-4">Event Type</label>
                            <input 
                                type="text" 
                                value={newReview.role}
                                onChange={e => setNewReview({...newReview, role: e.target.value})}
                                className="w-full bg-white/[0.01] border border-white/5 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="Wedding, Corporate, etc."
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 pl-4">Rating</label>
                        <div className="flex items-center gap-3">
                            {Array.from({ length: 5 }).map((_, index) => {
                            const value = index + 1;
                            const active = value <= newReview.rating;
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setNewReview({ ...newReview, rating: value })}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${active ? 'text-primary bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(255,183,0,0.1)]' : 'text-white/10 bg-white/[0.01] border border-white/5'}`}
                                >
                                    <Star size={18} className={active ? 'fill-current' : ''} />
                                </button>
                            );
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 pl-4">Your Review</label>
                        <textarea 
                            required
                            value={newReview.text}
                            onChange={e => setNewReview({...newReview, text: e.target.value})}
                            className="w-full bg-white/[0.01] border border-white/5 rounded-[2rem] px-6 py-6 text-xs font-bold text-white min-h-[160px] focus:ring-1 focus:ring-primary outline-none transition-all resize-none leading-relaxed"
                            placeholder="Write your review here..."
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-primary text-black py-6 rounded-2xl font-bold tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 mt-8 flex items-center justify-center gap-4 shadow-2xl shadow-primary/20 text-[10px]"
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <div className="w-2 h-2 rounded-full bg-black animate-pulse" />}
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
