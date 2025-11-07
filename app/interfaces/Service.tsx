export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: number;
  warranty: string;
  includes: string[];
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}