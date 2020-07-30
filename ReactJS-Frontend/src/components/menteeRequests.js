import React, { Component } from 'react';
import moment from 'moment';
import TablePagination from '@material-ui/core/TablePagination';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import WorkIcon from '@material-ui/icons/Work';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { connect } from "react-redux";
import { fetchJobsOfCompany, toggleCreateJob, fetchAppsOfCompany, updateApplicationStatus } from "../redux/actions/company"

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
class Jobs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            editStatusDialog: false,
            editapplicant: {},
            editIndex: "",
            showResume: false,
            applicantsOfCompany: [],
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
        // this.updateJobs();
        this.updateApplicants();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            jobs: nextProps.jobs,
            applicantsOfCompany: nextProps.applicantsOfCompany ? nextProps.applicantsOfCompany : []
        })
    }

    updateJobs = () => {
        this.props.fetchJobsOfCompany();
    }
    updateApplicants = () => {
        this.props.fetchAppsOfCompany();
    }
    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage
        })
    };
    enableResumeWindow = (index) => {
        this.setState({
            showResume: true,
            currentIndex: index
        })
    }
    handleChangeRowsPerPage = event => {
        this.setState({
            rowsPerPage: event.target.value,
            page: 0
        })
    };

    toggleCreate = () => {
        this.props.toggleCreateJob()
    }
    closeResumeModal = () => {
        this.setState({
            showResume: false
        })
    }
    viewApplicants = id => {
        this.setState({
            jobId: id
        })

    }
    editStatusOfApplicant = (index, applicant) => {
        this.setState(
            {
                editStatusDialog: true,
                editapplicant: applicant,
                editIndex: index
            }
        )
    }
    editApplicatStatus = (status) => {
        let applicant = {
            ...this.state.editapplicant,
            status: status
        }
        const data = {
            "status": status,
            "mentorId": sessionStorage.getItem("id"),
            "applicationId": applicant.application_id
        }
        this.props.updateApplicationStatus(data);
        this.state.applicantsOfCompany[this.state.editIndex].status = status;
        // this.updateApplicants();
        this.setState({
            editStatusDialog: false,
            editapplicant: {},
            editIndex: ""
        })
    }
    closeEditModal = () => {
        this.setState({
            editStatusDialog: false,
            editapplicant: {}
        })
    }
    getEditDialog = () => {
        if (this.state.editStatusDialog)
            return (
                <div style={{ overflow: "none" }}>
                    <Dialog style={{ minWidth: "100%" }} open={this.state.editStatusDialog} onClose={this.closeResumeModal} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title"><h4>Responding to  {this.state.editapplicant.student_name}'s request </h4></DialogTitle>
                        <DialogContent>
                            <Button onClick={() => { this.editApplicatStatus("Approved") }} variant="outlined" color="primary">
                                Approve
                </Button>
                            <Button onClick={() => { this.editApplicatStatus("Reject") }} variant="outlined" color="secondary">
                                Reject
                </Button>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeEditModal} color="secondary">
                                Close
                </Button>
                        </DialogActions>
                    </Dialog></div>
            )
    }
    render() {
        let createDialog = null;
        let errorBanner = null;
        let resumeModal = null;
        if (this.state.showResume && this.state.applicantsOfCompany.length > 0) {
            resumeModal = (
                <div style={{ overflow: "none" }}>
                    <Dialog style={{ minWidth: "100%" }} open={this.state.showResume} onClose={this.closeResumeModal} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title"><h4>{this.state.applicantsOfCompany[this.state.currentIndex]["student_name"]}'s Resume</h4></DialogTitle>
                        <DialogContent>
                            <object width="550" height="600" data={this.state.applicantsOfCompany[this.state.currentIndex]["student_resume"]} type="application/pdf">   </object>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeResumeModal} color="secondary">
                                Close
                        </Button>
                        </DialogActions>
                    </Dialog></div>
            )
        }
        if (!this.props.jobs || this.props.jobs.length === 0) errorBanner = (<b></b>)
        return (
            <div className="container" style={{ width: "80%", align: "center", marginTop: "20px" }}>
                {createDialog}
                {resumeModal}
                {this.getEditDialog()}

                <h3 style={{ marginTop: "0px" }}>Mentee Requests</h3>
                <div>
                    {this.state.applicantsOfCompany.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((applicant, index) => {
                        return (
                            <Card style={{ padding: "15px", marginBottom: "4px" }}>
                                <div className="row">
                                    <div className="col-md-1">
                                        <Avatar variant="square" style={{ width: "80px", height: "80px", margin: "10px", backgroundColor: "#5ba1c7" }} >
                                            <h6><WorkIcon style={{ fontSize: 50, color: "#385b6e" }} /></h6>
                                        </Avatar>
                                    </div>
                                    <div className="col-md-9" style={{ paddingLeft: "55px" }}>
                                        <div className="row inline"><h4 style={{ marginBottom: "6px", paddingBottom: "0px" }}>

                                            <Link to={'/students/' + applicant.student_id} style={{ color: "black" }}><b>{applicant.student_name}</b></Link>
                                        </h4></div>
                                        <div className="row"><h5 style={{ marginTop: "0px", marginBottom: "4px" }}>

                                            {applicant.student_college}

                                        </h5></div>
                                        <div className="row"><h5 style={{ marginTop: "0px", marginBottom: "4px" }}>{applicant.message}</h5></div>
                                        <div class="row" style={{ paddingLeft: "0px" }}>
                                            {/* <Typography color="" variant="h6" style={{ display: "inline", marginLeft: "0px", marginRight: "25px" }}><span class="glyphicon glyphicon-briefcase"></span> {applicant.applied_on}</Typography> */}
                                            <Typography color="" variant="h6" style={{ display: "inline", marginRight: "25px" }}> Status :  {applicant.status} <span style={{ "margin-left": "10px" }} > <EditIcon className="editicon" color="primary" onClick={() => { this.editStatusOfApplicant(index, applicant) }} style={{ textAlign: "-webkit-right", cursor: "pointer" }} /></span></Typography>
                                            {/* <Typography color="" variant="h6" style={{ display: "inline" }}><span class="glyphicon glyphicon-time"></span> Posted {moment(job.posting_date).format("MMMM Do")}</Typography> */}
                                        </div>
                                        <div className="row">
                                            {/* <Typography color="" variant="h6" style={{ display: "inline" }}>Deadline: {moment(job.deadline).format("MMMM Do")}</Typography> */}
                                        </div>
                                    </div>
                                    <div className="col-md-2" style={{ backgroundColor: "" }}>
                                        <div class="row">
                                            <Button color="primary" variant="outlined" onClick={() => this.enableResumeWindow(index)} >View Resume</Button>
                                        </div>
                                        <div class="row" style={{ paddingTop: "15px" }}>
                                            <Link to={{ pathname: '/conversations', student: { "id": applicant.student_id, "name": applicant.student_name, "college": applicant.student_college, "image": undefined } }} style={{ textDecoration: "none" }}>
                                                <Button color="primary" variant="outlined" >
                                                    <span style={{ fontSize: "14px", marginRight: "5px" }} class="glyphicon glyphicon-comment"> </span> <b>Message</b>
                                                </Button>
                                            </Link>
                                        </div>

                                    </div>
                                </div>
                            </Card>
                        );
                    })
                    }
                </div >

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
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        jobs: state.jobsOfCompany,
        applicantsOfCompany: state.applicantsOfCompany,
        enableCreateJob: state.enableCreateJob,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        updateApplicationStatus: payload => dispatch(updateApplicationStatus(payload)),
        fetchAppsOfCompany: payload => dispatch(fetchAppsOfCompany(payload)),
        fetchJobsOfCompany: payload => dispatch(fetchJobsOfCompany(payload)),
        toggleCreateJob: payload => dispatch(toggleCreateJob(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Jobs);