const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

// GET /users
/**
 * Liste tous les utilisateurs (sans les champs sensibles).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.getAll = async (req, res) => {
  const users = await User.find({}, '-password -__v');
  res.status(200).json(users);
};

// GET /users/:email
/**
 * Récupère un utilisateur par son email.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.getByEmail = async (req, res) => {
  const user = await User.findOne({ email: req.params.email }, '-password -__v');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.status(200).json(user);
};

// POST /users
/**
 * Crée un nouvel utilisateur.
 * @param {{body:{username:string,email:string,password:string}} & import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.create = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /users/:email
/**
 * Met à jour un utilisateur identifié par email. Le mot de passe est re-hashé si fourni.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.update = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updated = await User.findOneAndUpdate(
      { email: req.params.email },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /users/:email
/**
 * Supprime un utilisateur par email.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.remove = async (req, res) => {
  const deleted = await User.findOneAndDelete({ email: req.params.email });
  if (!deleted) return res.status(404).json({ message: 'User not found' });
  res.status(204).send();
};

// POST /login
/**
 * Authentifie un utilisateur et renvoie un JWT (header Authorization + body).
 * @param {{body:{email:string,password:string}} & import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(403).json({ message: 'Invalid credentials' });

  const safeUsername = user.username || (user.email ? user.email.split('@')[0] : undefined)
  const token = jwt.sign({ id: user._id, username: safeUsername, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
  res.header('Authorization', 'Bearer ' + token).status(200).json({ token });
};

// GET /logout
/**
 * Déconnecte l'utilisateur côté client (vide l'en-tête Authorization).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.logout = (req, res) => {
  res.header('Authorization', '').status(200).json({ message: 'Logged out' });
};
