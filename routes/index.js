var express = require('express');
var router = express.Router();

const userRoute = require('../routes/users');

/* GET home page. */
router.get('/', async (req, res) => {
/*  res.render(200).json({
    name   : process.env.APP_NAME,
    version: '1.0',
    status : 200,
    message: 'bienvenue sur l\'API !'
  }); */

  res.render('index', {
    title: 'accueil',
  });
});

router.use('/users', userRoute);

module.exports = router;
 