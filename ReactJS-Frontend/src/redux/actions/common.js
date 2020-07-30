import { LOGIN_USER_SUCCESS } from "../constants/action-types";
import { LOGOUT_USER } from "../constants/action-types";
import { LOGIN_USER_FAILURE } from "../constants/action-types";
import { SIGNUP_USER_SUCCESS } from "../constants/action-types";
import { SIGNUP_USER_FAILURE } from "../constants/action-types";
import { CLOSE_SIGNUP_MODAL } from "../constants/action-types";
import { CONVERSATIONS } from "../constants/action-types";
import { CURRENT_MESSAGE, LOADING } from "../constants/action-types";
import axios from 'axios';
import bcrypt from 'bcryptjs'
const jwt_decode = require('jwt-decode');

export function toggleLoading() {
    return { type: LOADING };
}

export function loginUserSuccess(payload) {
    console.log("loginUserSuccess")
    return { type: LOGIN_USER_SUCCESS, payload };
}

export function loginUserFailure(payload) {
    console.log("loginUserFailure")
    return { type: LOGIN_USER_FAILURE, payload };
}

export const loginUser = ({ persona, email, password }) => {
    return dispatch => {
        axios
            .get(process.env.REACT_APP_BACKEND_URL + 'signin?persona=' + persona + '&email=' + email + '&password=' + password)
            .then(response => {
                var decoded = jwt_decode(response.data.token.split(' ')[1]);
                if (bcrypt.compareSync(password, decoded.password)) {
                    console.log("Login success")
                    dispatch(loginUserSuccess(response.data));
                } else {
                    dispatch(loginUserFailure(response.data));
                }
            })
            .catch(err => {
                console.log("Login failure")
                dispatch(loginUserFailure(err.message));
            });
    };
};

export function logoutUser(payload) {
    console.log("logoutUser")
    return { type: LOGOUT_USER, payload };
}

export function closeSignupModal(payload) {
    return { type: CLOSE_SIGNUP_MODAL, payload };
}

export function signUpUserSuccess(payload) {
    return { type: SIGNUP_USER_SUCCESS, payload };
}

export function signUpUserFailure(payload) {
    return { type: SIGNUP_USER_FAILURE, payload };
}

export const signUpUser = (payload) => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'signup';
        axios.defaults.withCredentials = true;
        axios.post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(signUpUserSuccess({}));
                }
            })
            .catch((error) => {
                console.log("Error during Sign Up")
                dispatch(signUpUserFailure({}));
            });
    };
};

export function fetchAllConversations(payload) {
    return { type: CONVERSATIONS, payload };
}

export const fetchConversations = (payload) => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'messages/' + sessionStorage.getItem("id");
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(fetchAllConversations(response.data));
                }
            })
            .catch((error) => {
                dispatch(fetchAllConversations([]));
            });
    };
};
export function setCurrentMessage(payload) {
    return { type: CURRENT_MESSAGE, payload };
}
export const sendMessage = ({ data, id }) => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'messages/' + id;
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.post(url, data)
            .then(response => {
                if (response.status === 200) {
                    dispatch(setCurrentMessage(""));
                    dispatch(fetchAllConversations(response.data));
                } else {
                    dispatch(setCurrentMessage(""))
                }
            })
            .catch((error) => {
                dispatch(setCurrentMessage(""));
            });
    };
};