import mongoose, { Schema } from 'mongoose'
import timestamps from 'mongoose-timestamp'

export const FaucetSchema = new Schema(
    {
        address: {
            type: String,
            index: true,
            trim: true,
            required: true
        },
        ethAmount: {
            type: Number,
            required: true
        },
        ethTrxHash: {
            type: String,
            trim: true,
            required: false
        },
        error: {
            type: String,
            trim: true,
            required: false
        },
        agent: {
            type: String,
            trim: true,
            required: false
        },
        insert: {
            type: Number,
            trim: true,
            required: true
        }
    },
    {
        collection: 'faucets'
    }
)

FaucetSchema.plugin(timestamps)
FaucetSchema.index({
    address: 1,
    ipaddress: 1,
    createdAt: 1
})

export default mongoose.model('Faucet', FaucetSchema)
