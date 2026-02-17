// On importe le schéma Joi à tester depuis le contrôleur place-controller.js
import { placeSchema } from "../Controllers/place-controller.js";

//  Cas valides => ces lieux doivent passer la validation
const validTestCases = [
    {
        description: "Nom de lieu valide (minimum 2 caractères)",
        data: {
            name: "Portugal",
        },
    },
    {
        description: "Nom de lieu avec espaces",
        data: {
            name: "Mont Saint Michel",
        },
    },
];

// Cas invalides => ces lieux doivent échouer à la validation
const invalidTestCases = [
    {
        description: "Nom trop court (1 caractère)",
        data: {
            name: "A",
        },
    },
    {
        description: "Nom manquant",
        data: {
            name: "",
        },
    },
    {
        description: "Nom non défini",
        data: {},
    },
    {
        description: "Nom invalide (non-string)",
        data: {
            name: 1234,
        },
    },
];

// Groupe de tests pour le schéma des lieux
describe("Validation du schéma Joi placeSchema", () => {

    // Boucle sur les cas valides
    for (const testCase of validTestCases) {
        it(testCase.description, () => {

            // Valide les données avec le schéma Joi
            const { error } = placeSchema.validate(testCase.data);

            // Vérifie qu’aucune erreur n’a été renvoyée
            expect(error).toBeUndefined();
        });
    }

    // Tests invalides — doivent renvoyer une erreur
    for (const testCase of invalidTestCases) {

        // Boucle sur les cas invalides
        it(testCase.description, () => {

            // Valide les données avec le schéma Joi
            const { error } = placeSchema.validate(testCase.data);

            // Vérifie qu’une erreur a bien été renvoyée
            expect(error).toBeDefined();
        });
    }
});


// describe(...) => crée un groupe logique de tests (ici ceux du schéma placeSchema).

// it(...) => définit un test individuel avec une description.

// placeSchema.validate() => exécute la validation Joi sur les données du test.

// expect(...) => fait une assertion : vérifie si le résultat correspond à ce qu’on attend.

// toBeUndefined() => attend aucune erreur (test valide).

// toBeDefined() => attend une erreur (test invalide).
