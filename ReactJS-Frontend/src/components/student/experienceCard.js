import React, { Component } from 'react';
import '../../App.css';
import Avatar from '@material-ui/core/Avatar';
import _ from "lodash";
import Card from '@material-ui/core/Card';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import Experience from './experience'
import { connect } from "react-redux";
import { toggleLoading } from "../../redux/actions/common";
import { fetchStudentProfile, addNewExperience } from "../../redux/actions/student"

class ExperienceCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            student: {},
            experience: [],
            addExperience: false,
            newExperience: {
                company: "",
                title: "",
                location: "",
                year_of_starting: "",
                month_of_starting: "01",
                year_of_ending: "",
                month_of_ending: "10",
                description: ""
            }
        }
        this.toggleAddExperience = this.toggleAddExperience.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.addNewExperience = this.addNewExperience.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            student: nextProps.student,
            experience: nextProps.student.experience
        })
    }

    addNewExperience = (event) => {
        event.preventDefault();
        this.props.addNewExperience({ experience: this.state.newExperience })
        this.setState({
            addExperience: false,
            newExperience: {
                company: "",
                title: "",
                location: "",
                year_of_starting: "",
                month_of_starting: "01",
                year_of_ending: "",
                month_of_ending: "10",
                description: ""
            }
        })
    }

    toggleAddExperience = () => {
        this.setState({ addExperience: !this.state.addExperience })
    }

    handleChange = (e) => {
        this.state.newExperience[e.target.name] = e.target.value
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        let experienceDetails = null;
        if (this.state.experience.length > 0) {
            experienceDetails = (
                <div class="row">
                    {this.state.experience.map((experience, index) => {
                        return (
                            <Experience experience={this.state.experience[index]} index={index} />
                        )
                    })}
                </div>
            )
        } else {
            experienceDetails = (
                <div class="row" style={{ paddingLeft: "30px", marginBottom: "0px" }}>
                    <div class="col-md-12" style={{ textAlign: "-webkit-center" }}><h5>No Experience Details Found</h5></div>
                </div>
            )
        }
        let addExperience = null;
        if (this.state.addExperience) {
            addExperience = (
                <div class="row" style={{ paddingLeft: "5px", marginBottom: "20px", marginTop: "30px" }}>
                    <form onSubmit={this.addNewExperience}>
                        <div class="col-md-1" style={{ marginLeft: "15px", paddingRight: "0px", marginRight: "0px" }}>
                            <Avatar variant="square" style={{ width: "50px", height: "50px", backgroundColor: "white", color: "black", border: "2px solid", borderStyle: "groove" }}>
                                <h6><LaptopMacIcon style={{ fontSize: 35, color: "#2c347a" }} /></h6>
                            </Avatar>
                        </div>
                        <div class="col-md-10" style={{ marginLeft: "20px" }}>
                            <div class="row">
                                <div class="col-md-11" style={{ marginBottom: "10px" }}>
                                    <label for="contactEmail">Job Title</label>
                                    <input required onChange={this.handleChange} value={this.state.newExperience.title} type="text" class="form-control" name="title" id="title"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-11" style={{ marginBottom: "10px" }}>
                                    <label htmlFor="contactEmail">Employer</label>
                                    <input required onChange={this.handleChange} value={this.state.newExperience.company} type="text" class="form-control" id="company" name="company"></input>
                                </div>
                            </div>
                            <div class="row" style={{ paddingRight: "40px" }}>
                                <div class="row" style={{ marginLeft: "15px" }}><label htmlFor="contactEmail">Time Period</label></div>
                                <div class="row" style={{ marginLeft: "0px" }}>
                                    <div className="col-md-6" style={{ paddingRight: "0px", marginRight: "0px" }}>
                                        <label htmlFor="contactEmail">Start Date: </label>
                                        <div class="form-inline" style={{ marginBottom: "10px" }}>
                                            <select required id="inputState" class="form-control" style={{ width: "55%", marginRight: "5px" }} onChange={this.handleChange} name="month_of_starting">
                                                <option selected value={"01"}>January</option>
                                                <option value={"02"}>February</option>
                                                <option value={"03"}>March</option>
                                                <option value={"04"}>April</option>
                                                <option value={"05"}>May</option>
                                                <option value={"06"}>June</option>
                                                <option value={"07"}>July</option>
                                                <option value={"08"}>August</option>
                                                <option value={"09"}>September</option>
                                                <option value={"10"}>October</option>
                                                <option value={"11"}>November</option>
                                                <option value={"12"}>December</option>
                                            </select>
                                            <input required style={{ width: "35%", marginRight: "5px" }} onChange={this.handleChange} value={this.state.newExperience.year_of_starting} type="number" class="form-control" id="year_of_starting" name="year_of_starting"></input>
                                        </div>
                                    </div>
                                    <div className="col-md-6" style={{ paddingLeft: "0px", marginLeft: "0px" }}>
                                        <label htmlFor="contactEmail">End Date: </label>
                                        <div class="form-inline" style={{ marginBottom: "10px" }}>
                                            <select id="inputState" class="form-control" style={{ width: "55%", marginRight: "5px" }} onChange={this.handleChange} name="month_of_ending">
                                                <option selected value={"01"}>January</option>
                                                <option value={"02"}>February</option>
                                                <option value={"03"}>March</option>
                                                <option value={"04"}>April</option>
                                                <option value={"05"}>May</option>
                                                <option value={"06"}>June</option>
                                                <option value={"07"}>July</option>
                                                <option value={"08"}>August</option>
                                                <option value={"09"}>September</option>
                                                <option value={"10"}>October</option>
                                                <option value={"11"}>November</option>
                                                <option value={"12"}>December</option>
                                            </select>
                                            <input style={{ width: "35%", marginRight: "5px" }} onChange={this.handleChange} value={this.state.newExperience.year_of_ending} type="number" class="form-control" id="year_of_ending" name="year_of_ending"></input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-11" style={{ marginBottom: "10px" }}>
                                    <label htmlFor="contactEmail">Location</label>
                                    <input required onChange={this.handleChange} value={this.state.newExperience.location} type="text" class="form-control" id="location" name="location"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-11" style={{ marginBottom: "10px" }}>
                                    <label htmlFor="contactEmail">Description</label>
                                    <textarea
                                        class="form-control"
                                        id="Description"
                                        rows="4"
                                        style={{ marginTop: "10px" }}
                                        onChange={this.handleChange}
                                        name="description"
                                        value={this.state.newExperience.description}
                                    >
                                    </textarea>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-11" style={{ textAlign: "-webkit-right", marginTop: "10px", marginRight: "30px" }}>
                                    <button type="button" onClick={this.toggleAddExperience} style={{ backgroundColor: "rgba(0,0,0,.06)", color: "black" }} class="btn btn-secondary" >Cancel</button>
                                    <button type="submit" style={{ backgroundColor: "#0d7f02", marginLeft: "5px" }} class="btn btn-success">Save</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )

        } else {
            addExperience = (
                <button type="button" className="btn btn-light" onClick={this.toggleAddExperience}
                    style={{ width: "100%", margin: "0px", color: "#1569e0", backgroundColor: "white", fontWeight: "500" }}>
                    Add Experience
                </button>
            )
        }
        return (
            <div>
                <div className="row">
                    <div class="col-md-12">
                        <Card style={{ marginBottom: "0px", paddingBottom: "15px", paddingTop: "10px", marginTop: "0px" }}>
                            <h4 style={{ marginBottom: "25px", paddingBottom: "0px", marginLeft: "15px" }}>Experience</h4>
                            <div class="row" style={{ width: "100%" }}>
                                {experienceDetails}
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="row">
                    <div class="col-md-12">
                        <Card style={{ marginBottom: "15px", marginTop: "1px" }}>
                            {addExperience}
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
        addNewExperience: payload => dispatch(addNewExperience(payload))
    };
}

export default connect(null, mapDispatchToProps)(ExperienceCard);