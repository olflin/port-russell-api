const express = require('express');
const router = express.Router();
const service = require('../services/users');
const private = require('../middlewares/private');

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Authentification utilisateur
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: OK }
 *       401: { description: Identifiants invalides }
 */
router.post('/login', service.login);

/**
 * @openapi
 * /users/logout:
 *   get:
 *     summary: Déconnexion utilisateur
 *     tags: [Users]
 *     responses:
 *       200: { description: Déconnecté }
 */
router.get('/logout', service.logout);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Liste des utilisateurs
 *     tags: [Users]
 *     responses:
 *       200: { description: OK }
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201: { description: Créé }
 */
router.get('/', private.checkJWT, service.getAll);
router.post('/', service.create);

/**
 * @openapi
 * /users/{email}:
 *   get:
 *     summary: Obtenir un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Introuvable }
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: No Content }
 */
router.get('/:email', private.checkJWT, service.getByEmail);
router.put('/:email', private.checkJWT, service.update);
router.delete('/:email', private.checkJWT, service.remove);

module.exports = router;
