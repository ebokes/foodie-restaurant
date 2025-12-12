"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Header from "../../components/navbar/navbar";
import BrowseByCategoryWithFilters from "../../components/menu-catalog/browse-by-category-with-filters";
import MenuGrid from "../../components/menu-catalog/menu-grid";
import Icon from "../../components/ui/app-icon";
import { categories } from "@/lib/constants";
import { menuService } from "@/lib/firebase/menu";
import { Filters, MenuItem } from "@/types/menu-catalog";
import FooterSection from "@/components/footer/footer";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addItem, addCartItem } from "@/lib/store/slices/cartSlice";
import { auth } from "@/lib/firebase/config";

const MenuCatalog = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filters, setFilters] = useState<Filters>({
    dietary: "",
    priceRange: "",
    sortBy: "name",
  });
  const [loading, setLoading] = useState<boolean>(true);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const items = await menuService.getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleAddToCart = async (item: MenuItem) => {
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

      // If user is logged in, sync with Firebase
      if (user && auth.currentUser) {
        try {
          await dispatch(
            addCartItem({
              userId: auth.currentUser.uid,
              item: cartItem,
            })
          ).unwrap();
        } catch (error) {
          console.error("Error syncing cart with Firebase:", error);
          // In production, you might want to show an error to the user
        }
      } else {
        // Local update for unauthenticated users
        dispatch(addItem(cartItem));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }

    // Show success feedback (you could add a toast notification here)
    toast.success(`Added ${item.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="">
        {/* Hero Section */}
        <section className="bg-linear-to-br from-primary-solid via-grad1 to-grad2 text-primary-foreground py-6 lg:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl lg:text-4xl font-heading font-bold mb-3">
                Our Menu
              </h1>
              <p className="text-base lg:text-lg font-body opacity-90 max-w-2xl mx-auto">
                Discover our carefully crafted dishes made with the finest
                ingredients. From appetizers to desserts, every item tells a
                story of flavor and passion.
              </p>
            </div>
          </div>
        </section>

        {/* Menu Content */}
        <section className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {/* Unified Browse by Category with Filters & Sort */}
              <BrowseByCategoryWithFilters
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                onFiltersChange={handleFiltersChange}
              />

              {/* Menu Grid */}
              <MenuGrid
                items={menuItems}
                loading={loading}
                onAddToCart={handleAddToCart}
                activeCategory={activeCategory}
                filters={filters}
              />
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-muted py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-card rounded-2xl p-8 lg:p-12 shadow-warm">
              <div className="w-16 h-16 bg-linear-to-br from-primary-solid via-grad1 to-grad2 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Phone" size={24} color="white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-4">
                Can&apos;t Find What You&apos;re Looking For?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Our chefs are happy to accommodate special requests and dietary
                restrictions. Give us a call to discuss custom menu options or
                ask about today&apos;s specials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+15551234567"
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-linear-to-br from-primary-solid via-grad1 to-grad2 text-primary-foreground rounded-lg font-body font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105"
                >
                  <Icon name="Phone" size={18} />
                  <span>Call (555) 123-4567</span>
                </a>
                <button
                  onClick={() => router.push("/shopping-cart")}
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-accent text-accent-foreground rounded-lg font-body font-medium hover:bg-accent/90 transition-all duration-200 hover:scale-105"
                >
                  <Icon name="ShoppingCart" size={18} />
                  <span>View Cart ({cartCount})</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default MenuCatalog;
