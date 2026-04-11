'use client';

import { useState, useEffect } from 'react';
import { getSocialSettings, updateSocialSettings } from '@/lib/actions/database';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Save, 
  Loader2,
  MessageSquare
} from 'lucide-react';

const Instagram = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} style={props.style}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Facebook = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} style={props.style}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function SocialSettingsPage() {
  const [settings, setSettings] = useState({
    whatsapp: '',
    phone: '',
    instagram: '',
    facebook: '',
    email: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const data = await getSocialSettings();
      if (data) {
        setSettings(data as any);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateSocialSettings(settings);
    if (result.success) {
      toast.success('Social settings updated successfully');
    } else {
      toast.error(result.error || 'Failed to update settings');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-12">
      <header>
        <h1 className="text-5xl font-heading font-bold tracking-tight mb-2">Social & Contact</h1>
        <p className="text-foreground/60 text-lg">Manage your digital presence and contact information across the platform.</p>
      </header>

      <motion.form 
        onSubmit={handleSave}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* WhatsApp */}
          <div className="bg-background/40 backdrop-blur-xl border border-border rounded-3xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <MessageSquare size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs">WhatsApp Number</h3>
            </div>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              placeholder="e.g. 919495184661 (with country code)"
              className="w-full bg-background/60 border border-border/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
            <p className="text-xs text-foreground/40">Enter digits only. Used for the WhatsApp chat link.</p>
          </div>

          {/* Phone */}
          <div className="bg-background/40 backdrop-blur-xl border border-border rounded-3xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Phone size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs">Display Phone</h3>
            </div>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              placeholder="e.g. +91 9495 184661"
              className="w-full bg-background/60 border border-border/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
            <p className="text-xs text-foreground/40">Formatted number displayed on the site.</p>
          </div>

          {/* Instagram */}
          <div className="bg-background/40 backdrop-blur-xl border border-border rounded-3xl p-8 space-y-4 flex flex-col items-center text-center">
            <div className="flex items-center gap-3 text-primary mb-2">
              <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-2xl">
                <Instagram className="w-8 h-8" />
              </div>
            </div>
            <h3 className="font-bold uppercase tracking-widest text-xs text-foreground/40">Instagram Profile</h3>
            <input
              type="url"
              value={settings.instagram}
              onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              placeholder="https://instagram.com/your-profile"
              className="w-full bg-background/60 border border-border/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </div>

          {/* Facebook */}
          <div className="bg-background/40 backdrop-blur-xl border border-border rounded-3xl p-8 space-y-4 flex flex-col items-center text-center">
            <div className="flex items-center gap-3 text-primary mb-2">
              <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-2xl">
                <Facebook className="w-8 h-8" />
              </div>
            </div>
            <h3 className="font-bold uppercase tracking-widest text-xs text-foreground/40">Facebook Page</h3>
            <input
              type="url"
              value={settings.facebook}
              onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
              placeholder="https://facebook.com/your-page"
              className="w-full bg-background/60 border border-border/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </div>

          {/* Email */}
          <div className="bg-background/40 backdrop-blur-xl border border-border rounded-3xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Mail size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs">Contact Email</h3>
            </div>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder="info@gatewaykitchen.in"
              className="w-full bg-background/60 border border-border/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </div>

          {/* Location */}
          <div className="bg-background/40 backdrop-blur-xl border border-border rounded-3xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <MapPin size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs">Google Maps URL</h3>
            </div>
            <input
              type="url"
              value={settings.location}
              onChange={(e) => setSettings({ ...settings, location: e.target.value })}
              placeholder="https://goo.gl/maps/..."
              className="w-full bg-background/60 border border-border/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <button
            type="submit"
            disabled={saving}
            className="group flex items-center gap-3 px-12 py-5 bg-primary text-primary-foreground rounded-3xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:scale-100"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            )}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
