import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';
import moment from 'moment';
import uuid from 'uuid/v1'
import Loading from './loading';
import Avatar from '@material-ui/core/Avatar';
import { connect } from "react-redux";
import { fetchConversations, setCurrentMessage, sendMessage, toggleLoading } from "../redux/actions/common";

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            currentConversation: {},
            currentIndex: 0,
            id: sessionStorage.getItem("id")
        }
        this.boxRef = React.createRef()
        this.renderConversation = this.renderConversation.bind(this)
        this.changeMessageStyle = this.changeMessageStyle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (!_.isUndefined(this.props.location.student)) {
            let msg = _.filter(nextProps.messages, { 'participants': [this.props.location.student.id, this.state.id] })
            if (msg.length === 0) {
                let newConvo = {
                    "id": uuid(),
                    "participants": [this.props.location.student.id, this.state.id],
                    "conversations": [],
                    "receiver": {
                        "id": this.props.location.student.id,
                        "name": this.props.location.student.name,
                        "college": this.props.location.student.college,
                        "image": this.props.location.student.image
                    },
                    "className": "messageTileActive"
                }
                nextProps.messages.unshift(newConvo);
                this.setState({
                    currentConversation: newConvo
                })
            } else {
                let newConvo = (_.filter(nextProps.messages, { 'participants': [this.props.location.student.id, this.state.id] }))[0]
                newConvo.className = "messageTileActive"
                this.setState({
                    currentConversation: newConvo
                })
            }
        }
        let curConvo = {};
        if (!_.isEmpty(this.state.currentConversation) && !this.props.loading) {
            curConvo = (_.filter(nextProps.messages, ['id', this.state.currentConversation.id]))[0]
            curConvo.className = "messageTileActive"
            this.setState({
                currentConversation: curConvo
            })
        }
        this.setState({
            messages: nextProps.messages
        })
    }
    componentDidMount() {
        this.props.toggleLoading()
        this.scrollToBottom();
        this.props.fetchConversations();
        //this.timer = setInterval(() => this.props.fetchConversations(), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.timer)
        this.timer = null;
        this.props.setCurrentMessage("")
    }
    componentDidUpdate() {
        this.scrollToBottom();
    }
    scrollToBottom = () => {
        this.boxRef.current.scrollTop = this.boxRef.current.scrollHeight
    }

    changeMessageStyle = (index) => {
        let messages = this.state.messages
        messages.map(message => {
            message["className"] = "messageTile"
        })
        messages[index]["className"] = "messageTileActive"
        this.setState({
            messages: messages,
            currentIndex: index
        })
    }

    renderConversation = (id) => {
        this.setState({
            currentConversation: (_.filter(this.state.messages, ['id', id]))[0]
        })
    }
    handleChange = (e) => {
        this.props.setCurrentMessage(e.target.value)
    }

    sendMessage = (data) => {
        const message = {
            "id": this.state.id,
            "message": data.message,
            "timestamp": new Date().toISOString()
        }
        if (this.state.currentConversation.conversations.length > 0) this.props.sendMessage({ "data": message, "id": data.id })
        else {
            let convo = _.cloneDeep(this.state.currentConversation)
            convo.conversations.push(message)
            convo.lastUpdated = new Date().toISOString()
            delete convo["className"]
            delete convo["receiver"]
            this.props.sendMessage({ "data": convo, "id": data.id })
        }
    }

    render() {
        let errorBanner = null;
        if (this.state.messages.length === 0 && !this.props.loading) {
            errorBanner = (
                <div style={{ textAlign: "-webkit-center", padding: "10px" }}>
                    <b>No Conversation History</b>
                </div >
            )
        }
        let currentConversation = null;
        if (!_.isEmpty(this.state.currentConversation)) {
            currentConversation = (
                <div className="" style={{ padding: "0px" }}>
                    {this.state.currentConversation.conversations.map(message => {
                        if (message.id === sessionStorage.getItem("id")) {
                            return (
                                <div className="row senderMessage" style={{ paddingRight: "10px" }}>
                                    <span className="sender">{message.message}</span>
                                </div>
                            )
                        }
                        return (
                            <div className="row receiverMessage" style={{ marginLeft: "0px" }}>
                                <div className="col-md-1" style={{ padding: "0px", margin: "0px", width: "30px" }}>
                                    {_.isUndefined(this.state.currentConversation.receiver.image) ? (
                                        <Avatar variant="circle" style={{ width: "30px", height: "30px", margin: "0px", backgroundColor: "orange" }}>
                                            <b style={{ fontSize: "14px" }}>
                                                {this.state.currentConversation.receiver.name.substring(0, 1)}
                                            </b>
                                        </Avatar>
                                    ) : (
                                            <Avatar src={this.state.currentConversation.receiver.image} variant="circle" style={{ width: "30px", height: "30px", margin: "0px" }} />
                                        )}
                                </div>
                                <div className="col-md-10" style={{ padding: "0px", margin: "0px", paddingTop: "4px" }}>
                                    <span className="receiver" style={{ display: "inline" }}>{message.message}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        } else {
            currentConversation = (
                <b></b>
            )
        }
        let presentConvo = null;
        if (_.isEmpty(this.state.currentConversation)) {
            presentConvo = (
                <div className="col-md-8" ref={this.boxRef} style={{ height: "460px", backgroundColor: "#fff", boxShadow: "0 1px 1px rgba(0,0,0,0.3)" }}>
                    <div style={{ textAlign: "center", padding: "30px", fontWeight: "700", color: "rgba(0,0,0,.56)" }}>
                        No conversation selected.
                    </div>
                </div>)
        } else {
            presentConvo = (
                <div className="col-md-8" style={{ paddingLeft: "3px", alignContent: "center", height: "100%", overflowX: "none", overflowY: "none" }}>
                    <Card style={{ padding: "5px", marginBottom: "3px", zIndex: "1000", width: "100%", borderRadius: "0px" }}>
                        <p style={{ padding: "0px", margin: "0px", fontSize: "17px", fontWeight: "700", textAlign: "center" }}>
                            {!_.isUndefined(this.state.currentConversation.receiver) ? this.state.currentConversation.receiver.name : ""}
                        </p>
                        <p style={{ padding: "0px", margin: "0px", fontSize: "12px", fontWeight: "500", textAlign: "center" }}>
                            {!_.isUndefined(this.state.currentConversation.receiver.college) ? this.state.currentConversation.receiver.college : this.state.currentConversation.receiver.location}
                        </p>
                    </Card>
                    <Card ref={this.boxRef} style={{ height: "330px", padding: "10px", marginBottom: "1px", overflowY: "scroll", borderRadius: "0px" }}>
                        {currentConversation}
                    </Card >
                    <Card style={{ padding: "10px", zIndex: "1000", width: "100%", borderRadius: "0px" }}>
                        <div className="col-md-10" style={{ padding: "0px" }}>
                            <textarea
                                class="form-control"
                                id="message"
                                name="message"
                                rows="2"
                                placeholder="Type a message..."
                                value={this.props.currentMessage}
                                onChange={this.handleChange}
                            >
                            </textarea>
                        </div>
                        <div className="col-md-2" style={{ padding: "0px", marginLeft: "0px", padding: "10px" }}>
                            <button
                                type="button"
                                disabled={this.props.currentMessage.length === 0}
                                onClick={() => this.sendMessage(
                                    {
                                        "message": this.props.currentMessage,
                                        "id": this.state.currentConversation.id
                                    }
                                )}
                                class="btn btn-primary">
                                Send
                                    </button>
                        </div>
                    </Card >
                </div>
            )
        }
        return (
            <div className="row" style={{ width: "90%", height: "100%" }}><br />
                <Loading />
                <div style={{ paddingLeft: "150px" }}>
                    <div className="col-md-4" style={{ height: "460px", padding: "0px", backgroundColor: "#fff", boxShadow: "0 1px 1px rgba(0,0,0,0.3)" }}>
                        <Card style={{ padding: "13px", marginBottom: "3px", zIndex: "1000", width: "100%", borderRadius: "0px" }}>
                            <p style={{ padding: "0px", margin: "0px", fontSize: "17px", fontWeight: "700", textAlign: "center" }}>Messages</p>
                        </Card >
                        <div style={{ overflowY: "scroll", height: "410px" }}>
                            {errorBanner}
                            {this.state.messages.map((conversation, index) => {
                                return (
                                    <div style={{ alignContent: "right", padding: "0px", borderRadius: "0px", border: "0px" }} onClick={() => this.renderConversation(conversation.id)} key={conversation.id} id={conversation.id}>
                                        <Card className={conversation.className} style={{ padding: "5px", marginBottom: "1px", borderRadius: "0px" }} onClick={() => this.changeMessageStyle(index)}>
                                            <div className="row">
                                                <div className="col-md-2" style={{}}>
                                                    {_.isUndefined(conversation.receiver.image) ? (
                                                        <Avatar variant="circle" style={{ width: "50px", height: "50px", margin: "10px", backgroundColor: "brown" }}>
                                                            <b style={{ fontSize: "22px" }}>
                                                                {conversation.receiver.name.substring(0, 1)}
                                                            </b>
                                                        </Avatar>
                                                    ) : (
                                                            <Avatar src={conversation.receiver.image} variant="circle" style={{ width: "50px", height: "50px", margin: "10px", backgroundColor: "" }} />
                                                        )}
                                                </div>
                                                <div className="col-md-9" style={{ marginLeft: "10px", paddingTop: "10px" }}>
                                                    <CardContent className="" style={{ paddingBottom: "5px", paddingLeft: "5px", paddingTop: "10px", marginTop: "0px" }}>
                                                        <Typography gutterBottom variant="h5" style={{ marginBottom: "2px" }}>
                                                            <b>{conversation.receiver.name}</b>
                                                            <p style={{ fontSize: "12px" }}>{conversation.conversations.length > 0 ?
                                                                ((conversation.conversations[conversation.conversations.length - 1].id === sessionStorage.getItem("id")
                                                                    ? "You: " : "") + "" + conversation.conversations[conversation.conversations.length - 1].message)
                                                                : ""}</p>
                                                        </Typography>
                                                    </CardContent>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {presentConvo}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        messages: state.messages,
        currentMessage: state.currentMessage,
        loading: state.loading
    };
};

function mapDispatchToProps(dispatch) {
    return {
        fetchConversations: payload => dispatch(fetchConversations(payload)),
        setCurrentMessage: payload => dispatch(setCurrentMessage(payload)),
        sendMessage: payload => dispatch(sendMessage(payload)),
        toggleLoading: payload => dispatch(toggleLoading(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);