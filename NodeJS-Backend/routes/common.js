const express = require('express');
const router = express.Router();
const logger = require('tracer').colorConsole();
const _ = require('lodash');
const createError = require('http-errors');
const uuid = require('shortid');
const student = require('../db/schema/candidate').createModel();
const company = require('../db/schema/mentor').createModel();
const messages = require('../db/schema/message').createModel();
const operations = require('../db/operations');
const { auth } = require("../auth/auth");
const { checkAuth } = require("../auth/auth");
const uuidv1 = require('uuid/v1');
const commonService = require('../services/common');
const messageService = require('../services/messaging');
auth();

router.get('/signin', async (request, response) => {
  try {
    // const data = await {
    //   "body": request.body,
    //   "params": request.params,
    //   "query": request.query,
    //   "type": "signin"
    // }
    const data = await commonService.signin(request);
    response.status(data.status).json(data.body);
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching credentials';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.post('/signup', async (request, response) => {
  try {
    const data = await commonService.signup(request);
  
    response.status(data.status).json(data.body);
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching credentials';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/students', checkAuth, async (request, response) => {
  try {
    const data = await commonService.getAllStudents(request);
    response.status(data.status).json(data.body);
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching students details';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/messages/:id', checkAuth, async (request, response) => {
  try {
    const data = await messageService.getMessages(request);
    response.status(data.status).json(data.body);
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching messages';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.post('/messages/:id', checkAuth, async (request, response) => {
  try {
    const data = await messageService.postMessage(request);
    response.status(data.status).json(data.body);
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while saving messages';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

module.exports = router;
