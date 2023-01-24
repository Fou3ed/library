import {mongoose} from '../../dependencies.js';

const Schema = mongoose.Schema


const logsSchema = new Schema({
    app_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'app',
        required: true,
        description: 'iD of the log '
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        description: 'file name'
    },
    socket_id:{
        type:String,
        required:true,
    },
    action: {
        type: String,
        required: true,
        description: 'action'
    },
    element: {
        type: Number,
        required: true,
    },
    element_id: {
        type: String,
        required: true,
        default: false,
    },
    action_date:{
        type:Date,
        required:true,
        default:Date.now
    },
    ip_address:{
        type:String,
        required:true,
    }
})

export default mongoose.model("logs", logsSchema)