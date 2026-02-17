import Tree from "../models/tree.model.js";
import Place from "../models/place.model.js";
import Order from "../models/order.model.js";
import OrderHasTree from "../models/order_has_tree.model.js";
import { StatusCodes } from "http-status-codes";
import sequelize from "../models/sequelize.client.js";
import UserHasTree from "../models/user_has_tree.model.js";


// ---- afficher le panier ---- \\

export async function getPanier(req, res) {
  try {

    // récupère l'ID de l'user connecté depuis le token décodé
    const userId = req.userId;

    // vérifie si un panier existe pour cet dans la session
    if (!req.session.paniers) {
      req.session.paniers = {};
    }

    // si cet utilisateur n'a pas encoe de panier, créer un tabeau vide
    if (!req.session.paniers[userId]) {
      req.session.paniers[userId] = [];
    }

    // récupère le panier de cet utilisateur spécifique
    const userPanier = req.session.paniers[userId];

    // taableau vide pour stocker les détails du panier
    const panierItems = [];

    // initialise le total à 
    let total = 0;

    // Boucle sur chaque item du panier stocké en session
    for (const item of userPanier) {

      // on récupère les détails de l'arbre depuis bdd avec id
      const tree = await Tree.findByPk(item.tree_id, {

        //include pour récupérer le lieu associé
        include: [{
          model: Place,
          through: { attributes: [] }
        }]
      });

      //vérifie que l'arbre existe dans bdd
      if (tree) {

        // calcule le sous-total
        const subtotal = parseFloat(tree.price) * item.quantity;

        //ajoute l'arbre + infos au tableau panierItems
        panierItems.push({
          tree,                     //objet complet de l'arbre
          quantity: item.quantity,  //quantité de la session
          subtotal                  // sous-total calculé
        });

        // ajoute le sous-total au total général du panier
        total += subtotal;
      }
    }

    //rend la view panier.ejs avec les données
    res.render('panier', {
      panierItems,
      total
    });
  } catch (error) {
    console.error("Erreur dans getPAnier:", error);

    // rend une page d'erreur 500
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', {
      message: 'Erreur serveur'
    });
  }
}

// ---- ajouter un arbre au panier ---- \\

export async function addToPanier(req, res) {
  try {
    const userId = req.userId;

    //récupère les données envoyées
    const { tree_id, quantity } = req.body;

    // vérifie si un panier existe dans la session
    if (!req.session.paniers) {
      req.session.paniers = {};
    }

    // initialise le panier de cet utilisateur
    if (!req.session.paniers[userId]) {
      req.session.paniers[userId] = [];
    }

    // récupère l'arbre depuis la BDD
    const tree = await Tree.findByPk(tree_id);

    // vérifie si l'arbre existe
    if (!tree) {
      return res.redirect('/trees');
    }

    //chercher si l'arbre existe déjà dans le panier
    const existingItem = req.session.paniers[userId].find(
      item => item.tree_id === parseInt(tree_id)
    );

    // calcul la quantité totale
    let totalQuantity;
    if (existingItem) {
      totalQuantity = existingItem.quantity + parseInt(quantity);
    } else {
      totalQuantity = parseInt(quantity);
    }

    // vérifie le stock
    if (totalQuantity > tree.stock) {
      return res.redirect(`/trees/${tree_id}?error=stock`);
    }

    // ajout/mettre à jour le panier
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      req.session.paniers[userId].push({
        tree_id: parseInt(tree_id),
        quantity: parseInt(quantity)
      });
    }

    // redirige l'utilisateur vers la page du panier
    res.redirect('/panier');

  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', {
      message: 'Erreur lors de l\'ajout au panier'
    });
  }
}

// ---- mettre à jour la quantité d'un arbre dans le panier ---- //

export async function updatePanier(req, res) {
  try {

    const userId = req.userId;

    // récupère l'ID de l'arbre et la nouvelle quantité depuis le formulaire
    const { tree_id, quantity } = req.body;

    // convertit la quantité en nombre entier
    const newQuantity = parseInt(quantity);

    // vérifie que la quantité est valide ( min 1)
    if (newQuantity < 1) {
      // si 0 ou négatif, redirige vers le panier sans modification
      return res.redirect('/panier');
    }

    // vérifie que le panier existe dans la session
    if (!req.session.paniers[userId]) {
      // si pas de panier, redirige vers la page du panier
      return res.redirect('/panier');
    }

    // récupère l'arbre depuis la BDD pour vérifier le stock
    const tree = await Tree.findByPk(tree_id);

    // vérifie que l'arbre existe dans la BDD
    if (!tree) {
      // si l'arbre n'existe pas, redirige vers le panier
      return res.redirect('/panier');
    }
    // vérifie que la nouvelle quantité ne dépasse pas le stock disponible
    if (newQuantity > tree.stock) {
      return res.redirect('/panier');
    }

    // cherche l'arbre dans le panier de la session
    const existingItem = req.session.paniers[userId].find(
      item => item.tree_id === parseInt(tree_id)
    );

    // si l'arbre est dans le panier
    if (existingItem) {
      // met à jour la quantité
      existingItem.quantity = newQuantity;
    } else {
      return res.redirect('/panier');
    }

    // redirige vers la page panier avec les nouvelles quantités
    res.redirect('/panier');

  } catch (error) {
    console.error(error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', {
      message: 'Erreur lors de la mise à jour du panier'
    });
  }
}

