"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';
import ProfileSection from '@/components/user-account/profile-section';
import AddressSection from '@/components/user-account/address-section';
import OrderHistorySection from '@/components/user-account/order-history-section';
import PreferencesSection from '@/components/user-account/preferences-section';
import SecuritySection from '@/components/user-account/security-section';
import PaymentMethodsSection from '@/components/user-account/payment-methods-section';
import Icon, { type IconProps } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  joinDate: string;
  totalOrders: number;
  favoriteItems: number;
}

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  imageAlt: string;
  customizations: string[];
}

interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
}

interface FavoriteItem {
  id: string;
  name: string;
  category: string;
  image: string;
  imageAlt: string;
}

interface Preferences {
  dietary: string[];
  spiceLevel: string;
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    newMenuItems: boolean;
    emailNewsletter: boolean;
    smsNotifications: boolean;
  };
  favoriteItems: FavoriteItem[];
}

interface BillingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  lastFour: string;
  expiryDate: string;
  cardholderName: string;
  isDefault: boolean;
  billingAddress: BillingAddress;
}

interface Tab {
  id: string;
  label: string;
  icon: IconProps['name'];
}

const UserAccount = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [user, setUser] = useState<User>({
    id: "user_001",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1990-05-15",
    joinDate: "2023-03-15",
    totalOrders: 24,
    favoriteItems: 8
  });

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "addr_001",
      label: "Home",
      street: "123 Oak Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      isDefault: true
    },
    {
      id: "addr_002",
      label: "Work",
      street: "456 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      isDefault: false
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD001",
      date: "2024-10-12T18:30:00Z",
      status: "Delivered",
      total: 28.95,
      subtotal: 24.95,
      deliveryFee: 2.50,
      tax: 1.50,
      items: [
        {
          id: "item_001",
          name: "Classic Burger",
          quantity: 1,
          price: 12.95,
          image: "https://images.unsplash.com/photo-1585508718415-6d83666de492",
          imageAlt: "Juicy beef burger with lettuce, tomato, and cheese on sesame bun",
          customizations: ["No onions", "Extra cheese"]
        },
        {
          id: "item_002",
          name: "Truffle Fries",
          quantity: 1,
          price: 8.95,
          image: "https://images.unsplash.com/photo-1630431343596-dadee2180ba1",
          imageAlt: "Golden crispy french fries topped with truffle oil and parmesan",
          customizations: []
        },
        {
          id: "item_003",
          name: "Chocolate Milkshake",
          quantity: 1,
          price: 5.95,
          image: "https://images.unsplash.com/photo-1660715683649-e381e56eb07a",
          imageAlt: "Rich chocolate milkshake topped with whipped cream and chocolate chips",
          customizations: ["Extra whipped cream"]
        }
      ],
      deliveryAddress: {
        street: "123 Oak Street",
        city: "New York",
        state: "NY",
        zipCode: "10001"
      }
    },
    {
      id: "ORD002",
      date: "2024-10-10T19:15:00Z",
      status: "Delivered",
      total: 22.45,
      subtotal: 18.95,
      deliveryFee: 2.50,
      tax: 1.00,
      items: [
        {
          id: "item_004",
          name: "Margherita Pizza",
          quantity: 1,
          price: 14.95,
          image: "https://images.unsplash.com/photo-1703784022146-b72677752ce5",
          imageAlt: "Traditional margherita pizza with fresh mozzarella, basil, and tomato sauce",
          customizations: ["Thin crust"]
        },
        {
          id: "item_005",
          name: "Caesar Salad",
          quantity: 1,
          price: 8.95,
          image: "https://images.unsplash.com/photo-1598268013060-1f5baade2fc0",
          imageAlt: "Fresh caesar salad with romaine lettuce, croutons, and parmesan cheese",
          customizations: ["Extra dressing"]
        }
      ],
      deliveryAddress: {
        street: "456 Business Ave",
        city: "New York",
        state: "NY",
        zipCode: "10002"
      }
    },
    {
      id: "ORD003",
      date: "2024-10-08T12:45:00Z",
      status: "Preparing",
      total: 35.50,
      subtotal: 31.50,
      deliveryFee: 2.50,
      tax: 1.50,
      items: [
        {
          id: "item_006",
          name: "Grilled Salmon",
          quantity: 1,
          price: 18.95,
          image: "https://images.unsplash.com/photo-1589898489661-fe21552ad67c",
          imageAlt: "Perfectly grilled salmon fillet with herbs and lemon on white plate",
          customizations: ["Medium-well", "Lemon butter sauce"]
        },
        {
          id: "item_007",
          name: "Garlic Bread",
          quantity: 2,
          price: 6.95,
          image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536",
          imageAlt: "Toasted garlic bread slices with herbs and melted butter",
          customizations: ["Extra garlic"]
        }
      ],
      deliveryAddress: {
        street: "123 Oak Street",
        city: "New York",
        state: "NY",
        zipCode: "10001"
      }
    }
  ]);

  const [preferences, setPreferences] = useState<Preferences>({
    dietary: ["vegetarian"],
    spiceLevel: "medium",
    notifications: {
      orderUpdates: true,
      promotions: true,
      newMenuItems: false,
      emailNewsletter: true,
      smsNotifications: false
    },
    favoriteItems: [
      {
        id: "fav_001",
        name: "Classic Burger",
        category: "Burgers",
        image: "https://images.unsplash.com/photo-1585508718415-6d83666de492",
        imageAlt: "Juicy beef burger with lettuce, tomato, and cheese on sesame bun"
      },
      {
        id: "fav_002",
        name: "Truffle Fries",
        category: "Sides",
        image: "https://images.unsplash.com/photo-1630431343596-dadee2180ba1",
        imageAlt: "Golden crispy french fries topped with truffle oil and parmesan"
      }
    ]
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_001",
      type: "Visa",
      lastFour: "4242",
      expiryDate: "12/26",
      cardholderName: "Sarah Johnson",
      isDefault: true,
      billingAddress: {
        street: "123 Oak Street",
        city: "New York",
        state: "NY",
        zipCode: "10001"
      }
    },
    {
      id: "pm_002",
      type: "Mastercard",
      lastFour: "8888",
      expiryDate: "08/25",
      cardholderName: "Sarah Johnson",
      isDefault: false,
      billingAddress: {
        street: "123 Oak Street",
        city: "New York",
        state: "NY",
        zipCode: "10001"
      }
    }
  ]);

  const tabs: Tab[] = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'addresses', label: 'Addresses', icon: 'MapPin' },
    { id: 'orders', label: 'Order History', icon: 'Package' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' },
    { id: 'payment', label: 'Payment', icon: 'CreditCard' },
    { id: 'security', label: 'Security', icon: 'Shield' }
  ];

  // Check authentication on component mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/sign-in');
    }
  }, [router]);

  // Profile handlers
  const handleUpdateProfile = (updatedData: Partial<User>): void => {
    setUser((prev) => ({ ...prev, ...updatedData }));
    console.log('Profile updated:', updatedData);
  };

  // Address handlers
  const handleAddAddress = (newAddress: Omit<Address, 'id'>): void => {
    const address: Address = {
      ...newAddress,
      id: `addr_${Date.now()}`
    };

    // If this is set as default, remove default from others
    if (address.isDefault) {
      setAddresses((prev) => prev.map((addr) => ({ ...addr, isDefault: false })));
    }

    setAddresses((prev) => [...prev, address]);
  };

  const handleUpdateAddress = (addressId: string, updatedData: Partial<Address>): void => {
    setAddresses((prev) => prev.map((addr) =>
      addr.id === addressId
        ? { ...addr, ...updatedData }
        : updatedData.isDefault ? { ...addr, isDefault: false } : addr
    ));
  };

  const handleDeleteAddress = (addressId: string): void => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
  };

  // Order handlers
  const handleReorder = (order: Order): void => {
    console.log('Reordering:', order);
    router.push('/shopping-cart');
  };

  const handleViewOrderDetails = (order: Order): void => {
    console.log('Viewing order details:', order);
  };

  // Preferences handlers
  const handleUpdatePreferences = (updatedPreferences: Preferences): void => {
    setPreferences(updatedPreferences);
    console.log('Preferences updated:', updatedPreferences);
  };

  // Payment handlers
  const handleAddPaymentMethod = (newPaymentMethod: Omit<PaymentMethod, 'id'>): void => {
    // If this is set as default, remove default from others
    if (newPaymentMethod.isDefault) {
      setPaymentMethods((prev) => prev.map((pm) => ({ ...pm, isDefault: false })));
    }

    const paymentMethod: PaymentMethod = {
      ...newPaymentMethod,
      id: `pm_${Date.now()}`
    };

    setPaymentMethods((prev) => [...prev, paymentMethod]);
  };

  const handleDeletePaymentMethod = (paymentMethodId: string): void => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== paymentMethodId));
  };

  const handleSetDefaultPaymentMethod = (paymentMethodId: string): void => {
    setPaymentMethods((prev) => prev.map((pm) => ({
      ...pm,
      isDefault: pm.id === paymentMethodId
    })));
  };

  // Security handlers
  const handleUpdatePassword = (passwordData: { currentPassword: string; newPassword: string; confirmPassword: string }): void => {
    console.log('Password update requested:', passwordData);
  };

  const handleUpdateSecurity = (securitySettings: { twoFactorEnabled: boolean; loginNotifications: boolean; sessionTimeout: string }): void => {
    console.log('Security settings updated:', securitySettings);
  };

  // Header handlers
  const handleLogout = (): void => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    router.push('/sign-in');
  };

  const handleAccountClick = (action: string): void => {
    if (action === 'logout') handleLogout();
  };

  const renderTabContent = (): React.ReactNode => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileSection
            user={user}
            onUpdateProfile={handleUpdateProfile}
          />
        );

      case 'addresses':
        return (
          <AddressSection
            addresses={addresses}
            onAddAddress={handleAddAddress}
            onUpdateAddress={handleUpdateAddress}
            onDeleteAddress={handleDeleteAddress}
          />
        );

      case 'orders':
        return (
          <OrderHistorySection
            orders={orders}
            onReorder={handleReorder}
            onViewDetails={handleViewOrderDetails}
          />
        );

      case 'preferences':
        return (
          <PreferencesSection
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
          />
        );

      case 'payment':
        return (
          <PaymentMethodsSection
            paymentMethods={paymentMethods}
            onAddPaymentMethod={handleAddPaymentMethod}
            onDeletePaymentMethod={handleDeletePaymentMethod}
            onSetDefaultPaymentMethod={handleSetDefaultPaymentMethod}
          />
        );

      case 'security':
        return (
          <SecuritySection
            onUpdatePassword={handleUpdatePassword}
            onUpdateSecurity={handleUpdateSecurity}
          />
        );

      default:
        return null;
    }
  };

  const navbarUser = user ? {
    id: parseInt(user.id.replace(/\D/g, '')) || undefined,
    name: user.name,
    email: user.email
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={navbarUser}
        onLogout={handleLogout}
        onCartClick={() => router.push('/shopping-cart')}
        onSearch={() => {}}
        onAccountClick={handleAccountClick}
      />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-linear-to-br from-primary-solid via-grad1 to-grad2 rounded-full flex items-center justify-center">
                <Icon name="User" size={32} color="white" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">My Account</h1>
                <p className="text-lg font-body text-muted-foreground">
                  Welcome back, {user.name}
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Package" size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-foreground">{user.totalOrders}</p>
                    <p className="text-sm font-body text-muted-foreground">Total Orders</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="Heart" size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-foreground">{user.favoriteItems}</p>
                    <p className="text-sm font-body text-muted-foreground">Favorite Items</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="Calendar" size={20} className="text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-foreground">
                      {new Date(user.joinDate).getFullYear()}
                    </p>
                    <p className="text-sm font-body text-muted-foreground">Member Since</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border shadow-warm p-4 sticky top-24">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-body font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-linear-to-br from-primary-solid via-grad1 to-grad2 text-primary-foreground shadow-warm-sm'
                          : 'text-foreground hover:bg-muted hover:text-primary'
                      }`}
                    >
                      <Icon name={tab.icon} size={20} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
                
                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-body font-medium text-muted-foreground mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="UtensilsCrossed"
                      className="w-full"
                      onClick={() => router.push('/menu-catalog')}
                    >
                      Browse Menu
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ShoppingCart"
                      className="w-full"
                      onClick={() => router.push('/shopping-cart')}
                    >
                      View Cart
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Home"
                      className="w-full"
                      onClick={() => router.push('/')}
                    >
                      Go Home
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
