import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize.client.js';

class Tree extends Model {}

Tree.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false        // Le nom de la catégorie est obligatoire (non null)
    },
    description: {
        type: DataTypes.STRING,
    },
    image : {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
},
{
    sequelize,              // Instance Sequelize (connexion à la BDD)
    tableName: 'tree',     // Nom de la table dans la base
    modelName: 'Tree',     // Nom du modèle côté code
    timestamps: true,       // <-- Sequelize gère createdAt et updatedAt
}
)

export default Tree;