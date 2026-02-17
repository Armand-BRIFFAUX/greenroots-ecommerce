import Tree from '../models/tree.model.js';

const homepageController = {
  // méthode asynchrone pour la page d'accueil
  async homepage(req, res) {
    try {
      // Récupère les 3 derniers arbres ajoutés (createdAt décroissant)
      const newTrees = await Tree.findAll({
        order: [['createdAt', 'DESC']], // tri par date de création (du plus récent au plus ancien)
        limit: 3
      });

      // Rendu de la vue homepage en passant les nouveautés
      // Tu peux aussi passer user/userRole si tu veux les utiliser dans la view
      res.render('homepage', { newTrees });
    } catch (error) {
      console.error('Erreur lors de la récupération des nouveautés :', error);
      // En cas d'erreur, rendre la page sans nouveautés pour éviter l'erreur EJS
      res.render('homepage', { newTrees: [] });
    }
  }
};

export default homepageController;