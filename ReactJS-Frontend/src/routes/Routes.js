import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import SignIn from '../components/signin';
import SignUp from '../components/signup';
import NavBar from '../components/navbar';
import Jobs from '../components/menteeRequests';
import Events from '../components/events';
import Applications from '../components/applications';
import Students from '../components/students';
import ViewStudentProfile from '../components/candidateProfile';

import StudentApplications from '../components/student/mentorRequests';
import SearchJobs from '../components/student/searchMentors';
import StudentSearch from '../components/student/candidateSearch';
import Registrations from '../components/registrations';
import CompanyProfile from '../components/profile';
import ViewCompanyProfile from '../components/student/mentorProfile';
import StudentProfile from '../components/student/profile';
import EventsSearch from '../components/student/eventSearch';
import EventDetails from '../components/student/event';
import StudentRegistrations from '../components/student/registrations';
import Messages from '../components/messages';
class Routes extends Component {
  render() {
    return (
      <div>
        <Route path="/" component={NavBar} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/mentee/requests" component={Jobs} />
        <Route path="/my/events" component={Events} />
        <Route path="/job/:jobId/applications" exact component={Applications} />
        <Route path="/students" exact component={Students} />
        <Route path="/students/:id" exact component={ViewStudentProfile} />
        <Route path="/event/:eventId/registrations" exact component={Registrations} />
        <Route path="/company/profile" exact component={CompanyProfile} />

        <Route path="/student/:id/applications" exact component={StudentApplications} />
        <Route path="/mentors/explore" exact component={SearchJobs} />
        <Route path="/explore/candidates" exact component={StudentSearch} />
        <Route path="/company/:companyId/profile" exact component={ViewCompanyProfile} />
        <Route path="/student/profile" exact component={StudentProfile} />
        <Route path="/events" exact component={EventsSearch} />
        <Route path="/event/:id" exact component={EventDetails} />
        <Route path="/student/:id/registrations" exact component={StudentRegistrations} />
        <Route path='/conversations' exact component={Messages} />
      </div>
    );
  }
}

export default Routes;
