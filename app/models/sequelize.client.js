import { Sequelize } from "sequelize"; // import de sequelize
import "dotenv/config"; // import du fichier .env

// On crée une instance de Sequelize
const sequelize = new Sequelize(process.env.PG_URL, {
    define: {
        freezeTableName: true, // Pas de pluriel pour les noms de table
        underscored: true,     // snake_case au lieu de camelCase pour les noms de colonnes/champs
}
});

//Test connection
try {
    await sequelize.authenticate();
    console.log("La connexion à la BD ok !");
} catch (error) {
    console.error("Impossible de se connecter à la BD :", error);
}


// On exporte cette instance
export default sequelize;