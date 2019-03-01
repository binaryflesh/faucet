/* eslint-disable prefer-promise-reject-errors */

import Faucet from '../models/faucet'
import logger from '../utils/logger'
import Web3Provider from '../utils/web3/Web3Provider'
import moment from 'moment'
import config from '../config'
import BigNumber from 'bignumber.js'

const web3 = Web3Provider.getWeb3(config.oceanConfig.nodeUri)
const amountToTransfer = web3.utils.toWei(config.server.faucetEth.toString())

const OceanFaucet = {
    /**
     * Ocean Faucet request method
     * @Param address faucet tokens recipient
     * @Param agent
     */
    requestCrypto: async (requestAddress, agent) => {
        const balance = await web3.eth.getBalance(config.server.faucetAddress)
        if (
            new BigNumber(balance).isLessThan(new BigNumber(amountToTransfer))
        ) {
            throw new Error(
                `Faucet server is not available (Seed account does not have enought ETH to process the request)`
            )
        }
        const doc = await Faucet.findOneAndUpdate(
            {
                $and: [
                    {
                        createdAt: {
                            $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
                        }
                    },
                    {
                        $or: [
                            {
                                address: requestAddress.toUpperCase()
                            }
                        ]
                    }
                ]
            },
            {
                $setOnInsert: {
                    address: requestAddress.toUpperCase(),
                    ethAmount: config.server.faucetEth,
                    agent: agent || 'server'
                },
                $inc: { insert: 1 }
            },
            {
                upsert: true,
                new: true
            }
        )
        if (doc.insert !== 1) {
            const lastRequest = moment(
                doc.createdAt,
                'YYYY-MM-DD HH:mm:ss'
            ).add(config.server.faucetTimeSpan, 'h')
            const reqTimestamp = moment()
            const diffStr = moment
                .utc(lastRequest.diff(reqTimestamp))
                .format('HH:mm:ss')
            const errorMsg =
                `Tokens were last transferred to you ${diffStr} ago. ` +
                `Faucet requests can be done every ${
                    config.server.faucetTimeSpan
                } hours`
            throw new Error(errorMsg)
        }
        const recordId = doc._id
        await OceanFaucet.transferEther(requestAddress, recordId)
    },

    /**
     * Function to transfer ETH to requestAddress
     * @Param ocean Ocean Protocol instance
     * @Param requestAddress faucet tokens recipient
     * @Param faucet record _id
     */
    transferEther: (requestAddress, recordId) => {
        return new Promise((resolve, reject) => {
            web3.eth
                .sendTransaction({
                    from: config.server.faucetAddress,
                    to: requestAddress,
                    value: amountToTransfer
                })
                .on('transactionHash', hash => {
                    logger.log(`ETH transaction hash ${hash}`)
                    Faucet.findOneAndUpdate(
                        {
                            _id: recordId
                        },
                        {
                            ethTrxHash: hash
                        },
                        (err, rec) => {
                            if (err)
                                logger.error(
                                    `Failed updating faucet record ${err}`
                                )
                            resolve()
                        }
                    )
                })
                .on('error', err => {
                    logger.error(`ETH transaction failed! ${err}`)
                    Faucet.findOneAndUpdate(
                        {
                            _id: recordId
                        },
                        {
                            error: err
                        },
                        (err, rec) => {
                            if (err)
                                logger.error(
                                    `Failed updating faucet record ${err}`
                                )
                            resolve()
                        }
                    )
                })
        })
    },

    /**
     * Get Trx hash of ETH deposit
     * @Param recordId faucet request ID
     */
    getFaucetRequestEthTrxHash: recordId => {
        return new Promise((resolve, reject) => {
            Faucet.findOne({
                _id: recordId
            }).exec((err, data) => {
                if (err)
                    reject({
                        statusCode: 500,
                        result: {
                            success: false,
                            message: err.message
                        }
                    })
                if (!data) {
                    reject({
                        statusCode: 400,
                        result: {
                            success: false,
                            message: 'Faucet record not found'
                        }
                    })
                } else {
                    resolve({
                        statusCode: 200,
                        result: {
                            success: true,
                            trxHash: data.ethTrxHash
                        }
                    })
                }
            })
        })
    }
}

module.exports = OceanFaucet
