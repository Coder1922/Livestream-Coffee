import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GALLERY_ITEMS } from '../data';
import { Camera, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'coffee' | 'food' | 'interior' | 'people' | 'lifestyle'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  // Handle Lightbox navigation
  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev! - 1));
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev! + 1));
  };

  return (
    <section id="gallery" className="py-24 bg-brand-bg text-brand-cream relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header content */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-gold font-mono text-xs tracking-[0.25em] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
              VISUAL JOURNAL
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-brand-cream leading-none">
              The <span className="font-serif italic font-semibold text-brand-gold">Gallery</span>
            </h2>
          </div>

          {/* Filtering tabs */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'coffee', 'food', 'interior', 'people', 'lifestyle'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-xs font-mono tracking-widest uppercase rounded-md border transition-all duration-300 cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-brand-gold text-brand-bg border-brand-gold font-bold shadow-md'
                    : 'bg-transparent border-brand-cream/10 hover:border-brand-cream/30 text-brand-cream'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Pinterest-style Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              // Map height profiles for columns
              const heightClass =
                item.span === 'tall'
                  ? 'h-[440px]'
                  : item.span === 'wide'
                  ? 'h-[260px]'
                  : 'h-[320px]';

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="break-inside-avoid relative rounded-xl overflow-hidden group select-none shadow-xl border border-brand-cream/10 cursor-pointer"
                  onClick={() => setLightboxIndex(index)}
                >
                  <div className={`relative ${heightClass} w-full overflow-hidden bg-neutral-900`}>
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08] select-none"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Hover luxurious overlay banner */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                      <div className="flex justify-end">
                        <div className="w-8 h-8 rounded-full bg-brand-gold/20 text-brand-gold backdrop-blur-md flex items-center justify-center border border-brand-gold/30">
                          <ZoomIn className="w-4 h-4" />
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-[#a1a1a1] uppercase block mb-1">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-serif font-semibold text-brand-cream tracking-wide">
                          {item.alt}
                        </h4>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Lightbox / Slider Full Screen Overlay */}
        <AnimatePresence>
          {lightboxIndex !== null && filteredItems[lightboxIndex] && (
            <div
              className="fixed inset-0 bg-black/95 backdrop-blur-md z-[300] flex flex-col items-center justify-center p-4"
              onClick={() => setLightboxIndex(null)}
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-brand-cream/5 hover:bg-brand-cream/15 text-brand-cream hover:text-brand-gold border border-brand-cream/15 flex items-center justify-center transition-all z-50 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Slider Main Frame */}
              <div
                className="relative max-w-4xl w-full h-[70vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Left navigation arrow */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 w-12 h-12 rounded-full bg-brand-cream/5 hover:bg-brand-cream/15 text-brand-cream hover:text-brand-gold border border-brand-cream/15 flex items-center justify-center transition-all z-50 cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Slider Image Showcase */}
                <motion.img
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  src={filteredItems[lightboxIndex].src}
                  alt={filteredItems[lightboxIndex].alt}
                  className="max-w-full max-h-full object-contain rounded-lg border border-brand-cream/10 select-none"
                  referrerPolicy="no-referrer"
                />

                {/* Right navigation arrow */}
                <button
                  onClick={nextImage}
                  className="absolute right-4 w-12 h-12 rounded-full bg-brand-cream/5 hover:bg-brand-cream/15 text-brand-cream hover:text-brand-gold border border-brand-cream/15 flex items-center justify-center transition-all z-50 cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Bottom Captions */}
              <div className="mt-6 text-center max-w-lg z-50" onClick={(e) => e.stopPropagation()}>
                <span className="text-xs font-mono tracking-widest text-[#a1a1a1] uppercase block mb-1">
                  {filteredItems[lightboxIndex].category} ({lightboxIndex + 1} of {filteredItems.length})
                </span>
                <p className="text-base font-serif font-light text-brand-cream">
                  {filteredItems[lightboxIndex].alt}
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
