import express from 'express';
import { getPanier, addToPanier, removeFromPanier, updatePanier, validateOrder, getConfirmation } from '../controllers/panier-controller.js';
import { authenticateToken } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.get('/', authenticateToken, getPanier);
router.post('/add', authenticateToken, addToPanier);
router.post('/remove', authenticateToken, removeFromPanier);
router.post('/update', authenticateToken, updatePanier);
router.post('/validate', authenticateToken, validateOrder);
router.get('/confirmation/:orderId', authenticateToken, getConfirmation);


export default router;