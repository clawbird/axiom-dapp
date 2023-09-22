import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { ax } from '../config/axiom';
import { Constants } from '../shared/constants';
import { abi as AxiomV1QueryAbi } from '../abi/AxiomV1Query.json';
import { convertNumbersToHex } from '../utils';
dotenv.config();

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

  private async buildQueryToVerify(blockNumber: number) {
    // TODO - don't hard-code below address
    // here is an example query to show you how QueryBuilder works
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

    // TODO - don't hard-code below address
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

  // After the contract has processed the sendQuery call in this function,
  // it will emit an event that the Prover will use to generate a ZK proof
  // of the data in the query. Once the Prover is done generating the ZK proof,
  // it will write that the keccakQueryResponse for that Query has been fulfilled,
  // and the following event will be emitted, letting you know that your data is
  // ready to be used:
  // event QueryFulfilled(bytes32 keccakQueryResponse, uint256 payment, address prover);
  async sendQueryToVerifier(currentQueryBlockNumber: number) {
    const { keccakQueryResponse, query } = await this.buildQueryToVerify(currentQueryBlockNumber);
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
