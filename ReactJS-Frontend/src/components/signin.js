import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import logo from './diversity.jpg';
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/common"

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invalidCredentials: '',
            persona: "student",
            email: "",
            password: "",
            invalidEmail: false
        }
        this.changePersona = this.changePersona.bind(this);
        this.authenticateUser = this.authenticateUser.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.validateCredentials = this.validateCredentials.bind(this);
    }

    changePersona = (event) => {
        this.setState({
            persona: event.target.value
        })
    }

    authenticateUser = (event) => {
        event.preventDefault();
        this.props.loginUser({ "email": this.state.email, "persona": this.state.persona, "password": this.state.password })
    }

    emailChangeHandler = (event) => {
        if (/.+@.+\.[A-Za-z]+$/.test(event.target.value)) {
            this.setState({
                invalidEmail: false,
                email: event.target.value
            })
        } else {
            this.setState({
                invalidEmail: true,
                email: event.target.value
            })
        }
    }

    passwordChangeHandler = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    validateCredentials = (event) => {
        if (!this.state.invalidEmail && this.state.password !== "") return false
        else return true
    }

    render() {
        let home = null;
        if (sessionStorage.getItem("email") !== null && sessionStorage.getItem("persona") === "company") {
            home = <Redirect to="/mentee/requests" />
        }
        if (sessionStorage.getItem("email") !== null && sessionStorage.getItem("persona") === "student") {
            home = <Redirect to={"/mentors/explore"} />
        }
        return (
            <div>
                {home}
                <div class="container" style={{ paddingLeft: "0px", marginLeft: "0px" }}>
                    <div className="row" >
                        <div className="col-md-5" style={{ width: "450px", backgroundColor: "1569e0", backgroundColor: "white", height: "510px" }}>
                            <img src={logo} style={{ width: "500px", height: "518px" }} />
                        </div>
                        <div className="col-md-7" style={{
                            backgroundColor: "white", width: "400px",
                            border: "0px solid rgb(9, 3, 12)", borderRadius: "5px", padding: "50px", paddingTop: "20px", marginLeft: "220px", marginTop: "50px"
                        }}>
                            <div class="login-form row">
                                <div class="main-div">
                                    <div class="panel">
                                        <h2 style={{ textAlign: "center" }}>Sign In</h2>
                                    </div>
                                    <div className="row" style={{ marginLeft: "35px", marginBottom: "10px", marginTop: "30px" }}>
                                        <div class="col-md-6 radio-inline">
                                            <input type="radio" value="student" name="persona" onChange={this.changePersona} defaultChecked /><p>I'm a Candidate</p>
                                        </div>
                                        <div class="col-md-5 radio-inline">
                                            <input type="radio" value="company" name="persona" onChange={this.changePersona} /><p>I'm a Mentor</p>
                                        </div>
                                    </div>
                                    <form autoComplete="off" className="form" onSubmit={this.authenticateUser}>
                                        <div class="form-group">
                                            <input type="email" onChange={this.emailChangeHandler} style={{ backgroundColor: "" }} class="form-control" name="emailId" placeholder="Email Id" required />
                                        </div>
                                        <div class="form-group" style={{ "alignItems": "center" }}>
                                            {this.state.invalidEmail ? <span style={{ color: "red", "font-weight": "bold", "textAlign": "center" }}>Invalid Email Id. Please check</span> : ''}
                                        </div>
                                        <div class="form-group">
                                            <input type="password" onChange={this.passwordChangeHandler} class="form-control" name="password" placeholder="Password" required />
                                        </div>
                                        <div class="form-group" style={{ "alignItems": "center" }}>
                                            {this.props.invalidCredentials ? <span style={{ color: "red", "font-style": "oblique", "font-weight": "bold", "textAlign": "center" }}>Invalid Username or Password</span> : ''}
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <button disabled={this.validateCredentials()} class="btn btn-success" style={{ "width": "100%" }}>Login</button>
                                        </div>
                                        <br />
                                        <div style={{ textAlign: "center" }}>
                                            <Link to="/signup">Not a User? Sign Up</Link>
                                        </div>
                                    </form>
                                    <br />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        invalidCredentials: state.invalidCredentials
    };
};

function mapDispatchToProps(dispatch) {
    return {
        loginUser: payload => dispatch(loginUser(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
