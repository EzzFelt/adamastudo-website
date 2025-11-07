import type { Service } from './Service';
import type { User } from './User';

export interface Booking {
  id: string;
  serviceId: string;
  userId: string;
  scheduledDate: string;
  address: string;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  canCancel: boolean;
  cancelledAt?: string;
  cancelReason?: string;
  wasModified: boolean;
  modificationNote?: string;
  clientNotified: boolean;
  createdAt: string;
  updatedAt: string;
  service?: Service;
  user?: User;
}