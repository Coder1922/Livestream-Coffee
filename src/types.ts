export interface MenuItem {
  id: string;
  name: string;
  category: 'specialty' | 'frappe' | 'food';
  subcategory?: string;
  description: string;
  price: number;
  tags?: string[];
  image: string;
}

export interface Experience {
  id: string;
  title: string;
  items: string[];
  description: string;
  image: string;
}

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  detail: string;
}

export interface Testimonial {
  id: string;
  rating: number;
  text: string;
  author: string;
  role: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: 'coffee' | 'food' | 'interior' | 'people' | 'lifestyle';
  span: 'normal' | 'tall' | 'wide';
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: 'specialty' | 'frappe' | 'food';
  specialInstructions?: string;
  image: string;
}

export interface Order {
  id: string;
  userId?: string;
  userName: string;
  userPhone: string;
  items: OrderItem[];
  total: number;
  deliveryType: 'pickup' | 'delivery';
  status: 'Pending' | 'Received' | 'Brewing' | 'Ready' | 'Completed' | 'Cancelled';
  createdAt: string;
  specialInstructions?: Record<string, string>;
  paymentMethod?: 'UPI_QR' | 'CARD' | 'COUNTER';
  paymentStatus?: 'Pending' | 'Paid' | 'Failed';
  paymentReference?: string;
}

