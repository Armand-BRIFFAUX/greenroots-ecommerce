// On importe la fonction à tester depuis isAdmin-middleware.js
import { isUserAdmin } from "../Middlewares/isAdmin-middleware.js";

describe(" Test unitaire de isUserAdmin()", () => {

    // Liste des scénarios à tester
    const testCases = [
        { description: "retourne true si le rôle est admin", role: "admin", expected: true },
        { description: "retourne false si le rôle est client", role: "client", expected: false },
        { description: "retourne false si le rôle est vide", role: "", expected: false },
        { description: "retourne false si le rôle est null", role: null, expected: false },
        { description: "retourne false si le rôle est undefined", role: undefined, expected: false },
    ];

    // Boucle sur tous les scénarios à tester
    for (const testCase of testCases) {

        // Chaque it() correspond à un test individuel
        it(testCase.description, () => {

            // On appelle la fonction à tester avec le rôle fourni
            const result = isUserAdmin(testCase.role);

            // On vérifie que le résultat est bien celui attendu
            expect(result).toBe(testCase.expected);
        });
    }

});
