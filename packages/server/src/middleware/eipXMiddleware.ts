import { ax } from '../config/axiom';
import { client } from '../server';
const getLatestFinalizedBlock = async (req: any, res: any) => {
  const latestFinalizedBlock = await client.getLatestFinalizedBlock();
  // Return the client latest finalized block in response object
  res.json({
    latestFinalizedBlock
  })
}

const getMPTProof = (req: any, res: any, next: any) => {
  // TODO
}

const readBlockHeader = (req: any, res: any) => {
//   stateRoot = res.stateRoot;
//   // Return contract address in response object
//   res.json({
//     stateRoot: stateRoot
//   })
}

const getProof = (req: any, res: any) => {
//   proof = res.proof;
//   // Return proof in response object
//   res.json({
//     proof: proof
//   })
}

export {
  getLatestFinalizedBlock,
  getMPTProof,
  readBlockHeader,
  getProof
}
