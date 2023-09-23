import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { ax } from '../config/axiom';
import { Constants } from '../shared/constants';
import { abi as AxiomV1QueryAbi } from '../abi/AxiomV1Query.json';
import { convertNumbersToHex } from '../utils';
dotenv.config();

interface Query {
  blockNumber: number,
  address: string,
  offsetBlockNumber: number,
  offsetSlot: number,
};

class Client {
  provider: any;
  providerUri: string;
  wallet: any;

  constructor() {
    let providerUri = process.env.PROVIDER_URI as string;
    this.providerUri = providerUri || '';
    if (!providerUri || providerUri === '') {
      // light client
      this.providerUri = 'http://127.0.0.1:8545';
    }
    this.createProvider();
    this.createWalletForPrivateKey()
  }

  createProvider() {
    const provider = new ethers.JsonRpcProvider(this.providerUri);
    this.provider = provider;
  }

  createWalletForPrivateKey() {
    // This must be set to a number that hasn't been queried yet (or any values that would calculate
    // a different keccakQueryResposne) since the AxiomV1Query contract saves the keccakQueryResponses
    // in a mapping and the call will fail if the keccakQueryResponse already exists in that mapping.
    // let currentQueryBlock = 9_142_026;

    const provider = this.getProvider();
    const wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      provider
    );
    this.wallet = wallet;
  }

  // Build queries using QueryBuilder.
  // The query should include any finalized block number.
  // It automatically gets slot 0.
  // If offsetSlot of 2 is provided, then it will get slot 0, 1, and 2.
  // If offsetBlock of 3 is provided, then it will get block numbers starting at `blockNumber`,
  // `blockNumber + 1`, and `blockNumber + 2`.
  // 
  // Note: In the below example, "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f" is the UNI_V2_ADDR
  //
  // TODO: Only allow finalized block numbers to be provided in the query
  //
  // Example queries:
  // [
  //   {
  //     blockNumber: 9744530,
  //   },
  //   {
  //     blockNumber: 9744540,
  //     address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  //   },
  //   {
  //     blockNumber: 9744549,
  //     address: "0x8eb3a522cAB99ED365e450Dad696357DE8aB7E9d",
  //     offsetBlockNumber: 2,
  //     offsetSlot: 2,
  //   },
  // ]

  private async buildQueryToVerify(queries: Array<Query>) {
    const qb = ax.newQueryBuilder();

    for (let i = 0; i < queries.length; i++) {
      // a query for a block header and the state of an account at that block,
      // and the value at storage slot 0 of the account at that block,
      // and query for a different storage slot.
      // repeat for each block up to the offsetBlockNumber and offsetSlot
      if (
        queries[i].blockNumber && queries[i].address &&
        queries[i].offsetBlockNumber &&
        queries[i].offsetSlot
      ) {
        for (let j = 0; j < queries[i].offsetBlockNumber; j++) {
          for (let k = 0; k < queries[i].offsetSlot; k++) {
            await qb.append({
              blockNumber: queries[i].blockNumber + k,
              address: queries[i].address,
              slot: queries[i].blockNumber + j,
            });
          }
        }
      // a query for a block header and the state of an account at that block,
      // and the value at storage slot 0 of the account at that block
      } else if (queries[i].blockNumber && queries[i].address) {
        await qb.append({
          blockNumber: queries[i].blockNumber,
          address: queries[i].address,
          slot: 0,
        });
      // a query for just a block header
      } else if (queries[i].blockNumber) {
        await qb.append({
          blockNumber: queries[i].blockNumber
        });
      }
    }

    // Bundle all of the queries above into a single query to submit to the AxiomV1Query contract
    const { keccakQueryResponse, queryHash, query } = await qb.build();
    console.log("keccakQueryResponse:", keccakQueryResponse);
    console.log("Query hash:", queryHash);
    console.log("Query data:", query);
    return { keccakQueryResponse, queryHash, query };
  }

  // After the contract has processed the sendQuery call in this function,
  // it will emit an event that the Prover will use to generate a ZK proof
  // of the data in the query. Once the Prover is done generating the ZK proof,
  // it will write that the keccakQueryResponse for that Query has been fulfilled,
  // and the following event will be emitted, letting you know that your data is
  // ready to be used:
  // event QueryFulfilled(bytes32 keccakQueryResponse, uint256 payment, address prover);
  async sendQueryToVerifier(queries: Array<Query>) {
    const { keccakQueryResponse, query } = await this.buildQueryToVerify(queries);
    const signer = this.getWalletSigner();
    const signerAddress = this.getWalletSignerAddress();
    const axiomV1Query = new ethers.Contract(
      Constants.AxiomV1QueryAddress,
      AxiomV1QueryAbi,
      signer
    );
  
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
    return res;
  }

  // read block, account, and storage data from verified query results.
  // to verify data about historic blocks, accounts, or storage,
  // by providing the `queryHash`
  //
  // example inputs:
  //   blockNumber 6779167 or 7778167
  //   address "0x6337b3caf9c5236c7f3d1694410776119edaf9fa",
  //   slot "0x8" (slot may also be BigNumberish, i.e. 8)
  // 
  // reference: https://github.com/axiom-crypto/axiom-sdk#reading-query-results
  async verifyQueryResults(
    queryHash: any, blockNumber?: any, address?: any, storageSlots?: Array<any>
  ) {
    // get a responseTree from the transaction hash of the sendQuery transaction
    // you can find this in explorer.axiom.xyz
    const responseTree = await ax.query.getResponseTreeForQueryHash(queryHash);
    const keccakBlockResponse = responseTree.blockTree.getHexRoot();
    const keccakAccountResponse = responseTree.accountTree.getHexRoot();
    const keccakStorageResponse = responseTree.storageTree.getHexRoot();

    // generate responses for data in historic block headers, accounts,
    // and storage slots by creating BlockResponse, AccountResponse, and
    // StorageResponse objects using getValidationWitness

    let blockResponse: any;
    if (blockNumber) {
      blockResponse = await ax.query.getValidationWitness(
        responseTree, blockNumber
      );
    }

    let accountResponse: any;
    if (address) {
      accountResponse = await ax.query.getValidationWitness(
        responseTree, blockNumber, address
      );
    }

    let storageResponse: any;
    let storageResponses: Array<any> = [];
    if (storageSlots && storageSlots?.length != 0) {
      for (let i = 0; i < storageSlots.length; i++) {
        storageResponse = await ax.query.getValidationWitness(
          responseTree, blockNumber, address, storageSlots[i]
        );
        storageResponses.push(storageResponse);
      }
    }

    console.log(
      JSON.stringify({
        keccakResponses: {
          keccakBlockResponse,
          keccakAccountResponse,
          keccakStorageResponse,
        },
        blockResponse,
        accountResponse,
        storageResponses: storageResponses?.map((res: any) =>
          convertNumbersToHex(res?.storageResponse)
        ) || [],
      })
    );

    return {
      keccakBlockResponse,
      keccakAccountResponse,
      keccakStorageResponse,
      blockResponse,
      accountResponse,
      storageResponse
    }
  }
  
  getProviderUri() {
    return this.providerUri;
  }

  getProvider() {
    return this.provider;
  }

  getWallet() {
    return this.wallet;
  }

  getWalletSigner() {
    let signer: ethers.Signer;
    signer = this.getWallet();
    return signer;
  }

  async getWalletSignerAddress() {
    let signer: ethers.Signer = this.getWalletSigner();
    let signerAddress = await signer.getAddress();
    return signerAddress;
  }

  async getLatestFinalizedBlock() {
    const provider = this.getProvider();
    // Latest finalized block number from provider
    // https://ethereum.stackexchange.com/a/153103/9680
    let latestFinalizedBlock = await provider.getBlock("finalized");
    if (latestFinalizedBlock == null) {
      return;
    }
    console.log("latestFinalizedBlock", latestFinalizedBlock.number);
    let currentQueryBlock = latestFinalizedBlock.number;
    return currentQueryBlock;
  }
}
 
export { 
  Client
}
