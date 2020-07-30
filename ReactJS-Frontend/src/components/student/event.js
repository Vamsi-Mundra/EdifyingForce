import React, { Component } from 'react';
import '../../App.css';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import StudentNavBar from "./candidateNavBar"
import _ from "lodash";
import Loading from '../loading';
import { connect } from "react-redux";
import { fetchEvents, fetchStudentProfile, applyForEvent } from "../../redux/actions/student";

class EventDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: {},
            student: {},
            majors: [],
            successDialog: false,
            buttonText: "+ RSVP for Event",
            buttonDisabled: false
        }
        this.applyForEvent = this.applyForEvent.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        let major = []
        if (!_.isUndefined(nextProps.profile.education)) {
            nextProps.profile.education.map(education => {
                major.push(education.major.toLowerCase())
            })
        }
        const { match: { params } } = this.props
        let event = _.filter(nextProps.events, { 'id': params.id });
        this.setState({
            events: nextProps.events,
            student: nextProps.profile,
            majors: major,
            event: event[0]
        })
        if (!_.isUndefined(event[0].registrations)) {
            event[0].registrations.map(registration => {
                if (registration.student_id === sessionStorage.getItem("id")) {
                    this.setState({
                        buttonText: "Registered",
                        buttonDisabled: true
                    })
                }
            })
        }
    }

    applyForEvent = () => {
        const { match: { params } } = this.props;
        const url = process.env.REACT_APP_BACKEND_URL + 'event/' + params.id + '/register'
        const data = {
            companyId: this.state.event.company_id,
            studentId: sessionStorage.getItem("id")
        }
        this.props.applyForEvent({ url, data })
    }

    componentDidMount() {
        this.props.fetchEvents();
        this.props.fetchStudentProfile();
    }

    render() {
        let eventDetails = null;
        if (_.isEmpty(this.state.event)) {
            eventDetails = (
                <b>Fetching Event Details. Please Wait...!</b>
            )
        } else {
            eventDetails = (
                <div className="container" style={{ width: "75%", align: "center", marginTop: "3px" }}>
                    <div className="row" style={{ marginBottom: "3px" }}>
                        <Card style={{ padding: "10px", marginTop: "0px", backgroundColor: "grey", height: "100px", textAlign: "-webkit-center", verticalAlign: "center" }}>
                            <h2 style={{ color: "white" }}>{this.state.event.company_name}</h2>
                        </Card>
                    </div>
                    <div className="row">
                        <Card style={{ padding: "30px", marginBottom: "0px", marginTop: "0px" }}>
                            <div className="row">
                                <div className="col-md-1" style={{ alignItems: "center", verticalAlign: "center", marginTop: "0px" }}>
                                    {this.state.event.image === null ? (
                                        <Avatar variant="square" style={{ width: "80px", height: "80px" }}>
                                            <b style={{ fontSize: "90" }}>{this.state.event.company_name}</b>
                                        </Avatar>
                                    ) : (
                                            <Avatar src={this.state.event.image} variant="square" style={{ width: "80px", height: "80px" }} />
                                        )}
                                </div>
                                <div className="col-md-8" style={{ marginLeft: "35px" }}>
                                    <Typography variant="h4" style={{ marginBottom: "5px" }}>
                                        <b>{this.state.event.name}</b>
                                    </Typography>
                                    <Typography variant="h5" style={{ marginBottom: "5px" }}>
                                        <b>{this.state.event.company_name.toUpperCase()}</b>
                                    </Typography>
                                    <Typography variant="h5" style={{ marginBottom: "5px" }}>
                                        <span class="glyphicon glyphicon-map-marker"></span> {this.state.event.location}
                                    </Typography>
                                    <Typography variant="h5" style={{ marginBottom: "5px" }}>
                                        <span class="glyphicon glyphicon-time"></span> {moment(this.state.event.date).format("dddd, MMMM Do YYYY")} - {moment(this.state.event.time, "HH:mm:ss").format("LT")}
                                    </Typography>
                                    <Typography variant="h5" style={{ marginBottom: "0px", paddingBottom: "0px" }}>
                                        <b>Eligibility: </b>{this.state.event.eligibility}
                                    </Typography>
                                </div>
                                <div className="col-md-1" style={{ alignItems: "center", verticalAlign: "center", marginTop: "0px" }}>
                                    {(this.state.event.eligibility.toLowerCase() === "all") || (!_.isEmpty(_.intersection(this.state.event.eligibility.toLowerCase().split(","), this.state.majors))) ?
                                        (
                                            <button type="button" class="btn btn-primary"
                                                style={{ backgroundColor: this.state.buttonDisabled ? "green" : "#1569e0" }}
                                                onClick={this.applyForEvent}
                                                disabled={this.state.buttonDisabled}
                                            >
                                                <b>{this.state.buttonText}</b>
                                            </button>
                                        )
                                        : (
                                            <button type="button" class="btn btn-primary"
                                                style={{ backgroundColor: "red" }}
                                                disabled="true"
                                            >
                                                <b>Not Eligible</b>
                                            </button>
                                        )}
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="row" style={{ marginTop: "3px" }}>
                        <Card style={{ padding: "20px", marginTop: "0px", minHeight: "100px" }}>
                            {this.state.event.description}
                        </Card>
                    </div>
                </div>
            )
        }
        return (
            <div>
                <StudentNavBar tab="events" />
                <Loading />
                {eventDetails}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        events: state.events,
        profile: state.profile
    };
};

function mapDispatchToProps(dispatch) {
    return {
        fetchEvents: payload => dispatch(fetchEvents(payload)),
        fetchStudentProfile: payload => dispatch(fetchStudentProfile(payload)),
        applyForEvent: payload => dispatch(applyForEvent(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);