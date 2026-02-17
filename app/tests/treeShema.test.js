// On importe le schéma Joi à tester depuis le contrôleur tree-controller.js
import { treeSchema } from "../Controllers/tree-controller.js";

// Cas valides => ces arbres doivent passer la validation
const validTestCases = [
    {
        description: "Arbre complet valide avec URL d’image absolue",
        data: {
            name: "Chêne",
            description: "Arbre majestueux et robuste",
            image: "https://example.com/image.jpg",
            price: 15.5,
            stock: 10,
            origin: "France",
        },
    },
    {
        description: "Arbre avec chemin d’image relatif",
        data: {
            name: "Bouleau",
            description: "Arbre élancé",
            image: "/images/bouleau.jpg",
            price: 18,
            stock: 20,
            origin: "Allemagne",
        },
    },
    {
        description: "Arbre sans image (champ vide autorisé)",
        data: {
            name: "Baobab",
            description: "",
            image: "",
            price: 25,
            stock: 5,
            origin: "Madagascar",
        },
    },
];

// Cas invalides => ces arbres doivent échouer à la validation
const invalidTestCases = [
    {
        description: "Nom trop court",
        data: {
            name: "A", // name doit avoir min 2 caractères
            description: "Nom invalide",
            image: "/images/test.jpg",
            price: 12,
            stock: 5,
            origin: "France",
        },
    },
    {
        description: "Image invalide (mauvais format)",
        data: {
            name: "Palmier",
            description: "Arbre tropical",
            image: "dossier/local/image.png", // image doit être une URL ou un chemin /images/
            price: 22,
            stock: 7,
            origin: "Cuba",
        },
    },
    {
        description: "Prix négatif",
        data: {
            name: "Cèdre",
            description: "Arbre à feuilles persistantes",
            image: "/images/cedre.jpg",
            price: -5, // le prix doit être positif
            stock: 10,
            origin: "Liban",
        },
    },
    {
        description: "Stock négatif",
        data: {
            name: "Sapin",
            description: "Arbre de Noël",
            image: "/images/sapin.jpg",
            price: 30,
            stock: -3, // le stock doit être >= 0
            origin: "Canada",
        },
    },
    {
        description: "Origine trop courte",
        data: {
            name: "Olivier",
            description: "Arbre méditerranéen",
            image: "/images/olivier.jpg",
            price: 40,
            stock: 4,
            origin: "A", // trop court
        },
    },
];

// value => contient les données validées ou corrigées par Joi
// error => contient les messages d’erreurs si quelque chose ne respecte pas le schéma

describe("Validation du schéma Joi treeSchema", () => {
    // Cas valides
    for (const testCase of validTestCases) {
            it(testCase.description, () => {

                // validation Joi
                const { error } = treeSchema.validate(testCase.data);

                // aucune erreur attendue
                expect(error).toBeUndefined();
        });
    }

    // Cas invalides
    for (const testCase of invalidTestCases) {
        it(testCase.description, () => {

            // validation Joi
            const { error } = treeSchema.validate(testCase.data);

            // une erreur est attendue
            expect(error).toBeDefined();
        });
    }
    });

// describe(...) => groupe logique de tests pour valider le schéma Joi des arbres (treeSchema).

// it(...) => définit un test pour un cas précis (valide ou invalide).

// treeSchema.validate() => exécute la validation Joi sur les données de chaque arbre.

// expect(...) => compare le résultat de la validation avec l’attente.

// toBeUndefined() => aucune erreur détectée, donc les données sont valides.

// toBeDefined() => erreur détectée, donc les données sont invalides.

