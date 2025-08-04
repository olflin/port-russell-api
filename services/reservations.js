const Reservation = require('../models/reservation');

// GET /catways/:id/reservations
exports.getAllByCatway = async (req, res) => {
  try {
    const reservations = await Reservation.find({ catwayNumber: req.params.id });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /catways/:id/reservations/:idReservation
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
exports.create = async (req, res) => {
  try {
    const { clientName, boatName, startDate, endDate } = req.body;
    const newReservation = new Reservation({
      catwayNumber: req.params.id,
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
exports.update = async (req, res) => {
  try {
    const updated = await Reservation.findOneAndUpdate(
      {
        _id: req.params.idReservation,
        catwayNumber: req.params.id
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Reservation not found' });

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /catways/:id/reservations/:idReservation
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
