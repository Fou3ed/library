import {mongoose}from '../../dependencies.js';
const Schema = mongoose.Schema

const systemMessageSchema = new Schema({
    event_type: {
        type: String,
        required: true,
        description: "Event type.Possible values are :- one_shot - a one-time event caused by an external object(valid only if the date is not specified).-fixed_date - a one-time event that occurs at a specified date (valid only if the date is specified.-period_date - is a reusable event that occurs within a given period from the initial date (valid only if the period is specified)",
    },
    message: {
        type: String,
        required: true,
        description: 'Encoded message payload.Possible values are : plain text or push notification payload '
    },
    name: {
        type: String,
        required: true,
        description: 'A name of the event.Service information.Only for your own usage'
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
        description: "Date & time when record was created."
    },
    active: {
        type: Boolean,
        required: true,
        description: 'Marks the event as active/inactive'
    },
    application_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'app',
        required: true,
        description: 'ID of the application'
    },
    recipients: {
        type: Object,
        required: true,
        description: 'Select event recipients'
    }
})

export default mongoose.model("systemMessage", systemMessageSchema)