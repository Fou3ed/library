import {mongoose} from '../../dependencies.js';

const Schema = mongoose.Schema


const roleSchema = new Schema({
    name: {
        type: String,
        required: true,
        description: "Role full name",
    },
    role_type: {
        type: String,
        required: true,
        description: 'Admin,Participant,Member,Operator'
    },
    permissions: {
        type: Array,
        required: true,
        description: 'Array of enabled actions'
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
        description: "Date & time when record was created,filled automatically"
    }
})

export default mongoose.model("role", roleSchema)