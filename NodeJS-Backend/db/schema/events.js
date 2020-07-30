const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    id: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    eligibility: { type: String, required: true },
    description: { type: String, required: true },
    company_id: { type: String, required: true },
    registrations: [
        {
            registration_id: String,
            student_id: String,
            student_name: String,
            student_college: String,
            registered_on: String
        }
    ]
}, { _id: false }, { collection: 'events' });

const createModel = function () {
    return mongoose.model("events", eventSchema)
}

module.exports.createModel = createModel;
