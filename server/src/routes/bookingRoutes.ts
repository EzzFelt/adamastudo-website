import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getWeeklySchedule,
  updateBooking,
  cancelBooking,
  markAsNotified,
  getModifiedBookings,
  getAllBookingsHistory,
} from '../controllers/bookingController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// Rotas do cliente
router.post('/', authenticate, createBooking);
router.get('/my-bookings', authenticate, getMyBookings);
router.get('/modified', authenticate, getModifiedBookings);
router.post('/:id/cancel', authenticate, cancelBooking);
router.post('/:id/notified', authenticate, markAsNotified);

// Rotas do admin
router.get('/schedule/weekly', authenticate, isAdmin, getWeeklySchedule);
router.get('/history', authenticate, isAdmin, getAllBookingsHistory);
router.put('/:id', authenticate, isAdmin, updateBooking);

export default router;
