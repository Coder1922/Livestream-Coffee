import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { UserProfile, Order, MenuItem } from './types';
import config from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = config.firestoreDatabaseId 
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Collection References
export const usersCollectionName = 'livestream_users';
export const ordersCollectionName = 'livestream_orders';
export const menuCollectionName = 'livestream_menu';

// Hardened error tracking definitions conforming to the platform specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Sync registered users from Firestore in real-time.
 * Also seeds initial users from LocalStorage if Firestore is empty.
 */
export function syncUsers(onChange: (users: UserProfile[]) => void): () => void {
  const q = query(collection(db, usersCollectionName));
  
  return onSnapshot(q, (snapshot) => {
    const list: UserProfile[] = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() } as UserProfile);
    });

    if (list.length === 0) {
      // Seed from localStorage to prevent data loss on initial migration
      try {
        const saved = localStorage.getItem('LIVESTREAM_REGISTERED_USERS');
        if (saved) {
          const localUsers: UserProfile[] = JSON.parse(saved);
          localUsers.forEach(async (u) => {
            try {
              await setDoc(doc(db, usersCollectionName, u.id), u);
            } catch (err) {
              handleFirestoreError(err, OperationType.WRITE, `${usersCollectionName}/${u.id}`);
            }
          });
        }
      } catch (e) {
        console.error('Failed to seed users', e);
      }
    }
    onChange(list);
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, usersCollectionName);
  });
}

/**
 * Register a new user in Firestore
 */
export async function registerFirebaseUser(user: UserProfile): Promise<void> {
  try {
    await setDoc(doc(db, usersCollectionName, user.id), user);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${usersCollectionName}/${user.id}`);
  }
}

/**
 * Update user profile (e.g. loyalty score)
 */
export async function updateFirebaseUser(userId: string, updates: Partial<UserProfile>): Promise<void> {
  const ref = doc(db, usersCollectionName, userId);
  try {
    await updateDoc(ref, updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${usersCollectionName}/${userId}`);
  }
}

/**
 * Sync orders from Firestore in real-time
 */
export function syncOrders(onChange: (orders: Order[]) => void): () => void {
  const q = query(collection(db, ordersCollectionName));

  return onSnapshot(q, (snapshot) => {
    const list: Order[] = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() } as Order);
    });

    // Sort by createdAt descending
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (list.length === 0) {
      // Seed from localStorage
      try {
        const saved = localStorage.getItem('LIVESTREAM_ORDERS');
        if (saved) {
          const localOrders: Order[] = JSON.parse(saved);
          localOrders.forEach(async (o) => {
            try {
              await setDoc(doc(db, ordersCollectionName, o.id), o);
            } catch (err) {
              handleFirestoreError(err, OperationType.WRITE, `${ordersCollectionName}/${o.id}`);
            }
          });
        }
      } catch (e) {
        console.error('Failed to seed orders', e);
      }
    }
    onChange(list);
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, ordersCollectionName);
  });
}

/**
 * Place a new order in Firestore
 */
export async function placeFirebaseOrder(order: Order): Promise<void> {
  try {
    await setDoc(doc(db, ordersCollectionName, order.id), order);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${ordersCollectionName}/${order.id}`);
  }
}

/**
 * Update order status in Firestore
 */
export async function updateFirebaseOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const ref = doc(db, ordersCollectionName, orderId);
  try {
    await updateDoc(ref, { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${ordersCollectionName}/${orderId}`);
  }
}

/**
 * Sync customized menu items from Firestore in real-time
 */
export function syncMenuItems(defaultItems: MenuItem[], onChange: (items: MenuItem[]) => void): () => void {
  const q = query(collection(db, menuCollectionName));

  return onSnapshot(q, (snapshot) => {
    const list: MenuItem[] = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() } as MenuItem);
    });

    if (list.length === 0) {
      // Seed default menu items
      defaultItems.forEach(async (item) => {
        try {
          await setDoc(doc(db, menuCollectionName, item.id), item);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `${menuCollectionName}/${item.id}`);
        }
      });
      onChange(defaultItems);
    } else {
      onChange(list);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, menuCollectionName);
  });
}

/**
 * Save customized menu items list
 */
export async function saveFirebaseMenuItems(items: MenuItem[]): Promise<void> {
  const batch = writeBatch(db);
  // Delete existing, then write all. To keep it simpler, let's setDoc for each item.
  for (const item of items) {
    const ref = doc(db, menuCollectionName, item.id);
    batch.set(ref, item);
  }
  try {
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, menuCollectionName);
  }
}
