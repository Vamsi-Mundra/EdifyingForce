const logger = require('tracer').colorConsole();
const _ = require('lodash');
const uuid = require('shortid');
const dotenv = require('dotenv');
dotenv.config();
const student = require('../db/schema/candidate').createModel();
const job = require('../db/schema/jobs').createModel();
const event = require('../db/schema/events').createModel();
const company = require('../db/schema/mentor').createModel();
const operations = require('../db/operations');

async function handle_request(request) {
    switch (request.type) {
        case 'getAllStudentJobs':
            return getAllStudentJobs(request)
        case 'updateProfile':
            return updateProfile(request)
        case 'postProfile':
            return postProfile(request)
        case 'deleteProfile':
            return deleteProfile(request)
        case 'getProfile':
            return getProfile(request)
        case 'getStudentProfiles':
            return getStudentProfiles(request)
        case 'getEvents':
            return getEvents(request)
        case 'getRegistrations':
            return getRegistrations(request)
        case 'getStudentApplications':
            return getStudentApplications(request)
    }
};

exports.filterJobs = async (jobs, id) => {
    for (const job of jobs) {
        job.applied = '';
        if (_.isUndefined(job.applications)) return;
        for (const application of job.applications) {
            if (id === application.student_id) job.applied = 'Applied';
        }
    }
};

