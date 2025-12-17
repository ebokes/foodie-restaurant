import React from "react";
import MenuItemCard from "@/components/menu-catalog/menu-item-card";
import Icon from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { FavoriteItem } from "@/lib/store/slices/authSlice";
import { MenuItem } from "@/types/menu-catalog";

interface FavoritesSectionProps {
  favoriteItems: FavoriteItem[];
  onRemoveFavorite: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  favoriteItems,
  onRemoveFavorite,
  onAddToCart,
}) => {
  // Convert FavoriteItem to MenuItem format for the card
  const mapFavoriteToMenuItem = (fav: FavoriteItem): MenuItem => ({
    id: parseInt(fav.id) || 0, // Handle potential string/number mismatch gracefully
    name: fav.name,
    category: fav.category,
    image: fav.image,
    imageAlt: fav.imageAlt,
    price: fav.price || 0,
    description: fav.description || "",
    originalPrice: fav.originalPrice,
    subtitle: fav.subtitle || "",
    dietary: fav.dietary || [],
    tags: fav.tags || [],
    featured: false, // Favorites are not necessarily featured in this view
    rating: fav.rating || 0,
    reviewCount: fav.reviewCount || 0,
    prepTime: fav.prepTime || 0,
    createdAt: new Date().toISOString(),
  });

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-linear-to-br from-primary-solid via-grad1 to-grad2 rounded-full flex items-center justify-center">
            <Icon name="Heart" size={24} color="white" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">
              My Favorites
            </h2>
            <p className="text-sm font-body text-muted-foreground">
              Manage your saved items
            </p>
          </div>
        </div>
        <Button
          onClick={() => (window.location.href = "/menu-catalog")}
          variant="outline"
          size="sm"
          iconName="Plus"
        >
          Add More
        </Button>
      </div>

      {favoriteItems && favoriteItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteItems.map((fav) => {
            const menuItem = mapFavoriteToMenuItem(fav);
            return (
              <MenuItemCard
                key={fav.id}
                item={menuItem}
                onAddToCart={onAddToCart}
                isFavorite={true}
                onToggleFavorite={onRemoveFavorite}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border border-border rounded-lg bg-muted/20">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Heart" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-heading font-bold text-foreground mb-2">
            No Favorites Yet
          </h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Browse our menu and click the heart icon to save items you love for
            quick access.
          </p>
          <Button
            onClick={() => (window.location.href = "/menu-catalog")}
            variant="default"
            size="lg"
            className="bg-linear-to-br from-primary-solid via-grad1 to-grad2 border-0"
          >
            Browse Menu
          </Button>
        </div>
      )}
    </div>
  );
};

export default FavoritesSection;
