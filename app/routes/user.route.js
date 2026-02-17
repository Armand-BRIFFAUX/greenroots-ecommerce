import express from 'express';
import UserController from '../controllers/user-controller.js';
import { authenticateToken } from '../middlewares/auth-middleware.js';
import { isAdmin } from '../middlewares/isAdmin-middleware.js';

const router = express.Router();

// CRUD basique
router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);

// On utilise une fonction fléchée (req, res) => ... au lieu de passer directement la méthode du contrôleur,
// car sinon Express "oublie" à quel objet appartient la fonction.
// En appelant nous-mêmes UserController.updateUser(req, res),
// on s’assure que le contrôleur garde bien son contexte (`this` fonctionne correctement).
router.get('/:id/edit', authenticateToken, isAdmin, (req, res) => UserController.updateUser(req, res));
router.post('/:id/edit', authenticateToken, isAdmin, (req, res) => UserController.updateUser(req, res));


router.post('/:id/delete', authenticateToken, isAdmin, UserController.delete);

export default router;