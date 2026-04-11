'use client';

import { useState, useEffect } from 'react';
import { getCulinaryStyles, addCulinaryStyle, deleteCulinaryStyle, updateCulinaryStyleStatus } from '@/lib/actions/database';
import { Plus, Trash, Loader2, Sparkles, Utensils, Eye, EyeOff, ListPlus, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCulinary() {
  const [styles, setStyles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newStyle, setNewStyle] = useState({
    label: '',
    description: '',
    icon: '🍲',
    contents: [] as string[],
  });

  const [newItem, setNewItem] = useState('');

  const fetchStyles = async () => {
    setLoading(true);
    const data = await getCulinaryStyles(true);
    setStyles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStyles();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStyle.label || !newStyle.description) return toast.error("Please fill in basic details.");
    
    const res = await addCulinaryStyle(newStyle);
    if (res.success) {
      toast.success("Culinary style added!");
      setNewStyle({ label: '', description: '', icon: '🍲', contents: [] });
      setIsAdding(false);
      fetchStyles();
    } else {
      toast.error("Failed to add style.");
    }
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    setNewStyle({ ...newStyle, contents: [...newStyle.contents, newItem.trim()] });
    setNewItem('');
  };

  const removeItem = (index: number) => {
    const next = [...newStyle.contents];
    next.splice(index, 1);
    setNewStyle({ ...newStyle, contents: next });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this culinary style permanently?")) return;
    const res = await deleteCulinaryStyle(id);
    if (res.success) {
      toast.success("Style removed.");
      fetchStyles();
    } else {
      toast.error("Delete failed.");
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    const res = await updateCulinaryStyleStatus(id, !current);
    if (res.success) {
      toast.success(`Updated visibility: ${!current ? 'Visible' : 'Hidden'}`);
      fetchStyles();
    } else {
      toast.error("Status update failed.");
    }
  };

  const syncInitial = async () => {
    const initial = [
      { 
        label: 'Traditional Kerala Sadya', 
        icon: '🌿', 
        description: 'Authentic vegetarian feast served on banana leaf with 24+ traditional dishes.',
        contents: ['Inji Puli', 'Olan', 'Kalan', 'Avial', 'Thorans', 'Sambar', 'Two types of Payasam']
      },
      { 
        label: 'Multi-Cuisine Buffet', 
        icon: '🌍', 
        description: 'A grand spread featuring Indian, Chinese, and Continental delicacies.',
        contents: ['Mutton Biryani', 'Chicken Roast', 'Fish Moilee', 'Fried Rice', 'Pasta Arrabbiata', 'Assorted Desserts']
      },
      { 
        label: 'Plated Fine Dining', 
        icon: '👨‍🍳', 
        description: 'Exquisite multi-course individual servings for high-end intimate galas.',
        contents: ['Pan-seared Scallops', 'Slow-cooked Lamb Shank', 'Truffle Mushroom Risotto', 'Artisan Bread Basket']
      },
      { 
        label: 'Contemporary Fusion', 
        icon: '🧪', 
        description: 'Creative blend of Kerala flavors with modern global cooking techniques.',
        contents: ['Fish Pollichathu Tacos', 'Beef Ularthiyathu Slider', 'Appam with Stew Mousse', 'Jackfruit Cheesecake']
      },
    ];

    toast.promise(Promise.all(initial.map(s => addCulinaryStyle(s))), {
      loading: 'Populating premium culinary styles...',
      success: () => {
        fetchStyles();
        return 'Synced culinary mocks!';
      },
      error: 'Sync failed.'
    });
  };

  return (
    <div className="space-y-12 max-w-6xl">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-heading font-bold tracking-tight mb-2">Culinary Styles</h1>
          <p className="text-foreground/60 text-lg">Manage the menu options and detailed contents shown to clients.</p>
        </div>
        <div className="flex gap-4">
          {!loading && styles.length === 0 && (
            <button 
              onClick={syncInitial}
              className="flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-4 rounded-2xl font-bold hover:bg-secondary/80 transition-all uppercase tracking-widest text-xs"
            >
              <Sparkles size={18} /> Sync Premium Mocks
            </button>
          )}
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-xs"
          >
            <Plus size={18} /> {isAdding ? 'Cancel' : 'New Culinary Style'}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card/50 backdrop-blur-2xl border border-white/20 p-8 md:p-12 rounded-[3rem] shadow-2xl mb-12">
              <form onSubmit={handleAdd} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 px-2">Style Label</label>
                    <input 
                      type="text" 
                      value={newStyle.label}
                      onChange={e => setNewStyle({...newStyle, label: e.target.value})}
                      placeholder="e.g. Traditional Kerala Sadya"
                      className="w-full bg-border/10 border-border/30 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 px-2">Icon</label>
                    <input 
                      type="text" 
                      value={newStyle.icon}
                      onChange={e => setNewStyle({...newStyle, icon: e.target.value})}
                      placeholder="🌿, 🍲, 🌍, etc."
                      className="w-full bg-border/10 border-border/30 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 px-2">Description</label>
                  <textarea 
                    value={newStyle.description}
                    onChange={e => setNewStyle({...newStyle, description: e.target.value})}
                    placeholder="Short summary of this culinary style..."
                    rows={2}
                    className="w-full bg-border/10 border-border/30 rounded-[2rem] px-6 py-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 px-2">Style Contents (Sample Dishes)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newItem}
                      onChange={e => setNewItem(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem())}
                      placeholder="Add a dish or feature..."
                      className="flex-1 bg-border/10 border-border/30 rounded-xl px-6 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                    <button 
                      type="button"
                      onClick={addItem}
                      className="bg-secondary p-3 rounded-xl hover:bg-secondary/80 transition-colors"
                    >
                      <ListPlus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newStyle.contents.map((item, i) => (
                      <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-primary/20">
                        {item}
                        <button type="button" onClick={() => removeItem(i)} className="hover:text-foreground">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    type="submit"
                    className="bg-foreground text-background px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl"
                  >
                    Create Culinary Style
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-primary/40" size={48} />
        </div>
      ) : styles.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-24 text-center space-y-6 bg-background/40 border border-dashed border-white/20 rounded-[3rem]">
          <Utensils className="text-foreground/5" size={100} />
          <div className="space-y-2">
            <h3 className="text-2xl font-heading font-bold opacity-30 uppercase tracking-widest">No Styles Found</h3>
            <p className="text-foreground/20 max-w-sm mx-auto">Populate standard styles to get started with your culinary catalog.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {styles.map((style, i) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-8 rounded-[2.5rem] border transition-all h-full flex flex-col ${style.isActive ? 'bg-card/40 border-primary/20' : 'bg-secondary/40 border-transparent opacity-60 grayscale'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-5xl">{style.icon}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleStatus(style.id, style.isActive)}
                    className={`p-2.5 rounded-xl transition-all ${style.isActive ? 'bg-primary/10 text-primary' : 'bg-secondary text-foreground/40'}`}
                  >
                    {style.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button 
                    onClick={() => handleDelete(style.id)}
                    className="p-2.5 bg-destructive/5 text-destructive/40 rounded-xl hover:bg-destructive hover:text-white transition-all"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-2xl font-heading font-bold mb-3">{style.label}</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow">{style.description}</p>
              
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Menu Contents</p>
                <div className="flex flex-wrap gap-1.5">
                  {style.contents && style.contents.length > 0 ? (
                    style.contents.map((c: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-foreground/5 rounded-md text-[10px] font-medium border border-foreground/5">{c}</span>
                    ))
                  ) : (
                    <span className="text-[10px] text-foreground/20 italic">No contents listed</span>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${style.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-foreground/20'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{style.isActive ? 'Live' : 'Hidden'}</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
