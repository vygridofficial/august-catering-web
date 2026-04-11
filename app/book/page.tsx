'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { submitBookingRequest, getEventTypes, getCulinaryStyles } from '@/lib/actions/database';
import { toast } from 'sonner';
import { 
  Calendar, 
  Users, 
  Utensils, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Star,
  Loader2,
  ChevronDown,
  Info
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function BookEventPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [culinaryStyles, setCulinaryStyles] = useState<any[]>([]);
  const [fetchingEvents, setFetchingEvents] = useState(true);
  const [fetchingStyles, setFetchingStyles] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    eventType: '',
    guests: '',
    menuPreference: '',
    venue: '',
    message: '',
  });

  useEffect(() => {
    const fetch = async () => {
      const [events, styles] = await Promise.all([
        getEventTypes(),
        getCulinaryStyles()
      ]);
      setEventTypes(events);
      setCulinaryStyles(styles);
      setFetchingEvents(false);
      setFetchingStyles(false);
    };
    fetch();
  }, []);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await submitBookingRequest({
      ...formData,
      createdAt: new Date().toISOString(),
    });

    if (res.success) {
      toast.success('Your booking request has been received!');
      setStep(4); // Success step
    } else {
      toast.error('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header />
      
      <main className="pt-20 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 relative overflow-hidden">
        {/* Background Visuals */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10">
          <div className="text-center mb-6 sm:mb-10 md:mb-16 space-y-2 sm:space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-widest"
            >
              <Star size={14} className="fill-primary" />
              Event Planning & Reservations
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-tight"
            >
              Book Your <span className="text-primary italic">Signature</span> Event.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-muted-foreground font-light max-w-2xl mx-auto px-1 sm:px-2 leading-relaxed"
            >
              Tell us about your celebration, and our culinary team will craft a customized experience that exceeds every expectation.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 items-start">
            {/* Step Indicator (Desktop) */}
            <div className="hidden lg:flex flex-col gap-8 lg:col-span-1 border-l border-border pl-8">
              {[
                { s: 1, label: 'Event Details', icon: Calendar },
                { s: 2, label: 'Selection', icon: Utensils },
                { s: 3, label: 'Personal Info', icon: ShieldCheck },
              ].map((item) => (
                <div 
                  key={item.s} 
                  className={`flex items-center gap-4 transition-all ${step === item.s ? 'text-primary scale-105' : 'text-muted-foreground opacity-50'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${step === item.s ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'bg-secondary'}`}>
                    <item.icon size={20} />
                  </div>
                  <span className="font-bold text-sm uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Form Container */}
            <div className="lg:col-span-3">
              <motion.div 
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card/50 backdrop-blur-2xl border border-white/20 rounded-2xl sm:rounded-3xl md:rounded-[3rem] p-5 sm:p-6 md:p-8 lg:p-12 shadow-2xl overflow-hidden relative"
              >
                {step < 4 && (
                  <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                    {/* Step 1: Event Context */}
                    {step === 1 && (
                      <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid gap-4 sm:gap-6">
                          <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">What kind of event are we planning?</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fetchingEvents ? (
                              Array(4).fill(0).map((_, i) => (
                                <Skeleton key={i} className="h-32 rounded-3xl" />
                              ))
                            ) : (
                              eventTypes.map((type) => (
                                <button
                                  key={type.id}
                                  type="button"
                                  onClick={() => setFormData({...formData, eventType: type.label})}
                                  className={`flex flex-col items-start p-4 sm:p-6 rounded-3xl border-2 transition-all text-left group box-border ${formData.eventType === type.label ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30 bg-background/50'}`}
                                >
                                  <span className="text-2xl sm:text-3xl mb-2 sm:mb-3 block">{type.icon}</span>
                                  <span className="font-bold text-base sm:text-lg mb-1">{type.label}</span>
                                  <span className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2">{type.description}</span>
                                </button>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                          <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                              <Calendar size={16} /> Event Date
                            </label>
                            <input 
                              type="date" 
                              required
                              value={formData.date}
                              onChange={e => setFormData({...formData, date: e.target.value})}
                              className="w-full p-5 rounded-2xl bg-background/80 border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-foreground" 
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                              <Users size={16} /> Expected Guests
                            </label>
                            <input 
                              type="number" 
                              placeholder="e.g. 250"
                              required
                              value={formData.guests}
                              onChange={e => setFormData({...formData, guests: e.target.value})}
                              className="w-full p-5 rounded-2xl bg-background/80 border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-foreground" 
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-8">
                          <button 
                            type="button" 
                            disabled={!formData.eventType || !formData.date || !formData.guests}
                            onClick={nextStep}
                            className="bg-primary text-primary-foreground px-6 py-3.5 sm:px-10 sm:py-5 rounded-2xl font-bold text-sm sm:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                          >
                            Next Selection <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Culinary Preferences */}
                    {step === 2 && (
                      <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid gap-4 sm:gap-6">
                          <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Select Your Culinary Style</label>
                          <div className="grid grid-cols-1 gap-4">
                            {fetchingStyles ? (
                              Array(3).fill(0).map((_, i) => (
                                <Skeleton key={i} className="h-24 rounded-3xl" />
                              ))
                            ) : (
                              culinaryStyles.map((style) => (
                                <div key={style.id} className="group relative">
                                  <button
                                    type="button"
                                    onClick={() => setFormData({...formData, menuPreference: style.label})}
                                    className={`w-full flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-[2rem] border-2 transition-all text-left box-border ${formData.menuPreference === style.label ? 'border-primary bg-primary/5 shadow-inner' : 'border-border hover:border-primary/20 bg-background/50'}`}
                                  >
                                    <span className="text-2xl sm:text-3xl">{style.icon}</span>
                                    <div className="flex-1">
                                      <span className="font-bold text-base sm:text-xl block">{style.label}</span>
                                      <span className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1">{style.description}</span>
                                    </div>
                                    {formData.menuPreference === style.label && <CheckCircle2 className="text-primary sm:text-primary" size={20} />}
                                  </button>
                                  
                                  <AnimatePresence>
                                    {formData.menuPreference === style.label && style.contents && style.contents.length > 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="px-5 sm:px-8 pb-5 sm:pb-6 -mt-4 pt-7 sm:pt-8 bg-primary/[0.02] border-x-2 border-b-2 border-primary/20 rounded-b-[2rem] mx-4"
                                      >
                                        <div className="flex items-center gap-2 mb-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-primary/60">
                                          <Utensils size={12} /> Chef's Picks for {style.label}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {style.contents.map((c: string, idx: number) => (
                                            <span key={idx} className="bg-white/40 text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-md border border-white/60 shadow-sm">{c}</span>
                                          ))}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <MapPin size={16} /> Venue Address / Location
                          </label>
                          <input 
                            type="text" 
                            required
                            value={formData.venue}
                            onChange={e => setFormData({...formData, venue: e.target.value})}
                            className="w-full p-5 rounded-2xl bg-background/80 border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-foreground" 
                          />
                        </div>

                        <div className="flex justify-between pt-8">
                          <button 
                            type="button" 
                            onClick={prevStep}
                            className="text-muted-foreground font-bold hover:text-foreground transition-colors"
                          >
                            Back
                          </button>
                          <button 
                            type="button"
                            disabled={!formData.menuPreference || !formData.venue}
                            onClick={nextStep}
                            className="bg-primary text-primary-foreground px-6 py-3.5 sm:px-10 sm:py-5 rounded-2xl font-bold text-sm sm:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                          >
                            Add Contact Info <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Final Contact */}
                    {step === 3 && (
                      <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                          <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                            <input 
                              type="text" 
                              required
                              value={formData.name}
                              onChange={e => setFormData({...formData, name: e.target.value})}
                              placeholder="John Doe"
                              className="w-full p-5 rounded-2xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-foreground" 
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Phone Number</label>
                            <input 
                              type="tel" 
                              required
                              value={formData.phone}
                              onChange={e => setFormData({...formData, phone: e.target.value})}
                              placeholder="+91 00000 00000"
                              className="w-full p-5 rounded-2xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-foreground" 
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                          <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            placeholder="john@example.com"
                            className="w-full p-5 rounded-2xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-foreground" 
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                             <MessageSquare size={16} /> Any Special Requirements?
                          </label>
                          <textarea 
                            rows={4}
                            value={formData.message}
                            onChange={e => setFormData({...formData, message: e.target.value})}
                            placeholder="Allergies, specific themes, or dietary restrictions..."
                            className="w-full p-5 rounded-2xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none transition-all resize-none text-foreground" 
                          />
                        </div>

                        <div className="flex justify-between pt-8">
                          <button 
                            type="button" 
                            onClick={prevStep}
                            className="text-muted-foreground font-bold hover:text-foreground transition-colors"
                          >
                            Back
                          </button>
                          <button 
                            type="submit" 
                            disabled={loading || !formData.name || !formData.phone || !formData.email}
                            className="bg-primary text-primary-foreground px-6 py-3.5 sm:px-12 sm:py-6 rounded-2xl font-bold text-sm sm:text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
                          >
                            {loading ? <Loader2 size={20} className="sm:size-6 animate-spin" /> : <ArrowRight size={20} className="sm:size-6" />}
                            Confirm Booking Request
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                )}

                {/* Success State */}
                {step === 4 && (
                  <div className="text-center py-16 space-y-8 animate-in zoom-in-95 duration-700">
                    <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-500/10">
                      <CheckCircle2 size={56} />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-4xl font-heading font-black">Booking Initiated!</h2>
                      <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
                        Thank you, <span className="text-foreground font-bold">{formData.name}</span>. Our expert event planners will review your request and contact you within 24 hours at <span className="text-primary font-medium">{formData.phone}</span>.
                      </p>
                    </div>
                    <div className="pt-8 flex flex-col items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-foreground/40 font-bold uppercase tracking-widest">
                        <Clock size={16} /> Average response time: 4 hours
                      </div>
                      <button 
                        onClick={() => window.location.href = '/'}
                        className="bg-foreground text-background px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-bold text-sm sm:text-base hover:bg-foreground/90 transition-all"
                      >
                        Return Home
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
