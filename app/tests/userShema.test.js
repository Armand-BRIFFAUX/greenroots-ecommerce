// On importe le schéma Joi depuis le contrôleur user-controller.js
import { userSchema } from "../controllers/user-controller.js";


// Cas de tests valides (on définit une liste d’utilisateurs valides (tous respectent les règles du schéma Joi))
const validTestCases = [
  {
    description: "Utilisateur complet valide",
    data: {
      first_name: "Alice",
      last_name: "Dupont",
      email: "alice@mail.com",
      password: "motdepasse123",
      role: "client",
    },
  },
  {
    description: "Utilisateur sans rôle (doit prendre client par défaut)",
    data: {
      first_name: "Bob",
      last_name: "Marley",
      email: "bob@mail.com",
      password: "secret123",
    },
  },
];

// Cas de tests invalides (on définit une liste d'utilisateurs non valides (données manquantes, erreurs, etc.))
const invalidTestCases = [
  {
    description: "Utilisateur sans email",
    data: {
      first_name: "Jean",
      last_name: "Dupont",
      password: "superpass",
    },
  },
  {
    description: "Mot de passe trop court",
    data: {
      first_name: "Claire",
      last_name: "Roux",
      email: "claire@mail.com",
      password: "123",
    },
  },
  {
    description: "Prénom trop court",
    data: {
      first_name: "A",
      last_name: "Martin",
      email: "a@mail.com",
      password: "abcdef",
    },
  },
];

// value => contient les données validées ou corrigées par Joi
// error => contient les messages d’erreurs si quelque chose ne respecte pas le schéma

// Groupe de tests
describe("Validation du schéma Joi userSchema", () => {
  // Cas valides
  for (const testCase of validTestCases) {
    it(`${testCase.description}`, () => {

      // On valide les données avec Joi
      const { error, value } = userSchema.validate(testCase.data);

      // Vérifie que Joi n’a trouvé aucune erreur de validation
      expect(error).toBeUndefined();

      // Vérifie que Joi a bien renvoyé un objet validé (les données nettoyées et acceptées)
      expect(value).toBeDefined();

      // si le rôle n’est pas défini, on vérifie que Joi a mis 'client' par défaut
      if (!testCase.data.role) {
        expect(value.role).toBe("client");
      }
    });
  }

  // Cas invalides
  for (const testCase of invalidTestCases) {

    // Chaque test vérifie qu'une erreur est bien détectée
    it(`${testCase.description}`, () => {

      // Valide les données du test avec le schéma Joi
      const { error } = userSchema.validate(testCase.data);

      // Vérifie qu'une erreur a bien été renvoyée (car les données sont invalides)
      expect(error).toBeDefined();
    });
  }
});

// describe(...) => crée un groupe logique de tests (ici ceux du schéma userSchema).

// it(...) => définit un test individuel avec une description.

// userSchema.validate() => exécute la validation Joi sur les données du test.

// expect(...) => fait une assertion : vérifie si le résultat correspond à ce qu’on attend.

// toBeUndefined() => attend aucune erreur (les données sont valides).

// toBeDefined() => attend une erreur (les données sont invalides).
