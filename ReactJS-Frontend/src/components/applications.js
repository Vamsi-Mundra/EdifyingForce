import React, { Component } from 'react';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Fab from "@material-ui/core/Fab";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Card from '@material-ui/core/Card';
import { connect } from "react-redux";
import { updateApplicationStatus } from "../redux/actions/company"

const columns = [
    { id: 'student_name', label: 'Student Name', minWidth: 100 },
    { id: 'student_college', label: 'College', minWidth: 120 },
    { id: 'applied_on', label: 'Applied On', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'edit', label: '', minWidth: 100 },
    { id: 'resume', label: '', minWidth: 100 }
];

class Applications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applications: [],
            page: 0,
            rowsPerPage: 5,
            enableCreate: false,
            jobInfo: {},
            isEditDialogOpen: false,
            currentApplicationId: "",
            statusesToShow: [],
            showResume: false,
            currentIndex: 0,
            currentPdf: ""
        }
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.updateStatusOfApplication = this.updateStatusOfApplication.bind(this);
        this.enableEdit = this.enableEdit.bind(this);
        this.handleEditDialogClose = this.handleEditDialogClose.bind(this);
        this.enableResumeWindow = this.enableResumeWindow.bind(this)
        this.refreshStatus = this.refreshStatus.bind(this);
    }

    componentDidMount() {
        this.setState({
            applications: this.props.location.applications,
            jobInfo: this.props.location.job
        })
    }

    refreshStatus = () => {
        if (this.props.jobsOfCompany.length > 0 && this.state.jobInfo !== {}) {
            let currentJob = {};
            this.props.jobsOfCompany.map(job => {
                if (job.id === this.state.jobInfo.id) currentJob = job
            })
            this.setState({
                applications: currentJob.applications
            })
        }
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

    updateStatusOfApplication = (status) => {
        this.setState({
            isEditDialogOpen: false
        })
        const data = {
            "status": status,
            "jobId": this.state.jobInfo.id,
            "applicationId": this.state.currentApplicationId
        }
        this.props.updateApplicationStatus(data)
        setTimeout(
            function () {
                this.refreshStatus();
            }
                .bind(this),
            1500
        );
    }

    enableEdit = (id, status) => {
        this.setState({
            currentApplicationId: id,
            statusesToShow: ["Pending", "Reviewed", "Declined"].filter(x => ![status].includes(x)),
            isEditDialogOpen: true
        })
    }

    handleEditDialogClose = () => {
        this.setState({
            currentApplicationId: "",
            statusesToShow: [],
            isEditDialogOpen: false
        })
    }

    closeResumeModal = () => {
        this.setState({
            showResume: false
        })
    }

    enableResumeWindow = (index) => {
        this.setState({
            showResume: true,
            currentIndex: index
        })
    }

    render() {
        let createDialog = null;
        let errorBanner = null;
        if (this.state.applications.length === 0) errorBanner = (<b>No Applicants for this Job</b>)
        let jobInfoTab = null;
        if (this.state.jobInfo !== {}) {
            jobInfoTab = (
                <Card style={{ borderRadius: "2.5px", padding: "30px", backgroundColor: "white" }}>
                    <Grid container spacing={3}>
                        <div className="container" style={{ width: "25%", marginLeft: "60px" }}><b>Title:</b> {this.state.jobInfo.title}</div>
                        <div className="container" style={{ width: "25%" }}><b>Salary:<span class="glyphicon glyphicon-usd"></span></b>{this.state.jobInfo.salary} per hour</div>
                        <div className="container" style={{ width: "30%" }}><b><span class="glyphicon glyphicon-time"> </span> Deadline:</b> {moment(this.state.jobInfo.deadline).format("MMMM Do YYYY")}</div>
                        <div className="container" style={{ width: "25%", marginLeft: "60px" }}><b>Category:</b> {this.state.jobInfo.category}</div>
                        <div className="container" style={{ width: "25%" }}><b><span class="glyphicon glyphicon-map-marker"></span>Location:</b> {this.state.jobInfo.location}</div>
                        <div className="container" style={{ width: "30%" }}><b><span class="glyphicon glyphicon-time"></span> Posted On: </b> {moment(this.state.jobInfo.posting_date).format("MMMM Do YYYY")}</div>
                    </Grid>
                </Card>
            )
        }
        let resumeModal = null;
        if (this.state.applications.length > 0) {
            resumeModal = (
                <div style={{ overflow: "none" }}>
                    <Dialog style={{ minWidth: "100%" }} open={this.state.showResume} onClose={this.closeResumeModal} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title"><h4>{this.state.applications[this.state.currentIndex]["student_name"]}'s Resume</h4></DialogTitle>
                        <DialogContent>
                            <object width="550" height="600" data={this.state.applications[this.state.currentIndex]["student_resume"]} type="application/pdf">   </object>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeResumeModal} color="secondary">
                                Close
                        </Button>
                        </DialogActions>
                    </Dialog></div>
            )
        }

        return (
            <div className="container" style={{ width: "85%", alignItems: "center", marginTop: "20px" }}>
                <Dialog onClose={this.handleEditDialogClose} aria-labelledby="simple-dialog-title" open={this.state.isEditDialogOpen}>
                    <DialogTitle id="simple-dialog-title">Update Status To</DialogTitle>
                    <List>
                        <Divider />
                        {this.state.statusesToShow.map(status => (
                            <ListItemAvatar>
                                <ListItem style={{ textAlign: "center" }} button onClick={() => this.updateStatusOfApplication(status)} key={status} id={status}>
                                    <ListItemText primary={status} />
                                </ListItem><Divider /></ListItemAvatar>
                        ))}
                    </List>
                    <div style={{ textAlign: "center" }}>
                        <CancelPresentationIcon fontSize="large" style={{ backgroundColor: "red" }} onClick={this.handleEditDialogClose} />
                    </div>
                </Dialog>
                {createDialog}
                <div>
                    <Link to="/mentee/requests" style={{ textDecoration: "none" }}>
                        <Fab variant="extended" style={{ alignContent: "right", backgroundColor: "rgb(225, 225, 225)" }} >
                            <ArrowBackIcon fontSize="large" /><b style={{ fontSize: "10px" }}> Back to All Jobs</b>
                        </Fab>
                    </Link>
                    <br /><br />
                </div>
                {jobInfoTab}<br />
                <Paper style={{ width: "100%", align: "center" }}>
                    {resumeModal}
                    <TableContainer style={{ maxHeight: "80%" }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map(column => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth, backgroundColor: "rgb(225, 225, 225)", fontWeight: "bold", textAlign: "center", fontSize: "13px" }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.applications.map((row, index) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            {columns.map(column => {
                                                let value = row[column.id];
                                                if (column.id === "applied_on") value = moment(value).format("dddd, MMMM Do YYYY");
                                                if (column.id === "edit") {
                                                    return (
                                                        <TableCell style={{ fontSize: "10px", textAlign: "center" }} onClick={() => this.enableEdit(row["application_id"], row["status"])} id={row["application_id"]}>
                                                            <Button color="secondary">Edit</Button>
                                                        </TableCell>
                                                    )
                                                }
                                                if (column.id === "resume") {
                                                    return (
                                                        <TableCell style={{ fontSize: "10px", textAlign: "center" }} onClick={() => this.enableResumeWindow(index)} id={row["application_id"]}>
                                                            <Button color="primary">View Resume</Button>
                                                        </TableCell>
                                                    )
                                                }
                                                if (column.id === "student_name") {
                                                    return (<TableCell key={column.id} align={column.align} style={{ fontSize: "10px", textAlign: "center" }}>
                                                        <Link to={'/students/' + row["student_id"]}><b>{value.toUpperCase()}</b></Link>
                                                    </TableCell>
                                                    )
                                                }
                                                return (
                                                    <TableCell key={column.id} align={column.align} style={{ fontSize: "10px", textAlign: "center" }}>
                                                        {value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        component="div"
                        count={this.state.applications.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>
                <div style={{ textAlign: "center" }}><br />{errorBanner}</div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        jobsOfCompany: state.jobsOfCompany
    };
};

function mapDispatchToProps(dispatch) {
    return {
        updateApplicationStatus: payload => dispatch(updateApplicationStatus(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Applications);