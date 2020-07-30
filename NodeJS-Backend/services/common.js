const logger = require('tracer').colorConsole();
const _ = require('lodash');
const createError = require('http-errors');
const uuid = require('shortid');
const jwt = require('jsonwebtoken');
const student = require('../db/schema/candidate').createModel();
const company = require('../db/schema/mentor').createModel();
const jobs = require('../db/schema/jobs').createModel();
const operations = require('../db/operations');
const { secret } = require('../auth/config');

async function handle_request(request) {
    switch (request.type) {
        case 'signin':
            return signin(request)
        case 'signup':
            return signup(request)
        case 'getAllStudents':
            return getAllStudents(request)
        case 'postStudentImage':
            return postStudentImage(request)
        case 'postCompanyImage':
            return postCompanyImage(request)
        case 'applyForJob':
            return applyForJob(request)
        default:
            return { "status": 404, body: { message: 'Invalid Route in Kafka' } }
    }
};

exports.signin = async (request) => {
    try {
        const { email } = request.query;
        const { persona } = request.query;
        const model = (persona === "student" ? student : company)
        const resp = await operations.findDocumentsByQuery(model, { email }, { _id: 0, __v: 0 })
        if (_.isEmpty(resp)) {
            throw createError(401, 'Invalid Credentials');
        }
        resp[0]['persona'] = persona;
        const token = jwt.sign(resp[0], secret, {
            expiresIn: 1008000
        });
        return { "status": 200, body: { "token": "JWT " + token } }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while fetching credentials';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.signup = async (request) => {
    try {
        const { entity, email, password, name, mentorName } = request.body;
        if (entity === 'company') {
            const resp = await operations.findDocumentsByQuery(company, { email }, { _id: 0, __v: 0 })
            if (resp.length === 1) {
                throw createError(409, 'Email Id already registered. Try logging in');
            }
            const data = {
                "id": uuid.generate(),
                name,
                email,
                password,
                mentorName,
                "location": request.body.location
            };
            await operations.saveDocuments(company, data, { runValidators: true })
        }
        if (entity === 'student') {
            const resp = await operations.findDocumentsByQuery(student, { email }, { _id: 0, __v: 0 })
            if (resp.length === 1) {
                throw createError(409, 'Email Id already registered. Try logging in');
            }
            const data = {
                "id": uuid.generate(),
                name,
                email,
                password,
                "college": request.body.college
            };
            await operations.saveDocuments(student, data, { runValidators: true })
        }
        return { "status": 200, body: { message: 'Signup Successful' } }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while fetching credentials';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.getAllStudents = async (request) => {
    try {
        let query = {}
        if (!_.isEmpty(request.query)) {
            if (_.isUndefined(request.query.exclude)) {
                query = { id: request.query.id }
            } else {
                query = { "id": { $ne: request.query.id } }
            }
        }
        const resp = await operations.findDocumentsByQuery(student, query, { _id: 0, __v: 0, password: 0 })
        return { "status": 200, body: resp }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while fetching credentials';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.postStudentImage = async (request) => {
    try {
        await operations.updateField(student, request.params.id, { "image": request.image.Location })
        return { "status": 200, body: { "message": "success" } }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.postCompanyImage = async (request) => {
    try {
        await operations.updateField(company, request.params.id, { "image": request.image.Location })
        return { "status": 200, body: { "message": "success" } }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.applyForJob = async (request) => {
    try {
        console.log(request)
        const studentData = await operations.findDocumentsByQuery(student, { "id": request.params.studentId }, {});
        let job = await operations.findDocumentsByQuery(company, { "id": request.params.companyId }, { 'applications': 1 });
        const application = {
            'application_id': uuid.generate(),
            "student_id": studentData[0]["id"],
            "student_name": studentData[0]['name'],
            "student_college": studentData[0]['college'],
            "status": 'Applied',
            'applied_on': new Date().toISOString().slice(0, 10),
            'student_resume': request.resume.Location
        }
        const resp = await operations.updateField(company, request.params.companyId, { $push: { applications: application } })
        let reg = studentData[0]['applications']
        reg = reg.concat([request.params.companyId])
        await operations.updateField(student, request.params.studentId, { 'applications': reg })
        return { "status": 200, body: resp }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while fetching credentials';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.handle_request = handle_request;
