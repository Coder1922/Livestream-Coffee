import React from 'react';
import { motion } from 'motion/react';
import { Instagram, MapPin, Phone, Clock, ArrowUp, Star } from 'lucide-react';

interface FooterProps {
  onScrollToVisit: () => void;
  onScrollToTop: () => void;
  onOpenOrderModal: () => void;
}

export default function Footer({ onScrollToVisit, onScrollToTop, onOpenOrderModal }: FooterProps) {
  return (
    <footer id="footer" className="relative bg-[#070707] text-brand-cream overflow-hidden">
      
      {/* SECTION 11 FINAL CTA PANEL - takes top of footer */}
      <div className="relative py-28 md:py-36 flex flex-col items-center justify-center text-center px-6 border-b border-brand-cream/5">
        
        {/* Soft, warm ambient light blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-brown/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Floating Coffee Beans silhouettes floating in slow motion */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          <span className="absolute top-20 left-[15%] text-2xl opacity-10 animate-float-slow">🫘</span>
          <span className="absolute bottom-24 right-[15%] text-3xl opacity-15 animate-float-slow-delay-1">🫘</span>
          <span className="absolute top-1/4 right-[25%] text-xl opacity-[0.08] animate-float-slow-delay-2">🫘</span>
          <span className="absolute bottom-12 left-1/4 text-2xl opacity-[0.12] animate-float-slow">🫘</span>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 text-brand-gold font-mono text-xs tracking-[0.25em] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
            CONVERSATION INBOUND
          </div>

          <h2 className="text-4xl md:text-6xl font-serif font-light text-brand-cream tracking-tight mb-8 leading-tight">
            YOUR NEXT FAVORITE <br />
            <span className="font-serif italic font-semibold text-brand-gold">COFFEE IS WAITING.</span>
          </h2>

          <p className="max-w-xl text-brand-cream/70 text-sm md:text-base font-manrope font-light mb-12 leading-relaxed">
            Poured to perfection inside Radisson lobby, Suratians gather daily for specialty micro-lots. Sip slow or checkout online now.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={onScrollToVisit}
              id="footer-visit-today"
              className="px-8 py-4 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-transform transform hover:-translate-y-1 active:translate-y-0 shadow-lg cursor-pointer"
            >
              Visit Today
            </button>
            <button
              onClick={onOpenOrderModal}
              id="footer-order-today"
              className="px-8 py-4 bg-transparent hover:bg-brand-cream/5 border border-brand-cream/20 hover:border-brand-cream text-xs font-mono uppercase tracking-widest text-brand-cream font-bold rounded-lg transition-transform transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
            >
              Order Now →
            </button>
          </div>
        </div>
      </div>

      {/* CORE STANDARD STRUCTURAL FOOTER MARGINS */}
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Logo Brand description */}
          <div className="md:col-span-5 text-center md:text-left">
            <h3 className="text-xl font-serif text-brand-cream tracking-wider font-light">
              LIVESTREAM <span className="font-serif italic font-semibold text-brand-gold">COFFEE</span>
            </h3>
            <p className="mt-3 text-xs text-brand-cream/60 max-w-sm font-manrope leading-relaxed">
              Premium specialty micro-lot coffee lounge, community desks, and late-night culinary pairings on the ground floor of Park Inn by Radisson, Surat.
            </p>
          </div>

          {/* Social info */}
          <div className="md:col-span-4 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                aria-label="Instagram profile"
                target="_blank"
                rel="noopener"
                className="w-10 h-10 rounded-full bg-[#121212] border border-brand-cream/10 hover:border-brand-gold hover:text-brand-gold flex items-center justify-center text-brand-cream transition-colors cursor-pointer"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <div className="text-[10px] font-mono tracking-wider text-brand-gold uppercase text-center mt-1">
              #LIVESTREAMCOFFEE
            </div>
          </div>

          {/* Top back scroll action */}
          <div className="md:col-span-3 flex justify-center md:justify-end">
            <button
              onClick={onScrollToTop}
              className="px-4 py-2.5 bg-[#121212] hover:bg-brand-brown/30 border border-brand-cream/10 hover:border-brand-gold text-[10px] font-mono tracking-wider uppercase text-[#a1a1a1] hover:text-brand-cream rounded-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Back To Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-brand-gold animate-bounce" />
            </button>
          </div>

        </div>

        {/* Bottom micro copyright notes */}
        <div className="mt-12 pt-8 border-t border-brand-cream/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-brand-cream/40 font-mono tracking-widest uppercase">
          <div>
            &copy; {new Date().getFullYear()} LIVESTREAM COFFEE SURAT. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-4">
            <span>GROUND FLOOR, PARK INN BY RADISSON</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/40" />
            <span>OPEN 6:00 AM - 12:00 MIDNIGHT</span>
          </div>
        </div>

      </div>

    </footer>
  );
}
