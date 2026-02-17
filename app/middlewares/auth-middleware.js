import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

// Middleware pour vérifier le token JWT dans le cookie
export function authenticateToken(req, res, next) {

    // On récupère le token dans les cookies
    const token = req.cookies.token;

  // Si aucun token => redirige vers la page de login
    if (!token) {
        return res.redirect('/login');
    }

    // Vérifie et décode le token
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {

        //Si le token est expiré ou invalide => renvoie une erreur 403 et affiche la page de login
        if (error) {
            console.error('JWT invalide ou expiré:', error);
            return res.status(StatusCodes.FORBIDDEN).render('login', { error: 'Session expirée' });
        }

    // Stock les infos de l’utilisateur (id + rôle) dans l’objet req
    req.userId = decoded.id;
    req.userRole = decoded.role;

    // Passe la main à la suite (route suivante)
    next();
  });
};

