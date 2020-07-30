const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const AWS = require('aws-sdk');
const logger = require('tracer').colorConsole();
const uuid = require('shortid');
const commonRoutes = require('./routes/common');
const companyRoutes = require('./routes/mentor');
const studentRoutes = require('./routes/candidate');
const commonSvc = require('./services/common');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(cors({ origin: process.env.REACT_URL, credentials: true }));

const pool = require('./db/connection');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const connection = require('./db/connection');

const company = require('./db/schema/mentor').createModel();
const student = require('./db/schema/candidate').createModel();
const jobs = require('./db/schema/jobs').createModel();
const operations = require('./db/operations');
const { checkAuth } = require("./auth/auth");
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, './public/resume');
    } else {
      cb(null, './public/images');
    }
  },
  filename: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, req.query.id + path.extname(file.originalname));
    } else {
      cb(null, req.params.id + path.extname(file.originalname));
    }
  },
});
const upload = multer({
  storage,
});
async function initializeApplication() {
  try {
    app.get('/healthcheck', (request, response) => {
      logger.debug('Health Check');
      response.json({
        message: 'Application Running',
      });
    });

    app.post('/student/:id/image', [upload.single('image'), checkAuth], async (request, response) => {
      try {
        if (request.file) {
          const fileContent = fs.readFileSync(`./public/images/${request.params.id}${path.extname(request.file.originalname)}`);
          const params = {
            Bucket: 'handshake-resume',
            Key: uuid.generate() + path.extname(request.file.originalname),
            Body: fileContent,
            ContentType: request.file.mimetype,
          };
          const imageData = await s3.upload(params).promise()
          const data = {
            "body": request.body,
            "params": request.params,
            "query": request.query,
            "type": "postStudentImage",
            "image": imageData
          }
          const dataa = await commonSvc.postStudentImage(data);
          response.status(dataa.status).json(dataa.body);
          // await kafka.make_request('common', data, function (err, data) {
          //   if (err) throw new Error(err)
          //   response.status(data.status).json(data.body);
          // })
        }
      } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while uploading image';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
      }
    });

    app.post('/company/:id/image', [upload.single('image'), checkAuth], async (request, response) => {
      try {
        if (request.file) {
          const fileContent = fs.readFileSync(`./public/images/${request.params.id}${path.extname(request.file.originalname)}`);
          const params = {
            Bucket: 'handshake-resume',
            Key: uuid.generate() + path.extname(request.file.originalname),
            Body: fileContent,
            ContentType: request.file.mimetype,
          };
          const imageData = await s3.upload(params).promise()
          const data = {
            "body": request.body,
            "params": request.params,
            "query": request.query,
            "type": "postCompanyImage",
            "image": imageData
          };
          const dataa = await commonSvc.postCompanyImage(data);
          response.status(dataa.status).json(dataa.body);
         
        }
      } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while uploading image';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
      }
    });

    app.post('/company/:companyId/job/:jobId/student/:studentId/apply', [upload.single('resume'), checkAuth], async (request, response) => {
      try {
        console.log("in apply")
        if (request.file) {
          const fileContent = fs.readFileSync(`./public/resume/${request.query.id}${path.extname(request.file.originalname)}`);
          const params = {
            Bucket: 'handshake-resume',
            Key: request.query.id + path.extname(request.file.originalname),
            Body: fileContent,
            ContentType: request.file.mimetype,
          };
          const resumeData = await s3.upload(params).promise();
          const data = {
            "body": request.body,
            "params": request.params,
            "query": request.query,
            "type": "applyForJob",
            "resume": resumeData
          }
          const dataa = await commonSvc.applyForJob(data);
          response.status(dataa.status).json(dataa.body);
          // await kafka.make_request('common', data, function (err, data) {
          //   if (err) throw new Error(err)
          //   response.status(data.status).json(data.body);
          // })
        }
      } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while uploading resume';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
      }
    });

    app.use(commonRoutes);
    app.use(studentRoutes);
    app.use(companyRoutes);

    await connection.createConnection();
    app.listen(process.env.PORT || 8080, () => {
      logger.debug('App listening on port 8080');
    });
  } catch (error) {
    return Promise.reject(error.message);
  }
}

initializeApplication()
  .then((response) => logger.info("Server Running"))
  .catch(error => logger.error(`Error in Initalizing Application  : ${error}`));

module.exports = app;
