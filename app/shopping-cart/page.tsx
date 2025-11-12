"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';
import CartItem from '@/components/shopping-cart/cart-item';
import OrderSummary from '@/components/shopping-cart/order-summary';
import EmptyCart from '@/components/shopping-cart/empty-card';
import PromoCodeSection from '@/components/shopping-cart/promo-code-section';
import Icon from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  imageAlt: string;
  customizations: string[];
  specialRequests: string | null;
}

interface PromoCode {
  code: string;
  discount: number;
  description: string;
  minOrder: number;
}

const ShoppingCart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Mock cart data
  const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: "Classic Beef Burger",
    price: 12.99,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1585508718415-6d83666de492",
    imageAlt: "Juicy beef burger with lettuce, tomato, and cheese on sesame bun",
    customizations: ["Extra cheese", "No onions"],
    specialRequests: "Medium rare patty"
  },
  {
    id: 2,
    name: "Margherita Pizza",
    price: 16.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1703784022146-b72677752ce5",
    imageAlt: "Traditional margherita pizza with fresh basil, mozzarella, and tomato sauce",
    customizations: ["Thin crust"],
    specialRequests: null
  },
  {
    id: 3,
    name: "Caesar Salad",
    price: 9.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1598268013060-1f5baade2fc0",
    imageAlt: "Fresh caesar salad with romaine lettuce, croutons, and parmesan cheese",
    customizations: ["Extra dressing", "Add chicken"],
    specialRequests: "Dressing on the side"
  }];


  // Available promo codes
  const availablePromoCodes: Record<string, PromoCode> = {
    'SAVE10': { code: 'SAVE10', discount: 0.10, description: '10% off your order', minOrder: 20 },
    'FIRST20': { code: 'FIRST20', discount: 0.20, description: '20% off first order', minOrder: 25 },
    'WELCOME15': { code: 'WELCOME15', discount: 0.15, description: '15% off welcome offer', minOrder: 15 }
  };

  const [hasLoaded, setHasLoaded] = useState(false);
  const isInternalUpdateRef = React.useRef(false);

  const loadCartItems = () => {
    if (typeof window === 'undefined') return;
    
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Only set cart items if we actually have items
        if (parsedCart && parsedCart.length > 0) {
          isInternalUpdateRef.current = true;
          setCartItems(parsedCart);
        } else {
          isInternalUpdateRef.current = true;
          setCartItems([]);
        }
      } catch (error) {
        isInternalUpdateRef.current = true;
        setCartItems([]);
      }
    } else {
      isInternalUpdateRef.current = true;
      setCartItems([]);
    }
  };

  useEffect(() => {
    // Load cart items from localStorage
    loadCartItems();

    // Load applied promo
    const savedPromo = localStorage.getItem('appliedPromo');
    if (savedPromo) {
      try {
        setAppliedPromo(JSON.parse(savedPromo));
      } catch (error) {
        setAppliedPromo(null);
      }
    }

    setHasLoaded(true);

    // Listen for cart updates from other pages (but ignore our own updates)
    const handleCartUpdate = () => {
      // Only reload if the update came from another page (not from our own save)
      if (!isInternalUpdateRef.current) {
        loadCartItems();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Save cart to localStorage whenever it changes (but only after initial load and not during loading)
  useEffect(() => {
    if (!hasLoaded) return;
    
    // If this is an internal update (from loading), just save without dispatching event
    if (isInternalUpdateRef.current) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      isInternalUpdateRef.current = false;
      return;
    }

    // This is a user-initiated change, save and notify navbar
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    // Dispatch custom event to update navbar cart count
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'));
    }
  }, [cartItems, hasLoaded]);

  // Save promo to localStorage whenever it changes
  useEffect(() => {
    if (appliedPromo) {
      localStorage.setItem('appliedPromo', JSON.stringify(appliedPromo));
    } else {
      localStorage.removeItem('appliedPromo');
    }
  }, [appliedPromo]);

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
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
          setAppliedPromo(promo);
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
    setAppliedPromo(null);
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