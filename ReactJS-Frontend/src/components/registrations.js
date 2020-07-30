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
import Card from '@material-ui/core/Card';

const columns = [
    { id: 'student_name', label: 'Student Name', minWidth: 100 },
    { id: 'student_college', label: 'College', minWidth: 120 },
    { id: 'registered_on', label: 'Registered On', minWidth: 120 }
];

class Registrations extends Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            applications: [],
            page: 0,
            rowsPerPage: 5,
            jobInfo: {}
        }
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    }

    componentDidMount() {
        this.setState({
            applications: this.props.location.registrations,
            jobInfo: this.props.location.event
        })
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

    render() {
        let errorBanner = null;
        if (this.state.applications.length === 0) errorBanner = (<b>No Registrations for this Event</b>)
        let jobInfoTab = null;
        if (this.state.jobInfo !== {}) {
            jobInfoTab = (
                <Card style={{ borderRadius: "2.5px", padding: "30px", backgroundColor: "white" }}>
                    <Grid container spacing={3}>
                        <div className="container" style={{ width: "25%" }}><b>Name:</b> {this.state.jobInfo.name}</div>
                        <div className="container" style={{ width: "25%" }}><b><span class="glyphicon glyphicon-time"> </span></b> {moment(this.state.jobInfo.date).format("MMMM Do YYYY")} {moment(this.state.jobInfo.time, "HH:mm:ss").format("LT")}</div>
                        <div className="container" style={{ width: "25%" }}><b><span class="glyphicon glyphicon-map-marker"></span></b> {this.state.jobInfo.location}</div>
                        <div className="container" style={{ width: "25%" }}><b>Eligibility:</b> {this.state.jobInfo.eligibility}</div>
                    </Grid>
                </Card>
            )
        }
        return (
            <div className="container" style={{ width: "85%", alignItems: "center", marginTop: "20px" }}>
                <div>
                    <Link to="/my/events" style={{textDecoration:"none"}}>
                        <Fab variant="extended" style={{ alignContent: "right", backgroundColor: "rgb(225, 225, 225)" }} onClick={this.toggleCreate} >
                            <ArrowBackIcon fontSize="large" /><b style={{ fontSize: "10px" }}> Back to All Events</b>
                        </Fab>
                    </Link>
                    <br /><br />
                </div>
                {jobInfoTab}<br />
                <Paper style={{ width: "100%", align: "center" }}>
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
                                {this.state.applications.map(row => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            {columns.map(column => {
                                                let value = row[column.id];
                                                if (column.id === "registered_on") value = moment(value).format("dddd, MMMM Do YYYY");
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

export default Registrations;