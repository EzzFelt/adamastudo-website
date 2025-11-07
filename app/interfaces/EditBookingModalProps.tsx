import type { Booking } from "./Booking";

export interface EditBookingModalProps {
  booking: Booking;
  onClose: () => void;
  onUpdate: () => void;
  token: string;
}