import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './config';
import { CartItem } from '@/lib/store/slices/cartSlice';

export const cartService = {
  // Get user's cart
  getCart: async (userId: string): Promise<CartItem[]> => {
    try {
      const cartDoc = await getDoc(doc(db, 'carts', userId));
      if (cartDoc.exists()) {
        return cartDoc.data().items || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching cart:', error);
      return [];
    }
  },

  // Add item to cart
  addItem: async (userId: string, item: CartItem): Promise<void> => {
    try {
      const cartRef = doc(db, 'carts', userId);
      const cartDoc = await getDoc(cartRef);
      
      if (cartDoc.exists()) {
        const currentItems = cartDoc.data().items || [];
        const existingIndex = currentItems.findIndex((i: CartItem) => i.id === item.id);
        
        if (existingIndex >= 0) {
          currentItems[existingIndex].quantity += 1;
        } else {
          currentItems.push({ ...item, quantity: 1 });
        }
        
        await updateDoc(cartRef, { items: currentItems });
      } else {
        await setDoc(cartRef, { items: [{ ...item, quantity: 1 }] });
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },

  // Update item quantity
  updateQuantity: async (userId: string, itemId: number, quantity: number): Promise<void> => {
    try {
      const cartRef = doc(db, 'carts', userId);
      const cartDoc = await getDoc(cartRef);
      
      if (cartDoc.exists()) {
        const items = cartDoc.data().items || [];
        const itemIndex = items.findIndex((i: CartItem) => i.id === itemId);
        
        if (itemIndex >= 0) {
          if (quantity <= 0) {
            items.splice(itemIndex, 1);
          } else {
            items[itemIndex].quantity = quantity;
          }
          await updateDoc(cartRef, { items });
        }
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeItem: async (userId: string, itemId: number): Promise<void> => {
    try {
      const cartRef = doc(db, 'carts', userId);
      const cartDoc = await getDoc(cartRef);
      
      if (cartDoc.exists()) {
        const items = cartDoc.data().items.filter((i: CartItem) => i.id !== itemId);
        await updateDoc(cartRef, { items });
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  },

  // Clear cart
  clearCart: async (userId: string): Promise<void> => {
    try {
      await updateDoc(doc(db, 'carts', userId), { items: [] });
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Real-time cart listener
  onCartChange: (userId: string, callback: (items: CartItem[]) => void) => {
    const cartRef = doc(db, 'carts', userId);
    return onSnapshot(cartRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data().items || []);
      } else {
        callback([]);
      }
    }, (error) => {
      console.error('Error listening to cart changes:', error);
      callback([]);
    });
  },
};

