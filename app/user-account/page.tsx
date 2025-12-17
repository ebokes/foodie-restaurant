"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/navbar/navbar";
import ProfileSection from "@/components/user-account/profile-section";
import AddressSection from "@/components/user-account/address-section";
import OrderHistorySection from "@/components/user-account/order-history-section";
import PreferencesSection from "@/components/user-account/preferences-section";
import SecuritySection from "@/components/user-account/security-section";
import PaymentMethodsSection from "@/components/user-account/payment-methods-section";
import Icon, { type IconProps } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import FavoritesSection from "@/components/user-account/favorites-section";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  updateUser,
  signOutUser,
  toggleFavoriteItem,
  FavoriteItem,
} from "@/lib/store/slices/authSlice";
import { addCartItem, addItem } from "@/lib/store/slices/cartSlice";
import { MenuItem } from "@/types/menu-catalog";
import { auth, db } from "@/lib/firebase/config";
import { orderService } from "@/lib/firebase/orders";
import { userService } from "@/lib/firebase/user";
import { doc, setDoc } from "firebase/firestore";
import { menuService } from "@/lib/firebase/menu";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  joinDate: string;
  totalOrders: number;
  favoriteItems: number;
  avatar?: string;
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
  icon: IconProps["name"];
}

const UserAccount = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState<string>("profile");

  // Initialize user from Redux
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [preferences, setPreferences] = useState<Preferences>({
    dietary: [],
    spiceLevel: "medium",
    notifications: {
      orderUpdates: true,
      promotions: true,
      newMenuItems: false,
      emailNewsletter: false,
      smsNotifications: false,
    },
    favoriteItems: [],
  });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs: Tab[] = [
    { id: "profile", label: "Profile", icon: "User" },
    { id: "addresses", label: "Addresses", icon: "MapPin" },
    { id: "orders", label: "Order History", icon: "Package" },
    { id: "favorites", label: "Favorites", icon: "Heart" },
    { id: "preferences", label: "Preferences", icon: "Settings" },
    { id: "payment", label: "Payment", icon: "CreditCard" },
    { id: "security", label: "Security", icon: "Shield" },
  ];

  // Check authentication and load user data
  useEffect(() => {
    if (!reduxUser) {
      router.push("/sign-in");
      return;
    }

    const loadUserData = async () => {
      if (!auth.currentUser) {
        router.push("/sign-in");
        return;
      }

      setIsLoading(true);
      const userId = auth.currentUser.uid;

      try {
        // Load user profile
        setUser({
          id: String(reduxUser.id || userId),
          name: reduxUser.name || "",
          email: reduxUser.email || "",
          phone: reduxUser.phone || "",
          dateOfBirth: reduxUser.dateOfBirth || "",
          joinDate: reduxUser.joinDate || new Date().toISOString(),
          totalOrders: 0, // Will be calculated from orders
          favoriteItems: 0, // Will be calculated from preferences
          avatar: reduxUser.avatar,
        });

        // Load addresses
        const userAddresses = await userService.getAddresses(userId);
        setAddresses(userAddresses);

        // Load orders
        const userOrders = await orderService.getUserOrders(userId);
        // Convert Order format to local Order format
        const convertedOrders: Order[] = userOrders.map((order) => ({
          id: order.id,
          date: order.createdAt,
          status: order.status,
          total: order.total,
          subtotal: order.subtotal,
          deliveryFee: order.deliveryFee,
          tax: order.tax,
          items: order.items.map((item) => ({
            id: String(item.id),
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
            imageAlt: item.imageAlt,
            customizations: item.customizations,
          })),
          deliveryAddress: order.deliveryAddress,
        }));
        setOrders(convertedOrders);

        // Update totalOrders
        setUser((prev) =>
          prev ? { ...prev, totalOrders: convertedOrders.length } : null
        );

        // Load preferences and sync with live menu data
        const [userPrefs, menuItems] = await Promise.all([
          userService.getPreferences(userId),
          menuService.getMenuItems(),
        ]);

        const hydratedFavorites = (userPrefs.favoriteItems || []).map(
          (favItem) => {
            const liveItem = menuItems.find((m) => String(m.id) === favItem.id);
            if (liveItem) {
              return {
                id: favItem.id,
                name: liveItem.name,
                category: liveItem.category,
                image: liveItem.image,
                imageAlt: liveItem.imageAlt,
                price: liveItem.price,
                description: liveItem.description,
                originalPrice: liveItem.originalPrice,
                subtitle: liveItem.subtitle,
                dietary: liveItem.dietary,
                tags: liveItem.tags,
                rating: liveItem.rating,
                reviewCount: liveItem.reviewCount,
                prepTime: liveItem.prepTime,
              };
            }
            // Fallback to stored data if item removed from menu or not found
            return {
              id: favItem.id,
              name: favItem.name,
              category: favItem.category,
              image: favItem.image,
              imageAlt: favItem.imageAlt,
              price: favItem.price || 0,
              description: favItem.description || "",
              originalPrice: favItem.originalPrice,
              subtitle: favItem.subtitle,
              dietary: favItem.dietary,
              tags: favItem.tags,
              rating: favItem.rating,
              reviewCount: favItem.reviewCount,
              prepTime: favItem.prepTime,
            };
          }
        );

        setPreferences({
          dietary: userPrefs.dietary || [],
          spiceLevel: userPrefs.spiceLevel || "medium",
          notifications: {
            orderUpdates: userPrefs.notifications?.orderUpdates ?? true,
            promotions: userPrefs.notifications?.promotions ?? true,
            newMenuItems: userPrefs.notifications?.newMenuItems ?? false,
            emailNewsletter: userPrefs.notifications?.emailNewsletter ?? false,
            smsNotifications:
              userPrefs.notifications?.smsNotifications ?? false,
          },
          favoriteItems: hydratedFavorites,
        });

        // Update favoriteItems count
        setUser((prev) =>
          prev
            ? {
                ...prev,
                favoriteItems: userPrefs.favoriteItems?.length || 0,
              }
            : null
        );

        // Load payment methods
        const userPaymentMethods = await userService.getPaymentMethods(userId);
        setPaymentMethods(userPaymentMethods);
      } catch (error) {
        toast.error("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [router, reduxUser]);

  // Profile handlers
  const handleUpdateProfile = async (
    updatedData: Partial<User>
  ): Promise<void> => {
    if (!auth.currentUser) return;

    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));

    // Update Firestore
    try {
      const userId = auth.currentUser.uid;
      await setDoc(
        doc(db, "users", userId),
        {
          ...updatedData,
          id: user?.id || userId,
        },
        { merge: true }
      );

      // Update Redux store
      dispatch(updateUser(updatedData));
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  // Address handlers
  const handleAddAddress = async (
    newAddress: Omit<Address, "id">
  ): Promise<void> => {
    if (!auth.currentUser) return;

    const address: Address = {
      ...newAddress,
      id: `addr_${Date.now()}`,
    };

    // If this is set as default, remove default from others
    if (address.isDefault) {
      setAddresses((prev) =>
        prev.map((addr) => ({ ...addr, isDefault: false }))
      );
    }

    const updatedAddresses = [...addresses, address];
    setAddresses(updatedAddresses);

    // Save to Firebase
    try {
      await userService.updateAddresses(auth.currentUser.uid, updatedAddresses);
      dispatch(updateUser({ addresses: updatedAddresses }));
    } catch (error) {
      toast.error("Failed to save address");
      // Revert on error
      setAddresses(addresses);
    }
  };

  const handleUpdateAddress = async (
    addressId: string,
    updatedData: Partial<Address>
  ): Promise<void> => {
    if (!auth.currentUser) return;

    const updatedAddresses = addresses.map((addr) =>
      addr.id === addressId
        ? { ...addr, ...updatedData }
        : updatedData.isDefault
        ? { ...addr, isDefault: false }
        : addr
    );
    setAddresses(updatedAddresses);

    // Save to Firebase
    try {
      await userService.updateAddresses(auth.currentUser.uid, updatedAddresses);
      dispatch(updateUser({ addresses: updatedAddresses }));
    } catch (error) {
      toast.error("Failed to update address");
      setAddresses(addresses);
    }
  };

  const handleDeleteAddress = async (addressId: string): Promise<void> => {
    if (!auth.currentUser) return;

    const updatedAddresses = addresses.filter((addr) => addr.id !== addressId);
    setAddresses(updatedAddresses);

    // Save to Firebase
    try {
      await userService.updateAddresses(auth.currentUser.uid, updatedAddresses);
      dispatch(updateUser({ addresses: updatedAddresses }));
    } catch (error) {
      toast.error("Failed to delete address");
      setAddresses(addresses);
    }
  };

  // Order handlers
  const handleReorder = (order: Order): void => {
    router.push("/shopping-cart");
  };

  const handleViewOrderDetails = (order: Order): void => {
    router.push(`/order-tracking?id=${order.id}`);
  };

  // Preferences handlers
  const handleUpdatePreferences = async (
    updatedPreferences: Omit<Preferences, "favoriteItems">
  ): Promise<void> => {
    if (!auth.currentUser) return;

    // Merge with existing preferences to ensure we don't lose data (like favorites) if child sends partial update
    const newPreferences: Preferences = {
      ...preferences,
      ...updatedPreferences,
      favoriteItems: preferences.favoriteItems, // Explicitly preserve favorites
    };
    setPreferences(newPreferences);

    // Save to Firebase
    try {
      if (auth.currentUser) {
        await userService.updatePreferences(auth.currentUser.uid, {
          dietary: newPreferences.dietary,
          spiceLevel: newPreferences.spiceLevel,
          notifications: newPreferences.notifications,
          favoriteItems: newPreferences.favoriteItems,
        });
        dispatch(updateUser({ preferences: newPreferences }));

        // Update favoriteItems count
        setUser((prev) =>
          prev
            ? {
                ...prev,
                favoriteItems: newPreferences.favoriteItems?.length || 0,
              }
            : null
        );
      }
    } catch (error) {
      toast.error("Failed to update preferences");
      // Optional: Revert local state on error
    }
  };

  // Payment handlers
  const handleAddPaymentMethod = async (
    newPaymentMethod: Omit<PaymentMethod, "id">
  ): Promise<void> => {
    if (!auth.currentUser) return;

    const paymentMethod: PaymentMethod = {
      ...newPaymentMethod,
      id: `pm_${Date.now()}`,
    };

    // If this is set as default, remove default from others
    if (paymentMethod.isDefault) {
      setPaymentMethods((prev) =>
        prev.map((pm) => ({ ...pm, isDefault: false }))
      );
    }

    setPaymentMethods((prev) => [...prev, paymentMethod]);

    // Save to Firebase
    try {
      await userService.addPaymentMethod(auth.currentUser.uid, paymentMethod);
    } catch (error) {
      toast.error("Failed to add payment method");
      setPaymentMethods(paymentMethods);
    }
  };

  const handleDeletePaymentMethod = async (
    paymentMethodId: string
  ): Promise<void> => {
    if (!auth.currentUser) return;

    const updatedMethods = paymentMethods.filter(
      (pm) => pm.id !== paymentMethodId
    );
    setPaymentMethods(updatedMethods);

    // Save to Firebase
    try {
      await userService.deletePaymentMethod(
        auth.currentUser.uid,
        paymentMethodId
      );
    } catch (error) {
      toast.error("Failed to delete payment method");
      setPaymentMethods(paymentMethods);
    }
  };

  const handleSetDefaultPaymentMethod = async (
    paymentMethodId: string
  ): Promise<void> => {
    if (!auth.currentUser) return;

    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        isDefault: pm.id === paymentMethodId,
      }))
    );

    // Save to Firebase
    try {
      await userService.setDefaultPaymentMethod(
        auth.currentUser.uid,
        paymentMethodId
      );
    } catch (error) {
      toast.error("Failed to set default payment method");
    }
  };

  // Security handlers
  const handleUpdatePassword = (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): void => {
    toast.info("Password update feature coming soon");
  };

  const handleUpdateSecurity = (securitySettings: {
    twoFactorEnabled: boolean;
    loginNotifications: boolean;
    sessionTimeout: string;
  }): void => {
    toast.success("Security settings updated");
  };

  // Header handlers
  const handleLogout = async (): Promise<void> => {
    await dispatch(signOutUser()).unwrap();
    router.push("/sign-in");
  };

  const handleAccountClick = (action: string): void => {
    if (action === "logout") {
      handleLogout().catch((error) => {
        toast.error("Logout failed");
      });
    }
  };

  // Favorites handlers
  const handleRemoveFavorite = async (item: MenuItem) => {
    if (!auth.currentUser) return;
    try {
      // Create a minimal FavoriteItem since we are just removing by ID
      const favItem: FavoriteItem = {
        id: String(item.id),
        name: item.name,
        category: item.category,
        image: item.image,
        imageAlt: item.imageAlt,
        price: item.price,
        description: item.description,
      };
      await dispatch(
        toggleFavoriteItem({ userId: auth.currentUser.uid, item: favItem })
      ).unwrap();

      // Update local preferences to reflect removal immediately
      const newFavs = preferences.favoriteItems.filter(
        (f) => f.id !== String(item.id)
      );
      setPreferences((prev) => ({ ...prev, favoriteItems: newFavs }));
      setUser((prev) =>
        prev ? { ...prev, favoriteItems: newFavs.length } : null
      );

      toast.success("Removed from favorites");
    } catch (error) {
      toast.error("Failed to remove favorite");
    }
  };

  const handleFavoritesAddToCart = async (item: MenuItem) => {
    try {
      const cartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
        imageAlt: item.imageAlt,
        customizations: [],
        specialRequests: null,
      };

      if (auth.currentUser) {
        await dispatch(
          addCartItem({
            userId: auth.currentUser.uid,
            item: cartItem,
          })
        ).unwrap();
      } else {
        dispatch(addItem(cartItem));
      }
      toast.success(`Added ${item.name} to cart`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const renderTabContent = (): React.ReactNode => {
    if (!user) {
      return null;
    }

    switch (activeTab) {
      case "profile":
        return (
          <ProfileSection user={user} onUpdateProfile={handleUpdateProfile} />
        );

      case "addresses":
        return (
          <AddressSection
            addresses={addresses}
            onAddAddress={handleAddAddress}
            onUpdateAddress={handleUpdateAddress}
            onDeleteAddress={handleDeleteAddress}
          />
        );

      case "orders":
        return (
          <OrderHistorySection
            orders={orders}
            onReorder={handleReorder}
            onViewDetails={handleViewOrderDetails}
          />
        );

      case "orders":
        return (
          <OrderHistorySection
            orders={orders}
            onReorder={handleReorder}
            onViewDetails={handleViewOrderDetails}
          />
        );

      case "favorites":
        return (
          <FavoritesSection
            favoriteItems={preferences.favoriteItems || []}
            onRemoveFavorite={handleRemoveFavorite}
            onAddToCart={handleFavoritesAddToCart}
          />
        );

      case "preferences":
        return (
          <PreferencesSection
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
          />
        );

      case "payment":
        return (
          <PaymentMethodsSection
            paymentMethods={paymentMethods}
            onAddPaymentMethod={handleAddPaymentMethod}
            onDeletePaymentMethod={handleDeletePaymentMethod}
            onSetDefaultPaymentMethod={handleSetDefaultPaymentMethod}
          />
        );

      case "security":
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

  const navbarUser = user
    ? {
        id: parseInt(user.id.replace(/\D/g, "")) || undefined,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={navbarUser} />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Icon
              name="Loader2"
              size={48}
              className="animate-spin text-primary mx-auto mb-4"
            />
            <p className="text-lg font-body text-muted-foreground">
              Loading your account...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={navbarUser}
        onLogout={handleLogout}
        onCartClick={() => router.push("/shopping-cart")}
        onSearch={() => {}}
        onAccountClick={handleAccountClick}
      />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-linear-to-br from-primary-solid via-grad1 to-grad2 rounded-full flex items-center justify-center overflow-hidden relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon name="User" size={32} color="white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  My Account
                </h1>
                <p className="text-lg font-body text-muted-foreground">
                  Welcome back, {user.name || "User"}
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
                    <p className="text-2xl font-heading font-bold text-foreground">
                      {user.totalOrders}
                    </p>
                    <p className="text-sm font-body text-muted-foreground">
                      Total Orders
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="Heart" size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-foreground">
                      {user.favoriteItems}
                    </p>
                    <p className="text-sm font-body text-muted-foreground">
                      Favorite Items
                    </p>
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
                    <p className="text-sm font-body text-muted-foreground">
                      Member Since
                    </p>
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
                          ? "bg-linear-to-br from-primary-solid via-grad1 to-grad2 text-primary-foreground shadow-warm-sm"
                          : "text-foreground hover:bg-muted hover:text-primary"
                      }`}
                    >
                      <Icon name={tab.icon} size={20} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-body font-medium text-muted-foreground mb-3">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="UtensilsCrossed"
                      className="w-full"
                      onClick={() => router.push("/menu-catalog")}
                    >
                      Browse Menu
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ShoppingCart"
                      className="w-full"
                      onClick={() => router.push("/shopping-cart")}
                    >
                      View Cart
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Home"
                      className="w-full"
                      onClick={() => router.push("/")}
                    >
                      Go Home
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
