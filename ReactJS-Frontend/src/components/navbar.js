import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import '../App.css';
import logo from '../favicon.ico';
import Avatar from '@material-ui/core/Avatar';
import _ from 'lodash';
import { connect } from "react-redux";
import { logoutUser } from "../redux/actions/common"

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentNav: ["navVisited", "", "", "", ""],
            companyNav: ["navVisited", "", "", "", ""]
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.handleStudentNav = this.handleStudentNav.bind(this)
        this.handleCompanyNav = this.handleCompanyNav.bind(this)
    }
    handleLogout = () => {
        this.props.logoutUser({})
    }
    handleStudentNav = (id) => {
        let studentNav = ["", "", "", "", "", ""]
        studentNav[id] = "navVisited"
        this.setState({ studentNav: studentNav })
    }
    handleCompanyNav = (id) => {
        let companyNav = ["", "", "", "", "", ""]
        companyNav[id] = "navVisited"
        this.setState({ companyNav: companyNav })
    }

    render() {
        let redirectVar = null;
        if (!sessionStorage.getItem("persona")) redirectVar = <Redirect to="/signin" />
        
        if( window.location.pathname.match(/^\/aboutus/)){
            window.location.pathname = '/aboutus';
        } else {
            redirectVar = <Redirect to="/signin" />
        }

        let navBar = null;
        if (sessionStorage.getItem("email") !== null && sessionStorage.getItem("persona") === "company") {
            navBar = (
                <ul class="nav navbar-nav navbar-right">
                    <li><Link to="/mentee/requests" style={{ color: "black" }} className={this.state.companyNav[0]} onClick={() => this.handleCompanyNav(0)}><span class="glyphicon glyphicon-"></span>Mentee Requests</Link></li>
                    <li><Link to="/my/events" style={{ color: "black" }} className={this.state.companyNav[1]} onClick={() => this.handleCompanyNav(1)}><span class="glyphicon glyphicon-"></span>My Events</Link></li>
                    <li><Link to="/students" style={{ color: "black" }} className={this.state.companyNav[2]} onClick={() => this.handleCompanyNav(2)}><span class="glyphicon glyphicon-"></span>Candidates</Link></li>
                    <li><Link to="/conversations" style={{ color: "black" }} className={this.state.companyNav[3]} onClick={() => this.handleCompanyNav(3)}><span class="glyphicon glyphicon-"></span>Messages</Link></li>
                    <li style={{ margin: "0px", padding: "0px" }}><Link to={"/company/profile"} style={{ color: "black", margin: "0px", padding: "5px" }} className={this.state.companyNav[4]} onClick={() => this.handleCompanyNav(4)}>
                        {sessionStorage.getItem("image") === "undefined" ? (
                            <Avatar variant="circle" style={{ width: "35px", height: "35px", margin: "2.5px", padding: "0px", backgroundColor: "brown", color: "" }} >
                                <h4>{sessionStorage.getItem("name").substring(0, 1).toUpperCase()}</h4>
                            </Avatar>
                        ) : (
                                <Avatar src={sessionStorage.getItem("image")} variant="circle" style={{ width: "35px", height: "35px", margin: "2.5px", padding: "0px", backgroundColor: "#6e6f70", color: "brown" }} />
                            )}
                    </Link></li>
                    <li><Link to="/signin" onClick={this.handleLogout} style={{ color: "black" }}><span class="glyphicon glyphicon-log-out"></span> Logout</Link></li>
                </ul>
            )
        } else if (sessionStorage.getItem("email") !== null && sessionStorage.getItem("persona") === "student") {
            navBar = (
                <ul class="nav navbar-nav navbar-right">
                    <li><Link to="/mentors/explore" style={{ color: "black" }} className={this.state.studentNav[0]} onClick={() => this.handleStudentNav(0)}><span class="glyphicon glyphicon-"></span> Mentors </Link></li>
                    <li><Link to="/events" style={{ color: "black" }} className={this.state.studentNav[1]} onClick={() => this.handleStudentNav(1)}><span class="glyphicon glyphicon-"></span>Events</Link></li>
                    <li><Link to="/explore/candidates" style={{ color: "black" }} className={this.state.studentNav[2]} onClick={() => this.handleStudentNav(2)}><span class="glyphicon glyphicon-"></span>Explore</Link></li>
                    <li><Link to="/conversations" style={{ color: "black" }} className={this.state.studentNav[3]} onClick={() => this.handleStudentNav(3)}><span class="glyphicon glyphicon-"></span>Messages</Link></li>
                    <li style={{ margin: "0px", padding: "0px" }}><Link to={"/student/profile"} style={{ color: "black", margin: "0px", padding: "5px" }} className={this.state.studentNav[4]} onClick={() => this.handleStudentNav(4)}>
                        {sessionStorage.getItem("image") === "undefined" ? (
                            <Avatar variant="circle" style={{ width: "35px", height: "35px", margin: "2.5px", padding: "0px", backgroundColor: "brown", color: "" }} >
                                <h4>{sessionStorage.getItem("name").substring(0, 1).toUpperCase()}</h4>
                            </Avatar>
                        ) : (
                                <Avatar src={sessionStorage.getItem("image")} variant="circle" style={{ width: "35px", height: "35px", margin: "2.5px", padding: "0px", backgroundColor: "#6e6f70", color: "brown" }} />
                            )}
                    </Link></li>
                    <li><Link to="/signin" onClick={this.handleLogout} style={{ color: "black" }}><span class="glyphicon glyphicon-log-out"></span> Logout</Link></li>
                </ul>
            )
        } else {
            navBar = (
                <ul class="nav navbar-nav navbar-right">
                    <li><Link className="signinNav" to="/aboutus" style={{ color: "black" }}>About Us</Link></li>
                    <li><Link className="signinNav" to="/signin" style={{ color: "black" }}><span class="glyphicon glyphicon-log-in"></span> LogIn</Link></li>
                    <li><Link className="signinNav" to="/signup" style={{ color: "black" }}><span class="glyphicon glyphicon-user"></span> SignUp</Link></li>
                </ul>
            )
        }
        
        
        return (
            <div>
                {redirectVar}
                <nav class="navbar  navbar-dark bg-dark" style={{ backgroundColor: "#fff", borderRadius: "0px", padding: "0px", margin: "0px", paddingTop: "3px", paddingBottom: "3px" }}>
                    <div class="container-fluid">
                        <div class="navbar-header" style={{ display: "inline" }}>
                            <b class="navbar-brand" style={{ color: "black", display: "inline" }}><img style={{ display: "inline", width: "35px", height: "35px" }} src={logo} /> EdifyingForce</b>
                        </div>
                        <ul class="nav navbar-nav">
                        </ul>
                        {navBar}
                    </div>
                </nav>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { user: state.user };
};

function mapDispatchToProps(dispatch) {
    return {
        logoutUser: payload => dispatch(logoutUser(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);