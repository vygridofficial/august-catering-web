'use client';

import { useState, useEffect } from 'react';
import { getEventTypes, addEventType, deleteEventType, updateEventTypeStatus } from '@/lib/actions/database';
import { Plus, Trash, Loader2, Sparkles, Layout, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newEvt, setNewEvt] = useState({
    label: '',
    description: '',
    icon: '✨', // Default icon
  });

  const fetchEvents = async () => {
    setLoading(true);
    const data = await getEventTypes(true); // Include inactive for admin
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvt.label || !newEvt.description) return toast.error("Please fill in basic details.");
    
    const res = await addEventType(newEvt);
    if (res.success) {
      toast.success("Event type added!");
      setNewEvt({ label: '', description: '', icon: '✨' });
      setIsAdding(false);
      fetchEvents();
    } else {
      toast.error("Failed to add event.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this event category permanently?")) return;
    const res = await deleteEventType(id);
    if (res.success) {
      toast.success("Event type removed.");
      fetchEvents();
    } else {
      toast.error("Delete failed.");
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    const res = await updateEventTypeStatus(id, !current);
    if (res.success) {
      toast.success(`Updated visibility: ${!current ? 'Visible' : 'Hidden'}`);
      fetchEvents();
    } else {
      toast.error("Status update failed.");
    }
  };

  const syncInitial = async () => {
    const initial = [
      { id: 'wedding', label: 'Wedding Ceremony', icon: '💍', description: 'Traditional & contemporary wedding catering.' },
      { id: 'corporate', label: 'Corporate Event', icon: '🏢', description: 'Professional catering for meetings & galas.' },
      { id: 'birthday', label: 'Birthday Party', icon: '🎂', description: 'Fun & flavorful menus for all ages.' },
      { id: 'private', label: 'Private Fine Dining', icon: '🍽️', description: 'Exclusive chef-led intimate experiences.' },
    ];

    toast.promise(Promise.all(initial.map(e => addEventType(e))), {
      loading: 'Populating base event categories...',
      success: () => {
        fetchEvents();
        return 'Synced premium event types!';
      },
      error: 'Sync failed.'
    });
  };

  return (
    <div className="space-y-10 max-w-6xl w-full">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight mb-2">Event Categories</h1>
          <p className="text-foreground/60 text-base sm:text-lg max-w-2xl">Define categories for your booking engine and showcase sections.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:shrink-0">
          {!loading && events.length === 0 && (
            <button 
              onClick={syncInitial}
              className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-5 py-3.5 rounded-2xl font-bold hover:bg-secondary/80 transition-all uppercase tracking-widest text-[10px] sm:text-xs whitespace-nowrap"
            >
              <Sparkles size={18} /> Sync Premium Mocks
            </button>
          )}
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-3.5 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-[10px] sm:text-xs whitespace-nowrap"
          >
            <Plus size={18} /> {isAdding ? 'Cancel' : 'New Event Type'}
          </button>
        </div>
      </header>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/50 backdrop-blur-2xl border border-white/20 p-8 rounded-[2.5rem] shadow-2xl"
        >
          <form onSubmit={handleAdd} className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/40 px-2">Label (Public Display)</label>
                <input 
                  type="text" 
                  value={newEvt.label}
                  onChange={e => setNewEvt({...newEvt, label: e.target.value})}
                  placeholder="e.g. Traditional Wedding"
                  className="w-full bg-border/10 border-border/30 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/40 px-2">Icon (Emoji/Symbol)</label>
                <input 
                  type="text" 
                  value={newEvt.icon}
                  onChange={e => setNewEvt({...newEvt, icon: e.target.value})}
                  placeholder="💍, 🏢, etc."
                  className="w-full bg-border/10 border-border/30 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/40 px-2">Description</label>
              <textarea 
                value={newEvt.description}
                onChange={e => setNewEvt({...newEvt, description: e.target.value})}
                placeholder="A brief explanation for the booking form..."
                rows={3}
                className="w-full bg-border/10 border-border/30 rounded-[2rem] px-5 py-3.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>

            <div className="flex justify-end pt-2 sm:pt-4">
              <button 
                type="submit"
                className="w-full sm:w-auto bg-foreground text-background px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Create Event Type
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-primary/40" size={48} />
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-24 text-center space-y-6 bg-background/40 border border-dashed border-white/20 rounded-[3rem]">
          <Layout className="text-foreground/5" size={100} />
          <div className="space-y-2">
            <h3 className="text-2xl font-heading font-bold opacity-30 uppercase tracking-widest">No Event Categories</h3>
            <p className="text-foreground/20 max-w-sm mx-auto">Click 'Sync' to launch standard event types or add custom categories above.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {events.map((evt, i) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-6 sm:p-8 rounded-[2rem] border transition-all ${evt.isActive ? 'bg-card/40 border-primary/20' : 'bg-secondary/40 border-transparent opacity-60 grayscale'}`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="text-3xl sm:text-4xl leading-none">{evt.icon}</span>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => toggleStatus(evt.id, evt.isActive)}
                    className={`p-2.5 rounded-xl transition-all ${evt.isActive ? 'bg-primary/10 text-primary' : 'bg-secondary text-foreground/40'}`}
                    title={evt.isActive ? "Set Inactive" : "Set Active"}
                  >
                    {evt.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button 
                    onClick={() => handleDelete(evt.id)}
                    className="p-2.5 bg-destructive/5 text-destructive/40 rounded-xl hover:bg-destructive hover:text-white transition-all"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-heading font-bold mb-2 break-words">{evt.label}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{evt.description}</p>
              <div className="mt-5 flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${evt.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-foreground/20'}`} />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{evt.isActive ? 'Live on Site' : 'Hidden'}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
