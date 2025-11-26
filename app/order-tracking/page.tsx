"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar/navbar";
import OrderProgressTimeline from "@/components/order-tracking/order-progress-timeline";
import OrderSummaryCard from "@/components/order-tracking/order-summary-card";
import DeliveryTracking from "@/components/order-tracking/delivery-tracking";
import OrderDetails from "@/components/order-tracking/order-details";
import OrderActions from "@/components/order-tracking/order-actions";
import Icon from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { orderService } from "@/lib/firebase/orders";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  imageAlt: string;
  customizations: string[];
}

interface TimelineItem {
  status: string;
  timestamp: string | null;
  title: string;
  description: string;
  completed: boolean;
  active?: boolean;
}

interface DeliveryAddress {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  instructions?: string;
}

interface Driver {
  name: string;
  phone: string;
  photo: string;
  photoAlt: string;
  vehicleType: string;
  rating: number;
}

interface TrackingLocation {
  lat: number;
  lng: number;
  address: string;
}

interface Delivery {
  type: "delivery" | "pickup";
  address: DeliveryAddress;
  driver: Driver;
  trackingLocation: TrackingLocation;
}

interface Restaurant {
  name: string;
  address: string;
  phone: string;
}

interface PaymentMethod {
  type: string;
  lastFour: string;
  brand: string;
}

interface OrderData {
  id: string;
  status: string;
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery: string | null;
  total: number;
  items: OrderItem[];
  delivery: Delivery;
  restaurant: Restaurant;
  timeline: TimelineItem[];
  specialInstructions: string | null;
  paymentMethod: PaymentMethod;
}

