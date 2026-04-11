'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { submitEnquiry, getSocialSettings } from '@/lib/actions/database';
import { toast } from 'sonner';
import { Send, Phone, Mail, MapPin, Loader2, Navigation, ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { ReactiveDots } from '@/components/ui/ReactiveDots';

export function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSocialSettings();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  const phone = settings?.phone || '+91 94951 84661';
  const email = settings?.email || 'info@augustcatering.in';
  const locationName = 'Thiruvaniyoor, Kochi';
  const locationUrl = settings?.location || `https://www.google.com/maps/search/August+Catering+Kochi`;
  const phoneHref = `tel:${String(phone).replace(/[^+\d]/g, '')}`;
  const emailHref = `mailto:${email}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitEnquiry(formData);
      if (res.success) {
        toast.success('Inquiry Received. Our team will contact you soon.', {
          className: 'bg-black/90 border border-white/10 text-white font-outfit',
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        throw new Error(res.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Submission failed. Please try again.', {
        className: 'bg-black/90 border border-red-500/50 text-white font-outfit',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" ref={containerRef} className="py-32 bg-[#050505] relative overflow-hidden font-outfit border-t border-white/[0.02]">
      <ReactiveDots />
      {/* Editorial Watermark */}
      <motion.div style={{ y: y1 }} className="absolute -left-20 top-20 text-[20vw] font-heading font-black text-white/[0.01] pointer-events-none uppercase tracking-tighter whitespace-nowrap hidden md:block">
        Connect.
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute -right-20 bottom-20 text-[20vw] font-heading font-black text-white/[0.01] pointer-events-none uppercase tracking-tighter whitespace-nowrap hidden md:block">
        Execute.
      </motion.div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Massive Centered Editorial Header */}
        <div className="text-center mb-24 relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-3 mb-12"
            >
              <div className="w-12 h-[1px] bg-primary/50" />
              <Navigation size={12} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary">Private Consultations</span>
              <div className="w-12 h-[1px] bg-primary/50" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              viewport={{ once: true }}
              className="text-[clamp(4rem,10vw,8rem)] font-heading font-black text-white tracking-tighter leading-[0.8] mb-8"
            >
              LET'S <span className="text-primary italic font-serif opacity-80">TALK.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl text-white/40 font-light max-w-2xl mx-auto leading-relaxed"
            >
              We design culinary atmospheres for the most discerning clients. Send an inquiry below to secure your date and commence planning.
            </motion.p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-[3rem] p-8 md:p-16 lg:p-20 shadow-2xl relative overflow-hidden">
           {/* Shimmer */}
           <div className="absolute top-0 left-[-100%] w-full h-[500px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent skew-x-[-45deg] animate-[shimmer_8s_infinite] pointer-events-none" />
           
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative z-10">
              
              {/* Context Column */}
              <div className="lg:col-span-4 flex flex-col justify-between">
                <div>
                   <h3 className="text-2xl font-black uppercase tracking-widest mb-10 text-white/80">The Details</h3>
                   <div className="space-y-10">
                      {[
                        { label: 'Voice', value: phone, href: phoneHref, icon: Phone },
                        { label: 'Post', value: email, href: emailHref, icon: Mail },
                        { label: 'Studio', value: locationName, href: locationUrl, icon: MapPin },
                      ].map((item) => (
                        <a key={item.label} href={item.href} target={item.icon === MapPin ? "_blank" : "_self"} className="group block">
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-2 flex items-center gap-2">
                               {item.label} <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                            </p>
                            <p className="text-lg text-white font-medium group-hover:text-primary transition-colors">{item.value}</p>
                        </a>
                      ))}
                   </div>
                </div>

                <div className="pt-10 mt-10 border-t border-white/5 opacity-50">
                    <p className="text-xs font-serif italic text-white/50">"Extraordinary events demand extraordinary precision."</p>
                </div>
              </div>

              {/* Form Column */}
              <div className="lg:col-span-8">
                 <form onSubmit={handleSubmit} className="flex flex-col gap-12">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Minimalist Input Pattern */}
                        <div className="relative group/field">
                           <input 
                             type="text" 
                             required
                             placeholder=" "
                             value={formData.name}
                             onChange={e => setFormData({...formData, name: e.target.value})}
                             className="peer w-full bg-transparent border-b border-white/10 py-4 text-white text-xl placeholder-transparent focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                           />
                           <label className="absolute left-0 top-4 text-white/30 text-xl font-light transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest cursor-text pointer-events-none">
                             Given Name *
                           </label>
                        </div>
                        
                        <div className="relative group/field">
                           <input 
                             type="email" 
                             required
                             placeholder=" "
                             value={formData.email}
                             onChange={e => setFormData({...formData, email: e.target.value})}
                             className="peer w-full bg-transparent border-b border-white/10 py-4 text-white text-xl placeholder-transparent focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                           />
                           <label className="absolute left-0 top-4 text-white/30 text-xl font-light transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest cursor-text pointer-events-none">
                             Digital Address *
                           </label>
                        </div>
                     </div>

                     <div className="relative group/field mt-4">
                           <input 
                             type="tel" 
                             required
                             placeholder=" "
                             value={formData.phone}
                             onChange={e => setFormData({...formData, phone: e.target.value})}
                             className="peer w-full bg-transparent border-b border-white/10 py-4 text-white text-xl placeholder-transparent focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                           />
                           <label className="absolute left-0 top-4 text-white/30 text-xl font-light transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest cursor-text pointer-events-none">
                             Phone Number *
                           </label>
                     </div>

                     <div className="relative group/field mt-4">
                           <textarea 
                             rows={1}
                             required
                             placeholder=" "
                             value={formData.message}
                             onChange={e => {
                                 setFormData({...formData, message: e.target.value});
                                 e.target.style.height = 'auto';
                                 e.target.style.height = e.target.scrollHeight + 'px';
                             }}
                             className="peer w-full bg-transparent border-b border-white/10 py-4 text-white text-xl placeholder-transparent focus:outline-none focus:border-primary transition-colors resize-none disabled:opacity-50 min-h-[60px] overflow-hidden"
                           />
                           <label className="absolute left-0 top-4 text-white/30 text-xl font-light transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest cursor-text pointer-events-none">
                             Event Details & Vision *
                           </label>
                     </div>

                     <div className="pt-8 flex justify-end">
                        <button 
                          type="submit" 
                          disabled={loading}
                          className="group relative overflow-hidden px-14 py-6 rounded-full bg-white text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] w-full sm:w-auto"
                        >
                           <span className="relative z-10 flex items-center gap-3">
                             {loading ? 'Processing...' : 'Submit Inquiry'}
                             {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                           </span>
                           <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                        </button>
                     </div>
                 </form>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
