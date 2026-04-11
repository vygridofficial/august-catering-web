'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { getMenuItems } from '@/lib/actions/database';
import { Loader2, UtensilsCrossed } from 'lucide-react';

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
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="container mx-auto px-6 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-7xl font-heading font-black tracking-tight leading-none mb-6">Our Culinary <br /><span className="text-primary italic">Selection</span></h1>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              Explore our curated selection of dishes, ranging from traditional Kerala classics 
              to international favorites, all prepared with the finest ingredients.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-20 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 py-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-4 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all
                  ${activeCategory === cat 
                    ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105' 
                    : 'bg-secondary/50 text-foreground/40 hover:bg-secondary hover:text-foreground'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Display for regular view */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Preparing our menus...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <>
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={item.id}
                      className="group"
                    >
                      <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-secondary border border-border shadow-2xl shadow-black/5 hover:scale-[1.02] transition-all duration-500">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                          <p className="text-white/90 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{item.category}</p>
                          <h3 className="text-white text-2xl font-heading font-bold mb-1">{item.name}</h3>
                          <p className="text-white/80 text-sm font-light mb-4 line-clamp-2">{item.subtitle}</p>
                          <p className="text-white font-heading font-bold text-xl">{item.price}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 rounded-[2rem] border border-border bg-secondary/20 backdrop-blur-sm p-4 sm:p-6"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="text-lg sm:text-xl font-heading font-bold">Menu Overview</h2>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{filteredItems.length} items</span>
                </div>
                <div className="max-h-[340px] overflow-auto rounded-xl border border-border/70 bg-background/70">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground border-b border-border/70 sticky top-0 bg-background/95 backdrop-blur">
                    <span>Item</span>
                    <span>Category</span>
                    <span>Price</span>
                  </div>
                  <div className="divide-y divide-border/60">
                    {filteredItems.map((item) => (
                      <div key={`overview-${item.id}`} className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 items-start px-4 py-3 text-sm">
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{item.name}</p>
                          {item.subtitle ? <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.subtitle}</p> : null}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground/60 whitespace-nowrap">{item.category}</span>
                        <span className="text-xs sm:text-sm font-bold whitespace-nowrap">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-6 border border-dashed border-border rounded-[3rem]">
              <UtensilsCrossed size={60} className="text-muted-foreground/20" />
              <div className="space-y-1">
                <h3 className="text-2xl font-heading font-bold">Nothing found</h3>
                <p className="text-muted-foreground">We are still updating this section of our menu.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
