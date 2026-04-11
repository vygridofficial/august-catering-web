'use client';

import { useState, useEffect } from 'react';
import { getGalleryItems, addGalleryItem, deleteGalleryItem, uploadImage } from '@/lib/actions/database';
import { Plus, Trash2, Image as ImageIcon, Loader2, UploadCloud, X, ArrowUpRight, MonitorPlay } from 'lucide-react';
import { toast } from 'sonner';

interface GalleryItem {
  id: string;
  url: string;
  alt?: string;
  type?: 'image' | 'video';
  createdAt?: any;
}

export default function GalleryAdmin() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    const data = await getGalleryItems(50);
    setImages(data as any[]);
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
    if (!newUrl && !selectedFile) return toast.error('Media URL or File is required');
    
    setIsUploading(true);
    let finalUrl = newUrl;
    let finalType = mediaType;

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const uploadRes = await uploadImage(formData);
      if (uploadRes.success && uploadRes.url) {
        finalUrl = uploadRes.url;
        finalType = (uploadRes as any).type || 'image';
      } else {
        toast.error('Failed to upload media.');
        setIsUploading(false);
        return;
      }
    }

    const res = await addGalleryItem(finalUrl, newAlt.trim(), finalType);
    if (res.success) {
      toast.success('Media added to gallery!');
      setNewUrl('');
      setNewAlt('');
      setSelectedFile(null);
      setIsAdding(false);
      fetchImages();
    } else {
      toast.error('Failed to add media.');
    }
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const res = await deleteGalleryItem(id);
    if (res.success) {
      toast.success('Media permanently deleted.');
      fetchImages();
    } else {
      toast.error('Failed to delete.');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 font-outfit">
      
      {/* Header Engine */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-2 h-2 rounded-full bg-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Visual Repository</span>
          </div>
          <h1 className="text-6xl font-heading font-black text-white tracking-tighter uppercase leading-none">THE <span className="text-primary italic font-serif">VAULT.</span></h1>
          <p className="text-white/40 mt-4 text-lg font-medium max-w-xl">Curating high-fidelity captures for the August Catering signature portfolio.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="group relative px-10 py-5 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl"
        >
          <span className="relative z-10 flex items-center gap-2">
            {isAdding ? <X size={16} /> : <Plus size={16} />}
            {isAdding ? 'Deactivate' : 'Append Matrix'}
          </span>
          <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
        </button>
      </div>

      {isAdding && (
        <div className="bg-white/[0.01] backdrop-blur-3xl border border-white/5 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
          
          <form onSubmit={handleAddImage} className="grid gap-12 lg:grid-cols-12 relative z-10">
            {/* Control Panel */}
            <div className="lg:col-span-4 space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Protocol Type</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setMediaType('image')}
                      className={`flex-1 p-5 rounded-2xl border transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 ${mediaType === 'image' ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_20px_rgba(255,183,0,0.1)]' : 'border-white/5 bg-white/[0.02] text-white/20 opacity-50'}`}
                    >
                      <ImageIcon size={16} />
                      Static
                    </button>
                    <button 
                      type="button"
                      onClick={() => setMediaType('video')}
                      className={`flex-1 p-5 rounded-2xl border transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 ${mediaType === 'video' ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_20px_rgba(255,183,0,0.1)]' : 'border-white/5 bg-white/[0.02] text-white/20 opacity-50'}`}
                    >
                      <MonitorPlay size={16} />
                      Motion
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Digital Manifest (URL)</label>
                      <input 
                        type="url" 
                        value={newUrl}
                        onChange={(e) => {
                          setNewUrl(e.target.value);
                          setSelectedFile(null);
                        }}
                        disabled={!!selectedFile}
                        placeholder="HTTPS://SOURCE.COM/..." 
                        className="w-full p-5 bg-white/[0.01] border border-white/5 rounded-2xl text-white/60 focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none transition-all disabled:opacity-30 text-xs font-bold tracking-widest"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Title Annotation</label>
                      <input 
                        type="text" 
                        value={newAlt}
                        onChange={(e) => setNewAlt(e.target.value)}
                        placeholder="CUISINE IDENTITY..." 
                        className="w-full p-5 bg-white/[0.01] border border-white/5 rounded-2xl text-white/60 focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none transition-all text-xs font-bold tracking-widest"
                      />
                   </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-4 bg-primary text-black px-10 py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 shadow-2xl shadow-primary/20"
                  >
                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpRight size={16} />}
                    {isUploading ? 'SYNCHRONIZING...' : `APPEND ${mediaType === 'image' ? 'CAPTURE' : 'REEL'}`}
                  </button>
                </div>
            </div>

            {/* Ingestion Engine */}
            <div className="lg:col-span-8 flex flex-col gap-10">
                <div className="relative group">
                    <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Ingestion Portal</label>
                    <div className="relative aspect-video rounded-[3rem] overflow-hidden border-2 border-dashed border-white/5 bg-white/[0.01] flex items-center justify-center group-hover:border-primary/20 transition-all duration-700">
                      {previewUrl ? (
                        mediaType === 'video' ? (
                          <video src={previewUrl} className="w-full h-full object-cover saturate-[0.8]" controls />
                        ) : (
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover saturate-[0.8]" />
                        )
                      ) : (
                        <div className="flex flex-col items-center gap-6 text-white/10 group-hover:text-primary transition-colors duration-700">
                          <UploadCloud size={64} strokeWidth={1} />
                          <div className="text-center">
                              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Drag & Drop Local Assets</p>
                              <p className="text-[8px] font-bold uppercase tracking-[0.2em] mt-2 opacity-50">HEIC, WEBP, MP4 SUPPORTED</p>
                          </div>
                        </div>
                      )}
                      <input 
                        type="file"
                        accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setSelectedFile(e.target.files[0]);
                            setMediaType(e.target.files[0].type.startsWith('video/') ? 'video' : 'image');
                            setNewUrl('');
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                          <Loader2 size={48} className="text-primary animate-spin" />
                          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Uploading Stream...</span>
                        </div>
                      )}
                    </div>
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="absolute top-18 right-8 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/40 hover:text-white transition-all shadow-xl"
                      >
                        <X size={16} />
                      </button>
                    )}
                </div>
            </div>
          </form>
        </div>
      )}

      {/* Persistence Matrix */}
      {loading ? (
        <div className="flex items-center justify-center py-48">
          <Loader2 className="animate-spin text-primary" size={64} strokeWidth={1}/>
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-48 text-white/10 border-2 border-dashed border-white/5 rounded-[4rem]">
          <ImageIcon size={64} strokeWidth={1} className="mb-8 opacity-20" />
          <p className="text-xs font-black uppercase tracking-[0.5em]">The Vault is currently hollow.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {images.map((img) => (
            <div key={img.id} className="group relative bg-white/[0.01] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 aspect-square hover:border-primary/20 transition-all duration-700">
              {img.type === 'video' ? (
                <video 
                  src={img.url} 
                  className="w-full h-full object-cover saturate-[0.5] group-hover:saturate-100 group-hover:scale-110 transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  muted
                  loop
                  onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                  onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                />
              ) : (
                <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover saturate-[0.5] group-hover:saturate-100 group-hover:scale-110 transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-10">
                <p className="text-white text-xs font-black uppercase tracking-[0.2em] truncate">{img.alt || 'AUGUST CAPTURE'}</p>
                {img.type === 'video' && <span className="text-primary text-[8px] font-black uppercase tracking-[0.4em] mt-3">Active Reel</span>}
              </div>
              
              <button 
                onClick={() => handleDelete(img.id)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white/20 border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30 shadow-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
