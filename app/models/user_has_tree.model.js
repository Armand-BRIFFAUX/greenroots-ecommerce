import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize.client.js';

class UserHasTree extends Model {}

UserHasTree.init({

    // Clé étrangère vers User
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user', // Nom de la table référencée
            key: 'id',
        },
    onDelete: 'CASCADE', // Si l'utilisateur est supprimé → suppression automatique
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
},
{
    sequelize,              // Instance Sequelize (connexion à la BDD)
    tableName: 'user_has_tree',     // Nom de la table dans la base
    modelName: 'UserHasTree',     // Nom du modèle côté code
    timestamps: true,       // <-- Sequelize gère createdAt et updatedAt
}
)

export default UserHasTree;