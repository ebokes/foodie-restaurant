import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    notifications?: boolean;
    marketing?: boolean;
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
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, updateUser, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;

