import sequelize from '../models/sequelize.client.js';
import "../models/index.js"; // charge les modèles et leurs associations

try {
  // force: true = supprime et recrée les tables à chaque exécution
  await sequelize.sync({ force: true });

  // Récupérer la liste des tables
  const tables = await sequelize.getQueryInterface().showAllTables();
  console.log("Base de données synchroniser avec succès !!!", tables);

  // Afficher la liste des champs de chaques tables :
  for (const tableName of tables) {
    const tableDescription = await sequelize.getQueryInterface().describeTable(tableName);
    console.log(`Champs de la table ${tableName} :`, tableDescription);
  }
} catch (error) {
  console.error("Erreur lors de la synchronisation de la base de données :", error);
}

sequelize.close(); // ferme la connexion proprement