import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";

export interface ReservationData {
  id?: string;
  userId?: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantImage: string;
  date: string; // ISO string
  time: string;
  guestCount: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
  seatingPreference: string;
  accessibilityNeeds: boolean;
  status: "confirmed" | "cancelled" | "completed";
  createdAt?: any;
}

export const reservationService = {
  // Create a new reservation
  createReservation: async (
    data: Omit<ReservationData, "id" | "createdAt" | "status">,
    userId?: string
  ) => {
    try {
      const reservationData = {
        ...data,
        userId: userId || null,
        status: "confirmed",
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "reservations"),
        reservationData
      );
      return docRef.id;
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw error;
    }
  },

  // Get reservations for a specific user
  getUserReservations: async (userId: string) => {
    try {
      const q = query(
        collection(db, "reservations"),
        where("userId", "==", userId),
        orderBy("date", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ReservationData[];
    } catch (error) {
      console.error("Error getting user reservations:", error);
      throw error;
    }
  },

  // Get a single reservation by ID
  getReservation: async (reservationId: string) => {
    try {
      const docRef = doc(db, "reservations", reservationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ReservationData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting reservation:", error);
      throw error;
    }
  },

  // Cancel a reservation
  cancelReservation: async (reservationId: string) => {
    try {
      const docRef = doc(db, "reservations", reservationId);
      await updateDoc(docRef, {
        status: "cancelled",
      });
      return true;
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      throw error;
    }
  },
};
