// routes/pages/users.js
const express = require('express');
const router = express.Router();
const { getAuth, apiGet, apiCall } = require('./helper');

// LISTES
router.get('/listes', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  const users = await apiGet('http://localhost:3000/users', auth, []);
  res.render('users/listes', { users, error: (!Array.isArray(users)) ? 'Impossible de charger les utilisateurs' : undefined });
});

// NEW (form)
router.get('/new', (req, res) => {
  const user = { username: '', email: '', password: '' };
  res.render('users/form', { mode: 'create', user });
});

// CREATE
router.post('/', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  const r = await apiCall('http://localhost:3000/users', 'POST', auth, {
    username: req.body.username, email: req.body.email, password: req.body.password
  });
  if (!r.ok) {
    let error = 'Création impossible';
    try { const j = await r.json(); if (j?.message) error = j.message; } catch {}
    const user = { username: req.body.username, email: req.body.email, password: '' };
    return res.status(400).render('users/form', { mode: 'create', user, error });
  }
  res.redirect('/pages/users/listes');
});

// EDIT (form)
router.get('/:email/edit', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  const user = await apiGet(`http://localhost:3000/users/${encodeURIComponent(req.params.email)}`, auth, null);
  if (!user) return res.redirect('/pages/users/listes');
  res.render('users/form', { mode: 'edit', user });
});

// UPDATE
router.post('/:email', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  await apiCall(`http://localhost:3000/users/${encodeURIComponent(req.params.email)}`, 'PUT', auth, {
    username: req.body.username, password: req.body.password
  });
  res.redirect('/pages/users/listes');
});

// DELETE
router.post('/:email/delete', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  await apiCall(`http://localhost:3000/users/${encodeURIComponent(req.params.email)}`, 'DELETE', auth);
  res.redirect('/pages/users/listes');
});

// DETAILS
router.get('/:email/details', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  const user = await apiGet(`http://localhost:3000/users/${encodeURIComponent(req.params.email)}`, auth, null);
  if (!user) return res.redirect('/pages/users/listes');
  res.render('users/details_page', { user });
});

module.exports = router;