exports.getAllStudentJobs = async (request) => {
    try {
        let aggr = [{
            $lookup: {
                localField: 'company_id',
                from: 'companies',
                foreignField: 'id',
                as: 'company'
            }
        }, { $unwind: '$company' },
        { $match: { 'deadline': { $gte: new Date().toISOString().slice(0, 10) } } },
        {
            $project: {
                _id: 0,
                id: 1,
                title: 1,
                posting_date: 1,
                deadline: 1,
                location: 1,
                salary: 1,
                description: 1,
                category: 1,
                company_id: 1,
                applications: 1,
                "company_name": "$company.name",
                "image": "$company.image"
            }
        }];
        const resp = await job.aggregate(aggr);
        const mentors = await operations.findDocumentsByQuery(company, {}, {})
        await this.filterJobs(mentors, request.query.studentId);
        return { "status": 200, body: mentors }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.updateProfile = async (request) => {
    try {
        if (!_.isUndefined(request.body.objective)) {
            await operations.updateField(student, request.params.id, { "career_objective": request.body.objective })
        }
        if (!_.isUndefined(request.body.college_name)) {
            let studentData = await operations.findDocumentsByQuery(student, { "id": request.params.id }, { 'education': 1 });
            const education = [request.body]
            _.remove(studentData[0].education, function (edu) {
                return edu.id === request.body.id;
            });
            studentData[0].education.push(education[0]);
            studentData[0].education = _.orderBy(studentData[0].education, ['year_of_passing'], ['desc']);
            await operations.updateField(student, request.params.id, { "education": studentData[0].education })
        }
        if (!_.isUndefined(request.body.company)) {
            let studentData = await operations.findDocumentsByQuery(student, { "id": request.params.id }, { 'experience': 1 });
            const experience = [request.body]
            _.remove(studentData[0].experience, function (exp) {
                return exp.id === request.body.id;
            });
            studentData[0].experience.push(experience[0]);
            studentData[0].experience = _.orderBy(studentData[0].experience, ['year_of_starting'], ['desc']);
            await operations.updateField(student, request.params.id, { "experience": studentData[0].experience })
        }
        if (!_.isUndefined(request.body.name)) {
            await operations.updateField(student, request.params.id, { "name": request.body.name })
        }
        if (!_.isUndefined(request.body.skills)) {
            await operations.updateField(student, request.params.id, { "skills": request.body.skills })
        }
        if (!_.isUndefined(request.body.email)) {
            const data = [request.body]
            await operations.updateField(student, request.params.id, data[0])
        }
        return { "status": 200, body: { message: 'Update Success' } }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.postProfile = async (request) => {
    try {
        if (!_.isUndefined(request.body.education)) {
            let studentData = await operations.findDocumentsByQuery(student, { "id": request.params.id }, {});
            const education = [request.body.education]
            education[0].id = uuid.generate();
            studentData[0].education.push(education[0]);
            studentData[0].education = _.orderBy(studentData[0].education, ['year_of_passing'], ['desc']);
            await operations.updateField(student, request.params.id, { "education": studentData[0].education })
        }
        if (!_.isUndefined(request.body.experience)) {
            let studentData = await operations.findDocumentsByQuery(student, { "id": request.params.id }, {});
            let experience = [request.body.experience];
            experience[0].id = uuid.generate();
            studentData[0].experience.push(experience[0]);
            studentData[0].experience = _.orderBy(studentData[0].experience, ['year_of_starting'], ['desc']);
            await operations.updateField(student, request.params.id, { "experience": studentData[0].experience })
        }
        return { "status": 200, body: { message: 'Save Success' } }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.deleteProfile = async (request) => {
    try {
        if (request.query.entity === 'education') {
            let studentData = await operations.findDocumentsByQuery(student, { "id": request.params.id }, { 'education': 1 });
            _.remove(studentData[0].education, function (edu) {
                return edu.id === request.query.id;
            });
            studentData[0].education = _.orderBy(studentData[0].education, ['year_of_passing'], ['desc']);
            await operations.updateField(student, request.params.id, { "education": studentData[0].education })
        }
        if (request.query.entity === 'experience') {
            let studentData = await operations.findDocumentsByQuery(student, { "id": request.params.id }, { 'experience': 1 });
            _.remove(studentData[0].experience, function (exp) {
                return exp.id === request.query.id;
            });
            studentData[0].experience = _.orderBy(studentData[0].experience, ['year_of_starting'], ['desc']);
            await operations.updateField(student, request.params.id, { "experience": studentData[0].experience })
        }
        return { "status": 200, body: { message: 'Delete Success' } }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.getProfile = async (request) => {
    try {
        let query = { id: request.params.id };
        const resp = await operations.findDocumentsByQuery(student, query, { _id: 0, __v: 0, password: 0 })
        if (_.isUndefined(resp[0]["education"])) resp[0]["education"] = []
        if (_.isUndefined(resp[0]["experience"])) resp[0]["experience"] = []
        if (_.isUndefined(resp[0]["objective"])) resp[0]["objective"] = ""
        return { "status": 200, body: resp[0] }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.getStudentProfiles = async (request) => {
    try {
        const studentProfiles = await operations.findDocumentsByQuery(student, { "id": { $ne: request.query.id } }, {})
        return { "status": 200, body: studentProfiles }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.getEvents = async (request) => {
    try {
        let aggr = [
            {
                $lookup: {
                    localField: 'company_id',
                    from: 'companies',
                    foreignField: 'id',
                    as: 'company'
                }
            }, { $unwind: '$company' },
            { $match: { 'date': { $gte: new Date().toISOString().slice(0, 10) } } },
            {
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
                    "company_name": "$company.mentorName",
                    "image": "$company.image",
                    "company": "$company.name"
                }
            }];
        const resp = await event.aggregate(aggr);
        return { "status": 200, body: resp }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.fetchCompanyDetails = async (eventId) => {
    let aggr = [
        { $match: { id: eventId } },
        {
            $lookup: {
                localField: 'company_id',
                from: 'companies',
                foreignField: 'id',
                as: 'company'
            }
        },
        { $unwind: '$company' },
        {
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
                "company_name": "$company.name",
                "image": "$company.image"
            }
        }
    ];
    let resp = await event.aggregate(aggr);
    return resp[0]
}

exports.getRegistrations = async (request) => {
    try {
        let registrations = await operations.findDocumentsByQuery(student, { 'id': request.params.studentId }, {});
        let data = [];
        for (registration of registrations[0]['registrations']) {
            data.push(await fetchCompanyDetails(registration))
        }
        return { "status": 200, body: data }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.fetchJobDetails = async (jobId) => {
    let aggr = [
        { $match: { id: jobId } },
        {
            $lookup: {
                localField: 'company_id',
                from: 'companies',
                foreignField: 'id',
                as: 'company'
            }
        },
        { $unwind: '$company' },
        {
            $project: {
                _id: 0,
                id: 1,
                title: 1,
                posting_date: 1,
                deadline: 1,
                salary: 1,
                description: 1,
                category: 1,
                company_id: 1,
                "company_name": "$company.name",
                "image": "$company.image"
            }
        }
    ];
    let resp = await job.aggregate(aggr);
    return resp[0]
}

exports.getStudentApplications = async (request) => {
    try {
        let applications = await operations.findDocumentsByQuery(student, { 'id': request.params.studentId }, {});
        let data = [];
        for (application of applications[0]['applications']) {
            let statusData = await operations.findDocumentsByQuery(company, { 'id': application, 'applications.student_id': request.params.studentId }, { })
            let status = statusData[0]['applications'][0]['status']
            //let applicationData = await this.fetchJobDetails(application)
            statusData[0].status = status;
            //console.log(statusData)
            data.push(statusData[0])
        }
        console.log(data)
        return { "status": 200, body: data }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Internal Server Error';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.handle_request = handle_request;