import { StatusCodes } from 'http-status-codes';

// Classe de base pour les contrôleurs génériques
class CoreController {

  /**
  * @param {Model} model - modèle Sequelize
  * @param {Joi.Schema} schema - schéma de validation Joi
  * @param {string} [viewFolderName] - nom du dossier des vues (ex: "trees", "users")
  */
  constructor(model, schema, viewFolderName) {
    this.model = model; // Stocke le modèle (table)
    this.schema = schema; // Stocke le schéma de validation
    this.viewFolder = viewFolderName || model.name.toLowerCase() + 's'; // Nom du dossier des vues
  }

  /**
   * Récupérer toutes les Ressources d'une certaine table de la BDD
   *
   * @param {Request} req
   * @param {Response} res
   */
  getAll = async (req, res) => {
    try {
      // Récupère tous les enregistrements de la table associée au modèle (ex: tous les arbres)
      const items = await this.model.findAll();

      // Rend la vue EJS correspondante (ex : Views/trees/list.ejs)
      res.status(StatusCodes.OK).render(
        `${this.viewFolder}/list`,
        {
          title: `Liste des ${this.model.name}s`, // Titre dynamique (ex: "Liste des Trees")
          items  // Données passées à la vue EJS                               
        }
      );

    } catch (error) {
      // Affiche l’erreur dans la console
      console.error(error);

      // Rend une page d’erreur simple en cas de problème serveur
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', { message: "Erreur serveur." });
    }
  };

  /**
   * Récupérer une Ressource d'une certaine table par son id
   *
   * @param {Request} req
   * @param {Response} res
   */
  getById = async (req, res) => {
    try {

      // Récupèrer l'ID depuis l'URL (exemple: /trees/3 => id = 3)
      const { id } = req.params;

      // Chercher l'élément dans la base via sa clé primaire
      const item = await this.model.findByPk(id);

      // Si l'élément n'existe pas → afficher la page d'erreur
      if (!item) {
        return res.status(StatusCodes.NOT_FOUND).render('error', { message: "Élément non trouvé." });
      }

      // Si tout va bien → affiche la vue EJS correspondante
      res.status(StatusCodes.OK).render(
        `${this.viewFolder}/detail`, // Exemple : Views/trees/detail.ejs
        {
          title: `${this.model.name} #${id}`, // Exemple : "Tree #3"
          item, // Passe l’élément à la vue
        }
      );

    } catch (error) {
      // En cas d’erreur serveur
      console.error(error);

      // Affiche la page d’erreur générique error.ejs
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', { message: "Erreur serveur." });
    }
  };

  /**
   * Crée une nouvelle Ressource d'une certaine table dans la BDD
   *
   * @param {Request} req
   * @param {Response} res
   */
  create = async (req, res) => {

    try {
      // Si la requête est GET → afficher le formulaire vide
      if (req.method === 'GET') {
        return res.status(StatusCodes.OK).render(
          `${this.viewFolder}/create`, // Exemple : Views/trees/create.ejs
          {
            title: `Créer un ${this.model.name}`, // Titre dynamique
            errorMessage: null, // Aucune erreur joi au premier affichage
            oldInput: {} // Formulaire vide
          }
        );
      }

      // Si la requête est POST => valider les données
      const { error, value } = this.schema.validate(req.body);

      //  Si la validation échoue => réafficher le formulaire avec les erreurs et les données précédentes
      if (error) {
        return res.status(StatusCodes.BAD_REQUEST).render(
          `${this.viewFolder}/create`,
          {
            title: `Créer un ${this.model.name}`,
            errorMessage: error.details[0].message, // Message d’erreur Joi
            oldInput: req.body // Garde les champs remplis
          }
        );
      }

      // Si tout est bon => insérer en base de données
      const newItem = await this.model.create(value);

      // Rediriger vers la page de liste après création
      res.redirect(`/${this.viewFolder}`);

    } catch (error) {
      // En cas d’erreur serveur
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', { message: "Erreur lors de la création." });
    }
  };

  /**
  * Met à jour une ressource par son ID
  *
  * @param {Request} req
  * @param {Response} res
  */
  update = async (req, res) => {
    try {

      // Récupère l'ID dans l'URL
      const { id } = req.params;

      // Cherche l'élément à modifier
      const item = await this.model.findByPk(id);


      // Si l'élément n'existe pas => afficher la page d'erreur
      if (!item) {
        return res.status(StatusCodes.NOT_FOUND).render('error', { message: "Élément non trouvé." });
      }

      // Si la requête est GET => afficher le formulaire pré-rempli
      if (req.method === 'GET') {
        return res.status(StatusCodes.OK).render(
          `${this.viewFolder}/edit`, // Exemple : Views/trees/edit.ejs
          {
            title: `Modifier ${this.model.name} #${id}`,
            errorMessage: null,
            oldInput: item // Pré-remplir le formulaire avec les valeurs existantes
          }
        );
      }

      // Si la requête est POST => valider les données du formulaire
      const { error, value } = this.schema.validate(req.body);

      // Si validation échoue => réafficher le formulaire avec les erreurs
      if (error) {
        return res.status(StatusCodes.BAD_REQUEST).render(
          `${this.viewFolder}/edit`,
          {
            title: `Modifier ${this.model.name} #${id}`,
            errorMessage: error.details[0].message,
            oldInput: req.body
          }
        );
      }

      // Met à jour l'élément en bdd
      await item.update(value);

      //Puis redirige vers la page de détail
      res.redirect(`/${this.viewFolder}/${id}`);

    } catch (error) {
      // Gestion des erreurs serveur
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', { message: "Erreur lors de la mise à jour." });
    }
  };


  /**
   * Supprime une Ressource d'une certaine table par son id
   *
   * @param {Request} req
   * @param {Response} res
   */
  delete = async (req, res) => {
    try {

      // Récupère l'ID depuis l'URL
      const { id } = req.params;

      // Recherche l'élément à supprimer
      const item = await this.model.findByPk(id);

      // Si l'élément n'existe pas → page d’erreur
      if (!item) {
        return res.status(StatusCodes.NOT_FOUND).render('error', { message: "Élément non trouvé." });
      }

      // Supprime l'élément de la base
      await item.destroy();

      // Redirige vers la liste après suppression
      res.redirect(`/${this.viewFolder}`);

    } catch (error) {
      console.error(error);

      // En cas d’erreur serveur → affiche la page error.ejs
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', { message: "Erreur lors de la suppression." });
    }
  };
}

// Exporte la classe pour être héritée par d'autres contrôleurs
export default CoreController;
export { CoreController }; //exporte le schéma pour les tests
