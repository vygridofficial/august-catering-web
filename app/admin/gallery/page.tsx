'use client';

import { useState, useEffect } from 'react';
import { getGalleryItems, addGalleryItem, deleteGalleryItem, uploadImage } from '@/lib/actions/database';
import { Plus, Trash2, Image as ImageIcon, Loader2, UploadCloud, X } from 'lucide-react';
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
      const uploadRes = await uploadImage(formData); // This now returns { success, url, type }
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
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading font-extrabold text-foreground tracking-tight">Media Gallery</h1>
          <p className="text-muted-foreground mt-2">Manage the catering portfolio images and videos displayed on the storefront.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-medium hover:scale-105 transition-transform shadow-xl"
        >
          <Plus size={20} />
          {isAdding ? 'Cancel' : 'Add Media'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-card/50 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-xl">
          <form onSubmit={handleAddImage} className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2 flex gap-4">
              <button 
                type="button"
                onClick={() => setMediaType('image')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all font-bold flex items-center justify-center gap-2 ${mediaType === 'image' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground opacity-50'}`}
              >
                <ImageIcon size={20} />
                Image
              </button>
              <button 
                type="button"
                onClick={() => setMediaType('video')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all font-bold flex items-center justify-center gap-2 ${mediaType === 'video' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground opacity-50'}`}
              >
                <UploadCloud size={20} />
                Video
              </button>
            </div>

            <div className="space-y-4 md:col-span-2 p-6 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <UploadCloud size={18} className="text-primary"/> 
                Upload Local {mediaType === 'image' ? 'Image' : 'Video'}
              </label>
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
              <label className="text-sm font-medium text-foreground">Media URL (Hosted Link)</label>
              <input 
                type="url" 
                value={newUrl}
                onChange={(e) => {
                  setNewUrl(e.target.value);
                  setSelectedFile(null);
                }}
                disabled={!!selectedFile}
                placeholder={mediaType === 'image' ? "https://images.unsplash.com/..." : "https://video-url.mp4"} 
                className="w-full p-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title / Alt Text (Optional)</label>
              <input 
                type="text" 
                value={newAlt}
                onChange={(e) => setNewAlt(e.target.value)}
                placeholder="Delicious prawn curry setup" 
                className="w-full p-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <div className="space-y-4 md:col-span-2">
              <label className="text-sm font-medium text-foreground">Media Preview</label>
              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-border bg-muted/50 flex items-center justify-center group">
                {previewUrl ? (
                  mediaType === 'video' ? (
                    <video 
                      src={previewUrl} 
                      className="w-full h-full object-contain"
                      controls
                    />
                  ) : (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon size={48} className="opacity-20" />
                    <p className="text-xs font-medium italic">No media selected yet</p>
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
                className="flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-xl font-bold hover:bg-foreground/90 transition-colors disabled:opacity-70"
              >
                {isUploading && <Loader2 size={18} className="animate-spin" />}
                {isUploading ? 'Publishing...' : `Publish ${mediaType === 'image' ? 'Image' : 'Video'}`}
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
          <p className="text-xl font-medium">No media found in gallery.</p>
          <p>Upload your first high-quality showcase item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} className="group relative bg-card rounded-3xl overflow-hidden shadow-xl border border-border aspect-square">
              {img.type === 'video' ? (
                <video 
                  src={img.url} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  muted
                  loop
                  onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                  onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                />
              ) : (
                <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <p className="text-white font-medium truncate">{img.alt || 'Gallery Media'}</p>
                {img.type === 'video' && <span className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Video Reel</span>}
              </div>
              <button 
                onClick={() => handleDelete(img.id)}
                className="absolute top-4 right-4 bg-destructive text-destructive-foreground p-3 rounded-full opacity-70 md:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
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

