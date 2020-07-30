const chai = require('chai');
chai.use(require('chai-http'));
const { expect } = require('chai');
const app = require('../index');
const agent = require('chai').request.agent(app);


describe('EdifyingForce Testing', () => {
  it('GET /signin - Authenticate User with Invalid Credentials', (done) => {
    agent.get('/signin?email=user@example.com&persona=student&password=pass')
      .then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Invalid Credentials');
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('POST /company/:id/jobs - Post a New Job', (done) => {
    const data = {
      title: 'Software Engineer',
      deadline: '2020-04-30',
      location: 'New York',
      salary: '50',
      description: 'React JS Software Engineer',
      category: 'Internship',
      posting_date: '2020-03-10',
    };
    agent.set('Authorization', 'JWT pS6fV1dM-JbZs3jQOxdOAW0j-dB04a80wknjEAtj2H0')
    .post('/company/YaFDUIWpg/jobs')
      .send(data)
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal('Software Engineer');
        expect(response.body.category).to.equal('Internship');
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('Chaecking the status of a Particular Job a Student Applied: GET /student/:studentId/applications', (done) => {
    agent.set('Authorization', 'JWT pS6fV1dM-JbZs3jQOxdOAW0j-dB04a80wknjEAtj2H0')
    .get('/student/bux08a7Cl/applications')
      .then((response) => {
        expect(response.body[1].title).to.equal('Student Assistant');
        expect(response.body[2].location).to.equal('San Jose');
        expect(response.body[2].status).to.equal('Reviewed');
        expect(response.status).to.equal(200);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('PUT /applications/:applicationId - Update the Appliation status of a Job', (done) => {
    const data = {
      status: 'Reviewed'
    };
    agent.set('Authorization', 'JWT pS6fV1dM-JbZs3jQOxdOAW0j-dB04a80wknjEAtj2H0')
    .put('/applications/Q8tcv8VjX')
      .send(data)
      .then((response) => {
        expect(response.body.message).to.equal('Update Success');
        expect(response.status).to.equal(200);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('POST /event/:eventId/register - Register for an Event', (done) => {
    const data = {
      studentId: 'bux08a7Cl',
      companyId: 'YaFDUIWpg',
    };
    agent.set('Authorization', 'JWT pS6fV1dM-JbZs3jQOxdOAW0j-dB04a80wknjEAtj2H0')
    .post('/event/IOCb-27S2/register')
      .send(data)
      .then((response) => {
        expect(response.body.affectedRows).to.equal(1);
        expect(response.status).to.equal(200);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});
