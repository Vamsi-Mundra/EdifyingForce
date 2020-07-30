import React, { Component } from 'react';
import '../../App.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import TablePagination from '@material-ui/core/TablePagination';
import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/Info';
import CheckIcon from '@material-ui/icons/Check';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import StudentNavBar from "./candidateNavBar";
import _ from "lodash";
import Loading from '../loading';
import { toggleLoading } from "../../redux/actions/common"
import { connect } from "react-redux";
import { fetchApplications } from "../../redux/actions/student"

class StudentApplications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applications: [],
            page: 0,
            rowsPerPage: 25,
            applicationsFilter: [],
            applicationsSearchItems: [],
            applicationsFilterItems: [],
            Applied: false,
            Pending: false,
            Reviewed: false,
            Declined: false
        }
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.searchApplications = this.searchApplications.bind(this)
        this.filterApplicationSearch = this.filterApplicationSearch.bind(this)
        this.searchApplicationsByStatus = this.searchApplicationsByStatus.bind(this)
        this.filterApplicationSearchByStatus = this.filterApplicationSearchByStatus.bind(this)
        this.handleFilterChange = this.handleFilterChange.bind(this)
        this.mergeFilters = this.mergeFilters.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            applications: nextProps.applications,
            applicationsFilter: nextProps.applications
        })
        console.log(nextProps.applications)
    }
    componentDidMount() {
        this.props.toggleLoading()
        this.props.fetchApplications();
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

    mergeFilters = () => {
        this.setState({
            applications: _.intersectionBy(this.state.applicationsSearchItems,
                this.state.applicationsFilterItems,
                'id')
        })
    }
    searchApplications = (event) => {
        this.setState({
            applicationsSearchItems: this.filterApplicationSearch(this.state.applicationsFilter, event.target.value)
        }, () => {
            if (!_.isEmpty(this.state.applicationsFilterItems)) this.mergeFilters()
            else this.setState({ applications: this.state.applicationsSearchItems })
        })
    }

    filterApplicationSearch = (applications, searchStr) => {
        searchStr = searchStr.toLowerCase();
        return applications.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (student[attribute]) return student[attribute].toLowerCase().indexOf(searchStr) !== -1;
            });
        });
    }

    searchApplicationsByStatus = async () => {
        let newData = await this.filterApplicationSearchByStatus(this.state.applicationsFilter)
        this.setState({
            applicationsFilterItems: newData
        }, () => {
            if (_.isEmpty(this.state.applicationsSearchItems)) this.setState({ applications: newData })
            else this.mergeFilters()
        })
    }

    filterApplicationSearchByStatus = async (applications) => {
        if (this.state.Applied === false && this.state.Pending === false && this.state.Reviewed === false && this.state.Declined === false) {
            return applications
        }
        const isApplied = this.state.Applied;
        const isPending = this.state.Pending;
        const isReviewed = this.state.Reviewed;
        const isDeclined = this.state.Declined;
        const appliedApps = applications.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (attribute === "status" && isApplied === true) return student[attribute].toLowerCase().indexOf("applied") !== -1;
            });
        });
        const pendingApps = applications.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (attribute === "status" && isPending === true) return student[attribute].toLowerCase().indexOf("pending") !== -1;
            });
        });
        const reviewApps = applications.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (attribute === "status" && isReviewed === true) return student[attribute].toLowerCase().indexOf("reviewed") !== -1;
            });
        });
        const declinedApps = applications.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (attribute === "status" && isDeclined === true) return student[attribute].toLowerCase().indexOf("declined") !== -1;
            });
        });
        return [...appliedApps, ...pendingApps, ...declinedApps, ...reviewApps]
    }

    handleFilterChange = (value) => {
        if (value === 'Applied') this.setState({ Applied: !this.state.Applied, }, () => { this.searchApplicationsByStatus() })
        if (value === 'Pending') this.setState({ Pending: !this.state.Pending, }, () => { this.searchApplicationsByStatus() })
        if (value === 'Reviewed') this.setState({ Reviewed: !this.state.Reviewed, }, () => { this.searchApplicationsByStatus() })
        if (value === 'Declined') this.setState({ Declined: !this.state.Declined, }, () => { this.searchApplicationsByStatus() })
    }

    render() {
        let errorBanner = null;
        if (this.state.applications.length === 0 && !this.props.loading) {
            errorBanner = (
                <Card style={{ padding: "0px", margin: "7px" }}>
                    <CardContent style={{ padding: "5px" }}>
                        <b>No Applications Found</b>
                    </CardContent >
                </Card >
            )
        }
        console.log(this.state.applications)
        return (
            <div><StudentNavBar tab="jobs" /><br />
            <Loading />
                <div className="container" style={{ width: "90%", height: "100%" }}>
                    <Grid container spacing={3}>
                        <div style={{ alignContent: "center", width: "20%", marginRight: "20px", paddingBottom: "10px" }}>
                            <Card style={{ height: "10%", marginBottom: "1px" }}>
                                <h4 style={{ paddingLeft: "20px" }}>Filters</h4>
                            </Card>
                            <Card style={{ height: "25%", marginBottom: "1px" }}>
                                <CardContent>
                                    <b>Search Applications</b><br />
                                    <input autoComplete="off" type="text" class="form-control" id="search" aria-describedby="search"
                                        placeholder="Enter a Keyword" onChange={this.searchApplications} style={{ width: "100%", marginTop: "5px" }}
                                    />
                                    <br />
                                </CardContent>
                            </Card>
                            <Card style={{ height: "53%", marginBottom: "1px" }}><CardContent>
                                <div style={{ marginTop: "5px" }}><b>Application Status</b></div>
                                <FormControl component="fieldset" >
                                    <FormGroup >
                                        <FormControlLabel
                                            control={<Checkbox checked={this.state.Applied} onChange={() => this.handleFilterChange("Applied")} value="Applied" color="primary" />}
                                            label="Applied"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={this.state.Pending} onChange={() => this.handleFilterChange("Pending")} value="Pending" color="primary" />}
                                            label="Pending"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={this.state.Reviewed} onChange={() => this.handleFilterChange("Reviewed")} value="Reviewed" color="primary" />}
                                            label="Reviewed"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={this.state.Declined} onChange={() => this.handleFilterChange("Declined")} value="Declined" color="primary" />}
                                            label="Declined"
                                        />
                                    </FormGroup>
                                </FormControl>
                            </CardContent>
                            </Card >
                        </div>
                        <div style={{ width: "75%" }}>
                            <div style={{ marginBottom: "20px", marginTop: "10px" }}><Typography color="textSecondary" variant="h6">
                                {(this.state.page * this.state.rowsPerPage) + 1} - {this.state.applications.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).length} of {this.state.applications.length} applications
                                </Typography></div>
                            {this.state.applications.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(application => {
                                return (
                                    <span style={{ alignContent: "right", padding: "0px" }} key={application.id}>
                                        <Card style={{ padding: "0px", marginBottom: "7px" }}>
                                            <div style={{ width: "12%", float: "left", height: "100%", alignItems: "center", overflow: "hidden" }}>
                                                {_.isUndefined(application.image) ? (
                                                    <Avatar variant="circle" style={{ width: "80px", height: "80px", margin: "10px", backgroundColor: "orange" }}>
                                                        <b style={{ fontSize: "40px" }}>{application.name.substring(0,1)}</b>
                                                    </Avatar>
                                                ) : (
                                                        <Avatar src={application.image} variant="circle" style={{ width: "80px", height: "80px", margin: "10px", backgroundColor: "orange" }} />
                                                    )}
                                            </div>
                                            <div style={{ width: "85%", height: "100%", overflowX: "float" }}>
                                                <CardContent style={{ paddingBottom: "5px" }}>
                                                    <Typography color="textSecondary" gutterBottom style={{margin:"0px"}}>
                                                        <b style={{fontSize:"14px", color:"black"}}>{application.mentorName.toUpperCase()}</b>
                                                    </Typography>
                                                    <Typography color="textSecondary">
                                                    <b style={{fontSize:"12px"}}>{application.name}</b>
                                                    </Typography>
                                                    <Typography color="textSecondary" style={{ verticalAlign: "center" }}>
                                                        <InfoIcon /> Status: {application.status}
                                                    </Typography>
                                                    <Typography color="textSecondary">
                                                        <CheckIcon />Applied {moment(application.applied_on).format("MMMM Do")} - Applications close {moment(application.deadline).format("MMMM Do")}
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
                    </Grid>
                </div ></div>
        )
    }
}

const mapStateToProps = state => {
    return {
        applications: state.applicationsOfStudent,
        loading: state.loading
    };
};

function mapDispatchToProps(dispatch) {
    return {
        fetchApplications: payload => dispatch(fetchApplications(payload)),
        toggleLoading: payload => dispatch(toggleLoading(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentApplications);