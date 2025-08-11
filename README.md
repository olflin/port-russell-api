# Port Russell API

API de gestion portuaire avec interface web. Gestion des catways, utilisateurs et réservations.

## Installation

```bash
npm install
npm run dev
```

Prérequis : Node.js 18+, MongoDB

## Architecture

### API REST (`/api`)
- Authentification : JWT via header `Authorization: Bearer <token>`
- Base de données : MongoDB avec Mongoose
- Documentation : Swagger UI sur `/docs`

### Interface Web (`/`)
- Rendu : Server-side rendering (EJS)
- Authentification : JWT stocké en cookie httpOnly
- Design : Interface moderne et responsive

## Endpoints API

### Utilisateurs
- `POST /users` - Créer un utilisateur
- `POST /users/login` - Connexion (retourne JWT)
- `GET /users` - Liste des utilisateurs
- `GET /users/{email}` - Détail utilisateur
- `PUT /users/{email}` - Modifier utilisateur
- `DELETE /users/{email}` - Supprimer utilisateur

### Catways
- `GET /catways` - Liste des catways
- `POST /catways` - Créer un catway
- `GET /catways/{id}` - Détail catway
- `PUT /catways/{id}` - Modifier catway
- `DELETE /catways/{id}` - Supprimer catway

### Réservations
- `GET /catways/{id}/reservations` - Réservations d'un catway
- `POST /catways/{id}/reservations` - Créer réservation
- `GET /catways/{id}/reservations/{resId}` - Détail réservation
- `PUT /catways/{id}/reservations/{resId}` - Modifier réservation
- `DELETE /catways/{id}/reservations/{resId}` - Supprimer réservation

## Pages Web

- `/` - Accueil et connexion
- `/dashboard` - Tableau de bord
- `/pages/catways/listes` - Gestion des catways
- `/pages/users/listes` - Gestion des utilisateurs
- `/pages/reservations/listes` - Gestion des réservations
- `/docs` - Documentation API (Swagger)
- /dashboard → infos utilisateur + réservations actives (SSR, protégé)
- /pages/catways → CRUD catways (SSR, protégé)
- /pages/users → CRUD users (SSR, protégé)
- /docs → Swagger UI (documentation de l’API)

## Configuration

Variables d'environnement (`.env`) :

```env
PORT=3000
URL_MONGO=mongodb://localhost:27017/port_russell
SECRET_KEY=your_secret_key
```

## Test rapide

1. Lancer l'application : `npm run dev`
2. Aller sur `http://localhost:3000`
3. Créer un utilisateur et se connecter
4. Explorer les fonctionnalités via l'interface web

## Notes

- JWT : Durée de vie 24h, payload contient `id`, `username`, `email`
- Cookies : httpOnly pour les pages SSR, sécurisés en production
- API : Documentation complète disponible sur `/docs`
- Authentification requise pour les routes protégées
- compte de test : email: john@exemple.com, mdp: aze123