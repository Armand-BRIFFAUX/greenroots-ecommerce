import { StatusCodes } from "http-status-codes";
import { jest } from "@jest/globals"; // Donne accès à Jest (le framework de test) dans les fichiers ES Modules.
// On importe le CoreController à tester depuis le contrôleur core-controller.js
import CoreController from "../controllers/core-controller.js";


//vérifie que la méthode getById() du core-controller.js fonctionne bien
describe("Tests de la méthode getById du CoreController", () => {

  // Avant de lancer les tests :
  // Jest va "espionner" la fonction console.error() de Node.js
  // et remplacer son comportement par une fonction vide (() => {}).
  // Cela empêche d'afficher les messages d'erreur rouges (ex: "Database crash")
  // qui proviennent du contrôleur pendant les tests.
  // Ces messages sont normaux (ils font partie du test du cas d'erreur),
  // mais ils polluent visuellement la console.
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => { }); // désactive console.error()
  });

  // Après avoir exécuté tous les tests :
  // On restaure le comportement normal de console.error()
  // pour que les erreurs s'affichent de nouveau dans la console
  // (important si d'autres tests utilisent console.error ensuite).
  afterAll(() => {
    console.error.mockRestore(); // restaure le comportement normal à la fin
  });

  // Création d’un faux modèle de base de données
  // Ce modèle simulera Sequelize (aucune vraie bdd n’est utilisée)
  const fakeDatabase = {
    name: "Tree",
    findByPk: jest.fn(), // crée une fausse fonction (mock) qui imite la vraie méthode findByPk() de Sequelize.
  };

  // Schéma de validation factice
  const fakeValidationSchema = {}; //Pas utilisé ici (il sert pour create() ou update()),
  // mais le contrôleur en a besoin dans son constructeur, donc on le met vide.

  // Création du contrôleur avec les éléments simulés
  const controller = new CoreController(fakeDatabase, fakeValidationSchema, "trees");

  // On prépare des objets simulés pour Express (req et res)
  let fakeRequest;
  let fakeResponse;

  // Avant chaque test individuel (it(...))
  // Jest exécute automatiquement ce bloc pour tout remettre à zéro.
  // Cela garantit que chaque test part d’un environnement propre et indépendant.
  beforeEach(() => {

    // On crée une fausse requête Express (req)
    // Ici, on simule une URL du type "/trees/1"
    // Donc l’objet req.params contient un id = 1
    fakeRequest = { params: { id: 1 } };

    // On crée une fausse réponse Express (res)
    fakeResponse = {

      // 'status' simule la méthode Express res.status()
      // mockReturnThis() permet le chaînage de méthodes :
      // ex : res.status(200).render("vue") ne plantera pas,
      // car 'status' renvoie l’objet res lui-même (this)
      status: jest.fn().mockReturnThis(),

      // 'render' simule le rendu d'une vue EJS
      // On vérifie ensuite avec expect() si elle a été appelée correctement.
      render: jest.fn(),
    };

    // Nettoie les appels précédents entre chaque test
    // Cela évite qu’un test soit pollué par les appels d’un test précédent.
    jest.clearAllMocks();
  });

  // Liste des différents cas que l'on veut tester pour getById()
  const testCases = [
    {
      description: "Cas 1 : L'élément existe => doit afficher la vue 'detail'",

      // Ce que la fausse base de données (fakeDatabase) doit renvoyer
      simulatedDatabaseResult: { id: 1, name: "Chêne" },

      // Le code HTTP attendu
      expectedStatusCode: StatusCodes.OK,

      // Le nom de la vue EJS attendue
      expectedView: "trees/detail",

      // Les données que la vue devrait recevoir
      expectedViewData: {
        title: "Tree #1",
        item: { id: 1, name: "Chêne" },
      },
    },
    {
      description: "Cas 2 : L'élément n'existe pas => erreur 404",
      simulatedDatabaseResult: null,
      expectedStatusCode: StatusCodes.NOT_FOUND,
      expectedView: "error",
      expectedViewData: { message: "Élément non trouvé." },
    },
  ];

  // On parcourt chaque testCases pour le tester automatiquement
  for (const testCase of testCases) {
    it(testCase.description, async () => {

      // On simule le comportement de la base de données (Sequelize) selon le scénario de test.
      // mockResolvedValueOnce() permet de simuler une fonction asynchrone qui renvoie une promesse résolue.
      // Autrement dit, on fait “comme si” la base de données avait répondu avec testCase.simulatedDatabaseResult.
      // Cela permet de tester la logique du contrôleur (élément trouvé ou non trouvé)
      // sans interroger une vraie base de données.
      fakeDatabase.findByPk.mockResolvedValueOnce(testCase.simulatedDatabaseResult);

      // Appelle la méthode du contrôleur
      await controller.getById(fakeRequest, fakeResponse);

      // Vérifie que la méthode res.status() a bien été appelée avec le bon code HTTP
      // toHaveBeenCalledWith() => Vérifie que la fonction a été appelée avec ces arguments précis.
      expect(fakeResponse.status).toHaveBeenCalledWith(testCase.expectedStatusCode);

      // Vérifie que res.render() a été appelé avec :
      // - la bonne vue EJS (testCase.expectedView)
      // - un objet contenant au moins les propriétés attendues (par exemple le titre et l’élément à afficher)
      // => expect.objectContaining() permet de ne pas exiger que l’objet soit identique à 100%.
      // Le test réussira même si le contrôleur ajoute d’autres propriétés (ex: date, user, etc.)
      expect(fakeResponse.render).toHaveBeenCalledWith(
        testCase.expectedView,
        expect.objectContaining(testCase.expectedViewData)
      );
    });
  }


  // Cas d’erreur serveur (ex: problème de base de données)
  it("Cas 3 : Erreur interne => doit afficher une erreur 500", async () => {
    fakeDatabase.findByPk.mockRejectedValueOnce(new Error("Database crash"));

    await controller.getById(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(fakeResponse.render).toHaveBeenCalledWith("error", { message: "Erreur serveur.", });
  });
});
