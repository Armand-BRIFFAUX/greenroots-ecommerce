# 🚀 Guide de déploiement GreenRoots

Ce guide détaille le déploiement de l'application **GreenRoots** avec :

- **Supabase** pour la base de données PostgreSQL
- **Render** pour l'hébergement de l'application Node.js

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :

- ✅ Un compte GitHub avec le repository `dwwm-greenroots` poussé
- ✅ Votre branche de production prête (ex: `admin` ou `main`)
- ✅ Tous les fichiers nécessaires committés et pushés
- ✅ Le fichier `.env` **NON commité** (doit être dans `.gitignore`)

---

## 🗄️ PARTIE 1 : Créer la base de données sur Supabase

### Étape 1.1 : Créer un compte Supabase

1. Allez sur **[https://supabase.com/](https://supabase.com/)**
2. Cliquez sur **"Start your project"** ou **"Sign Up"**
3. Connectez-vous avec GitHub (recommandé) ou créez un compte email

### Étape 1.2 : Créer un nouveau projet

1. Une fois connecté, cliquez sur **"New Project"**
2. Sélectionnez votre organisation (ou créez-en une)
3. Remplissez les informations du projet :
   - **Name** : `greenroots-db` (ou le nom de votre choix)
   - **Database Password** : Générez un mot de passe fort (cliquez sur "Generate a password")
     - ⚠️ **IMPORTANT** : Copiez et sauvegardez ce mot de passe immédiatement !
     - Vous en aurez besoin pour l'URL de connexion
   - **Region** : Choisissez **"Europe (Frankfurt)"** ou **"Europe (Paris)"** (plus proche)
   - **Pricing Plan** : Sélectionnez **"Free"** (largement suffisant pour débuter)

4. Cliquez sur **"Create new project"**
   - ⏳ La création prend environ 1-2 minutes

### Étape 1.3 : Récupérer l'URL de connexion PostgreSQL

1. Une fois le projet créé, allez dans **Settings** (icône ⚙️ dans le menu de gauche)

2. Cliquez sur **"Database"** dans le sous-menu

3. Descendez jusqu'à la section **"Connection string"**

4. Sélectionnez l'onglet **"URI"** (ou **"Connection pooling"** - recommandé pour éviter les limites)

5. Vous verrez une URL au format :

   ```
   postgresql://postgres.xxxxxxxxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```

6. **Copiez cette URL** et remplacez `[YOUR-PASSWORD]` par le mot de passe que vous avez sauvegardé à l'étape 1.2

7. **Format final** de votre URL :

   ```
   postgresql://postgres.xxxxxxxxx:votre_mot_de_passe_fort@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```

8. ⚠️ **Sauvegardez cette URL complète**, vous en aurez besoin pour Render !

### Étape 1.4 : (Optionnel) Tester la connexion

Si vous voulez vérifier que tout fonctionne, vous pouvez aller dans l'onglet **"Table Editor"** de Supabase. Vous devriez voir une interface vide (normal, aucune table n'est créée pour l'instant).

---

## 🌐 PARTIE 2 : Déployer l'application sur Render

### Étape 2.1 : Créer un compte Render

1. Allez sur **[https://render.com/](https://render.com/)**
2. Cliquez sur **"Get Started for Free"** ou **"Sign Up"**
3. Connectez-vous avec GitHub (recommandé)
4. Autorisez Render à accéder à vos repositories GitHub

### Étape 2.2 : Créer un nouveau Web Service

1. Une fois connecté, dans le Dashboard, cliquez sur **"New +"** (en haut à droite)

2. Sélectionnez **"Web Service"**

3. **Connecter votre repository** :
   - Si c'est votre premier déploiement, cliquez sur **"Connect a repository"**
   - Si vous ne le voyez pas, cliquez sur **"Configure account"** pour autoriser l'accès

4. Cliquez sur **"Connect"** à côté de votre repository

### Étape 2.3 : Configurer le Web Service

Remplissez les informations suivantes :

#### Informations de base

- **Name** : `greenroots` (ou `greenroots-app`)
  - ℹ️ Ce nom sera dans votre URL : `https://greenroots.onrender.com`
- **Region** : **Europe (Frankfurt)** (même région que Supabase)
- **Branch** : `admin` (ou `main` selon votre branche de production)
- **Root Directory** : Laisser **vide** (votre `package.json` est à la racine)

#### Runtime

- **Runtime** : **Node**
  - Render détecte automatiquement Node.js grâce à votre `package.json`

#### Build & Deploy

- **Build Command** :

  ```bash
  npm install
  ```

- **Start Command** :
  ```bash
  npm start
  ```

#### Instance Type

- **Instance Type** : Sélectionnez **"Free"**
  - ℹ️ Limitations : Le service s'endort après 15 min d'inactivité
  - Premier accès peut prendre 30-50 secondes (réveil)

### Étape 2.4 : Configurer les variables d'environnement

⚠️ **TRÈS IMPORTANT** : Avant de cliquer sur "Create Web Service", descendez jusqu'à la section **"Environment Variables"**

Cliquez sur **"Add Environment Variable"** et ajoutez les variables suivantes **une par une** :

#### Variable 1 : PORT

- **Key** : `PORT`
- **Value** : `10000`

#### Variable 2 : PG_URL

- **Key** : `PG_URL`
- **Value** : Collez l'URL complète de Supabase (celle de l'étape 1.3)
  ```
  postgresql://postgres.xxxxxxxxx:votre_mot_de_passe@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
  ```

#### Variable 3 : JWT_SECRET

- **Key** : `JWT_SECRET`
- **Value** : Générez une clé secrète forte

**Comment générer une clé forte :**

Ouvrez un terminal sur votre machine et exécutez :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiez le résultat (ex: `a1b2c3d4e5f6...`) et collez-le comme valeur.

#### Variable 4 : SESSION_SECRET

- **Key** : `SESSION_SECRET`
- **Value** : Générez une **autre** clé secrète forte (différente de JWT_SECRET)

Exécutez à nouveau :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Variable 5 : PERENUAL_TOKEN (si nécessaire)

- **Key** : `PERENUAL_TOKEN`
- **Value** : Votre clé API Perenual (si vous l'utilisez)
  - Si vous ne l'utilisez pas, vous pouvez omettre cette variable

#### Variable 6 : NODE_ENV

- **Key** : `NODE_ENV`
- **Value** : `production`

### Récapitulatif des variables d'environnement

```env
PORT=10000
PG_URL=postgresql://postgres.xxxxx:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
JWT_SECRET=votre_clé_jwt_générée_aléatoirement
SESSION_SECRET=votre_clé_session_générée_aléatoirement
PERENUAL_TOKEN=votre_clé_api_perenual_si_nécessaire
NODE_ENV=production
```

### Étape 2.5 : Lancer le déploiement

1. Vérifiez que toutes les variables d'environnement sont bien configurées

2. Cliquez sur **"Create Web Service"** (en bas de la page)

3. Render va automatiquement :
   - 🔄 Cloner votre repository
   - 📦 Installer les dépendances (`npm install`)
   - 🚀 Démarrer l'application (`npm start`)

4. Suivez les logs en temps réel :
   - Vous devriez voir défiler les logs d'installation
   - À la fin, vous devriez voir : `Server listening on port 10000`

5. ⏳ Le premier déploiement prend environ **2-5 minutes**

---

## 🗃️ PARTIE 3 : Initialiser la base de données

Votre application est déployée, mais la base de données Supabase est vide. Il faut créer les tables et insérer les données.

### Étape 3.1 : Accéder au Shell de Render

1. Dans votre Web Service sur Render, allez dans l'onglet **"Shell"** (dans le menu de gauche)

2. Un terminal s'ouvre dans l'environnement de votre application

### Étape 3.2 : Créer les tables

Dans le Shell, exécutez la commande suivante :

```bash
node app/migrations/create-tables.js
```

**Ce que fait cette commande :**

- Crée toutes les tables de votre base de données (user, tree, place, order, etc.)
- Établit les relations entre les tables

**Résultat attendu :**

- Vous devriez voir des messages confirmant la création des tables
- Si vous voyez des erreurs, vérifiez que votre `PG_URL` est correct

### Étape 3.3 : Peupler la base de données

Ensuite, exécutez :

```bash
node app/migrations/seed-tables.js
```

**Ce que fait cette commande :**

- Insère les données initiales (arbres, lieux, utilisateurs de test, etc.)

**Résultat attendu :**

- Des messages confirmant l'insertion des données
- Votre base est maintenant prête !

### Étape 3.4 : Vérifier dans Supabase (optionnel)

1. Retournez sur Supabase
2. Allez dans **"Table Editor"**
3. Vous devriez maintenant voir toutes vos tables (user, tree, place, etc.)
4. Cliquez sur une table pour voir les données insérées

---

## ✅ PARTIE 4 : Vérifier le déploiement

### Étape 4.1 : Accéder à l'application

1. Dans Render, en haut de la page de votre Web Service, vous verrez l'URL de votre application :

   ```
   https://greenroots.onrender.com
   ```

2. Cliquez dessus ou copiez-collez dans votre navigateur

3. **Si c'est la première requête après un moment d'inactivité** :
   - ⏳ L'app peut mettre 30-50 secondes à démarrer (réveil du service gratuit)
   - Soyez patient !

4. Vous devriez voir la page d'accueil de GreenRoots ! 🌳

### Étape 4.2 : Tester les fonctionnalités principales

Testez les fonctionnalités suivantes pour vous assurer que tout fonctionne :

✅ **Page d'accueil**

- La page se charge correctement
- Les images s'affichent

✅ **Catalogue d'arbres**

- Les arbres s'affichent (issus de la BDD)
- Les détails d'un arbre sont accessibles

✅ **Inscription / Connexion**

- Créez un nouveau compte
- Connectez-vous

✅ **Panier**

- Ajoutez un arbre au panier
- Validez une commande

✅ **Dashboard utilisateur**

- Affichez l'historique de vos commandes

### Étape 4.3 : Surveiller les logs

Si quelque chose ne fonctionne pas :

1. Allez dans l'onglet **"Logs"** de Render
2. Recherchez les erreurs (en rouge)
3. Les erreurs courantes :
   - ❌ `ECONNREFUSED` → Problème de connexion à la BDD (vérifiez `PG_URL`)
   - ❌ `relation "user" does not exist` → Les tables ne sont pas créées (refaire l'étape 3)
   - ❌ `invalid signature` → Problème avec `JWT_SECRET` ou `SESSION_SECRET`

---

## 🔄 Déploiements futurs

### Déploiement automatique

Par défaut, Render redéploie automatiquement votre application **à chaque push** sur la branche configurée (`admin` ou `main`).

**Processus :**

1. Vous faites des modifications localement
2. Vous commit et push sur GitHub :
   ```bash
   git add .
   git commit -m "Ajout d'une nouvelle fonctionnalité"
   git push origin admin
   ```
3. Render détecte le push et redéploie automatiquement
4. Attendez 2-3 minutes que le déploiement se termine

### Déploiement manuel

Si vous voulez forcer un redéploiement sans faire de push :

1. Dans Render, allez dans l'onglet **"Manual Deploy"**
2. Cliquez sur **"Deploy latest commit"**
3. Choisissez la branche
4. Cliquez sur **"Deploy"**

### Désactiver le déploiement automatique

Si vous voulez contrôler manuellement les déploiements :

1. Allez dans **"Settings"**
2. Descendez jusqu'à **"Deploy Hook"**
3. Désactivez **"Auto-Deploy"**

---

## 🔧 Gestion et maintenance

### Modifier les variables d'environnement

1. Dans Render, allez dans **"Environment"**
2. Cliquez sur **"Edit"** à côté de la variable à modifier
3. Modifiez la valeur
4. Cliquez sur **"Save Changes"**
5. ⚠️ Render va automatiquement redéployer l'application

### Consulter les métriques

Dans l'onglet **"Metrics"**, vous pouvez voir :

- Utilisation du CPU
- Utilisation de la RAM
- Trafic réseau
- Nombre de requêtes

### Accéder aux logs en temps réel

Dans l'onglet **"Logs"**, vous pouvez :

- Voir les logs en temps réel
- Filtrer par niveau (info, warning, error)
- Télécharger les logs

### Gérer la base de données Supabase

Dans Supabase, vous pouvez :

- **Table Editor** : Voir et modifier vos données
- **SQL Editor** : Exécuter des requêtes SQL
- **Database** : Voir les backups et les métriques
- **API Docs** : Voir la documentation générée automatiquement

---

## ⚠️ Limites du plan gratuit

### Render (Free tier)

- ✅ 750 heures gratuites par mois (suffisant pour 1 service 24/7)
- ⏸️ Le service s'endort après **15 minutes d'inactivité**
- ⏳ Réveil en **30-50 secondes** à la première requête
- 💾 512 MB de RAM
- 🔄 Redéploiement automatique illimité
- 🌍 1 région (Europe ou autre)

**Astuce pour éviter l'endormissement :**

- Utilisez un service de "ping" gratuit (ex: UptimeRobot, Cron-job.org)
- Configurez un ping toutes les 10 minutes sur votre URL

### Supabase (Free tier)

- ✅ **Gratuit à vie** (pas d'expiration !)
- 💾 500 MB de stockage
- 🔐 50,000 utilisateurs authentifiés (largement suffisant)
- 📊 2 GB de bande passante par mois
- 🔄 Backups automatiques des 7 derniers jours

---

## 🐛 Dépannage (Troubleshooting)

### Problème : "Application Error" ou page blanche

**Cause possible** : L'application a crashé

**Solution** :

1. Allez dans l'onglet **"Logs"** de Render
2. Identifiez l'erreur (en rouge)
3. Corrigez le problème dans votre code
4. Committez et pushez

### Problème : "Cannot connect to database"

**Cause possible** : Mauvaise URL de connexion PostgreSQL

**Solution** :

1. Vérifiez que `PG_URL` est correctement configurée
2. Vérifiez que le mot de passe est bien remplacé dans l'URL
3. Testez la connexion depuis Supabase (Table Editor)
4. Re-sauvegardez la variable d'environnement sur Render

### Problème : "Relation does not exist" (table not found)

**Cause possible** : Les tables ne sont pas créées

**Solution** :

1. Allez dans le Shell de Render
2. Exécutez à nouveau :
   ```bash
   node app/migrations/create-tables.js
   node app/migrations/seed-tables.js
   ```

### Problème : Le service est très lent

**Cause possible** : Le service était endormi (plan gratuit)

**Solution** :

- C'est normal pour le plan gratuit
- Attendez 30-50 secondes au premier chargement
- Ensuite, l'application sera rapide pendant 15 minutes

**Alternative** :

- Passez au plan payant de Render (7$/mois) pour un service toujours actif

### Problème : "Invalid token" ou erreurs d'authentification

**Cause possible** : `JWT_SECRET` ou `SESSION_SECRET` mal configurés

**Solution** :

1. Régénérez de nouvelles clés :
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Mettez à jour les variables d'environnement sur Render
3. Déconnectez-vous et reconnectez-vous sur l'application

---

## 📊 Monitoring et suivi

### Vérifier l'état du service

**Render :**

- Dashboard → Statut (vert = OK, rouge = problème)
- Logs en temps réel

**Supabase :**

- Dashboard → Métriques de la base de données
- Database → Queries per second, connections actives

### Sauvegarder la base de données

**Supabase fait des backups automatiques** (7 derniers jours), mais vous pouvez aussi :

1. Aller dans **Database** → **Backups**
2. Cliquer sur **"Download backup"**
3. Ou utiliser `pg_dump` depuis votre machine :
   ```bash
   pg_dump "votre_url_supabase" > backup.sql
   ```

### Restaurer une sauvegarde

1. Dans Supabase, allez dans **Database** → **Backups**
2. Sélectionnez le backup à restaurer
3. Cliquez sur **"Restore"**

---

## 🎓 Checklist finale avant la soutenance

Avant votre présentation, vérifiez que :

- ✅ L'application est accessible via l'URL Render
- ✅ Toutes les pages se chargent correctement
- ✅ L'inscription et la connexion fonctionnent
- ✅ Les arbres s'affichent dans le catalogue
- ✅ Le panier fonctionne
- ✅ Les commandes sont enregistrées
- ✅ Le dashboard utilisateur affiche l'historique
- ✅ Les images s'affichent correctement
- ✅ Le formulaire de contact fonctionne
- ✅ L'interface admin est accessible (si applicable)
- ✅ Aucune erreur dans les logs Render
- ✅ La base de données Supabase contient bien les données

### Préparez votre démonstration

1. **Notez votre URL de production** : `https://votre-app.onrender.com`
2. **Préparez des comptes de test** :
   - Un compte utilisateur normal
   - Un compte administrateur
3. **Testez le parcours complet** avant la soutenance :
   - Inscription → Consultation arbres → Ajout au panier → Commande → Dashboard
4. **Ayez un plan B** :
   - Si le service est endormi, prévenez le jury (30 sec de chargement)
   - Ayez des captures d'écran de l'app en fonctionnement

---

## 🔗 Ressources utiles

- **Documentation Render** : [https://render.com/docs](https://render.com/docs)
- **Documentation Supabase** : [https://supabase.com/docs](https://supabase.com/docs)
- **Render Node.js Guide** : [https://render.com/docs/deploy-node-express-app](https://render.com/docs/deploy-node-express-app)
- **PostgreSQL sur Render** : [https://render.com/docs/databases](https://render.com/docs/databases)
- **Supabase PostgreSQL** : [https://supabase.com/docs/guides/database](https://supabase.com/docs/guides/database)

---

## 🎉 Félicitations !

Votre application **GreenRoots** est maintenant déployée et accessible en ligne ! 🌳🌍

Si vous rencontrez des problèmes, consultez la section **Dépannage** ou les ressources ci-dessus.

**Bon courage pour votre soutenance d'Apothéose !** 💪
