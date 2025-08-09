function Docs() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Documentation de l'API Port Russell</h1>

      <section>
        <h2>Authentification</h2>

        <h3>POST /api/users/login</h3>
        <p>Permet de se connecter et d’obtenir un token JWT.</p>
        <strong>Corps requis :</strong>
        <pre>{`{
  "email": "user@example.com",
  "password": "motdepasse"
}`}</pre>
        <strong>Réponse :</strong>
        <pre>{`{
  "message": "Connexion réussie",
  "user": {
    "username": "Nom",
    "email": "user@example.com"
  }
}`}</pre>

        <h3>GET /api/users/logout</h3>
        <p>Déconnecte l’utilisateur (pas de token supprimé côté client, mais possible pour tests).</p>
      </section>

      <section>
        <h2>Utilisateurs</h2>
        <p><strong>Toutes ces routes nécessitent un token JWT valide.</strong></p>

        <h3>GET /api/users</h3>
        <p>Liste tous les utilisateurs.</p>

        <h3>GET /api/users/:email</h3>
        <p>Récupère un utilisateur par email.</p>

        <h3>POST /api/users</h3>
        <p>Crée un nouvel utilisateur.</p>
        <pre>{`{
  "username": "Jean",
  "email": "jean@example.com",
  "password": "monmdp"
}`}</pre>

        <h3>PUT /api/users/:email</h3>
        <p>Modifie les infos d’un utilisateur existant.</p>

        <h3>DELETE /api/users/:email</h3>
        <p>Supprime un utilisateur.</p>
      </section>

      <section>
        <h2>Catways</h2>

        <h3>GET /api/catways</h3>
        <p>Liste tous les catways.</p>

        <h3>POST /api/catways</h3>
        <p>Crée un nouveau catway.</p>
        <pre>{`{
  "catwayNumber": 1,
  "catwayType": "long",
  "catwayState": "Disponible"
}`}</pre>

        <h3>GET /api/catways/:id</h3>
        <p>Récupère un catway par ID.</p>

        <h3>PUT /api/catways/:id</h3>
        <p>Met à jour uniquement l'état du catway.</p>
        <pre>{`{
  "catwayState": "Occupé"
}`}</pre>

        <h3>DELETE /api/catways/:id</h3>
        <p>Supprime un catway.</p>
      </section>

      <section>
        <h2>Réservations</h2>

        <h3>GET /api/reservations</h3>
        <p>Liste toutes les réservations.</p>

        <h3>POST /api/reservations</h3>
        <p>Crée une réservation.</p>
        <pre>{`{
  "catwayNumber": 1,
  "clientName": "Jean Dupont",
  "boatName": "Le Vent du Sud",
  "startDate": "2025-08-01",
  "endDate": "2025-08-07"
}`}</pre>

        <h3>GET /api/reservations/:id</h3>
        <p>Récupère une réservation par ID.</p>

        <h3>PUT /api/reservations/:id</h3>
        <p>Modifie une réservation.</p>

        <h3>DELETE /api/reservations/:id</h3>
        <p>Supprime une réservation.</p>
      </section>
    </div>
  );
}

export default Docs;
