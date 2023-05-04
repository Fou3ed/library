import {mongoose} from '../../dependencies.js';

const Schema = mongoose.Schema


const userSchema = new Schema({
    nickname: {
        type: String,
        required: false,
        description: "A user's nickname",
    },
    full_name: {
        type: String,
        required: false,
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
        type: String,
        required: false,
        description: 'ADMIN,AGENT,OPERATOR'
    },
    is_active: {
        type: Boolean,
        required: false,
        description: 'indicates whether the user is active within the application'
    },
    is_online: {
        type: Boolean,
        required: false,
        description: 'indicates whether the user is connected to the server'
    },
    locale: {
        type: String,
        required: false,
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
        required: false,
        description: 'the time the user went offline to indicate when the user was last connected to the server.if the use is online, the value is set to 0'
    },
    metadata: {
        type: Object,
        required: false,
        description: 'A JSON object to store additional user information such as phone number,email or a long description of the user'
    },
    status: {
        type: Number,
        required: false,
        description: 'user status'
    },
    id:{
        type:String,
        required:false,
        description:"additional id" 
    }
})

export default mongoose.model("user", userSchema)