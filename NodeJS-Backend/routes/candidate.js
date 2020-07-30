const express = require('express');
const router = express.Router();
const logger = require('tracer').colorConsole();
const dotenv = require('dotenv');
dotenv.config();
const { checkAuth } = require("../auth/auth");
const studentSvc = require("../services/candidate");
router.get('/mentors', checkAuth, async (request, response) => {
  try {
 

    const data = await studentSvc.getAllStudentJobs(request);
    response.status(data.status).json(data.body);

  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching jobs';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.put('/student/:id/profile', checkAuth, async (request, response) => {
  try {
    const data = await studentSvc.updateProfile(request);
    response.status(data.status).json(data.body);

  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while Updating student profile';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.post('/student/:id/profile', checkAuth, async (request, response) => {
    try {
      const data = await studentSvc.postProfile(request);
      response.status(data.status).json(data.body);
   
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while Saving student education';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.delete('/student/:id/profile', checkAuth, async (request, response) => {
  try {
    const data = await studentSvc.deleteProfile(request);
    response.status(data.status).json(data.body);
  
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while deleting student education';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/student/:id/profile', checkAuth, async (request, response) => {
  try {
    const data = await studentSvc.getProfile(request);
    response.status(data.status).json(data.body);

  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching student profile';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/student/profiles', checkAuth, async (request, response) => {
  try {
    const data = await studentSvc.getStudentProfiles(request);
    response.status(data.status).json(data.body);
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching profile details';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/events', checkAuth, async (request, response) => {
  try {
    const data = await studentSvc.getEvents(request);
    response.status(data.status).json(data.body);
 
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching events';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/student/:studentId/registrations', checkAuth, async (request, response) => {
  try {
    const data = await studentSvc.getRegistrations(request);
    response.status(data.status).json(data.body);
  
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching registrations details';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/student/:studentId/applications', checkAuth, async (request, response) => {
  try {
    const data = await studentSvc.getStudentApplications(request);
    response.status(data.status).json(data.body);
 
  } catch (ex) {
    logger.error(ex);
    const message = ex.message ? ex.message : 'Error while fetching applications details';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

module.exports = router;
