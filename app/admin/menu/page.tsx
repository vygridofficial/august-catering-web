'use client';

import { useState, useEffect } from 'react';
import { getMenuItems, addMenuItem, deleteMenuItem, uploadImage } from '@/lib/actions/database';
import { Plus, Trash, Edit2, Loader2, Image as ImageIcon, ArrowUpRight, ChefHat, GlassWater } from 'lucide-react';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  name: string;
  subtitle?: string;
  category: string;
  price: string;
  image?: string;
  createdAt?: any;
}

export default function AdminMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newItem, setNewItem] = useState({ name: '', subtitle: '', category: 'Starters', price: '', image: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    const data = await getMenuItems();
    setItems(data as MenuItem[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      if (newItem.image) {
        setPreviewUrl(newItem.image);
      } else {
        setPreviewUrl(null);
      }
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile, newItem.image]);

  const handleAdd = async () => {
    if (!newItem.name || !newItem.price) {
      toast.error("Manifest requires a designation and valuation.");
      return;
    }
    
    setIsUploading(true);
    let finalImageUrl = newItem.image;

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const uploadRes = await uploadImage(formData);
      if (uploadRes.success && uploadRes.url) {
        finalImageUrl = uploadRes.url;
      } else {
        toast.error('Failed to upload menu asset.');
        setIsUploading(false);
        return;
      }
    }

    const payload = {
      ...newItem,
      image: finalImageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    };
    
    const res = await addMenuItem(payload);
    if (res.success) {
      fetchItems();
      setNewItem({ name: '', subtitle: '', category: 'Starters', price: '', image: '' });
      setSelectedFile(null);
      setIsAdding(false);
      toast.success("Culinary entry synchronized.");
    } else {
      toast.error("Error committing manifest entry.");
    }
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently erase this culinary record?")) return;
    const res = await deleteMenuItem(id);
    if (res.success) {
      fetchItems();
      toast.success("Record purged.");
    } else {
      toast.error("Failed to erase record.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 font-outfit">
      
      {/* Header Engine */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-2 h-2 rounded-full bg-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Archives & Catalogues</span>
          </div>
          <h1 className="text-6xl font-heading font-black text-white tracking-tighter uppercase leading-none">THE <span className="text-primary italic font-serif">MANIFEST.</span></h1>
          <p className="text-white/40 mt-4 text-lg font-medium max-w-xl">Curating the definitive culinary sequence for the August Catering signature experiences.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="group relative px-10 py-5 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl"
        >
          <span className="relative z-10 flex items-center gap-2">
            {isAdding ? <X size={16} className="text-black"/> : <Plus size={16} className="text-black"/>}
            {isAdding ? 'Deactivate' : 'Append Entry'}
          </span>
          <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
        </button>
      </div>

      {isAdding && (
        <div className="bg-white/[0.01] backdrop-blur-3xl border border-white/5 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
          
          <div className="grid gap-12 lg:grid-cols-12 relative z-10">
            {/* Control Panel */}
            <div className="lg:col-span-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Designation (Name)</label>
                        <input 
                            type="text" 
                            value={newItem.name}
                            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                            className="w-full p-5 bg-white/[0.01] border border-white/5 rounded-2xl text-white/60 focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none transition-all text-xs font-bold tracking-widest"
                            placeholder="CUISINE IDENTITY..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Annotation (Subtitle)</label>
                        <input 
                            type="text" 
                            value={newItem.subtitle}
                            onChange={(e) => setNewItem({...newItem, subtitle: e.target.value})}
                            className="w-full p-5 bg-white/[0.01] border border-white/5 rounded-2xl text-white/60 focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none transition-all text-xs font-bold tracking-widest"
                            placeholder="CHEF SPECIAL..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Classification (Category)</label>
                        <select 
                            value={newItem.category}
                            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                            className="w-full p-5 bg-[#050505] border border-white/5 rounded-2xl text-white/60 focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none transition-all text-xs font-black uppercase tracking-widest appearance-none"
                        >
                            <option>Starters</option>
                            <option>Mains</option>
                            <option>Desserts</option>
                            <option>Beverages</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Valuation (Price Tag)</label>
                        <input 
                            type="text" 
                            value={newItem.price}
                            onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                            className="w-full p-5 bg-white/[0.01] border border-white/5 rounded-2xl text-white/60 focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none transition-all text-xs font-bold tracking-widest"
                            placeholder="₹0,000 /..."
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <button 
                    onClick={handleAdd}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-4 bg-primary text-black px-10 py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 shadow-2xl shadow-primary/20"
                    >
                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpRight size={16} />}
                    {isUploading ? 'SYNCHRONIZING...' : 'COMMIT TO MANIFEST'}
                    </button>
                </div>
            </div>

            {/* Ingestion Engine */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Visual Archetype</label>
                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border-2 border-dashed border-white/5 bg-white/[0.01] flex items-center justify-center group hover:border-primary/20 transition-all duration-700">
                    {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover saturate-[0.8]" />
                    ) : (
                    <div className="flex flex-col items-center gap-4 text-white/10 group-hover:text-primary transition-colors duration-700">
                        <ImageIcon size={48} strokeWidth={1} />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em]">No Media Stream</span>
                    </div>
                    )}
                    {isUploading && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                        <Loader2 size={32} className="text-primary animate-spin" />
                    </div>
                    )}
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                            if(e.target.files?.[0]) {
                                setSelectedFile(e.target.files[0]);
                                setNewItem({...newItem, image: ''});
                            }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
                <div className="space-y-2">
                    <input 
                        type="url" 
                        value={newItem.image}
                        disabled={!!selectedFile}
                        onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                        className="w-full p-4 bg-white/[0.01] border border-white/5 rounded-xl text-white/40 focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-20 text-[10px] font-bold tracking-widest"
                        placeholder="OR SOURCE URL EXTERNALLY..."
                    />
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Manifest Grid */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-48 text-white/20 gap-4">
            <Loader2 className="animate-spin" size={32} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Loading Archives...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="p-32 text-center text-white/10 border-2 border-dashed border-white/5 rounded-[4rem]">
              <ChefHat size={64} strokeWidth={1} className="mx-auto mb-8 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em]">The Manifest is currently hollow.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {items.map(item => (
                <div key={item.id} className="bg-white/[0.01] backdrop-blur-3xl border border-white/5 p-6 pr-10 rounded-[2.5rem] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-8 group hover:border-primary/20 hover:bg-white/[0.03] transition-all duration-700">
                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0 relative">
                    {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover saturate-[0.6] group-hover:saturate-100 group-hover:scale-110 transition-all duration-1000" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10">
                            <ChefHat size={24} />
                        </div>
                    )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                             <span className="text-[8px] font-black px-3 py-1 bg-primary/10 text-primary uppercase tracking-[0.3em] rounded-full border border-primary/20">{item.category}</span>
                             {item.subtitle && <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em]">{item.subtitle}</span>}
                        </div>
                        <h3 className="font-heading font-black text-3xl text-white group-hover:text-primary transition-all duration-500 uppercase tracking-tighter leading-none">{item.name}</h3>
                    </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-12 pl-4 sm:pl-0">
                    <span className="font-heading font-black text-3xl text-white/60 tracking-tighter">{item.price || "QUOTATION REQUIRED"}</span>
                    <button 
                        onClick={() => handleDelete(item.id)} 
                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all duration-500 shadow-xl"
                    >
                        <Trash size={20} />
                    </button>
                </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
