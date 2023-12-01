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
        type: Date,
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
        description: 'user status,1:client(purchased a plan),0:guest(never bought a plan) '
    }, 
    id:{
        type:String,
        required:false,
        description:"profile id from admin's bdd" //user id in admin's data base
    },
    profile_id:{
        type:String,
        required:false,
        description:"profile id from admin's bdd" //profile id in admin's data base
    },
    accountId:{
        type:String,
        required:false,
        description:"account id ref to the application id "
    },
    balance:{
        type:Number,
        required:false,
        description:"user balance"
    },
    free_balance:{
        type:Number,
        required:false,
        description:"user  free balance"
    },
    avatar:{
        type:String,
        required:false,
        description:"user image"
    }

})
export default mongoose.model("user", userSchema)