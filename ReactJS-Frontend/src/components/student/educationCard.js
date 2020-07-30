import React, { Component } from 'react';
import '../../App.css';
import Avatar from '@material-ui/core/Avatar';
import _ from "lodash";
import Card from '@material-ui/core/Card';
import SchoolIcon from '@material-ui/icons/School';
import Education from './education';
import { connect } from "react-redux";
import { toggleLoading } from "../../redux/actions/common";
import { fetchStudentProfile, addNewSchool } from "../../redux/actions/student"

class EducationCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            student: {},
            education: [],
            addSchool: false,
            newSchool: {
                college_name: "",
                degree: "",
                major: "",
                year_of_starting: "",
                month_of_starting: "1",
                year_of_passing: "",
                month_of_passing: "1",
                cgpa: ""
            },
            new_college_name: ""
        }
        this.toggleAddSchool = this.toggleAddSchool.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.addNewSchool = this.addNewSchool.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            student: nextProps.student,
            education: nextProps.student.education
        })
    }

    addNewSchool = (event) => {
        event.preventDefault();
        this.props.addNewSchool({ education: this.state.newSchool })
        this.setState({
            addSchool: false,
            newSchool: {
                college_name: "",
                degree: "",
                major: "",
                year_of_starting: "",
                month_of_starting: "1",
                year_of_passing: "",
                month_of_passing: "1",
                cgpa: ""
            }
        })
    }

    toggleAddSchool = () => {
        this.setState({ addSchool: !this.state.addSchool })
    }

    handleChange = (e) => {
        this.state.newSchool[e.target.name] = e.target.value
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        let educationDetails = null;
        if (this.state.education.length > 0) {
            educationDetails = (
                <div class="row">
                    {this.state.education.map((education, index) => {
                        return (
                            <Education education={this.state.education[index]} index={index} />
                        )
                    })}
                </div>
            )
        } else {
            educationDetails = (
                <div class="row" style={{ paddingLeft: "30px", marginBottom: "0px" }}>
                    <div class="col-md-12" style={{ textAlign: "-webkit-center" }}><h5>No Education Details Found</h5></div>
                </div>
            )
        }
        let addSchool = null;
        if (this.state.addSchool) {
            addSchool = (
                <div class="row" style={{ paddingLeft: "5px", marginBottom: "20px", marginTop: "30px" }}>
                    <form onSubmit={this.addNewSchool}>
                        <div class="col-md-1" style={{ marginLeft: "15px", paddingRight: "0px", marginRight: "0px" }}>
                            <Avatar variant="square" style={{ width: "50px", height: "50px", backgroundColor: "white", color: "black", border: "2px solid", borderStyle: "groove" }}>
                                <h6><SchoolIcon style={{ fontSize: 35, color: "#2c347a" }} /></h6>
                            </Avatar>
                        </div>
                        <div class="col-md-10" style={{ marginLeft: "20px" }}>
                            <div class="row">
                                <div class="col-md-11" style={{ marginBottom: "10px" }}>
                                    <label for="contactEmail">School Name</label>
                                    <input required onChange={this.handleChange} value={this.state.newSchool.college_name} type="text" class="form-control" name="college_name" id="college_name"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-11" style={{ marginBottom: "10px" }}>
                                    <label htmlFor="contactEmail">Education Level</label>
                                    <input required onChange={this.handleChange} value={this.state.newSchool.degree} type="text" class="form-control" id="degree" name="degree"></input>
                                </div>
                            </div>
                            <div class="row" style={{ paddingRight: "40px" }}>
                                <div class="row" style={{ marginLeft: "15px" }}><label htmlFor="contactEmail">Time Period</label></div>
                                <div class="row" style={{ marginLeft: "0px" }}>
                                    <div className="col-md-6" style={{ paddingRight: "0px", marginRight: "0px" }}>
                                        <label htmlFor="contactEmail">Start Date: </label>
                                        <div class="form-inline" style={{ marginBottom: "10px" }}>
                                            <select value={this.state.newSchool.month_of_starting} required id="inputState" class="form-control" style={{ width: "55%", marginRight: "5px" }} onChange={this.handleChange} name="month_of_starting">
                                                <option selected value={"1"}>January</option>
                                                <option value={"2"}>February</option>
                                                <option value={"3"}>March</option>
                                                <option value={"4"}>April</option>
                                                <option value={"5"}>May</option>
                                                <option value={"6"}>June</option>
                                                <option value={"7"}>July</option>
                                                <option value={"8"}>August</option>
                                                <option value={"9"}>September</option>
                                                <option value={"10"}>October</option>
                                                <option value={"11"}>November</option>
                                                <option value={"12"}>December</option>
                                            </select>
                                            <input required style={{ width: "35%", marginRight: "5px" }} onChange={this.handleChange} value={this.state.newSchool.year_of_starting} type="number" class="form-control" id="year_of_starting" name="year_of_starting"></input>
                                        </div>
                                    </div>
                                    <div className="col-md-6" style={{ paddingLeft: "0px", marginLeft: "0px" }}>
                                        <label htmlFor="contactEmail">End Date: </label>
                                        <div class="form-inline" style={{ marginBottom: "10px" }}>
                                            <select value={this.state.newSchool.month_of_passing} required id="inputState" class="form-control" style={{ width: "55%", marginRight: "5px" }} onChange={this.handleChange} name="month_of_passing">
                                                <option value={"1"}>January</option>
                                                <option value={"2"}>February</option>
                                                <option value={"3"}>March</option>
                                                <option value={"4"}>April</option>
                                                <option value={"5"}>May</option>
                                                <option value={"6"}>June</option>
                                                <option value={"7"}>July</option>
                                                <option value={"8"}>August</option>
                                                <option value={"9"}>September</option>
                                                <option value={"10"}>October</option>
                                                <option value={"11"}>November</option>
                                                <option value={"12"}>December</option>
                                            </select>
                                            <input required style={{ width: "35%", marginRight: "5px" }} onChange={this.handleChange} value={this.state.newSchool.year_of_passing} type="number" class="form-control" id="year_of_passing" name="year_of_passing"></input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-11" style={{ marginBottom: "10px" }}>
                                    <label htmlFor="contactEmail">Major</label>
                                    <input required onChange={this.handleChange} value={this.state.newSchool.major} type="text" class="form-control" id="major" name="major"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-11" style={{ marginBottom: "10px" }}>
                                    <label htmlFor="contactEmail">GPA</label>
                                    <input required onChange={this.handleChange} value={this.state.newSchool.cgpa} type="number" class="form-control" id="cgpa" name="cgpa"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-11" style={{ textAlign: "-webkit-right", marginTop: "10px", marginRight: "30px" }}>
                                    <button type="button" onClick={this.toggleAddSchool} style={{ backgroundColor: "rgba(0,0,0,.06)", color: "black" }} class="btn btn-secondary" >Cancel</button>
                                    <button type="submit" style={{ backgroundColor: "#0d7f02", marginLeft: "5px" }} class="btn btn-success">Save</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )

        } else {
            addSchool = (
                <button type="button" className="btn btn-light" onClick={this.toggleAddSchool}
                    style={{ width: "100%", margin: "0px", color: "#1569e0", backgroundColor: "white", fontWeight: "500" }}>
                    Add School
                </button>
            )
        }
        return (
            <div>
                <div className="row">
                    <div class="col-md-12">
                        <Card style={{ marginBottom: "0px", paddingBottom: "15px", paddingTop: "10px", marginTop: "0px" }}>
                            <h4 style={{ marginBottom: "25px", paddingBottom: "0px", marginLeft: "15px" }}>Education</h4>
                            <div class="row" style={{ width: "100%" }}>
                                {educationDetails}
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="row">
                    <div class="col-md-12">
                        <Card style={{ marginBottom: "15px", marginTop: "1px" }}>
                            {addSchool}
                        </Card>
                    </div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchStudentProfile: payload => dispatch(fetchStudentProfile(payload)),
        toggleLoading: payload => dispatch(toggleLoading(payload)),
        addNewSchool: payload => dispatch(addNewSchool(payload))
    };
}

export default connect(null, mapDispatchToProps)(EducationCard);