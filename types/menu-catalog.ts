export interface MenuItem {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageAlt: string;
  category: string;
  dietary: string[];
  tags: string[];
  featured: boolean;
  rating?: number;
  reviewCount?: number;
  prepTime: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: keyof typeof import("lucide-react");
  count: number;
  featured: boolean;
}

export interface Filters {
  dietary: string;
  priceRange: string;
  sortBy: string;
}