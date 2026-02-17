// On importe le schéma Joi à tester depuis le contrôleur user-controller.js
import { userUpdateSchema } from "../Controllers/user-controller.js";

// Cas valides
const validTestCases = [
    {
        description: "Toutes les données requises sont valides",
        data: {
            first_name: "Jean",
            last_name: "Dupont",
            email: "jean@mail.com",
            role: "admin",
        },
    },
];

// Cas invalides
const invalidTestCases = [
    {
        description: "Utilisateur sans rôle",
        data: {
            first_name: "Jean",
            last_name: "Dupont",
            email: "jean@mail.com",
        },
    },
    {
        description: "Utilisateur sans prénom",
        data: {
            last_name: "Dupont",
            email: "jean@mail.com",
            role: "client",
        },
    },
];

// value => contient les données validées ou corrigées par Joi
// error => contient les messages d’erreurs si quelque chose ne respecte pas le schéma

// Groupe de tests
describe("Validation du schéma Joi userUpdateSchema", () => {

    //Boucle sur les cas valides
    for (const testCase of validTestCases) {

        it(testCase.description, () => { // nom du test dans description

            // On valide les données avec Joi
            const { error } = userUpdateSchema.validate(testCase.data);

            // On s'attend à ne pas avoir d'erreur
            expect(error).toBeUndefined();
        });
    }

    // Boucle sur les cas invalides
    for (const testCase of invalidTestCases) {
        it(testCase.description, () => {

            // Valide les données avec Joi
            const { error } = userUpdateSchema.validate(testCase.data);

            // On s'attend à une erreur de validation
            expect(error).toBeDefined();
        });
    }
});

// describe(...) => groupe les tests pour le schéma userUpdateSchema.

// it(...) => crée un test individuel (chaque cas est testé séparément).

// userUpdateSchema.validate() => vérifie les données selon le schéma Joi de mise à jour.

// expect(...) => vérifie que le résultat correspond à l’attente (succès ou erreur).

// toBeUndefined() => aucune erreur attendue pour les cas valides.

// toBeDefined() => une erreur est attendue pour les cas invalides.
