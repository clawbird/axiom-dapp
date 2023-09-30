import express from 'express';

// @ts-ignore
const router = new express.Router();

// Require middleware modules
import {
  getLatestFinalizedBlock,
  getMPTProof,
  getProof,
  processLatestFinalizedBlock,
  readBlockHeader,
  sendQueryToVerifier,
  verifyQueryResults,
} from '../middleware/eipXMiddleware';

// GET localhost:7000/eipx/getLatestFinalizedBlock
router.get('/getLatestFinalizedBlock',
  getLatestFinalizedBlock,
);

// GET localhost:7000/eipx/sendQueryToVerifier
router.get('/sendQueryToVerifier',
  processLatestFinalizedBlock,
  sendQueryToVerifier,
);

// GET localhost:7000/eipx/verifyQueryResults
router.get('/verifyQueryResults',
  verifyQueryResults,
);

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
