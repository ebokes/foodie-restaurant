export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  imageAlt: string;
  customizations: string[];
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  apartment?: string;
  instructions?: string;
}

export interface Delivery {
  type: "delivery" | "pickup";
  address: DeliveryAddress;
}

export interface PaymentMethod {
  type: string;
  lastFour: string;
  brand: string;
}

export interface TimelineItem {
  status: string;
  timestamp: string | null;
  title: string;
  completed: boolean;
}

export interface Order {
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
