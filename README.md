# 🌳 GreenRoots

## 📋 Présentation

**GreenRoots** est une plateforme d'e-commerce dédiée à la reforestation. Elle permet aux utilisateurs d'acheter des arbres qui seront plantés dans différents lieux du monde pour contribuer activement à la lutte contre la déforestation et le changement climatique.

Ce projet a été développé dans le cadre d'un projet d'apothéose en équipe (Armand, Zakaria, Anne-Sophie) en utilisant la méthodologie agile.

## ✨ Fonctionnalités principales

### Pour les utilisateurs

- 🏠 **Page d'accueil** : Présentation de GreenRoots et mise en avant des arbres disponibles
- 👤 **Authentification** : Inscription et connexion sécurisées
- 🌲 **Catalogue d'arbres** : Consultation des arbres disponibles avec détails (description, prix, origine, stock)
- 📍 **Lieux de plantation** : Découverte des différents sites de plantation dans le monde
- 🛒 **Panier** : Ajout d'arbres au panier et gestion des commandes
- 📊 **Dashboard** : Suivi de l'historique de ses commandes
- 📧 **Contact** : Formulaire de contact
- 🔒 **RGPD** : Mentions légales et politique de confidentialité

### Pour les administrateurs

- ➕ **Gestion des arbres** : Création, modification et suppression d'arbres
- 🗺️ **Gestion des lieux** : Gestion des sites de plantation
- 👥 **Gestion des utilisateurs** : Administration des comptes utilisateurs

## 🛠️ Technologies utilisées

### Backend

- **Node.js** avec **Express.js** (v5.1.0)
- **PostgreSQL** pour la base de données
- **Sequelize** comme ORM
- **EJS** pour le moteur de template

### Sécurité

- **argon2** pour le hashage des mots de passe
- **jsonwebtoken** pour l'authentification JWT
- **express-session** pour la gestion des sessions
- **Joi** pour la validation des données

### Dev & Tests

- **Jest** pour les tests unitaires
- **dotenv** pour la gestion des variables d'environnement

## 📁 Structure du projet

```
greenroots-ecommerce/
├── app/
│   ├── controllers/      # Logique métier
│   ├── middlewares/      # Middlewares (auth, validation, etc.)
│   ├── migrations/       # Scripts de création et seed de la BDD
│   ├── models/           # Modèles Sequelize
│   ├── public/           # Assets statiques (CSS, images)
│   ├── routes/           # Définition des routes
│   ├── tests/            # Tests unitaires
│   └── views/            # Templates EJS
├── conception/           # Documentation du projet
│   ├── Cahier des charges/
│   ├── MLD-MCD-MPD/
│   └── Wireframe-Maquette-Charte graphique/
└── index.js              # Point d'entrée de l'application
```

## 🗄️ Modèle de données

Le projet utilise 7 tables principales :

- **user** : Utilisateurs (clients et administrateurs)
- **tree** : Arbres disponibles à l'achat
- **place** : Lieux de plantation
- **order** : Commandes des utilisateurs
- **order_has_tree** : Arbres contenus dans chaque commande
- **user_has_tree** : Association entre utilisateurs et arbres achetés
- **place_has_plant** : Arbres plantés dans chaque lieu

## 🚀 Installation et lancement

### Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL
- Git

### Installation

1. Cloner le dépôt

```bash
git clone https://github.com/Armand-BRIFFAUX/greenroots-ecommerce.git
cd greenroots-ecommerce
```

2. Installer les dépendances

```bash
npm install
```

3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/greenroots
SESSION_SECRET=votre_secret_session
JWT_SECRET=votre_secret_jwt
```

4. Initialiser la base de données

```bash
# Créer les tables
node app/migrations/create-tables.js

# Peupler la base de données
node app/migrations/seed-tables.js
```

5. Lancer l'application

**Mode développement** (avec rechargement automatique) :

```bash
npm run dev
```

**Mode production** :

```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🧪 Tests

Pour exécuter les tests :

```bash
npm test
```

## 🌐 Déploiement

Le projet est déployé avec :

- **Render** pour l'hébergement de l'application Node.js
- **Supabase** pour la base de données PostgreSQL

### Architecture de déploiement

```text
┌─────────────────┐          ┌──────────────────┐
│                 │          │                  │
│  Render.com     │ ────────▶│  Supabase        │
│  (Node.js App)  │  PG_URL  │  (PostgreSQL)    │
│                 │          │                  │
└─────────────────┘          └──────────────────┘
```

### Guide de déploiement complet

📖 **Consultez le fichier [`DEPLOYMENT.md`](./DEPLOYMENT.md)** pour le guide détaillé étape par étape.

### Résumé des étapes

1. **Créer la base de données sur Supabase**
   - Inscription sur Supabase
   - Création d'un projet PostgreSQL
   - Récupération de l'URL de connexion

2. **Déployer l'application sur Render**
   - Connexion du repository GitHub
   - Configuration des variables d'environnement
   - Build et déploiement automatique

3. **Initialiser la base de données**
   - Exécution des migrations via le Shell Render
   - Peuplement des données initiales

4. **Vérification et tests**
   - Accès à l'application déployée
   - Tests des fonctionnalités principales

## 📱 Compatibilité

- ✅ Chrome
- ✅ Firefox
- ✅ Brave
- 📱 Design responsive (Mobile First)
- ♿ Respect des normes d'accessibilité WCAG

## 🔐 Sécurité

- Protection contre les injections SQL (via Sequelize)
- Protection contre les attaques XSS
- Hashage sécurisé des mots de passe (argon2)
- Authentification par JWT
- Gestion des sessions sécurisée
- Conformité RGPD

## 📝 Évolutions possibles

- Suivi en temps réel de la croissance des arbres plantés (photos, statistiques)
- Back-office avancé pour les administrateurs
- Système de partenariats pour permettre à des associations tierces de proposer des arbres
- Intégration d'un système de paiement sécurisé (Stripe)
- Notifications par email lors des étapes importantes
- Application mobile

## 👥 Équipe

- **Armand**
- **Zakaria**
- **Anne-Sophie**

Projet réalisé dans le cadre de la formation DWWM (Développeur Web et Web Mobile).

---

**GreenRoots** - Ensemble, replantons l'avenir 🌍
