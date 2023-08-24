import { Axiom, AxiomConfig } from "@axiom-crypto/core";
import { ethers } from "ethers";
import { Constants } from "./shared/constants";
import { abi as AxiomV1QueryAbi } from "./lib/abi/AxiomV1Query.json";
import dotenv from "dotenv";
dotenv.config();

let providerUri = process.env.PROVIDER_URI as string;
if (!providerUri || providerUri === "") {
  // Helios light client
  providerUri = "http://127.0.0.1:8545";
}
let apiKey = process.env.PROVIDER_API_KEY_GOERLI as string;
const config: AxiomConfig = {
  apiKey,
  providerUri,
  version: "v1",
  chainId: 5, // Goerli; defaults to 1 (Ethereum Mainnet)
  mock: true, // builds proofs without utilizing actual Prover resources
};
const ax = new Axiom(config);
console.log('Axiom instance: ', ax);
// here is an example query to show you how QueryBuilder works
async function newQuery(blockNumber: number) {
  const UNI_V2_ADDR = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  const qb = ax.newQueryBuilder();

  // a query for just a block header
  await qb.append({ blockNumber });
  // a query for a block header and the state of an account at that block
  // this query in fact contains the previous one
  await qb.append({ blockNumber, address: UNI_V2_ADDR });
  // a query for a block header, account state, and the value at storage slot 0 of the account at that block
  // this query in fact contains the previous two
  await qb.append({ blockNumber, address: UNI_V2_ADDR, slot: 0 });
  // query for a different storage slot
  await qb.append({ blockNumber, address: UNI_V2_ADDR, slot: 1 });

  // put an address that has non-empty slots
  const testAddress = "0x8eb3a522cAB99ED365e450Dad696357DE8aB7E9d";
  // we can query other blocks and accounts too:
  for (let i = 0; i < 2; i++) {
    qb.append({ blockNumber: blockNumber + i, address: testAddress });
  }
  for (let i = 0; i < 2; i++) {
    await qb.append({
      blockNumber: blockNumber + 2 + i,
      address: testAddress,
      slot: i,
    });
  }

  // Bundle all of the queries above into a single query to submit to the AxiomV1Query contract
  const { keccakQueryResponse, queryHash, query } = await qb.build();
  console.log("keccakQueryResponse:", keccakQueryResponse);
  console.log("Query hash:", queryHash);
  console.log("Query data:", query);
  return { keccakQueryResponse, queryHash, query };
}

async function main() {
  // This must be set to a number that hasn't been queried yet (or any values that would calculate
  // a different keccakQueryResposne) since the AxiomV1Query contract saves the keccakQueryResponses
  // in a mapping and the call will fail if the keccakQueryResponse already exists in that mapping.
  // let currentQueryBlock = 9_142_026;

  let signer: ethers.Signer;

  const provider = new ethers.JsonRpcProvider(providerUri);
  const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY as string,
    provider
  );
  signer = wallet;

  let signerAddress = await signer.getAddress();

  const axiomV1Query = new ethers.Contract(
    Constants.AxiomV1QueryAddress,
    AxiomV1QueryAbi,
    signer
  );

  // Latest finalized block number from provider
  // https://ethereum.stackexchange.com/a/153103/9680
  let latestFinalizedBlock = await provider.getBlock("finalized");
  if (latestFinalizedBlock == null) {
    return;
  }
  console.log("latestFinalizedBlock", latestFinalizedBlock.number);
  let currentQueryBlock = latestFinalizedBlock.number;

  const { keccakQueryResponse, query } = await newQuery(currentQueryBlock);

  console.log("Sending query transaction...");
  const tx = await axiomV1Query.sendQuery(
    keccakQueryResponse,
    signerAddress,
    query,
    {
      value: ethers.parseEther("0.01"),
      gasPrice: ethers.parseUnits("100", "gwei"),
    }
  );
  console.log("tx", tx);

  const res = await tx.wait();
  console.log("res", res);
}

main();
