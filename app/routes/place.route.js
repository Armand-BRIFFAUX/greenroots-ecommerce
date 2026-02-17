import express from 'express';
import PlaceController from '../controllers/place-controller.js';
import { authenticateToken } from '../middlewares/auth-middleware.js';
import { isAdmin } from '../middlewares/isAdmin-middleware.js';

const router = express.Router();

// CRUD basique
router.get('/', PlaceController.getAll);
router.get('/create', authenticateToken, isAdmin, PlaceController.create);
router.post('/create', authenticateToken, isAdmin, PlaceController.create);
router.get('/:id', PlaceController.getById);
router.get('/:id/edit', authenticateToken, isAdmin, PlaceController.update);
router.post('/:id/edit', authenticateToken, isAdmin, PlaceController.update);
router.post('/:id/delete', authenticateToken, isAdmin, PlaceController.delete);

export default router;