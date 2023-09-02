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

* Install and run [Docker](https://www.docker.com/)

### Run Axiom <a id="run-axiom"></a>

* Configure .env files
* Run the following to start Axiom in a separate Docker container
  * Note: If you exit the Docker container, re-enter it with `docker exec -it axiom /bin/bash`
    ```bash
    time ./docker/docker.sh
    ```
  * Note: It automatically enters you into the Docker container. To exit Docker container run CTRL+C, and to re-enter run `docker exec -it --user=root axiom-quickstart-dev /bin/bash`
  * View logs
    ```bash
    docker logs -f axiom-quickstart-dev
    ```
* Follow steps to [Run Light Client (Helios)](#run-light-client)
* Run the following inside the Docker container, or `docker exec -w /eip-x/axiom-quickstart -it axiom-quickstart-dev pnpm start`
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

### Run Light Client (Helios) <a id="run-light-client"></a>

* Run Helios as an Ethereum light client in a Docker container running on port 8545 with that port exposed to the host machine using this PR https://github.com/a16z/helios/pull/262
* To enter the Light Client Docker container run `docker exec -it --user=root helios-dev /bin/bash`
* If necessary, configure /.env files in /eip-x/helios with the:
  * Add API Keys that you obtain for Mainnet and/or Goerli
  * Checkpoints for Mainnet and/or Goerli
  * Chain DB path for Mainnet and/or Goerli
* Set the environment variables
  ```sh
  docker exec -w /eip-x/helios -it helios-dev sh -c ". /eip-x/helios/.env"
  ```
* Follow the instructions "Running Helios CLI using Docker" at https://github.com/a16z/helios/pull/262/files to run it
* Run a Helios Light Client node on Goerli by running the following outside the Docker container
```bash
docker exec -w /eip-x/helios -it helios-dev cargo run -- \
  --network goerli \
  --consensus-rpc http://testing.prater.beacon-api.nimbus.team \
  --execution-rpc https://ethereum-goerli-rpc.allthatnode.com \
  --checkpoint 0x3754cde3eabb1815c15d78ef27a279d4abbd3ece0f720535acd5ca80b3a16f91
```

> Replace the checkpoint if necessary by following the instructions "Running Helios CLI using Docker" at https://github.com/a16z/helios/pull/262/files
> If you get error `ERROR consensus::consensus] sync failed: could not fetch bootstrap rpc error on method: bootstrap, message: error decoding response body` then you need to get and use a more recent checkpoint value
> To kill a process on port 8545 from outside the Docker container run the following to get the PID, then run `docker exec -w /eip-x/helios -it helios-dev kill -9 <PID>`, replacing <PID> with the PID number shown.
```bash
docker exec -w /eip-x/helios -it helios-dev lsof -ti tcp:8545 | { read -d "" x; echo "$x" }
```

* Run a Helios Light Client node on Mainnet
```bash
docker exec -w /eip-x/helios -it helios-dev cargo run -- \
  --network mainnet \
  --consensus-rpc https://www.lightclientdata.org \
  --execution-rpc https://ethereum-mainnet-rpc.allthatnode.com \
  --checkpoint 0xbff6f8b24e15ad4420b34a56ded02702694d1c8141e05a75a5afbff8ef2ad71b
```

### Docker Troubleshooting

* Kill a port `PORT` (e.g. `8545`)
  ```bash
  PORT=8545
  kill -9 $(lsof -ti tcp:$PORT)
  ```
* Restart a Docker container name (e.g. `axiom`) that is shown as `Exited` when you run `docker ps -a`
  ```bash
  CONTAINER_NAME=axiom
  docker restart $CONTAINER_NAME
  ```
* If you get error `error from daemon in stream: Error grabbing logs: invalid character '\x00' looking for beginning of value` when viewing Docker logs then:
  * Add `ENV LANG=C.UTF-8` to the Dockerfile. See https://github.com/docker/for-linux/issues/140#issuecomment-571519609
  * Add the following to the docker-compose-dev.yml file
    ```bash
    volumes:
    - /var/lib/docker/containers:/mnt/log/containers:ro
    - /var/run/docker.sock:/var/run/docker.sock:ro
    ```
* If you get error `ENOSPC: no space left on device` then remove exited containers and dangling images:
  ```bash
  docker rm $(docker ps -q -f 'status=exited')
  docker rmi $(docker images -q -f "dangling=true")
  ```
* To find the path to a Docker container logs
  ```
  CONTAINER_NAME=axiom
  docker inspect $CONTAINER_NAME | grep log
  ```
* List Docker containers
  ```bash
  docker ps -a
  ```
* List Docker images
  ```bash
  docker images -a
  ```
* Enter Docker container shell
  ```bash
  CONTAINER_NAME=axiom
  docker exec -it $CONTAINER_NAME /bin/bash
  ```
* View Docker container logs
  ```bash
  docker logs -f $CONTAINER_ID
  ```
* Remove Docker container
  ```bash
  docker stop $CONTAINER_NAME; docker rm $CONTAINER_NAME;
  ```
* Remove Docker image
  ```bash
  docker rmi $IMAGE_ID
  ```