// ---- supprimer un arbre du panier ---- \\

export async function removeFromPanier(req, res) {

  const userId = req.userId;

  //récupère l'ID de l'arbre à supprimer
  const { tree_id } = req.body;

  // vérifie que le panier  existe
  if (req.session.paniers[userId]) {

    //filter créer un nouveau tableau en gardant seulement
    // les items dont le tree_id est différent de celui à supprimer
    req.session.paniers[userId] = req.session.paniers[userId].filter(
      item => item.tree_id !== parseInt(tree_id)
    );
  }
  res.redirect('/panier');
}

// ---- valider la commande (faux paiement) ---- //

export async function validateOrder(req, res) {

  // déclaration variable nouvelle transaction
  let newTransaction;

  try {


    const userId = req.userId;

    // vérifie que l'utlisateur est authentifié
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).render('error', {
        message: 'Vous devez être connecté pour valider une commande'
      });
    }

    // vérifie que la session existe
    if (!req.session.paniers) {
      req.session.paniers = {};
    }

    //récupère le panier de l'user
    const userPanier = req.session.paniers[userId];

    // vérifie que le panier ne soit pas vide
    if (!userPanier || userPanier.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).render('error', {
        message: 'Votre panier est vide'
      });
    }

    // calcul le total et vérifie les stocks
    let total = 0;
    const panierDetails = [];

    for (const item of userPanier) {
      const tree = await Tree.findByPk(item.tree_id);

      // vérifie que l'arbre existe
      if (!tree) {
        return res.status(StatusCodes.BAD_REQUEST).render('error', {
          message: `Arbre introuvable (ID: ${item.tree_id})`
        });
      }

      // vérife le stock disponible
      if (tree.stock < item.quantity) {
        return res.status(StatusCodes.BAD_REQUEST).render('error', {
          message: `Stock insuffisant pour ${tree.name} (disponible: ${tree.stock})`
        });
      }

      const subtotal = parseFloat(tree.price) * item.quantity;
      total += subtotal;

      panierDetails.push({
        tree,
        quantity: item.quantity,
        subtotal
      });
    }

    // démarre la transaction après toutes les vérifications
    newTransaction = await sequelize.transaction();

    // crée la commande avec la transaction
    const order = await Order.create({
      user_id: userId,
      total_price: total,
      status: 'paid',               // ou 'completed' pour simulation
      //  payment_method: 'simulation'  // identifier que c'est un faux paiement
    }, { transaction: newTransaction });

    // crée les lignes de commande (order_has_tree) avec la transaction
    for (const item of userPanier) {
      await OrderHasTree.create({
        order_id: order.id,
        tree_id: item.tree_id,
        quantity: item.quantity
      }, { transaction: newTransaction });

      // crée les lignes dans user_has_tree pour lier l'utilisateur aux arbres commandés
      // findOrCreate évite les doublons dans la table
      for (let treeInstance = 0; treeInstance < item.quantity; treeInstance++) {
        await UserHasTree.findOrCreate({
          where: {
            user_id: userId,
            tree_id: item.tree_id
          },
          defaults: {
            user_id: userId,
            tree_id: item.tree_id
          },
          transaction: newTransaction
        });
      }

      // décrement le stock avec la transaction
      const tree = await Tree.findByPk(item.tree_id);
      await tree.update({
        stock: tree.stock - item.quantity
      }, { transaction: newTransaction });
    }

    // tout à reussi => valider la transaction
    await newTransaction.commit();

    // vide le panier
    req.session.paniers[userId] = [];

    // redirige vers la page de confirmation
    res.redirect(`/panier/confirmation/${order.id}`);

  } catch (error) {
    // erreur => tout annuler si la transaction existe
    if (newTransaction) {
      try {
        await newTransaction.rollback();
      } catch (rollbackError) {
        console.error('Erreur lors du rollback:', rollbackError);
      }
    }
    console.error('Erreur validation commande:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', {
      message: 'Erreur lors de la validation de la commande'
    });
  }
}

// ---- afficher la confirmation de la commande ---- //

export async function getConfirmation(req, res) {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    // récupère la commande avec les arbres associés
    const order = await Order.findByPk(orderId, {
      include: [{
        model: Tree,
        through: {
          attributes: ['quantity']
        }
      }]
    });

    // véerife que la commande existe
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).render('error', {
        message: 'Commande introuvable'
      });
    }

    // vérife que c'est bien la commande de cet utilisateur
    if (order.user_id !== userId) {
      return res.status(StatusCodes.FORBIDDEN).render('error', {
        message: 'Accès non autorisé'
      });
    }

    // génère un numéro de commande lisible
    const orderNumber = `GR-${order.id.toString().padStart(6, '0')}`;

    // rend la vue de confirmation
    res.render('confirmation', {
      order,
      orderNumber
    });

  } catch (error) {
    console.error('Erreur confirmation:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', {
      message: 'Erreur lors de l\'affichage de la confirmation'
    });
  }
}
