const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const indexRouter = require('./routes/index');
const mongodb = require('./db/mongo')
const usersRouter = require('./routes/users');

const path = require('path');

const catwaysRouter = require('./routes/catways');
const reservationsRouter = require('./routes/reservations');
const private = require('./middlewares/private');

const catwaysPages = require('./pages/catways');
const usersPages = require('./pages/users');
const reservationsPages = require('./pages/reservations');

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Port Russell API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [
    './routes/*.js',
    './services/*.js',
    './middlewares/*.js',
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

mongodb.initClientDbConnection();

var app = express();

app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Pages SSR
app.get('/', (req, res) => {
  if (req.cookies?.token) return res.redirect('/dashboard');
  res.render('home', { error: undefined });
});

app.get('/login', (req, res) => res.redirect('/'));

app.post('/login', async (req, res) => {
  try {
    const response = await fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: req.body.email, password: req.body.password })
    });
    
    if (!response.ok) {
      let error = 'Identifiants invalides';
      try { 
        const json = await response.json(); 
        if (json?.message) error = json.message; 
      } catch {}
      return res.status(401).render('home', { error });
    }
    
    const data = await response.json();
    if (!data?.token) {
      return res.status(500).render('home', { error: 'Token manquant' });
    }
    
    res.cookie('token', data.token, { httpOnly: true, sameSite: 'lax' });
    res.redirect('/dashboard');
  } catch {
    res.status(500).render('home', { error: 'Erreur de connexion' });
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

app.get('/dashboard', async (req, res) => {
  if (!req.cookies?.token) return res.redirect('/');
  
  const auth = `Bearer ${req.cookies.token}`;
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(req.cookies.token);
    const username = decoded?.username || 'Utilisateur';
    const email = decoded?.email || '';
    const today = new Date().toLocaleDateString('fr-FR');
    
    const catways = await fetch('http://localhost:3000/catways', { headers: { Authorization: auth } })
      .then(r => r.ok ? r.json() : []).catch(() => []);
    
    const reservationPromises = catways.map(c =>
      fetch(`http://localhost:3000/catways/${c.catwayNumber}/reservations`, { headers: { Authorization: auth } })
        .then(r => r.ok ? r.json() : [])
        .then(list => list.map(item => ({ ...item, catwayNumber: c.catwayNumber })))
        .catch(() => [])
    );
    
    const allReservations = (await Promise.all(reservationPromises)).flat();
    const todayStr = new Date().toISOString().slice(0, 10);
    const activeReservations = allReservations.filter(r => 
      r.startDate <= todayStr && r.endDate >= todayStr
    );
    
    res.render('dashboard', { username, email, today, activeReservations });
  } catch {
    res.redirect('/');
  }
});

// Server-side rendered pages
app.use('/pages/catways', catwaysPages);
app.use('/pages/users', usersPages);
app.use('/pages/reservations', reservationsPages);

// API routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/catways', catwaysRouter);
// Alias pour respecter la variante du sujet: /catway/:id/reservations
app.use('/catway/:id/reservations', private.checkJWT, reservationsRouter);

// Swagger UI (documentation)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler must be last
app.use(function(req, res, next) {
    res.status(404).json({name: 'API', version: '1.0', status: 404, message: 'not_found'});
});

module.exports = app;
