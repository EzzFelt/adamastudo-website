import { Router } from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// Rotas públicas
router.get('/', getAllServices);
router.get('/:id', getServiceById);

// Rotas protegidas (apenas admin)
router.post('/', authenticate, isAdmin, createService);
router.put('/:id', authenticate, isAdmin, updateService);
router.delete('/:id', authenticate, isAdmin, deleteService);

export default router;