'use client';

import { useState, useEffect } from 'react';
import { getServices, addService, deleteService } from '@/lib/actions/database';
import { Plus, Trash, Loader2, Sparkles, Layout } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const COLOR_OPTIONS = [
  { name: 'Emerald', value: 'from-emerald-50 to-teal-100' },
  { name: 'Indigo', value: 'from-blue-50 to-indigo-100' },
  { name: 'Rose', value: 'from-rose-50 to-orange-100' },
  { name: 'Amber', value: 'from-amber-50 to-yellow-100' },
  { name: 'Violet', value: 'from-violet-50 to-purple-100' },
];

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newSvc, setNewSvc] = useState({
    title: '',
    description: '',
    style: '',
    color: COLOR_OPTIONS[0].value
  });

  const fetchServices = async () => {
    setLoading(true);
    const data = await getServices();
    setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSvc.title || !newSvc.description) return toast.error("Please fill in title and description.");
    
    const res = await addService(newSvc);
    if (res.success) {
      toast.success("Service category added!");
      setNewSvc({ title: '', description: '', style: '', color: COLOR_OPTIONS[0].value });
      setIsAdding(false);
      fetchServices();
    } else {
      toast.error("Failed to add service.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this service category?")) return;
    const res = await deleteService(id);
    if (res.success) {
      toast.success("Service removed.");
      fetchServices();
    } else {
      toast.error("Delete failed.");
    }
  };

  // Logic to sync initial hardcoded data if empty
  const syncInitialData = async () => {
    const initial = [
      {
        title: "Wedding Catering",
        description: "An elaborate and luxurious dining experience. From buffet setups to live counters and customized wedding cakes, we handle large guest counts with elegance.",
        style: "Buffet, Elegant Plated",
        color: "from-emerald-50 to-teal-100",
      },
      {
        title: "Corporate Events",
        description: "Comprehensive services for private or corporate events. Regional, continental, and international cuisines tailored for seamless presentation.",
        style: "Professional, Structured",
        color: "from-blue-50 to-indigo-100",
      },
      {
        title: "Private Parties",
        description: "Wide array of culinary options tailored to themes and dietary restrictions. We manage food preparation and service, ensuring a seamless dining experience.",
        style: "Customized, Themed",
        color: "from-rose-50 to-orange-100",
      }
    ];

    toast.promise(Promise.all(initial.map(s => addService(s))), {
      loading: 'Syncing initial data...',
      success: () => {
        fetchServices();
        return 'Synced successfully!';
      },
      error: 'Sync failed.'
    });
  };

  return (
    <div className="space-y-12 max-w-6xl">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-heading font-bold tracking-tight mb-2">Event Services</h1>
          <p className="text-foreground/60 text-lg">Manage the event categories and service discoveries on your homepage.</p>
        </div>
        <div className="flex gap-4">
          {services.length === 0 && !loading && (
            <button 
              onClick={syncInitialData}
              className="flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-4 rounded-2xl font-bold hover:bg-secondary/80 transition-all uppercase tracking-widest text-xs"
            >
              <Sparkles size={18} /> Sync Initial
            </button>
          )}
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-xs"
          >
            <Plus size={18} /> {isAdding ? 'Cancel' : 'New Service'}
          </button>
        </div>
      </header>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background/80 backdrop-blur-2xl border border-border p-8 rounded-[2.5rem] shadow-2xl"
        >
          <form onSubmit={handleAdd} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 px-2">Service Title</label>
                <input 
                  type="text" 
                  value={newSvc.title}
                  onChange={e => setNewSvc({...newSvc, title: e.target.value})}
                  placeholder="e.g. Destination Weddings"
                  className="w-full bg-border/20 border-border/50 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-foreground/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 px-2">Service Style</label>
                <input 
                  type="text" 
                  value={newSvc.style}
                  onChange={e => setNewSvc({...newSvc, style: e.target.value})}
                  placeholder="e.g. Gourmet, Live Kitchen"
                  className="w-full bg-border/20 border-border/50 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-foreground/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 px-2">Description</label>
              <textarea 
                value={newSvc.description}
                onChange={e => setNewSvc({...newSvc, description: e.target.value})}
                placeholder="Describe the service in detail..."
                rows={4}
                className="w-full bg-border/20 border-border/50 rounded-[2rem] px-6 py-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-foreground/20"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 px-2 block">Visual Theme (Gradient)</label>
              <div className="flex flex-wrap gap-4">
                {COLOR_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setNewSvc({...newSvc, color: opt.value})}
                    className={`
                      px-6 py-3 rounded-xl border-2 transition-all flex items-center gap-3
                      ${newSvc.color === opt.value ? 'border-primary ring-4 ring-primary/10' : 'border-transparent bg-border/20 hover:bg-border/30'}
                    `}
                  >
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${opt.value} shadow-inner`}></div>
                    <span className="text-sm font-semibold">{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                className="bg-foreground text-background px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Create Service Category
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-primary/40" size={48} />
        </div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-center space-y-6 bg-background/40 border border-dashed border-border rounded-[3rem]">
          <Layout className="text-foreground/10" size={80} />
          <div className="space-y-2">
            <h3 className="text-2xl font-heading font-bold">No Services Defined</h3>
            <p className="text-foreground/40">Launch your event categories by adding your first service above.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`p-10 rounded-[3rem] bg-gradient-to-br ${svc.color} border border-white/50 shadow-2xl shadow-black/5 relative overflow-hidden group`}
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-heading font-bold text-foreground leading-tight">{svc.title}</h3>
                  <button 
                    onClick={() => handleDelete(svc.id)}
                    className="p-3 bg-white/40 text-destructive/60 rounded-2xl hover:bg-destructive hover:text-white transition-all scale-0 group-hover:scale-100 origin-right"
                  >
                    <Trash size={18} />
                  </button>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">{svc.description}</p>
                <div className="inline-flex items-center self-start px-4 py-2 rounded-full bg-white/60 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 backdrop-blur-md border border-white/30">
                  {svc.style}
                </div>
              </div>
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/20 blur-3xl rounded-full"></div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
