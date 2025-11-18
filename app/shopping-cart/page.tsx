"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';
import CartItem from '@/components/shopping-cart/cart-item';
import OrderSummary from '@/components/shopping-cart/order-summary';
import EmptyCart from '@/components/shopping-cart/empty-card';
import PromoCodeSection from '@/components/shopping-cart/promo-code-section';
import Icon from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { updateQuantity, removeItem, applyPromo, removePromo, updateCartQuantity, removeCartItem, fetchCart, type PromoCode } from '@/lib/store/slices/cartSlice';
import { auth } from '@/lib/firebase/config';
import { useEffect } from 'react';

const ShoppingCart = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const appliedPromo = useAppSelector((state) => state.cart.appliedPromo);
  const user = useAppSelector((state) => state.auth.user);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Load cart from Firebase when user is logged in
  useEffect(() => {
    if (user && auth.currentUser) {
      dispatch(fetchCart(auth.currentUser.uid));
    }
  }, [user, dispatch]);

  // Available promo codes
  const availablePromoCodes: Record<string, PromoCode> = {
    'SAVE10': { code: 'SAVE10', discount: 0.10, description: '10% off your order', minOrder: 20 },
    'FIRST20': { code: 'FIRST20', discount: 0.20, description: '20% off first order', minOrder: 25 },
    'WELCOME15': { code: 'WELCOME15', discount: 0.15, description: '15% off welcome offer', minOrder: 15 }
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    // Optimistic update for immediate UI feedback
    dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));

    // If user is logged in, sync with Firebase
    if (user && auth.currentUser) {
      try {
        await dispatch(updateCartQuantity({
          userId: auth.currentUser.uid,
          itemId,
          quantity: newQuantity
        })).unwrap();
      } catch (error) {
        console.error('Error updating cart in Firebase:', error);
      }
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    // Optimistic update for immediate UI feedback
    dispatch(removeItem(itemId));

    // If user is logged in, sync with Firebase
    if (user && auth.currentUser) {
      try {
        await dispatch(removeCartItem({
          userId: auth.currentUser.uid,
          itemId
        })).unwrap();
      } catch (error) {
        console.error('Error removing item from Firebase:', error);
      }
    }
  };

  const handleModifyItem = (itemId: number) => {
    // Navigate to menu with item modification
    router.push(`/menu-catalog?modify=${itemId}`);
  };

  const handleApplyPromo = async (promoCode: string): Promise<{ success: boolean; message?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const promo = availablePromoCodes[promoCode];
        const currentSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (promo && currentSubtotal >= promo.minOrder) {
          dispatch(applyPromo(promo));
          resolve({ success: true });
        } else if (promo) {
          resolve({
            success: false,
            message: `Minimum order of $${promo.minOrder} required`
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid promo code'
          });
        }
      }, 1000);
    });
  };

  const handleRemovePromo = () => {
    dispatch(removePromo());
  };

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);

    // Simulate checkout process
    setTimeout(() => {
      setIsCheckoutLoading(false);
      // Navigate to checkout page (would be implemented)
      alert('Proceeding to checkout...\nThis would navigate to the payment page.');
    }, 2000);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.08; // 8% tax
  const deliveryFee = discountedSubtotal >= 30 ? 0 : 3.99; // Free delivery over $30
  const total = discountedSubtotal + tax + deliveryFee;

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="">
          <EmptyCart />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navbar />

      <main className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Icon name="ShoppingCart" size={28} className="text-primary" />
              <h1 className="font-heading font-bold text-3xl text-foreground">
                Shopping Cart
              </h1>
            </div>
            <p className="font-body text-muted-foreground">
              Review your order and proceed to checkout
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-xl text-foreground">
                  Your Items ({cartCount})
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/menu-catalog')}
                  iconName="Plus">
                  Add More Items
                </Button>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                    onModify={handleModifyItem}
                  />
                ))}
              </div>

              {/* Promo Code Section */}
              <PromoCodeSection
                onApplyPromo={handleApplyPromo}
                appliedPromo={appliedPromo}
                onRemovePromo={handleRemovePromo} />


              {/* Continue Shopping */}
              <div className="pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => router.push('/menu-catalog')}
                  iconName="ArrowLeft">
                  Continue Shopping
                </Button>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <OrderSummary
                subtotal={subtotal}
                tax={tax}
                deliveryFee={deliveryFee}
                discount={discountAmount}
                total={total}
                onCheckout={handleCheckout}
                isLoading={isCheckoutLoading}
                promoCode={appliedPromo?.code || null} />

            </div>
          </div>

          {/* Mobile Checkout Button */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-warm-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-muted-foreground">Total:</span>
              <span className="font-heading font-bold text-xl text-primary">
                ${total.toFixed(2)}
              </span>
            </div>
            <Button
              variant="default"
              size="lg"
              disabled={isCheckoutLoading}
              onClick={handleCheckout}
              iconName="CreditCard"
              className="w-full bg-linear-to-br from-primary-solid via-grad1 to-grad2 hover:bg-primary/90 text-primary-foreground">
              Proceed to Checkout
            </Button>
          </div>

          {/* Mobile Spacing */}
          <div className="lg:hidden h-24"></div>
        </div>
      </main>
    </div>);

};

export default ShoppingCart;