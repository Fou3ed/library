import {mongoose} from '../../dependencies.js';
const Schema = mongoose.Schema

const messageSchema = new Schema({
    type: {
        type: String,
        required: true,
        description: "the type of the message.The value is MSG for a text message",
    },
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'conversation',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        description: 'The user who sent the message'
    },
    mentioned_users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        description: 'an array of users mentioned in the message '
    }],
    readBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false,
        description: 'Read-only.List of the user Ids who have already read and received this message.Does not include the sender.Example:["123456","654321"]'
    },
    is_removed: {
        type: Boolean,
        required: false,
        description: 'Indicates whether the message is removed from the channel'
    },
    message: {
        type: String,
        required: true,
        description: 'he content of the message'
    },
    data: {
        type: String,
        required: false,
        description: 'Additional message information such as custom font size or font type in JSON or other formats'
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
        description: "the time when the credentials were registered"
    },
    updated_at: {
        type: Date,
        required: false,
        description: 'the time when '
    },
    attachments: {
        type: Object,
        required: false,
        description: 'The files contained n the message.This property is empty for any text messages '
    },
    parent_message_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message',
        required: false,
        description: 'the unique ID of a threads parent message.This property is only retrieved if the message is a reply '
    },
    parent_message_info: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message',
        required: false,
        description: 'the information of the threads parent message including the text,user information,and message type.this property is only retrieved if the message is a reply'
    },
    location: {
        type: [Number],
        required: false,
        description: 'An array of two numbers which represent the longitude and latitude if this location respectively.[51.481083,-3.178306]'
    },
    origin: {
        type: String,
        required: true,
        description: 'Determines how this message was sent.respectively,Via a web browser (or mobile Webview),via the REST API,via reply-to-email'
    },
    read: {
        type: Date,
        required: false,
        description: "mark message as read "
    },
    delivered: {
        type: Date,
        required: false,
        description: 'Mark message when it s delivered '

    }
})

export default mongoose.model("message", messageSchema)