// Ce fichier de Middleware va contenir de quoi vérifier la validité des paramètres d'une requête API liée aux arbres (Tree)
// Ce sera utile pour les API POST / PATCH / PUT => toutes celles où on passe un req.body...

import Joi from "joi";
import { StatusCodes } from 'http-status-codes';

export function validateTree(req, res, next){

    // Ignore les requêtes GET
    if (req.method === 'GET') return next();

    const rules ={
        name: Joi.string().min(2).required(), // Nom requis (2 caractères minumum)
        description: Joi.string().allow(''), // Description / optionnelle
        image: Joi.string().uri().allow(''), // URL d’image /  optionnelle
        price: Joi.number().positive().required(), // Prix positif / obligatoire
        stock: Joi.number().integer().min(0).required(), // Stock >= 0 / obligatoire
        origin: Joi.string().min(2).required(), // Origine requise (2 caractères minumum)
    };

    const schema = Joi.object(rules);

    const validation = schema.validate(req.body, { abortEarly: false }); //  Validation du corps de la requête
    // abortEarly:false => Joi continue à valider tout le schéma et renvoie toutes les erreurs

    if (validation.error) { // En cas d’erreurs de validation
        return res.status(StatusCodes.BAD_REQUEST).json({ error: validation.error.details.map(detail => detail.message) });
    }

    next(); // Si tout est bon, on passe à la suite


}