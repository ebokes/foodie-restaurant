import { Category, MenuItem } from "@/types/menu-catalog";

export const specialDeals = [
  {
    id: 1,
    title: "WEEKEND SPECIAL",
    subtitle: "Buy 2 Get 1 FREE",
    description:
      "Get a free appetizer when you order any two main courses this weekend!",
    image: "https://images.unsplash.com/photo-1730929851365-015a0b62ae5b",
    imageAlt:
      "Three gourmet pizzas with various toppings including pepperoni, vegetables, and cheese on wooden serving boards",
    discount: "33% OFF",
    validUntil: "Oct 16, 2024",
    isNew: true,
    bgColor: "bg-accent",
    textColor: "text-accent-foreground",
  },
  {
    id: 2,
    title: "LUNCH COMBO",
    subtitle: "Perfect Midday Meal",
    description:
      "Burger + Fries + Drink combo at an unbeatable price. Available 11 AM - 3 PM daily.",
    image: "https://images.unsplash.com/photo-1632919590629-a5ac59280da4",
    imageAlt:
      "Delicious burger combo with crispy golden fries and refreshing soft drink on restaurant table",
    discount: "$12.99",
    validUntil: "Daily Special",
    isNew: false,
    bgColor: "bg-warning",
    textColor: "text-warning-foreground",
  },
  {
    id: 3,
    title: "FAMILY FEAST",
    subtitle: "Feed the Whole Family",
    description:
      "Large pizza, garlic bread, salad, and 2L drink. Perfect for family dinner nights!",
    image: "https://images.unsplash.com/photo-1576458087594-45229e5277ec",
    imageAlt:
      "Large family-sized pizza with melted cheese and toppings alongside garlic bread and fresh salad",
    discount: "SAVE $15",
    validUntil: "Oct 20, 2024",
    isNew: true,
    bgColor: "bg-success",
    textColor: "text-success-foreground",
  },
];

export const categories: Category[] = [
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

export const menuItems: MenuItem[] = [];
