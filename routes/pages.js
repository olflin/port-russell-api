const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');

const router = express.Router();

// Helpers
function getTokenFromCookie(req) {
  const raw = req.cookies?.Authorization || req.cookies?.authorization;
  return raw || null;
}

function decodeToken(token) {
  if (!token) return null;
  try {
    const parts = token.split(' ');
    const t = parts.length === 2 ? parts[1] : token;
    const payload = JSON.parse(Buffer.from(t.split('.')[1], 'base64').toString('utf8'));
    return payload;
  } catch (_) {
    return null;
  }
}

// Home page
router.get('/', (req, res) => {
  res.render('home', { error: null });
});

// Login from form -> set httpOnly cookie and redirect to dashboard
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const resp = await fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!resp.ok) {
      return res.status(401).render('home', { error: 'Identifiants invalides' });
    }

    const authHeader = resp.headers.get('authorization') || resp.headers.get('Authorization');
    let token;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring('Bearer '.length);
    } else {
      const body = await resp.json().catch(() => ({}));
      token = body.token;
    }

    if (!token) return res.status(500).render('home', { error: 'Token manquant' });

    res.cookie('Authorization', `Bearer ${token}`, { httpOnly: true, sameSite: 'lax' });
    res.redirect('/dashboard');
  } catch (e) {
    res.status(500).render('home', { error: 'Erreur serveur' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('Authorization');
  res.redirect('/');
});

// Dashboard SSR
router.get('/dashboard', async (req, res) => {
  const auth = getTokenFromCookie(req);
  const payload = decodeToken(auth);
  if (!auth || !payload) return res.redirect('/');

  const username = payload.username || (payload.email ? payload.email.split('@')[0] : '');
  const email = payload.email || '';
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  // Fetch reservations per catway and keep those active today
  let activeReservations = [];
  try {
    const catwaysResp = await fetch('http://localhost:3000/catways', {
      headers: { Authorization: auth }
    });
    const catways = await catwaysResp.json();

    const tasks = catways.map(c => fetch(`http://localhost:3000/catways/${c.catwayNumber}/reservations`, {
      headers: { Authorization: auth }
    }).then(r => r.json()).then(list => ({ number: c.catwayNumber, reservations: list })));

    const results = await Promise.all(tasks);
    for (const r of results) {
      for (const reserv of r.reservations) {
        const s = reserv.startDate?.slice(0,10);
        const e = reserv.endDate?.slice(0,10);
        if (s && e && s <= todayStr && todayStr <= e) {
          activeReservations.push({ catwayNumber: r.number, ...reserv });
        }
      }
    }
  } catch (_) {}

  res.render('dashboard', { username, email, today: today.toLocaleDateString(), activeReservations });
});

// ------------------------
// Catways pages (CRUD SSR)
// ------------------------
router.get('/pages/catways', async (req, res) => {
  const auth = getTokenFromCookie(req);
  if (!auth) return res.redirect('/');
  const resp = await fetch('http://localhost:3000/catways', { headers: { Authorization: auth } });
  const catways = await resp.json();
  res.render('catways/index', { catways });
});

router.get('/pages/catways/new', (req, res) => {
  const catway = { catwayNumber: '', catwayType: 'short', catwayState: '' };
  res.render('catways/form', { mode: 'create', catway });
});

router.post('/pages/catways', async (req, res) => {
  const auth = getTokenFromCookie(req);
  if (!auth) return res.redirect('/');
  await fetch('http://localhost:3000/catways', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({
      catwayNumber: Number(req.body.catwayNumber),
      catwayType: req.body.catwayType,
      catwayState: req.body.catwayState
    })
  });
  res.redirect('/pages/catways');
});

router.get('/pages/catways/:id/edit', async (req, res) => {
  const auth = getTokenFromCookie(req);
  if (!auth) return res.redirect('/');
  const r = await fetch(`http://localhost:3000/catways/${req.params.id}`, { headers: { Authorization: auth } });
  const catway = await r.json();
  res.render('catways/form', { mode: 'edit', catway });
});

