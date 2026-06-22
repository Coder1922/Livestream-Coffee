import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem } from '../types';
import { X, Trash2, ShoppingBag, ShoppingCart, User, Phone, Check, Flame, Clock, Heart, Sparkles, MapPin, Star, MessageSquare } from 'lucide-react';

interface OrderNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: MenuItem[];
  cartQuantities: Record<string, number>;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onClearCart: () => void;
}

type OrderStage = 'form' | 'brewing' | 'complete';

export default function OrderNowModal({
  isOpen,
  onClose,
  cartItems,
  cartQuantities,
  onUpdateQuantity,
  onClearCart
}: OrderNowModalProps) {
  const [stage, setStage] = useState<OrderStage>('form');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState<Record<string, string>>({});
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Auto progression for Brewing Simulator
  useEffect(() => {
    if (stage !== 'brewing') return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= 3) {
          clearInterval(interval);
          setStage('complete');
          return 3;
        }
        return prev + 1;
      });
    }, 4500); // 4.5 seconds per step

    return () => clearInterval(interval);
  }, [stage]);

  if (!isOpen) return null;

  // Detect contents
  const hasDrinks = cartItems.some(item => item.category === 'specialty' || item.category === 'frappe');
  const hasFood = cartItems.some(item => item.category === 'food');

  // Calculate Subtotals
  const orderTotal = cartItems.reduce((acc, item) => {
    const qty = cartQuantities[item.id] || 0;
    return acc + item.price * qty;
  }, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userPhone || orderTotal === 0) return;

    setSubmitting(true);
    // Mimic API delay
    setTimeout(() => {
      setSubmitting(false);
      setStage('brewing');
      setActiveStep(0);
    }, 1500);
  };

  const resetAll = () => {
    setStage('form');
    setActiveStep(0);
    setSpecialInstructions({});
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[250] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#121212] border border-brand-gold/30 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header Block */}
        <div className="p-6 border-b border-brand-cream/10 flex items-center justify-between bg-[#151515]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-gold" />
            <h3 className="text-xl font-serif font-semibold text-brand-cream tracking-wide">
              {stage === 'form' && 'Review Your Order'}
              {stage === 'brewing' && (
                hasDrinks && hasFood ? 'Preparing Your Order' :
                hasFood ? 'Preparing Your Food' :
                'Brewing Your Coffee'
              )}
              {stage === 'complete' && 'Order Ready For Pickup'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/60 text-[#a1a1a1] hover:text-brand-gold border border-brand-cream/15 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Container Body */}
        <div className="flex-grow overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            
            {/* STAGE 1: CART FORM CHECKOUT REVIEW */}
            {stage === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Check if items are empty */}
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-brand-brown/10 text-brand-gold/50 flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-manrope font-light text-brand-cream/75">
                      Your order basket is empty.<br />Explore our gourmet food and specialty coffee menu.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-6 px-6 py-2.5 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Item list */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-mono tracking-widest uppercase text-brand-gold mb-3 border-b border-brand-cream/10 pb-1">
                        YOUR SELECTIONS ({cartItems.length})
                      </h4>

                      {cartItems.map((item) => {
                        const qty = cartQuantities[item.id] || 0;
                        const isFood = item.category === 'food';
                        return (
                          <div
                            key={item.id}
                            className="p-3.5 rounded-lg bg-[#181818] border border-brand-cream/5 flex flex-col gap-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 rounded object-cover border border-brand-cream/10 select-none"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <h5 className="text-sm font-serif font-semibold text-brand-cream">
                                    {item.name}
                                  </h5>
                                  <span className="text-xs text-brand-gold font-mono">
                                    ₹{item.price} each
                                  </span>
                                </div>
                              </div>

                              {/* Quantity controls */}
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.id, qty - 1)}
                                  className="w-7 h-7 rounded bg-[#202020] border border-brand-cream/10 flex items-center justify-center text-brand-cream text-xs hover:border-brand-gold cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="text-sm font-mono font-bold text-brand-cream w-4 text-center">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.id, qty + 1)}
                                  className="w-7 h-7 rounded bg-[#202020] border border-brand-cream/10 flex items-center justify-center text-brand-cream text-xs hover:border-brand-gold cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Special Instructions Input */}
                            <div className="border-t border-brand-cream/5 pt-2 flex flex-col gap-1.5">
                              <label className="text-[10px] font-mono tracking-wide text-brand-gold flex items-center gap-1.5">
                                <MessageSquare className="w-3 h-3 text-brand-gold" />
                                <span>Special Instructions (Optional)</span>
                              </label>
                              <input
                                type="text"
                                placeholder={isFood ? "e.g. well-done, no onions, extra sauce" : "e.g. no sugar, extra hot, oat milk"}
                                value={specialInstructions[item.id] || ''}
                                onChange={(e) => {
                                  setSpecialInstructions(prev => ({
                                    ...prev,
                                    [item.id]: e.target.value
                                  }));
                                }}
                                className="w-full px-3 py-2 bg-[#121212] border border-brand-cream/10 text-brand-cream text-xs rounded focus:outline-none focus:border-brand-gold font-manrope font-light transition-all placeholder:text-neutral-600"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Cost summary card */}
                    <div className="p-4 rounded-xl bg-[#151515] border border-brand-gold/15 flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#a1a1a1]">
                        Total Bill (Inclusive of GST)
                      </span>
                      <span className="text-xl font-serif font-bold text-brand-gold">
                        ₹{orderTotal}
                      </span>
                    </div>

                    {/* Input Contact form */}
                    <form onSubmit={handlePlaceOrder} className="space-y-4 border-t border-brand-cream/10 pt-4">
                      <h4 className="text-[10px] font-mono tracking-widest uppercase text-brand-gold mb-3">
                        GUEST DETAILS
                      </h4>

                      <div>
                        <label className="block text-[10px] font-mono tracking-wider text-[#a1a1a1] uppercase mb-1.5">
                          Your Name
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gold">
                            <User className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rohini Mehta"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-[#181818] border border-brand-cream/15 text-brand-cream text-sm rounded-lg focus:outline-none focus:border-brand-gold font-manrope font-light transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono tracking-wider text-[#a1a1a1] uppercase mb-1.5">
                          Contact Phone Number
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gold">
                            <Phone className="w-4 h-4" />
                          </span>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. 091930 99994"
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-[#181818] border border-brand-cream/15 text-brand-cream text-sm rounded-lg focus:outline-none focus:border-brand-gold font-manrope font-light transition-colors font-mono"
                          />
                        </div>
                      </div>

                      {/* Delivery Toggle selectors */}
                      <div>
                        <label className="block text-[10px] font-mono tracking-wider text-[#a1a1a1] uppercase mb-2">
                          Pickup Strategy
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setDeliveryType('pickup')}
                            className={`py-3 rounded-lg border text-xs font-mono tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                              deliveryType === 'pickup'
                                ? 'bg-brand-gold text-brand-bg border-brand-gold font-bold'
                                : 'bg-[#181818] border-brand-cream/10 text-[#a1a1a1]'
                            }`}
                          >
                            <MapPin className="w-4 h-4" />
                            <span>Radisson Pickup</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeliveryType('delivery')}
                            className={`py-3 rounded-lg border text-xs font-mono tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                              deliveryType === 'delivery'
                                ? 'bg-brand-gold text-brand-bg border-brand-gold font-bold'
                                : 'bg-[#181818] border-brand-cream/10 text-[#a1a1a1]'
                            }`}
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Room / Car Drop</span>
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 mt-6 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors flex items-center justify-center gap-3 shadow-xl cursor-pointer"
                      >
                        {submitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-brand-bg border-t-transparent rounded-full animate-spin" />
                            <span>PROCESSING SECURE ORDER...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            <span>Place Simulated Order (₹{orderTotal})</span>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            )}

            {/* STAGE 2: LIVE PREPARATION COUNTDOWN SIMULATOR */}
            {stage === 'brewing' && (
              <motion.div
                key="brewing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-6"
              >
                {/* Active brewing/cooking graphic icon */}
                <div className="w-20 h-20 bg-brand-brown/10 border-2 border-brand-gold rounded-full flex items-center justify-center text-brand-gold mx-auto mb-8 animate-pulse relative">
                  <Flame className="w-10 h-10 animate-bounce" />
                  {/* Dynamic absolute bubbles */}
                  <span className="absolute -top-1 right-2 w-3.5 h-3.5 rounded-full bg-brand-gold animate-ping" />
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/25 rounded-full text-brand-gold text-[10px] font-mono tracking-wide uppercase mb-6">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>
                    {hasDrinks && hasFood ? 'BARISTA & KITCHEN TELEMETRY ACTIVE' :
                     hasFood ? 'LIVE CULINARY TELEMETRY ACTIVE' :
                     'BARISTA BREWING TELEMETRY ACTIVE'}
                  </span>
                </div>

                <h4 className="text-2xl font-serif font-light text-brand-cream mb-2 leading-tight">
                  {hasDrinks && hasFood ? 'Brewing & Crafting Your Order...' :
                   hasFood ? 'Baking & Preparing Your Bites...' :
                   'Handcrafting Your Specialty Brew...'}
                </h4>
                <p className="text-xs text-[#a1a1a1] max-w-sm mx-auto mb-10 leading-relaxed font-manrope font-light">
                  {hasDrinks && hasFood ? 'Our master baristas and kitchen crew inside Radisson lobby are hand-sorting coffee beans, baking and fresh-plating your artisanal bites. Watch live progress:' :
                   hasFood ? 'Our gourmet culinary crew inside Radisson lobby is assembling your ingredients, slow toasting bread, and custom styling your order. Watch live progress:' :
                   'Our master baristas inside Radisson lobby are hand-sorting beans, grinding to spec, and brewing at locked temps. Watch progress:'}
                </p>

                {/* Progress Bar steppers */}
                <div className="max-w-xs mx-auto space-y-4">
                  {(hasDrinks && hasFood ? [
                    'Sourcing Ingredients & Grinding Micro-Lot Beans',
                    'Pulling Premium Espresso & Assembling Gourmet Dishes',
                    'Aerating Silky Textured Milk & Oven-Toasting Bites',
                    'Artisanal Garnish & Joint Order Handover'
                  ] : hasFood ? [
                    'Sourcing Organic Harvest & Bread Selection',
                    'Toasting & Custom Melting Fine Cheeses / Spreads',
                    'Artisanal Dressing & Warm Quartz Plating',
                    'Gourmet Garnish & Kitchen Counter Handover'
                  ] : [
                    'Dosing & Grinding Micro-Lot Beans',
                    'Pulling Golden Espresso Shot (93.5°C)',
                    'Aerating Warm Velvet Cream / Milk',
                    'Artisanal Topping & Barista Handover'
                  ]).map((stepText, idx) => {
                    const isDone = idx < activeStep;
                    const isCurrent = idx === activeStep;

                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 text-left ${
                          isCurrent
                            ? 'bg-brand-brown/20 border-brand-gold/40 shadow-md translate-x-1'
                            : isDone
                            ? 'bg-[#151515] border-green-500/15 text-brand-cream/55'
                            : 'bg-transparent border-brand-cream/5 text-brand-cream/30'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                            isDone
                              ? 'bg-green-500/20 border-green-500 text-green-400'
                              : isCurrent
                              ? 'bg-brand-gold/20 border-brand-gold text-brand-gold animate-pulse'
                              : 'bg-transparent border-brand-cream/10 text-brand-cream/30'
                          }`}
                        >
                          {isDone ? <Check className="w-3 h-3" /> : idx + 1}
                        </div>
                        <span className="text-xs font-manrope font-medium truncate">{stepText}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STAGE 3: ORDER READY GREETINGS */}
            {stage === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500 rounded-full flex items-center justify-center text-green-400 mx-auto mb-6">
                  <Check className="w-10 h-10 animate-bounce" />
                </div>

                <h4 className="text-3xl font-serif text-brand-cream font-bold leading-tight mb-2">
                  Ready at the Lobby!
                </h4>
                
                <p className="text-sm text-brand-gold font-mono uppercase tracking-widest mb-6">
                  Order Code: #LIV-{Math.floor(1000 + Math.random() * 9000)}
                </p>

                <p className="text-xs text-brand-cream/80 max-w-sm mx-auto mb-8 leading-relaxed font-manrope font-light">
                  Thank you, <strong className="text-brand-cream font-medium">{userName}</strong>!{' '}
                  {hasDrinks && hasFood
                    ? 'Your custom brewed beverages and freshly toasted gourmet plates are fully prepared, carefully packed in insulated thermal packaging to lock in heat and freshness.'
                    : hasFood
                    ? 'Your freshly styled gourmet food is fully prepared, carefully toasted and packed in premium thermal jackets to preserve the perfect texture and heat.'
                    : 'Your barista-certified pours are fully prepared and packed with wood-insulated thermal jackets.'}
                  <br className="mb-2" />
                  Head over to the ground lobby of <strong className="text-brand-cream font-medium">Park Inn by Radisson</strong>.
                  Show this screen to collect your{' '}
                  {hasDrinks && hasFood ? 'hot order' : hasFood ? 'fresh bites' : 'hot brews'}!
                </p>

                {/* Styled Tailored selections summary */}
                <div className="max-w-sm mx-auto mb-8 p-4 rounded-xl bg-[#151515] border border-brand-cream/5 text-left shadow-lg">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#a1a1a1] uppercase mb-3 border-b border-brand-cream/10 pb-2">
                    <MessageSquare className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Your Tailored Selection Specifications:</span>
                  </div>
                  <div className="space-y-2 font-manrope text-xs">
                    {cartItems.map((item) => {
                      const qty = cartQuantities[item.id] || 0;
                      const instruction = specialInstructions[item.id]?.trim();
                      return (
                        <div key={item.id} className="flex justify-between items-start gap-3">
                          <span className="text-brand-cream flex-grow">
                            {qty}x <strong className="font-semibold text-brand-cream">{item.name}</strong>
                          </span>
                          {instruction ? (
                            <span className="text-[10px] font-mono text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-2 py-0.5 rounded italic shrink-0 max-w-[150px] truncate" title={instruction}>
                              "{instruction}"
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#666666] font-mono shrink-0">
                              (Standard prep)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-brand-brown/10 to-brand-gold/15 border border-brand-gold/10 inline-flex items-center gap-3 text-left max-w-sm mx-auto mb-2">
                  <Star className="w-5 h-5 text-brand-gold fill-brand-gold shrink-0" />
                  <p className="text-xs text-brand-cream/70 font-manrope leading-relaxed">
                    Enjoying your conversion journey? Show your screenshot to the desk to claim a free chocolate cookie!
                  </p>
                </div>

                <button
                  onClick={resetAll}
                  className="w-full py-4 mt-8 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors shadow-2xl cursor-pointer"
                >
                  {hasDrinks && hasFood ? 'Order Picked Up & Close' :
                   hasFood ? 'Meal Received & Close' :
                   'Drink Completed & Close'}
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
