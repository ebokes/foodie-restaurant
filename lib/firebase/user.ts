import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";

export interface UserAddress {
  id: string;
  label: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface UserPreferences {
  dietary?: string[];
  spiceLevel?: string;
  notifications?: {
    orderUpdates?: boolean;
    promotions?: boolean;
    newMenuItems?: boolean;
    emailNewsletter?: boolean;
    smsNotifications?: boolean;
  };
  favoriteItems?: Array<{
    id: string;
    name: string;
    category: string;
    image: string;
    imageAlt: string;
    price: number;
    description: string;
    originalPrice?: number;
    subtitle?: string;
    dietary?: string[];
    tags?: string[];
    rating?: number;
    reviewCount?: number;
    prepTime?: number;
  }>;
}

export interface PaymentMethod {
  id: string;
  type: string;
  lastFour: string;
  expiryDate: string;
  cardholderName: string;
  isDefault: boolean;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export const userService = {
  // Get user addresses
  getAddresses: async (userId: string): Promise<UserAddress[]> => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data().addresses || [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return [];
    }
  },

  // Update user addresses
  updateAddresses: async (
    userId: string,
    addresses: UserAddress[]
  ): Promise<void> => {
    try {
      await updateDoc(doc(db, "users", userId), { addresses });
    } catch (error) {
      console.error("Error updating addresses:", error);
      throw error;
    }
  },

  // Get user preferences
  getPreferences: async (userId: string): Promise<UserPreferences> => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data().preferences || {};
      }
      return {};
    } catch (error) {
      console.error("Error fetching preferences:", error);
      return {};
    }
  },

  // Update user preferences
  updatePreferences: async (
    userId: string,
    preferences: UserPreferences
  ): Promise<void> => {
    try {
      await updateDoc(doc(db, "users", userId), { preferences });
    } catch (error) {
      console.error("Error updating preferences:", error);
      throw error;
    }
  },

  // Get user payment methods
  getPaymentMethods: async (userId: string): Promise<PaymentMethod[]> => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data().paymentMethods || [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      return [];
    }
  },

  // Add payment method
  addPaymentMethod: async (
    userId: string,
    paymentMethod: PaymentMethod
  ): Promise<void> => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      const currentMethods = userDoc.exists()
        ? userDoc.data().paymentMethods || []
        : [];

      // If this is set as default, remove default from others
      if (paymentMethod.isDefault) {
        const updatedMethods = currentMethods.map((pm: PaymentMethod) => ({
          ...pm,
          isDefault: false,
        }));
        updatedMethods.push(paymentMethod);
        await updateDoc(doc(db, "users", userId), {
          paymentMethods: updatedMethods,
        });
      } else {
        await updateDoc(doc(db, "users", userId), {
          paymentMethods: [...currentMethods, paymentMethod],
        });
      }
    } catch (error) {
      console.error("Error adding payment method:", error);
      throw error;
    }
  },

  // Delete payment method
  deletePaymentMethod: async (
    userId: string,
    paymentMethodId: string
  ): Promise<void> => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const currentMethods = userDoc.data().paymentMethods || [];
        const updatedMethods = currentMethods.filter(
          (pm: PaymentMethod) => pm.id !== paymentMethodId
        );
        await updateDoc(doc(db, "users", userId), {
          paymentMethods: updatedMethods,
        });
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
      throw error;
    }
  },

  // Set default payment method
  setDefaultPaymentMethod: async (
    userId: string,
    paymentMethodId: string
  ): Promise<void> => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const currentMethods = userDoc.data().paymentMethods || [];
        const updatedMethods = currentMethods.map((pm: PaymentMethod) => ({
          ...pm,
          isDefault: pm.id === paymentMethodId,
        }));
        await updateDoc(doc(db, "users", userId), {
          paymentMethods: updatedMethods,
        });
      }
    } catch (error) {
      console.error("Error setting default payment method:", error);
      throw error;
    }
  },
};
