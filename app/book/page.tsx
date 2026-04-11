'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const FALLBACK_EVENT_TYPES = [
  { id: 'wedding', label: 'Wedding', description: 'Classic and grand wedding catering.', icon: '💍' },
  { id: 'corporate', label: 'Corporate', description: 'Professional service for business events.', icon: '🏢' },
  { id: 'private', label: 'Private Party', description: 'Curated menus for intimate gatherings.', icon: '🎉' },
  { id: 'special', label: 'Special Occasion', description: 'Tailored dining for milestone events.', icon: '✨' },
];

const FALLBACK_CULINARY_STYLES = [
  { id: 'kerala', label: 'Kerala Traditional', description: 'Authentic regional flavors and classics.', icon: '🍛' },
  { id: 'multi', label: 'Multi Cuisine', description: 'Balanced spread across popular cuisines.', icon: '🍽️' },
  { id: 'fusion', label: 'Contemporary Fusion', description: 'Modern plating with creative flavor pairing.', icon: '🥂' },
];

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

  const availableEventTypes = eventTypes.length > 0 ? eventTypes : FALLBACK_EVENT_TYPES;
  const availableCulinaryStyles = culinaryStyles.length > 0 ? culinaryStyles : FALLBACK_CULINARY_STYLES;

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
      toast.success('Your booking request has been received!', {
          className: 'bg-black/90 border border-white/10 text-white font-outfit',
      });
      setStep(4); // Success step
    } else {
      toast.error('Something went wrong. Please try again.', {
          className: 'bg-black/90 border border-red-500/50 text-white font-outfit',
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-outfit selection:bg-primary selection:text-black">
      
      <main className="pt-32 pb-24 relative overflow-hidden">
        {/* Background Visuals */}
        <div className="fixed top-0 right-0 w-[80vw] h-[80vw] md:w-[800px] md:h-[800px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none mix-blend-screen" />
        <div className="fixed bottom-0 left-0 w-[60vw] h-[60vw] md:w-[600px] md:h-[600px] bg-white/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none mix-blend-screen" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center mb-16 space-y-4 pt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] text-primary"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Event Reservations
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[clamp(3rem,8vw,5.5rem)] font-heading font-black tracking-tighter leading-[0.9] drop-shadow-2xl uppercase"
            >
              Book Your <span className="text-primary italic font-serif">Signature</span>
              <br />Event.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/40 font-medium max-w-2xl mx-auto leading-relaxed"
            >
              Tell us about your celebration, and our culinary team will craft a bespoke gastronomic experience tailored precisely for you.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start mt-20">
            {/* Step Indicator (Desktop) */}
            <div className="hidden lg:flex flex-col gap-10 lg:col-span-1 border-l border-white/5 pl-8">
              {[
                { s: 1, label: 'Event Details', icon: Calendar },
                { s: 2, label: 'Menu Curation', icon: Utensils },
                { s: 3, label: 'Client Dossier', icon: ShieldCheck },
              ].map((item) => (
                <div 
                  key={item.s} 
                  className={`flex items-center gap-4 transition-all duration-500 ${step === item.s ? 'text-primary' : 'text-white/20'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${step === item.s ? 'bg-primary/10 border-primary/20 text-primary shadow-[0_0_20px_rgba(255,204,0,0.2)]' : 'bg-white/5 border-white/5 text-white/30'}`}>
                    <item.icon size={20} />
                  </div>
                  <span className="font-black text-xs uppercase tracking-[0.2em]">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Form Container */}
            <div className="lg:col-span-3">
              <motion.div 
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 md:p-14 shadow-2xl relative overflow-hidden"
              >
                {step < 4 && (
                  <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                    {/* Step 1: Event Context */}
                    {step === 1 && (
                      <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="grid gap-6">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-3">
                              <span className="w-8 h-[1px] bg-white/20" /> Event Topology
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fetchingEvents ? (
                              Array(4).fill(0).map((_, i) => (
                                <Skeleton key={i} className="h-32 rounded-[2rem] bg-white/5 border border-white/5" />
                              ))
                            ) : (
                              availableEventTypes.map((type) => (
                                <button
                                  key={type.id}
                                  type="button"
                                  onClick={() => setFormData({...formData, eventType: type.label})}
                                  className={`flex flex-col items-start p-6 rounded-[2rem] border transition-all text-left group box-border ${formData.eventType === type.label ? 'border-primary/50 bg-primary/10 shadow-[0_0_30px_rgba(255,204,0,0.1)]' : 'border-white/5 hover:border-white/10 bg-white/[0.02]'}`}
                                >
                                  <span className="text-3xl mb-4">{type.icon}</span>
                                  <span className="font-bold text-lg mb-2 tracking-tight text-white">{type.label}</span>
                                  <span className="text-xs text-white/40 leading-relaxed font-medium">{type.description}</span>
                                </button>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                              <Calendar size={14} /> Chronology
                            </label>
                            <input 
                              type="date" 
                              required
                              value={formData.date}
                              onChange={e => setFormData({...formData, date: e.target.value})}
                              style={{ colorScheme: 'dark' }}
                              className="w-full p-6 rounded-[1.5rem] bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 outline-none transition-all text-white font-medium" 
                            />
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                              <Users size={14} /> Headcount
                            </label>
                            <input 
                              type="number" 
                              placeholder="e.g. 250 Guests"
                              required
                              value={formData.guests}
                              onChange={e => setFormData({...formData, guests: e.target.value})}
                              className="w-full p-6 rounded-[1.5rem] bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 outline-none transition-all text-white font-medium placeholder:text-white/20" 
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-8 border-t border-white/5 mt-8">
                          <button 
                            type="button" 
                            disabled={!formData.eventType || !formData.date || !formData.guests}
                            onClick={nextStep}
                            className="bg-primary text-black px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed"
                          >
                            Proceed to Menu <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Culinary Preferences */}
                    {step === 2 && (
                      <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="grid gap-6">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-white/20" /> Culinary Theme
                          </label>
                          <div className="grid grid-cols-1 gap-4">
                            {fetchingStyles ? (
                              Array(3).fill(0).map((_, i) => (
                                <Skeleton key={i} className="h-28 rounded-[2rem] bg-white/5 border border-white/5" />
                              ))
                            ) : (
                              availableCulinaryStyles.map((style) => (
                                <div key={style.id} className="group relative">
                                  <button
                                    type="button"
                                    onClick={() => setFormData({...formData, menuPreference: style.label})}
                                    className={`w-full flex items-center gap-6 p-6 rounded-[2rem] border transition-all text-left box-border ${formData.menuPreference === style.label ? 'border-primary/50 bg-primary/10 shadow-[0_0_30px_rgba(255,204,0,0.1)]' : 'border-white/5 hover:border-white/10 bg-white/[0.02]'}`}
                                  >
                                    <span className="text-3xl md:text-4xl">{style.icon}</span>
                                    <div className="flex-1">
                                      <span className="font-bold text-xl block tracking-tight text-white">{style.label}</span>
                                      <span className="text-xs text-white/40 mt-1 block">{style.description}</span>
                                    </div>
                                    {formData.menuPreference === style.label && <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center shrink-0"><CheckCircle2 size={16} /></div>}
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                            <MapPin size={14} /> Venue Assignment
                          </label>
                          <input 
                            type="text" 
                            required
                            placeholder="Full address or location name..."
                            value={formData.venue}
                            onChange={e => setFormData({...formData, venue: e.target.value})}
                            className="w-full p-6 rounded-[1.5rem] bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 outline-none transition-all text-white font-medium placeholder:text-white/20" 
                          />
                        </div>

                        <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-8">
                          <button 
                            type="button" 
                            onClick={prevStep}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors p-4"
                          >
                            Go Back
                          </button>
                          <button 
                            type="button"
                            disabled={!formData.menuPreference || !formData.venue}
                            onClick={nextStep}
                            className="bg-primary text-black px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed"
                          >
                            Finalize Details <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Final Contact */}
                    {step === 3 && (
                      <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Client Identifier</label>
                            <input 
                              type="text" 
                              required
                              value={formData.name}
                              onChange={e => setFormData({...formData, name: e.target.value})}
                              placeholder="Full Name"
                              className="w-full p-6 rounded-[1.5rem] bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 outline-none transition-all text-white font-medium placeholder:text-white/20" 
                            />
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Direct Line</label>
                            <input 
                              type="tel" 
                              required
                              value={formData.phone}
                              onChange={e => setFormData({...formData, phone: e.target.value})}
                              placeholder="+91 .."
                              className="w-full p-6 rounded-[1.5rem] bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 outline-none transition-all text-white font-medium placeholder:text-white/20" 
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Digital Comm</label>
                          <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            placeholder="Email Address"
                            className="w-full p-6 rounded-[1.5rem] bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 outline-none transition-all text-white font-medium placeholder:text-white/20" 
                          />
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                             <MessageSquare size={14} /> Directives & Allergies
                          </label>
                          <textarea 
                            rows={4}
                            value={formData.message}
                            onChange={e => setFormData({...formData, message: e.target.value})}
                            placeholder="Specific dietary requirements, floral thematic ideas, etc..."
                            className="w-full p-6 rounded-[1.5rem] bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 outline-none transition-all resize-none text-white font-medium placeholder:text-white/20" 
                          />
                        </div>

                        <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-8">
                          <button 
                            type="button" 
                            onClick={prevStep}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors p-4"
                          >
                            Go Back
                          </button>
                          <button 
                            type="submit" 
                            disabled={loading || !formData.name || !formData.phone || !formData.email}
                            className="bg-primary text-black px-10 py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-[0_0_40px_rgba(255,204,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed group"
                          >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                            Execute Booking
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                )}

                {/* Success State */}
                {step === 4 && (
                  <div className="text-center py-20 space-y-10 animate-in zoom-in-95 duration-700">
                    <div className="w-32 h-32 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto border border-primary/20 shadow-[0_0_50px_rgba(255,204,0,0.2)]">
                      <CheckCircle2 size={64} />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-5xl font-heading font-black uppercase tracking-tighter text-white">Transmission SECURED.</h2>
                      <p className="text-xl text-white/50 font-medium max-w-lg mx-auto leading-relaxed">
                        A dossier has been created for <span className="text-white">"{formData.name}"</span>. Our elite gastronomy team is reviewing your requirements. Expect contact via <span className="text-primary italic font-serif">{formData.phone}</span>.
                      </p>
                    </div>
                    <div className="pt-10 flex flex-col items-center gap-6">
                      <div className="flex items-center gap-3 text-[10px] text-white/30 font-black uppercase tracking-[0.3em] bg-white/5 px-6 py-3 rounded-full border border-white/5">
                        <Clock size={14} /> Expected SLA: 4 Hours
                      </div>
                      <button 
                        onClick={() => window.location.href = '/'}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-white border-b border-white/20 pb-1 hover:border-primary hover:text-primary transition-all"
                      >
                        Return to Origin
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
