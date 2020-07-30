const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    id: { type: String, required: true },
    title: { type: String, required: true },
    posting_date: { type: String, required: true },
    deadline: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    company_id: { type: String, required: true },
    applications: [
        {
            application_id: String,
            student_id: String,
            student_name: String,
            student_college: String,
            applied_on: String,
            student_resume: String,
            status: String
        }
    ]
}, { _id: false }, { collection: 'jobs' });

const createModel = function () {
    return mongoose.model("jobs", jobSchema)
}

module.exports.createModel = createModel;
