var express = require('express');
var router = express.Router();

const path = require('path');

/* GET home page. */
router.get('/', async (req, res) => {
  // Sert la page statique public/index.html
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;
