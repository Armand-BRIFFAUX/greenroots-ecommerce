import sequelize from "../models/sequelize.client.js";
import {
  User,
  Place,
  Tree,
  PlaceHasPlant,
  Order,
  OrderHasTree,
  UserHasTree,
} from "../models/index.js";
import * as argon2 from "argon2"; // Pour hasher et vérifier les mots de passe

try {
  // force: true = supprime et recrée les donée à chaque exécution
  console.log("Réinitialisation de la base de données.");
  await sequelize.sync({ force: true });

  // Inserer des utilisateurs
  console.log("Insertion des utilisateurs.");
  const users = await User.bulkCreate([
    {
      first_name: "Alice",
      last_name: "Dupont",
      email: "alice@mail.com",
      password: await argon2.hash("password"),
      role: "client",
    },
    {
      first_name: "Bob",
      last_name: "Marley",
      email: "bob@mail.com",
      password: await argon2.hash(process.env.ADMIN_PASSWORD),
      role: "admin",
    },
  ]);

  // Insérer des lieux
  console.log("Insertion des lieux.");
  const places = await Place.bulkCreate([
    {
      name: "Turquie",
      description:
        "Riche en forêts de pins, de chênes et de cèdres, la Turquie abrite plus de 22 millions d’hectares boisés. Ses paysages variés, entre mer et montagne, témoignent d’une nature généreuse qui purifie l’air et abrite une grande biodiversité. Les forêts turques jouent un rôle essentiel dans la régénération des sols et la production d’oxygène autour du bassin méditerranéen.",
      image: "/images/places/turquie.webp",
    },
    {
      name: "Allemagne",
      description:
        "L’Allemagne est un modèle de gestion forestière durable : près d’un tiers de son territoire est couvert d’arbres. Ses hêtres, épicéas et sapins filtrent l’air et absorbent des millions de tonnes de CO₂ chaque année. Le pays prouve qu’économie moderne et respect de la nature peuvent grandir côte à côte.",
      image: "/images/places/allemagne.webp",
    },
    {
      name: "Madagascar",
      description:
        "Madagascar est un véritable sanctuaire naturel où plus de 80 % des espèces d’arbres sont endémiques. Ses forêts tropicales denses, bien que menacées, produisent une immense quantité d’oxygène et abritent une biodiversité unique. Chaque arbre planté ici participe à préserver un écosystème vital pour notre planète.",
      image: "/images/places/madagascar.webp",
    },
    {
      name: "France",
      description:
        "La France compte plus de 17 millions d’hectares de forêts, abritant plus de 138 espèces d’arbres. Des chênes centenaires de la Loire aux pins maritimes des Landes, chaque forêt raconte une histoire. Ces espaces verts jouent un rôle clé dans la lutte contre le réchauffement climatique et la protection de la faune européenne.",
      image: "/images/places/france.webp",
    },
    {
      name: "Canada",
      description:
        "Le Canada possède près de 9 % des forêts mondiales. Ses forêts boréales s’étendent sur des millions d’hectares et constituent un immense réservoir d’oxygène. Ces forêts abritent une faune riche et jouent un rôle crucial dans la régulation du climat mondial. Un poumon vert essentiel à la vie sur Terre.",
      image: "/images/places/canada.webp",
    },
    {
      name: "Népal",
      description:
        "Entre montagnes et vallées, le Népal protège ses forêts himalayennes, source d’eau pure et d’air frais. Les pins, rhododendrons et bambous de ses hauteurs soutiennent la vie locale et favorisent la stabilité des sols. Ce petit pays prouve que la nature est la meilleure alliée des communautés montagnardes.",
      image: "/images/places/nepal.webp",
    },
    {
      name: "Japon",
      description:
        "Pays des forêts sacrées et des cerisiers en fleurs, le Japon vit en harmonie avec ses arbres. Près de 68 % du territoire est couvert de forêts, mêlant traditions, spiritualité et écologie. Chaque arbre, du majestueux cèdre du Japon au délicat sakura, symbolise la force tranquille de la nature et son équilibre fragile.",
      image: "/images/places/japon.webp",
    },
    {
      name: "Chili",
      description:
        "Des Andes à la Patagonie, le Chili abrite des forêts anciennes où pousse le Fitzroya, un arbre pouvant vivre plus de 3 000 ans. Ses paysages verts et sauvages témoignent d’une nature encore préservée. Le Chili contribue à la production mondiale d’oxygène et représente un espoir pour la conservation des forêts sud-américaines.",
      image: "/images/places/chili.webp",
    },
    {
      name: "Brésil",
      description:
        "Le Brésil est le cœur vert de la planète. L’Amazonie, la plus vaste forêt du monde, produit près de 20 % de l’oxygène mondial et abrite plus de 16 000 espèces d’arbres. Véritable poumon de la Terre, elle joue un rôle irremplaçable dans la capture du carbone et la régulation du climat planétaire.",
      image: "/images/places/bresil.webp",
    },
    {
      name: "Papouasie-Nouvelle-Guinée",
      description:
        "Avec près de 75 % de son territoire recouvert de forêts tropicales, la Papouasie-Nouvelle-Guinée est l’un des joyaux les plus riches en biodiversité du Pacifique. Ses arbres géants filtrent l’air, régulent les pluies et abritent des milliers d’espèces animales et végétales encore méconnues. Un véritable trésor naturel.",
      image: "/images/places/nouvelle-guinée.webp",
    },
    {
      name: "Australie",
      description:
        "Des eucalyptus géants du sud aux forêts tropicales du Queensland, l’Australie est un continent d’arbres résilients. Malgré les feux et les sécheresses, ses forêts se régénèrent et participent activement à la capture du carbone. Un exemple de la force de la nature face aux défis du climat.",
      image: "/images/places/australie.webp",
    },
    {
      name: "Egypte",
      description:
        "Au cœur du désert, l’Égypte se réinvente grâce à des projets de reboisement ambitieux. Ses oasis et zones vertes naissantes transforment le sable en source d’oxygène et d’espoir. Ces initiatives symbolisent la renaissance d’une terre qui cherche à retrouver son équilibre écologique.",
      image: "/images/places/egypte.webp",
    },
  ]);

  //Insérer des arbres
  console.log("Insertion des arbres.");
  const trees = await Tree.bulkCreate([
    {
      name: "Chêne",
      description:
        "Arbre majestueux et robuste, symbole de force et de longévité. Son bois est très recherché en menuiserie.",
      image: "/images/chene.webp",
      price: 15.5,
      stock: 60,
      origin: "Turquie",
    },
    {
      name: "Bouleau",
      description:
        "Arbre élancé à l’écorce blanche caractéristique, souvent présent dans les forêts tempérées.",
      image: "/images/bouleau.webp",
      price: 17,
      stock: 110,
      origin: "Allemagne",
    },
    {
      name: "Baobab",
      description:
        "Arbre emblématique d’Afrique, au tronc gigantesque capable de stocker l’eau.",
      image: "/images/baobab.webp",
      price: 24,
      stock: 20,
      origin: "Madagascar",
    },
    {
      name: "Dogwoods",
      description:
        "Arbre ornemental aux fleurs délicates, très apprécié pour ses couleurs printanières.",
      image: "/images/dogwoods.webp",
      price: 17,
      stock: 100,
      origin: "France",
    },
    {
      name: "Érable à sucre",
      description:
        "Arbre emblématique du Canada, célèbre pour la production du sirop d’érable.",
      image: "/images/erable-a-sucre.webp",
      price: 20,
      stock: 85,
      origin: "Canada",
    },
    {
      name: "Cyprès de l’Himalaya",
      description:
        "Grand conifère aux aiguilles vert bleuté, résistant au froid et aux conditions extrêmes.",
      image: "/images/cypres.webp",
      price: 40,
      stock: 17,
      origin: "Népal",
    },
    {
      name: "Cerisier du Japon (sakura)",
      description:
        "Arbre symbolique du Japon, connu pour ses magnifiques fleurs roses au printemps.",
      image: "/images/cerisier-du-japon.webp",
      price: 26.5,
      stock: 55,
      origin: "Japon",
    },
    {
      name: "Araucaria du Chili",
      description:
        "Arbre aux branches géométriques uniques, parfois surnommé « désespoir des singes ».",
      image: "/images/araucaria-1249426.webp",
      price: 15,
      stock: 32,
      origin: "Chili",
    },
    {
      name: "Noyer du Brésil",
      description:
        "Arbre tropical dont les noix riches en sélénium sont très nutritives.",
      image: "/images/noyer-du-bresil.webp",
      price: 12,
      stock: 44,
      origin: "Brésil",
    },
    {
      name: "Arbre à pain",
      description:
        "Arbre tropical produisant un fruit nourrissant souvent utilisé comme base alimentaire.",
      image: "/images/arbre-a-pain.webp",
      price: 31.5,
      stock: 10,
      origin: "Papouasie-Nouvelle-Guinée",
    },
    {
      name: "Eucalyptus",
      description:
        "Arbre d’Australie à la croissance rapide, connu pour son parfum et ses huiles essentielles.",
      image: "/images/eucalyptus.webp",
      price: 25.5,
      stock: 94,
      origin: "Australie",
    },
    {
      name: "Acacia",
      description:
        "Arbre gracieux adapté aux zones arides, souvent associé aux paysages d’Afrique.",
      image: "/images/acacia.webp",
      price: 12.5,
      stock: 66,
      origin: "Egypte",
    },
  ]);

  // Lier des arbres à des lieux
  console.log("Liaison des arbres aux lieux.");
  const placeHasPlants = await PlaceHasPlant.bulkCreate([
    { place_id: places[0].id, tree_id: trees[0].id, quantity: 5 }, // Turquie - Chêne
    { place_id: places[1].id, tree_id: trees[1].id, quantity: 8 }, // Allemagne - Bouleau
    { place_id: places[2].id, tree_id: trees[2].id, quantity: 12 }, // Madagascar - Baobab
    { place_id: places[3].id, tree_id: trees[3].id, quantity: 10 }, // France - Dogwoods
    { place_id: places[4].id, tree_id: trees[4].id, quantity: 15 }, // Canada - Érable
    { place_id: places[5].id, tree_id: trees[5].id, quantity: 7 }, // Népal - Cyprès de l’Himalaya
    { place_id: places[6].id, tree_id: trees[6].id, quantity: 9 }, // Japon - Cerisier du Japon
    { place_id: places[7].id, tree_id: trees[7].id, quantity: 6 }, // Chili - Araucaria du Chili
    { place_id: places[8].id, tree_id: trees[8].id, quantity: 11 }, // Brésil - Noyer du Brésil
    { place_id: places[9].id, tree_id: trees[9].id, quantity: 4 }, // Papouasie-Nouvelle-Guinée - Arbre à pain
    { place_id: places[10].id, tree_id: trees[10].id, quantity: 13 }, // Australie - Eucalyptus
    { place_id: places[11].id, tree_id: trees[11].id, quantity: 10 }, // Égypte - Acacia
  ]);

  // Créer une commande
  console.log("Création d’une commande.");
  const orders = await Order.bulkCreate([
    {
      total_price: 40,
      status: "payé",
      user_id: users[0].id, // Alice
    },
  ]);

  // Associer des arbres à un utilisateur
  console.log("Attribution des arbres aux utilisateurs.");
  const userHasTrees = await UserHasTree.bulkCreate([
    { user_id: users[0].id, tree_id: trees[5].id }, // Alice => Cyprès de l’Himalaya
  ]);

  console.log("Données insérées avec succès !!!");
} catch (error) {
  console.error("Erreur lors du seed :", error);
}

await sequelize.close();
