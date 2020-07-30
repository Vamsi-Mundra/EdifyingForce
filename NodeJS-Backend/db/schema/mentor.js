const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    id: { type: String, required: true },
    mentorName: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: false },
    contact_num: { type: String, required: false },
    contact_name: { type: String, required: false },
    contact_email: { type: String, required: false },
    image: { type: String, required: false },
    applications: [
        {
            application_id: String,
            student_id: String,
            student_name: String,
            student_college: String,
            applied_on: String,
            student_resume: String,
            status: String,
            message: String
        }
    ]
}, { _id: false }, { collection: 'companies' });

const createModel = function () {
    return mongoose.model("companies", companySchema)
}

module.exports.createModel = createModel;
