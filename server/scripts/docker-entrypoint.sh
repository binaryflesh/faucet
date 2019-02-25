#!/bin/sh
SERVER_PORT=${SERVER_PORT:-3001}
MONGO_URL=${MONGO_URL:-mongodb://localhost:27017/faucetdb}
NODE_SCHEME=${NODE_SCHEME:-http}
NODE_HOST=${NODE_HOST:-localhost}
NODE_PORT=${NODE_PORT:-8545}
AQUARIUS_SCHEME=${AQUARIUS_SCHEME:-http}
AQUARIUS_HOST=${AQUARIUS_HOST:-localhost}
AQUARIUS_PORT=${AQUARIUS_PORT:-5000}
BRIZO_SCHEME=${BRIZO_SCHEME:-https}
BRIZO_HOST=${BRIZO_HOST:-localhost}
BRIZO_PORT=${BRIZO_PORT:-8030}
PARITY_SCHEME=${PARITY_SCHEME:-https}
PARITY_HOST=${PARITY_HOST:-localhost}
PARITY_PORT=${PARITY_PORT:-8545}
SECRET_STORE_SCHEME=${SECRET_STORE_SCHEME:-https}
SECRET_STORE_HOST=${SECRET_STORE_HOST:-localhost}
SECRET_STORE_PORT=${SECRET_STORE_PORT:-12001}
SECRET_STORE_THRESHOLD=${SECRET_STORE_THRESHOLD:-0}
SECRET_STORE_PASSWORD=${SECRET_STORE_PASSWORD:-unittest}
SECRET_STORE_ADDRESS=${SECRET_STORE_ADDRESS:-0xed243adfb84a6626eba46178ccb567481c6e655d}

envsubst < /server/config/index.js.template > /server/config/index.js
if [ "${LOCAL_CONTRACTS}" = "true" ]; then
  echo "Waiting for contracts to be generated..."
  while [ ! -f "/server/node_modules/@oceanprotocol/keeper-contracts/artifacts/ready" ]; do
    sleep 2
  done
fi
echo "Starting Faucet..."
npm run start