const OrderTracking = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  // Fetch order data
  useEffect(() => {
    const fetchOrderData = async () => {
      let orderId = searchParams?.get("orderId");

      // Fallback to localStorage if no orderId in URL
      if (!orderId) {
        const savedOrderId = localStorage.getItem("lastOrderId");
        if (savedOrderId) {
          orderId = savedOrderId;
          // Update URL to include orderId without reloading
          const newUrl = `/order-tracking?orderId=${orderId}`;
          window.history.replaceState(
            { ...window.history.state, as: newUrl, url: newUrl },
            "",
            newUrl
          );
        }
      }

      if (!orderId) {
        setTrackingError("No order ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setTrackingError(null);

        const order = await orderService.getOrder(orderId);

        if (!order) {
          throw new Error("Order not found");
        }

        // Map Firestore order to component state structure
        const mappedOrder: OrderData = {
          id: order.id,
          status: order.status,
          orderDate: order.createdAt,
          // Estimate delivery 45 mins from creation
          estimatedDelivery: new Date(
            new Date(order.createdAt).getTime() + 45 * 60000
          ).toISOString(),
          actualDelivery: null,
          total: order.total,
          items: order.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            imageAlt: item.imageAlt,
            customizations: item.customizations,
          })),
          delivery: {
            type: "delivery",
            address: {
              street: order.deliveryAddress.street,
              city: order.deliveryAddress.city,
              state: order.deliveryAddress.state,
              zipCode: order.deliveryAddress.zipCode,
            },
            // Mock driver data as it's not in the order model yet
            driver: {
              name: "Alex Rodriguez",
              phone: "(555) 123-4567",
              photo:
                "https://images.unsplash.com/photo-1659353741091-e0274bb50905",
              photoAlt: "Delivery driver Alex Rodriguez",
              vehicleType: "Bike",
              rating: 4.9,
            },
            // Mock tracking location
            trackingLocation: {
              lat: 40.7128,
              lng: -74.006,
              address: "5th Avenue & 42nd St",
            },
          },
          restaurant: {
            name: "Foodies Restaurant",
            address: "456 Food Street, NY 10002",
            phone: "(555) 987-6543",
          },
          timeline: order.timeline || [],
          specialInstructions: null,
          paymentMethod: {
            type: order.paymentMethod?.type || "card",
            lastFour: order.paymentMethod?.lastFour || "4242",
            brand: "Visa",
          },
        };

        setOrderData(mappedOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load order details";
        setTrackingError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
    fetchOrderData();
  }, [searchParams]);

  // Simulate order progress
  useEffect(() => {
    if (!orderData || orderData.status === "completed") return;

    const statuses = [
      "order_confirmed",
      "preparing",
      "ready_for_pickup",
      "out_for_delivery",
      "completed",
    ];

    const currentStatusIndex = statuses.indexOf(orderData.status);
    if (currentStatusIndex === -1 || currentStatusIndex === statuses.length - 1)
      return;

    // Advance to next status after 5 seconds
    const timer = setTimeout(() => {
      const nextStatus = statuses[currentStatusIndex + 1];

      setOrderData((prev) => {
        if (!prev) return null;

        const now = new Date().toISOString();
        const updatedTimeline = prev.timeline.map((item) => {
          // Mark current/past steps as completed
          if (statuses.indexOf(item.status) <= currentStatusIndex) {
            return { ...item, completed: true, active: false };
          }
          // Mark next step as active
          if (item.status === nextStatus) {
            return { ...item, active: true, timestamp: now };
          }
          return item;
        });

        // If completed, mark the final step as completed too
        if (nextStatus === "completed") {
          const finalTimeline = updatedTimeline.map((item) =>
            item.status === "completed"
              ? { ...item, completed: true, active: false, timestamp: now }
              : item
          );
          return {
            ...prev,
            status: nextStatus,
            timeline: finalTimeline,
            actualDelivery: now,
          };
        }

        return {
          ...prev,
          status: nextStatus,
          timeline: updatedTimeline,
        };
      });
    }, 15000);

    return () => clearTimeout(timer);
  }, [orderData]);

  const handleContactSupport = () => {
    // In real app, this would open support chat or phone
    alert(
      "Opening support chat...\n\nSupport hours: 24/7\nPhone: (555) 123-HELP"
    );
  };

  const handleCallRestaurant = () => {
    window.open(`tel:${orderData?.restaurant?.phone}`, "_self");
  };

  const handleCallDriver = () => {
    if (orderData?.delivery?.driver?.phone) {
      window.open(`tel:${orderData?.delivery?.driver?.phone}`, "_self");
    }
  };

  const handleReorder = () => {
    // Add items back to cart and navigate to cart
    router.push("/shopping-cart?reorder=" + orderData?.id);
  };

  const handleOrderAgain = () => {
    router.push("/menu-catalog");
  };

  const isDeliveryInProgress = () => {
    return orderData?.status === "out_for_delivery";
  };

  const isOrderCompleted = () => {
    return orderData?.status === "completed";
  };

  const getEstimatedTimeRemaining = () => {
    if (!orderData?.estimatedDelivery) return null;

    const now = new Date();
    const estimated = new Date(orderData.estimatedDelivery);
    const diffMs = estimated?.getTime() - now?.getTime();

    if (diffMs <= 0) return "Any moment now!";

    const diffMins = Math.ceil(diffMs / (1000 * 60));
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""}`;
    }

    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    return `${diffHours}h ${remainingMins}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <main>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <h2 className="font-heading font-semibold text-lg text-foreground mb-2">
                  Loading Order Details...
                </h2>
                <p className="font-body text-muted-foreground">
                  Please wait while we fetch your order information
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (trackingError || !orderData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <main>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center min-h-[400px] flex items-center justify-center">
              <div className="bg-card rounded-xl shadow-warm border border-border p-8 max-w-md">
                <Icon
                  name="AlertCircle"
                  size={48}
                  className="text-destructive mx-auto mb-4"
                />
                <h2 className="font-heading font-semibold text-xl text-foreground mb-2">
                  Order Not Found
                </h2>
                <p className="font-body text-muted-foreground mb-6">
                  {trackingError ||
                    "We couldn't find the order you're looking for. Please check your order number and try again."}
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push("/user-account")}
                    variant="default"
                    iconName="User"
                    className="w-full"
                  >
                    View Order History
                  </Button>
                  <Button
                    onClick={handleContactSupport}
                    variant="outline"
                    iconName="MessageCircle"
                    className="w-full"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Icon name="Package" size={28} className="text-primary" />
                <div>
                  <h1 className="font-heading font-bold text-3xl text-foreground">
                    Order Tracking
                  </h1>
                  <p className="font-body text-muted-foreground">
                    Track your order in real-time
                  </p>
                </div>
              </div>

              {/* Estimated Time */}
              {!isOrderCompleted() && (
                <div className="bg-card rounded-lg border border-border p-4 text-center min-w-[140px]">
                  <p className="font-caption text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Estimated Time
                  </p>
                  <p className="font-heading font-bold text-lg text-primary">
                    {getEstimatedTimeRemaining()}
                  </p>
                </div>
              )}
            </div>

            {/* Order ID and Status */}
            <div className="flex items-center justify-between bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-body font-medium text-foreground">
                    Order {orderData?.id}
                  </p>
                  <p className="font-caption text-sm text-muted-foreground">
                    Placed{" "}
                    {new Date(orderData?.orderDate)?.toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-body font-medium text-foreground">
                  Total: ${orderData?.total?.toFixed(2)}
                </p>
                <p className="font-caption text-sm text-muted-foreground">
                  {orderData?.paymentMethod?.brand} ••••{" "}
                  {orderData?.paymentMethod?.lastFour}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Progress Timeline */}
            <OrderProgressTimeline
              timeline={orderData?.timeline}
              currentStatus={orderData?.status}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Order Summary */}
                <OrderSummaryCard
                  items={orderData?.items}
                  total={orderData?.total}
                  specialInstructions={orderData?.specialInstructions}
                />

                {/* Order Details */}
                <OrderDetails
                  orderData={orderData}
                  onCallRestaurant={handleCallRestaurant}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Delivery Tracking */}
                {isDeliveryInProgress() && (
                  <DeliveryTracking
                    driver={orderData?.delivery?.driver}
                    trackingLocation={orderData?.delivery?.trackingLocation}
                    deliveryAddress={orderData?.delivery?.address}
                    onCallDriver={handleCallDriver}
                  />
                )}

                {/* Order Actions */}
                <OrderActions
                  orderStatus={orderData?.status}
                  onContactSupport={handleContactSupport}
                  onReorder={handleReorder}
                  onOrderAgain={handleOrderAgain}
                  onCallDriver={
                    isDeliveryInProgress() ? handleCallDriver : null
                  }
                />
              </div>
            </div>

            {/* Completed Order Message */}
            {isOrderCompleted() && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6 text-center">
                <Icon
                  name="CheckCircle"
                  size={48}
                  className="text-green-600 dark:text-green-400 mx-auto mb-4"
                />
                <h3 className="font-heading font-bold text-xl text-green-900 dark:text-green-100 mb-2">
                  Order Delivered Successfully! 🎉
                </h3>
                <p className="font-body text-green-700 dark:text-green-300 mb-4">
                  We hope you enjoyed your meal! Thank you for choosing Foodies
                  Restaurant.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={handleReorder}
                    variant="default"
                    iconName="RotateCcw"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Reorder
                  </Button>
                  <Button
                    onClick={() => router.push("/menu-catalog")}
                    variant="outline"
                    iconName="Star"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    Rate Order
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
