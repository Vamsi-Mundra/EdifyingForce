const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    id: { type: String, required: true },
    lastUpdated: { type: String, required: true },
    participants: { type: Array, required: true },
    conversations: [
        {
            id: String,
            message: String,
            timestamp: String
        }
    ]
}, { _id: false }, { collection: 'messages' });

const createModel = function () {
    return mongoose.model("messages", messageSchema)
}

module.exports.createModel = createModel;
