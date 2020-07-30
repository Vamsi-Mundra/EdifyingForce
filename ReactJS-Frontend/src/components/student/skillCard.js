import React, { Component } from 'react';
import '../../App.css';
import _ from "lodash";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from "react-redux";
import { fetchStudentProfile, setCurrentSkill, updateSkills } from "../../redux/actions/student"

class SkillCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: {},
            skills: [],
            newSkill: ""
        }
        this.skillSaveHandler = this.skillSaveHandler.bind(this)
        this.skillChangeHandler = this.skillChangeHandler.bind(this)
        this.skillDeleteHandler = this.skillDeleteHandler.bind(this)
        this.skillDelete = this.skillDelete.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            student: nextProps.profile,
            skills: _.isUndefined(nextProps.profile.skills) ? [] : nextProps.profile.skills.split(",")
        })
    }

    skillSaveHandler = (event) => {
        let skillString = this.state.skills.toString() + "," + this.props.newSkill;
        if (this.state.skills.length === 0) skillString = this.props.newSkill
        this.props.updateSkills({ skills: skillString, newSkill: this.props.skills })
    }

    skillDelete = (event) => {
        let skillString = this.state.skills.toString();
        this.props.updateSkills({ skills: skillString, newSkill: this.props.skills })
    }

    skillChangeHandler = (event) => {
        this.props.setCurrentSkill(event.target.value)
    }

    skillDeleteHandler = (index) => {
        let skillSet = this.state.skills;
        skillSet.splice(index, 1)
        this.setState({
            skills: skillSet
        }, () => {
            this.skillDelete();
        })
    }

    render() {
        let skillsChips = null;
        if (this.state.skills.length > 0) {
            skillsChips = (
                <span>
                    {this.state.skills.map((skill, index) => {
                        return (
                            <Chip
                                label={<h6>{skill}</h6>}
                                variant="outlined"
                                onDelete={() => this.skillDeleteHandler(index)}
                                deleteIcon={<CloseIcon />}
                                style={{ height: "25px", "marginRight": "4px", marginBottom: "5px", borderRadius: "4px", border: "0px", backgroundColor: "#f0f0f0", padding: "0px" }}
                            />
                        )
                    })}
                </span>
            )
        } else {
            skillsChips = null
        }
        return (
            <div style={{}}>
                <Card style={{ marginBottom: "15px", paddingBottom: "0px", paddingTop: "0px", paddingLeft: "5px", paddingRight: "5px" }}>
                    <CardContent style={{}} >
                        <div className="row" style={{ marginLeft: "0px", marginRight: "0px" }}>
                            <div className="row" style={{ marginLeft: "0px", marginRight: "0px", marginBottom: "0px" }}>
                                <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "0px", marginTop: "0px" }}>Skills</h4>
                            </div>
                            <div className="row" style={{ marginLeft: "0px", marginRight: "0px", marginBottom: "5px" }}>
                                {skillsChips}
                            </div>
                            <div className="row">
                                <div class="col-md-8" style={{ marginRight: "0px", paddingRight: "7px" }}>
                                    <input autoComplete="off" required onChange={this.skillChangeHandler} value={this.props.newSkill} type="text" class="form-control" id="name" aria-describedby="name" placeholder="Add more skills"></input>
                                </div>
                                <div class="col-md-3" style={{ textAlign: "-webkit-center", marginLeft: "0px", paddingLeft: "0px" }}>
                                    <button type="button" onClick={this.skillSaveHandler} style={{ backgroundColor: "#0d7f02", width: "100%" }} class="btn btn-success" >Add</button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        profile: state.profile,
        newSkill: state.newSkill
    };
};

function mapDispatchToProps(dispatch) {
    return {
        fetchStudentProfile: payload => dispatch(fetchStudentProfile(payload)),
        setCurrentSkill: payload => dispatch(setCurrentSkill(payload)),
        updateSkills: payload => dispatch(updateSkills(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SkillCard);