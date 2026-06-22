import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Flame, Droplet, CupSoda, Info, Star } from 'lucide-react';
import { JOURNEY_STEPS } from '../data';

export default function CoffeeJourney() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const getStepIcon = (id: string, colorClass: string) => {
    switch (id) {
      case 'bean':
        return <Leaf className={`w-5 h-5 ${colorClass}`} />;
      case 'roast':
        return <Flame className={`w-5 h-5 ${colorClass}`} />;
      case 'brew':
        return <Droplet className={`w-5 h-5 ${colorClass}`} />;
      case 'serve':
        return <CupSoda className={`w-5 h-5 ${colorClass}`} />;
      default:
        return <Info className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  return (
    <section id="journey" className="py-24 bg-brand-bg text-brand-cream relative overflow-hidden">
      {/* Absolute decorative blurred beans or vectors */}
      <div className="absolute top-1/2 right-1/10 w-72 h-72 bg-brand-brown/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Underlines heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-brand-gold font-mono text-xs tracking-[0.25em] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
            SENSORY ALCHEMY
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-brand-cream leading-tight">
            The Coffee <span className="font-serif italic font-semibold text-brand-gold">Journey</span>
          </h2>
          <p className="mt-4 text-brand-cream/70 font-manrope font-light text-sm md:text-base">
            From rare soil to premium ceramic—observe our high-precision craft flow step by step.
          </p>
        </div>

        {/* TIMELINE GRID CONTROL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Stepper buttons (Left Column) - 5 Cols on lg */}
          <div className="lg:col-span-5 space-y-4">
            {JOURNEY_STEPS.map((step, index) => {
              const isActive = index === activeStepIndex;
              const isPast = index < activeStepIndex;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStepIndex(index)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-start gap-4 cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'bg-[#181818] border-brand-gold/40 shadow-xl'
                      : 'bg-[#101010]/60 border-brand-cream/5 hover:border-brand-cream/15 text-brand-cream/70'
                  }`}
                >
                  {/* Active highlight color block on outer side */}
                  {isActive && (
                    <div className="absolute left-0 inset-y-0 w-1 bg-brand-gold" />
                  )}

                  {/* Icon Frame */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                      isActive
                        ? 'bg-brand-brown/40 border-brand-gold/30 text-brand-gold'
                        : 'bg-[#151515] border-brand-cream/10 text-brand-cream/40'
                    }`}
                  >
                    {getStepIcon(step.id, isActive ? 'text-brand-gold' : 'text-brand-cream/40')}
                  </div>

                  {/* Description Copy */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono tracking-wider font-bold text-brand-gold/80">
                        STEP 0{index + 1}
                      </span>
                      {isPast && (
                        <span className="text-[9px] font-mono tracking-wider uppercase text-brand-cream/40">
                          - verified
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-serif font-semibold mt-1 tracking-wide text-brand-cream">
                      {step.title}
                    </h3>
                    <p className="text-xs text-brand-cream/50 mt-0.5 font-light font-manrope">
                      {step.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stepper Showcase Showcase Box (Right Column) - 7 Cols on lg */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-[#141414] border border-brand-cream/10 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
              >
                {/* Floating graphic element background */}
                <span className="absolute -top-12 -right-4 text-9xl font-serif text-brand-cream/[0.02] font-black pointer-events-none select-none">
                  0{activeStepIndex + 1}
                </span>

                {/* Main content display details */}
                <div className="relative z-10">
                  <div className="inline-block px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/25 text-brand-gold text-[10px] font-mono tracking-widest uppercase mb-4">
                    Stage Details
                  </div>

                  <h3 className="text-3xl font-serif font-light text-brand-cream leading-snug mb-2">
                    {JOURNEY_STEPS[activeStepIndex].title}
                  </h3>
                  
                  <div className="text-sm font-semibold text-brand-gold font-manrope tracking-wide mb-6">
                    {JOURNEY_STEPS[activeStepIndex].description}
                  </div>

                  <p className="text-brand-cream/80 text-sm md:text-base font-manrope font-light leading-relaxed mb-8">
                    {JOURNEY_STEPS[activeStepIndex].detail}
                  </p>

                  {/* Dynamic interactive trivia badge */}
                  <div className="p-4 rounded-xl bg-brand-brown/10 border border-brand-gold/10 flex gap-3 items-center">
                    <Star className="w-5 h-5 text-brand-gold fill-brand-gold/35 shrink-0" />
                    <p className="text-xs text-brand-cream/70 leading-relaxed font-manrope">
                      {activeStepIndex === 0 && 'Our beans are direct-trade certified and vacuum packed to lock in natural sugars.'}
                      {activeStepIndex === 1 && 'Every roast is monitored via computer thermal telemetry to ensure optimal timing.'}
                      {activeStepIndex === 2 && 'Our pressure brew gauges and water pH levels are calibrated three times daily.'}
                      {activeStepIndex === 3 && 'Always delivered wrapped in thermal wood sleeves to preserve ideal drinking temps.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
