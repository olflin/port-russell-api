// routes/pages/catways.js
const express = require('express');
const { getAuth, apiGet, apiCall } = require('./helper');
const router = express.Router();

// LISTES
router.get('/listes', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  const catways = await apiGet('http://localhost:3000/catways', auth, []);
  res.render('catways/listes', { catways, error: undefined });
});

// NEW (form)
router.get('/new', (req, res) => {
  const catway = { catwayNumber: '', catwayType: 'short', catwayState: '' };
  res.render('catways/form', { mode: 'create', catway });
});

// CREATE
router.post('/', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  await apiCall('http://localhost:3000/catways', 'POST', auth, {
    catwayNumber: Number(req.body.catwayNumber),
    catwayType: req.body.catwayType,
    catwayState: req.body.catwayState,
  });
  res.redirect('/pages/catways/listes');
});

// EDIT (form)
router.get('/:id/edit', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  const catway = await apiGet(`http://localhost:3000/catways/${req.params.id}`, auth, null);
  if (!catway) return res.redirect('/pages/catways/listes');
  res.render('catways/form', { mode: 'edit', catway });
});

// UPDATE
router.post('/:id', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  await apiCall(`http://localhost:3000/catways/${req.params.id}`, 'PUT', auth, { catwayState: req.body.catwayState });
  res.redirect('/pages/catways/listes');
});

// DELETE
router.post('/:id/delete', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  await apiCall(`http://localhost:3000/catways/${req.params.id}`, 'DELETE', auth);
  res.redirect('/pages/catways/listes');
});

// DETAILS
router.get('/:id/details', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  const catway = await apiGet(`http://localhost:3000/catways/${req.params.id}`, auth, null);
  if (!catway) return res.redirect('/pages/catways/listes');
  res.render('catways/details_page', { catway });
});

module.exports = router;