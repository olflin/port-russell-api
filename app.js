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
const pagesRouter = require('./routes/pages');

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

// Server-side rendered pages
app.use('/', pagesRouter);

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
