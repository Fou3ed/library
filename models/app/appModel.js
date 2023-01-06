import {mongoose} from '../../dependencies.js'
const Schema = mongoose.Schema


const AppSchema = new Schema({
    app_name: {
        type: String,
        required: true,
        description: "the name of the application "
    },
    api_token: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'connection',
        required: true,
        description: "the credential of the application for accessing the chat API"
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
        description: "the time when the credentials were registered"
    },
    plan: {
        type: String,
        required: true,
        description: "the subscription plan of the application.Valid values are internal and customer"
    },
    message_retention_hours: {
        type: Number,
        required: false,
        description: "the length of time of hours that the messages are retained for.the maximum message retention period is six months"
    },
    max_message_length: {
        type: Number,
        required: true,
        description: "the maximum length of a message allowed to be sent within the application "
    }
})

export default mongoose.model("APP", AppSchema)