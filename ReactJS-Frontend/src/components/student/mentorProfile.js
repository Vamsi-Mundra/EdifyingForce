import React, { Component } from 'react';
import '../../App.css';
import _ from "lodash";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Typography from '@material-ui/core/Typography'
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PhoneIcon from '@material-ui/icons/Phone';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import { connect } from "react-redux";
import { fetchCompanyProfile } from "../../redux/actions/student";

class ViewCompanyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company: {},
            name: "",
            location: "",
            description: "",
            contact_num: "",
            contact_name: "",
            contact_email: ""
        }
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        this.props.fetchCompanyProfile(params.companyId);
    }

    componentWillReceiveProps(nextProps) { 
        this.setState({
            company: nextProps.profile,
            name: nextProps.profile.name,
            location: nextProps.profile.location,
            description: nextProps.profile.description,
            contact_num: nextProps.profile.contact_num,
            contact_name: nextProps.profile.contact_name,
            contact_email: nextProps.profile.contact_email
        })
    }

    render() {
        return (
            <div style={{ marginTop: "30px" }}>
                <div className="container" style={{ width: "75%", height: "100%" }}>
                    <div class="row" style={{ width: "100%" }}>
                        <div class="col-md-4">
                            <Card>
                                <CardContent style={{ textAlign: "-webkit-right" }} >
                                    <div style={{ textAlign: "-webkit-center" }}>
                                        {this.state.company.image === null ? (
                                            <Avatar variant="circle" style={{ paddingRight: "0px", width: "110px", height: "110px", margin: "15px", backgroundColor: "brown" }}>
                                                <h3>{this.state.company.mentorName}</h3>
                                            </Avatar>
                                        ) : (
                                                <Avatar variant="circle" src={this.state.company.image} style={{ paddingRight: "0px", width: "110px", height: "110px", margin: "15px", border: "0.5px solid" }} />
                                            )}
                                    </div>
                                    <div style={{ textAlign: "-webkit-center" }}>
                                        <h3>{this.state.company.mentorName}</h3>
                                    </div>
                                    <div style={{ textAlign: "-webkit-center" }}>
                                        <h4>{this.state.company.name}</h4>
                                    </div>
                                    <div style={{ textAlign: "-webkit-center" }}>
                                        <LocationOnIcon style={{ fontSize: 30, display: "inline", paddingTop: "10px" }} color="primary" /><h4 style={{ display: "inline", paddingBottom: "90px" }}>{this.state.company.location}</h4>
                                    </div>
                                    {/* <div style={{ textAlign: "-webkit-center", marginTop: "10px" }}>
                                        <span class="glyphicon glyphicon-envelope" aria-hidden="true"></span><h5 style={{ display: "inline", paddingBottom: "90px" }}> {this.state.company.email}</h5>
                                    </div> */}
                                </CardContent>
                            </Card>
                        </div>
                        <div class="col-md-8">
                            <Card style={{ marginBottom: "15px", paddingBottom: "15px", paddingTop: "15px" }}>
                                <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "15px" }}>About</h4>
                                <div class="row" style={{ width: "100%" }}>
                                    <div class="col-md-12" style={{ marginBottom: "10px" }}>
                                        <Typography gutterBottom variant="subtitle" style={{ marginLeft: "20px" }}>
                                            {(this.state.description === null || this.state.description === "") ? "NA" : this.state.description}
                                        </Typography>
                                    </div>
                                </div>
                            </Card>
                            <Card style={{ marginBottom: "0px", paddingBottom: "10px", paddingTop: "15px" }}>
                                <div class="row">
                                    <div class="col-md-10">
                                        <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "15px" }}>Contact Info</h4>
                                    </div>
                                </div>
                                <div class="row" style={{ width: "100%", marginLeft: "0px" }}>
                                    <div>
                                        <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                                            <div style={{ display: "inline", verticalAlign: "middle" }}><MailOutlineIcon style={{ fontSize: 25 }} color="primary" /></div>
                                            <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                                                &nbsp;&nbsp;{(this.state.contact_email === null || this.state.contact_email === "") ? "NA" : this.state.contact_email}
                                            </Typography>
                                            </div>
                                        </div>
                                        <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                                            <div style={{ display: "inline", verticalAlign: "middle" }}><PhoneIcon style={{ fontSize: 25 }} color="primary" /></div>
                                            <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                                                &nbsp;&nbsp;{(this.state.contact_num === null || this.state.contact_num === "") ? "NA" : this.state.contact_num}
                                            </Typography>
                                            </div>
                                        </div>
                                        {/* <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                                            <div style={{ display: "inline", verticalAlign: "middle" }}><AssignmentIndIcon style={{ fontSize: 25 }} color="primary" /></div>
                                            <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                                                &nbsp;&nbsp;{(this.state.contact_name === null || this.state.contact_name === "") ? "NA" : this.state.contact_name}
                                            </Typography>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div >
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        profile: state.companyProfile
    };
};

function mapDispatchToProps(dispatch) {
    return {
        fetchCompanyProfile: payload => dispatch(fetchCompanyProfile(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewCompanyProfile);