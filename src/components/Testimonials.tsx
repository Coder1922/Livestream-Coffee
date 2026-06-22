import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  // Auto rotate testimonials unless interacted
  useEffect(() => {
    const timer = setInterval(() => {
      nextTestimonial();
    }, 8500);
    return () => clearInterval(timer);
  }, [activeIndex]);

  return (
    <section id="testimonials" className="py-24 bg-[#090909] text-brand-cream relative overflow-hidden">
      {/* Decorative vertical golden mesh stripes */}
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-brand-cream/5 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-brand-cream/5 pointer-events-none" />

      {/* Aesthetic giant decorative gold double quotes */}
      <div className="absolute top-20 left-10 md:left-24 text-[12rem] text-brand-brown/[0.04] font-serif leading-none select-none pointer-events-none font-bold">
        “
      </div>
      <div className="absolute bottom-10 right-10 md:right-24 text-[12rem] text-brand-brown/[0.04] font-serif leading-none select-none pointer-events-none font-bold">
        ”
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header content */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-brand-gold font-mono text-xs tracking-[0.25em] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
            COMMUNITY LOVE
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-brand-cream leading-tight">
            Customer <span className="font-serif italic font-semibold text-brand-gold">Love</span>
          </h2>
        </div>

        {/* Dynamic Dark Luxury Slide Container */}
        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-[#121212]/90 border border-brand-cream/10 p-8 md:p-12 rounded-2xl shadow-3xl text-center relative flex flex-col items-center"
            >
              <div className="flex gap-1.5 mb-6">
                {Array.from({ length: TESTIMONIALS[activeIndex].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-brand-gold fill-brand-gold" />
                ))}
              </div>

              {/* Real Testimonial Text */}
              <blockquote className="text-xl md:text-2xl font-serif font-light leading-relaxed text-brand-cream mb-8">
                "{TESTIMONIALS[activeIndex].text}"
              </blockquote>

              {/* Author Info */}
              <div>
                <cite className="not-italic text-sm font-manrope font-semibold tracking-wider text-brand-cream block">
                  {TESTIMONIALS[activeIndex].author}
                </cite>
                <span className="text-xs text-brand-gold/75 font-mono uppercase tracking-widest mt-1 block">
                  {TESTIMONIALS[activeIndex].role}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Buttons & Indicators */}
        <div className="flex items-center justify-between mt-8">
          
          {/* Progress Indicators */}
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex ? 'w-8 bg-brand-gold' : 'w-2 bg-brand-cream/20'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Nav Controls */}
          <div className="flex gap-3">
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full border border-brand-cream/10 hover:border-brand-gold bg-black/40 hover:bg-black/80 flex items-center justify-center text-brand-cream transition-colors duration-200 cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full border border-brand-cream/10 hover:border-brand-gold bg-black/40 hover:bg-black/80 flex items-center justify-center text-brand-cream transition-colors duration-200 cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
