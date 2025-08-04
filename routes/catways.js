const express = require('express');
const router = express.Router();
const catwayService = require('../services/catways');
const reservationRouter = require('./reservations');

router.get('/', catwayService.getAll);
router.get('/:id', catwayService.getById);
router.post('/', catwayService.create);
router.put('/:id', catwayService.update);
router.delete('/:id', catwayService.remove);

router.use('/:id/reservations', reservationRouter);

module.exports = router;
