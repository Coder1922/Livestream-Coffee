import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, Star, Clock, Trophy, MapPin, ChevronDown, Flame } from 'lucide-react';
import SteamParticles from './SteamParticles';

interface HeroProps {
  onScrollToMenu: () => void;
  onScrollToVisit: () => void;
}

export default function Hero({ onScrollToMenu, onScrollToVisit }: HeroProps) {
  const [greeting, setGreeting] = useState({ text: 'Good Morning', icon: '☀️' });
  const [brewingCount, setBrewingCount] = useState(24);

  // Dynamic Time Greeting
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting({ text: 'Good Morning', icon: '☀️' });
      } else if (hour >= 12 && hour < 17) {
        setGreeting({ text: 'Good Afternoon', icon: '☕' });
      } else {
        setGreeting({ text: 'Good Evening', icon: '🌙' });
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  // Live Counter for Brewing Widget
  useEffect(() => {
    const interval = setInterval(() => {
      setBrewingCount((prev) => {
        const offset = Math.random() > 0.5 ? 1 : -1;
        const next = prev + offset;
        return next >= 18 && next <= 32 ? next : prev;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[101vh] flex items-center justify-center bg-brand-bg text-brand-cream px-4 overflow-hidden pt-20">
      {/* Cinematic Imagery Base with rich luxury dim overlays */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.25] scale-105 pointer-events-none transition-transform duration-[15s] ease-out select-none"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1600")'
        }}
      />
      {/* Deep luxury radial color gradient mask */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/80 to-transparent z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(13,13,13,0.95)_95%)] z-0" />

      {/* Floating Sparkles & Coffee Steam Animation */}
      <SteamParticles count={10} />

      {/* Hero Outer Frames - Anti-AI Slop minimalist clean layout */}
      <div className="absolute top-24 left-10 hidden lg:flex items-center gap-2 text-brand-gold/80 font-mono text-[10px] tracking-[0.25em] uppercase pointer-events-none z-10">
        <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
        SURAT SPECIALTY CULTURE
      </div>

      <div className="absolute top-24 right-10 hidden lg:block text-brand-gold/80 font-mono text-[10px] tracking-[0.25em] uppercase pointer-events-none z-10">
        PARTNERED WITH PARK INN BY RADISSON
      </div>

      {/* Main Container */}
      <div className="relative max-w-5xl mx-auto text-center z-10 flex flex-col items-center">
        
        {/* Dynamic Time & Greeting Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-brown/30 backdrop-blur-md border border-brand-brown/40 text-brand-gold font-manrope text-xs font-semibold tracking-wide mb-8"
        >
          <span>{greeting.icon}</span>
          <span className="capitalize">{greeting.text}, welcome to Livestream</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/60" />
          <span className="text-brand-cream/80">Surat, IN</span>
        </motion.div>

        {/* Live Popularity Brewing Counter Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-4 inline-flex items-center gap-3 bg-[#151515] border border-brand-gold/20 px-4 py-1.5 rounded-lg shadow-2xl"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-gold"></span>
          </span>
          <div className="flex items-center gap-1.5 text-xs text-brand-cream/90 font-mono">
            <span className="text-brand-gold font-bold">{brewingCount}</span>
            <span className="tracking-wide">Orders brewing right now</span>
          </div>
        </motion.div>

        {/* Luxury Primary Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-8xl font-serif tracking-tight leading-none mb-6 relative select-none"
        >
          <span className="block font-light text-brand-cream">LIVE THE MOMENT.</span>
          <span className="block bg-gradient-to-r from-brand-gold via-brand-cream to-brand-gold bg-clip-text text-transparent font-medium mt-1">
            SIP THE STORY.
          </span>
        </motion.h1>

        {/* Elegant Supporting Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-2xl text-base md:text-xl text-brand-cream/80 font-manrope font-light tracking-wide leading-relaxed mb-12"
        >
          Craft coffee. Meaningful conversations. Unforgettable experiences. 
          Discover a high-contrast paradise for designers, entrepreneurs, and friends.
        </motion.p>

        {/* CTA Button Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mb-20 z-20 w-full sm:w-auto"
        >
          <button
            onClick={onScrollToMenu}
            id="hero-cta-menu"
            className="group px-8 py-4 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-manrope font-semibold rounded-lg tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(212,167,98,0.25)] hover:shadow-[0_6px_30px_rgba(212,167,98,0.4)] transform hover:-translate-y-1 active:translate-y-0 text-center"
          >
            Explore Menu
          </button>
          <button
            onClick={onScrollToVisit}
            id="hero-cta-visit"
            className="group px-8 py-4 bg-transparent hover:bg-brand-cream/5 text-brand-cream font-manrope font-semibold rounded-lg tracking-wider border border-brand-cream/30 hover:border-brand-cream transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 text-center"
          >
            Visit Us
          </button>
        </motion.div>

        {/* Floating Statistics - Copper Framed Luxury Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-4xl grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-6 rounded-2xl bg-[#121212]/80 backdrop-blur-lg border border-brand-cream/10 divide-x divide-brand-cream/10 z-10 shadow-2xl"
        >
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <span className="text-2xl md:text-3xl font-serif font-bold text-brand-gold mb-1">125+</span>
            <div className="flex items-center gap-1 justify-center text-[11px] uppercase tracking-widest text-[#a1a1a1] font-mono">
              <Star className="w-3 h-3 text-brand-gold fill-brand-gold" />
              <span>Reviews</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2 text-center">
            <span className="text-2xl md:text-3xl font-serif font-bold text-brand-gold mb-1">4.7★</span>
            <div className="flex items-center gap-1 justify-center text-[11px] uppercase tracking-widest text-[#a1a1a1] font-mono">
              <Star className="w-3 h-3 text-brand-gold fill-brand-gold" />
              <span>Rating</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2 text-center">
            <span className="text-2xl md:text-3xl font-serif font-bold text-brand-gold mb-1">Midnight</span>
            <div className="flex items-center gap-1 justify-center text-[11px] uppercase tracking-widest text-[#a1a1a1] font-mono">
              <Clock className="w-3 h-3 text-brand-gold" />
              <span>Open Till</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2 text-center">
            <span className="text-2xl md:text-3xl font-serif font-bold text-brand-gold mb-1">Specialty</span>
            <div className="flex items-center gap-1 justify-center text-[11px] uppercase tracking-widest text-[#a1a1a1] font-mono">
              <Coffee className="w-3 h-3 text-brand-gold" />
              <span>Origin Coffee</span>
            </div>
          </div>
        </motion.div>

        {/* Down Arrow bounce element */}
        <div className="mt-8 select-none">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1 text-[11px] uppercase tracking-widest text-brand-grey pointer-events-none"
          >
            <span className="text-[10px]">SCROLL TO EXPLORE</span>
            <ChevronDown className="w-4 h-4 text-brand-gold" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
