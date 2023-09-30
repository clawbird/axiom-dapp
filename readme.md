# Axiom dApp

# Table of Contents

* [Introduction](#introduction)
* [Setup](#setup)
  * [API Usage](#api-usage)
* [Contributing](#contributing)
* [Setup (using Docker)](#docker-setup)
  * [Run Axiom](#run-axiom)
  * [Run API](#run-api)
  * [Run Axiom-Eth](#run-axiom-eth)
  * [Run Light Client (Helios)](#run-light-client-rust)
  * [Run Light Client (Lodestar)](#run-light-client-js)
  * [Run Portal Network (Trin)](#run-trin)
  * [Docker Troubleshooting](#docker-troubleshooting)

## Introduction <a id="introduction"></a>

This starter repo is a guide to get you started making your first [Axiom](https://axiom.xyz) query as quickly as possible using the [Axiom SDK](https://github.com/axiom-crypto/axiom-sdk).  To learn more about Axiom, check out the developer docs at [docs.axiom.xyz](https://docs.axiom.xyz) or join our developer [Telegram](https://t.me/axiom_discuss).

Follow the [Docker Setup](#docker_setup) instructions to conveniently set up Axiom, Light Client (Helios), and Portal Network (Trin) in separate Docker containers.

The original [Setup](#setup) intructions are to be incorporated into the [Docker Setup](#docker_setup) instructions and then deprecated.

## Setup <a id="setup"></a>

```bash
# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
source ~/.bashrc
nvm ls-remote --lts
# Install latest LTS node
nvm install --lts
# Install pnpm
npm install -g pnpm
pnpm setup
source ~/.bashrc
```

References:
* https://github.com/DavidWells/pnpm-workspaces-example
* https://github.com/ChainSafe/Multix

### API Usage <a id="api-usage"></a>

Copy `env.example` to `.env`.

```bash
cp ./.env.example ./.env
cp ./.env ./packages/server/src/.env
```

Fill in with your provider URL and Goerli private key.

> ⚠️ **WARNING**: Never use your mainnet private key on a testnet! You should never use a private key for an account you have on both mainnet and a testnet.

#### Run

To run the script in [`index.ts`](./packages/client/src/index.ts) that sends a query to `AxiomV1QueryMock` on Goerli testnet, run

```bash
pnpm run start-client
```

Note: [PNPM workspaces](https://pnpm.io/workspaces) are used

#### Validate Witness

For an example of how to read your query results from `AxiomV1QueryMock` after they are fulfilled, see [`getWitness.ts`](./packages/client/src/getWitness.ts).
This can be used to generate calldata for apps using Axiom.

Run the script with

```bash
pnpm run getWitness-client
```

This particular script was used to generate the [test data](https://github.com/axiom-crypto/axiom-apps/blob/main/uniswap-v3-twap/test/data/input.json) for the [Uniswap V3 TWAP demo app](https://demo.axiom.xyz/token-price-v3) smart contract.

## Contributing to EIP-X <a id="contributing"></a>

The fastest way to setup the latest code for contributing is to follow these instructions.

The goal is to incorporate any relevant latest Rust and TypeScript related contributions that have been made in https://github.com/sogolmalek/EIP-x into the forks of the following projects, and to add any other useful contributions.

Please fork the 'eip-x' branch of the following upstream Clawbird repositories and clone them to your local machine, depending on which you wish to contribute to:
* https://github.com/clawbird/helios
* https://github.com/clawbird/lodestar
* https://github.com/clawbird/trin

Then fork the 'eip-x' branch of the following upstream Clawbird repository and clone it to your local machine:
* https://github.com/clawbird/axiom-dapp

Then in your cloned fork of (i.e. https://github.com/<YOUR_GITHUB_USERNAME>/axiom-dapp), change the `REPO_URL` in the following files so it will allow you to work on your own cloned forks locally within Docker containers:
* Modify ./docker/Dockerfile.helios.dev changing `REPO_URL` to your fork (i.e. https://github.com/<YOUR_GITHUB_USERNAME>/helios.git)
* Modify ./docker/Dockerfile.lodestar.dev changing `REPO_URL` to your fork (i.e. https://github.com/<YOUR_GITHUB_USERNAME>/lodestar.git)
* Modify ./docker/Dockerfile.trin.dev changing `REPO_URL` to your fork (i.e. https://github.com/<YOUR_GITHUB_USERNAME>/trin.git)

Lastly follow the [Setup (using Docker)](#docker-setup) instructions to generate the local Docker containers based on your forks.

If you make changes then commit them to a branch in your fork, and then create a Pull Request or generate an Issue with any contributions to 'eip-x' branch of the relevant upstream Clawbird repository mentioned above.

### Roadmap

View the [project roadmap](https://github.com/orgs/clawbird/projects/2)

## Setup (using Docker) <a id="docker-setup"></a>

* Install and run [Docker](https://www.docker.com/)
* Follow [Run Axiom](#run-axiom) instructions to run Axiom, Light Client (Helios), and Portal Network (Trin)

### Run Axiom <a id="run-axiom"></a>

* Configure .env files
* Run the following to build Axiom, Helios, and Portal Network in separate Docker containers
    ```bash
    time ./docker/docker.sh
    ```
  * Note: It automatically enters you into the Docker container. To exit Docker container run CTRL+C, and to re-enter run `docker exec -it --user=root axiom-dapp-dev /bin/bash`
  * View logs
    ```bash
    docker logs -f axiom-dapp-dev
    ```
* Follow steps to [Run Light Client (Helios)](#run-light-client)
* Run the following inside the Docker container, or `docker exec -w /eip-x/axiom-dapp -it axiom-dapp-dev pnpm install --force && pnpm run start-client`
  ```bash
  pnpm install --force && pnpm run start-client
  ```
* View the `sendQuery` transaction in block 9572809 (e.g. https://goerli.etherscan.io/tx/0x8d3247c58e3d71b339bdcf36b94c19ace9714899a1b955af369442cc241a2b7c)
* View the `sendQuery` proof query response on Axiom explorer (e.g. https://explorer.axiom.xyz/goerli/query/0xb1d1f293915fd5e82d0cec8ec23b7b68a8147815bbb35fe6392607f2fda1c008)
* View the `fulfillQueryVsMMR` response (e.g. https://goerli.etherscan.io/tx/0xf15752e834a1a481a748904b8a47439e6ca4d9610c71aaa6b4050fa6d018bc81)
* Run the following inside the Docker container to read the query results
  ```bash
  pnpm run getWitness-client
  ```
* View response
  ```
  {"keccakResponses":{"keccakBlockResponse":"...","keccakAccountResponse":"...","keccakStorageResponse":"..."},"storageResponses":[{"blockNumber":"0x92117a","addr":"0x8eb3a522cab99ed365e450dad696357de8ab7e9d","slot":"0x0","value":"0x0000000000000000000000000000000000000000000000000000000000000001","leafIdx":"0x06","proof":["...","...","...","...","...","..."]},{"blockNumber":"0x92117b","addr":"0x8eb3a522cab99ed365e450dad696357de8ab7e9d","slot":"0x01","value":"0x0000000000000000000000000000000000000000000000000000000000000000","leafIdx":"0x07","proof":["...","...","...","...","...","..."]}]}
  ```

### Run API <a id="run-api"></a>

* Configure .env files
* Configure whether to use `mock: true` or not. If so it will use mock contracts https://github.com/axiom-crypto/axiom-sdk/blob/main/src/shared/chainConfig/goerli.ts#L68
* Run the following to build Axiom, Helios, and Portal Network in separate Docker containers
    ```bash
    time ./docker/docker.sh
    ```
  * Note: It automatically enters you into the Docker container. To exit Docker container run CTRL+C, and to re-enter run `docker exec -it --user=root api-dev /bin/bash`
  * View logs
    ```bash
    docker logs -f api-dev
    ```
* Follow steps to run a light client, either:
  * [Run Light Client (Helios)](#run-light-client), or;
  * [Run Light Client (Lodestar)](#run-light-client-js)
* Run the following inside the Docker container, or `docker exec -w /eip-x/api -it api-dev pnpm install --force && pnpm run start-server`
  ```bash
  pnpm install --force && pnpm run start-server
  ```
* Request the latest finalized block from the client by running the following command in another terminal window 
  ```bash
  curl -v -X GET http://localhost:7000/eipx/getLatestFinalizedBlock -H "Content-Type: application/json"
  ```
* Send query to verifier by providing a block number that has been finalized.
  ```bash
  curl -v -X GET http://localhost:7000/eipx/sendQueryToVerifier --data '{"queries": [{"blockNumber": 9744549, "address": "0x8eb3a522cAB99ED365e450Dad696357DE8aB7E9d", "offsetBlockNumber": 2, "offsetSlot": 2}]}' -H "Content-Type: application/json"
  ```
  * Example response:
    ```bash
    {"data":{"_type":"TransactionReceipt","blockHash":"0x4f90673882cb6cb9781ccb9fb4019ed3c1b4aae0ef43d89443282cffbd01c4c2","blockNumber":9745942,"contractAddress":null,"cumulativeGasUsed":"108734","from":"0x1dd907ABb024E17d196de0D7Fe8EB507b6cCaae7","gasPrice":"100000000000","gasUsed":"87734","hash":"0xfa6dde491a5a68a7efecc6d6a870497f5478ebca1943f46b3d3f589581d703ce","index":1,"logs":[{"_type":"log","address":"0x4Fb202140c5319106F15706b1A69E441c9536306","blockHash":"0x4f90673882cb6cb9781ccb9fb4019ed3c1b4aae0ef43d89443282cffbd01c4c2","blockNumber":9745942,"data":"0x5bc2000a8732a6ff1cd3fe334c8331e96ccfcecb1cfacc67788ccbaca3ae2555000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000009607960000000000000000000000001dd907abb024e17d196de0d7fe8eb507b6ccaae76122480456cf0f66fc39f18fcb1848eeafdd99cc891659c4310c781e5111f03a","index":0,"topics":["0x51bc40919d53d6a0750201d2087c589a09286b4e9f320919d04ad4545ced4abb"],"transactionHash":"0xfa6dde491a5a68a7efecc6d6a870497f5478ebca1943f46b3d3f589581d703ce","transactionIndex":1}],"logsBloom":"0x00000010100000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000010000000000000000000000000","status":1,"to":"0x4Fb202140c5319106F15706b1A69E441c9536306"}
    ```
* Verify query results
  ```bash
  curl -v -X GET http://localhost:7000/eipx/verifyQueryResults --data '{"queryHash": "0x6122480456cf0f66fc39f18fcb1848eeafdd99cc891659c4310c781e5111f03a", "blockNumber": 9744549, "address": "0x8eb3a522cAB99ED365e450Dad696357DE8aB7E9d"}' -H "Content-Type: application/json"
  ```
  * Note: This does not work for some reason. It sends a request to `/v1/query/get_data_for_query?queryHash=0x6122480456cf0f66fc39f18fcb1848eeafdd99cc891659c4310c781e5111f03a&chainId=5&contractAddress=0x82842F7a41f695320CC255B34F18769D68dD8aDF&mock=false` but generates error `QueryNotFoundInDbError`
`

### Run Axiom-Eth <a id="run-axiom-eth"></a>

* Update the forked clone https://github.com/ltfschoen/axiom-eth that is used in Dockerfile.axiom-eth.dev so it has the latest changes in its upstream repository, and use its latest Rust version
* Configure .env files
  * Obtain and add your Infura API key to `INFURA_ID` in the .env file
* Run the following to build separate Docker containers
    ```bash
    time ./docker/docker.sh
    ```
  * Note: It automatically enters you into the Docker container. To exit Docker container run CTRL+C, and to re-enter run `docker exec -it --user=root axiom-eth-dev /bin/bash`
  * View logs
    ```bash
    docker logs -f axiom-eth-dev
    ```
* Follow steps to run a light client, either:
  * [Run Light Client (Helios)](#run-light-client), or;
  * [Run Light Client (Lodestar)](#run-light-client-js)
  * **TODO** Currently axiom-eth connects to Infura, so need to figure out how to have it connect to a local node instead like Helios or Lodestar
* Run the following inside the Docker container, or `docker exec -w /eip-x/axiom-eth -it axiom-eth-dev cargo run --bin header_chain --release -- --help`
  ```bash
  cargo run --bin header_chain --release -- --help
  ```
  * Note: See axiom-eth/src/bin/AxiomV1.md
* Example:
  ```
  cargo run --bin header_chain --release -- --network goerli --start 9744549 --end 9744549 --max-depth 10 --initial-depth 7 --final evm --extra-rounds 1 --calldata --create-contract

  Start:   Generating SNARKs for blocks 9744549 to 9744549, max depth 10, initial depth 7, finality evm
thread 'main' panicked at '"configs/headers/goerli_7.json" does not exist: Os { code: 2, kind: NotFound, message: "No such file or directory" }', /eip-x/axiom-eth/axiom-eth/src/util/mod.rs:85:37
  ```

### Run Light Client (Helios) <a id="run-light-client"></a>

* Run Helios as an Ethereum light client in a Docker container running on port 8545 with that port exposed to the host machine, based on this PR https://github.com/a16z/helios/pull/262
* Enter the Light Client Docker container run `docker exec -it --user=root helios-dev /bin/bash`
* If necessary, configure /.env files in /eip-x/helios with the:
  * Add API Keys that you obtain for Mainnet and/or Goerli
  * Checkpoints for Mainnet and/or Goerli
  * Chain DB path for Mainnet and/or Goerli
* Set the environment variables
  ```sh
  docker exec -w /eip-x/helios -it --user=root helios-dev sh -c ". /eip-x/helios/.env"
  ```
* Follow the instructions "Running Helios CLI using Docker" at https://github.com/a16z/helios/pull/262/files to run it
* Run a Helios Light Client node on Goerli by running the following outside the Docker container
```bash
docker exec -w /eip-x/helios -it --user=root helios-dev cargo run -- \
  --network goerli \
  --consensus-rpc http://testing.prater.beacon-api.nimbus.team \
  --execution-rpc https://ethereum-goerli-rpc.allthatnode.com \
  --checkpoint 0x3754cde3eabb1815c15d78ef27a279d4abbd3ece0f720535acd5ca80b3a16f91
```

> Replace the checkpoint if necessary by following the instructions "Running Helios CLI using Docker" at https://github.com/a16z/helios/pull/262/files
> If you get error `ERROR consensus::consensus] sync failed: could not fetch bootstrap rpc error on method: bootstrap, message: error decoding response body` then you need to get and use a more recent checkpoint value
> To kill a process on port 8545 from outside the Docker container run the following to get the PID, then run `docker exec -w /eip-x/helios -it helios-dev kill -9 <PID>`, replacing <PID> with the PID number shown.
```bash
docker exec -w /eip-x/helios -it --user=root helios-dev lsof -ti tcp:8545 | { read -d "" x; echo "$x" }
```

* Run a Helios Light Client node on Mainnet
```bash
docker exec -w /eip-x/helios -it --user=root helios-dev cargo run -- \
  --network mainnet \
  --consensus-rpc https://www.lightclientdata.org \
  --execution-rpc https://ethereum-mainnet-rpc.allthatnode.com \
  --checkpoint 0xbff6f8b24e15ad4420b34a56ded02702694d1c8141e05a75a5afbff8ef2ad71b
```

### Run Light Client (Lodestar) <a id="run-light-client-js"></a>

* Update the forked clone https://github.com/ltfschoen/lodestar that is used in Dockerfile.lodestar.dev so it has the latest changes in its upstream repository, and use its latest Rust version
* Configure .env files
* Run the following to build Axiom, Helios, and Portal Network in separate Docker containers
    ```bash
    time ./docker/docker.sh
    ```
  * Note: It automatically enters you into the Docker container. To exit Docker container run CTRL+C, and to re-enter run `docker exec -w /eip-x/lodestar -it --user=root lodestar-dev /bin/ash`
    * Note: It uses Arch Linux
  * View logs
    ```bash
    docker logs -f lodestar-dev
    ```
* Run the following inside the Docker container, or `docker exec -w /eip-x/lodestar -it lodestar-dev node /eip-x/lodestar/packages/cli/bin/lodestar --help`
  ```bash
  /eip-x/lodestar/packages/cli/bin/lodestar --help
  ```

### Run Portal Network (Trin) <a id="run-trin"></a>

* Update the forked clone https://github.com/ltfschoen/trin that is used in Dockerfile.trin.dev so it has the latest changes in its upstream repository, and use its latest Rust version
* Run the shell script in [Run Axiom](#run-axiom) to build Axiom, Helios, and Portal Network in separate Docker containers
  ```bash
  time ./docker/docker.sh
  ```
* Enter the Trin Docker container run:
```bash
docker exec -it --user=root trin-dev /bin/bash
```

* Run Trin
  ```bash
  cargo run -- --help

  RUST_LOG=INFO cargo run -- \
    --web3-http-address http://127.0.0.1:8547 \
    --web3-transport http \
    --discovery-port 8001 \
    --external-address 127.0.0.1:8001
    --bootnodes default \
    --mb 200 \
    --no-stun
  ```
  * Note that `--mb` is how much storage the node database may use
  * Use `--ephemeral` to use temporary database
  * If you use `--web3-transport ipc` then it uses default path to json-rpc endpoint `/tmp/trin-jsonrpc.ipc` for `--web3-ipc-path <WEB3_IPC_PATH>`

* Refer to ./book/src/developers and ./book/src/users/installation folders in the Trin repository for help

### Docker Troubleshooting <a id="docker-troubleshooting"></a>

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
* If you get error `ENOSPC: no space left on device` or `No space left on device` or `LLVM ERROR: IO failure on output stream: No space left on device` or `You don't have enough free space in /var/cache/apt/archives/` then:
  * Update Docker Settings. If using Docker for Mac, go to Settings > Resources, and increase CPUs, Memory, Swap, and Virtual disk limit. Leave some space for host machine to use. See https://stackoverflow.com/questions/44533319/how-to-assign-more-memory-to-docker-container
  * Try remove exited containers and dangling images:
    ```bash
    docker container prune
    docker system prune -af
    docker rm $(docker ps -q -f 'status=exited')
    docker rmi $(docker images -q -f "dangling=true")
    ```
  * Alternatively update docker-compose.yaml to include `shm_size: 1gb` for `service` (when running) and `build` (when building)
* If you get error `error: linking with `cc` failed: exit status: 1 note: LC_ALL="C" collect2: fatal error: ld terminated with signal 9 error: could not compile trin (bin "purge_db") due to previous error` when running `cargo build --workspace` with Trin
  * TODO - try running `cargo build -p trin` instead
* If you get error `fatal: detected dubious ownership in repository`:
  * Try removing creation of user `trin-user` in the ./docker/Dockerfile.trin.dev
* if you get error `fatal: refusing to fetch into branch 'refs/heads/master' checked out at '/eip-x/trin'` on Linux
  * Caused by `git fetch origin master:master` when you are already in that branch `master` so try creating a different branch that you are going to work on
* If you are low on space it may be due to browser tabs
  * Go to Chrome Settings (dotted icon) > More Tools > Task Manager
    * Close tabs using large memory
* If you get the following error then it's because you may have set an `---external-address` port but used a different `--discovery-port` when running the Trin CLI, so try just setting the `--discovery-port` to the same port as used by `---external-address` in the interim, because Trin needs to be updated so that when a user sets `--external-address` port then it should use the same port as `--discovery-port`
  ```bash
  2023-09-03T02:01:19.555485Z ERROR portalnet::overlay: Error bonding with bootnode alias=trin-ams3-1 protocol=History error=The request timed out
  ...
  2023-09-03T02:01:25.010546Z  WARN discv5::service: RPC Request failed: id: 33589e8caa589311, error InvalidRemotePacket
  ...
  2023-09-03T02:01:28.290272Z ERROR portalnet::overlay: Error bonding with bootnode alias=ultralight-2 protocol=History error=The request timed out
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
