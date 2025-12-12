export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}
