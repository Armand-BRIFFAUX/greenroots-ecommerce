import Joi from 'joi';
import { Place } from '../models/index.js';
import CoreController from './core-controller.js';

// Schéma Joi pour valider les données d'un Lieux
const placeSchema = Joi.object({
  name: Joi.string().min(2).required(), // Le nom doit faire au moins 2 caractères et est obligatoire
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
});

// Contrôleur spécifique aux lieux, hérite du CoreController
class PlaceController extends CoreController {
  constructor() {
    super(Place, placeSchema, 'places'); // On passe le modèle, le schéma et le dossier des Views 
  }
}

export default new PlaceController();
export { placeSchema }; //exporte le schéma pour les tests