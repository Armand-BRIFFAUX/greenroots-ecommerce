import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize.client.js';

class User extends Model {}

User.init({
    last_name: {
        type: DataTypes.STRING,
        allowNull: false        // Le nom de la catégorie est obligatoire (non null)
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,      // Validation du format email
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('client', 'admin'),
        defaultValue: 'client',     // Rôle par défaut => client
        allowNull: false,
    },
},
{
    sequelize,
    tableName: 'user',
    modelName: 'User',
    timestamps: true,       // <-- Sequelize gère createdAt et updatedAt
}
)

export default User;