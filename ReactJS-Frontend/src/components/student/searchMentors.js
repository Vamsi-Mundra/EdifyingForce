import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import StudentNavBar from "./candidateNavBar"
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TablePagination from '@material-ui/core/TablePagination';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Loading from '../loading';
import { connect } from "react-redux";
import { fetchJobs, enableApplyModal, applyForAJob } from "../../redux/actions/student"
import { toggleLoading } from "../../redux/actions/common"

const uuid = require('shortid');

class Jobs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            jobsFilter: [],
            currentJob: {},
            title: "",
            location: "",
            file: null,
            category: [],
            currentIndex: 0,
            page: 0,
            rowsPerPage: 10,
            sortOrder: "relevance",
            buttonColor: ["unclickedFilter", "unclickedFilter", "unclickedFilter", "unclickedFilter"]
        }
        this.renderJob = this.renderJob.bind(this)
        this.filterJobs = this.filterJobs.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleCategoryChange = this.handleCategoryChange.bind(this)
        this.changeButtonColor = this.changeButtonColor.bind(this)
        this.applyForJob = this.applyForJob.bind(this)
        this.onChange = this.onChange.bind(this);
        this.changeJobStyle = this.changeJobStyle.bind(this)
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.sortJobs = this.sortJobs.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            jobs: nextProps.jobs,
            jobsFilter: nextProps.jobs,
            currentJob: this.state.currentIndex === 0 ? nextProps.jobs[0] : nextProps.jobs[this.state.currentIndex]
        }, () => { this.filterJobs(); this.sortJobs(this.state.sortOrder); })
    }
    componentDidMount() {
        this.props.fetchJobs()
        this.props.toggleLoading()
    }

    handleChangePage = (event, newPage) => {
        let currentJob = this.state.jobs[newPage * this.state.rowsPerPage]
        this.setState({
            page: newPage,
            currentJob: currentJob,
            currentIndex: newPage * this.state.rowsPerPage
        }, () => { this.changeJobStyle(currentJob.id) })
    };

    handleChangeRowsPerPage = event => {
        this.setState({
            rowsPerPage: event.target.value,
            page: 0
        })
    };
    changeJobStyle = (id) => {
        let index = _.findIndex(this.state.jobs, { id });
        let jobData = this.state.jobs
        jobData.map(job => {
            job["className"] = "jobTile"
        })
        jobData[index]["className"] = "jobTileActive"
        this.setState({
            jobs: jobData,
            currentIndex: index
        })
    }

    renderJob = (id) => {
        this.setState({
            currentJob: (_.filter(this.state.jobs, { id }))[0]
        })
    }

    onChange(e) {
        this.setState({ file: e.target.files[0] });
    }

    applyForJob = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('resume', this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        let url = process.env.REACT_APP_BACKEND_URL + 'company/' + this.state.currentJob.id +
            '/job/' + this.state.currentJob.id + '/student/' + sessionStorage.getItem("id") + '/apply?id=' + uuid.generate()
        this.props.applyForAJob({ url, formData, config })
        let curJob = this.state.currentJob;
        this.setState({
            currentJob: curJob
        }, () => { this.changeJobStyle(curJob.id) })
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value },
            () => {
                this.filterJobs()
            });
    }

    changeButtonColor = (index) => {
        let btnColors = this.state.buttonColor
        if (btnColors[index] === "unclickedFilter") btnColors[index] = "clickedFilter"
        else btnColors[index] = "unclickedFilter"
        this.setState({
            buttonColor: btnColors
        })
    }

    handleCategoryChange = (category, colorIndex) => {
        let categoryFilter = this.state.category;
        let index = categoryFilter.indexOf(category)
        if (index === -1) categoryFilter.push(category)
        else categoryFilter.splice(index, 1)
        this.setState({
            category: categoryFilter
        }, () => {
            this.filterJobs()
            this.changeButtonColor(colorIndex)
        })
    }

    filterCategory = (category) => {
        if (_.isEmpty(this.state.category)) return true
        return this.state.category.indexOf(category) > -1
    }

    filterJobs = () => {
        let newJobs = []
        this.state.jobsFilter.map((job, index) => {
            job.className = "jobTile"
            if ((job.mentorName.toLowerCase().includes(this.state.title.toLowerCase()) ||
                job.name.toLowerCase().includes(this.state.title.toLowerCase())) &&
                job.location.toLowerCase().includes(this.state.location.toLowerCase()) &&
                this.filterCategory(job.category)
            ) {
                newJobs.push(job)
            }
        })
        const currentIndex = newJobs.length > this.state.currentIndex ? this.state.currentIndex : 0;
        if (newJobs.length > 0) newJobs[currentIndex]["className"] = "jobTileActive"
        this.setState({
            jobs: newJobs,
            currentJob: newJobs[currentIndex]
        })
    }

    sortJobs = (event) => {
        const sort = typeof (event) === "string" ? event : event.target.value
        this.setState({ sortOrder: sort })
        let newJobs = this.state.jobsFilter;
        if (sort === "relevance") {
            this.setState({
                jobsFilter: this.props.jobs
            }, () => { this.filterJobs() })
        } else {
            const sortFactor = sort.split("-")
            newJobs = _.orderBy(newJobs, [sortFactor[0]], [sortFactor.length > 1 ? sortFactor[1] : 'asc'])
            this.setState({
                jobsFilter: newJobs
            }, () => { this.filterJobs() })
        }
    }

    render() {
        let errorBanner = null;
        if (this.state.jobs.length === 0 && !this.props.loading) {
            errorBanner = (
                <div style={{ textAlign: "center" }}><br />
                    <Card style={{ padding: "0px", margin: "7px" }}>
                        <CardContent style={{ padding: "5px" }}>
                            <b>No Jobs Found</b>
                        </CardContent >
                    </Card >
                </div>
            )
        }
        let applyModal = null;
        if (!_.isEmpty(this.state.currentJob)) {
            applyModal = (
                <Dialog style={{ minWidth: "400px" }} open={this.props.isApplyDialogOpen} onClose={() => this.props.enableApplyModal(false)} aria-labelledby="form-dialog-title">
                    <DialogTitle style={{ paddingBottom: "5px" }} id="form-dialog-title"><h4>Request Mentorship {this.state.currentJob.company_name}</h4></DialogTitle>
                    <form onSubmit={this.applyForJob}>
                        <DialogContent style={{ paddingTop: "0px" }}>
                            <h4>Details from {this.state.currentJob.mentorName}:</h4>
                            Applying for a Mentorship Program with {this.state.currentJob.mentorName} requires a few documents. Attach them below
                            and request for a mentorship!
                        
                            <form>
                            <br /><h5>1. Attach your Resume</h5>
                                <div class="form-group">
                                    <input type="file" accept=".pdf" class="form-control-file"
                                        name="resume" id="exampleFormControlFile1" onChange={this.onChange} />
                                    
                                </div>
                                <h5>2. Describe in a few words why you would need the Mentorship</h5>
                                <div class="form-group">
                                    <textarea rows="5" cols="70"/>
                                </div>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => this.props.enableApplyModal(false)} color="secondary">
                                Cancel
                        </Button>
                            <button type="submit" class="btn btn-success">Submit Application</button>
                        </DialogActions>
                    </form>
                </Dialog>
            )
        } else {
            applyModal = (<b></b>)
        }

        let currentJob = null;
        if (!_.isEmpty(this.state.currentJob)) {
            currentJob = (
                <div class="container">
                    <div class="row" style={{ paddingLeft: "20px" }}>
                        <div class="col-md-8"><h2>
                        <Link to={'/company/' + this.state.currentJob.id + '/profile'} style={{ color: "black" }}><h2 style={{ marginTop: "0px" }}>{this.state.currentJob.mentorName}</h2></Link></h2></div>
                    </div>
                    <div class="row" style={{ paddingLeft: "14px", margin:"0px" }}>
                        
                    </div>
                    {/* <div class="row" style={{ paddingLeft: "20px" }}>
                        <div class="col-md-9"><Link to={'/company/' + this.state.currentJob.company_id + '/profile'} style={{ color: "black" }}><h4 style={{ marginTop: "0px" }}>{this.state.currentJob.company_name}</h4></Link></div>
                    </div> */}
                    <div class="row" style={{ paddingLeft: "20px" }}>
                        <Typography color="textSecondary" variant="h6" style={{ display: "inline", marginLeft: "15px", marginRight: "25px" }}><span class="glyphicon glyphicon-briefcase"></span> {this.state.currentJob.name}</Typography>
                        <Typography color="textSecondary" variant="h6" style={{ display: "inline", marginRight: "25px" }}><span class="glyphicon glyphicon-map-marker"></span> {this.state.currentJob.location}</Typography>
                        {/* <Typography color="textSecondary" variant="h6" style={{ display: "inline", marginRight: "25px" }}><span class="glyphicon glyphicon-usd"></span> {this.state.currentJob.salary} per hour</Typography>
                        <Typography color="textSecondary" variant="h6" style={{ display: "inline" }}><span class="glyphicon glyphicon-time"></span> Posted {moment(this.state.currentJob.posting_date).format("MMMM Do")}</Typography> */}
                    </div><br />
                    <div class="row" style={{ paddingLeft: "35px" }}>
                        <div class="col-md-7" style={{ border: "1px solid", padding: "10px", borderStyle: "groove", borderRadius: "0px" }}>
                            {this.state.currentJob.applied === "" ? (
                                <div>
                                    <div class="col-md-10" style={{ paddingTop: "5px" }}>Apply for Mentorship</div>
                                    <div class="col-md-2" ><button type="button" class="btn btn-success" onClick={() => this.props.enableApplyModal(true)}>Apply</button></div>
                                </div>
                            ) : (
                                    <div>
                                        <div class="col-md-9" style={{ paddingTop: "5px" }}>Apply for Mentorship</div>
                                        <div class="col-md-3" ><button type="button" disabled class="btn btn-danger">Applied Already</button></div>
                                    </div>
                                )}
                        </div>
                    </div><br />
                    <div class="row" style={{ paddingLeft: "20px", paddingRight: "40px" }}>
                        <div class="col-md-8" style={{ paddingRight: "20px" }}>{this.state.currentJob.description}</div>
                    </div>
                </div>
            )
        } else {
            currentJob = (
                <b></b>
            )
        }
        return (
            <div>
                <Loading />
                <StudentNavBar tab="jobs" />
                {applyModal}
                <div className="container" style={{ width: "100%", height: "100%" }}><br />
                    <Grid container spacing={3}>
                        <div style={{ alignContent: "center", width: "100%", marginLeft: "20px", marginRight: "20px", marginBottom: "10px" }}>
                            <Card style={{ height: "100%" }}>
                                <div class="container" style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <input type="text" autoComplete="off" name="title" onChange={this.handleChange} class="form-control" id="search" aria-describedby="search" placeholder=" Search by Mentor Name , Company , Keywords " />
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <input type="text" autoComplete="off" name="location" onChange={this.handleChange} class="form-control" id="search" aria-describedby="search" placeholder="City, State, Zip Code, or Address" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div class="row">
                                        <div class="col-md-6">
                                            <Button variant="contained" className={this.state.buttonColor[0]} onClick={() => this.handleCategoryChange("Full-Time", 0)}>Full-Time</Button>
                                            <Button variant="contained" className={this.state.buttonColor[1]} onClick={() => this.handleCategoryChange("Part-Time", 1)}>Part-Time</Button>
                                            <Button variant="contained" className={this.state.buttonColor[2]} onClick={() => this.handleCategoryChange("Internship", 2)}>Internship</Button>
                                            <Button variant="contained" className={this.state.buttonColor[3]} onClick={() => this.handleCategoryChange("On-Campus", 3)}>On-Campus</Button>
                                        </div>
                                    </div> */}
                                </div>
                            </Card >
                        </div>

                        <div style={{ width: "35%", height: "330px", marginLeft: "20px", marginRight: "10px", overflowY: "scroll" }}>
                            <Card style={{ padding: "15px", marginBottom: "0px", zIndex: "1000", width: "100%" }}>
                                <div className="row">
                                    <div className="col-md-8">
                                        <Typography >
                                            <Typography color="textSecondary" variant="h6">Found {this.state.jobs.length} Mentors According to your Preferences</Typography>
                                        </Typography>
                                    </div>
                                    <div className="col-md-3"></div>
                                    <FormControl style={{ backgroundColor: "#f7f7f7" }}>
                                        <NativeSelect
                                            value={this.state.sort}
                                            name="sort"
                                            inputProps={{ 'aria-label': 'sort' }}
                                            onChange={this.sortJobs}
                                        >
                                            <option value="relevance">⥯ Relevance</option>
                                            <option value="location">Location</option>
                                            <option value="mentorName-asc">Name (Asc)</option>
                                            <option value="mentorName-desc">Name (Desc)</option>
                                        </NativeSelect>
                                    </FormControl></div>
                            </Card>
                            {this.state.jobs.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((job, index) => {
                                return (
                                    <div style={{ alignContent: "right", padding: "0px", borderRadius: "0px", border: "0px" }} onClick={() => this.renderJob(job.id)} key={job.id} id={job.id}>
                                        <Card className={job.className} style={{ padding: "10px", marginBottom: "0px" }} onClick={() => this.changeJobStyle(job.id)}>
                                            <div className="row">
                                                <div className="col-md-2" style={{}}>
                                                    {_.isUndefined(job.image) ? (
                                                        <Avatar variant="square" style={{ width: "50px", height: "50px", margin: "10px", backgroundColor: "orange" }}>
                                                            <b style={{ fontSize: "90" }}>{job.name}</b>
                                                        </Avatar>
                                                    ) : (
                                                            <Avatar src={job.image} variant="square" style={{ width: "50px", height: "50px", margin: "10px", backgroundColor: "orange" }} />
                                                        )}
                                                </div>
                                                <div className="col-md-6" style={{ marginLeft: "0px" }}>
                                                    <CardContent className="jobTileText" style={{ paddingBottom: "5px", paddingLeft: "5px", paddingTop: "10px", marginTop: "0px" }}>
                                                        <Typography gutterBottom variant="h5" style={{ marginBottom: "2px" }}>
                                                            <b>{job.mentorName}</b>
                                                        </Typography>
                                                        <Typography variant="h6">
                                                            {job.name} - {job.location}
                                                        </Typography>
                                                    </CardContent>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })}
                            {errorBanner}
                            <TablePagination
                                rowsPerPageOptions={[10]}
                                component="div"
                                count={this.state.jobs.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />
                        </div>
                        <div style={{ alignContent: "center", height: "330px", width: "61%", marginRight: "20px", overflowX: "none", overflowY: "none" }}>
                            <Card style={{ height: "100%", overflowY: "scroll" }}>
                                {currentJob}
                            </Card >
                        </div>
                    </Grid>
                </div ></div >
        )
    }
}

const mapStateToProps = state => {
    return {
        jobs: state.jobs,
        loading: state.loading,
        isApplyDialogOpen: state.isApplyDialogOpen
    };
};

function mapDispatchToProps(dispatch) {
    return {
        fetchJobs: payload => dispatch(fetchJobs(payload)),
        toggleLoading: payload => dispatch(toggleLoading()),
        enableApplyModal: payload => dispatch(enableApplyModal(payload)),
        applyForAJob: payload => dispatch(applyForAJob(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Jobs);