// Update only catwayState
router.post('/pages/catways/:id', async (req, res) => {
  const auth = getTokenFromCookie(req);
  if (!auth) return res.redirect('/');
  await fetch(`http://localhost:3000/catways/${req.params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({ catwayState: req.body.catwayState })
  });
  res.redirect('/pages/catways');
});

router.post('/pages/catways/:id/delete', async (req, res) => {
  const auth = getTokenFromCookie(req);
  if (!auth) return res.redirect('/');
  await fetch(`http://localhost:3000/catways/${req.params.id}`, { method: 'DELETE', headers: { Authorization: auth } });
  res.redirect('/pages/catways');
});

// -----------------------------
// Users pages (CRUD SSR)
// -----------------------------
router.get('/pages/users', async (req, res) => {
  const auth = getTokenFromCookie(req);
  if (!auth) return res.redirect('/');
  const r = await fetch('http://localhost:3000/users', { headers: { Authorization: auth } });
  const users = await r.json();
  res.render('users/index', { users });
});

router.get('/pages/users/new', (req, res) => {
  const user = { username: '', email: '', password: '' };
  res.render('users/form', { mode: 'create', user });
});

router.post('/pages/users', async (req, res) => {
  const auth = getTokenFromCookie(req);
  if (!auth) return res.redirect('/');
  await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({ username: req.body.username, email: req.body.email, password: req.body.password })
  });
  res.redirect('/pages/users');
});

router.get('/pages/users/:email/edit', async (req, res) => {
  const auth = getTokenFromCookie(req);
  if (!auth) return res.redirect('/');
  const r = await fetch(`http://localhost:3000/users/${encodeURIComponent(req.params.email)}`, { headers: { Authorization: auth } });
  const user = await r.json();
  res.render('users/form', { mode: 'edit', user });
});

router.post('/pages/users/:email', async (req, res) => {
  const auth = getTokenFromCookie(req);
  if (!auth) return res.redirect('/');
  await fetch(`http://localhost:3000/users/${encodeURIComponent(req.params.email)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({ username: req.body.username, password: req.body.password })
  });
  res.redirect('/pages/users');
});

router.post('/pages/users/:email/delete', async (req, res) => {
  const auth = getTokenFromCookie(req);
  if (!auth) return res.redirect('/');
  await fetch(`http://localhost:3000/users/${encodeURIComponent(req.params.email)}`, { method: 'DELETE', headers: { Authorization: auth } });
  res.redirect('/pages/users');
});

// -----------------------------------
// Reservations pages (CRUD SSR)
// -----------------------------------
router.get('/pages/catways/:id/reservations', async (req, res) => {
  const auth = getTokenFromCookie(req);
  if (!auth) return res.redirect('/');
  const r = await fetch(`http://localhost:3000/catways/${req.params.id}/reservations`, { headers: { Authorization: auth } });
  const reservations = await r.json();
  res.render('reservations/index', { catwayId: req.params.id, reservations });
});

router.get('/pages/catways/:id/reservations/new', (req, res) => {
  const reservation = { clientName: '', boatName: '', startDate: '', endDate: '' };
  res.render('reservations/form', { mode: 'create', catwayId: req.params.id, reservation });
});

router.post('/pages/catways/:id/reservations', async (req, res) => {
  const auth = getTokenFromCookie(req);
  if (!auth) return res.redirect('/');
  await fetch(`http://localhost:3000/catways/${req.params.id}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({
      clientName: req.body.clientName,
      boatName: req.body.boatName,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    })
  });
  res.redirect(`/pages/catways/${req.params.id}/reservations`);
});

router.get('/pages/catways/:id/reservations/:resId/edit', async (req, res) => {
  const auth = getTokenFromCookie(req);
  if (!auth) return res.redirect('/');
  const r = await fetch(`http://localhost:3000/catways/${req.params.id}/reservations/${req.params.resId}`, { headers: { Authorization: auth } });
  const reservation = await r.json();
  res.render('reservations/form', { mode: 'edit', catwayId: req.params.id, reservation });
});

router.post('/pages/catways/:id/reservations/:resId', async (req, res) => {
  const auth = getTokenFromCookie(req);
  if (!auth) return res.redirect('/');
  await fetch(`http://localhost:3000/catways/${req.params.id}/reservations/${req.params.resId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({
      clientName: req.body.clientName,
      boatName: req.body.boatName,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    })
  });
  res.redirect(`/pages/catways/${req.params.id}/reservations`);
});

router.post('/pages/catways/:id/reservations/:resId/delete', async (req, res) => {
  const auth = getTokenFromCookie(req);
  if (!auth) return res.redirect('/');
  await fetch(`http://localhost:3000/catways/${req.params.id}/reservations/${req.params.resId}`, { method: 'DELETE', headers: { Authorization: auth } });
  res.redirect(`/pages/catways/${req.params.id}/reservations`);
});

module.exports = router;
