import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem, Order, UserProfile } from '../types';
import { X, Trash2, ShoppingBag, ShoppingCart, User, Phone, Mail, AlertCircle, Check, Flame, Clock, Heart, Sparkles, MapPin, Star, MessageSquare, CreditCard, QrCode, ShieldCheck, Smartphone } from 'lucide-react';
import { registerFirebaseUser } from '../firebase';

interface OrderNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: MenuItem[];
  cartQuantities: Record<string, number>;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onClearCart: () => void;
  onPlaceOrder?: (order: Order) => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  orders: Order[];
}

type OrderStage = 'form' | 'payment' | 'brewing' | 'complete' | 'cancelled';

export default function OrderNowModal({
  isOpen,
  onClose,
  cartItems,
  cartQuantities,
  onUpdateQuantity,
  onClearCart,
  onPlaceOrder,
  currentUser,
  onLogin,
  orders
}: OrderNowModalProps) {
  const [stage, setStage] = useState<OrderStage>('form');
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState<Record<string, string>>({});
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Payment portal states
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'UPI_QR' | 'CARD' | 'COUNTER'>('UPI_QR');
  
  // Card Details States
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardError, setCardError] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  
  // Payment Progress States
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(60);
  
  // UPI QR states
  const [upiCountdown, setUpiCountdown] = useState(180); // 3-minute QR countdown

  // Authentication sub-states for OrderNowModal Checkout Sign-in/Register fallback
  const [checkoutTab, setCheckoutTab] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Sychronize stage with the actual user order state driven by Admin panel actions
  useEffect(() => {
    if (!placedOrderId) return;
    const activeOrder = orders.find(o => o.id === placedOrderId);
    if (!activeOrder) return;

    if (activeOrder.status === 'Pending') {
      setStage('brewing');
      setActiveStep(0); // Dosing & Sourcing / review
    } else if (activeOrder.status === 'Received') {
      setStage('brewing');
      setActiveStep(1); // Received
    } else if (activeOrder.status === 'Brewing') {
      setStage('brewing');
      setActiveStep(2); // In progress
    } else if (activeOrder.status === 'Ready') {
      setStage('complete');
      setActiveStep(3); // Pick up ready
    } else if (activeOrder.status === 'Completed') {
      setStage('complete');
      setActiveStep(3);
    } else if (activeOrder.status === 'Cancelled') {
      setStage('cancelled');
    }
  }, [orders, placedOrderId]);

  if (!isOpen) return null;

  // Detect contents
  const hasDrinks = cartItems.some(item => item.category === 'specialty' || item.category === 'frappe');
  const hasFood = cartItems.some(item => item.category === 'food');

  // Calculate Subtotals
  const orderTotal = cartItems.reduce((acc, item) => {
    const qty = cartQuantities[item.id] || 0;
    return acc + item.price * qty;
  }, 0);

  // Auto-fill logged-in customer coordinates and carry forward details
  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name);
      setUserPhone(currentUser.phone);
    } else {
      setUserName('');
      setUserPhone('');
    }
  }, [currentUser]);

  // Sync internal form states on load
  useEffect(() => {
    if (isOpen) {
      setAuthError('');
      setAuthSuccess('');
    }
  }, [isOpen]);

  // Strict local validation rules
  const getRegisteredUsers = (): UserProfile[] => {
    const list = localStorage.getItem('LIVESTREAM_REGISTERED_USERS');
    return list ? JSON.parse(list) : [];
  };

  const saveRegisteredUser = (user: UserProfile) => {
    const users = getRegisteredUsers();
    users.push(user);
    localStorage.setItem('LIVESTREAM_REGISTERED_USERS', JSON.stringify(users));
    registerFirebaseUser(user).catch((err) => {
      console.error('Failed to register user to Firestore during checkout', err);
    });
  };

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const validatePhone = (val: string) => {
    return /^[0-9]{10}$/.test(val);
  };

  const validateName = (val: string) => {
    const trimmed = val.trim();
    return trimmed.length >= 3 && /^[a-zA-Z\s.]+$/.test(trimmed);
  };

  // Real-time alphanumeric layout filters
  const handleAuthPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^0-9]/g, '');
    if (cleaned.length <= 10) {
      setAuthPhone(cleaned);
    }
  };

  const handleAuthNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^a-zA-Z\s.]/g, '');
    setAuthName(cleaned);
  };

  const handleCheckoutRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!validateName(authName)) {
      setAuthError('Name must be at least 3 characters long and contain only letters/spaces.');
      return;
    }

    if (!validatePhone(authPhone)) {
      setAuthError('Mobile number must be exactly 10 digits and cannot contain letters/special characters.');
      return;
    }

    if (!validateEmail(authEmail)) {
      setAuthError('Please provide a valid email address.');
      return;
    }

    const users = getRegisteredUsers();
    const cleanPhone = authPhone.trim();
    const exists = users.find(u => u.phone === cleanPhone || u.email.toLowerCase() === authEmail.toLowerCase().trim());
    
    if (exists) {
      setAuthError('A user with this mobile number or email already exists. Try Logging in.');
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: authName.trim(),
      phone: cleanPhone,
      email: authEmail.toLowerCase().trim(),
      loyaltyPoints: 50 // Welcome bonus
    };

    saveRegisteredUser(newUser);
    onLogin(newUser);
    setAuthSuccess('Registration successful! Click checkout to complete.');
    setAuthName('');
    setAuthPhone('');
    setAuthEmail('');
  };

  const handleCheckoutLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!validatePhone(authPhone)) {
      setAuthError('Mobile number must be exactly 10 digits.');
      return;
    }

    const cleanPhone = authPhone.trim();
    const users = getRegisteredUsers();
    const userFound = users.find(u => u.phone === cleanPhone);

    if (userFound) {
      onLogin(userFound);
      setAuthSuccess(`Welcome back, ${userFound.name}!`);
      setAuthPhone('');
    } else {
      setAuthError('No profile found. Please Register below to create your account!');
    }
  };

  // OTP dynamic countdown timer
  useEffect(() => {
    if (!otpSent || otpSecondsLeft <= 0) return;
    const t = setInterval(() => {
      setOtpSecondsLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [otpSent, otpSecondsLeft]);

  // UPI QR active countdown timer
  useEffect(() => {
    if (stage !== 'payment' || selectedPaymentMethod !== 'UPI_QR' || upiCountdown <= 0 || paymentProcessing) return;
    const t = setInterval(() => {
      setUpiCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [stage, selectedPaymentMethod, upiCountdown, paymentProcessing]);

  // Transition form submissions to Payment Gateways
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userPhone || orderTotal === 0) return;
    setCardHolder(userName);
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setOtpSent(false);
    setOtpCode('');
    setOtpSecondsLeft(60);
    setCardError('');
    setUpiCountdown(180);
    setSelectedPaymentMethod('UPI_QR');
    setStage('payment');
  };

  // Complete order placement upon successful mock checkout auth
  const completeSuccessfulOrder = (
    method: 'CARD' | 'UPI_QR' | 'COUNTER',
    payStatus: 'Paid' | 'Pending',
    reference?: string
  ) => {
    setSubmitting(true);

    const cleanPhone = userPhone.replace(/[\s-]/g, '');
    const newOrder: Order = {
      id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userName: userName.trim(),
      userPhone: cleanPhone,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: cartQuantities[item.id] || 0,
        image: item.image,
        category: item.category,
        specialInstructions: specialInstructions[item.id] || ''
      })),
      total: orderTotal,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      deliveryType: deliveryType,
      paymentMethod: method,
      paymentStatus: payStatus,
      paymentReference: reference
    };

    // Save and cache to local storage
    try {
      const saved = localStorage.getItem('LIVESTREAM_ORDERS');
      const list = saved ? JSON.parse(saved) : [];
      list.push(newOrder);
      localStorage.setItem('LIVESTREAM_ORDERS', JSON.stringify(list));
    } catch (err) {
      console.error('Failed to append order record to localStorage catalog', err);
    }

    // Mimic API delay
    setTimeout(() => {
      setSubmitting(false);
      setPlacedOrderId(newOrder.id);
      setStage('brewing');
      setActiveStep(0);
      if (onPlaceOrder) {
        onPlaceOrder(newOrder);
      }
    }, 1500);
  };

  const resetAll = () => {
    setStage('form');
    setActiveStep(0);
    setPlacedOrderId(null);
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
            {stage === 'payment' ? (
              <button
                type="button"
                onClick={() => setStage('form')}
                className="mr-2 px-2.5 py-1 text-xs font-mono font-bold text-brand-gold bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/25 rounded-md transition-all flex items-center gap-1 cursor-pointer"
              >
                ← Back
              </button>
            ) : (
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
            )}
            <h3 className="text-xl font-serif font-semibold text-brand-cream tracking-wide">
              {stage === 'form' && 'Review Your Order'}
              {stage === 'payment' && 'Secure Portal Payment'}
              {stage === 'brewing' && (
                hasDrinks && hasFood ? 'Preparing Your Order' :
                hasFood ? 'Preparing Your Food' :
                'Brewing Your Coffee'
              )}
              {stage === 'complete' && 'Order Ready For Pickup'}
              {stage === 'cancelled' && 'Order Declined'}
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

                     {/* Authenticated Checkout Flow Selection */}
                     {!currentUser ? (
                       <div className="border-t border-brand-cream/10 pt-5 space-y-4">
                         <div className="text-center space-y-1.5">
                           <h4 className="text-xs font-mono tracking-widest uppercase text-brand-gold font-bold">
                             🔒 MANDATORY MEMBER SIGN-IN
                           </h4>
                           <p className="text-[11px] text-[#a1a1a1] leading-relaxed font-manrope font-light max-w-sm mx-auto">
                             To complete your Radisson lounge reservation or gourmet order, please authenticate or register your active profile below.
                           </p>
                         </div>

                         {/* Mini tabs */}
                         <div className="grid grid-cols-2 p-1 bg-[#151515] rounded-lg border border-brand-cream/5 select-none">
                           <button
                             type="button"
                             onClick={() => { setCheckoutTab('login'); setAuthError(''); setAuthSuccess(''); }}
                             className={`py-1.5 rounded text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer ${
                               checkoutTab === 'login' 
                                 ? 'bg-brand-gold text-brand-bg font-bold shadow' 
                                 : 'text-[#a1a1a1] hover:text-brand-cream'
                             }`}
                           >
                             sign in
                           </button>
                           <button
                             type="button"
                             onClick={() => { setCheckoutTab('register'); setAuthError(''); setAuthSuccess(''); }}
                             className={`py-1.5 rounded text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer ${
                               checkoutTab === 'register' 
                                 ? 'bg-brand-gold text-brand-bg font-bold shadow' 
                                 : 'text-[#a1a1a1] hover:text-brand-cream'
                             }`}
                           >
                             register
                           </button>
                         </div>

                         {/* Status alert badges */}
                         {authError && (
                           <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-300 text-[11px] rounded flex items-center gap-2 font-manrope">
                             <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                             <span>{authError}</span>
                           </div>
                         )}
                         {authSuccess && (
                           <div className="p-3 bg-green-950/40 border border-green-500/20 text-green-300 text-[11px] rounded flex items-center gap-2 font-manrope">
                             <Check className="w-3.5 h-3.5 shrink-0 text-green-400" />
                             <span>{authSuccess}</span>
                           </div>
                         )}

                         {checkoutTab === 'login' ? (
                           <form onSubmit={handleCheckoutLogin} className="space-y-3.5">
                             <div>
                               <label className="block text-[9px] font-mono uppercase tracking-widest text-brand-gold mb-1 font-semibold">
                                 Contact Mobile Number
                               </label>
                               <div className="relative">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                                   <Phone className="w-3.5 h-3.5" />
                                 </span>
                                 <input
                                   type="tel"
                                   required
                                   placeholder="e.g. 9876543210 (10 digits)"
                                   value={authPhone}
                                   onChange={handleAuthPhoneChange}
                                   maxLength={10}
                                   className="w-full pl-9 pr-3 py-2.5 bg-[#141414] border border-brand-cream/10 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold font-mono"
                                 />
                               </div>
                             </div>

                             <button
                               type="submit"
                               className="w-full py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors cursor-pointer"
                             >
                               Authenticate Profile
                             </button>
                           </form>
                         ) : (
                           <form onSubmit={handleCheckoutRegister} className="space-y-3.5">
                             <div>
                               <label className="block text-[9px] font-mono uppercase tracking-widest text-brand-gold mb-1 font-semibold">
                                 Full Legal Name
                               </label>
                               <div className="relative">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                                   <User className="w-3.5 h-3.5" />
                                 </span>
                                 <input
                                   type="text"
                                   required
                                   placeholder="e.g. Rohini Mehta"
                                   value={authName}
                                   onChange={handleAuthNameChange}
                                   className="w-full pl-9 pr-3 py-2.5 bg-[#141414] border border-brand-cream/10 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold font-manrope"
                                 />
                               </div>
                             </div>

                             <div>
                               <label className="block text-[9px] font-mono uppercase tracking-widest text-brand-gold mb-1 font-semibold">
                                 Contact Mobile Number
                               </label>
                               <div className="relative">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                                   <Phone className="w-3.5 h-3.5" />
                                 </span>
                                 <input
                                   type="tel"
                                   required
                                   placeholder="e.g. 9876543210 (used for validation)"
                                   value={authPhone}
                                   onChange={handleAuthPhoneChange}
                                   maxLength={10}
                                   className="w-full pl-9 pr-3 py-2.5 bg-[#141414] border border-brand-cream/10 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold font-mono"
                                 />
                               </div>
                             </div>

                             <div>
                               <label className="block text-[9px] font-mono uppercase tracking-widest text-brand-gold mb-1 font-semibold">
                                 Email Address
                               </label>
                               <div className="relative">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                                   <Mail className="w-3.5 h-3.5" />
                                 </span>
                                 <input
                                   type="email"
                                   required
                                   placeholder="e.g. rohini.mehta@gmail.com"
                                   value={authEmail}
                                   onChange={(e) => setAuthEmail(e.target.value)}
                                   className="w-full pl-9 pr-3 py-2.5 bg-[#141414] border border-brand-cream/10 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold font-manrope"
                                 />
                               </div>
                             </div>

                             <button
                               type="submit"
                               className="w-full py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors cursor-pointer"
                             >
                               Complete & Authorize Checkout
                             </button>
                           </form>
                         )}
                       </div>
                     ) : (
                       <form onSubmit={handlePlaceOrder} className="space-y-4 border-t border-brand-cream/10 pt-4">
                         {/* Carry-forward logged in segment */}
                         <div className="p-3.5 rounded-xl bg-brand-gold/5 border border-brand-gold/20 flex items-center justify-between gap-4">
                           <div className="space-y-0.5">
                             <div className="flex items-center gap-1.5">
                               <span className="inline-block px-1.5 py-0.5 rounded bg-brand-gold text-brand-bg font-mono text-[8px] font-bold uppercase tracking-wider">
                                 verified gourmet profile
                               </span>
                             </div>
                             <h5 className="text-sm font-serif font-bold text-brand-cream">
                               {currentUser.name}
                             </h5>
                             <p className="text-[11px] text-[#a1a1a1] font-mono flex items-center gap-1">
                               <Phone className="w-3 h-3 text-[#777777]" />
                               {currentUser.phone}
                             </p>
                           </div>

                           <div className="bg-black/30 border border-brand-gold/10 px-3 py-2 rounded text-center">
                             <span className="block text-[11px] font-mono font-bold text-brand-gold">
                               {currentUser.loyaltyPoints} PTS
                             </span>
                             <span className="text-[7px] text-[#777777] font-mono uppercase tracking-tight">
                               Loyalty Score
                             </span>
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
                               <span>PROCESSING GOURMET ORDER...</span>
                             </>
                           ) : (
                             <>
                               <ShoppingCart className="w-4 h-4" />
                               <span>Confirm & Place Order (₹{orderTotal})</span>
                             </>
                           )}
                         </button>
                       </form>
                     )}
                  </>
                )}
              </motion.div>
            )}

            {/* STAGE: SECURE PAYMENT GATEWAY */}
            {stage === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Visual Gateway Header */}
                <div className="flex flex-col items-center text-center space-y-1.5 pb-2">
                  <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold border border-brand-gold/25 rounded-full flex items-center justify-center mb-1">
                    <ShieldCheck className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-mono tracking-widest uppercase text-brand-gold font-bold">
                    Secure Luxury Gateway
                  </h4>
                  <p className="text-[11px] text-[#a1a1a1]">
                    Complete secure billing of <span className="text-brand-gold font-bold">₹{orderTotal}</span> via Livestream Gourmet portal
                  </p>
                </div>

                {/* Secure Tabs Selection */}
                <div className="grid grid-cols-3 p-1 bg-[#141414] rounded-xl border border-brand-cream/10 select-none">
                  <button
                    type="button"
                    onClick={() => { setSelectedPaymentMethod('UPI_QR'); setOtpSent(false); setCardError(''); }}
                    className={`py-2 px-1 rounded-lg text-[9px] font-mono uppercase tracking-wider flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      selectedPaymentMethod === 'UPI_QR'
                        ? 'bg-brand-gold text-brand-bg font-bold shadow-md'
                        : 'text-[#a1a1a1] hover:text-brand-cream'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>UPI QR Scan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedPaymentMethod('CARD'); setOtpSent(false); setCardError(''); }}
                    className={`py-2 px-1 rounded-lg text-[9px] font-mono uppercase tracking-wider flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      selectedPaymentMethod === 'CARD'
                        ? 'bg-brand-gold text-brand-bg font-bold shadow-md'
                        : 'text-[#a1a1a1] hover:text-brand-cream'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedPaymentMethod('COUNTER'); setOtpSent(false); setCardError(''); }}
                    className={`py-2 px-1 rounded-lg text-[9px] font-mono uppercase tracking-wider flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      selectedPaymentMethod === 'COUNTER'
                        ? 'bg-brand-gold text-brand-bg font-bold shadow-md'
                        : 'text-[#a1a1a1] hover:text-brand-cream'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Lobby Counter</span>
                  </button>
                </div>

                {/* Sub-Views */}
                <div className="min-h-[220px]">
                  
                  {/* VIEW A: UPI SCANNER QR CODE */}
                  {selectedPaymentMethod === 'UPI_QR' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 text-center py-2"
                    >
                      {/* Interactive High-Fidelity Scan Engine */}
                      <div className="w-40 h-40 bg-black/40 border border-brand-gold/25 p-3 rounded-2xl relative mx-auto overflow-hidden shadow-2xl flex items-center justify-center animate-pulse">
                        {/* Scanning lasers panel */}
                        <div className="absolute left-0 right-0 h-0.5 bg-brand-gold/60 animate-[bounce_2.5s_infinite] shadow-[0_0_8px_rgba(235,191,114,0.7)] z-10" />
                        
                        {/* Static QR pattern display elements */}
                        <div className="w-full h-full grid grid-cols-6 gap-1 opacity-90 p-2 bg-[#121212] rounded-lg">
                          {[...Array(36)].map((_, i) => {
                            const isAnchor = 
                              (i < 2 && i % 6 < 2) || // top-left
                              (i < 6 && i % 6 >= 4 && i < 12) || // top-right
                              (i >= 24 && i % 6 < 2 && i < 36); // bottom-left
                            return (
                              <div
                                key={i}
                                className={`rounded transition-colors duration-500 ${
                                  isAnchor
                                    ? 'bg-brand-gold border-2 border-brand-bg'
                                    : (i * 7) % 3 === 0
                                    ? 'bg-brand-gold'
                                    : 'bg-[#181818]'
                                }`}
                              />
                            );
                          })}
                        </div>
                        {/* Center gold coffee cup decoration */}
                        <div className="absolute inset-0 m-auto w-10 h-10 rounded-xl bg-[#121212] border border-brand-gold/40 flex items-center justify-center shadow-lg">
                          <Flame className="w-4.5 h-4.5 text-brand-gold" />
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="space-y-1">
                        <span className="block text-[11px] font-mono text-[#a1a1a1]">
                          UPI ID: <strong className="text-brand-cream">livestream.surat@okaxis</strong>
                        </span>
                        <span className="block text-[10px] text-neutral-500 font-mono">
                          Expires in: <span className="text-brand-gold font-bold">
                            {Math.floor(upiCountdown / 60)}:{(upiCountdown % 60).toString().padStart(2, '0')}
                          </span>
                        </span>
                      </div>

                      <div className="p-3 bg-[#151515] border border-brand-gold/10 rounded-xl text-left max-w-sm mx-auto space-y-1">
                        <p className="text-[10px] font-mono text-brand-gold uppercase tracking-wider flex items-center gap-1.5 font-bold">
                          <span>💡 UPI SIMULATOR ACTIVE</span>
                        </p>
                        <p className="text-[10px] text-[#888888] font-manrope font-light leading-relaxed">
                          Scan with BHIM, GPay, Paytm or PhonePe. To finish payment instantly, trigger our high-fidelity clearance simulator below.
                        </p>
                      </div>

                      {/* Simulation Trigger Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentProcessing(true);
                          setTimeout(() => {
                            completeSuccessfulOrder(
                              'UPI_QR',
                              'Paid',
                              `UPI-TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
                            );
                            setPaymentProcessing(false);
                          }, 1500);
                        }}
                        disabled={paymentProcessing}
                        className="w-full py-3 px-4 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                      >
                        {paymentProcessing ? (
                          <>
                            <span className="w-4 h-4 border-2 border-brand-bg border-t-transparent rounded-full animate-spin" />
                            <span>CLEARING UPI CHANNELS...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Simulate UPI Payment Scan</span>
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}

                  {/* VIEW B: CARD BILLING MODULE */}
                  {selectedPaymentMethod === 'CARD' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      {/* Card graphics */}
                      <div className="relative w-full max-w-xs h-36 mx-auto rounded-xl overflow-hidden shadow-2xl">
                        {!isCardFlipped ? (
                          <div className="w-full h-full bg-gradient-to-br from-[#1b1b1b] via-[#101010] to-[#252525] border border-brand-gold/30 p-4.5 rounded-xl flex flex-col justify-between">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono tracking-widest text-[#a1a1a1] uppercase">
                                Radisson Gold Elite
                              </span>
                              <Flame className="w-5 h-5 text-brand-gold" />
                            </div>
                            
                            {/* Smart Chip Graphic */}
                            <div className="w-8 h-6 rounded bg-gradient-to-r from-amber-400 to-amber-200 opacity-85 border border-brand-gold/30" />

                            <div>
                              {/* Card Number display */}
                              <div className="text-sm font-mono text-brand-gold tracking-[0.2em] h-5">
                                {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim().slice(0, 19) : '•••• •••• •••• ••••'}
                              </div>

                              <div className="flex justify-between items-end mt-1">
                                <div>
                                  <span className="block text-[6px] text-neutral-500 font-mono uppercase">Card Holder</span>
                                  <span className="text-[10px] font-mono text-brand-cream uppercase tracking-wider block truncate max-w-[120px]">
                                    {cardHolder || 'GUEST MEMBER'}
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-[6px] text-neutral-500 font-mono uppercase">Expires</span>
                                  <span className="text-[10px] font-mono text-brand-cream block">
                                    {cardExpiry || 'MM/YY'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#121212] to-[#1a1a1a] border border-brand-gold/30 rounded-xl flex flex-col justify-between py-4">
                            <div className="w-full h-8 bg-black" />
                            
                            <div className="px-4.5 flex justify-end">
                              <div className="flex items-center gap-1.5">
                                <div className="text-[6px] italic font-mono text-[#888] select-none">
                                  X-Auth Signature
                                </div>
                                <div className="px-2 py-1 bg-white text-black font-mono font-bold text-[10px] rounded tracking-wider leading-none">
                                  {cardCvv || '•••'}
                                </div>
                              </div>
                            </div>

                            <div className="px-4 text-[6px] text-[#555] font-mono leading-none">
                              Radisson Elite System Premium Reserve. Authorized signature only.
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CONDITIONAL SUBVIEW: OTP CONFIRMATION MODE */}
                      {otpSent ? (
                        <div className="space-y-4 p-4 bg-[#141414] border border-brand-gold/15 rounded-xl">
                          <div className="text-center space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded bg-brand-gold/10 text-brand-gold font-mono text-[9px] uppercase tracking-wider">
                              🔒 3D Secure Authorization Active
                            </span>
                            <p className="text-[10px] text-[#999999] font-manrope">
                              Verify OTP code sent to +91 ******{userPhone.slice(-4) || 'XXXX'}
                            </p>
                          </div>

                          {otpError && (
                            <div className="text-[10px] font-mono text-red-400 bg-red-950/20 border border-red-500/20 p-2 rounded text-center">
                              ⚠️ {otpError}
                            </div>
                          )}

                          <div className="flex gap-2 justify-center max-w-xs mx-auto">
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="e.g. 123456"
                              value={otpCode}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 6) setOtpCode(val);
                              }}
                              className="w-full p-2.5 bg-[#181818] border border-brand-cream/15 text-center text-brand-cream text-lg font-mono font-bold tracking-widest rounded-lg focus:outline-none focus:border-brand-gold"
                            />
                          </div>

                          <div className="text-center">
                            <button
                              type="button"
                              disabled={otpSecondsLeft > 0}
                              onClick={() => { setOtpSecondsLeft(60); setOtpCode(''); }}
                              className="text-[10px] font-mono text-[#666] hover:text-brand-gold disabled:text-neutral-700 transition"
                            >
                              {otpSecondsLeft > 0 ? `Resend OTP code in ${otpSecondsLeft}s` : 'Resend OTP Verification SMS'}
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (otpCode.length !== 6) {
                                setOtpError('Authorization code must equal exactly 6 digits.');
                                return;
                              }
                              setPaymentProcessing(true);
                              setOtpError('');
                              setTimeout(() => {
                                completeSuccessfulOrder(
                                  'CARD',
                                  'Paid',
                                  `CRD-AUTH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
                                );
                                setPaymentProcessing(false);
                              }, 1500);
                            }}
                            disabled={paymentProcessing}
                            className="w-full py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                          >
                            {paymentProcessing ? (
                              <>
                                <span className="w-4 h-4 border-2 border-brand-bg border-t-transparent rounded-full animate-spin" />
                                <span>VERIFYING DIRECT CREDIT CHARGES...</span>
                              </>
                            ) : (
                              <span>Submit OTP & Authenticate Payment</span>
                            )}
                          </button>
                        </div>
                      ) : (
                        /* CARD ENTRY DETAILS */
                        <div className="space-y-3.5">
                          {cardError && (
                            <div className="text-[10px] font-mono text-red-400 bg-red-950/20 border border-red-500/20 p-2 rounded text-center">
                              ⚠️ {cardError}
                            </div>
                          )}

                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <label className="block text-[8px] font-mono uppercase tracking-widest text-brand-gold mb-1">
                                Cardholder Full Name
                              </label>
                              <input
                                type="text"
                                value={cardHolder}
                                placeholder="e.g. ROHINI MEHTA"
                                onChange={(e) => setCardHolder(e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase())}
                                className="w-full px-3 py-2 bg-[#141414] border border-brand-cream/10 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-[8px] font-mono uppercase tracking-widest text-brand-gold mb-1">
                                Credit / Debit Card Number
                              </label>
                              <input
                                type="text"
                                maxLength={19}
                                placeholder="e.g. 4532 9876 5432 1098"
                                value={cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim().slice(0, 19) : ''}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\s+/g, '').replace(/\D/g, '');
                                  if (val.length <= 16) {
                                    setCardNumber(val);
                                  }
                                }}
                                className="w-full px-3 py-2 bg-[#141414] border border-brand-cream/10 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold font-mono"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[8px] font-mono uppercase tracking-widest text-brand-gold mb-1">
                                  Expiration (MM/YY)
                                </label>
                                <input
                                  type="text"
                                  maxLength={5}
                                  placeholder="MM/YY"
                                  value={cardExpiry}
                                  onChange={(e) => {
                                    let val = e.target.value.replace(/\s+/g, '').replace(/\D/g, '');
                                    if (val.length > 2) {
                                      val = val.slice(0, 2) + '/' + val.slice(2, 4);
                                    }
                                    setCardExpiry(val);
                                  }}
                                  className="w-full px-3 py-2 bg-[#141414] border border-brand-cream/10 text-[#f1f1f1] text-xs rounded-lg focus:outline-none focus:border-brand-gold font-mono text-center"
                                />
                              </div>

                              <div>
                                <label className="block text-[8px] font-mono uppercase tracking-widest text-brand-gold mb-1">
                                  Security CVV Code
                                </label>
                                <input
                                  type="password"
                                  maxLength={3}
                                  placeholder="•••"
                                  value={cardCvv}
                                  onFocus={() => setIsCardFlipped(true)}
                                  onBlur={() => setIsCardFlipped(false)}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 3) {
                                      setCardCvv(val);
                                    }
                                  }}
                                  className="w-full px-3 py-2 bg-[#141414] border border-brand-cream/10 text-[#f1f1f1] text-xs rounded-lg focus:outline-none focus:border-brand-gold font-mono text-center"
                                />
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              // Perform standard validation
                              if (!cardHolder.trim()) {
                                setCardError('Cardholder name is required.');
                                return;
                              }
                              if (cardNumber.length < 16) {
                                setCardError('Please enter a valid 16-digit credit card number.');
                                return;
                              }
                              if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
                                setCardError('Please use expiration date format MM/YY.');
                                return;
                              }
                              if (cardCvv.length < 3) {
                                setCardError('Card verification CVV must equal 3 digits.');
                                return;
                              }
                              // Success validation, send OTP simulation
                              setCardError('');
                              setOtpSent(true);
                              setOtpCode('');
                              setOtpSecondsLeft(60);
                            }}
                            className="w-full py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>Request Secure SMS OTP (₹{orderTotal})</span>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* VIEW C: COUNTER RESERVATION CHECKOUT */}
                  {selectedPaymentMethod === 'COUNTER' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 text-center py-4"
                    >
                      <div className="w-16 h-16 bg-[#161616] border border-brand-gold/20 rounded-full flex items-center justify-center mx-auto text-brand-gold text-2xl font-serif">
                        🏨
                      </div>

                      <div className="space-y-2 max-w-sm mx-auto">
                        <h4 className="text-sm font-serif font-bold text-brand-cream">
                          Radisson Lounge Counter / Pay on Delivery
                        </h4>
                        <p className="text-xs text-[#a1a1a1] leading-relaxed font-manrope font-light">
                          Perfect for guests checked in at Radisson or visitors seated in the main premium lobby. Skip digital checkout and pay via Cash, Lounge Card, or room tag bill charges during pick up.
                        </p>
                      </div>

                      <div className="p-3 bg-neutral-900 border border-brand-cream/5 rounded-xl text-left max-w-sm mx-auto">
                        <span className="block text-[10px] font-mono text-brand-gold uppercase tracking-wider font-bold mb-1">
                          📋 SEAMLESS INTEGRATION ACTIVE
                        </span>
                        <p className="text-[9px] text-[#777777] font-mono leading-relaxed">
                          Your reservation will be synced immediately to the master system kitchen queue queue. An invoice reference will print out at the main grill desk.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          completeSuccessfulOrder('COUNTER', 'Pending', 'LOBBY-INV-' + Math.floor(Math.random() * 100000));
                        }}
                        className="w-full py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors cursor-pointer text-center font-bold"
                      >
                        Queue Reservation & Pay at Lobby
                      </button>
                    </motion.div>
                  )}
                </div>
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

            {/* STAGE 4: CANCELLED / DECLINED REVELATION CARD */}
            {stage === 'cancelled' && (
              <motion.div
                key="cancelled"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <X className="w-8 h-8" />
                </div>

                <h4 className="text-2xl font-serif text-brand-cream font-bold leading-tight mb-2">
                  Reservation / Order Not Accepted
                </h4>
                
                <p className="text-xs text-[#a1a1a1] max-w-sm mx-auto mb-8 leading-relaxed font-manrope font-light">
                  Standard apologies, your requested menu selections could not be fulfilled at this time in the Park Inn lounge lobby. Please contact the front host or receptionist desk if you wish to adjust ingredients.
                </p>

                <button
                  onClick={resetAll}
                  className="w-full py-3.5 bg-[#202020] hover:bg-[#252525] border border-brand-cream/10 text-[#a1a1a1] hover:text-brand-cream font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Exit Review Page
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
