// Fichier d’association des modèles Sequelize
// Ce fichier définit toutes les relations entre les tables

// Importation des modèles
import User from './user.model.js';
import Place from './place.model.js';
import Tree from './tree.model.js';
import PlaceHasPlant from './place_has_plant.model.js';
import Order from './order.model.js';
import OrderHasTree from './order_has_tree.model.js';
import UserHasTree from './user_has_tree.model.js';

//Place - Tree (via PlaceHasPlant)

//Un lieu peut contenir plusieurs types d’arbres
Place.hasMany(PlaceHasPlant, {
  foreignKey: 'place_id', // clé étrangère dans place_has_plant
  onDelete: 'CASCADE',
});
PlaceHasPlant.belongsTo(Place, {
  foreignKey: 'place_id', // référence la colonne place_id
  onDelete: 'CASCADE',
});

// Un arbre peut être présent dans plusieurs lieux
Tree.hasMany(PlaceHasPlant, {
  foreignKey: 'tree_id', // clé étrangère dans place_has_plant
  onDelete: 'CASCADE',
});
PlaceHasPlant.belongsTo(Tree, {
  foreignKey: 'tree_id', // référence la colonne tree_id
  onDelete: 'CASCADE',
});

// Relation many-to-many entre Place et Tree
Place.belongsToMany(Tree, {
  through: PlaceHasPlant, // table de liaison
  foreignKey: 'place_id', // clé étrangère vers Place
  otherKey: 'tree_id', // clé étrangère vers Tree
});
Tree.belongsToMany(Place, {
  through: PlaceHasPlant, // table de liaison
  foreignKey: 'tree_id',
  otherKey: 'place_id',
});

//User - Order

//Un utilisateur peut avoir plusieurs commandes
User.hasMany(Order, {
  foreignKey: 'user_id', // clé étrangère dans la table Order
  onDelete: 'CASCADE',
});
Order.belongsTo(User, {
  foreignKey: 'user_id', // référence l'utilisateur ayant passé la commande
  onDelete: 'CASCADE',
});

//Order - Tree (via OrderHasTree)

// Une commande peut contenir plusieurs arbres
Order.belongsToMany(Tree, {
  through: OrderHasTree, // table intermédiaire
  foreignKey: 'order_id', // clé étrangère vers Order
  otherKey: 'tree_id', // clé étrangère vers Tree
  onDelete: 'CASCADE',
});

// Un arbre peut apparaître dans plusieurs commandes
Tree.belongsToMany(Order, {
  through: OrderHasTree, // même table de liaison
  foreignKey: 'tree_id',
  otherKey: 'order_id',
  onDelete: 'CASCADE',
});

//Order - OrderHAsTree
Order.hasMany(OrderHasTree, {
  foreignKey: 'order_id',
  onDelete: 'CASCADE',
});

OrderHasTree.belongsTo(Order, {
  foreignKey: 'order_id',
  onDelete: 'CASCADE',
});

//Tree - OrderHasTree
Tree.hasMany(OrderHasTree, {
  foreignKey: 'tree_id',
  onDelete: 'CASCADE',
});

OrderHasTree.belongsTo(Tree, {
  foreignKey: 'tree_id',
  onDelete: 'CASCADE',
});

//User - Tree (via UserHasTree)

//Pour suivre quels arbres appartiennent à quels utilisateurs
User.belongsToMany(Tree, {
  through: UserHasTree, // table de liaison user_has_tree
  foreignKey: 'user_id', // clé étrangère vers User
  otherKey: 'tree_id', // clé étrangère vers Tree
  onDelete: 'CASCADE',
});

Tree.belongsToMany(User, {
  through: UserHasTree,
  foreignKey: 'tree_id', // clé étrangère vers Tree
  otherKey: 'user_id',
  onDelete: 'CASCADE',
});

User.hasMany(UserHasTree, {
  foreignKey: 'user_id', // clé étrangère vers User
  onDelete: 'CASCADE',
});

UserHasTree.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Tree.hasMany(UserHasTree, {
  foreignKey: 'tree_id',
  onDelete: 'CASCADE',
});

UserHasTree.belongsTo(Tree, {
  foreignKey: 'tree_id',
  onDelete: 'CASCADE',
});

export {
  User,
  Place,
  Tree,
  PlaceHasPlant,
  Order,
  OrderHasTree,
  UserHasTree,
};