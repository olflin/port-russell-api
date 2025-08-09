const Reservation = require('../models/reservation');
const Catway = require('../models/catway');

// GET /catways/:id/reservations
/**
 * Liste les réservations pour un catway donné.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.getAllByCatway = async (req, res) => {
  try {
    const reservations = await Reservation.find({ catwayNumber: req.params.id });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /catways/:id/reservations/:idReservation
/**
 * Récupère une réservation par id pour un catway donné.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.getOne = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.idReservation,
      catwayNumber: req.params.id
    });

    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /catways/:id/reservations
/**
 * Crée une réservation pour un catway.
 * @param {{params:{id:string},body:{clientName:string,boatName:string,startDate:string,endDate:string}} & import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.create = async (req, res) => {
  try {
    const { clientName, boatName } = req.body;
    const catwayNumber = Number(req.params.id);
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    // Vérifier catway existant
    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) return res.status(404).json({ message: 'Catway not found' });

    // Valider les dates
    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ message: 'Invalid dates' });
    }
    if (startDate >= endDate) {
      return res.status(400).json({ message: 'startDate must be before endDate' });
    }

    // Empêcher les chevauchements: (start < existing.end) && (end > existing.start)
    const overlap = await Reservation.findOne({
      catwayNumber,
      startDate: { $lt: endDate },
      endDate: { $gt: startDate }
    });
    if (overlap) {
      return res.status(409).json({ message: 'Reservation overlaps an existing one' });
    }

    const newReservation = new Reservation({
      catwayNumber,
      clientName,
      boatName,
      startDate,
      endDate
    });

    const saved = await newReservation.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /catways/:id/reservations/:idReservation
/**
 * Met à jour une réservation existante.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.update = async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);

    // Vérifier catway existant
    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) return res.status(404).json({ message: 'Catway not found' });

    // Récupérer la réservation cible
    const existing = await Reservation.findOne({
      _id: req.params.idReservation,
      catwayNumber
    });
    if (!existing) return res.status(404).json({ message: 'Reservation not found' });

    // Préparer les nouvelles dates si fournies
    const startDate = req.body.startDate ? new Date(req.body.startDate) : existing.startDate;
    const endDate = req.body.endDate ? new Date(req.body.endDate) : existing.endDate;

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ message: 'Invalid dates' });
    }
    if (startDate >= endDate) {
      return res.status(400).json({ message: 'startDate must be before endDate' });
    }

    // Chevauchement avec d'autres réservations (exclure la réservation en cours)
    const overlap = await Reservation.findOne({
      _id: { $ne: existing._id },
      catwayNumber,
      startDate: { $lt: endDate },
      endDate: { $gt: startDate }
    });
    if (overlap) {
      return res.status(409).json({ message: 'Reservation overlaps an existing one' });
    }

    // Appliquer mises à jour
    existing.clientName = req.body.clientName ?? existing.clientName;
    existing.boatName = req.body.boatName ?? existing.boatName;
    existing.startDate = startDate;
    existing.endDate = endDate;

    const updated = await existing.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /catways/:id/reservations (idReservation dans le body)
/**
 * Met à jour une réservation en passant son id dans le corps de requête.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.updateByBody = async (req, res) => {
  try {
    const idReservation = req.body.idReservation;
    if (!idReservation) {
      return res.status(400).json({ message: 'idReservation is required in body' });
    }

    // Délègue à la logique d'update après avoir injecté le paramètre
    req.params.idReservation = idReservation;
    return exports.update(req, res);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /catways/:id/reservations/:idReservation
/**
 * Supprime une réservation par id pour un catway donné.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.remove = async (req, res) => {
  try {
    const deleted = await Reservation.findOneAndDelete({
      _id: req.params.idReservation,
      catwayNumber: req.params.id
    });

    if (!deleted) return res.status(404).json({ message: 'Reservation not found' });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
