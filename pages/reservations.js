// routes/pages/reservations.js
const express = require('express');
const router = express.Router();
const { getAuth, apiGet, apiCall } = require('./helper');

// LISTES (global)
router.get('/listes', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  try {
    const catways = await apiGet('http://localhost:3000/catways', auth, []);
    const tasks = (catways || []).map(c =>
      apiGet(`http://localhost:3000/catways/${c.catwayNumber}/reservations`, auth, [])
        .then(list => list.map(item => ({ ...item, catwayNumber: c.catwayNumber })))
    );
    const nested = await Promise.all(tasks);
    const reservations = nested.flat();
    res.render('reservations/listes', { reservations, catways });
  } catch {
    res.render('reservations/listes', { reservations: [], catways: [], error: 'Impossible de charger les réservations' });
  }
});

// NEW (global form)
router.get('/new', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  const catways = await apiGet('http://localhost:3000/catways', auth, []);
  const reservation = { clientName: '', boatName: '', startDate: '', endDate: '', catwayNumber: '' };
  res.render('reservations/form', { mode: 'create-global', reservation, catways });
});

// CREATE (global)
router.post('/', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  await apiCall(`http://localhost:3000/catways/${req.body.catwayNumber}/reservations`, 'POST', auth, {
    clientName: req.body.clientName,
    boatName: req.body.boatName,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  });
  res.redirect('/pages/reservations/listes');
});

// EDIT (global)
router.get('/:catwayId/:resId/edit', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  const [reservation, catways] = await Promise.all([
    apiGet(`http://localhost:3000/catways/${req.params.catwayId}/reservations/${req.params.resId}`, auth, null),
    apiGet('http://localhost:3000/catways', auth, []),
  ]);
  if (!reservation) return res.redirect('/pages/reservations/listes');
  res.render('reservations/form', { mode: 'edit', catwayId: req.params.catwayId, reservation, catways });
});

// UPDATE (global)
router.post('/:catwayId/:resId', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  await apiCall(`http://localhost:3000/catways/${req.params.catwayId}/reservations/${req.params.resId}`, 'PUT', auth, {
    clientName: req.body.clientName,
    boatName: req.body.boatName,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  });
  res.redirect('/pages/reservations/listes');
});

// DELETE (global)
router.post('/:catwayId/:resId/delete', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  await apiCall(`http://localhost:3000/catways/${req.params.catwayId}/reservations/${req.params.resId}`, 'DELETE', auth);
  res.redirect('/pages/reservations/listes');
});

// DETAILS
router.get('/:catwayId/:resId/details', async (req, res) => {
  const auth = getAuth(req);
  if (!auth) return res.redirect('/');
  const reservation = await apiGet(`http://localhost:3000/catways/${req.params.catwayId}/reservations/${req.params.resId}`, auth, null);
  if (!reservation) return res.redirect('/pages/reservations/listes');
  res.render('reservations/details_page', { catwayId: req.params.catwayId, reservation });
});

module.exports = router;