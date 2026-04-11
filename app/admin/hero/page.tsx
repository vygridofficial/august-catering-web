'use client';

import { useState, useEffect } from 'react';
import { getHeroImages, addHeroImage, deleteHeroImage, updateHeroImageStatus, uploadImage } from '@/lib/actions/database';
import { Plus, Trash2, Image as ImageIcon, Loader2, UploadCloud, Sparkles, Eye, EyeOff, X } from 'lucide-react';
import { toast } from 'sonner';

interface HeroImage {
  id: string;
  url: string;
  alt?: string;
  isActive: boolean;
  createdAt?: any;
}

export default function HeroAdmin() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    const data = await getHeroImages();
    setImages(data as unknown as HeroImage[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      if (newUrl) {
        setPreviewUrl(newUrl);
      } else {
        setPreviewUrl(null);
      }
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Free memory when component is unmounted or file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile, newUrl]);

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl && !selectedFile) return toast.error('Please provide an Image URL or Upload a File');
    
    setIsUploading(true);
    let finalUrl = newUrl;

    // Handle File Upload if selected
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const uploadRes = await uploadImage(formData);
      if (uploadRes.success && uploadRes.url) {
        finalUrl = uploadRes.url;
      } else {
        toast.error('Failed to upload image file to storage.');
        setIsUploading(false);
        return;
      }
    }

    const res = await addHeroImage(finalUrl, newAlt.trim());
    if (res.success) {
      toast.success('Hero image added successfully!');
      setNewUrl('');
      setNewAlt('');
      setSelectedFile(null);
      setIsAdding(false);
      fetchImages();
    } else {
      toast.error('Failed to save hero image to database.');
    }
    setIsUploading(false);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const res = await updateHeroImageStatus(id, !currentStatus);
    if (res.success) {
      toast.success(`Banner ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchImages();
    } else {
      toast.error('Failed to update status.');
    }
  };

  const syncMocks = async () => {
    const mocks = [
      { url: '/images/hero-1.png', alt: 'Premium Kerala Wedding Feast' },
      { url: '/images/hero-2.png', alt: 'Grand Corporate Gala Event' },
      { url: '/images/hero-3.png', alt: 'Expert Chef Plating Precision' },
      { url: '/images/hero-4.png', alt: 'Gateway Kitchen Catering Setup' },
    ];

    toast.promise(Promise.all(mocks.map(m => addHeroImage(m.url, m.alt))), {
      loading: 'Syncing mock banners...',
      success: () => {
        fetchImages();
        return 'Mock banners synced to your dashboard!';
      },
      error: 'Sync failed.'
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this hero image?')) return;
    const res = await deleteHeroImage(id);
    if (res.success) {
      toast.success('Hero image removed.');
      fetchImages();
    } else {
      toast.error('Failed to remove image.');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading font-extrabold text-foreground tracking-tight">Hero Banners</h1>
          <p className="text-muted-foreground mt-2">Manage the main sliding banner images on the storefront homepage.</p>
        </div>
        <div className="flex gap-4">
          {images.length === 0 && !loading && (
            <button 
              onClick={syncMocks}
              className="flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-2xl font-bold hover:bg-secondary/80 transition-all uppercase tracking-widest text-[10px]"
            >
              <Sparkles size={16} /> Sync Samples
            </button>
          )}
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-medium hover:scale-105 transition-transform shadow-xl"
          >
            {isAdding ? <Loader2 size={20} className="hidden" /> : <Plus size={20} />}
            {isAdding ? 'Cancel' : 'Add Banner'}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-card/50 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-xl">
          <form onSubmit={handleAddImage} className="grid gap-6 md:grid-cols-2">
            
            <div className="space-y-4 md:col-span-2 p-6 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <UploadCloud size={18} className="text-primary"/> 
                Upload Local File
              </label>
              <input 
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setSelectedFile(e.target.files[0]);
                    setNewUrl(''); // clear url if file is selected
                  }
                }}
                className="w-full file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 transition-all cursor-pointer text-foreground/70"
              />
              {selectedFile && (
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-foreground/70 hover:text-foreground"
                >
                  <X size={14} /> Remove selected file
                </button>
              )}
            </div>

            <div className="flex items-center justify-center md:col-span-2 text-foreground/40 font-bold text-sm uppercase">
              &mdash; OR &mdash;
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Direct Image URL</label>
              <input 
                type="url" 
                value={newUrl}
                onChange={(e) => {
                  setNewUrl(e.target.value);
                  setSelectedFile(null); // clear file if url is typed
                }}
                disabled={!!selectedFile}
                placeholder="https://images.unsplash.com/..." 
                className="w-full p-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Alt Text (Optional)</label>
              <input 
                type="text" 
                value={newAlt}
                onChange={(e) => setNewAlt(e.target.value)}
                placeholder="Premium wedding catering setup..." 
                className="w-full p-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            
            <div className="space-y-4 md:col-span-2">
              <label className="text-sm font-medium text-foreground">Hero Banner Preview</label>
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border-2 border-dashed border-border bg-muted/50 flex items-center justify-center group">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon size={48} className="opacity-20" />
                    <p className="text-xs font-medium italic">No banner selected yet</p>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 size={32} className="text-primary animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end mt-4">
              <button 
                type="submit" 
                disabled={isUploading}
                className="flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-xl font-bold hover:bg-foreground/90 transition-all disabled:opacity-70"
              >
                {isUploading && <Loader2 size={18} className="animate-spin" />}
                {isUploading ? 'Uploading & Publishing...' : 'Publish Banner'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground bg-secondary/30 rounded-3xl border border-dashed border-border">
          <ImageIcon size={64} className="mb-4 opacity-50" />
          <p className="text-xl font-medium">No hero banners found.</p>
          <p>The storefront will use a generic fallback until you upload banners here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img.id} className={`group relative bg-card rounded-3xl overflow-hidden shadow-xl border transition-all aspect-[16/9] ${img.isActive ? 'border-primary/20' : 'border-border/50 grayscale-[0.8]'}`}>
              <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <p className="text-white font-medium truncate mb-2">{img.alt || 'Hero Banner'}</p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleToggleStatus(img.id, img.isActive)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${img.isActive ? 'bg-white text-black' : 'bg-primary text-white'}`}
                  >
                    {img.isActive ? <><EyeOff size={14} /> Disable</> : <><Eye size={14} /> Enable</>}
                  </button>
                  <button 
                    onClick={() => handleDelete(img.id)}
                    className="p-2 bg-destructive text-white rounded-xl hover:scale-110 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {!img.isActive && (
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[10px] text-white/70 font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10">
                  Hidden From Site
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
