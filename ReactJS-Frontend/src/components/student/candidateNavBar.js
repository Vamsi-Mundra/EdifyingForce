import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import '../../App.css';

class StudentNavBar extends Component {
  constructor(props) {
    super(props);
    this.tab = this.props.tab;
  }

  render() {
    let navBar = null;
    if (this.tab === 'jobs') {
      navBar = (
        <div className="container-fluid">
          <div className="navbar-header">
            <b className="navbar-brand" style={{ color: 'black' }}>Mentors</b>
          </div>
          <ul className="nav navbar-nav" />
          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link to="/mentors/explore" style={{ color: 'black' }}>
                <span className="glyphicon glyphicon-search" />
                {' '}
                Mentors Search
              </Link>
            </li>
            <li><Link to={`/student/${sessionStorage.getItem('id')}/applications`} style={{ color: 'black' }}>My Requests</Link></li>
          </ul>
        </div>
      );
    } else if (this.tab === 'events') {
      navBar = (
        <div className="container-fluid">
          <div className="navbar-header">
            <b className="navbar-brand" style={{ color: 'black' }}>Events</b>
          </div>
          <ul className="nav navbar-nav" />
          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link to="/events" style={{ color: 'black' }}>
                <span className="glyphicon glyphicon-search" />
                {' '}
                Events Search
              </Link>
            </li>
            <li><Link to={`/student/${sessionStorage.getItem('id')}/registrations`} style={{ color: 'black' }}>Registrations</Link></li>
          </ul>
        </div>
      );
    } else if (this.tab === 'explore') {
      navBar = (
        <div className="container-fluid">
          <div className="navbar-header">
            <b className="navbar-brand" style={{ color: 'black' }}>Explore Students</b>
          </div>
        </div>
      );
    }
    return (
      <div className="inner" style={{ marginBottom: '0px', border: '1px solid', borderStyle: 'groove' }}>
        <nav
          className="inner"
          className="navbar  navbar-dark bg-dark"
          style={{
            backgroundColor: '#fff', height: '10px', borderRadius: '0px', padding: '0px', margin: '0px',
          }}
        >
          {navBar}
        </nav>
      </div>
    );
  }
}

export default StudentNavBar;
