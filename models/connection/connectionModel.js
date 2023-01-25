import {mongoose} from '../../dependencies.js';

const Schema = mongoose.Schema


const connectionSchema = new Schema({
    app_id: {
        type: String,
        required: true,
        description: "the ID of the application",
        ref: 'app_id',
    },
    id:{
        type:randomUUID,
        required:true,
    },
    api_token: {
        type: String,
        required: true,
        description: 'the credential of the application for accessing the Chat API'
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
        description: "the time when the credentials were registered"
    }
})

export default mongoose.model("connection", connectionSchema)