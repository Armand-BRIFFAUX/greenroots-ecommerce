import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize.client.js';

class OrderHasTree extends Model {}

OrderHasTree.init({
    // Quantité d'arbres achetés dans la commande
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    // Clé étrangère vers Tree
    tree_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
            references: {
                model: 'tree', // Nom de la table référencée
                key: 'id',
            },
        onDelete: 'CASCADE', // Si l'arbre est supprimé → suppression automatique
    },

    // Clé étrangère vers Order
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'order', // Nom de la table référencée
            key: 'id',
        },
        onDelete: 'CASCADE', // Si la commande est supprimée → suppression automatique
    },
},
{
    sequelize,              // Instance Sequelize (connexion à la BDD)
    tableName: 'order_has_tree',     // Nom de la table dans la base
    modelName: 'OrderHasTree',     // Nom du modèle côté code
    timestamps: true,       // <-- Sequelize gère createdAt et updatedAt
}
)

export default OrderHasTree ;