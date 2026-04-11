'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { getMenuItems } from '@/lib/actions/database';
import { Loader2, UtensilsCrossed, Sparkles, ChefHat, Info } from 'lucide-react';
import Image from 'next/image';
import { ThreeDCarousel } from '@/components/ui/ThreeDCarousel';

export function MenuPageClient() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      const data = await getMenuItems();
      if (data && data.length > 0) {
        const formatted = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          subtitle: d.subtitle,
          price: d.price,
          category: d.category,
          image: d.image
        }));
        setItems(formatted);
      }
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const categories = ['All', ...new Set(items.map(item => item.category))];
  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#050505] text-white antialiased font-outfit selection:bg-primary selection:text-black overflow-x-hidden">
      <Header />
      
      {/* Cinematic Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-white/5 blur-[100px] rounded-full" />
      </div>

      {/* Narrative Hero */}
      <section className="relative pt-48 pb-20 overflow-hidden border-b border-white/5">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <ChefHat size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">The Culinary Atlas</span>
            </div>
            <h1 className="text-[clamp(4rem,10vw,8rem)] font-heading font-black tracking-tighter leading-[0.8] mb-10">
              GASTRONOMIC <br /><span className="text-primary italic font-serif">IDENTITY.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/40 font-medium leading-relaxed max-w-2xl">
              A meticulously engineered spectrum of flavor. From traditional archetypes to modern fusion interpretations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter - Liquid Glass Nav */}
      <section className="sticky top-0 z-50 py-8 pointer-events-none">
        <div className="container mx-auto px-6 overflow-x-auto no-scrollbar pointer-events-auto">
          <div className="flex items-center gap-3 p-2 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] w-fit mx-auto shadow-2xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500
                  ${activeCategory === cat 
                    ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-105' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Display */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-6">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">PREPARING ASSETS...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <>
              <ThreeDCarousel 
                items={filteredItems}
                renderCard={(item, isActive) => (
                  <div className="relative w-full h-full rounded-[3rem] overflow-hidden bg-[#0A0A0A] border border-white/5 shadow-2xl group flex flex-col justify-end">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out ${isActive ? 'scale-105 group-hover:scale-110' : ''}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    <div className="relative z-10 p-10 flex flex-col justify-end h-full">
                      <div className="mb-4 pt-8">
                        <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[9px] font-black text-white tracking-[0.2em] uppercase shadow-lg">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-white text-4xl font-heading font-black tracking-tight mb-4 leading-none uppercase drop-shadow-xl">{item.name}</h3>
                      <p className="text-white/60 text-lg font-medium mb-8 line-clamp-2 leading-relaxed drop-shadow-md">{item.title || item.subtitle || "Exploring the boundaries of local flavor."}</p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-white/10 backdrop-blur-sm">
                        <p className="text-primary font-black text-2xl tracking-tighter drop-shadow-xl">{item.price}</p>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-primary text-black shadow-[0_0_20px_rgba(255,204,0,0.4)]' : 'bg-white/10 text-white'}`}>
                            <Sparkles size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />

              {/* Data Manifest - Detailed Listing */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-24 p-10 md:p-12 bg-white/[0.01] backdrop-blur-3xl border border-white/5 rounded-[4rem] shadow-2xl"
              >
                <div className="flex items-center justify-between gap-3 mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Info className="text-primary" size={18} />
                    </div>
                    <h2 className="text-3xl font-heading font-black text-white tracking-tight uppercase">Inventory Manifest</h2>
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/30">
                    {filteredItems.length} DISTINCT MODULES
                  </span>
                </div>
                
                <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-black/40">
                  <div className="grid grid-cols-[1fr_auto_auto] gap-8 px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 bg-white/[0.02]">
                    <span>Resource Identifier</span>
                    <span className="text-right">Classification</span>
                    <span className="text-right">Valuation</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {filteredItems.map((item) => (
                      <div key={`manifest-${item.id}`} className="grid grid-cols-[1fr_auto_auto] gap-8 items-center px-8 py-5 group hover:bg-white/[0.02] transition-colors">
                        <div className="min-w-0">
                          <p className="font-bold text-white tracking-tight group-hover:text-primary transition-colors uppercase">{item.name}</p>
                          {item.subtitle ? <p className="text-[11px] text-white/30 mt-1 line-clamp-1 font-medium italic">{item.subtitle}</p> : null}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 whitespace-nowrap text-right">{item.category}</span>
                        <span className="text-sm font-black text-primary text-right whitespace-nowrap">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center gap-8 bg-white/[0.01] border border-dashed border-white/10 rounded-[4rem]">
              <UtensilsCrossed size={64} className="text-white/5" />
              <div className="space-y-3">
                <h3 className="text-3xl font-heading font-black text-white uppercase tracking-tight">Zero State Detected</h3>
                <p className="text-white/30 text-lg font-medium">Re-orienting culinary data arrays. Please hold.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

