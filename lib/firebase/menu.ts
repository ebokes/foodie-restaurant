import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from './config';
import { MenuItem } from '@/types/menu-catalog';

export const menuService = {
  // Get all menu items
  getMenuItems: async (filters?: { category?: string; dietary?: string }): Promise<MenuItem[]> => {
    try {
      let q = query(collection(db, 'menuItems'));
      
      if (filters?.category && filters.category !== 'all') {
        q = query(q, where('category', '==', filters.category));
      }
      
      if (filters?.dietary) {
        q = query(q, where('dietary', 'array-contains', filters.dietary));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: parseInt(doc.id) || doc.data().id || 0,
        ...doc.data(),
      })) as MenuItem[];
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  },

  // Get single menu item
  getMenuItem: async (id: number): Promise<MenuItem | null> => {
    try {
      const docRef = doc(db, 'menuItems', id.toString());
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: parseInt(docSnap.id) || docSnap.data().id || 0,
          ...docSnap.data(),
        } as MenuItem;
      }
      return null;
    } catch (error) {
      console.error('Error fetching menu item:', error);
      return null;
    }
  },
};

