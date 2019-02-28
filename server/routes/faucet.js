import express from 'express'
import OceanFaucet from '../controllers/oceanFaucet'
import { check, body, validationResult } from 'express-validator/check'
import Eth from 'ethjs'

const faucetRoutes = express.Router()

faucetRoutes.get(
    '/trxhash',
    [check('id', 'Faucet request ID not sent').exists()],
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: 'Bad Request',
                errors: errors.array()
            })
        } else {
            OceanFaucet.getFaucetRequestEthTrxHash(req.query.id)
                .then(response => res.status(200).json(response))
                .catch(error => res.status(error.statusCode).json(error.result))
        }
    }
)

faucetRoutes.post(
    '/faucet',
    [
        check('address', 'Ethereum address not sent').exists(),
        body('address').custom(value => {
            if (!Eth.isAddress(value)) {
                return Promise.reject(new Error('Invalid Ethereum address'))
            } else {
                return Promise.resolve()
            }
        })
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: 'Bad Request',
                errors: errors.array()
            })
        } else {
            try {
                await OceanFaucet.requestCrypto(
                    req.body.address,
                    req.body.agent
                )
                res.status(200).json({ status: 'success' })
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        }
    }
)

export default faucetRoutes
