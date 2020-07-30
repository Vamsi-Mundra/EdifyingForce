import React, { Component } from 'react';
import LoadingScreen from 'react-loading-screen';
import { connect } from "react-redux";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../App.css'

class Loading extends Component {
    // return <LoadingScreen
    //     loading={this.props.loading}
    //     bgColor='#f1f1f1'
    //     spinnerColor='#9ee5f8'
    //     textColor='#676767'
    //     text='Loading...'
    // />
    render() {
        return (
            <Backdrop open={this.props.loading} style={{ zIndex: "10000" }}>
                <CircularProgress />
            </Backdrop>
        )
    }
}

const mapStateToProps = state => {
    return {
        loading: state.loading
    };
};

export default connect(mapStateToProps, null)(Loading);