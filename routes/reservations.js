const express = require('express');
const router = express.Router({ mergeParams: true });
const reservationService = require('../services/reservations');

router.get('/', reservationService.getAllByCatway);
router.get('/:idReservation', reservationService.getOne);
router.post('/', reservationService.create);
router.put('/:idReservation', reservationService.update);
router.delete('/:idReservation', reservationService.remove);

module.exports = router;
