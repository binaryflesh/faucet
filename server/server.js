import express from 'express'
import expressValidator from 'express-validator'
import compression from 'compression'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import requestIp from 'request-ip'
import config from './config'
import logger from './utils/logger'

import faucetRoutes from './routes/faucet'

const app = express()
app.use(cors())
app.use(compression())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(requestIp.mw())
app.use(expressValidator())
app.use('/', faucetRoutes)

mongoose
    .connect(config.database.uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .catch(error => {
        logger.error('Error connecting to database:')
        logger.error(error)
        process.exit(1)
    })

const server = app.listen(config.server.port, error => {
    if (error) {
        logger.error('Error starting server:')
        logger.error(error)
        process.exit(1)
    }
    logger.info(`Ocean Faucet server running on port ${config.server.port}`)
})

export default server
