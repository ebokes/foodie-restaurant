"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';
import OrderProgressTimeline from '@/components/order-tracking/order-progress-timeline';
import OrderSummaryCard from '@/components/order-tracking/order-summary-card';
import DeliveryTracking from '@/components/order-tracking/delivery-tracking';
import OrderDetails from '@/components/order-tracking/order-details';
import OrderActions from '@/components/order-tracking/order-actions';
import Icon from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';

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
  type: 'delivery' | 'pickup';
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

interface User {
  id?: number;
  name?: string;
  email?: string;
}

const OrderTracking = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  // Mock user data - in real app this would come from auth context
  useEffect(() => {
    // Simulate checking for logged in user
    const mockUser = localStorage.getItem('currentUser');
    if (mockUser) {
      setUser(JSON.parse(mockUser));
    }

    // Simulate cart count from localStorage
    const mockCartCount = localStorage.getItem('cartCount');
    if (mockCartCount) {
      setCartCount(parseInt(mockCartCount, 10));
    }
  }, []);

  // Mock order data - in real app would fetch from API using order ID
  const mockOrderData: OrderData = {
    id: searchParams?.get('orderId') || '#ORD-2024-001',
    status: 'preparing', // order_confirmed, preparing, ready_pickup, out_for_delivery, completed
    orderDate: '2025-01-15T12:30:00Z',
    estimatedDelivery: '2025-01-15T13:15:00Z',
    actualDelivery: null,
    total: 34.97,
    items: [
    {
      id: 1,
      name: "Classic Beef Burger",
      price: 12.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1585508718415-6d83666de492",
      imageAlt: "Juicy beef burger with lettuce, tomato, and cheese on sesame bun",
      customizations: ["Extra cheese", "No onions"]
    },
    {
      id: 2,
      name: "Truffle Fries",
      price: 8.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1630431343596-dadee2180ba1",
      imageAlt: "Golden crispy fries with truffle oil and parmesan cheese",
      customizations: ["Large size"]
    }],

    delivery: {
      type: 'delivery', // delivery or pickup
      address: {
        street: '123 Main Street',
        apartment: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        instructions: 'Ring doorbell twice. Leave at door if no answer.'
      },
      driver: {
        name: 'Alex Rodriguez',
        phone: '(555) 123-4567',
        photo: "https://images.unsplash.com/photo-1659353741091-e0274bb50905",
        photoAlt: 'Delivery driver Alex Rodriguez smiling while holding food order',
        vehicleType: 'Bike',
        rating: 4.9
      },
      trackingLocation: {
        lat: 40.7128,
        lng: -74.0060,
        address: '5th Avenue & 42nd St'
      }
    },
    restaurant: {
      name: 'Foodies Restaurant',
      address: '456 Food Street, NY 10002',
      phone: '(555) 987-6543'
    },
    timeline: [
    {
      status: 'order_confirmed',
      timestamp: '2025-01-15T12:30:00Z',
      title: 'Order Confirmed',
      description: 'Your order has been received and confirmed',
      completed: true
    },
    {
      status: 'preparing',
      timestamp: '2025-01-15T12:35:00Z',
      title: 'Preparing Your Order',
      description: 'Our chefs are preparing your delicious meal',
      completed: true,
      active: true
    },
    {
      status: 'ready_pickup',
      timestamp: null,
      title: 'Ready for Pickup',
      description: 'Order is ready and waiting for driver pickup',
      completed: false
    },
    {
      status: 'out_for_delivery',
      timestamp: null,
      title: 'Out for Delivery',
      description: 'Your order is on its way to you',
      completed: false
    },
    {
      status: 'completed',
      timestamp: null,
      title: 'Delivered',
      description: 'Your order has been delivered. Enjoy your meal!',
      completed: false
    }],

    specialInstructions: 'Medium rare patty. Extra napkins please.',
    paymentMethod: {
      type: 'card',
      lastFour: '4242',
      brand: 'Visa'
    }
  };

  useEffect(() => {
    // Simulate API call to fetch order data
    const fetchOrderData = async () => {
      try {
        setIsLoading(true);
        setTrackingError(null);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulate potential error (5% chance)
        if (Math.random() < 0.05) {
          throw new Error('Order not found');
        }

        setOrderData(mockOrderData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load order details';
        setTrackingError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [searchParams]);

  const handleContactSupport = () => {
    // In real app, this would open support chat or phone
    alert('Opening support chat...\n\nSupport hours: 24/7\nPhone: (555) 123-HELP');
  };

  const handleCallRestaurant = () => {
    window.open(`tel:${orderData?.restaurant?.phone}`, '_self');
  };

  const handleCallDriver = () => {
    if (orderData?.delivery?.driver?.phone) {
      window.open(`tel:${orderData?.delivery?.driver?.phone}`, '_self');
    }
  };

  const handleReorder = () => {
    // Add items back to cart and navigate to cart
    router.push('/shopping-cart?reorder=' + orderData?.id);
  };

  const handleOrderAgain = () => {
    router.push('/menu-catalog');
  };

  const handleCartClick = () => {
    router.push('/shopping-cart');
  };

  const handleAccountClick = (action: string) => {
    switch (action) {
      case 'login': router.push('/sign-in');
        break;
      case 'register': router.push('/sign-up');
        break;
      case 'account': router.push('/user-account');
        break;
      case 'logout': localStorage.removeItem('currentUser');
        setUser(null);
        break;
      default:
        break;
    }
  };

  const handleSearch = (searchTerm: string) => {
    router.push(`/menu-catalog?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const isDeliveryInProgress = () => {
    return orderData?.status === 'out_for_delivery';
  };

  const isOrderCompleted = () => {
    return orderData?.status === 'completed';
  };

  const getEstimatedTimeRemaining = () => {
    if (!orderData?.estimatedDelivery) return null;

    const now = new Date();
    const estimated = new Date(orderData.estimatedDelivery);
    const diffMs = estimated?.getTime() - now?.getTime();

    if (diffMs <= 0) return 'Any moment now!';

    const diffMins = Math.ceil(diffMs / (1000 * 60));
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
    }

    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    return `${diffHours}h ${remainingMins}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar
          cartCount={cartCount}
          user={user}
          onCartClick={handleCartClick}
          onAccountClick={handleAccountClick}
          onSearch={handleSearch}
          onLogout={handleLogout}
        />

        
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
      </div>);

  }

  if (trackingError || !orderData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar
          cartCount={cartCount}
          user={user}
          onCartClick={handleCartClick}
          onAccountClick={handleAccountClick}
          onSearch={handleSearch}
          onLogout={handleLogout}
        />

        
        <main>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center min-h-[400px] flex items-center justify-center">
              <div className="bg-card rounded-xl shadow-warm border border-border p-8 max-w-md">
                <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
                <h2 className="font-heading font-semibold text-xl text-foreground mb-2">
                  Order Not Found
                </h2>
                <p className="font-body text-muted-foreground mb-6">
                  {trackingError || 'We couldn\'t find the order you\'re looking for. Please check your order number and try again.'}
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push('/user-account')}
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
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        cartCount={cartCount}
        user={user}
        onCartClick={handleCartClick}
        onAccountClick={handleAccountClick}
        onSearch={handleSearch}
        onLogout={handleLogout}
      />

      <main className='pt-16'>
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
              {!isOrderCompleted() &&
              <div className="bg-card rounded-lg border border-border p-4 text-center min-w-[140px]">
                  <p className="font-caption text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Estimated Time
                  </p>
                  <p className="font-heading font-bold text-lg text-primary">
                    {getEstimatedTimeRemaining()}
                  </p>
                </div>
              }
            </div>

            {/* Order ID and Status */}
            <div className="flex items-center justify-between bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-body font-medium text-foreground">
                    Order {orderData?.id}
                  </p>
                  <p className="font-caption text-sm text-muted-foreground">
                    Placed {new Date(orderData?.orderDate)?.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-body font-medium text-foreground">
                  Total: ${orderData?.total?.toFixed(2)}
                </p>
                <p className="font-caption text-sm text-muted-foreground">
                  {orderData?.paymentMethod?.brand} •••• {orderData?.paymentMethod?.lastFour}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Progress Timeline */}
            <OrderProgressTimeline
              timeline={orderData?.timeline}
              currentStatus={orderData?.status} />


            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Order Summary */}
                <OrderSummaryCard
                  items={orderData?.items}
                  total={orderData?.total}
                  specialInstructions={orderData?.specialInstructions} />


                {/* Order Details */}
                <OrderDetails
                  orderData={orderData}
                  onCallRestaurant={handleCallRestaurant} />

              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Delivery Tracking */}
                {isDeliveryInProgress() &&
                <DeliveryTracking
                  driver={orderData?.delivery?.driver}
                  trackingLocation={orderData?.delivery?.trackingLocation}
                  deliveryAddress={orderData?.delivery?.address}
                  onCallDriver={handleCallDriver} />

                }

                {/* Order Actions */}
                <OrderActions
                  orderStatus={orderData?.status}
                  onContactSupport={handleContactSupport}
                  onReorder={handleReorder}
                  onOrderAgain={handleOrderAgain}
                  onCallDriver={isDeliveryInProgress() ? handleCallDriver : null} />

              </div>
            </div>

            {/* Completed Order Message */}
            {isOrderCompleted() &&
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6 text-center">
                <Icon name="CheckCircle" size={48} className="text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="font-heading font-bold text-xl text-green-900 dark:text-green-100 mb-2">
                  Order Delivered Successfully! 🎉
                </h3>
                <p className="font-body text-green-700 dark:text-green-300 mb-4">
                  We hope you enjoyed your meal! Thank you for choosing Foodies Restaurant.
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
                  onClick={() => router.push('/menu-catalog')}
                  variant="outline"
                  iconName="Star"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    Rate Order
                  </Button>
                </div>
              </div>
            }
          </div>
        </div>
      </main>
    </div>);

};

export default OrderTracking;