"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/navbar/navbar";
import BrowseByCategoryWithFilters from "../../components/menu-catalog/browse-by-category-with-filters";
import MenuGrid from "../../components/menu-catalog/menu-grid";
import Icon from "../../components/ui/app-icon";
import { menuItems } from "@/lib/constants";
import { MenuItem } from "@/types/menu-catalog";
import FooterSection from "@/components/footer/footer";

// Define types
interface Category {
  id: string;
  name: string;
  icon: keyof typeof import("lucide-react");
  count: number;
  featured: boolean;
}

interface Filters {
  dietary: string;
  priceRange: string;
  sortBy: string;
}

const MenuCatalog = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filters, setFilters] = useState<Filters>({
    dietary: "",
    priceRange: "",
    sortBy: "name",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [cartCount, setCartCount] = useState<number>(3);

  // Mock categories data
  const categories: Category[] = [
    {
      id: "all",
      name: "All Items",
      icon: "Grid3X3",
      count: 48,
      featured: false,
    },
    {
      id: "appetizers",
      name: "Appetizers",
      icon: "Soup",
      count: 12,
      featured: true,
    },
    {
      id: "mains",
      name: "Main Courses",
      icon: "UtensilsCrossed",
      count: 18,
      featured: false,
    },
    {
      id: "desserts",
      name: "Desserts",
      icon: "Cake",
      count: 10,
      featured: false,
    },
    {
      id: "beverages",
      name: "Beverages",
      icon: "Coffee",
      count: 8,
      featured: true,
    },
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleAddToCart = async (item: MenuItem) => {
    // Simulate adding to cart
    console.log("Adding to cart:", item);
    setCartCount((prev) => prev + 1);

    // Show success feedback (you could add a toast notification here)
    return new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  };

  // const handleCartClick = () => {
  //   router.push("/shopping-cart");
  // };

  // const handleAccountClick = (action: string) => {
  //   if (action === "login") router.push("/login");
  //   if (action === "register") router.push("/register");
  //   if (action === "account") router.push("/user-account");
  // };

  return (
    <div className="min-h-screen bg-background">
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
