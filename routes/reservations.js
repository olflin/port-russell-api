const express = require('express');
const router = express.Router({ mergeParams: true });
const reservationService = require('../services/reservations');
const private = require('../middlewares/private');

/**
 * @openapi
 * /catways/{id}/reservations:
 *   get:
 *     summary: Liste des réservations pour un catway
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *   post:
 *     summary: Créer une réservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clientName, boatName, startDate, endDate]
 *             properties:
 *               clientName: { type: string }
 *               boatName: { type: string }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *     responses:
 *       201: { description: Créé }
 */
router.get('/', private.checkJWT, reservationService.getAllByCatway);
router.post('/', private.checkJWT, reservationService.create);

/**
 * @openapi
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Détail d’une réservation
 *     tags: [Reservations]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *       - { in: path, name: idReservation, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: OK }
 *   put:
 *     summary: Mettre à jour une réservation
 *     tags: [Reservations]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *       - { in: path, name: idReservation, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: OK }
 *   delete:
 *     summary: Supprimer une réservation
 *     tags: [Reservations]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *       - { in: path, name: idReservation, required: true, schema: { type: string } }
 *     responses:
 *       204: { description: No Content }
 */
router.get('/:idReservation', private.checkJWT, reservationService.getOne);
router.put('/', private.checkJWT, reservationService.updateByBody);
router.put('/:idReservation', private.checkJWT, reservationService.update);
router.delete('/:idReservation', private.checkJWT, reservationService.remove);

module.exports = router;
