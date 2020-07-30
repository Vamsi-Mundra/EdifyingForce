import React, { Component } from 'react';
import '../../App.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import TablePagination from '@material-ui/core/TablePagination';
import CheckIcon from '@material-ui/icons/Check';
import Avatar from '@material-ui/core/Avatar';
import StudentNavBar from "./candidateNavBar";
import _ from "lodash";
import Loading from '../loading';
import { toggleLoading } from "../../redux/actions/common"
import { connect } from "react-redux";
import { fetchRegistrations } from "../../redux/actions/student"

class StudentRegistrations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applications: [],
            page: 0,
            rowsPerPage: 25
        }
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            applications: nextProps.registrations
        })
    }

    componentDidMount() {
        this.props.toggleLoading()
        this.props.fetchRegistrations();
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
        if (this.state.applications.length === 0 && !this.props.loading) {
            errorBanner = (
                <Card style={{ padding: "0px", margin: "7px" }}>
                    <CardContent style={{ padding: "5px" }}>
                        <b>No Registrations Found</b>
                    </CardContent >
                </Card >
            )
        }
        return (
            <div>
                <Loading />
                <StudentNavBar tab="events" /><br />
                <div className="container" style={{ width: "70%", align: "center", height: "100%" }}>
                    <div style={{}}>
                        <div style={{ marginBottom: "20px", marginTop: "10px" }}><Typography color="textSecondary" variant="h6">
                            {(this.state.page * this.state.rowsPerPage) + 1} - {this.state.applications.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).length} of {this.state.applications.length} registrations
                                </Typography></div>
                        {this.state.applications.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(application => {
                            return (
                                <span style={{ alignContent: "right", padding: "0px" }} key={application.id}>
                                    <Card style={{ padding: "0px", marginBottom: "7px" }}>
                                        <div style={{ width: "15%", float: "left", height: "100%", alignItems: "center", overflow: "hidden" }}>
                                            {_.isUndefined(application.image) ? (
                                                <Avatar variant="square" style={{ width: "80px", height: "80px", margin: "10px", backgroundColor: "orange" }}>
                                                    <b style={{ fontSize: "90" }}>{application.company_name}</b>
                                                </Avatar>
                                            ) : (
                                                    <Avatar src={application.image} variant="square" style={{ width: "80px", height: "80px", margin: "10px", backgroundColor: "orange" }} />
                                                )}
                                        </div>
                                        <div style={{ width: "85%", height: "100%", overflowX: "float" }}>
                                            <CardContent style={{ paddingBottom: "5px" }}>
                                                <Typography color="textSecondary" gutterBottom>
                                                    <b>{application.name.toUpperCase()}</b>
                                                </Typography>
                                                <Typography color="textSecondary">
                                                    {application.company_name}
                                                </Typography>
                                                <Typography color="textSecondary" style={{ verticalAlign: "center" }}>
                                                    <span class="glyphicon glyphicon-map-marker"></span>  {application.location}
                                                </Typography>
                                                <Typography color="textSecondary" style={{ verticalAlign: "center" }}>
                                                    <span class="glyphicon glyphicon-time"></span> {moment(application.date).format("dddd, MMMM Do YYYY")} - {moment(application.time, "HH:mm:ss").format("LT")}
                                                </Typography>
                                                <Typography color="textSecondary">
                                                    <CheckIcon />Registered {moment(application.registered_on).format("MMMM Do")}
                                                </Typography>
                                            </CardContent></div>
                                    </Card>
                                </span>
                            );
                        })}
                        <div style={{ textAlign: "center" }}><br />{errorBanner}</div>
                        <TablePagination
                            rowsPerPageOptions={[25, 50]}
                            component="div"
                            count={this.state.applications.length}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </div>
                </div >
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        registrations: state.registrationsOfStudent,
        loading: state.loading
    };
};

function mapDispatchToProps(dispatch) {
    return {
        fetchRegistrations: payload => dispatch(fetchRegistrations(payload)),
        toggleLoading: payload => dispatch(toggleLoading(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentRegistrations);