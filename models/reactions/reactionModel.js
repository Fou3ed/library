import {mongoose} from '../../dependencies.js';
const Schema = mongoose.Schema

const reactionSchema = new Schema({
    message_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'message',
        required:true,
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    path:{
        type:String,
        required:false,

    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    updated_at:{
        type:Date,
        required:false,
    }

})
export default mongoose.model("react", reactionSchema)
