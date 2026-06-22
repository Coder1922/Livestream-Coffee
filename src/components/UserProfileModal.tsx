import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Order } from '../types';
import { 
  X, User, Phone, Mail, Award, Clock, History, LogOut, Check, AlertCircle, ShoppingBag, MapPin, ShieldCheck, CreditCard, Flame 
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  userOrders: Order[];
}

export default function UserProfileModal({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  userOrders,
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Validation Errors
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Local storage lists of registered users to simulate accounts
  const getRegisteredUsers = (): UserProfile[] => {
    const list = localStorage.getItem('LIVESTREAM_REGISTERED_USERS');
    return list ? JSON.parse(list) : [];
  };

  const saveRegisteredUser = (user: UserProfile) => {
    const users = getRegisteredUsers();
    users.push(user);
    localStorage.setItem('LIVESTREAM_REGISTERED_USERS', JSON.stringify(users));
  };

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const validatePhone = (val: string) => {
    // Must be exactly 10 digits
    return /^[0-9]{10}$/.test(val);
  };

  const validateName = (val: string) => {
    const trimmed = val.trim();
    // Must be at least 3 characters, and contain only alphabets, spaces, and dots
    return trimmed.length >= 3 && /^[a-zA-Z\s.]+$/.test(trimmed);
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^0-9]/g, '');
    if (cleaned.length <= 10) {
      setPhone(cleaned);
    }
  };

  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^a-zA-Z\s.]/g, '');
    setName(cleaned);
  };

  // Handle Register Form Submit
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateName(name)) {
      setError('Name must be at least 3 characters long and contain only letters/spaces.');
      return;
    }

    if (!validatePhone(phone)) {
      setError('Mobile number must be exactly 10 digits and cannot contain letters/special characters.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    const users = getRegisteredUsers();
    const cleanPhone = phone.trim();
    const exists = users.find(u => u.phone === cleanPhone || u.email.toLowerCase() === email.toLowerCase().trim());
    
    if (exists) {
      setError('A user with this mobile number or email already exists. Try Logging in.');
      return;
    }

    // Success - Create user profile
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      phone: cleanPhone,
      email: email.toLowerCase().trim(),
      loyaltyPoints: 50 // Welcome bonus!
    };

    saveRegisteredUser(newUser);
    onLogin(newUser);
    setSuccess('Registration successful! Welcome bonus of 50 loyalty points credited.');
    
    // Clear form
    setName('');
    setPhone('');
    setEmail('');
  };

  // Handle Login Form Submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validatePhone(phone)) {
      setError('Mobile number must be exactly 10 digits.');
      return;
    }

    const cleanPhone = phone.trim();
    const users = getRegisteredUsers();
    const userFound = users.find(u => u.phone === cleanPhone);

    if (userFound) {
      onLogin(userFound);
      setSuccess(`Welcome back, ${userFound.name}!`);
      setPhone('');
    } else {
      setError('No profile found with this mobile number. Please Register to create your account!');
    }
  };

  if (!isOpen) return null;

  // Split history vs active orders
  const activeOrders = userOrders.filter(o => !['Completed', 'Cancelled'].includes(o.status));
  const orderHistory = userOrders.filter(o => ['Completed', 'Cancelled'].includes(o.status));

  // Determine loyalty bracket
  const totalPoints = currentUser?.loyaltyPoints || 0;
  const tierName = totalPoints >= 250 ? 'Elite Barista VIP' : totalPoints >= 100 ? 'Gold Gourmand' : 'Silver Connoisseur';
  const tierColor = totalPoints >= 250 ? 'text-yellow-400 border-yellow-400/30' : totalPoints >= 100 ? 'text-brand-gold border-brand-gold/30' : 'text-neutral-400 border-neutral-400/20';

  return (
    <div className="fixed inset-0 z-[250] overflow-y-auto bg-brand-bg/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0b0b] border border-brand-gold/30 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh] relative">
        
        {/* Banner border header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold/40 via-brand-gold to-brand-gold/40" />

        {/* Modal Header */}
        <div className="p-5 border-b border-brand-cream/10 flex items-center justify-between bg-[#111111]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/20">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-md font-serif font-semibold text-brand-cream tracking-wide">
                Gourmet Member Portal
              </h3>
              <p className="text-[9px] text-[#a1a1a1] uppercase font-mono tracking-widest mt-0.5">
                Surat Lounge & Barista Center
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-brand-cream/5 border border-brand-cream/10 hover:border-brand-gold hover:text-brand-gold transition-colors flex items-center justify-center cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Inner Scroll Container */}
        <div className="flex-grow overflow-y-auto p-5 space-y-6">
          
          {/* SECTION A: SIGN IN OR REGISTER FORMS */}
          {!currentUser ? (
            <div className="space-y-5">
              
              {/* Authenticator Tabs */}
              <div className="grid grid-cols-2 p-1 bg-[#151515] rounded-xl border border-brand-cream/10 select-none">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(''); }}
                  className={`py-2 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
                    activeTab === 'login' 
                      ? 'bg-brand-gold text-brand-bg font-bold shadow-md' 
                      : 'text-brand-cream/60 hover:text-brand-cream'
                  }`}
                >
                  member sign-in
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setError(''); }}
                  className={`py-2 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
                    activeTab === 'register' 
                      ? 'bg-brand-gold text-brand-bg font-bold shadow-md' 
                      : 'text-brand-cream/60 hover:text-brand-cream'
                  }`}
                >
                  register profile
                </button>
              </div>

              {/* Status alerts */}
              {error && (
                <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-300 text-xs rounded-lg flex items-center gap-2 font-manrope">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-950/40 border border-green-500/20 text-green-300 text-xs rounded-lg flex items-center gap-2 font-manrope">
                  <Check className="w-4 h-4 shrink-0 text-green-400" />
                  <span>{success}</span>
                </div>
              )}

              {activeTab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <p className="text-xs text-[#a1a1a1] leading-relaxed font-manrope font-light text-center px-4">
                    Enter your registered mobile number below to access your custom-styled orders panel, active telemetry status and collected coffee points.
                  </p>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-brand-gold mb-1.5 font-bold">
                      Your Registered Mobile Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210 (10 digits)"
                        value={phone}
                        onChange={handlePhoneInputChange}
                        maxLength={10}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#141414] border border-brand-cream/15 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Authenticate Profile
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="text-[11px] text-brand-gold hover:underline font-mono"
                    >
                      Don't have an account? Register now &gt;
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <p className="text-xs text-[#a1a1a1] leading-relaxed font-manrope font-light text-center px-2">
                    Create your luxury profile to gather 10 reward points for every ₹100 spent, priority lounge access, and free desserts.
                  </p>

                  {/* Name field */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-brand-gold mb-1.5 font-bold">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rohini Mehta"
                        value={name}
                        onChange={handleNameInputChange}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#141414] border border-brand-cream/15 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold font-manrope"
                      />
                    </div>
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-brand-gold mb-1.5 font-bold">
                      Contact Mobile Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210 (used for login verification)"
                        value={phone}
                        onChange={handlePhoneInputChange}
                        maxLength={10}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#141414] border border-brand-cream/15 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold font-mono"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-brand-gold mb-1.5 font-bold">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                        <Mail className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rohini.mehta@google.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#141414] border border-brand-cream/15 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold font-manrope"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Confirm & Complete Registration
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-[11px] text-brand-gold hover:underline font-mono"
                    >
                      Already registered? Member Sign-in &gt;
                    </button>
                  </div>
                </form>
              )}

            </div>
          ) : (
            
            /* SECTION B: LOGGED IN CURRENT USER PROFILE PANEL */
            <div className="space-y-6 text-left">
              
              {/* Member Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-brand-brown/20 to-brand-gold/10 border border-brand-gold/20 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-[70%]">
                  <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider border mb-1.5 ${tierColor}`}>
                    {tierName}
                  </span>
                  <h4 className="text-base font-serif font-bold text-brand-cream truncate">
                    {currentUser.name}
                  </h4>
                  <p className="text-[11px] text-[#a1a1a1] font-mono flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#777777]" />
                    {currentUser.phone}
                  </p>
                  <p className="text-[11px] text-[#a1a1a1] font-manrope flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 text-[#777777]" />
                    {currentUser.email}
                  </p>
                </div>

                {/* Loyalty Score */}
                <div className="bg-black/40 border border-brand-gold/15 p-3 rounded-lg text-center shrink-0 min-w-[100px] flex flex-col justify-center items-center">
                  <Award className="w-4 h-4 text-brand-gold mb-1" />
                  <span className="text-sm font-mono font-bold text-brand-gold">
                    {currentUser.loyaltyPoints} PTS
                  </span>
                  <span className="text-[8px] text-[#777777] font-mono uppercase tracking-tight">
                    Loyalty Balance
                  </span>
                </div>
              </div>

              {/* ACTIVE LIVE ORDERS STATUS */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-mono tracking-widest uppercase text-brand-gold border-b border-brand-cream/5 pb-2 flex items-center gap-1.5 font-bold">
                  <Clock className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Your Live Gourmet Status Check ({activeOrders.length})</span>
                </h4>

                {activeOrders.length > 0 ? (
                  activeOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="p-3.5 rounded-xl bg-[#121212] border border-brand-cream/5 hover:border-brand-gold/10 transition-colors space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-mono text-brand-gold font-bold">
                            ORDER ID: {order.id.slice(-6).toUpperCase()}
                          </span>
                          <span className="block text-[8px] text-[#666666] font-mono">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        {/* Dynamic Status Badges */}
                        <div className="flex items-center gap-1">
                          {order.status === 'Pending' && (
                            <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-bold">
                              Awaiting Approval
                            </span>
                          )}
                          {order.status === 'Received' && (
                            <span className="text-[9px] font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20 uppercase font-bold animate-pulse">
                              Order Received
                            </span>
                          )}
                          {order.status === 'Brewing' && (
                            <span className="text-[9px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 uppercase font-bold flex items-center gap-1">
                              <Flame className="w-2.5 h-2.5 animate-bounce" />
                              <span>Brewing & Baking</span>
                            </span>
                          )}
                          {order.status === 'Ready' && (
                            <span className="text-[9px] font-mono text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20 uppercase font-bold animate-bounce flex items-center gap-1">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              <span>Ready at Counter!</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Items Ordered List inside Status Card */}
                      <div className="space-y-1 pt-1.5 border-t border-brand-cream/5">
                        {order.items.map(it => (
                          <div key={it.id} className="flex justify-between items-start text-[11px] text-brand-cream/80 font-manrope">
                            <span>
                              {it.quantity}x <strong className="font-medium text-brand-cream">{it.name}</strong>
                            </span>
                            {it.specialInstructions && (
                              <span className="text-[9px] font-mono text-brand-gold italic">
                                "{it.specialInstructions}"
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Mode details */}
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#a1a1a1] pt-1">
                        <span className="flex items-center gap-1">
                          {order.deliveryType === 'pickup' ? (
                            <><MapPin className="w-3 h-3 text-brand-gold" /> Lobby Pickup</>
                          ) : (
                            <><ShoppingBag className="w-3 h-3 text-brand-gold" /> Room/Car Drop</>
                          )}
                        </span>
                        <span className="text-brand-cream font-bold">
                          Total Paid: ₹{order.total}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500 italic py-3 text-center">
                    You have no active orders inside Radisson's preparation queue.
                  </p>
                )}
              </div>

              {/* HISTORIC ORDERS ARCHIVE */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-mono tracking-widest uppercase text-[#a1a1a1] border-b border-brand-cream/5 pb-2 flex items-center gap-1.5 font-bold">
                  <History className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Order Archive History ({orderHistory.length})</span>
                </h4>

                {orderHistory.length > 0 ? (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {orderHistory.map((order) => (
                      <div key={order.id} className="p-2.5 rounded-lg bg-neutral-900/50 border border-neutral-800 flex justify-between items-center text-xs">
                        <div className="text-left font-manrope">
                          <span className="block text-[10px] font-mono text-[#a1a1a1]">
                            ID: {order.id.slice(-6).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-brand-cream/80 text-[11px] block truncate max-w-[200px]">
                            {order.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                          </span>
                        </div>

                        <div className="text-right flex flex-col items-end shrink-0 ml-4 font-mono text-[10px]">
                          <span className="font-bold text-brand-cream mb-0.5">₹{order.total}</span>
                          {order.status === 'Completed' ? (
                            <span className="text-green-500 font-bold uppercase text-[8px] bg-green-500/10 px-1 border border-green-500/10 rounded">
                              Picked Up
                            </span>
                          ) : (
                            <span className="text-red-400 font-bold uppercase text-[8px] bg-red-400/10 px-1 border border-red-400/10 rounded">
                              Cancelled
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-600 italic py-2 text-center">
                    No past orders found in archive logs.
                  </p>
                )}
              </div>

              {/* Log Out button */}
              <div className="pt-4 border-t border-brand-cream/10 flex justify-center">
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-4 py-2 border border-red-900/40 text-[11px] font-mono text-red-200 hover:bg-red-950/30 rounded-lg flex items-center gap-2 transition-all cursor-pointer uppercase tracking-wider"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Profile</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
