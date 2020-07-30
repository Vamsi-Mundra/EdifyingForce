import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import TablePagination from '@material-ui/core/TablePagination';
import _ from 'lodash';
import StudentNavBar from "./candidateNavBar"
import Loading from '../loading';
import { connect } from "react-redux";
import { fetchEvents } from "../../redux/actions/student";
import { toggleLoading } from "../../redux/actions/common"

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            eventsFilter: [],
            page: 0,
            rowsPerPage: 10
        }
        this.searchEvents = this.searchEvents.bind(this)
        this.filterEventSearch = this.filterEventSearch.bind(this)
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            events: _.orderBy(nextProps.events, ["date"], ["asc"]),
            eventsFilter: _.orderBy(nextProps.events, ["date"], ["asc"])
        })
    }
    componentDidMount() {
        this.props.toggleLoading();
        this.props.fetchEvents();
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
    searchEvents = (event) => {
        this.setState({
            events: this.filterEventSearch(this.state.eventsFilter, event.target.value)
        })
    }

    filterEventSearch = (events, searchStr) => {
        searchStr = searchStr.toLowerCase();
        return events.filter(function (event) {
            return Object.keys(event).some(function (attribute) {
                console.log(attribute)
                console.log(event[attribute])
                if (event[attribute] !== "" && attribute === "name") return event[attribute].toLowerCase().indexOf(searchStr) !== -1;
            });
        });
    }

    render() {
        let errorBanner = null;
        if (this.state.events.length === 0 && !this.props.loading) {
            errorBanner = (
                <Card style={{ padding: "0px", margin: "7px" }}>
                    <CardContent style={{ padding: "5px" }}>
                        <b>No Events Found with the search criteria</b>
                    </CardContent >
                </Card >
            )
        }
        return (
            <div>
                <Loading/>
                <StudentNavBar tab="events" />
                <div className="container" style={{ width: "85%", align: "center", marginTop: "0px" }}>
                    <div className="row">
                        <div class="container" style={{ paddingTop: "10px", paddingBottom: "0px", marginBottom: "0px" }}>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <input type="text" autoComplete="off" class="form-control" id="search" aria-describedby="search"
                                            placeholder="Search By Event Name" onChange={this.searchEvents} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.events.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((event, index) => {
                        return (
                            <Card style={{ padding: "10px", marginBottom: "5px", marginTop: "0px" }}>
                                <div className="row">
                                    <div className="col-md-1" style={{ alignItems: "center", verticalAlign: "center", marginTop: "0px" }}>
                                        {_.isUndefined(event.image) ? (
                                            <Avatar variant="circle" style={{ width: "80px", height: "80px", backgroundColor:"brown" }}>
                                                <b style={{ fontSize: "40px" }}>{event.name.substring(0,1)}</b>
                                            </Avatar>
                                        ) : (
                                                <Avatar src={event.image} variant="circle" style={{ width: "80px", height: "80px" }} />
                                            )}
                                    </div>
                                    <div className="col-md-8" style={{ marginLeft: "15px" }}>
                                        <Typography variant="h5">
                                            <Link to={"event/" + event.id} style={{ color: "black" }}>
                                                <b>{event.name.toUpperCase()}</b>
                                            </Link>
                                        </Typography>
                                        <Typography variant="h6" style={{ marginBottom: "0px", paddingBottom: "0px" }}>
                                            <b>Posted By: {event.company_name.toUpperCase()}</b>
                                        </Typography>
                                        <Typography >
                                            <span class="glyphicon glyphicon-map-marker"></span> {event.location}
                                        </Typography>
                                        <Typography variant="subtitle">
                                            {moment(event.date).format("dddd, MMMM Do YYYY")} - {moment(event.time, "HH:mm:ss").format("LT")}
                                        </Typography><br />
                                        <Typography variant="subtitle" style={{ fontWeight: "600" }}>
                                            <Link to={"event/" + event.id}>
                                                View Details
                                            </Link>
                                        </Typography>
                                    </div>
                                    <div className="col-md-1" style={{ alignItems: "center", verticalAlign: "center", marginTop: "0px" }}>
                                        <Link to={"event/" + event.id}><button type="button" class="btn"
                                            style={{
                                                backgroundColor: "white",
                                                border: "1px solid green",
                                                color: "green",
                                                paddingTop: "2px",
                                                paddingBottom: "2px"
                                            }}>
                                            View Event
                                            </button></Link>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                    <div style={{ textAlign: "center" }}><br />{errorBanner}</div>
                    <TablePagination
                        rowsPerPageOptions={[10]}
                        component="div"
                        count={this.state.events.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        events: state.events,
        loading: state.loading
    };
};

function mapDispatchToProps(dispatch) {
    return {
        fetchEvents: payload => dispatch(fetchEvents(payload)),
        toggleLoading: payload => dispatch(toggleLoading())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Events);