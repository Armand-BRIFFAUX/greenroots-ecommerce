import Joi from 'joi';
import { Tree } from '../models/index.js';
import CoreController from './core-controller.js';

// Schéma Joi pour valider les données d'un arbre
const treeSchema = Joi.object({
  name: Joi.string().min(2).required(), // Nom requis (2 caractères minumum)
  description: Joi.string().allow(''), // Description / optionnelle
  image: Joi.string().allow('').optional().custom((value, helpers) => { // url ou chemin relatif, optionnelle
    //si vide ok
    if (!value || value === '') return value;

    // si rempli, doit être une URL OU un chemin relatif (/images/...)
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/images/')) {
      return value;
    }
    return helpers.message('L\'image doit être une URL ou un chemin vers /images/');
  }),
  price: Joi.number().positive().required(), // Prix positif / obligatoire
  stock: Joi.number().integer().min(0).required(), // Stock >= 0 / obligatoire
  origin: Joi.string().min(2).required(), // Origine requise (2 caractères minumum)
});

class TreeController extends CoreController {
  constructor() {
    super(Tree, treeSchema, 'trees'); // On passe le modèle, le schéma et le dossier des Views
  }
}

export default new TreeController();
export { treeSchema }; //exporte le schéma pour les tests
