import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from './config';
import { CartItem } from '@/lib/store/slices/cartSlice';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  status: string;
  createdAt: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod?: {
    type: string;
    lastFour: string;
  };
  timeline?: Array<{
    status: string;
    timestamp: string | null;
    title: string;
    description: string;
    completed: boolean;
    active?: boolean;
  }>;
}

export const orderService = {
  // Create order
  createOrder: async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: new Date().toISOString(),
        timeline: [
          {
            status: 'order_confirmed',
            timestamp: new Date().toISOString(),
            title: 'Order Confirmed',
            description: 'Your order has been received and confirmed',
            completed: true,
            active: false,
          },
          {
            status: 'preparing',
            timestamp: null,
            title: 'Preparing Your Order',
            description: 'Our chefs are preparing your delicious meal',
            completed: false,
            active: true,
          },
        ],
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get user's orders
  getUserOrders: async (userId: string): Promise<Order[]> => {
    try {
      // Try query with index first
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
      } catch (indexError: any) {
        // If index doesn't exist, fallback to filtering in memory
        if (indexError.code === 'failed-precondition') {
          console.warn('Firestore index not found. Fetching all orders and filtering in memory. Please create the index for better performance.');
          const q = query(collection(db, 'orders'), where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          const orders = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Order[];
          // Sort in memory
          return orders.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA; // Descending order
          });
        }
        throw indexError;
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  },

  // Get order by ID
  getOrder: async (orderId: string): Promise<Order | null> => {
    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Order;
      }
      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string): Promise<void> => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },
};

