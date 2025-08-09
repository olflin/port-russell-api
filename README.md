# Port Russell – API + Frontend

Projet Node/Express + MongoDB avec frontend React (Vite). Auth par JWT (payload: id, username, email).

1) Prérequis

- Node 18
- MongoDB (local ou distant)
- npm

2) Backend (API)

- Installation & démarrage
dans le terminal depuis la route port-russell-api\

commande terminal:

  npm install
  npm run dev

Endpoints essentiels
POST /users → créer un utilisateur { username, email, password }
POST /users/login → login, renvoie Authorization: Bearer <token> et { token }
GET /catways → liste des catways
GET /catways/:id/reservations → réservations d’un catway
Notes:

Le middleware renouvelle le JWT (24h) et conserve username/email.
Le front envoie Authorization: Bearer <token> automatiquement.

3) Frontend (React + Vite)
Installation & démarrage
dans le terminal depuis la route port-russell-api\

commande terminal:

cd port-russell-frontend
npm install
npm run dev

URLs utiles
/ → login
/dashboard → affiche Nom/Email + réservations actives
Liens simples vers Catways / Reservations / Users / Docs

4) Flux simple
Démarre l’API puis le Frontend.
Si besoin, crée un user: POST /users (via Postman/Thunder Client).
Login: POST /users/login → copie le token (le front le gère automatiquement si tu passes par la page login).
Va sur /dashboard.