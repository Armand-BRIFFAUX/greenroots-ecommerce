import express from 'express';
import { register, login, getCurrentUserInfo } from '../controllers/auth-controller.js';
import { authenticateToken } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Routes publiques 

//register() => crée un nouvel utilisateur
router.get('/register', (req, res) => res.render('register', { error: null }));
router.post('/register', register);

// login() => connecte et pose un cookie JWT
router.get('/login', (req, res) => res.render('login', { error: null }));
router.post('/login', login);

// getCurrentUserInfo() => affiche le profil ou dashboard
// authenticateToken => protège les pages privées
router.get('/dashboard', authenticateToken, getCurrentUserInfo);

// Déconnexion
router.get('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' }); // supprime le cookie JWT globalement
  res.redirect('/login');
})

export default router;
