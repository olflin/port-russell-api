const express = require('express');
const router = express.Router();
const catwayService = require('../services/catways');
const reservationRouter = require('./reservations');
const private = require('../middlewares/private');

/**
 * @openapi
 * /catways:
 *   get:
 *     summary: Liste des catways
 *     tags: [Catways]
 *     responses:
 *       200: { description: OK }
 *   post:
 *     summary: Créer un catway
 *     tags: [Catways]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [catwayNumber, catwayType, catwayState]
 *             properties:
 *               catwayNumber: { type: integer }
 *               catwayType: { type: string, enum: [short, long] }
 *               catwayState: { type: string }
 *     responses:
 *       201: { description: Créé }
 */
router.get('/', private.checkJWT, catwayService.getAll);
router.post('/', private.checkJWT, catwayService.create);

/**
 * @openapi
 * /catways/{id}:
 *   get:
 *     summary: Détail d’un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Introuvable }
 *   put:
 *     summary: Mettre à jour uniquement catwayState
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *   delete:
 *     summary: Supprimer un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: No Content }
 */
router.get('/:id', private.checkJWT, catwayService.getById);
router.put('/:id', private.checkJWT, catwayService.update);
router.delete('/:id', private.checkJWT, catwayService.remove);

router.use('/:id/reservations', private.checkJWT, reservationRouter);

module.exports = router;
