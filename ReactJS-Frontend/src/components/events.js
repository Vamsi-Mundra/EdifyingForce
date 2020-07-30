import React, { Component } from 'react';
import moment from 'moment';
import TablePagination from '@material-ui/core/TablePagination';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CreateEvent from "./createEvent";
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import EventIcon from '@material-ui/icons/Event';
import { connect } from "react-redux";
import { fetchEventsOfCompany, toggleCreateEvent } from "../redux/actions/company"

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            page: 0,
            rowsPerPage: 5,
            enableCreate: false,
            jobId: ""
        }
        this.viewApplicants = this.viewApplicants.bind(this);
        this.toggleCreate = this.toggleCreate.bind(this);
        this.updateJobs = this.updateJobs.bind(this);
    }

    componentDidMount() {
        this.updateJobs();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            jobs: nextProps.events
        })
    }

    updateJobs = () => {
        this.props.fetchEventsOfCompany();
    }
    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage
        })
    };

    handleChangeRowsPerPage = event => {
        this.setState({
            rowsPerPage: event.target.value,
            page: 0
        })
    };

    toggleCreate = () => {
        this.props.toggleCreateEvent();
    }

    viewApplicants = id => {
        this.setState({
            jobId: id
        })

    }
    render() {
        let createDialog = null;
        if (this.props.enableCreateEvent) createDialog = (<CreateEvent toggleCreate={this.toggleCreate} enableCreate={this.props.enableCreateEvent} updateJobs={this.updateJobs} />)
        else createDialog = null;
        let errorBanner = null;
        if (this.props.events.length === 0) errorBanner = (<b>No Events Posted Currently</b>)
        return (
            <div className="container" style={{ width: "80%", align: "center", marginTop: "20px" }}>
                {createDialog}
                <div>
                    <Fab variant="extended" style={{ alignContent: "right", backgroundColor: "rgb(225, 225, 225)" }} onClick={this.toggleCreate} >
                        <AddIcon /><b style={{ fontSize: "10px" }}>Create New Event</b>
                    </Fab>
                    <br /><br />
                </div>
                <div>
                    {this.state.jobs.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((job, index) => {
                        return (
                            <Card style={{ padding: "15px", marginBottom: "4px" }}>
                                <div className="row">
                                    <div className="col-md-1">
                                        <Avatar variant="square" style={{ width: "80px", height: "80px", margin: "10px", backgroundColor: "#5ba1c7" }} >
                                            <h6><EventIcon style={{ fontSize: 50, color: "#385b6e" }} /></h6>
                                        </Avatar>
                                    </div>
                                    <div className="col-md-9" style={{ paddingLeft: "55px" }}>
                                        <div className="row inline"><h4 style={{ marginBottom: "6px", paddingBottom: "0px" }}>{job.name}</h4></div>
                                        <div className="row"><h5 style={{ marginTop: "0px", marginBottom: "4px" }}><span class="glyphicon glyphicon-map-marker"></span> {job.location}</h5></div>
                                        <div class="row" style={{ paddingLeft: "0px" }}>
                                            <Typography color="" variant="h6" style={{ display: "inline" }}><span class="glyphicon glyphicon-time"></span> {moment(job.date).format("dddd, MMMM Do")}, {moment(job.time, "HH:mm:ss").format("LT")}</Typography>
                                        </div>
                                        <div className="row ">
                                            <Typography color="" variant="h6" style={{ display: "inline" }}>Eligibility: {job.eligibility}</Typography>
                                        </div>
                                    </div>
                                    <div className="col-md-2" style={{ backgroundColor: "" }}>
                                        <Link to={{ pathname: '/event/' + job["id"] + '/registrations', registrations: this.state.jobs[index].registrations, event: this.state.jobs[index] }}
                                            style={{ textDecoration: "none" }}>
                                            <Button color="primary" variant="outlined" >View Registrations</Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
                <div style={{ textAlign: "center" }}><br />{errorBanner}</div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={this.state.jobs.length}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        events: state.eventsOfCompany,
        enableCreateEvent: state.enableCreateEvent,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        fetchEventsOfCompany: payload => dispatch(fetchEventsOfCompany(payload)),
        toggleCreateEvent: payload => dispatch(toggleCreateEvent(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Events);