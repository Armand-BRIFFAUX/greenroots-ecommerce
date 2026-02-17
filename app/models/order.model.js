import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize.client.js';

class Order extends Model {}

Order.init({
    // Montant total de la commande
    total_price: { 
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false, // Champ obligatoire
    },

    // Statut de la commande (ex: "payée", "en attente")
    status: { 
        type: DataTypes.STRING,
        allowNull: false,
    },

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
},
{
    sequelize,              // Instance Sequelize (connexion à la BDD)
    tableName: 'order',     // Nom de la table dans la base
    modelName: 'Order',     // Nom du modèle côté code
    timestamps: true,       // <-- Sequelize gère createdAt et updatedAt
}
)

export default Order;