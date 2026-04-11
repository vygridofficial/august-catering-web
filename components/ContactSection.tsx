'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { submitEnquiry, getSocialSettings } from '@/lib/actions/database';
import { toast } from 'sonner';
import { Send, Phone, Mail, MapPin, Loader2 } from 'lucide-react';

export function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSocialSettings();
      if (data) setSettings(data);
    };

    fetchSettings();
  }, []);

  const phone = settings?.phone || '+91 94951 84661';
  const email = settings?.email || 'info@gatewaykitchen.in';
  const locationName = 'Thiruvaniyoor, Kochi, Kerala';
  const locationUrl = settings?.location || `https://www.google.com/maps/search/Gateway+Kitchen+Kochi`;
  const phoneHref = `tel:${String(phone).replace(/[^+\d]/g, '')}`;
  const emailHref = `mailto:${email}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await submitEnquiry(formData);
      if (res.success) {
        toast.success('Thank you! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        throw new Error(res.error);
      }
    } catch (error) {
      console.error('Error sending enquiry:', error);
      toast.error('Failed to send enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="pt-16 pb-24 md:pt-20 md:pb-28 bg-background relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-14 items-stretch">
          
          {/* Left Side: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center space-y-12"
          >
            <div>
              <h2 className="text-5xl md:text-7xl font-heading font-extrabold text-foreground tracking-tight leading-[1.1]">
                Let's Plan Your <br/> <span className="text-primary italic">Signature Event.</span>
              </h2>
              <p className="mt-8 text-xl text-muted-foreground font-light max-w-md leading-relaxed">
                From intimate dinners to grand wedding celebrations, our team is ready to bring your vision to life.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <a href={phoneHref} className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-lg">
                  <Phone size={24} />
                </a>
                <div>
                  <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">Call Us</p>
                  <a href={phoneHref} className="text-xl font-medium text-foreground tracking-tight hover:text-primary transition-colors">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <a href={emailHref} className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-lg">
                  <Mail size={24} />
                </a>
                <div>
                  <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">Email Us</p>
                  <a href={emailHref} className="text-xl font-medium text-foreground tracking-tight hover:text-primary transition-colors">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <a 
                  href={locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-lg cursor-pointer"
                  aria-label="Opens Google Maps location"
                >
                  <MapPin size={24} />
                </a>
                <div>
                  <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">Visit Us</p>
                  <p className="text-xl font-medium text-foreground tracking-tight">{locationName}</p>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Right Side: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[3rem] bg-secondary/30 backdrop-blur-3xl border border-white/20 shadow-2xl relative"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Your Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Your name" 
                  className="w-full p-4 rounded-2xl bg-background/50 border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com" 
                    className="w-full p-4 rounded-2xl bg-background/50 border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 94951 84661" 
                    className="w-full p-4 rounded-2xl bg-background/50 border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Your Message</label>
                <textarea 
                  rows={5}
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  placeholder="Tell us about your event or ask any questions..." 
                  className="w-full p-4 rounded-2xl bg-background/50 border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 sm:py-5 bg-primary text-primary-foreground rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 sm:gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Enquiry
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
