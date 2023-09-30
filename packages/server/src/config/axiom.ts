import { Axiom, AxiomConfig } from '@axiom-crypto/core';
import dotenv from 'dotenv';
dotenv.config();

let providerUri = process.env.PROVIDER_URI as string;
if (!providerUri || providerUri === '') {
  // Light client
  providerUri = 'http://127.0.0.1:8545';
}
let apiKey = process.env.PROVIDER_API_KEY_GOERLI as string;
const config: AxiomConfig = {
  apiKey,
  providerUri,
  version: 'v1',
  chainId: 5, // Goerli; defaults to 1 (Ethereum Mainnet)
  mock: false, // builds proofs with or without utilizing actual Prover resources
};
const ax = new Axiom(config);
console.log('Axiom instance: ', ax);

export {
  ax
}
