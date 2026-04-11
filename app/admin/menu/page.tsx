'use client';

import { useState, useEffect } from 'react';
import { getMenuItems, addMenuItem, deleteMenuItem, uploadImage } from '@/lib/actions/database';
import { Plus, Trash, Edit2, Loader2, Image as ImageIcon } from 'lucide-react';
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

    // Free memory when component is unmounted or file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile, newItem.image]);

  const handleAdd = async () => {
    if (!newItem.name || !newItem.price) {
      toast.error("Please fill in the item name and price.");
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
        toast.error('Failed to upload menu image.');
        setIsUploading(false);
        return;
      }
    }

    const payload = {
      ...newItem,
      image: finalImageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800', // fallback
    };
    
    const res = await addMenuItem(payload);
    if (res.success) {
      fetchItems();
      setNewItem({ name: '', subtitle: '', category: 'Starters', price: '', image: '' });
      setSelectedFile(null);
      toast.success("Menu item added successfully.");
    } else {
      toast.error("Error adding item.");
    }
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteMenuItem(id);
    if (res.success) {
      fetchItems();
      toast.success("Menu item deleted.");
    } else {
      toast.error("Failed to delete menu item.");
    }
  };

  return (
    <div className="w-full max-w-5xl">
      <h1 className="text-5xl font-heading font-bold tracking-tight mb-2">Menu Setup</h1>
      <p className="text-foreground/60 mb-12">Manage the services and catering items displayed on the public site.</p>

      {/* Add Item Panel */}
      <div className="bg-background/80 backdrop-blur-xl border border-border p-6 md:p-8 rounded-[2.5rem] shadow-sm mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
        <div className="w-full">
          <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-2 block">Item Name</label>
          <input 
            type="text" 
            value={newItem.name}
            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            className="w-full bg-border/20 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="e.g. Signature Prawns"
          />
        </div>
        <div className="w-full">
          <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-2 block">Subtitle (e.g. Chef Special)</label>
          <input 
            type="text" 
            value={newItem.subtitle}
            onChange={(e) => setNewItem({...newItem, subtitle: e.target.value})}
            className="w-full bg-border/20 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="Chef Special"
          />
        </div>
        <div className="w-full">
          <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-2 block">Category</label>
          <select 
            value={newItem.category}
            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
            className="w-full bg-border/20 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
          >
            <option>Starters</option>
            <option>Mains</option>
            <option>Desserts</option>
            <option>Beverages</option>
          </select>
        </div>
        <div className="w-full">
          <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-2 block">Price Tag</label>
          <input 
            type="text" 
            value={newItem.price}
            onChange={(e) => setNewItem({...newItem, price: e.target.value})}
            className="w-full bg-border/20 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="₹1200 / portion"
          />
        </div>
        
        <div className="w-full">
          <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-2 block">Item Preview</label>
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-border bg-border/10 flex items-center justify-center mb-4">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Menu Item Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-foreground/20">
                <ImageIcon size={32} />
                <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                <Loader2 size={24} className="text-primary animate-spin" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-3">
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                if(e.target.files?.[0]) {
                  setSelectedFile(e.target.files[0]);
                  setNewItem({...newItem, image: ''});
                }
              }}
              className="w-full file:mr-2 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground text-xs text-foreground/70"
            />
            <div className="flex items-center gap-2 w-full">
              <input 
                type="url" 
                value={newItem.image}
                disabled={!!selectedFile}
                onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                className="w-full bg-border/20 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-50"
                placeholder="Or paste URL..."
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleAdd}
          disabled={isUploading}
          className="bg-primary h-14 text-primary-foreground rounded-2xl hover:scale-105 transition-all flex items-center justify-center font-bold text-sm tracking-widest uppercase disabled:opacity-70 shadow-lg"
        >
          {isUploading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Plus size={20} className="mr-2" />}
          {isUploading ? 'Saving...' : 'Add Item'}
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-foreground/40 gap-3">
            <Loader2 className="animate-spin" /> Loading Menu...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-foreground/40 border border-dashed rounded-3xl">
            No items found. Add your first catering package above.
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="bg-background/40 backdrop-blur-md border border-border p-4 pr-6 rounded-[2rem] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-secondary border border-border/50 shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-foreground/20">
                      <ImageIcon size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-xl truncate">{item.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary uppercase tracking-widest rounded-full">{item.category}</span>
                    {item.subtitle && <span className="text-sm text-foreground/50 italic">{item.subtitle}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-12 pl-2 sm:pl-0">
                <span className="font-heading font-bold text-xl whitespace-nowrap">{item.price || "Contact for pricing"}</span>
                <button onClick={() => handleDelete(item.id)} className="text-destructive/50 hover:text-destructive transition-colors p-3 hover:bg-destructive/10 bg-background/50 backdrop-blur-xl shrink-0 rounded-2xl shadow-sm">
                  <Trash size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
