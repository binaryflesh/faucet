FROM node:10-alpine

RUN apk add --no-cache --update\
    bash\
    g++\
    gcc\
    gettext\
    git\
    krb5-dev\
    krb5-libs\
    krb5\
    make\
    cairo-dev\
    python

# Create app directory
WORKDIR /server

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

# Build server
RUN npm run build

# Define logging level
# ENV DEBUG='*' full debug logs
# ENV DEBUG='faucet:*' all inside faucet
# ENV DEBUG='faucet:info' info inside faucet
# ENV DEBUG='faucet:log' log inside faucet
# ENV DEBUG='faucet:error' error inside faucet
# ENV DEBUG='faucet:*,-faucet:info' everything but info
ENV DEBUG='faucet:*'

# Default ENV values
# config/config.js
ENV NODE_ENV='production'
ENV SERVER_PORT=3001
ENV MONGO_URL='mongodb://mongo:27017/faucetdb'
ENV FAUCET_TOKENS=10
ENV FAUCET_TIMESPAN=24
ENV NODE_SCHEME='http'
ENV NODE_HOST='localhost'
ENV NODE_PORT='8545'
ENV AQUARIUS_SCHEME='http'
ENV AQUARIUS_HOST='localhost'
ENV AQUARIUS_PORT='5000'
ENV BRIZO_SCHEME='http'
ENV BRIZO_HOST='localhost'
ENV BRIZO_PORT=8030
ENV PARITY_SCHEME='http'
ENV PARITY_HOST='localhost'
ENV PARITY_PORT=8545
ENV SECRET_STORE_SCHEME='http'
ENV SECRET_STORE_HOST='localhost'
ENV SECRET_STORE_PORT=12001
ENV SECRET_STORE_THRESHOLD=0
ENV SECRET_STORE_PASSWORD='node0'
ENV SECRET_STORE_ADDRESS='0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e'

ENTRYPOINT ["/server/scripts/docker-entrypoint.sh"]

# Expose listen port
EXPOSE 3001
