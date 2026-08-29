export interface Product {
  id: string;
  title: string;
  desc?: string;
  cat?: string;
  badge?: string;
  price?: string;
  mrp?: string;
  amazon?: string;
  flipkart?: string;
  free?: boolean;
  pdf?: string; // legacy backward compatibility
  landingPageUrl?: string;
  paymentUrl?: string;
  downloadUrl?: string;
  img?: string;
  type: 'books' | 'ebooks' | 'stationery' | string;
  status?: 'published' | 'draft' | string;
  featured?: boolean;
  createdAt?: any;
}

export type ProductType = 'all' | 'books' | 'ebooks' | 'stationery';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  targetExam?: string;
  targetYear?: string;
  joinedAt?: any;
  lastLoginAt?: any;
  totalPurchases?: number;
  totalSpent?: number;
}

export interface PurchaseRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  productId: string;
  productTitle: string;
  productType?: string;
  productImage?: string;
  amount: number;
  paymentMethod: 'UPI' | 'Instamojo' | 'WhatsApp Direct' | 'Free Access' | 'Razorpay' | string;
  transactionId?: string;
  paymentStatus: 'completed' | 'verified' | 'pending_verification' | 'free';
  downloadUrl?: string;
  pdfUrl?: string;
  createdAt: any;
  notes?: string;
}

