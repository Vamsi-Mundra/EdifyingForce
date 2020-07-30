const logger = require('tracer').colorConsole();
const _ = require('lodash');
const uuid = require('shortid');
const dotenv = require('dotenv');
dotenv.config();
const jobs = require('../db/schema/jobs').createModel();
const events = require('../db/schema/events').createModel();
const company = require('../db/schema/mentor').createModel();
const student = require('../db/schema/candidate').createModel();
const operations = require('../db/operations');

async function handle_request(request) {
    switch (request.type) {
        case 'getAllJobs':
            return getAllJobs(request)
        case 'createJob':
            return createJob(request)
        case 'getApplicants':
            return getApplicants(request)
        case 'updateApplicationStatus':
            return updateApplicationStatus(request)
        case 'getJobDetails':
            return getJobDetails(request)
        case 'getAllEvents':
            return getAllEvents(request)
        case 'createEvent':
            return createEvent(request)
        case 'getApplications':
            return getApplications(request)
        case 'getCompanyProfile':
            return getCompanyProfile(request)
        case 'updateCompanyProfile':
            return updateCompanyProfile(request)
        case 'getEventsDetails':
            return getEventsDetails(request)
        case 'registerForEvent':
            return registerForEvent(request)
    }
};

exports.getAllJobs = async (request) => {
    try {
        const resp = await operations.findDocumentsByQuery(jobs, { company_id: request.params.id }, { _id: 0, __v: 0 })
        return { "status": 200, body: resp }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.getAllApplicants = async (request) => {
    try {
        const resp = await operations.findDocumentsByQuery(company, { id: request.params.id }, { _id: 0, __v: 0 })
        return { "status": 200, body: resp }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.createJob = async (request) => {
    try {
        const data = {
            "id": uuid.generate(),
            "title": request.body.title,
            "posting_date": request.body.posting_date,
            "deadline": request.body.deadline,
            "location": request.body.location,
            "salary": request.body.salary,
            "description": request.body.description,
            "category": request.body.category,
            "company_id": request.params.id
        };
        const resp = await operations.saveDocuments(jobs, data, { runValidators: true })
        delete resp["_id"];
        delete resp["__v"];
        return { "status": 200, body: resp }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.getApplicants = async (request) => {
    try {
        const resp = await operations.findDocumentsByQuery(jobs, { "id": request.params.jobId }, { 'applications': 1 })
        return { "status": 200, body: resp[0]['applications'] }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.updateApplicationStatus = async (request) => {
    try {
        let applications = await operations.findDocumentsByQuery(company, { "id": request.body.mentorId }, { 'applications': 1 })
        applications = applications[0]['applications'];
        for (application of applications) {
            if (application.application_id === request.params.applicationId) application.status = request.body.status
        }
        await operations.updateField(company, request.body.mentorId, { "applications": applications })
        return { "status": 200, body: { message: 'Update Success' } }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.getJobDetails = async (request) => {
    try {
        const resp = await operations.findDocumentsByQuery(jobs, { "id": request.params.jobId }, { _id: 0, __v: 0 })
        return { "status": 200, body: resp }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.getAllEvents = async (request) => {
    try {
        const resp = await operations.findDocumentsByQuery(events, { company_id: request.params.id }, { _id: 0, __v: 0 })
        return { "status": 200, body: resp }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.createEvent = async (request) => {
    try {
        const data = {
            "id": uuid.generate(),
            "name": request.body.name,
            "date": request.body.date,
            "time": request.body.time,
            "location": request.body.location,
            "eligibility": request.body.eligibility,
            "description": request.body.description,
            "company_id": request.params.id
        };
        const resp = await operations.saveDocuments(events, data, { runValidators: true })
        delete resp["_id"];
        delete resp["__v"];
        return { "status": 200, body: resp }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.getApplications = async (request) => {
    try {
        const resp = await operations.findDocumentsByQuery(events, { "id": request.params.eventId }, { 'registrations': 1 })
        return { "status": 200, body: resp[0]['registrations'] }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.getCompanyProfile = async (request) => {
    try {
        let query = {};
        if (!_.isEmpty(request.query)) {
            query = { id: request.query.id };
        }
        const resp = await operations.findDocumentsByQuery(company, query, { _id: 0, __v: 0, password: 0 })
        return { "status": 200, body: resp[0] }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.updateCompanyProfile = async (request) => {
    try {
        if (!_.isUndefined(request.body.description)) {
            await operations.updateField(company, request.params.id, { "description": request.body.description })
        }
        if (!_.isUndefined(request.body.contact_name)) {
            const data = {
                "contact_name": request.body.contact_name,
                "contact_num": request.body.contact_num,
                "contact_email": request.body.contact_email
            }
            await operations.updateField(company, request.params.id, data)
        }
        if (!_.isUndefined(request.body.name)) {
            const data = {
                "name": request.body.name,
                "location": request.body.location
            }
            await operations.updateField(company, request.params.id, data)
        }
        return { "status": 200, body: { message: 'Update Success' } }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.getEventsDetails = async (request) => {
    try {
        let aggr = [
            { $match: { id: request.params.id } },
            {
                $lookup: {
                    localField: 'company_id',
                    from: 'companies',
                    foreignField: 'id',
                    as: 'company'
                }
            }, { $unwind: '$company' }, {
                $project: {
                    _id: 0,
                    id: 1,
                    name: 1,
                    date: 1,
                    time: 1,
                    location: 1,
                    eligibility: 1,
                    description: 1,
                    company_id: 1,
                    registrations: 1,
                    "company_name": "$company.name",
                    "image": "$company.image"
                }
            }];
        const resp = await events.aggregate(aggr);
        return { "status": 200, body: resp[0] }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.registerForEvent = async (request) => {
    try {
        const studentData = await operations.findDocumentsByQuery(student, { "id": request.body.studentId }, {});
        let event = await operations.findDocumentsByQuery(events, { "id": request.params.eventId }, { 'registrations': 1 });
        const registration = {
            'id': uuid.generate(),
            "student_id": studentData[0]["id"],
            "student_name": studentData[0]['name'],
            "student_college": studentData[0]['college'],
            'registered_on': new Date().toISOString().slice(0, 10)
        }
        event[0]['registrations'].push(registration);
        const resp = await operations.updateField(events, request.params.eventId, { "registrations": event[0]['registrations'] })
        let reg = studentData[0]['registrations']
        reg = reg.concat([request.params.eventId])
        await operations.updateField(student, request.body.studentId, { 'registrations': reg })
        return { "status": 200, body: resp }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.handle_request = handle_request;