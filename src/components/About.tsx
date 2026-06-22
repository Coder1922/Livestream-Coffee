import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ShieldCheck, Heart, Coffee } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 bg-brand-bg text-brand-cream overflow-hidden">
      {/* Subtle decorative background light blobs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-brown/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* LIFESTYLE IMAGE (LEFT): Split layout - takes 5 cols on lg */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative group"
          >
            {/* Elegant luxury frame offset behind the image */}
            <div className="absolute -inset-2 rounded-2xl border border-brand-gold/20 translate-x-3 translate-y-3 pointer-events-none group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-500 ease-out" />
            
            {/* The main picture */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl aspectRatio-[4/5] bg-neutral-900 border border-brand-cream/10">
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800" 
                alt="Livestream coffee cozy counter and workspace inside Park Inn" 
                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[4s] ease-out select-none"
                referrerPolicy="no-referrer"
              />
              {/* Luxury dark gradient masking over the image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Small overlay Badge for Radisson Hotel Inside */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-brand-cream/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-brown flex items-center justify-center text-brand-gold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-[#a1a1a1]">LOCATION</div>
                  <div className="text-xs font-semibold text-brand-cream">Inside Park Inn by Radisson, Surat</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* COPYCONTENT (RIGHT): Split layout - takes 7 cols on lg */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Little overline */}
            <div className="inline-flex items-center gap-2 text-brand-gold font-mono text-xs tracking-[0.25em] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
              OUR SANCTUARY
            </div>

            <h2 className="text-3xl md:text-5xl font-serif font-light text-brand-cream mb-8 leading-tight">
              Not Just Coffee. <br />
              <span className="font-serif italic text-brand-gold font-semibold">Where Conversations Flow.</span>
            </h2>

            <div className="space-y-6 font-manrope font-light text-brand-cream/80 text-base md:text-lg leading-relaxed mb-10">
              <p>
                Located inside the majestic <strong className="text-brand-cream font-medium">Park Inn by Radisson</strong> in Adajan,
                Livestream Coffee has become Surat's ultimate focal destination for specialty brews, hand-shaken artisanal mocktails, signature frappes, and wholesome plates.
              </p>
              <p>
                We engineered our café not just to fulfill your daily caffeine ritual, but to build a home for the city’s creative pulse. 
                Whether you're starting morning design sprints on our high-speed network, holding corporate meetups over a flawless V60 flow, or immersing yourself in 
                cozy midnight heart-to-hearts... every single visit is precision-crafted to feel like a high-altitude ceremony.
              </p>
            </div>

            {/* Quick value statements with mini icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-brand-cream/10">
              <div className="flex gap-3">
                <div className="mt-1 w-5 h-5 text-brand-gold shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-brand-cream text-sm">Gated Hospitality</h4>
                  <p className="text-xs text-[#a1a1a1] font-manrope mt-1">
                    Radisson amenities, pristine safety compliance, and hassle-free vehicle parking.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 w-5 h-5 text-brand-gold shrink-0">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-brand-cream text-sm">Late Midnight Lounge</h4>
                  <p className="text-xs text-[#a1a1a1] font-manrope mt-1">
                    Stay inspired and nested under ambient tunes and soft light pools until midnight.
                  </p>
                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
