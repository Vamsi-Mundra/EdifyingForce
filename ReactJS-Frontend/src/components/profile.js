import React, { Component } from 'react';
import '../App.css';
import _ from "lodash";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography'
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PhoneIcon from '@material-ui/icons/Phone';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Loading from './loading';
import { connect } from "react-redux";
import {
    fetchCompanyProfile, updateCompany,
    enableCompanyDescriptionEdit, toggleCompanyContactEdit,
    toggleCompanyProfileEdit, companyProfile, uploadProfilePicture
} from "../redux/actions/company"

class CompanyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company: {},
            name: "",
            mentorName : "",
            location: "",
            description: "",
            contact_num: "",
            contact_name: "",
            contact_email: "",
            img: "",
            imageUploadModal: false,
            file: null
        }
        this.descriptionSaveHandler = this.descriptionSaveHandler.bind(this)
        this.contactSaveHandler = this.contactSaveHandler.bind(this)
        this.profileSaveHandler = this.profileSaveHandler.bind(this)
        this.enableApplyModal = this.enableApplyModal.bind(this)
        this.closeImageModal = this.closeImageModal.bind(this)
        this.uploadProfilePicture = this.uploadProfilePicture.bind(this)
        this.onChange = this.onChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.props.fetchCompanyProfile();
        this.props.companyProfile();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            company: nextProps.profile,
            name: nextProps.profile.name,
            mentorName: nextProps.mentorName,
            location: nextProps.profile.location,
            description: _.isUndefined(nextProps.profile.description) ? "" : nextProps.profile.description,
            contact_num: _.isUndefined(nextProps.profile.contact_num) ? "" : nextProps.profile.contact_num,
            contact_name: _.isUndefined(nextProps.profile.contact_name) ? "" : nextProps.profile.contact_name,
            contact_email: _.isUndefined(nextProps.profile.contact_email) ? "" : nextProps.profile.contact_email,
        })
    }

    uploadProfilePicture = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        this.props.uploadProfilePicture({formData, config})
        this.setState({
            imageUploadModal: false,
            file: null
        })
    }

    closeImageModal = () => {
        this.setState({
            imageUploadModal: false
        })
    }

    enableApplyModal = () => {
        this.setState({
            imageUploadModal: !this.state.imageUploadModal
        })
    }

    onChange(e) {
        this.setState({ file: e.target.files[0] });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    contactSaveHandler = (event) => {
        const data = {
            contact_name: this.state.contact_name,
            contact_num: this.state.contact_num,
            contact_email: this.state.contact_email
        }
        this.props.updateCompany(data)
    }

    profileSaveHandler = (e) => {
        e.preventDefault();
        const data = {
            name: this.state.name,
            location: this.state.location
        }
        this.props.updateCompany(data)
    }

    descriptionSaveHandler = (event) => {
        this.props.updateCompany({ description: this.state.description })
    }

    render() {
        let descriptionSave = null;
        if (this.props.enableDescriptionSave) {
            descriptionSave = (
                <button type="button" style={{ backgroundColor: "#0d7f02" }} class="btn btn-success" onClick={this.descriptionSaveHandler}>Save</button>
            )
        } else descriptionSave = null

        let contactSave = null;
        if (this.props.enableCompanyContactEdit) {
            contactSave = (
                <div>
                    <div class="col-md-12" style={{ marginBottom: "10px" }}>
                        <label for="contactEmail">Contact Email</label>
                        <input onChange={this.handleChange} value={this.state.contact_email} type="email" class="form-control" id="contactEmail" name="contact_email" aria-describedby="emailHelp" placeholder="Enter Contact Email"></input>
                    </div>
                    <div class="col-md-12" style={{ marginBottom: "10px" }}>
                        <label for="contactNumber">Contact Number</label>
                        <input onChange={this.handleChange} value={this.state.contact_num} name="contact_num" type="mobile" class="form-control" id="contactNumber" aria-describedby="emailHelp" placeholder="Enter Contact Number"></input>
                    </div>
                    {/* <div class="col-md-12" style={{ marginBottom: "10px" }}>
                        <label for="contactName">Contact Name</label>
                        <input onChange={this.handleChange} value={this.state.contact_name} name="contact_name" type="text" readonly class="form-control" id="contactName" aria-describedby="contactName" placeholder="Enter Contact Name"></input>
                    </div> */}
                    <div class="col-md-12" style={{ textAlign: "-webkit-right", paddingRight: "15px" }}>
                        <button type="button" onClick={this.props.toggleCompanyContactEdit} style={{ backgroundColor: "rgba(0,0,0,.06)", color: "black", marginRight: "5px" }} class="btn btn-secondary" >Cancel</button>
                        <button type="button" style={{ backgroundColor: "#0d7f02" }} class="btn btn-success" onClick={this.contactSaveHandler}>Save</button>
                    </div>
                </div>
            )
        } else {
            contactSave = (
                <div>
                    <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><MailOutlineIcon style={{ fontSize: 25 }} color="primary" /></div>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                            &nbsp;&nbsp;{this.state.contact_email === "" ? "NA" : this.state.contact_email}
                        </Typography>
                        </div>
                    </div>
                    <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><PhoneIcon style={{ fontSize: 25 }} color="primary" /></div>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                            &nbsp;&nbsp;{this.state.contact_num === "" ? "NA" : this.state.contact_num}
                        </Typography>
                        </div>
                    </div>
                    {/* <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><AssignmentIndIcon style={{ fontSize: 25 }} color="primary" /></div>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                            &nbsp;&nbsp;{this.state.contact_name === "" ? "NA" : this.state.contact_name}
                        </Typography>
                        </div>
                    </div> */}
                </div>
            )
        }

        let profileSave = null;
        if (!this.props.enableCompanyProfileEdit) {
            profileSave = (
                <CardContent style={{ textAlign: "-webkit-right" }} >
                    <EditIcon className="editicon" color="primary" onClick={this.props.toggleCompanyProfileEdit} style={{ textAlign: "-webkit-right", cursor: "pointer" }} />
                    <div style={{ textAlign: "-webkit-center" }}>
                        {_.isUndefined(this.state.company.image) ? (
                            <Avatar className="changePhoto" title="Upload Profile Picture" onClick={this.enableApplyModal} variant="circle" style={{ cursor: "pointer", width: "110px", height: "110px", margin: "15px", backgroundColor: "brown" }}>
                                <h1>{this.state.company.mentorName && this.state.company.mentorName.substr(0,1)}</h1>
                            </Avatar>
                        ) : (
                                <Avatar className="changePhoto" title="Change Profile Picture" onClick={this.enableApplyModal} variant="circle" src={this.state.company.image} style={{ cursor: "pointer", width: "110px", height: "110px", margin: "15px", border: "0.5px solid" }} />
                            )}
                    </div>
                    <div style={{ textAlign: "-webkit-center" }}>
                        <h3>{this.state.company.mentorName}</h3>
                    </div>
                    <div style={{ textAlign: "-webkit-center" }}>
                        <h3>{this.state.company.name}</h3>
                    </div>
                  
                    <div style={{ textAlign: "-webkit-center" }}>
                        <LocationOnIcon style={{ fontSize: 30, display: "inline", paddingTop: "10px" }} color="primary" /><h4 style={{ display: "inline", paddingBottom: "90px" }}>{this.state.company.location}</h4>
                    </div>
                    <div style={{ textAlign: "-webkit-center", marginTop: "10px" }}>
                        <span class="glyphicon glyphicon-envelope" aria-hidden="true"></span><h5 style={{ display: "inline", paddingBottom: "90px" }}> {this.state.company.email}</h5>
                    </div>
                </CardContent>
            )
        } else {
            profileSave = (
                <CardContent >
                    <div class="row" style={{ width: "100%", marginLeft: "0px" }}>
                        <form onSubmit={this.profileSaveHandler}>
                            <div style={{ textAlign: "-webkit-center" }}>
                                {this.state.company.image === null ? (
                                    <Avatar className="changePhoto" title="Upload Profile Picture" onClick={this.enableApplyModal} variant="circle" style={{ cursor: "pointer", width: "110px", height: "110px", margin: "15px", backgroundColor: "brown" }}>
                                        <h3>{this.state.company.name}</h3>
                                    </Avatar>
                                ) : (
                                        <Avatar className="changePhoto" title="Change Profile Picture" onClick={this.enableApplyModal} variant="circle" src={this.state.company.image} style={{ cursor: "pointer", width: "110px", height: "110px", margin: "15px", border: "0.5px solid" }} />
                                    )}
                            </div>
                            <div class="col-md-12" style={{ marginBottom: "10px" }}>
                                <label for="name">Name</label>
                                <input required onChange={this.handleChange} value={this.state.name} name="name" type="text" class="form-control" id="name" aria-describedby="name" placeholder=""></input>
                            </div>
                            <div class="col-md-12" style={{ marginBottom: "10px" }}>
                                <label for="location">Location</label>
                                <input required onChange={this.handleChange} value={this.state.location} name="location" type="text" readonly class="form-control" id="location" aria-describedby="location" placeholder=""></input>
                            </div>
                            <div class="col-md-12" style={{ textAlign: "-webkit-right", marginTop: "10px" }}>
                                <button type="button" onClick={this.props.toggleCompanyProfileEdit} style={{ backgroundColor: "rgba(0,0,0,.06)", color: "black", marginRight: "5px" }} class="btn btn-secondary" >Cancel</button>
                                <button type="submit" style={{ backgroundColor: "#0d7f02" }} class="btn btn-success" >Save</button>
                            </div>
                        </form>
                    </div>
                </CardContent>
            )
        }
        return (
            <div style={{ marginTop: "30px" }}>
                <Loading />
                <Dialog style={{ minWidth: "400px" }} open={this.state.imageUploadModal} onClose={this.closeImageModal} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title"><h4>Edit Profile Picture</h4></DialogTitle>
                    <form onSubmit={this.uploadProfilePicture}>
                        <DialogContent>
                            <h5>Attach your Photo</h5>
                            <div class="form-group">
                                <input type="file" class="form-control-file" name="image"
                                    id="exampleFormControlFile1" onChange={this.onChange} />
                            </div>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeImageModal} color="secondary">
                                Cancel
                        </Button>
                            <button type="submit" class="btn btn-success" onClick={this.uploadProfilePicture}>Save</button>
                        </DialogActions>
                    </form>
                </Dialog>
                <div className="container" style={{ width: "75%", height: "100%" }}>
                    <div class="row" style={{ width: "100%" }}>
                        <div class="col-md-4">
                            <Card>
                                {profileSave}
                            </Card>
                        </div>
                        <div class="col-md-8">
                            <Card style={{ marginBottom: "15px", paddingBottom: "15px", paddingTop: "15px" }}>
                                <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "15px" }}>About</h4>
                                <div class="row" style={{ width: "100%" }}>
                                    <div class="col-md-12" style={{ marginBottom: "10px" }}>
                                        <textarea
                                            class="form-control"
                                            id="description"
                                            name="description"
                                            rows="3"
                                            style={{ marginLeft: "15px" }}
                                            onClick={this.props.enableCompanyDescriptionEdit}
                                            onChange={this.handleChange}
                                            value={this.state.description}
                                        >
                                        </textarea>
                                    </div>
                                    <div class="col-md-12" style={{ textAlign: "-webkit-right", paddingRight: "0px" }}>
                                        {descriptionSave}
                                    </div>
                                </div>
                            </Card>
                            <Card style={{ marginBottom: "0px", paddingBottom: "10px", paddingTop: "15px" }}>
                                <div class="row">
                                    <div class="col-md-10">
                                        <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "15px" }}>Contact Info</h4>
                                    </div>
                                    <div class="col-md-2" style={{ textAlign: "-webkit-center" }}>
                                        <EditIcon className="editicon" color="primary" onClick={this.props.toggleCompanyContactEdit} style={{ textAlign: "-webkit-right", cursor: "pointer" }} />
                                    </div>
                                </div>
                                <div class="row" style={{ width: "100%", marginLeft: "0px" }}>
                                    {contactSave}
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
        profile: state.profile,
        enableDescriptionSave: state.enableDescriptionSave,
        enableCompanyContactEdit: state.enableCompanyContactEdit,
        enableCompanyProfileEdit: state.enableCompanyProfileEdit
    };
};

function mapDispatchToProps(dispatch) {
    return {
        fetchCompanyProfile: payload => dispatch(fetchCompanyProfile(payload)),
        updateCompany: payload => dispatch(updateCompany(payload)),
        enableCompanyDescriptionEdit: payload => dispatch(enableCompanyDescriptionEdit(payload)),
        toggleCompanyContactEdit: payload => dispatch(toggleCompanyContactEdit(payload)),
        toggleCompanyProfileEdit: payload => dispatch(toggleCompanyProfileEdit(payload)),
        companyProfile: payload => dispatch(companyProfile(payload)),
        uploadProfilePicture: payload => dispatch(uploadProfilePicture(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyProfile);