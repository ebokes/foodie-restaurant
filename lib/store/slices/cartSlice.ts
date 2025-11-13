import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  imageAlt: string;
  customizations: string[];
  specialRequests: string | null;
}

export interface PromoCode {
  code: string;
  discount: number;
  description: string;
  minOrder: number;
}

interface CartState {
  items: CartItem[];
  appliedPromo: PromoCode | null;
}

const initialState: CartState = {
  items: [],
  appliedPromo: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(item => item.id !== action.payload.id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
      state.appliedPromo = null;
    },
    applyPromo: (state, action: PayloadAction<PromoCode>) => {
      state.appliedPromo = action.payload;
    },
    removePromo: (state) => {
      state.appliedPromo = null;
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { 
  addItem, 
  updateQuantity, 
  removeItem, 
  clearCart, 
  applyPromo, 
  removePromo,
  setCartItems 
} = cartSlice.actions;

export default cartSlice.reducer;

