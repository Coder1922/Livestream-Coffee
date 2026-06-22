import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem, Order } from '../types';
import { 
  X, Plus, Trash2, Edit2, Save, Upload, Image as ImageIcon, 
  RotateCcw, Lock, Unlock, Search, Check, AlertCircle, Sparkles, Filter, 
  ShoppingBag, Clock, User, Phone, MapPin, Flame 
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onSaveMenuItems: (items: MenuItem[]) => void;
  onResetToDefaults: () => void;
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
}

// Preset High Definition Unsplash images for quick assignment
const IMAGE_PRESETS = [
  { name: 'Specialty Espresso', url: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?auto=format&fit=crop&q=80&w=600' },
  { name: 'Velvet Cappuccino', url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=600' },
  { name: 'Artisanal Latte', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600' },
  { name: 'Iced Cold Brew', url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600' },
  { name: 'Matcha Shake', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600' },
  { name: 'Hot Chocolate', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600' },
  { name: 'French Toast Babka', url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&q=80&w=600' },
  { name: 'Burrata Croissant', url: 'https://images.unsplash.com/photo-1475855581690-80accde3ae2b?auto=format&fit=crop&q=80&w=600' },
  { name: 'Avocado Guard Toast', url: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600' },
  { name: 'Gourmet Pasta', url: 'https://images.unsplash.com/photo-1563379971899-660589a01cc3?auto=format&fit=crop&q=80&w=600' },
  { name: 'Satisfying Bowl', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600' },
  { name: 'Appetizer Platter', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600' },
];

export default function AdminPanel({ 
  isOpen, 
  onClose, 
  menuItems, 
  onSaveMenuItems, 
  onResetToDefaults,
  orders,
  onUpdateOrderStatus
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Tab Switcher between Catalog editing & order logging
  const [adminTab, setAdminTab] = useState<'orders' | 'catalog'>('orders');
  const [orderQuery, setOrderQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | Order['status']>('all');

  // Search & Filters inside Admin list
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'specialty' | 'frappe' | 'food'>('all');

  // Form State for Adding / Editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'specialty' | 'frappe' | 'food'>('specialty');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(150);
  const [tagsInput, setTagsInput] = useState('');
  const [image, setImage] = useState('');
  const [formError, setFormError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Admin Access Unlock
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toLowerCase() === 'admin' || passcode === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid passcode. Hint: Use "admin".');
    }
  };

  // Convert File Upload to Base64 String for local retention
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFormError('File is too large! Maximum limit is 2MB to ensure smooth local storage.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setFormError('');
      };
      reader.onerror = () => {
        setFormError('Failed to read image file.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit form handler (Add / Edit)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Item name is required.');
      return;
    }
    if (!description.trim()) {
      setFormError('Item description is required.');
      return;
    }
    if (price <= 0) {
      setFormError('Price must be positive.');
      return;
    }
    if (!image) {
      setFormError('Please select a preset image, enter an image URL, or upload a custom file.');
      return;
    }

    const itemTags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const targetSubcategory = subcategory.trim() || (
      category === 'specialty' ? 'Specialty Pours' : 
      category === 'frappe' ? 'Frappes' : 'Bistro Fare'
    );

    if (editingId) {
      // Edit mode
      const updatedList = menuItems.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            name: name.trim(),
            category,
            subcategory: targetSubcategory,
            description: description.trim(),
            price,
            tags: itemTags,
            image
          };
        }
        return item;
      });
      onSaveMenuItems(updatedList);
      setEditingId(null);
    } else {
      // Add mode
      const generatedId = `custom-${Date.now()}`;
      const newItem: MenuItem = {
        id: generatedId,
        name: name.trim(),
        category,
        subcategory: targetSubcategory,
        description: description.trim(),
        price,
        tags: itemTags.length > 0 ? itemTags : ['Artisanal', 'New Arrival'],
        image
      };
      onSaveMenuItems([newItem, ...menuItems]);
    }

    // Reset Form Fields
    setName('');
    setCategory('specialty');
    setSubcategory('');
    setDescription('');
    setPrice(150);
    setTagsInput('');
    setImage('');
    setFormError('');
  };

  // Delete Action
  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to remove this catalog item from the menu?')) {
      const remaining = menuItems.filter(item => item.id !== id);
      onSaveMenuItems(remaining);
      if (editingId === id) {
        // Cancel active editing if deleted
        setEditingId(null);
        setName('');
        setSubcategory('');
        setDescription('');
        setPrice(150);
        setTagsInput('');
        setImage('');
      }
    }
  };

  // Populate form for Editing
  const handleStartEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setSubcategory(item.subcategory || '');
    setDescription(item.description);
    setPrice(item.price);
    setTagsInput(item.tags?.join(', ') || '');
    setImage(item.image);
    setFormError('');

    // Scroll the form container into view nicely
    const element = document.getElementById('admin-form-anchor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Reset to static code defaults
  const handleReset = () => {
    if (window.confirm('WARNING: This will erase ALL custom additions/deletions and restore defaults. Proceed?')) {
      onResetToDefaults();
      setIsAuthenticated(false);
      onClose();
    }
  };

  // Filter items in the list
  const displayItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.subcategory?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate statistics for bento row cards
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'Pending').length;
    const active = orders.filter(o => ['Received', 'Brewing', 'Ready'].includes(o.status)).length;
    const completed = orders.filter(o => o.status === 'Completed').length;
    const totalRevenue = orders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + o.total, 0);
    return { total, pending, active, completed, totalRevenue };
  }, [orders]);

  // Filter orders in the tracking screen
  const filteredOrders = useMemo(() => {
    return [...orders].reverse().filter(o => {
      const matchSearch = o.userName.toLowerCase().includes(orderQuery.toLowerCase()) ||
        o.userPhone.includes(orderQuery) ||
        o.id.toLowerCase().includes(orderQuery.toLowerCase());
      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, orderQuery, orderStatusFilter]);

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-brand-bg/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0b0b] border-2 border-brand-gold/30 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh] relative">
        
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold/40 via-brand-gold to-brand-gold/40" />

        {/* Modal Header */}
        <div className="p-6 border-b border-brand-cream/10 flex items-center justify-between bg-[#111111]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold">
              {isAuthenticated ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4 animate-pulse" />}
            </div>
            <div>
              <h3 className="text-lg font-serif font-semibold text-brand-cream tracking-wide">
                Admin Customization Console
              </h3>
              <p className="text-[10px] text-[#a1a1a1] uppercase font-mono tracking-widest mt-0.5">
                Dynamic Storefront Operations Room
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-brand-cream/5 border border-brand-cream/10 hover:border-brand-gold hover:text-brand-gold transition-colors flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic content scroll frame */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          
          {/* Gate 1: Passcode Input Screen if not validated */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto text-center py-12 space-y-6">
              <div className="w-16 h-16 bg-brand-gold/10 border border-brand-gold/30 rounded-full flex items-center justify-center text-brand-gold mx-auto relative animate-bounce">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-serif text-brand-cream font-light">Access Verification Required</h4>
                <p className="text-xs text-brand-cream/65 leading-relaxed font-manrope font-light max-w-xs mx-auto">
                  To open the control console and manage live Surat bistro items, please authenticate below.
                </p>
              </div>

              <form onSubmit={handleAuthenticate} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-brand-gold mb-1.5 font-bold">
                    Console Passcode Key
                  </label>
                  <input
                    type="password"
                    autoFocus
                    placeholder="Enter admin passcode (Hint: admin)"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111111] border border-brand-cream/10 text-brand-cream text-sm rounded-lg focus:outline-none focus:border-brand-gold font-mono tracking-widest text-center"
                  />
                  {authError && (
                    <div className="flex items-center gap-1.5 text-red-400 text-[11px] font-mono mt-2 justify-center">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{authError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors cursor-pointer shadow-lg"
                >
                  Unlock Admin Panel
                </button>
              </form>
            </div>
          ) : (
            
            /* Gate 2: Full Admin Dashboard Tools */
            <div className="space-y-8">
              
              {/* Reset defaults and current status banner */}
              <div className="p-4 rounded-xl bg-[#141210] border border-brand-gold/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-baseline gap-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                  <div>
                    <p className="text-xs font-mono text-brand-gold uppercase tracking-wider font-semibold">
                      Control Console Live
                    </p>
                    <p className="text-[11px] text-[#a1a1a1] font-manrope font-light">
                      Modifications apply in real-time to the public catalog list below and persistence is locked.
                    </p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-200 text-xs font-mono rounded-lg transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Factory Defaults</span>
                </button>
              </div>

              {/* Dynamic Admin Tabs Control row */}
              <div className="flex border-b border-brand-cream/10 select-none pb-1 gap-2">
                <button
                  type="button"
                  onClick={() => setAdminTab('orders')}
                  className={`px-5 py-3 text-xs font-mono uppercase tracking-widest font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                    adminTab === 'orders'
                      ? 'border-brand-gold text-brand-gold'
                      : 'border-transparent text-brand-cream/65 hover:text-brand-cream'
                  }`}
                >
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Live Orders Monitor ({orders.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdminTab('catalog')}
                  className={`px-5 py-3 text-xs font-mono uppercase tracking-widest font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                    adminTab === 'catalog'
                      ? 'border-brand-gold text-brand-gold'
                      : 'border-transparent text-brand-cream/65 hover:text-brand-cream'
                  }`}
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>Menu Catalog Editor ({menuItems.length})</span>
                </button>
              </div>

              {/* Anchor point for screen tracking */}
              <div id="admin-form-anchor" />

              {adminTab === 'orders' ? (
                <div className="space-y-6">
                  {/* Statistics Panel Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-none">
                    <div className="p-4 rounded-xl bg-[#111111] border border-brand-cream/5 text-left">
                      <span className="block text-[9px] font-mono text-[#a1a1a1] uppercase tracking-wider">
                        Total Completed Revenue
                      </span>
                      <span className="text-xl font-serif font-bold text-brand-gold">
                        ₹{stats.totalRevenue}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#111111] border border-brand-cream/5 text-left">
                      <span className="block text-[9px] font-mono text-[#a1a1a1] uppercase tracking-wider">
                        Active Prep Queue
                      </span>
                      <span className="text-xl font-serif font-bold text-brand-cream">
                        {stats.active} orders
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#111111] border border-brand-cream/5 text-left">
                      <span className="block text-[9px] font-mono text-[#a1a1a1] uppercase tracking-wider">
                        Awaiting Approval
                      </span>
                      <span className="text-xl font-serif font-bold text-amber-500">
                        {stats.pending} orders
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#111111] border border-brand-cream/5 text-left">
                      <span className="block text-[9px] font-mono text-[#a1a1a1] uppercase tracking-wider">
                        Total Submissions
                      </span>
                      <span className="text-xl font-serif font-bold text-[#a1a1a1]">
                        {stats.total}
                      </span>
                    </div>
                  </div>

                  {/* Orders Filter Control inputs */}
                  <div className="p-5 rounded-xl bg-[#111111] border border-brand-cream/5 flex flex-col md:flex-row gap-3 items-center">
                    {/* Search Bar query input */}
                    <div className="w-full md:flex-1 relative">
                      <Search className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search by Guest Name, Phone number or Order ID..."
                        value={orderQuery}
                        onChange={(e) => setOrderQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[#171717] border border-brand-cream/10 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold transition-all"
                      />
                    </div>

                    {/* Status filter selection pills */}
                    <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto shrink-0 select-none pb-1 md:pb-0 font-mono text-[9px]">
                      {(['all', 'Pending', 'Received', 'Brewing', 'Ready', 'Completed', 'Cancelled'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setOrderStatusFilter(st)}
                          className={`px-3 py-1.5 rounded border transition-all cursor-pointer ${
                            orderStatusFilter === st
                              ? 'bg-brand-gold border-brand-gold text-brand-bg font-bold'
                              : 'bg-[#171717] border-brand-cream/10 text-brand-cream/70 hover:border-brand-gold/50'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Order Items List Frame */}
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => {
                        // Check if user is a member
                        let isMember = false;
                        let userDetails = null;
                        try {
                          const registered = localStorage.getItem('LIVESTREAM_REGISTERED_USERS');
                          const users = registered ? JSON.parse(registered) : [];
                          userDetails = users.find((u: any) => u.phone === order.userPhone);
                          if (userDetails) isMember = true;
                        } catch (e) {
                          console.error(e);
                        }

                        return (
                          <div 
                            key={order.id}
                            className="p-5 rounded-2xl bg-[#111111] border border-brand-cream/5 hover:border-brand-gold/15 transition-all text-left flex flex-col md:flex-row justify-between gap-6"
                          >
                            {/* Column 1: Order Meta & User Card */}
                            <div className="space-y-2.5 max-w-sm flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-brand-gold bg-brand-gold/15 px-2 py-0.5 rounded border border-brand-gold/10 font-bold uppercase tracking-wider">
                                  ORDER ID: {order.id.slice(-6).toUpperCase()}
                                </span>
                                
                                {isMember ? (
                                  <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/15 font-bold uppercase tracking-widest animate-pulse">
                                    ★ Registered Member ({userDetails.loyaltyPoints} PTS)
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-mono text-[#a1a1a1] bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#2a2a2a] uppercase tracking-wide">
                                    Guest Checkout
                                  </span>
                                )}
                              </div>

                              <div className="space-y-0.5 font-manrope">
                                <h4 className="text-base font-serif font-bold text-brand-cream flex items-center gap-1.5">
                                  <User className="w-4 h-4 text-brand-gold" />
                                  {order.userName}
                                </h4>
                                <p className="text-xs text-[#a1a1a1] font-mono flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5 text-neutral-600" />
                                  {order.userPhone}
                                </p>
                                {isMember && (
                                  <p className="text-[11px] text-[#777777] font-manrope font-light">
                                    Email: {userDetails.email}
                                  </p>
                                )}
                              </div>

                              <div className="text-[10px] font-mono text-[#666666] pt-1 border-t border-brand-cream/5">
                                Placed: {new Date(order.createdAt).toLocaleString()}
                              </div>
                            </div>

                            {/* Column 2: Order Products List details */}
                            <div className="flex-grow space-y-2 max-w-md border-t md:border-t-0 md:border-l border-brand-cream/5 pt-4 md:pt-0 md:pl-5">
                              <h5 className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold mb-1.5 font-sans">
                                Cart Contents & Instruction set
                              </h5>
                              <div className="space-y-2.5">
                                {order.items.map((it) => (
                                  <div key={it.id} className="text-xs font-manrope space-y-0.5">
                                    <div className="flex justify-between font-light text-brand-cream/90">
                                      <span>
                                        {it.quantity}x <strong className="font-semibold text-brand-cream">{it.name}</strong> 
                                        <span className="text-[9px] text-[#666666] uppercase tracking-wider font-mono ml-2">
                                          ({it.category})
                                        </span>
                                      </span>
                                      <span className="font-mono text-[11px] text-[#a1a1a1]">
                                        ₹{it.price * it.quantity}
                                      </span>
                                    </div>
                                    
                                    {/* item instruction check */}
                                    {it.specialInstructions && (
                                      <div className="text-[10px] text-brand-gold font-mono italic pl-4 flex items-center gap-1 border-l border-brand-gold/20">
                                        <span>" {it.specialInstructions} "</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              <div className="pt-3 border-t border-brand-cream/5 flex justify-between items-center text-xs">
                                <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#a1a1a1]">
                                  {order.deliveryType === 'pickup' ? (
                                    <><MapPin className="w-3.5 h-3.5 text-brand-gold" /> Radisson Lobby Pickup</>
                                  ) : (
                                    <><ShoppingBag className="w-3.5 h-3.5 text-brand-gold" /> Room/Car Handover</>
                                  )}
                                </span>
                                <span className="font-mono font-bold text-brand-gold text-sm">
                                  Collect Total: ₹{order.total}
                                </span>
                              </div>
                            </div>

                            {/* Column 3: Active Status Changer controls */}
                            <div className="shrink-0 min-w-[200px] border-t md:border-t-0 md:border-l border-brand-cream/5 pt-4 md:pt-0 md:pl-5 flex flex-col justify-between">
                              <div className="space-y-1 text-right md:text-left mb-3">
                                <span className="block text-[10px] font-mono text-[#a1a1a1] uppercase tracking-wider">
                                  Current Preparation State
                                </span>
                                
                                {/* Styled Dynamic Status Badge */}
                                {order.status === 'Pending' && (
                                  <span className="inline-block px-2.5 py-1 text-[10px] font-mono uppercase font-bold tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-md font-sans">
                                    Awaiting Check
                                  </span>
                                )}
                                {order.status === 'Received' && (
                                  <span className="inline-block px-2.5 py-1 text-[10px] font-mono uppercase font-bold tracking-wider text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-md animate-pulse font-sans">
                                    Lobby Received
                                  </span>
                                )}
                                {order.status === 'Brewing' && (
                                  <span className="inline-block px-2.5 py-1 text-[10px] font-mono uppercase font-bold tracking-wider text-brand-gold bg-brand-gold/15 border border-brand-gold/30 rounded-md flex items-center gap-1.5 font-sans">
                                    <Flame className="w-3 h-3 text-brand-gold animate-bounce" />
                                    <span>Brewing & Baking</span>
                                  </span>
                                )}
                                {order.status === 'Ready' && (
                                  <span className="inline-block px-2.5 py-1 text-[10px] font-mono uppercase font-bold tracking-wider text-green-400 bg-green-400/10 border border-green-400/20 rounded-md animate-bounce font-sans">
                                    Ready at Counter
                                  </span>
                                )}
                                {order.status === 'Completed' && (
                                  <span className="inline-block px-2.5 py-1 text-[10px] font-mono uppercase font-bold tracking-wider text-neutral-400 bg-neutral-900 border border-neutral-800 rounded-md font-sans">
                                    Completed
                                  </span>
                                )}
                                {order.status === 'Cancelled' && (
                                  <span className="inline-block px-2.5 py-1 text-[10px] font-mono uppercase font-bold tracking-wider text-red-400 bg-red-955/20 border border-red-900/30 rounded-md font-sans">
                                    Cancelled
                                  </span>
                                )}
                              </div>

                              {/* Status Advancer Controller buttons row */}
                              <div className="space-y-1.5">
                                <span className="block text-[9px] font-mono text-[#a1a1a1] uppercase tracking-wider text-left">
                                  Advance State Node
                                </span>
                                
                                {order.status === 'Pending' && (
                                  <button
                                    type="button"
                                    onClick={() => onUpdateOrderStatus(order.id, 'Received')}
                                    className="w-full py-2 bg-blue-950/20 border border-blue-500/20 text-blue-300 hover:bg-blue-900 text-[10px] font-mono uppercase font-bold rounded-lg transition-transform cursor-pointer block"
                                  >
                                    Approve & Receive
                                  </button>
                                )}

                                {order.status === 'Received' && (
                                  <button
                                    type="button"
                                    onClick={() => onUpdateOrderStatus(order.id, 'Brewing')}
                                    className="w-full py-2 bg-brand-brown/20 border border-brand-gold/30 text-brand-gold hover:bg-brand-brown/50 text-[10px] font-mono uppercase font-bold rounded-lg transition-transform cursor-pointer flex items-center justify-center gap-1 font-sans"
                                  >
                                    <Flame className="w-3.5 h-3.5 animate-pulse" />
                                    <span>Start Brewing</span>
                                  </button>
                                )}

                                {order.status === 'Brewing' && (
                                  <button
                                    type="button"
                                    onClick={() => onUpdateOrderStatus(order.id, 'Ready')}
                                    className="w-full py-2 bg-green-950/20 border border-green-500/25 text-green-400 hover:bg-green-900/50 text-[10px] font-mono uppercase font-bold rounded-lg transition-transform cursor-pointer block text-center"
                                  >
                                    Mark Ready for Pickup
                                  </button>
                                )}

                                {order.status === 'Ready' && (
                                  <button
                                    type="button"
                                    onClick={() => onUpdateOrderStatus(order.id, 'Completed')}
                                    className="w-full py-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg text-[10px] font-mono uppercase font-extrabold tracking-wider rounded-lg transition-transform cursor-pointer block text-center shadow-lg"
                                  >
                                    Settle Handover (Award Pts)
                                  </button>
                                )}

                                {/* Cancel Button Override */}
                                {['Pending', 'Received', 'Brewing', 'Ready'].includes(order.status) && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to cancel / decline this order?')) {
                                        onUpdateOrderStatus(order.id, 'Cancelled');
                                      }
                                    }}
                                    className="w-full py-1.5 border border-red-950/80 hover:bg-red-950/40 text-red-400 text-[9px] font-mono uppercase rounded-lg transition-all cursor-pointer block text-center"
                                  >
                                    Decline / Cancel Order
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12 border border-dashed border-brand-cream/10 rounded-xl bg-neutral-950">
                        <p className="text-xs font-mono text-[#666666]">
                          No live order records matches your monitor filters.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* SECTION: ADD OR EDIT FORM */}
                  <div className="p-6 rounded-2xl bg-[#111111] border border-brand-cream/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center gap-2 border-b border-brand-cream/10 pb-4 mb-6">
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                  <h4 className="text-md font-serif text-brand-cream tracking-wide">
                    {editingId ? 'Edit Product Parameters' : 'Deploy New Gourmand Creation'}
                  </h4>
                </div>

                <form onSubmit={handleSubmitForm} className="space-y-6">
                  {formError && (
                    <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-300 text-xs rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Item Name */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-widest text-brand-gold mb-2 font-semibold">
                        Gourmet Item Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Classic Spanish Cortado"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#151515] border border-brand-cream/10 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold font-manrope transition-all"
                        required
                      />
                    </div>

                    {/* Category Selector */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-widest text-brand-gold mb-2 font-semibold">
                        Primary Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-[#151515] border border-brand-cream/10 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold font-mono transition-all"
                      >
                        <option value="specialty">Specialty Drink (Hot Coffee, Teas, manual brew)</option>
                        <option value="frappe">Ice Blends (Frappes, Shakes, Mocktails)</option>
                        <option value="food">Plates & Bites (Toasts, Sandwiches, Appetizers, Pasta)</option>
                      </select>
                    </div>

                    {/* Subcategory */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-widest text-brand-gold mb-2 font-semibold">
                        Subcategory Section
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Hot Coffee, Toasts, Appetizers (Leave empty for intelligent group)"
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#151515] border border-brand-cream/10 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold font-manrope transition-all"
                      />
                    </div>

                    {/* Pricing */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-widest text-brand-gold mb-2 font-semibold">
                        Price (₹ INR value) *
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 210"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-[#151515] border border-brand-cream/10 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold font-mono transition-all"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  {/* Description text block */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-brand-gold mb-2 font-semibold">
                      Gastronomical Signature Description *
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Rich layers of bold premium robusta stream emulsified with silk textured whole milk and warm cinnamon shavings..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#151515] border border-brand-cream/10 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold font-manrope transition-all leading-relaxed"
                      required
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-brand-gold mb-2 font-semibold">
                      Signature Accent Tags (Separate with commas)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Arabica Pure, Elite Texture, Baked Sourdough, Comfort Spice"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#151515] border border-brand-cream/10 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold font-manrope transition-all"
                    />
                  </div>

                  {/* Image uploading mechanism and URL pasting */}
                  <div className="border border-brand-cream/5 rounded-xl p-4 bg-[#141414] space-y-4">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-brand-gold font-bold">
                      Step 2: Assign Product Visual Identity
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Image Preview & custom file drop */}
                      <div className="p-4 rounded-lg bg-[#0e0e0e] border border-brand-cream/10 flex flex-col items-center justify-center text-center relative min-h-[140px]">
                        {image ? (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                            <img
                              src={image}
                              alt="Live preview"
                              className="w-24 h-24 rounded-lg object-cover border-2 border-brand-gold shadow-md"
                              referrerPolicy="no-referrer"
                            />
                            <p className="text-[10px] text-green-400 font-mono flex items-center gap-1 mt-1">
                              <Check className="w-3.5 h-3.5" /> Media Configured ({image.startsWith('data:') ? 'Custom Direct Upload' : 'External Host Verified'})
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2 text-[#6666ff]">
                            <ImageIcon className="w-8 h-8 text-neutral-600 mx-auto" />
                            <p className="text-xs text-[#a1a1a1] font-light">No Image Specified Yet</p>
                          </div>
                        )}
                      </div>

                      {/* Manual configuration inputs */}
                      <div className="flex flex-col justify-between gap-3">
                        {/* URL Paste */}
                        <div>
                          <span className="block text-[10px] text-[#8c8c8c] uppercase font-mono tracking-widest mb-1">
                            A. Paste Direct Graphic URL
                          </span>
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/photo-..."
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full px-3 py-2 bg-[#121212] border border-brand-cream/10 text-brand-cream text-xs rounded focus:outline-none focus:border-brand-gold transition-all font-mono"
                          />
                        </div>

                        {/* File Upload trigger */}
                        <div>
                          <span className="block text-[10px] text-[#8c8c8c] uppercase font-mono tracking-widest mb-1">
                            B. Upload Local Image File
                          </span>
                          <div className="flex gap-2">
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileUpload}
                              accept="image/*"
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full py-2 bg-[#1c1c1c] hover:bg-[#252525] border border-brand-cream/10 text-brand-cream text-xs rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5 text-brand-gold" />
                              <span>Select Image file...</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pre-configured Presets block */}
                    <div>
                      <span className="block text-[10px] text-[#8c8c8c] uppercase font-mono tracking-widest mb-2">
                        C. Or Select from Professional Studio Presets
                      </span>
                      <div className="flex flex-wrap gap-2 max-h-[105px] overflow-y-auto p-1.5 rounded-lg bg-[#0c0c0c] border border-brand-cream/5">
                        {IMAGE_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setImage(preset.url)}
                            className={`px-2 py-1 text-[10px] font-mono border rounded transition-all cursor-pointer truncate max-w-[150px] ${
                              image === preset.url 
                                ? 'bg-brand-gold/15 border-brand-gold text-brand-gold' 
                                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-brand-cream/35'
                            }`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Form Submission buttons */}
                  <div className="flex gap-3 justify-end pt-2">
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setName('');
                          setSubcategory('');
                          setDescription('');
                          setPrice(150);
                          setTagsInput('');
                          setImage('');
                          setFormError('');
                        }}
                        className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#252525] text-brand-cream text-xs font-mono uppercase tracking-widest rounded-lg transition-colors cursor-pointer border border-[#333333]"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-8 py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors cursor-pointer shadow-lg flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingId ? 'Modify Catalog Item' : 'Deploy Menu Creation'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* LIVE CATALOG SEARCH / EDIT / DELETE INTERFACE */}
              <div className="p-6 rounded-2xl bg-[#111111] border border-brand-cream/5 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-cream/10 pb-4">
                  <div>
                    <h4 className="text-md font-serif text-brand-cream tracking-wide">
                      Live Catalog Directory Inventory
                    </h4>
                    <p className="text-[10px] text-[#a1a1a1] uppercase font-mono tracking-widest mt-0.5">
                      Modify, duplicate, or purge products currently online
                    </p>
                  </div>
                  
                  {/* Current Active Counter */}
                  <div className="text-[10px] font-mono text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-3 py-1.5 rounded-lg shrink-0">
                    Active Catalog Total: <strong className="font-bold">{menuItems.length} Products</strong>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-3 items-center">
                  {/* Realtime Search box */}
                  <div className="w-full md:flex-1 relative">
                    <Search className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search active catalog items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#151515] border border-brand-cream/10 text-brand-cream text-xs rounded-lg focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>

                  {/* Primary Category Switcher selector */}
                  <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto shrink-0 select-none pb-1 md:pb-0">
                    {(['all', 'specialty', 'frappe', 'food'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-2 text-[10px] font-mono uppercase tracking-wider rounded-lg border transition-all cursor-pointer truncate ${
                          categoryFilter === cat
                            ? 'bg-brand-gold border-brand-gold text-brand-bg font-bold'
                            : 'bg-transparent border-brand-cream/10 text-brand-cream/70 hover:border-brand-gold'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Items list container */}
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {displayItems.length > 0 ? (
                    displayItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-lg bg-[#0c0c0c] border border-brand-cream/5 gap-4 hover:border-brand-gold/25 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover border border-brand-cream/10 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <h5 className="text-xs font-serif font-semibold text-brand-cream truncate max-w-[200px]">
                                {item.name}
                              </h5>
                              <span className="text-[9px] font-mono text-brand-gold bg-brand-gold/10 px-1.5 py-0.5 rounded uppercase font-bold shrink-0">
                                {item.category}
                              </span>
                            </div>
                            <span className="block text-[10px] text-[#666666] font-mono mt-0.5 max-w-[240px] truncate" title={item.subcategory}>
                              Section: {item.subcategory || 'Standard group'}
                            </span>
                          </div>
                        </div>

                        {/* Price tag */}
                        <div className="text-left sm:text-right shrink-0">
                          <span className="block text-xs font-mono font-bold text-brand-cream">
                            ₹{item.price}
                          </span>
                          <span className="text-[9px] text-[#666666] font-mono uppercase">
                            Price tag
                          </span>
                        </div>

                        {/* Direct action parameters buttons */}
                        <div className="flex items-center gap-2 sm:self-center self-end">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            className="p-2 sm:px-3 sm:py-2.5 rounded bg-[#151515] border border-brand-cream/10 hover:border-brand-gold hover:text-brand-gold text-brand-cream transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 sm:px-3 sm:py-2.5 rounded bg-red-950/20 border border-red-500/10 hover:border-red-500/50 text-red-300 hover:text-red-200 transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 border border-dashed border-brand-cream/10 rounded-xl bg-neutral-950">
                      <p className="text-xs font-mono text-[#666666]">
                        No active catalog items match your search filters.
                      </p>
                    </div>
                  )}
                </div>
              </div>

                </>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
