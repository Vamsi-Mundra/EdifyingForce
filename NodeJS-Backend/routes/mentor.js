const express = require('express');
const router = express.Router();
const logger = require('tracer').colorConsole();
const dotenv = require('dotenv');
dotenv.config();
const { checkAuth } = require("../auth/auth");
const companySvc  = require('../services/mentor');

router.get('/company/:id/jobs', checkAuth, async (request, response) => {
  try {
    const data = await companySvc.getAllJobs(request);
    response.status(data.status).json(data.body);
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching jobs';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/company/:id/applicants', checkAuth, async (request, response) => {
  try {
    const data = await companySvc.getAllApplicants(request);
    response.status(data.status).json(data.body);
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching jobs';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.post('/company/:id/jobs', checkAuth, async (request, response) => {
  try {
    const data = await companySvc.createJob(request);
    response.status(data.status).json(data.body);
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching jobs';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/company/:companyId/job/:jobId/applicants', checkAuth, async (request, response) => {
  try {
    const data = await companySvc.getApplicants(request);
    response.status(data.status).json(data.body);
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching applicants';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.put('/applications/:applicationId', checkAuth, async (request, response) => {
  try {
    const data = await companySvc.updateApplicationStatus(request);
    response.status(data.status).json(data.body);
  
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while Updating applicantion Status';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/job/:jobId', checkAuth, async (request, response) => {
  try {
    const data = await companySvc.getJobDetails(request);
    response.status(data.status).json(data.body);
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching jobs details';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/company/:id/events', checkAuth, async (request, response) => {
  try {
    const data = await companySvc.getAllEvents(request);
    response.status(data.status).json(data.body);
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching events';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.post('/mentor/:id/events', checkAuth, async (request, response) => {
  try {
    const data = await companySvc.createEvent(request);
    response.status(data.status).json(data.body);
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while posting event';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/company/:companyId/event/:eventId/applicants', checkAuth, async (request, response) => {
  try {
 
    const data = await companySvc.getApplications(request);
    response.status(data.status).json(data.body);
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching event applicants';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/company', checkAuth, checkAuth, async (request, response) => {
  try {
   
    const data = await companySvc.getCompanyProfile(request);
    response.status(data.status).json(data.body);
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching company details';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.put('/company/:id/profile', checkAuth, async (request, response) => {
  try {
    const data = await companySvc.updateCompanyProfile(request);
    response.status(data.status).json(data.body);
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while Updating company profile';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/event/:id', async (request, response) => {
  try {
  
    const data = await companySvc.getEventsDetails(request);
    response.status(data.status).json(data.body);
  
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching event details';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.post('/event/:eventId/register', checkAuth, async (request, response) => {
  try {
 
    const data = await companySvc.registerForEvent(request);
    response.status(data.status).json(data.body);
   
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching event details';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

module.exports = router;
