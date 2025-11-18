import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cartService } from '@/lib/firebase/cart';
import { RootState } from '../store';

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
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  appliedPromo: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await cartService.getCart(userId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch cart');
    }
  }
);

export const addCartItem = createAsyncThunk(
  'cart/addItem',
  async ({ userId, item }: { userId: string; item: CartItem }, { rejectWithValue }) => {
    try {
      await cartService.addItem(userId, item);
      return item;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (
    { userId, itemId, quantity }: { userId: string; itemId: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      await cartService.updateQuantity(userId, itemId, quantity);
      return { itemId, quantity };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update cart quantity');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async ({ userId, itemId }: { userId: string; itemId: number }, { rejectWithValue }) => {
    try {
      await cartService.removeItem(userId, itemId);
      return itemId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove item from cart');
    }
  }
);

export const clearCartFirebase = createAsyncThunk(
  'cart/clearCart',
  async (userId: string, { rejectWithValue }) => {
    try {
      await cartService.clearCart(userId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    applyPromo: (state, action: PayloadAction<PromoCode>) => {
      state.appliedPromo = action.payload;
    },
    removePromo: (state) => {
      state.appliedPromo = null;
    },
    // Local add item (for immediate UI update before Firebase sync)
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    // Local update quantity (for immediate UI update before Firebase sync)
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
    // Local remove item (for immediate UI update before Firebase sync)
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    // Local clear cart
    clearCart: (state) => {
      state.items = [];
      state.appliedPromo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add Item
      .addCase(addCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        const existingItem = state.items.find(item => item.id === action.payload.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push({ ...action.payload, quantity: 1 });
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Quantity
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const item = state.items.find(item => item.id === action.payload.itemId);
        if (item) {
          if (action.payload.quantity <= 0) {
            state.items = state.items.filter(item => item.id !== action.payload.itemId);
          } else {
            item.quantity = action.payload.quantity;
          }
        }
        state.error = null;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Remove Item
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.error = null;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Clear Cart
      .addCase(clearCartFirebase.fulfilled, (state) => {
        state.items = [];
        state.appliedPromo = null;
        state.error = null;
      })
      .addCase(clearCartFirebase.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setCartItems,
  applyPromo,
  removePromo,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

