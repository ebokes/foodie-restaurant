import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { UserData } from '@/lib/store/slices/authSlice';

// Convert Firebase User to UserData
const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<UserData> => {
  // Get user data from Firestore
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  const userData = userDoc.data();

  // Normalize avatar URL - ensure it's a valid string or undefined
  const avatarUrl = firebaseUser.photoURL || userData?.avatar;
  const normalizedAvatar = avatarUrl && avatarUrl.trim() !== '' ? avatarUrl : undefined;

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || userData?.name || '',
    email: firebaseUser.email || '',
    avatar: normalizedAvatar,
    avatarAlt: userData?.avatarAlt || undefined,
    phone: firebaseUser.phoneNumber || userData?.phone || undefined,
    joinDate: userData?.joinDate || new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    preferences: userData?.preferences || undefined,
    addresses: userData?.addresses || undefined,
  };
};

export const authService = {
  // Email/Password Sign In
  signIn: async (email: string, password: string): Promise<UserData> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userData = await convertFirebaseUser(userCredential.user);
    
    // Update last login
    await setDoc(
      doc(db, 'users', userCredential.user.uid),
      { lastLogin: new Date().toISOString() },
      { merge: true }
    );
    
    return userData;
  },

  // Email/Password Sign Up
  signUp: async (
    email: string,
    password: string,
    name: string,
    phone?: string
  ): Promise<UserData> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile
    await updateProfile(userCredential.user, { displayName: name });
    
    // Create user document in Firestore
    const userData: Partial<UserData> = {
      id: userCredential.user.uid,
      name,
      email,
      phone,
      joinDate: new Date().toISOString(),
      registrationDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    
    await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    
    return await convertFirebaseUser(userCredential.user);
  },

  // Google Sign In
  signInWithGoogle: async (): Promise<UserData> => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      // Create user document for new users
      const userData: Partial<UserData> = {
        id: userCredential.user.uid,
        name: userCredential.user.displayName || '',
        email: userCredential.user.email || '',
        avatar: userCredential.user.photoURL || undefined,
        provider: 'google',
        joinDate: new Date().toISOString(),
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    } else {
      // Update last login
      await setDoc(
        doc(db, 'users', userCredential.user.uid),
        { lastLogin: new Date().toISOString() },
        { merge: true }
      );
    }
    
    return await convertFirebaseUser(userCredential.user);
  },

  // Sign Out
  signOut: async (): Promise<void> => {
    await signOut(auth);
  },

  // Reset Password
  resetPassword: async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  },

  // Auth State Listener
  onAuthStateChange: (callback: (user: UserData | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await convertFirebaseUser(firebaseUser);
          callback(userData);
        } catch (error) {
          console.error('Error converting Firebase user:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },

  // Get Current User
  getCurrentUser: async (): Promise<UserData | null> => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      return await convertFirebaseUser(firebaseUser);
    }
    return null;
  },
};

