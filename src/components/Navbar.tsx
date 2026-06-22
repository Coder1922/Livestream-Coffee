import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, Menu, X, ShoppingCart, Star, Clock, Heart, Lock } from 'lucide-react';

interface NavbarProps {
  onScrollToSection: (sectionId: string) => void;
  cartCount: number;
  onOpenOrderModal: () => void;
  onOpenAdmin: () => void;
}

export default function Navbar({ onScrollToSection, cartCount, onOpenOrderModal, onOpenAdmin }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(true);

  // Monitor Scroll for Glassmorphism Background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Shop Open status check
  useEffect(() => {
    const checkOpen = () => {
      const hour = new Date().getHours();
      setShopOpen(hour >= 6 && hour < 24);
    };
    checkOpen();
    const interval = setInterval(checkOpen, 60000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { title: 'About Us', href: 'about' },
    { title: 'Experiences', href: 'experiences' },
    { title: 'Coffee Journey', href: 'journey' },
    { title: 'Menu', href: 'featured-menu' },
    { title: 'Find Us', href: 'visit-us' }
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onScrollToSection(id);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[150] transition-all duration-300 border-b select-none ${
        scrolled
          ? 'bg-brand-bg/85 backdrop-blur-md border-brand-cream/10 py-4 shadow-xl'
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Brand Name Logo Frame */}
        <button
          onClick={() => onScrollToSection('root')}
          className="flex items-center gap-2.5 text-left group cursor-pointer bg-transparent border-0 outline-none"
        >
          <div className="w-9 h-9 rounded-full bg-brand-brown/40 border border-brand-gold/30 flex items-center justify-center text-brand-gold group-hover:scale-105 transition-transform">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <span className="block font-serif text-lg font-light tracking-widest text-[#f0f0f0] group-hover:text-brand-gold transition-colors">
              LIVESTREAM <span className="font-serif italic font-bold text-brand-gold">COFFEE</span>
            </span>
            <span className="block font-mono text-[9px] tracking-widest uppercase text-brand-gold/80 -mt-1">
              "Where Conversations Flow"
            </span>
          </div>
        </button>

        {/* Desktop Nav Actions */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-mono uppercase tracking-widest">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleLinkClick(link.href)}
              className="text-brand-cream/80 hover:text-brand-gold transition-colors cursor-pointer"
            >
              {link.title}
            </button>
          ))}

          {/* Spacer */}
          <span className="w-[1px] h-4 bg-brand-cream/15" />

          {/* Shop open badge indicator */}
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${shopOpen ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-[10px] text-brand-cream/60">
              {shopOpen ? '6am–Midnight' : 'CLOSED'}
            </span>
          </div>

          {/* Floating Cart action button */}
          <button
            onClick={onOpenOrderModal}
            className="relative px-4 py-2 bg-brand-brown/30 hover:bg-brand-brown/55 border border-brand-gold/45 text-brand-gold rounded-full font-bold transition-all flex items-center gap-2 cursor-pointer hover:shadow-lg font-mono text-xs"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Order Bin</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-cream text-brand-bg text-[9px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-brand-gold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Panel control button */}
          <button
            onClick={onOpenAdmin}
            className="px-4 py-2 bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/30 text-brand-gold rounded-full font-mono text-[10px] uppercase tracking-widest font-semibold transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-lg"
          >
            <Lock className="w-3 h-3 text-brand-gold" />
            <span>Admin</span>
          </button>
        </nav>

        {/* Tablet/Mobile Actions Right */}
        <div className="flex items-center gap-4 lg:hidden">
          {/* Cart triggers */}
          <button
            onClick={onOpenOrderModal}
            className="p-2.5 bg-brand-brown/30 border border-brand-gold/45 text-brand-gold rounded-full relative cursor-pointer"
            aria-label="Toggle Basket"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-cream text-brand-bg text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-brand-gold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger activator */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-brand-cream/80 hover:text-brand-gold cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Expanded Mobile slide-down menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full inset-x-0 bg-brand-bg/95 backdrop-blur-xl border-b border-brand-cream/10 lg:hidden overflow-hidden z-[100] shadow-2xl"
          >
            <div className="px-6 py-8 flex flex-col gap-6 text-center text-sm font-mono uppercase tracking-widest">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className="py-2 text-brand-cream hover:text-brand-gold transition-colors font-semibold cursor-pointer"
                >
                  {link.title}
                </button>
              ))}

              <div className="border-t border-brand-cream/10 my-4" />

              {/* Status and button */}
              <div className="flex items-center justify-center gap-2 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full ${shopOpen ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-brand-cream/60">
                  {shopOpen ? 'OPENED: Adajan Ground Floor Radisson' : 'CLOSED NOW'}
                </span>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOrderModal();
                }}
                className="py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-bold rounded-lg transition-colors cursor-pointer text-xs font-mono tracking-wider"
              >
                Checkout Cart Orders ({cartCount})
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="py-3 bg-[#111111] hover:bg-[#181818] border border-brand-gold/30 text-brand-gold font-bold rounded-lg transition-colors cursor-pointer text-xs font-mono tracking-wider flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-brand-gold" />
                <span>ADMIN CONTROL CENTER</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
