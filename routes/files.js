const express = require('express');
const router = express.Router();
const services = require('../services/files');
const multer = require('../middlewares/files-storage');
const private = require('../middlewares/private');

router.get('/', private.checkJWT, services.getAllFiles);
router.post('/', multer, services.createOneFile);
router.get('/:id', private.checkJWT, services.getOneFile);
router.put('/:id', private.checkJWT, multer, services.modifyOneFile);
router.delete('/delete', private.checkJWT, services.deleteOneFile);

module.exports = router;

