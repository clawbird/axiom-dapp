const express = require('express');
const router = new express.Router();

// Require middleware modules
const eipXMiddleware = require('../middleware/eipXMiddleware');

// GET localhost:7000/eipx/readBlockHeader
router.get('/readBlockHeader', 
  eipXMiddleware.readBlockHeader,
);

// GET localhost:7000/eipx/getProof
router.get('/getProof',
  eipXMiddleware.getProof,
);

// POST localhost:7000/eipx/getMPTProof
router.post('/getMPTProof',
  eipXMiddleware.getMPTProof,
);

module.exports = router;
