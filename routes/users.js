const express = require('express');
const router = express.Router();
const service = require('../services/users');
const private = require('../middlewares/private');

router.get('/', private.checkJWT, service.getAll);
router.get('/:email', private.checkJWT, service.getByEmail);
router.post('/', service.create);
router.put('/:email', private.checkJWT, service.update);
router.delete('/:email', private.checkJWT, service.remove);

router.post('/login', service.login);
router.get('/logout', service.logout);

module.exports = router;
