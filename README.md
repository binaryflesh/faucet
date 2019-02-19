[![banner](https://raw.githubusercontent.com/oceanprotocol/art/master/github/repo-banner%402x.png)](https://oceanprotocol.com)

<h1 align="center">Faucet Server</h1>

The Ocean Faucet Server allows users to request Ocean Tokens and Ether for a particular Ethereum network.

* * *

**🐲🦑 THERE BE DRAGONS AND SQUIDS. This is in alpha state and you can expect running into problems. If you run into them, please open up [a new issue](https://github.com/oceanprotocol/faucet/issues). 🦑🐲**

* * *

## Table of Contents

- [Prerequisites](#prerequisites)
- [Get Started](#get-started)
  - [Configuration](#configuration)
  - [Deploy the Faucet Server](#deploy-the-faucet-server)
  - [Example](#example)
- [Contributing](#contributing)
- [License](#license)

* * *

## Prerequisites

- Node v8.11.3 or later
- MongoDB (for development)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- [Barge](https://github.com/oceanprotocol/barge)

## Get Started

Before deploying an instance of the Faucet server, you need to deploy some other stuff using [Barge](https://github.com/oceanprotocol/barge):

```bash
git clone https://github.com/oceanprotocol/barge
cd barge
./start_ocean.sh --latest --local-nile-node --no-pleuston --force-pull
```

### Configuration

You need to set some configuration settings in the file [server/config/index.js](server/config/index.js), e.g.:

```js
export default {
  env: process.env.NODE_ENV || 'development',
  server: {
    port: 3001
  },
  logger: {
    host: process.env.LOGGER_HOST, // Papertrail Logging Host
    port: process.env.LOGGER_PORT, // Papertrail Logging Port
  },
  database: {
    uri: process.env.MONGODB_URL || "mongodb://localhost:27017/faucetdb"
  },
  oceanConfig: {
    // tokens per request
    faucetTokens: process.env.FAUCET_TOKENS || 10,
    // ETH per request
    faucetEth: process.env.FAUCET_ETH || 3,
    // timespan between requests (in hours)
    faucetTimeSpan: process.env.FAUCET_TIMESPAN || 24,
    // the node of the blockchain to connect to, could also be infura
    nodeUri: process.env.KEEPER_URI || "http://localhost:8545",
    // the uri of aquarius
    aquariusUri: process.env.AQUARIUS_URI || "http://localhost:5000",
    // the uri of brizo
    brizoUri: process.env.BRIZO_URI || "http://localhost:8030",
    // the uri to the parity node you want to use for encryption and decryption
    parityUri: process.env.PARITY_URI || "http://localhost:8545",
    // the uri of the secret store that holds the keys
    secretStoreUri: process.env.SECRETSTORE_URI || "http://localhost:12001",
    // the threshold of nodes from the secret store that have to agree to the decrypt
    threshold: process.env.SECRETSTORE_THRESHOLD || 0,
    // the password for the account (in the local parity node) used to sign messages for secret store
    password: process.env.ACCOUNT_PWD || "node0",
    // the address of the account (in the local parity node) used to sign messages for secret store
    address: process.env.ADDRESS || "0x00bd138abd70e2f00903268f3db08f2d25677c9e",
  }
};
```

### Deploy the Faucet Server

You can deploy the Faucet server using `docker-compose`:

```bash
git clone https://github.com/oceanprotocol/faucet
cd faucet
docker-compose up
```

### Example

To request Ocean Tokens and Ether, a user can send an HTTP POST request to http://localhost:3001/faucet with an HTTP request body like:

```js
{
    "address": <string>,  //required
    "agent": <string>, //optional, Possible values - server, twitter, telegram, gitter  
}
```

The amount of Ocean Tokens and the amount of Ether are determined by the values of the configuration settings `oceanConfig.faucetTokens` and `oceanConfig.faucetEth`, respectively.

An example HTTP POST request using `wget`:

```bash
wget --header="Content-Type: application/json" \
--post-data '{"address": "0x7E187af69973a66e049a15E763c97CB726765f87", "agent": "twitter"}' \
http://localhost:3001/faucet
```

Sample Response Body:

```js
{
    "success": true,
    "message": "10 Ocean Tokens and 3 ETH were successfully deposited into your account"  
}
```

## Development

To start development you need to:

```bash
cd server
npm install
npm start watch
```

### Test

To start unit tests you need to:

```bash
cd server
npm run test
```

To get a test coverage report:

```bash
cd server
npm run coverage
npm run cov-report
```

### Production build

```bash
npm run build
```

## Contributing

See the page titled "[Ways to Contribute](https://docs.oceanprotocol.com/concepts/contributing/)" in the Ocean Protocol documentation.

## License

```text
Copyright 2018 Ocean Protocol Foundation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
