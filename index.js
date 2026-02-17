import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import homepageRouter from './app/routes/homepage.route.js';
import treeRouter from './app/routes/tree.route.js';
import contactRouter from './app/routes/contact.route.js';
import authRouter from './app/routes/auth.route.js';
import userRouter from './app/routes/user.route.js';
import placeRouter from './app/routes/place.route.js';
import './app/models/index.js';
import { decodeUserFromToken } from './app/middlewares/decodeUserFromToken-middleware.js';
import panierRouter from './app/routes/panier.route.js';
import rgpdRouter from './app/routes/rgpd.route.js';


const app = express();

const PORT = process.env.PORT || 3000;

// Permet à Express de lire les données JSON envoyées dans les requêtes POST/PUT
app.use(express.json());
// Middleware pour lire les cookies dans les requêtes
app.use(cookieParser());
// Permet à Express de lire les données des formulaires (req.body), y compris les objets imbriqués
app.use(express.urlencoded({ extended: true }));

// configuration de la session panier
app.use(session({
  // clé de chiffrement
  secret: process.env.SESSION_SECRET,
  // pas de sauvegarde inutile
  resave: false,
  //pas de session vide
  saveUninitialized: false,
  // expire après 24h
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.set('view engine', 'ejs');
app.set('views', './app/views');
app.use(express.static('./app/public'));

// middleware global : lit le token, sans bloquer personne
app.use(decodeUserFromToken);


app.use('/', homepageRouter);
app.use('/', authRouter);
app.use('/contact', contactRouter);
app.use('/rgpd', rgpdRouter);


app.use('/trees', treeRouter);
app.use('/users', userRouter);
app.use('/places', placeRouter);

app.use('/panier', panierRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});