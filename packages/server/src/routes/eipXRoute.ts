import express from 'express';

// @ts-ignore
const router = new express.Router();

// Require middleware modules
import { getMPTProof, getProof, readBlockHeader } from '../middleware/eipXMiddleware';

// GET localhost:7000/eipx/readBlockHeader
router.get('/readBlockHeader', 
  readBlockHeader,
);

// GET localhost:7000/eipx/getProof
router.get('/getProof',
  getProof,
);

// POST localhost:7000/eipx/getMPTProof
router.post('/getMPTProof',
  getMPTProof,
);

export default router;
