import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem } from '../types';
import { Plus, Search, ShoppingCart, Tag, Filter, X } from 'lucide-react';

interface FeaturedMenuProps {
  onAddItemToOrder: (item: MenuItem) => void;
  cartCount: number;
  onOpenOrderModal: () => void;
  menuItems: MenuItem[];
}

export default function FeaturedMenu({ onAddItemToOrder, cartCount, onOpenOrderModal, menuItems }: FeaturedMenuProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'specialty' | 'frappe' | 'food'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  // Multi-tier filtering
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // 1. Primary Category Filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      
      // 2. Subcategory Filter
      if (selectedSubcategory !== 'all' && item.subcategory !== selectedSubcategory) {
        return false;
      }
      
      // 3. Search query filter (matches name, subcategory or tags)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSub = item.subcategory?.toLowerCase().includes(query) || false;
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesTags = item.tags?.some((t) => t.toLowerCase().includes(query)) || false;
        return matchesName || matchesSub || matchesDesc || matchesTags;
      }
      
      return true;
    });
  }, [activeCategory, selectedSubcategory, searchQuery]);

  // Dynamically compute subcategories for the active primary category
  const dynamicSubcategories = useMemo(() => {
    const items = activeCategory === 'all' 
      ? menuItems 
      : menuItems.filter(item => item.category === activeCategory);
    
    const subs = new Set<string>();
    items.forEach(item => {
      if (item.subcategory) {
        subs.add(item.subcategory);
      }
    });
    
    return ['all', ...Array.from(subs)];
  }, [activeCategory]);

  // Handle core category switches (resets subcategory)
  const handleCategoryChange = (cat: 'all' | 'specialty' | 'frappe' | 'food') => {
    setActiveCategory(cat);
    setSelectedSubcategory('all');
  };

  return (
    <section id="featured-menu" className="py-24 bg-brand-bg text-brand-cream relative overflow-hidden">
      {/* Decorative background glow sparks */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-brand-brown/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header content with custom Cart floating status inside section bar */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-brand-gold font-mono text-xs tracking-[0.25em] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" />
            LIVESTREAM COFFEE SPECIFICATION MENU
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-light text-brand-cream mb-4">
            Livestream <span className="font-serif italic font-semibold text-brand-gold">Catalyst</span> Menu
          </h2>
          <p className="text-sm text-brand-cream/60 font-manrope font-light max-w-xl mx-auto">
            Explore our genuine hotel boutique menu with authentic Surati specialty coffee roasts and premium European bistro plates.
          </p>
        </div>

        {/* Filters and Search Hub Container */}
        <div className="bg-[#101010]/95 border border-brand-cream/10 p-6 rounded-2xl mb-12 shadow-2xl backdrop-blur-md">
          
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between pb-6 border-b border-brand-cream/10">
            {/* Primary category selector tabs */}
            <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
              {(['all', 'specialty', 'frappe', 'food'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2.5 text-xs font-mono tracking-wider uppercase rounded-lg border transition-all duration-300 cursor-pointer flex-grow sm:flex-grow-0 ${
                    activeCategory === cat
                      ? 'bg-brand-gold text-brand-bg border-brand-gold font-bold shadow-lg scale-100 hover:scale-[1.02] active:scale-95'
                      : 'bg-transparent border-brand-cream/10 hover:border-brand-cream/30 text-brand-cream/80 hover:text-brand-cream'
                  }`}
                >
                  {cat === 'all' && 'All Selections'}
                  {cat === 'specialty' && 'Specialty Brews'}
                  {cat === 'frappe' && 'Frappes & Shakes'}
                  {cat === 'food' && 'Dining & Bites'}
                </button>
              ))}
            </div>

            {/* Smart Search Bar */}
            <div className="relative w-full lg:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-brand-cream/40">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search coffee or foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-brand-bg/50 border border-brand-cream/15 focus:border-brand-gold/60 rounded-xl text-xs font-mono text-brand-cream placeholder:text-brand-cream/30 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-cream/40 hover:text-brand-gold"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Subcategory Pills Filter Bar (Only visible when subcategories exist) */}
          <div className="pt-5 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono whitespace-nowrap text-brand-cream/40 uppercase tracking-widest flex items-center gap-1.5 mr-2">
              <Filter className="w-3 h-3 text-brand-gold" /> Filter section:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {dynamicSubcategories.map((sub) => {
                const subCount = menuItems.filter(item => {
                  if (activeCategory !== 'all' && item.category !== activeCategory) return false;
                  return sub === 'all' || item.subcategory === sub;
                }).length;

                return (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                      selectedSubcategory === sub
                        ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/50 font-medium font-bold'
                        : 'bg-brand-bg/40 border border-brand-cream/5 hover:border-brand-cream/25 text-brand-cream/60 hover:text-brand-cream'
                    }`}
                  >
                    {sub === 'all' ? 'All Subcategories' : sub} ({subCount})
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Counter of results */}
        <div className="flex items-center justify-between mb-8 px-2 font-mono text-[10px] uppercase tracking-wider text-brand-cream/40">
          <div>Showing <span className="text-brand-gold font-bold">{filteredItems.length}</span> of <span className="text-brand-cream">{menuItems.length}</span> signature crafts</div>
          {searchQuery && <div>Search match for "{searchQuery}"</div>}
        </div>

        {/* Menu Cards Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                // Check if item name/description contains "new" label or "Best Seller" or "Signature"
                const hasNewLabel = item.tags?.some(t => t.toLowerCase() === 'new' || t.toLowerCase() === 'new arrival') 
                  || item.name.toLowerCase().includes('(new)');

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#121212] rounded-xl border border-brand-cream/15 hover:border-brand-gold/40 transition-all duration-300 overflow-hidden flex flex-col group h-full relative"
                  >
                    {/* Image panel */}
                    <div className="h-56 relative overflow-hidden bg-neutral-900 select-none">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Decorative tag overlay */}
                      <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                        {item.subcategory && (
                          <span className="px-2.5 py-1 text-[8px] font-mono font-bold uppercase tracking-widest bg-brand-gold text-brand-bg rounded-md border border-brand-gold/20">
                            {item.subcategory}
                          </span>
                        )}
                        {item.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 text-[8px] font-mono font-semibold uppercase tracking-widest bg-black/75 backdrop-blur-md rounded-md text-brand-gold border border-brand-gold/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Spark "NEW" Ribbon */}
                      {hasNewLabel && (
                        <div className="absolute top-4 right-0 bg-red-600 text-white font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-l-md shadow-lg z-10 animate-pulse">
                          NEW
                        </div>
                      )}

                      {/* Glass Price Badge */}
                      <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-brand-cream/10 text-brand-cream font-serif font-bold text-sm tracking-wide">
                        ₹{item.price}
                      </div>
                    </div>

                    {/* Content Descriptions */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-serif text-brand-cream font-medium mb-2 group-hover:text-brand-gold transition-colors duration-300">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#a1a1a1] font-manrope font-light leading-relaxed mb-6">
                          {item.description}
                        </p>
                      </div>

                      {/* Order Button action */}
                      <button
                        onClick={() => onAddItemToOrder(item)}
                        id={`menu-add-${item.id}`}
                        className="w-full py-3 bg-[#181818] border border-brand-cream/15 group-hover:border-brand-gold/40 hover:bg-brand-gold hover:text-brand-bg rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add To Order Slot</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-[#121212]/30 border border-dashed border-brand-cream/10 rounded-2xl">
            <span className="inline-block p-4 bg-brand-gold/10 rounded-full mb-4">
              <Tag className="w-8 h-8 text-brand-gold" />
            </span>
            <h3 className="text-lg font-serif font-light text-brand-cream mb-2">No signature items matched</h3>
            <p className="text-xs text-[#a1a1a1] max-w-sm mx-auto font-manrope">
              Try readjusting your search criteria or clear your search to browse the full Livestream premium menu.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedSubcategory('all');
                setSearchQuery('');
              }}
              className="mt-6 px-5 py-2 bg-brand-gold text-brand-bg font-mono text-[10px] uppercase font-bold tracking-widest rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Floating live cart status summary for conversion optimising */}
        {cartCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 bg-gradient-to-r from-brand-brown/40 to-brand-gold/25 p-6 rounded-2xl border border-brand-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl text-center sm:text-left backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-bg flex items-center justify-center relative shadow-lg">
                <ShoppingCart className="w-5 h-5 animate-bounce" />
                <span className="absolute -top-1 -right-1 bg-brand-cream text-brand-bg text-[10px] font-semibold w-5 h-5 rounded-full border border-brand-gold flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-serif font-semibold text-brand-cream">
                  Your customized order slot is active
                </h4>
                <p className="text-xs text-brand-cream/70 font-manrope mt-0.5">
                  Complete your select of specialty Surati treats now to experience our delivery or pickup checkout simulator.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenOrderModal}
              id="menu-cart-checkout"
              className="px-6 py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-all cursor-pointer shadow-lg active:scale-95 duration-200"
            >
              Checkout Selected Slot →
            </button>
          </motion.div>
        )}

      </div>
    </section>
  );
}
