import {
    mongoose
} from '../../dependencies.js';

const Schema = mongoose.Schema

/**
 * conversation members Schema
 * define every conversation and her members 
 * every conversation have her members 
 * members are users (user_id)
 */
const membersSchema = new Schema({
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'conversation',
        required: true,
        description: "conversation Id  ",
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        description: "user Id"
    },
    conversation_name: {
        type: String,
        required: false,
        description: 'conversation name'
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
        description: "Date & time when a record was created "
    },
    updated_at: {
        type: Date,
        required: false,
        default: Date.now,
        description: "Date & time when a record was updated"
    }
})

export default mongoose.model("member", membersSchema)