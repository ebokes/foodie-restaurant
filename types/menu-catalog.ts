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
