import { mongoose } from '../../dependencies.js';
import { v4 as uuidv4 } from 'uuid';

const Schema = mongoose.Schema;

const membersSchema = new Schema({
    id:{
      type: String,
      default: uuidv4,
      required: true
    },
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
    transfer_type:{
      type:String,
      required:false,
      description:"1:transfer all conversation , 2:transfer since the last message"
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
  });

export default mongoose.model("members", membersSchema);
