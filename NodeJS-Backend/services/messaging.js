const logger = require('tracer').colorConsole();
const _ = require('lodash');
const student = require('../db/schema/candidate').createModel();
const company = require('../db/schema/mentor').createModel();
const messages = require('../db/schema/message').createModel();
const operations = require('../db/operations');

async function handle_request(request) {
    switch (request.type) {
        case 'getMessages':
            return getMessages(request)
        case 'postMessage':
            return postMessage(request)
        default:
            return { "status": 404, body: { message: 'Invalid Route in Kafka' } }
    }
};

exports.fetchProfileDetails = async (participants) => {
    let data = [];
    data = await operations.findDocumentsByQuery(student, { id: { $in: participants } }, { id: 1, name: 1, image: 1, college: 1 })
    if (data.length > 0) return data;
    return await operations.findDocumentsByQuery(company, { id: { $in: participants } }, { id: 1, name: 1, image: 1, location: 1 })
}

exports.fetchMessages = async (id) => {
    const resp = await operations.findDocumentsByQuery(messages, { participants: id }, { _id: 0, __v: 0 });
    let data = [];
    for (message of resp) {
        message['receiver'] = (await this.fetchProfileDetails(_.difference(message['participants'], [id])))[0];
        data.push(message)
    }
    return _.orderBy(data, ['lastUpdated'], ['desc']);;
}

exports.getMessages = async (request) => {
    try {
        const { id } = request.params;
        const data = await this.fetchMessages(id)
        return { "status": 200, body: data }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while fetching messages';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.newConversation = async (request) => {
    try {
        await operations.saveDocuments(messages, request.body, { runValidators: true })
        return await this.fetchMessages(request.body.conversations[0]['id'])
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while posting messages';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
};

exports.postMessage = async (request) => {
    try {
        const { id } = request.params;
        const msgs = await operations.findDocumentsByQuery(messages, { id }, { _id: 0, __v: 0 });
        if (msgs.length === 0) return { "status": 200, body: await this.newConversation(request) }
        await operations.updateField(messages, id, { $push: { conversations: request.body }, 'lastUpdated': new Date().toISOString() })
        const resp = await this.fetchMessages(request.body.id)
        return { "status": 200, body: resp }
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while posting messages';
        const code = ex.statusCode ? ex.statusCode : 500;
        return { "status": code, body: { message } }
    }
}

exports.handle_request = handle_request;
