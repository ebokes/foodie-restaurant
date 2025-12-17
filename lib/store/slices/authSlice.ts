import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/lib/firebase/auth";
import { userService } from "@/lib/firebase/user";

interface DetailedNotificationPreferences {
  orderUpdates?: boolean;
  promotions?: boolean;
  newMenuItems?: boolean;
  emailNewsletter?: boolean;
  smsNotifications?: boolean;
}

export interface FavoriteItem {
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
}

export interface UserData {
  id: number | string;
  name: string;
  email: string;
  avatar?: string;
  avatarAlt?: string;
  loginTime?: string;
  rememberMe?: boolean;
  phone?: string;
  dateOfBirth?: string;
  joinDate?: string;
  registrationDate?: string;
  lastLogin?: string;
  bio?: string;
  provider?: string;
  preferences?: {
    newsletter?: boolean;
    /**
     * Legacy boolean flag or detailed notification preferences
     */
    notifications?: boolean | DetailedNotificationPreferences;
    marketing?: boolean;
    dietary?: string[];
    spiceLevel?: string;
    favoriteItems?: FavoriteItem[];
  };
  addresses?: Array<{
    id: string;
    label: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
  }>;
}

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const signInUser = createAsyncThunk(
  "auth/signIn",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      return await authService.signIn(email, password);
    } catch (error: any) {
      return rejectWithValue(error.message || "Sign in failed");
    }
  }
);

export const signUpUser = createAsyncThunk(
  "auth/signUp",
  async (
    {
      email,
      password,
      name,
      phone,
    }: { email: string; password: string; name: string; phone?: string },
    { rejectWithValue }
  ) => {
    try {
      return await authService.signUp(email, password, name, phone);
    } catch (error: any) {
      return rejectWithValue(error.message || "Sign up failed");
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.signInWithGoogle();
    } catch (error: any) {
      return rejectWithValue(error.message || "Google sign in failed");
    }
  }
);

export const signOutUser = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      await authService.signOut();
    } catch (error: any) {
      return rejectWithValue(error.message || "Sign out failed");
    }
  }
);

export const toggleFavoriteItem = createAsyncThunk(
  "auth/toggleFavorite",
  async (
    { userId, item }: { userId: string; item: FavoriteItem },
    { rejectWithValue }
  ) => {
    try {
      const currentPreferences = await userService.getPreferences(userId);
      const currentFavorites = currentPreferences.favoriteItems || [];
      const exists = currentFavorites.some((fav) => fav.id === item.id);

      let newFavorites;
      if (exists) {
        newFavorites = currentFavorites.filter((fav) => fav.id !== item.id);
      } else {
        newFavorites = [...currentFavorites, item];
      }

      const newPreferences = {
        ...currentPreferences,
        favoriteItems: newFavorites,
      };
      await userService.updatePreferences(userId, newPreferences);
      return newFavorites;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update favorites");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signInUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Sign Up
      .addCase(signUpUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Google Sign In
      .addCase(signInWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Sign Out
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Toggle Favorite
      .addCase(toggleFavoriteItem.fulfilled, (state, action) => {
        if (state.user) {
          if (!state.user.preferences) {
            state.user.preferences = {};
          }
          state.user.preferences.favoriteItems = action.payload;
        }
      });
  },
});

export const { setUser, updateUser, clearError } = authSlice.actions;

export default authSlice.reducer;
