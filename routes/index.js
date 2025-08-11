var express = require('express');
var router = express.Router();

<<<<<<< HEAD
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
=======
const path = require('path');

/* GET home page. */
router.get('/', async (req, res) => {
  // Sert la page statique public/index.html
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;
>>>>>>> devprojet
