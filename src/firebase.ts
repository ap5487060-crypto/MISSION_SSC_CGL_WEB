import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
  signOut, 
  onAuthStateChanged,
  type User 
} from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  collection, 
  doc, 
  setDoc,
  getDoc,
  getDocs,
  getDocFromServer,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  orderBy, 
  serverTimestamp,
  increment 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import firebaseConfigJson from '../firebase-applet-config.json';
import type { UserProfile, PurchaseRecord, Product } from './types';
import { DEFAULT_PRODUCTS } from './data/defaultProducts';

export const firebaseConfig = {
  apiKey: "AIzaSyD2hlZgs7OTienUtn2oAi0STvrH6nRAe3E",
  authDomain: "mission-scc-cgl.firebaseapp.com",
  projectId: "mission-scc-cgl",
  storageBucket: "mission-scc-cgl.firebasestorage.app",
  messagingSenderId: "721951857455",
  appId: "1:721951857455:web:d6d7384b1edc91c93adfda"
};

// Initialize Firebase safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Initialize Firestore with robust connection settings for iframe/sandboxed environments
export const db = (() => {
  try {
    return initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    });
  } catch {
    return getFirestore(app);
  }
})();
export const storage = getStorage(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Collections
export const productsCollection = collection(db, 'products');
export const usersCollection = collection(db, 'users');
export const purchasesCollection = collection(db, 'purchases');

export { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  signOut, 
  onAuthStateChanged, 
  doc, 
  setDoc,
  getDoc,
  getDocs,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  orderBy, 
  serverTimestamp,
  type User
};

/**
 * Syncs user profile data into Firestore `/users/{uid}`
 */
export async function syncUserProfile(user: User, additionalData?: Partial<UserProfile>): Promise<UserProfile> {
  const userDocRef = doc(db, 'users', user.uid);

  const profileData: UserProfile = {
    uid: user.uid,
    email: user.email || '',
    displayName: additionalData?.displayName || user.displayName || (user.email ? user.email.split('@')[0] : 'SSC Aspirant'),
    photoURL: additionalData?.photoURL || user.photoURL || '',
    phoneNumber: additionalData?.phoneNumber || user.phoneNumber || '',
    targetExam: additionalData?.targetExam || 'SSC CGL 2026',
    targetYear: additionalData?.targetYear || '2026',
    joinedAt: additionalData?.joinedAt || serverTimestamp(),
    lastLoginAt: serverTimestamp(),
    totalPurchases: additionalData?.totalPurchases || 0,
    totalSpent: additionalData?.totalSpent || 0,
    ...(additionalData || {})
  };

  try {
    await setDoc(userDocRef, profileData, { merge: true });
  } catch (error) {
    console.warn('Could not sync user profile to Firestore, using memory state:', error);
  }

  return profileData;
}

/**
 * Fetch User Profile from Firestore
 */
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Error fetching user profile from Firestore:', error);
    return null;
  }
}

/**
 * Records a purchase and adds it to user's library
 */
export async function recordUserPurchase(data: {
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  productId: string;
  productTitle: string;
  productType?: string;
  productImage?: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  paymentStatus?: 'completed' | 'verified' | 'pending_verification' | 'free';
  downloadUrl?: string;
  pdfUrl?: string;
  notes?: string;
}): Promise<string> {
  const purchaseId = `${data.productId}_${data.userId}_${Date.now()}`;
  const record: PurchaseRecord = {
    id: purchaseId,
    userId: data.userId,
    userEmail: data.userEmail,
    userName: data.userName,
    userPhone: data.userPhone || '',
    productId: data.productId,
    productTitle: data.productTitle,
    productType: data.productType || 'ebooks',
    productImage: data.productImage || '',
    amount: data.amount || 0,
    paymentMethod: data.paymentMethod || 'UPI',
    transactionId: data.transactionId || `TXN-${Date.now().toString().slice(-6)}`,
    paymentStatus: data.paymentStatus || 'completed',
    downloadUrl: data.downloadUrl || '',
    pdfUrl: data.pdfUrl || data.downloadUrl || '',
    createdAt: serverTimestamp(),
    notes: data.notes || ''
  };

  try {
    // 1. Save to global purchases collection
    const globalRef = doc(db, 'purchases', purchaseId);
    await setDoc(globalRef, record);

    // 2. Save to user's private library subcollection
    const userSubRef = doc(db, 'users', data.userId, 'purchases', purchaseId);
    await setDoc(userSubRef, record);

    // 3. Update user profile purchase stats
    try {
      const userDocRef = doc(db, 'users', data.userId);
      await updateDoc(userDocRef, {
        totalPurchases: increment(1),
        totalSpent: increment(data.amount || 0),
        lastLoginAt: serverTimestamp()
      });
    } catch {
      // Ignored
    }
  } catch {
    // Graceful fallback to local cache
    try {
      const localHistory = JSON.parse(localStorage.getItem('mssc_purchases') || '[]');
      localHistory.unshift(record);
      localStorage.setItem('mssc_purchases', JSON.stringify(localHistory.slice(0, 50)));
    } catch {
      // Ignored
    }
  }

  return purchaseId;
}

