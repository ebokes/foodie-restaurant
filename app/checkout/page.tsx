"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { clearCart, clearCartFirebase } from "@/lib/store/slices/cartSlice";
import { orderService } from "@/lib/firebase/orders";
import { auth } from "@/lib/firebase/config";
import Icon from "@/components/ui/app-icon";

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, appliedPromo } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    instructions: "",
  });

  // Redirect if cart is empty or user not logged in
  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/login?redirect=/checkout");
    } else if (items.length === 0) {
      router.push("/shopping-cart");
    }
  }, [items.length, router]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.08;
  const deliveryFee = discountedSubtotal >= 30 ? 0 : 3.99;
  const total = discountedSubtotal + tax + deliveryFee;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    formData.street.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.state.trim() !== "" &&
    formData.zipCode.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    if (!isFormValid) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        userId: auth.currentUser.uid,
        items,
        total,
        subtotal,
        tax,
        deliveryFee,
        discount: discountAmount,
        status: "order_confirmed",
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        paymentMethod: {
          type: "card",
          lastFour: "4242", // Mock payment
        },
      };

      const orderId = await orderService.createOrder(orderData);

      // Save order ID to localStorage for persistence
      localStorage.setItem("lastOrderId", orderId);

      // Clear cart and redirect
      if (auth.currentUser) {
        dispatch(clearCartFirebase(auth.currentUser.uid));
      } else {
        dispatch(clearCart());
      }

      router.push(`/order-tracking?orderId=${orderId}`);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to process order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Checkout
          </h1>
          <p className="text-muted-foreground">Complete your order details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Delivery Form */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h2 className="font-heading font-semibold text-xl mb-4 flex items-center gap-2">
                <Icon name="MapPin" className="text-primary" />
                Delivery Address
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Street Address
                  </label>
                  <input
                    required
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border border-input bg-background"
                    placeholder="123 Foodie Lane"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <input
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-md border border-input bg-background"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      State
                    </label>
                    <input
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-md border border-input bg-background"
                      placeholder="NY"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    ZIP Code
                  </label>
                  <input
                    required
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border border-input bg-background"
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border border-input bg-background h-24 resize-none"
                    placeholder="Gate code, leave at door, etc."
                  />
                </div>
              </form>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h2 className="font-heading font-semibold text-xl mb-4 flex items-center gap-2">
                <Icon name="CreditCard" className="text-primary" />
                Payment Method
              </h2>
              <div className="p-4 border border-input rounded-lg bg-muted/50 flex items-center gap-3">
                <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <span className="font-mono">•••• 4242</span>
                <span className="ml-auto text-sm text-muted-foreground">
                  Expires 12/28
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                * This is a demo payment method. No real charge will be made.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm sticky top-24">
              <h2 className="font-heading font-semibold text-xl mb-4">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium line-clamp-1">
                          {item.name}
                        </h3>
                        <span className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border mt-2">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading || !isFormValid}
                className="w-full mt-6 text-lg py-6"
              >
                {isLoading ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
