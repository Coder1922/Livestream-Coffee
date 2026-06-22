import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CORE_EXPERIENCES } from '../data';
import { ArrowUpRight, Check, X, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Experiences() {
  const [selectedExp, setSelectedExp] = useState<string | null>(null);

  const activeExp = CORE_EXPERIENCES.find((exp) => exp.id === selectedExp);

  return (
    <section id="experiences" className="py-24 bg-[#111111] text-brand-cream relative overflow-hidden">
      {/* Decorative vertical golden mesh stripes */}
      <div className="absolute inset-y-0 left-10 w-[1px] bg-brand-cream/5 pointer-events-none" />
      <div className="absolute inset-y-0 right-10 w-[1px] bg-brand-cream/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header content */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-brand-gold font-mono text-xs tracking-[0.25em] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
            ELITE BREWERY LABS
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-brand-cream leading-tight">
            Signature <span className="font-serif italic font-semibold text-brand-gold">Experiences</span>
          </h2>
          <p className="mt-4 text-brand-cream/65 font-manrope font-light text-sm md:text-base leading-relaxed">
            Crafted for enthusiasts who view coffee not as a caffeine fix, but as a rich, multi-sensory conversation starter.
          </p>
        </div>

        {/* Dynamic Card Slider/Grid with hover translation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_EXPERIENCES.map((exp) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="bg-[#181818] rounded-xl border border-brand-cream/10 hover:border-brand-gold/40 transition-all duration-300 overflow-hidden flex flex-col h-full group pointer-events-auto cursor-pointer"
              onClick={() => setSelectedExp(exp.id)}
            >
              {/* Image Header with scale effect and gradient pull */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-108 transition-transform duration-500 ease-in-out select-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/25 to-transparent" />
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-brand-gold border border-brand-cream/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Core Descriptions */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif text-brand-cream font-medium mb-3 group-hover:text-brand-gold transition-colors duration-300">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-brand-cream/70 font-manrope font-light leading-relaxed mb-6 line-clamp-3">
                    {exp.description}
                  </p>
                </div>

                {/* Micro bullet reviews preview */}
                <div className="space-y-2 pt-4 border-t border-brand-cream/10 text-xs">
                  {exp.items.slice(0, 2).map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-brand-cream/90 font-mono">
                      <span className="w-1 h-1 rounded-full bg-brand-gold" />
                      <span className="truncate">{bullet.split(' with ')[0]}</span>
                    </div>
                  ))}
                  <div className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block mt-2 pt-1 group-hover:underline">
                    View Experience Details →
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Micro conversion hook note */}
        <p className="text-center text-xs font-mono text-brand-grey mt-10 tracking-widest uppercase">
          ✦ COMPLIMENTARY WIFI AND RADISSON COWORKING ACCESS INCLUDED ✦
        </p>

        {/* Detailed Modal/Drawer Overlay on Experience Selection */}
        <AnimatePresence>
          {selectedExp && activeExp && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#161616] border border-brand-gold/30 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedExp(null)}
                  className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-black/60 text-brand-cream/80 hover:text-brand-gold border border-brand-cream/20 flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Hero Image */}
                <div className="relative h-64 w-full">
                  <img
                    src={activeExp.image}
                    alt={activeExp.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/30 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <span className="text-xs font-mono text-brand-gold tracking-widest uppercase bg-brand-brown/40 px-2.5 py-1 rounded-full border border-brand-gold/20 backdrop-blur-md">
                      ACTIVE RESERVATION IN-CAFÉ
                    </span>
                    <h3 className="text-3xl font-serif text-brand-cream font-bold mt-2">
                      {activeExp.title}
                    </h3>
                  </div>
                </div>

                {/* Details Content */}
                <div className="p-8">
                  <p className="text-brand-cream/80 text-sm font-manrope font-light leading-relaxed mb-6">
                    {activeExp.description}
                  </p>

                  <h4 className="text-brand-gold font-mono text-xs tracking-widest uppercase mb-4 border-b border-brand-cream/10 pb-2">
                    Signature Menu & Atmosphere Bulletins
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {activeExp.items.map((bullet, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-[#202020] border border-brand-cream/5"
                      >
                        <div className="w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-xs text-brand-cream font-medium font-manrope">{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setSelectedExp(null)}
                      className="flex-1 py-3 border border-brand-cream/20 hover:border-brand-cream text-xs uppercase tracking-widest text-brand-cream font-mono rounded-lg transition-colors cursor-pointer"
                    >
                      Close Details
                    </button>
                    <a
                      href="#featured-menu"
                      onClick={() => {
                        setSelectedExp(null);
                        // Delay slightly so layout behaves
                        setTimeout(() => {
                          const el = document.getElementById('featured-menu');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 250);
                      }}
                      className="flex-1 py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-mono text-xs uppercase tracking-widest font-bold rounded-lg text-center transition-all cursor-pointer"
                    >
                      Reserve / Order
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
