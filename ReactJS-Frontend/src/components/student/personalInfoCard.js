import React, { Component } from 'react';
import '../../App.css';
import _ from "lodash";
import moment from "moment"
import Card from '@material-ui/core/Card';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography'
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PhoneIcon from '@material-ui/icons/Phone';
import CakeIcon from '@material-ui/icons/Cake';
import HomeIcon from '@material-ui/icons/Home';
import { connect } from "react-redux";
import { fetchStudentProfile, togglePersonalInfoEdit, updatePersonalInfo } from "../../redux/actions/student"

class PersonalInfoCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            mobile: "",
            city: "",
            state: "",
            country: "",
            dob: ""
        }
        this.profileSaveHandler = this.profileSaveHandler.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            student: nextProps.profile,
            email: nextProps.profile.email,
            mobile: _.isUndefined(nextProps.profile.mobile) ? "" : nextProps.profile.mobile,
            city: _.isUndefined(nextProps.profile.city) ? "" : nextProps.profile.city,
            state: _.isUndefined(nextProps.profile.state) ? "" : nextProps.profile.state,
            country: _.isUndefined(nextProps.profile.country) ? "" : nextProps.profile.country,
            dob: _.isUndefined(nextProps.profile.dob) ? "" : nextProps.profile.dob,
        })
    }

    profileSaveHandler = (event) => {
        event.preventDefault();
        this.props.updatePersonalInfo({
            email: this.state.email,
            mobile: this.state.mobile,
            city: this.state.city,
            state: this.state.state,
            country: this.state.country,
            dob: this.state.dob
        })
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        let profileSave = null;
        if (this.props.enableProfileSave) {
            profileSave = (
                <div>
                    <div class="row" style={{ paddingTop: "10px" }}>
                        <div class="col-md-10">
                            <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "15px", marginTop: "0px" }}>Personal Information</h4>
                        </div>
                    </div>
                    <form onSubmit={this.profileSaveHandler}>
                        <div class="row" style={{ paddingLeft: "15px", paddingRight: "15px" }}>
                            <div class="row" style={{ marginBottom: "10px", paddingLeft: "15px" }}>
                                <div class="col-md-3"><label for="email">Email</label></div>
                                <div class="col-md-8"><input onChange={this.handleChange} value={this.state.email} required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" type="email" class="form-control" name="email" id="email" placeholder="Email"></input></div>
                            </div>
                            <div class="row" style={{ marginBottom: "10px", paddingLeft: "15px" }}>
                                <div class="col-md-3"><label for="mobile">Number</label></div>
                                <div class="col-md-8"> <input onChange={this.handleChange} value={this.state.mobile} type="tel" pattern="[0-9]{10}" name="mobile" class="form-control" id="number" placeholder="Mobile"></input></div>
                            </div>
                            <div class="row" style={{ marginBottom: "10px", paddingLeft: "15px" }}>
                                <div class="col-md-3"><label for="dob">DOB</label></div>
                                <div class="col-md-8"><input onChange={this.handleChange} value={this.state.dob} name="dob" type="date" class="form-control" id="dob" placeholder=""></input></div>
                            </div>
                            <div class="row" style={{ marginBottom: "10px", paddingLeft: "15px" }}>
                                <div class="col-md-3"><label for="city">City</label></div>
                                <div class="col-md-8"><input onChange={this.handleChange} value={this.state.city} name="city" type="text" class="form-control" id="city" placeholder="City"></input></div>
                            </div>
                            <div class="row" style={{ marginBottom: "10px", paddingLeft: "15px" }}>
                                <div class="col-md-3"><label for="state">State</label></div>
                                <div class="col-md-8"><input onChange={this.handleChange} value={this.state.state} name="state" type="text" class="form-control" id="state" placeholder="State"></input></div>
                            </div>
                            <div class="row" style={{ marginBottom: "10px", paddingLeft: "15px" }}>
                                <div class="col-md-3"><label for="country">Country</label></div>
                                <div class="col-md-8"><input onChange={this.handleChange} value={this.state.country} name="country" type="text" class="form-control" id="country" placeholder="Country"></input></div>
                            </div>
                        </div >
                        <div className="row" style={{ marginLeft: "0px", marginRight: "0px" }}>
                            <div class="col-md-6" style={{ textAlign: "-webkit-center", marginTop: "10px", paddingRight: "3px" }}>
                                <button type="button" onClick={() => this.props.togglePersonalInfoEdit(false)} style={{ backgroundColor: "rgba(0,0,0,.06)", width: "100%", color: "black" }} class="btn btn-secondary" >Cancel</button>
                            </div>
                            <div class="col-md-6" style={{ textAlign: "-webkit-center", marginTop: "10px", paddingLeft: "3px" }}>
                                <button type="submit" style={{ backgroundColor: "#0d7f02", width: "100%" }} class="btn btn-success" >Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            )
        } else {
            profileSave = (
                <div>
                    <div class="row" style={{ paddingTop: "10px", paddingRight: "10px" }}>
                        <div class="col-md-9">
                            <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "15px", marginTop: "0px" }}>Personal Information</h4>
                        </div>
                        <div class="col-md-2" style={{ textAlign: "-webkit-right", paddingLeft: "30px" }}>
                            <EditIcon className="editicon" color="primary" onClick={() => this.props.togglePersonalInfoEdit(true)} style={{ textAlign: "-webkit-right", cursor: "pointer" }} />
                        </div>
                    </div>
                    <div class="row" style={{ paddingLeft: "15px" }}>
                        <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                            <div style={{ display: "inline", verticalAlign: "middle" }}><MailOutlineIcon style={{ fontSize: 25 }} color="primary" /></div>
                            <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                                &nbsp;&nbsp;{this.state.email}
                            </Typography>
                            </div>
                        </div>
                        <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                            <div style={{ display: "inline", verticalAlign: "middle" }}><PhoneIcon style={{ fontSize: 25 }} color="primary" /></div>
                            <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                                &nbsp;&nbsp;{this.state.mobile === "" ? "-" : this.state.mobile}
                            </Typography>
                            </div>
                        </div>
                        <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                            <div style={{ display: "inline", verticalAlign: "middle" }}><CakeIcon style={{ fontSize: 25 }} color="primary" /></div>
                            <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                                &nbsp;&nbsp;{this.state.dob === "" ? "-" : moment(this.state.dob).format("Do MMMM YYYY")}
                            </Typography>
                            </div>
                        </div>
                        <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                            <div style={{ display: "inline", verticalAlign: "middle" }}><HomeIcon style={{ fontSize: 25 }} color="primary" /></div>
                            <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                                &nbsp;&nbsp;{this.state.city === "" ? "-" : this.state.city}
                                {this.state.state === "" ? "" : "," + this.state.state}
                                {this.state.country === "" ? "" : "," + this.state.country}
                            </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div>
                <Card style={{ marginBottom: "15px", paddingBottom: "10px", paddingTop: "10px", marginTop: "0px", paddingLeft: "5px" }}>
                    <div class="row" style={{ width: "100%", marginLeft: "0px" }}>
                        {profileSave}
                    </div>
                </Card>
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        profile: state.profile,
        enableProfileSave: state.enableProfileSave
    };
};

function mapDispatchToProps(dispatch) {
    return {
        fetchStudentProfile: payload => dispatch(fetchStudentProfile(payload)),
        togglePersonalInfoEdit: payload => dispatch(togglePersonalInfoEdit(payload)),
        updatePersonalInfo: payload => dispatch(updatePersonalInfo(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalInfoCard);