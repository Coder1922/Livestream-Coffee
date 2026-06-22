import React from 'react';
import { motion } from 'motion/react';
import { Coffee, Compass, MapPin, Sparkles, HelpCircle } from 'lucide-react';
import { FEATURES } from '../data';

export default function WhyChooseUs() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-6 h-6 text-brand-gold" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-brand-gold" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6 text-brand-gold" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-brand-gold" />;
      default:
        return <HelpCircle className="w-6 h-6 text-brand-gold" />;
    }
  };

  return (
    <section className="py-24 bg-[#0a0a0a] text-brand-cream relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header content */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-brand-gold font-mono text-xs tracking-[0.25em] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
            LIVESTREAM BENCHMARKS
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-brand-cream leading-tight">
            Why People <span className="font-serif italic font-semibold text-brand-gold">Choose Us</span>
          </h2>
          <p className="mt-4 text-brand-cream/65 font-manrope font-light text-sm md:text-base">
            How we redefine the premium coffee lounge culture inside Surat's primary high-contrast landmark.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#121212] border border-brand-cream/10 p-8 rounded-xl relative group hover:border-brand-gold/30 transition-all duration-300"
            >
              {/* Giant numeral subtle background */}
              <span className="absolute top-4 right-6 text-5xl font-serif font-bold text-brand-gold/[0.03] select-none pointer-events-none">
                0{idx + 1}
              </span>

              {/* Icon Container with glowing effects */}
              <div className="w-12 h-12 rounded-lg bg-brand-brown/20 border border-brand-gold/15 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-brand-gold/40 transition-transform duration-300">
                {getIcon(feature.iconName)}
              </div>

              <h3 className="text-lg font-serif font-semibold text-brand-cream tracking-wide mb-3">
                {feature.title}
              </h3>
              
              <p className="text-xs text-brand-cream/70 font-manrope font-light leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
