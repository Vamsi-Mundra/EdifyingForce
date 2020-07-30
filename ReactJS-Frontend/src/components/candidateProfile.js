import React, { Component } from 'react';
import '../App.css';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import SchoolIcon from '@material-ui/icons/School';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PhoneIcon from '@material-ui/icons/Phone';
import CakeIcon from '@material-ui/icons/Cake';
import HomeIcon from '@material-ui/icons/Home';
import moment from 'moment';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { connect } from "react-redux";
import { fetchStudentProfile } from "../redux/actions/company"

class StudentProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      student: [],
      education: [],
      experience: [],
      skills: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      student: nextProps.studentProfile,
      experience: nextProps.studentProfile.experience,
      education: nextProps.studentProfile.education,
      skills: _.isUndefined(nextProps.studentProfile.skills) ? "" : nextProps.studentProfile.skills
    })
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    this.props.fetchStudentProfile({ id: params.id });
  }

  render() {
    const name = `'${this.state.student.name}'`;
    let educationDetails = null;
    const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (this.state.education.length > 0) {
      educationDetails = (
        <div className="row">
          {this.state.education.map((education, index) => (
            <div className="row" style={{ paddingLeft: '30px', marginBottom: '20px' }}>
              <div className="col-md-1" style={{ marginLeft: '15px', paddingRight: '0px', marginRight: '0px' }}>
                <Avatar
                  variant="square"
                  style={{
                    width: '50px', height: '50px', backgroundColor: 'white', color: 'black', border: '2px solid', borderStyle: 'groove',
                  }}
                >
                  <h6><SchoolIcon style={{ fontSize: 35, color: '#2c347a' }} /></h6>
                </Avatar>
              </div>
              <div className="col-md-9" style={{ marginLeft: '35px' }}>
                <div className="row">
                  <Typography variant="h4" color="textPrimary">
                    <h4 style={{ margin: '0px' }}>
                      {' '}
                      {this.state.education[index].college_name}
                    </h4>
                  </Typography>
                </div>
                <div className="row">
                  <Typography variant="h6" color="inherit">
                    {this.state.education[index].degree}
                  </Typography>
                </div>
                <div className="row">
                  <Typography variant="h6" color="inherit">
                    {months[this.state.education[index].month_of_starting]}
                    {' '}
                    {this.state.education[index].year_of_starting}
                    {' '}
                    to
                    {' '}
                    {months[this.state.education[index].month_of_passing]}
                    {' '}
                    {this.state.education[index].year_of_passing}
                  </Typography>
                </div>
                <div className="row">
                  <b>Major in </b>
                  <Typography style={{ display: 'inline' }} variant="h6" color="inherit">
                    {this.state.education[index].major}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      educationDetails = (
        <div className="row" style={{ paddingLeft: '30px', marginBottom: '0px' }}>
          <div className="col-md-12" style={{ textAlign: '-webkit-center' }}><h5>No Education Details Found</h5></div>
        </div>
      );
    }
    let experienceDetails = null;
    if (this.state.experience.length > 0) {
      experienceDetails = (
        <div className="row">
          {this.state.experience.map((experience, index) => (
            <div className="row" style={{ paddingLeft: '30px', marginBottom: '20px' }}>
              <div className="col-md-1" style={{ marginLeft: '15px', paddingRight: '0px', marginRight: '0px' }}>
                <Avatar
                  variant="square"
                  style={{
                    width: '50px', height: '50px', backgroundColor: 'white', color: 'black', border: '2px solid', borderStyle: 'groove',
                  }}
                >
                  <h6><LaptopMacIcon style={{ fontSize: 35, color: '#2c347a' }} /></h6>
                </Avatar>
              </div>
              <div className="col-md-9" style={{ marginLeft: '35px' }}>
                <div className="row">
                  <Typography variant="h4" color="textPrimary">
                    <h4 style={{ margin: '0px' }}>
                      {' '}
                      {this.state.experience[index].company}
                    </h4>
                  </Typography>
                </div>
                <div className="row">
                  <Typography variant="h6" color="inherit">
                    {this.state.experience[index].title}
                  </Typography>
                </div>
                <div className="row">
                  {this.state.experience[index].year_of_ending !== '' ? (
                    <Typography variant="h6" color="inherit">
                      {months[this.state.experience[index].month_of_starting]}
                      &nbsp;
                      {this.state.experience[index].year_of_starting}
                      {' '}
                      to&nbsp;
                      {months[this.state.experience[index].month_of_ending]}
                      &nbsp;
                      {this.state.experience[index].year_of_ending}
                      &nbsp;
                    </Typography>
                  ) : (
                      <Typography variant="h6" color="inherit">
                        {months[this.state.experience[index].month_of_starting]}
                        &nbsp;
                        {this.state.experience[index].year_of_starting}
                        {' '}
                        to Present
                      </Typography>
                    )}
                </div>
                <div className="row">
                  <Typography variant="h6" color="inherit">
                    {this.state.experience[index].description}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      experienceDetails = (
        <div className="row" style={{ paddingLeft: '30px', marginBottom: '0px' }}>
          <div className="col-md-12" style={{ textAlign: '-webkit-center' }}><h5>No Experience Details Found</h5></div>
        </div>
      );
    }
    let skillsChips = null;
    if (this.state.skills !== '') {
      const skillArr = this.state.skills.split(',');
      skillsChips = (
        <span>
          {skillArr.map((skill) => (
            <Chip
              label={<h6>{skill}</h6>}
              variant="outlined"
              deleteIcon={<CloseIcon />}
              style={{
                height: '25px', marginRight: '4px', marginBottom: '5px', borderRadius: '4px', border: '0px', backgroundColor: '#f0f0f0', padding: '0px',
              }}
            />
          ))}
        </span>
      );
    } else {
      skillsChips = null;
    }
    return (
      <div style={{ marginTop: '15px' }}>
        <div className="container" style={{ width: '75%', height: '100%' }}>
          <div className="row" style={{ width: '100%' }}>
            <div className="col-md-4">
              <div className="row">
                <Card>
                  <CardContent style={{ textAlign: '-webkit-right' }}>
                    <div style={{ textAlign: '-webkit-center' }}>
                      {this.state.student.image === null ? (
                        <Avatar
                          variant="circle"
                          style={{
                            paddingRight: '0px', width: '110px', height: '110px', margin: '15px', backgroundColor: 'brown',
                          }}
                        >
                          <h1 style={{ fontSize: '80' }}>{name.substring(1, 2)}</h1>
                        </Avatar>
                      ) : (
                          <Avatar
                            variant="circle"
                            src={this.state.student.image}
                            style={{
                              paddingRight: '0px', width: '110px', height: '110px', margin: '15px', border: '0.5px solid',
                            }}
                          />
                        )}
                    </div>
                    <div style={{ textAlign: '-webkit-center' }}>
                      <h3>{this.state.student.name}</h3>
                    </div>
                    <div style={{ textAlign: '-webkit-center', marginBottom: '5px' }}>
                      <h5 style={{ display: 'inline' }}>
                        {this.state.student.college}
                      </h5>
                    </div>
                    <div style={{ textAlign: '-webkit-center' }}>
                      <Typography variant="h6">
                        {(this.state.education.length) > 0
                          ? `${this.state.education[0].degree}, ${this.state.education[0].major}`
                          : '-'}
                      </Typography>
                    </div>
                    <div style={{ textAlign: '-webkit-center', marginTop: '5px' }}>
                      <span className="glyphicon glyphicon-envelope" aria-hidden="true" />
                      <h5 style={{ display: 'inline', paddingBottom: '90px' }}>
                        {' '}
                        {this.state.student.email}
                      </h5>
                    </div>
                    <div style={{ textAlign: '-webkit-center', marginTop: '10px' }}>
                      <Link to={{ pathname: '/conversations', student: this.state.student }} style={{ textDecoration: "none" }}>
                        <button type="button" class="btn btn-primary" style={{ backgroundColor: "#1569e0", width: "200px" }}>Message</button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="row" style={{ marginTop: '5px' }}>
                <Card>
                  <CardContent style={{ paddingBottom: '0px' }}>
                    <div className="row" style={{ marginLeft: '0px', marginRight: '0px', marginBottom: '0px' }}>
                      <h4 style={{
                        marginBottom: '15px', paddingBottom: '0px', marginLeft: '0px', marginTop: '0px',
                      }}
                      >
                        Skills
                      </h4>
                    </div>
                    <div className="row" style={{ marginLeft: '0px', marginRight: '0px', marginBottom: '10px' }}>
                      {skillsChips}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="row" style={{ marginTop: '5px', marginBottom: '10px' }}>
                <Card>
                  <CardContent style={{ paddingBottom: '0px' }}>
                    <div className="row" style={{ marginLeft: '0px', marginRight: '0px', marginBottom: '0px' }}>
                      <h4 style={{
                        marginBottom: '15px', paddingBottom: '0px', marginLeft: '0px', marginTop: '0px',
                      }}
                      >
                        Personal Info
                      </h4>
                    </div>
                    <div className="row" style={{ marginLeft: '0px', marginRight: '0px', marginBottom: '10px' }}>
                      <div className="row" style={{ paddingLeft: '15px' }}>
                        <div className="col-md-12" style={{ marginBottom: '10px', display: 'inline', verticalAlign: 'middle' }}>
                          <div style={{ display: 'inline', verticalAlign: 'middle' }}><MailOutlineIcon style={{ fontSize: 25 }} color="primary" /></div>
                          <div style={{ display: 'inline', verticalAlign: 'middle' }}>
                            <Typography gutterBottom variant="subtitle">
                              &nbsp;&nbsp;
                              {this.state.student.email}
                            </Typography>
                          </div>
                        </div>
                        <div className="col-md-12" style={{ marginBottom: '10px', display: 'inline', verticalAlign: 'middle' }}>
                          <div style={{ display: 'inline', verticalAlign: 'middle' }}><PhoneIcon style={{ fontSize: 25 }} color="primary" /></div>
                          <div style={{ display: 'inline', verticalAlign: 'middle' }}>
                            <Typography gutterBottom variant="subtitle">
                              &nbsp;&nbsp;
                              {this.state.student.mobile === ('' || null) ? '-' : this.state.student.mobile}
                            </Typography>
                          </div>
                        </div>
                        <div className="col-md-12" style={{ marginBottom: '10px', display: 'inline', verticalAlign: 'middle' }}>
                          <div style={{ display: 'inline', verticalAlign: 'middle' }}><CakeIcon style={{ fontSize: 25 }} color="primary" /></div>
                          <div style={{ display: 'inline', verticalAlign: 'middle' }}>
                            <Typography gutterBottom variant="subtitle">
                              &nbsp;&nbsp;
                              {this.state.student.dob === ('' || null) ? '-' : moment(this.state.student.dob).format('Do MMMM YYYY')}
                            </Typography>
                          </div>
                        </div>
                        <div className="col-md-12" style={{ marginBottom: '10px', display: 'inline', verticalAlign: 'middle' }}>
                          <div style={{ display: 'inline', verticalAlign: 'middle' }}><HomeIcon style={{ fontSize: 25 }} color="primary" /></div>
                          <div style={{ display: 'inline', verticalAlign: 'middle' }}>
                            <Typography gutterBottom variant="subtitle">
                              &nbsp;&nbsp;
                              {_.isUndefined(this.state.student.city) ? '' : `${this.state.student.city},`}
                              {_.isUndefined(this.state.student.state) ? '' : `${this.state.student.state},`}
                              {_.isUndefined(this.state.student.country) ? '' : this.state.student.country}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="col-md-8">
              <Card style={{ marginBottom: '15px', paddingBottom: '15px', paddingTop: '15px' }}>
                <h4 style={{ marginBottom: '25px', paddingBottom: '0px', marginLeft: '15px' }}>Objective</h4>
                <div className="row" style={{ width: '100%', marginLeft: '0px', marginBottom: '0px' }}>
                  <div className="col-md-12" style={{}}>
                    <h6 style={{ marginTop: '0px' }}>
                      {this.state.student.career_objective === null ? 'Not Updated' : this.state.student.career_objective}
                    </h6>
                  </div>
                </div>
              </Card>
              <Card style={{ marginBottom: '15px', paddingBottom: '15px', paddingTop: '15px' }}>
                <h4 style={{ marginBottom: '25px', paddingBottom: '0px', marginLeft: '15px' }}>Education</h4>
                <div className="row" style={{ width: '100%' }}>
                  {educationDetails}
                </div>
              </Card>
              <Card style={{ marginBottom: '15px', paddingBottom: '10px', paddingTop: '15px' }}>
                <h4 style={{ marginBottom: '25px', paddingBottom: '0px', marginLeft: '15px' }}>Work & Volunteer Experience</h4>
                <div className="row" style={{ width: '100%' }}>
                  {experienceDetails}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    studentProfile: state.studentProfile,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    fetchStudentProfile: payload => dispatch(fetchStudentProfile(payload))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfile);