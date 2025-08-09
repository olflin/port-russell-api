const Catway = require('../models/catway');

// GET /catways
/**
 * Liste tous les catways.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.getAll = async (req, res) => {
  try {
    const catways = await Catway.find();
    res.status(200).json(catways);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /catways/:id
/**
 * Récupère un catway par son numéro.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.getById = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).json({ message: 'Catway not found' });
    res.status(200).json(catway);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /catways
/**
 * Crée un catway.
 * @param {{body:{catwayNumber:number,catwayType:'short'|'long',catwayState:string}} & import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.create = async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;
    const newCatway = new Catway({ catwayNumber, catwayType, catwayState });
    const saved = await newCatway.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /catways/:id → modifier uniquement `catwayState`
/**
 * Met à jour uniquement l'état d'un catway existant.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.update = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).json({ message: 'Catway not found' });

    if (req.body.catwayState) {
      catway.catwayState = req.body.catwayState;
      const updated = await catway.save();
      return res.status(200).json(updated);
    } else {
      return res.status(400).json({ message: 'catwayState is required' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /catways/:id
/**
 * Supprime un catway par son numéro.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.remove = async (req, res) => {
  try {
    const deleted = await Catway.findOneAndDelete({ catwayNumber: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Catway not found' });
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
