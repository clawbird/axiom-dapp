# Axiom Quickstart

## Introduction

This starter repo is a guide to get you started making your first [Axiom](https://axiom.xyz) query as quickly as possible using the [Axiom SDK](https://github.com/axiom-crypto/axiom-sdk).  To learn more about Axiom, check out the developer docs at [docs.axiom.xyz](https://docs.axiom.xyz) or join our developer [Telegram](https://t.me/axiom_discuss).

## Setup

Install `npm` or `yarn` or `pnpm`:

```bash
# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
# Install latest LTS node
nvm install --lts
# Install pnpm
npm install -g pnpm
pnpm setup
source ~/.bashrc
```

To install this project's dependencies, run

```bash
pnpm install
```

Copy `env.example` to `.env` and fill in with your provider URL (and optionally Goerli private key).
You can export your Goerli private key in Metamask by going to "Account Details" and then "Export Private Key".

> ⚠️ **WARNING**: Never use your mainnet private key on a testnet! You should never use a private key for an account you have on both mainnet and a testnet.

## Run

To run the script in [`index.ts`](./src/index.ts) that sends a query to `AxiomV1QueryMock` on Goerli testnet, run

```bash
pnpm start
```

## Validate Witness

For an example of how to read your query results from `AxiomV1QueryMock` after they are fulfilled, see [`getWitness.ts`](./src/getWitness.ts).
This can be used to generate calldata for apps using Axiom.

Run the script with

```bash
pnpm getWitness
```

This particular script was used to generate the [test data](https://github.com/axiom-crypto/axiom-apps/blob/main/uniswap-v3-twap/test/data/input.json) for the [Uniswap V3 TWAP demo app](https://demo.axiom.xyz/token-price-v3) smart contract.

## Docker Setup

* Run the following.
  * Note: Optionally remove installing Rust in the Dockerfile.
  * Note: If you exit the Docker container, re-enter it with `docker exec -it axiom /bin/bash`
    ```bash
    ./docker/docker.sh
    ```
* Run the following inside the Docker container:
  ```bash
  pnpm start
  ```
* View the `sendQuery` transaction in block 9572809 (e.g. https://goerli.etherscan.io/tx/0x8d3247c58e3d71b339bdcf36b94c19ace9714899a1b955af369442cc241a2b7c)
* View the `sendQuery` proof query response on Axiom explorer (e.g. https://explorer.axiom.xyz/goerli/query/0xb1d1f293915fd5e82d0cec8ec23b7b68a8147815bbb35fe6392607f2fda1c008)
* View the `fulfillQueryVsMMR` response (e.g. https://goerli.etherscan.io/tx/0xf15752e834a1a481a748904b8a47439e6ca4d9610c71aaa6b4050fa6d018bc81)
* Run the following inside the Docker container to read the query results
  ```bash
  pnpm getWitness
  ```
* View response
  ```
  {"keccakResponses":{"keccakBlockResponse":"...","keccakAccountResponse":"...","keccakStorageResponse":"..."},"storageResponses":[{"blockNumber":"0x92117a","addr":"0x8eb3a522cab99ed365e450dad696357de8ab7e9d","slot":"0x0","value":"0x0000000000000000000000000000000000000000000000000000000000000001","leafIdx":"0x06","proof":["...","...","...","...","...","..."]},{"blockNumber":"0x92117b","addr":"0x8eb3a522cab99ed365e450dad696357de8ab7e9d","slot":"0x01","value":"0x0000000000000000000000000000000000000000000000000000000000000000","leafIdx":"0x07","proof":["...","...","...","...","...","..."]}]}
  ```