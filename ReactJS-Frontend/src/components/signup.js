import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Redirect } from 'react-router';
import bcrypt from 'bcryptjs'
import logo from './diversity.jpg';
import { connect } from "react-redux";
import { signUpUser, closeSignupModal } from "../redux/actions/common"

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            placeholder: true,
            persona: "student",
            email: "",
            password: "",
            mentorName: "",
            invalidEmail: false,
            invalidPassword: false,
            repeatPassword: "",
            passwordMatch: false,
            name: "",
            location: "",
            signUpSuccessful: false,
            redirectToSignIn: false,
            passwordMatchError: false,
            signupFailedError: false,
        }
        this.changePersona = this.changePersona.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.rePasswordChangeHandler = this.rePasswordChangeHandler.bind(this);
        this.validateDetails = this.validateDetails.bind(this);
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.locationChangeHandler = this.locationChangeHandler.bind(this);
        this.registerUser = this.registerUser.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
    }

    registerUser = (event) => {
        event.preventDefault();
        let url = process.env.REACT_APP_BACKEND_URL + 'signup?persona=' + this.state.persona;
        let encryptPassword = ""
        const salt = bcrypt.genSaltSync(1);
        encryptPassword = bcrypt.hashSync(this.state.password, salt);
        var data = {
            "email": this.state.email,
            "password": encryptPassword,
            "name": this.state.name,
            "entity": this.state.persona
        }
        if (this.state.persona === "company") {
            data.location = this.state.location;
            data.mentorName = this.state.mentorName ;
        }
        else data.college = this.state.location;
        this.props.signUpUser(data);
    }

    changePersona = (event) => {
        this.setState({
            placeholder: !this.state.placeholder,
            persona: event.target.value
        })
    }

    nameChangeHandler = (event) => {
        this.setState({
            name: event.target.value
        })
    }

    locationChangeHandler = (event) => {
        this.setState({
            location: event.target.value
        })
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
    mentorNameChangeHandler = (e) =>{
        this.setState({
            mentorName: e.target.value
        })
    }

    passwordChangeHandler = (event) => {
        if (event.target.value.length > 5) {
            this.setState({
                password: event.target.value,
                invalidPassword: false
            })
            if (this.state.repeatPassword !== event.target.value && this.state.repeatPassword !== "") {
                this.setState({
                    passwordMatch: false
                })
            }
        } else {
            this.setState({
                password: event.target.value,
                invalidPassword: true
            })
        }
    }

    rePasswordChangeHandler = (event) => {
        if (this.state.password === event.target.value) {
            this.setState({
                repeatPassword: event.target.value,
                passwordMatch: true,
                passwordMatchError: false
            })
        } else {
            this.setState({
                repeatPassword: event.target.value,
                passwordMatch: false,
                passwordMatchError: true
            })
        }
    }

    validateDetails = (event) => {
        if (!this.state.invalidEmail && !this.state.invalidPassword && this.state.passwordMatch && this.state.name !== "" && this.state.location !== "") return false
        else return true
    }
    handleDialogClose = () => {
        this.setState({
            redirectToSignIn: true
        })
        this.props.closeSignupModal();
    }
    render() {
        //const { location, name } = this.state;
        let redirectToSignIn = null;
        if (this.state.redirectToSignIn) redirectToSignIn = <Redirect to="/signin" />
        return (
            <div >
                {redirectToSignIn}
                <div class="container" style={{ paddingLeft: "0px", marginLeft: "0px" }}>
                    <div className="row" >
                        <div className="col-md-5" style={{ width: "450px", backgroundColor: "1569e0", backgroundColor: "white", height: "510px" }}>
                            <img src={logo} style={{ width: "500px", height: "518px" }} />
                        </div>
                        <div className="col-md-7" style={{
                            backgroundColor: "white", width: "400px",
                            border: "0px solid rgb(9, 3, 12)", borderRadius: "5px", paddingLeft: "50px",paddingRight: "50px",paddingTop: "10px", marginLeft: "220px", marginTop: "30px"
                        }}>
                            <div class="login-form row">
                                <div class="main-div">
                                    <div class="panel">
                                        <h2 style={{ textAlign: "center" }}>Sign Up</h2>
                                    </div>
                                    <div className="row" style={{marginLeft:"35px",marginBottom:"7px"}}>
                                        <div class="col-md-6 radio-inline">
                                            <input type="radio" value="student" name="persona"defaultChecked  onChange={this.changePersona} /><p>I'm a Candidate</p>
                                        </div>
                                        <div class="col-md-5 radio-inline">
                                            <input type="radio" value="company" name="persona" onChange={this.changePersona} /><p>I'm a Mentor</p>
                                        </div>
                                    </div>
                                    <form onSubmit={this.registerUser}>
                                    {!this.state.placeholder?<div class="form-group">
                                            <input autoComplete="none" type="text" onChange={this.mentorNameChangeHandler} class="form-control" name="name" placeholder={"Name"} required />
                                        </div>:""}
                                        <div class="form-group">
                                            <input autoComplete="none" type="text" onChange={this.nameChangeHandler} class="form-control" name="name" placeholder={this.state.placeholder ? "Name" : "Company Name"} required />
                                        </div>
                                        <div class="form-group">
                                            <input type="email" onChange={this.emailChangeHandler} class="form-control" name="email" placeholder="Email Id" required />
                                        </div>
                                        <div class="form-group" style={{ "alignItems": "center" }}>
                                            {this.state.invalidEmail ? <span style={{ color: "red", "textAlign": "center" }}>Invalid Email Id. Please check</span> : ''}
                                        </div>
                                        <div class="form-group">
                                            <input type="password" onChange={this.passwordChangeHandler} class="form-control" name="password" placeholder="Password" required />
                                        </div>
                                        <div class="form-group" style={{ "alignItems": "center" }}>
                                            {this.state.invalidPassword ? <span style={{ color: "red", "textAlign": "center" }}>Password must have atleast 6 characters</span> : ''}
                                        </div>
                                        <div class="form-group">
                                            <input type="password" onChange={this.rePasswordChangeHandler} class="form-control" name="repeatPassword" placeholder="Re-Enter Password" />
                                        </div>
                                        <div class="form-group" style={{ "alignItems": "center" }}>
                                            {this.state.passwordMatchError ? <span style={{ color: "red", "textAlign": "center" }}>Passwords doesn't match</span> : ''}
                                        </div>
                                        <div class="form-group">
                                            <input type="text" onChange={this.locationChangeHandler} class="form-control" name="location" placeholder={this.state.placeholder ? "College Name" : "Location"} required />
                                        </div>
                                        <div class="form-group" style={{ "alignItems": "center" }}>
                                            {this.props.signupFailedError ? <span style={{ color: "red", "font-style": "oblique", "font-weight": "bold", "textAlign": "center" }}>SignUp Failed. Please try again..</span> : ''}
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <button disabled={this.validateDetails()} class="btn btn-success" style={{ "width": "100%" }}>Register</button>
                                        </div>
                                        <br />

                                        <div style={{ textAlign: "center" }}>
                                            <Link to="/signin">Already a User? Sign In</Link>
                                        </div>
                                    </form>
                                    <br />
                                    <div>
                                        <Dialog
                                            open={this.props.signUpSuccessful}
                                            onClose={this.handleDialogClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-title">{"Registered Successfully .!"}</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                    Hey {this.state.name},
                                                    You've been signup succesfully. Please go ahead and login
                                        </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={this.handleDialogClose} color="primary" autoFocus>
                                                    Login
                                        </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </div>
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
        signUpSuccessful: state.signUpSuccessful,
        signupFailedError: state.signupFailedError
    };
};

function mapDispatchToProps(dispatch) {
    return {
        signUpUser: payload => dispatch(signUpUser(payload)),
        closeSignupModal: payload => dispatch(closeSignupModal(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);