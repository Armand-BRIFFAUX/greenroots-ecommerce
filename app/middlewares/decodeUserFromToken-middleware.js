/**
 * Middleware global pour décoder le token JWT si présent
 * et rendre les infos utilisateur accessibles dans toutes les vues EJS.
 */

import jwt from 'jsonwebtoken';


export function decodeUserFromToken(req, res, next) {
    const token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Met les infos dans res.locals (accessibles dans EJS)
            res.locals.userId = decoded.id;
            res.locals.userRole = decoded.role;
            res.locals.userEmail = decoded.email; // optionnel, utile pour le header
        } catch (err) {
            // Si token invalide ou expiré => on réinitialise
            res.locals.userId = null;
            res.locals.userRole = null;
            res.locals.userEmail = null;
        }
    } else {
        // Aucun cookie JWT présent
        res.locals.userId = null;
        res.locals.userRole = null;
        res.locals.userEmail = null;
    }

    next();
}
