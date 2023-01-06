import {mongoose} from '../../dependencies.js';
const Schema = mongoose.Schema

const notificationSchema = new Schema({
    notification_channel: {
        type: Object,
        required: true,
        description: "Declare which notification channels could be used to notify user about events",
    },
    notification_channel_name: {
        type: String,
        required: true,
        description: 'Notification channel name.Possible values are : apns,apns_voip,gcm, and email'
    },
    event_type: {
        type: String,
        required: true,
        description: ' Event type.Possible values are : -one_shot - a one-time event caused by an external object(valid onl if the date is not specified ). -fixed_date - a one-time event that occurs at a specified date (valid only if the date is specified).-period_date - is a reusable event that occurs withins a given period from the initial date (valid only if the period is specified).'
    },
    message: {
        type: String,
        required: true,
        description: 'Encoded message payload.Possible values are : plain text or push notification payload'
    },
    date: {
        type: Date,
        required: true,
        description: 'the date when event should be setInterval'
    },
    name: {
        type: String,
        required: true,
        description: 'A name of the event.Service information.Only for your own usage'
    },
    occurred_count: {
        type: Number,
        required: false,
        description: 'A number of times the event was sent '
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
        description: "Date & time when record was created"
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now,
        description: "Date & time when record was updated"
    },
    end_date: {
        type: Number,
        required: false,
        description: 'A date when the event was completed'
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
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        description: 'IF of the user who created the event'
    },
    recipients: {
        type: Object,
        required: true,
        description: 'Select event recipients'
    },
    origin: {
        type: ['rest', 'email', 'import'],
        required: true,
        description: 'Determines how this message was sent'

    }
})
export default mongoose.model("notification", notificationSchema)