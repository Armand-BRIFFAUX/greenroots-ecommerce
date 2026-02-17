/**
 * Middleware pour vérifier que l'utilisateur connecté est un administrateur.
 * Nécessite que authenticateToken ait déjà été exécuté avant.
 */

import { StatusCodes } from 'http-status-codes';

// Fonction logique pure pour le test unitaire.
export function isUserAdmin(role) {
    return role === 'admin';
}

export function isAdmin(req, res, next) {
    // Vérifie si le rôle de l'utilisateur est "admin"
    if (req.userRole === 'admin') {
        return next(); // On laisse passer
    }

    // Sinon => on bloque l’accès
    return res.status(StatusCodes.FORBIDDEN).render('error', { message: "Accès refusé. Réservé aux administrateurs."});
}