/**
 * Real-time subscription to user's purchases / library
 */
export function subscribeUserPurchases(
  userId: string, 
  callback: (purchases: PurchaseRecord[]) => void
): () => void {
  if (!userId) {
    callback([]);
    return () => {};
  }

  try {
    const q = query(
      collection(db, 'users', userId, 'purchases'),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const items: PurchaseRecord[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as PurchaseRecord);
      });
      callback(items);
    }, (error) => {
      // If permissions or network temporary, fallback cleanly without blocking app
      if (error?.message?.includes('permission') || error?.code === 'permission-denied') {
        // Handled silently with local storage continuity
      } else {
        console.info('Cloud sync notice for user purchases:', error?.message || error);
      }
      callback([]);
    });
  } catch (err) {
    callback([]);
    return () => {};
  }
}

/**
 * Uploads an image file to Firebase Storage under 'product-images/'
 * and returns the public download URL.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const fileName = `product-images/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

/**
 * Best-effort deletion of old storage image when replaced.
 */
export async function deleteOldStorageImage(oldUrl?: string): Promise<void> {
  if (!oldUrl || !oldUrl.includes('firebasestorage.googleapis.com')) return;
  try {
    const storageRef = ref(storage, oldUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.warn('Could not delete old storage image:', error);
  }
}

/**
 * Tests connection to Firestore safely without hanging or throwing unhandled errors
 */
export async function testFirestoreConnection(): Promise<{ ok: boolean; message?: string }> {
  try {
    // Check with a fast timeout
    const testPromise = getDoc(doc(db, 'products', 'connection_test_doc'));
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection check timeout')), 4000)
    );
    await Promise.race([testPromise, timeoutPromise]);
    return { ok: true, message: 'Connected to Firestore successfully' };
  } catch (error: any) {
    const msg = error instanceof Error ? error.message : String(error);
    return { ok: false, message: msg };
  }
}

/**
 * Seeds default verified SSC CGL books & digital resources into Firestore
 */
export async function seedDefaultCatalog(overwrite: boolean = false): Promise<number> {
  try {
    let addedCount = 0;
    for (const item of DEFAULT_PRODUCTS) {
      const docRef = doc(db, 'products', item.id);
      if (!overwrite) {
        const snap = await getDoc(docRef);
        if (snap.exists()) continue;
      }
      await setDoc(docRef, {
        ...item,
        createdAt: serverTimestamp()
      });
      addedCount++;
    }
    return addedCount;
  } catch (error) {
    console.error('Error seeding default catalog:', error);
    return 0;
  }
}

/**
 * Purges extra / stray products from Firestore and syncs exactly the 10 verified products
 */
export async function purgeExtraAndSync10Products(): Promise<{ synced: number; deleted: number }> {
  try {
    const validIds = new Set(DEFAULT_PRODUCTS.map(p => p.id));
    const snap = await getDocs(productsCollection);
    let deleted = 0;

    for (const docSnap of snap.docs) {
      if (!validIds.has(docSnap.id)) {
        await deleteDoc(doc(db, 'products', docSnap.id));
        deleted++;
      }
    }

    const synced = await seedDefaultCatalog(true);
    return { synced, deleted };
  } catch (error) {
    console.error('Error purging extra products:', error);
    throw error;
  }
}

