/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experiences from './components/Experiences';
import CoffeeJourney from './components/CoffeeJourney';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import WhyChooseUs from './components/WhyChooseUs';
import FeaturedMenu from './components/FeaturedMenu';
import InstagramFeed from './components/InstagramFeed';
import VisitUs from './components/VisitUs';
import Footer from './components/Footer';
import OrderNowModal from './components/OrderNowModal';
import CustomCursor from './components/CustomCursor';
import AdminPanel from './components/AdminPanel';
import { MenuItem } from './types';
import { FEATURED_MENU_ITEMS } from './data';
import { ShoppingBag, ChevronUp, Bell, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('LIVESTREAM_MENU_ITEMS');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved menu items, falling back to defaults.', e);
      }
    }
    return FEATURED_MENU_ITEMS;
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleSaveMenuItems = (newItems: MenuItem[]) => {
    setMenuItems(newItems);
    localStorage.setItem('LIVESTREAM_MENU_ITEMS', JSON.stringify(newItems));
  };

  const handleResetToDefaults = () => {
    localStorage.removeItem('LIVESTREAM_MENU_ITEMS');
    setMenuItems(FEATURED_MENU_ITEMS);
  };

  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Smooth scroll handler helper
  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'root') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      // Offset for sticky navbar
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Extract menu items that exist inside the cart
  const cartItems = useMemo(() => {
    const ids = Object.keys(cartQuantities).filter((id) => cartQuantities[id] > 0);
    return menuItems.filter((item: MenuItem) => ids.includes(item.id));
  }, [cartQuantities, menuItems]);

  const cartCount = useMemo(() => {
    return Object.values(cartQuantities).reduce((acc: number, qty) => acc + (qty as number), 0);
  }, [cartQuantities]);

  // Add Item callback
  const handleAddItemToOrder = (item: MenuItem) => {
    setCartQuantities((prev) => {
      const current = prev[item.id] || 0;
      return {
        ...prev,
        [item.id]: current + 1
      };
    });

    // Elegant toast message
    setToastMessage(`Added ${item.name} to your Order Slot ☕`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Change Quantity callback
  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    setCartQuantities((prev) => {
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return {
        ...prev,
        [itemId]: newQty
      };
    });
  };

  // Clear Cart callback
  const handleClearCart = () => {
    setCartQuantities({});
  };

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-cream selection:bg-brand-gold selection:text-brand-bg select-none">
      
      {/* High-fidelity Custom Coffee Bean Cursor Tracker */}
      <CustomCursor />

      {/* Persistent floating Micro Quick Order Pin on lower corner */}
      <div className="fixed bottom-6 right-6 z-[160] flex flex-col gap-3 select-none">
        
        {/* Click indicator order count */}
        <AnimatePresence>
          {cartCount > 0 && !isOrderModalOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsOrderModalOpen(true)}
              id="sticky-cart-launcher"
              className="px-5 py-3 rounded-full bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 shadow-2xl scale-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 animate-bounce" />
              <span>Checkout Slot ({cartCount})</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Interactive Toast Alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] max-w-sm w-auto px-5 py-3 rounded-xl bg-brand-brown border-2 border-brand-gold bg-opacity-95 text-brand-cream shadow-2xl flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-brand-gold animate-ping shrink-0" />
            <span className="text-xs font-mono font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Sticky Header Nav */}
      <Navbar
        onScrollToSection={handleScrollToSection}
        cartCount={cartCount}
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* HERO SECTION 1 */}
      <Hero
        onScrollToMenu={() => handleScrollToSection('featured-menu')}
        onScrollToVisit={() => handleScrollToSection('visit-us')}
      />

      {/* ABOUT SECTION 2 */}
      <About />

      {/* CORE EXPERIENCES SECTION 3 */}
      <Experiences />

      {/* COFFEE JOURNEY SECTION 4 */}
      <CoffeeJourney />

      {/* TESTIMONIALS SECTION 5 */}
      <Testimonials />

      {/* MASONRY PICTURE GALLERY SECTION 6 */}
      <Gallery />

      {/* WHY PEOPLE CHOOSE US SECTION 7 */}
      <WhyChooseUs />

      {/* CURATED FEATURED MENU SECTION 8 */}
      <FeaturedMenu
        onAddItemToOrder={handleAddItemToOrder}
        cartCount={cartCount}
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
        menuItems={menuItems}
      />

      {/* INSTAGRAM LIVE FEED GRID SECTION 9 */}
      <InstagramFeed />

      {/* PHYSICAL MAP DETAILS SECTION 10 */}
      <VisitUs />

      {/* FOOTER & CTA SECTION 11 */}
      <Footer
        onScrollToVisit={() => handleScrollToSection('visit-us')}
        onScrollToTop={() => handleScrollToSection('root')}
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
      />

      {/* INTERACTIVE EXPERIMENT ORDER DIALOGUE */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <OrderNowModal
            isOpen={isOrderModalOpen}
            onClose={() => setIsOrderModalOpen(false)}
            cartItems={cartItems}
            cartQuantities={cartQuantities}
            onUpdateQuantity={handleUpdateQuantity}
            onClearCart={handleClearCart}
          />
        )}
      </AnimatePresence>

      {/* ADMIN CONTROL PANEL OVERLAY CONSOLE */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            menuItems={menuItems}
            onSaveMenuItems={handleSaveMenuItems}
            onResetToDefaults={handleResetToDefaults}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
