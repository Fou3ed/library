import {mongoose} from '../../dependencies.js';

const Schema = mongoose.Schema


const mediaSchema = new Schema({
    media_id: {
        type: Number,
        required: true,
        description: "ID of the file ",
    },
    content_type: {
        type: String,
        required: true,
        description: 'MIME content type'
    },
    name: {
        type: String,
        required: true,
        description: 'file name'
    },
    size: {
        type: Number,
        required: true,
        description: 'Size file'
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
        description: "Date & time when a record was created "
    },
    public: {
        type: Boolean,
        required: true,
        default: false,
        description: 'File visibility.if the file is public then it s possible to download it without a session token.Default:false'
    }
})

export default mongoose.model("media", mediaSchema)