import {mongoose} from '../../dependencies.js';

 const Schema = mongoose.Schema

 const conversationSchema  = new Schema({
    name: {
        type: String,
        required: true,
        description: "the channel topic or the name of the conversation",
    },
    channel_url: {
        type: String,
        required: true,
        description: 'the unique URL of the channel'
    },
    conversation_type: {
        type: String,
        required: false,
        description: 'Possible values are: type=1 (public) , type=2 (group) type=3 (Direct) type=4 (visitor)'
    },
    description: {
        type: String,
        required: false,
        description: 'A string data which contain additional channel information such a long description of the channel '
    },
    members_count: {
        type: Number,
        required: true,
        description: 'the current number of participants in the channel'
    },
    max_length_message: {
        type: Number,
        required: true,
        description: 'the maximum length of a message allowed to be sent within the channel'
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
        description: "the time when the credentials were registered"
    },
    operators: {
        type: Array,
        required: true,
        description: 'the array of [users] registered as operators of the channel'
    },
    owner_id: {
        type:Number,
        ref:'user',
        required: true,
        description: 'ID of conversation s owner (user)'
    },
    last_message: {
        type: Object,
        required: false,
        description: 'Last sent message in this conversation'
    },
    unread_messages_count: {
        type: Number,
        required: false,
        description: 'Number of unread messages in this conversation'
    },
    permission: {
        type: Object,
        required: true,
        description: 'Permissions of this conversation'
    },
    metadata: {
        type: Object,
        required: false,
        description: '[optional] Additional data'
    }
})

export default mongoose.model("conversation", conversationSchema)