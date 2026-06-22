import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, Calendar, Check, Copy, Navigation, ExternalLink } from 'lucide-react';

export default function VisitUs() {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [statusText, setStatusText] = useState('OPEN NOW');

  // Dynamic Open/Closed Status
  useEffect(() => {
    const checkOpenStatus = () => {
      const hour = new Date().getHours();
      // Open daily 6 AM to 12 Midnight (00:00)
      if (hour >= 6 && hour < 24) {
        setIsOpen(true);
        setStatusText('Currently Open — Pours flowing');
      } else {
        setIsOpen(false);
        setStatusText('Opening Daily at 6:00 AM');
      }
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const copyAddress = () => {
    const address = 'Livestream Coffee, Ground Floor, Park Inn by Radisson, Adajan Gam, Pal, Surat, Gujarat 394510';
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="visit-us" className="py-24 bg-brand-bg text-brand-cream relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header content */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-brand-gold font-mono text-xs tracking-[0.25em] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" />
            VISUAL COORDINATES
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-brand-cream leading-tight">
            Visit <span className="font-serif italic font-semibold text-brand-gold">Our Lounge</span>
          </h2>
          <p className="mt-4 text-brand-cream/65 font-manrope font-light text-sm md:text-base">
            Find us cozying up inside the landmark Radisson lobby. Valet parking and luxury lounges await.
          </p>
        </div>

        {/* Outer Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch bg-[#111111] border border-brand-cream/10 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Left Block: Luxury Card - 5 Cols on lg */}
          <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between bg-gradient-to-br from-[#151515] to-[#0c0c0c] relative">
            <div>
              {/* Dynamic Status Alert */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 font-mono text-[10px] tracking-wider uppercase mb-8">
                <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-green-400 animate-pulse' : 'bg-amber-400'} shrink-0`} />
                <span>{statusText}</span>
              </div>

              <h3 className="text-3xl font-serif font-medium text-brand-cream mb-2 leading-tight">
                Livestream Coffee
              </h3>
              <p className="text-sm text-brand-gold font-mono uppercase tracking-widest mb-8 border-b border-brand-cream/10 pb-4">
                PARK INN BY RADISSON Lobby
              </p>

              {/* Geographic Info items */}
              <div className="space-y-6">
                
                {/* Physical Address */}
                <div className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-lg bg-brand-brown/30 border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-[#a1a1a1] font-mono mb-1">
                      Our Address
                    </h4>
                    <p className="text-sm text-brand-cream/90 font-manrope font-light leading-relaxed">
                      Ground Floor, Park Inn by Radisson,<br />
                      Adajan Gam, Pal, Surat,<br />
                      Gujarat 394510
                    </p>
                  </div>
                </div>

                {/* Operating hours */}
                <div className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-lg bg-brand-brown/30 border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-[#a1a1a1] font-mono mb-1">
                      Open Hours
                    </h4>
                    <p className="text-sm text-brand-cream/90 font-manrope font-light">
                      Daily: 6:00 AM – 12:00 Midnight
                    </p>
                  </div>
                </div>

                {/* Secure call line */}
                <div className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-lg bg-brand-brown/30 border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-[#a1a1a1] font-mono mb-1">
                      Direct Hotlines
                    </h4>
                    <p className="text-sm text-brand-cream/95 font-mono font-medium">
                      091930 99994
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Click indicators */}
            <div className="flex flex-col sm:flex-row gap-3 mt-12 pt-6 border-t border-brand-cream/5">
              <button
                onClick={copyAddress}
                className="flex-1 py-3 px-4 bg-[#1b1b1b] hover:bg-[#222222] border border-brand-cream/15 text-[10px] font-mono uppercase tracking-widest text-brand-cream flex items-center justify-center gap-2 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-brand-gold" /> : <Copy className="w-3.5 h-3.5 text-[#a1a1a1]" />}
                <span>{copied ? 'Copied Location' : 'Copy Address'}</span>
              </button>

              <a
                href="https://maps.google.com/?q=Park+Inn+by+Radisson+Surat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-brand-gold hover:bg-brand-gold/90 text-[10px] font-mono uppercase tracking-widest text-brand-bg font-bold flex items-center justify-center gap-2 rounded-lg transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Right Block: Live Google Map Iframe Layer - 7 Cols on lg */}
          <div className="lg:col-span-7 h-[400px] lg:h-auto min-h-[380px] bg-neutral-900 overflow-hidden relative">
            <iframe
              title="Livestream Coffee at Park Inn by Radisson Surat Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.0890697381987!2d72.7842323!3d21.1883391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04dfdd355555d%3A0xe212f4efd8c11467!2sPark%20Inn%20by%20Radisson%20Surat!5e0!3m2!1sen!2sin!4v1711100000000"
              className="absolute inset-0 w-full h-full border-0 grayscale invert opacity-[0.78] contrast-[1.1] hover:grayscale-0 hover:invert-0 hover:opacity-100 transition-all duration-[0.8s] ease-in-out"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Visual satellite overlays on iframe border limits */}
            <div className="absolute inset-0 pointer-events-none border-l border-brand-cream/10 hidden lg:block" />
          </div>

        </div>

      </div>
    </section>
  );
}
