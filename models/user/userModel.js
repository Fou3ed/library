import {mongoose} from '../../dependencies.js';

const Schema = mongoose.Schema


const userSchema = new Schema({
    nickname: {
        type: String,
        required: true,
        description: "A user's nickname",
    },
    full_name: {
        type: String,
        required: true,
        description: 'User full name'
    },
    socket_id:{
       type:String,
       required:false 
    },
    profile_url: {
        type: String,
        required: false,
        description: 'the URL of a use profile image'
    },
    access_token: {
        type: String,
        required: false,
        description: 'an opaque string that identifies the user'
    },
    role: {
        type: Object,
        required: true,
        description: 'ADMIN,AGENT,OPERATOR'
    },
    is_active: {
        type: Boolean,
        required: true,
        description: 'indicates whether the user is active within the application'
    },
    is_online: {
        type: Boolean,
        required: true,
        description: 'indicates whether the user is connected to the server'
    },
    locale: {
        type: String,
        required: true,
        description: 'FR-fr'
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
        description: "the time when the credentials were registered"
    },
    last_seen_at: {
        type: Number,
        required: true,
        description: 'the time the user went offline to indicate when the user was last connected to the server.if the use is online, the value is set to 0'
    },
    metadata: {
        type: Object,
        required: false,
        description: 'A JSON object to store additional user information such as phone number,email or a long description of the user'
    },
    status: {
        type: Number,
        required: true,
        description: 'user status'
    }

})

export default mongoose.model("user", userSchema)