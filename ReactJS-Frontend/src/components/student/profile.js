import React, { Component } from 'react';
import '../../App.css';
import _ from "lodash";
import Card from '@material-ui/core/Card';
import ProfileCard from './profileCard';
import SkillCard from './skillCard';
import EducationCard from './educationCard';
import ExperienceCard from './experienceCard';
import PersonalInfoCard from './personalInfoCard';
import { connect } from "react-redux";
import Loading from '../loading';
import { fetchStudentProfile, toggleObjectiveEdit, updateObjective } from "../../redux/actions/student"
import { toggleLoading } from "../../redux/actions/common";

class StudentProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: {},
            education: {},
            experience: {},
            objective: "",
            enableObjectiveSave: false,
            img: ""
        }
        this.objectiveChangeHandler = this.objectiveChangeHandler.bind(this)
        this.objectiveSaveHandler = this.objectiveSaveHandler.bind(this)
    }

    componentDidMount() {
        this.props.toggleLoading()
        this.props.fetchStudentProfile();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            student: nextProps.profile,
            education: nextProps.profile.education,
            experience: nextProps.profile.experience,
            objective: nextProps.profile.career_objective
        })
    }

    objectiveChangeHandler = (event) => {
        this.setState({
            objective: event.target.value
        })
    }

    objectiveSaveHandler = (event) => {
        this.props.updateObjective({ objective: this.state.objective })
    }

    render() {
        let objectiveSave = null;
        if (this.props.enableObjectiveSave) {
            objectiveSave = (
                <div>
                    <button type="button" style={{ backgroundColor: "#0d7f02" }} class="btn btn-success" onClick={this.objectiveSaveHandler}>Save</button>
                </div>
            )
        } else objectiveSave = null
        return (
            <div style={{ marginTop: "15px" }}>
                <Loading />
                <div className="container" style={{ width: "75%", height: "100%" }}>
                    <div class="row" style={{ width: "100%" }}>
                        <div class="col-md-4">
                            <div class="row" >
                                <div class="col-md-12">
                                    <ProfileCard />
                                </div>
                            </div>
                            <div class="row" >
                                <div class="col-md-12">
                                    <SkillCard />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <PersonalInfoCard />
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8" style={{ marginLeft: "0px", paddingLeft: "0px" }}>
                            <div class="row" >
                                <div class="col-md-12">
                                    <Card style={{ marginBottom: "15px", paddingBottom: "15px", paddingTop: "15px" }}>
                                        <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "15px" }}>My Journey</h4>
                                        <div class="row" style={{ width: "100%" }}>
                                            <div class="col-md-12" style={{ marginBottom: "10px", marginLeft: "15px" }}>
                                                <span style={{ color: "#1569e0" }}>What are you passionate about? What are you looking for on EdifyingForce?
                                                What are your experiences or skills?</span>
                                                <textarea
                                                    class="form-control"
                                                    id="objective"
                                                    rows="3"
                                                    style={{ marginTop: "10px" }}
                                                    onClick={() => this.props.toggleObjectiveEdit(true)}
                                                    onChange={this.objectiveChangeHandler}
                                                    value={this.state.objective}
                                                >
                                                </textarea>
                                            </div>
                                            <div class="col-md-12" style={{ textAlign: "-webkit-right", paddingRight: "0px" }}>
                                                {objectiveSave}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                            <div class="row" >
                                <div class="col-md-12">
                                    <EducationCard student={this.state.student} fetchStudentDetails={this.props.fetchStudentProfile} />
                                </div>
                            </div>
                            <div class="row" >
                                <div class="col-md-12">
                                    <ExperienceCard student={this.state.student} fetchStudentDetails={this.props.fetchStudentProfile} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        profile: state.profile,
        enableObjectiveSave: state.enableObjectiveSave
    };
};

function mapDispatchToProps(dispatch) {
    return {
        fetchStudentProfile: payload => dispatch(fetchStudentProfile(payload)),
        toggleObjectiveEdit: payload => dispatch(toggleObjectiveEdit(payload)),
        updateObjective: payload => dispatch(updateObjective(payload)),
        toggleLoading: payload => dispatch(toggleLoading(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfile);