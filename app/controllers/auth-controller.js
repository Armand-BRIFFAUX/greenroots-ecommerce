import jwt from 'jsonwebtoken'; // Pour créer et vérifier les tokens JWT
import * as argon2 from 'argon2'; // Pour hasher et vérifier les mots de passe
import { StatusCodes } from 'http-status-codes';
import User from '../models/user.model.js';
import Order from '../models/order.model.js'
import OrderHasTree from '../models/order_has_tree.model.js';
import Tree from '../models/tree.model.js';
import Place from '../models/place.model.js';

//REGISTER => Créer un nouvel utilisateur (avec hash du mot de passe)
export async function register(req, res) {

  // On récupère les données envoyées dans la requête
  const { first_name, last_name, email, password, confirm_password } = req.body;

  if (!first_name || !last_name || !email || !password || !confirm_password) { // Vérifie que tous les champs sont fournis
    return res.status(StatusCodes.BAD_REQUEST).render('register', { error: 'Champs manquants' });
  }
  if (password !== confirm_password) { // Vérifie que les mots de passe correspondent
    return res.status(StatusCodes.BAD_REQUEST).render('register', { error: 'Les mots de passe ne correspondent pas' });
  }

  try {
    // Vérifie si un utilisateur existe déjà avec cet email
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) { // Si oui, renvoie une erreur de conflit (code 409)
      return res.status(StatusCodes.CONFLICT).render('register', { error: 'Email déjà utilisé' });
    }

    // Hache le mot de passe avec Argon2
    const hash = await argon2.hash(password);

    // Crée un nouvel utilisateur dans la base de données
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hash, // On stocke le mot de passe haché
      role: 'client', // Rôle par défaut
    });

    // Redirige vers la page de login après inscription réussie
    res.redirect('/login');

  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('register', { error: 'Erreur interne du serveur' });
  }
}

// LOGIN => Vérifie les identifiants et génère un token JWT
export async function login(req, res) {

  // Récupère les données envoyées par l’utilisateur
  const { email, password } = req.body;

  // Vérifier que l’email et le mot de passe sont fournis
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).render('login', { error: 'Email et mot de passe requis' });
  }

  try {
    // Recherche un utilisateur correspondant à l’email fourni
    const user = await User.findOne({ where: { email } });

    if (!user) { // Si aucun utilisateur trouvé => erreur d’authentification
      return res.status(StatusCodes.UNAUTHORIZED).render('login', { error: 'Email ou mot de passe incorrect' });
    }

    // Récupère le mot de passe haché stocké en base
    const hash = user.password;

    // Vérifie si le mot de passe saisi correspond au hash
    const ok = await argon2.verify(hash, password);

    if (!ok) { // Si la vérification échoue => mauvais mot de passe
      return res.status(StatusCodes.UNAUTHORIZED).render('login', { error: 'Identifiants incorrects' });
    }

    // Crée un token JWT contenant les infos de l’utilisateur
    const token = jwt.sign(
      {
        id: user.id, // ID utilisateur
        email: user.email, // Email utilisateur
        role: user.role, // Rôle utilisateur
      },

      process.env.JWT_SECRET, // Clé secrète pour signer le token

      { expiresIn: '1h' } // Le token expire après 1 heure

    );

    // Stocke le token dans un cookie (pour la session)
    res.cookie('token', token, { httpOnly: true });

    // Redirige vers le tableau de bord
    res.redirect('/dashboard');

  } catch (error) {

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('login', { error: 'Erreur interne du serveur' });

  }
}

//GET CURRENT USER INFO => Récupère les infos du user connecté
export async function getCurrentUserInfo(req, res) {

  try {

    // Vérifie qu’un utilisateur est bien authentifié
    if (!req.userId) {
      return res.status(StatusCodes.UNAUTHORIZED).render('login', { error: 'Veuillez vous connecter pour accéder à votre profil.' });
    }

    // Récupère l’ID utilisateur depuis le token (c’est le middleware auth-middleware.js qui l’a ajouté à req)
    const userId = req.userId;

    // Cherche l’utilisateur et ses relations (arbres + lieux)
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }, // Ne pas renvoyer le mot de passe
      include: [
        {
          model: Order,
          include: [
            {
              model: OrderHasTree,
              include: [
                {
                  model: Tree,
                  include: [
                    {
                      model: Place,
                      through: { attributes: [] }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    console.log(JSON.stringify(user ? user.toJSON() : user, null, 2));

    if (!user) { // Si aucun utilisateur trouvé => erreur 404
      return res.status(StatusCodes.NOT_FOUND).render('login', { error: 'Utilisateur non trouvé' });
    }

    // Renvoie la vue EJS avec les données utilisateur
    res.status(StatusCodes.OK).render('dashboard', {
      title: 'Mon profil',
      user
    });


  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('login', { error: 'Erreur interne du serveur' });
  }
};
