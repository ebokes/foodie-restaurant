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

export const menuCategories = [
  {
    id: 1,
    name: "Burgers",
    description: "Juicy, handcrafted burgers with premium ingredients",
    image: "https://images.unsplash.com/photo-1603322617458-a6ca4d3e55c0",
    imageAlt:
      "Gourmet beef burger with lettuce, tomato, cheese, and sesame seed bun on wooden cutting board",
    itemCount: 12,
    featured: true,
    color: "bg-primary",
    textColor: "text-primary-foreground",
  },
  {
    id: 2,
    name: "Pizza",
    description: "Wood-fired pizzas with authentic Italian flavors",
    image: "https://images.unsplash.com/photo-1664683591826-12d7d41543c1",
    imageAlt:
      "Traditional Italian pizza with melted mozzarella, fresh basil, and tomato sauce on wooden table",
    itemCount: 8,
    featured: false,
    color: "bg-accent",
    textColor: "text-accent-foreground",
  },
  {
    id: 3,
    name: "Pasta",
    description: "Fresh pasta dishes made with traditional recipes",
    image: "https://images.unsplash.com/photo-1695300466208-5c58a043dedb",
    imageAlt:
      "Creamy pasta dish with herbs and parmesan cheese in white ceramic bowl",
    itemCount: 10,
    featured: false,
    color: "bg-warning",
    textColor: "text-warning-foreground",
  },
  {
    id: 4,
    name: "Salads",
    description: "Fresh, healthy salads with seasonal ingredients",
    image: "https://images.unsplash.com/photo-1670650850872-652ed66a9097",
    imageAlt:
      "Fresh mixed green salad with colorful vegetables, cherry tomatoes, and dressing in glass bowl",
    itemCount: 6,
    featured: false,
    color: "bg-success",
    textColor: "text-success-foreground",
  },
  {
    id: 5,
    name: "Desserts",
    description: "Indulgent desserts to satisfy your sweet tooth",
    image: "https://images.unsplash.com/photo-1713393280916-a2a888a375c9",
    imageAlt:
      "Decadent chocolate cake slice with berries and powdered sugar on elegant white plate",
    itemCount: 7,
    featured: false,
    color: "bg-secondary",
    textColor: "text-secondary-foreground",
  },
  {
    id: 6,
    name: "Beverages",
    description: "Refreshing drinks, coffee, and specialty beverages",
    image: "https://images.unsplash.com/photo-1657459832576-e42be00462d9",
    imageAlt:
      "Assorted colorful beverages including coffee, smoothies, and fresh juices in various glasses",
    itemCount: 15,
    featured: false,
    color: "bg-muted",
    textColor: "text-muted-foreground",
  },
];

export const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Food Blogger",
      avatar: "https://images.unsplash.com/photo-1618636533948-bb301ef06b31",
      avatarAlt:
        "Professional headshot of smiling woman with brown hair in casual blue shirt",
      rating: 5,
      text: "Absolutely incredible! The flavors are authentic and the presentation is beautiful. Foodies has become my go-to restaurant for special occasions and casual dining alike.",
      date: "2 days ago",
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Local Resident",
      avatar: "https://images.unsplash.com/photo-1724128195747-dd25cba7860f",
      avatarAlt:
        "Professional headshot of Hispanic man with short black hair in navy suit smiling at camera",
      rating: 5,
      text: "The best burger I've ever had! The ingredients are fresh, the service is fast, and the atmosphere is perfect for families. Highly recommend the weekend specials!",
      date: "1 week ago",
    },
    {
      id: 3,
      name: "Emily Chen",
      role: "Business Owner",
      avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
      avatarAlt:
        "Professional headshot of Asian woman with long black hair in white blazer smiling confidently",
      rating: 5,
      text: "Outstanding quality and service! I order from Foodies for all my business meetings. The food always arrives on time and exceeds expectations. Five stars!",
      date: "3 days ago",
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Chef",
      avatar: "https://images.unsplash.com/photo-1607845046636-dca2447c0dee",
      avatarAlt:
        "Professional headshot of middle-aged man with beard wearing chef's coat in kitchen setting",
      rating: 5,
      text: "As a fellow chef, I appreciate the attention to detail and quality ingredients. The pasta dishes are exceptional and remind me of authentic Italian cuisine.",
      date: "5 days ago",
    },
];

export const features = [
      {
        id: 1,
        icon: "ChefHat" as const,
        title: "Expert Chefs",
        description:
          "Our experienced chefs bring years of culinary expertise to every dish, ensuring exceptional taste and quality.",
        image: "https://images.unsplash.com/photo-1687089122852-40b29da3f249",
        imageAlt:
          "Professional chef in white uniform and hat preparing food in modern kitchen",
      },
      {
        id: 2,
        icon: "Leaf" as const,
        title: "Fresh Ingredients",
        description:
          "We source only the freshest, locally-grown ingredients to guarantee the best flavors in every bite.",
        image: "https://images.unsplash.com/photo-1678831654314-8d68bb47cb0f",
        imageAlt:
          "Fresh organic vegetables and herbs arranged on wooden cutting board",
      },
      {
        id: 3,
        icon: "Clock" as const,
        title: "Fast Service",
        description:
          "Quick preparation and delivery without compromising on quality. Your satisfaction is our priority.",
        image: "https://images.unsplash.com/photo-1689916342657-d8db64f47bdd",
        imageAlt:
          "Delivery person on motorcycle with insulated food delivery bag in urban setting",
      },
      {
        id: 4,
        icon: "Heart" as const,
        title: "Made with Love",
        description:
          "Every dish is prepared with passion and care, bringing you the authentic taste of home-cooked meals.",
        image: "https://images.unsplash.com/photo-1734918693352-774ff2cd3ae5",
        imageAlt:
          "Hands carefully plating a gourmet dish with artistic presentation",
      },
];