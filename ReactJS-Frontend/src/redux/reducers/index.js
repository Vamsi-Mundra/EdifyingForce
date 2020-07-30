import {
    LOGIN_USER_SUCCESS, LOGOUT_USER,
    LOGIN_USER_FAILURE, FETCH_JOBS_OF_COMPANY,FETCH_APPLICANTS_OF_COMPANY,
    TOGGLE_CREATE_JOB, CREATE_JOB_FAILURE,
    CREATE_JOB_SUCCESS, FETCH_EVENTS_OF_COMPANY,
    TOGGLE_CREATE_EVENT, CREATE_EVENT_SUCCESS,
    CREATE_EVENT_FAILURE, SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAILURE, CLOSE_SIGNUP_MODAL,
    FETCH_STUDENTS, FETCH_STUDENT_PROFILE,
    FETCH_PROFILE, COMPANY_DESC_EDIT,
    COMPANY_DESC_FAILED, COMPANY_DESC_SUCCESS,
    COMPANY_PROFILE_EDIT, COMPANY_CONTACT_EDIT,
    COMPANY_CONTACT_SUCCESS, COMPANY_CONTACT_FAILED,
    COMPANY_PROFILE_SUCCESS, COMPANY_PROFILE_FAILED,
    COMPANY_PROFILE, FETCH_ALL_STUDENTS, FETCH_JOBS,
    CONVERSATIONS, CURRENT_MESSAGE, SEND_MESSAGE,
    FETCH_STUDENT_REGISTRATIONS, FETCH_STUDENT_APPLICATIONS,
    FETCH_EVENTS, FETCH_COMPANY_PROFILE, NEW_SKILL,
    TOGGLE_OBJECTIVE, TOGGLE_PERSONAL_INFO_EDIT,
    TOGGLE_PROFILE_PIC, LOADING, TOGGLE_APPLY_MODAL,
    JOB_APPLY_SUCCESS, JOB_APPLY_FAILURE
} from "../constants/action-types";
const jwt_decode = require('jwt-decode');
const _ = require('lodash');

const initialState = {
    user: {
        "name": sessionStorage.getItem("name"),
        "id": sessionStorage.getItem("id"),
        "email": sessionStorage.getItem("email"),
        "persona": sessionStorage.getItem("persona"),
        "image": sessionStorage.getItem("image"),
        "token": sessionStorage.getItem("token")
    },
    invalidCredentials: false,
    profile: {},
    jobsOfCompany: [],
    enableCreateJob: false,
    eventsOfCompany: [],
    enableCreateEvent: false,
    signUpSuccessful: false,
    signupFailedError: false,
    students: [],
    applicantsOfCompany:[],
    studentProfile: {},
    enableDescriptionSave: false,
    enableCompanyProfileEdit: false,
    enableCompanyContactEdit: false,
    studentsData: [],
    majors: [],
    jobs: [],
    events: [],
    messages: [],
    currentMessage: "",
    registrationsOfStudent: [],
    applicationsOfStudent: [],
    events: [],
    companyProfile: [],
    newSkill: "",
    careerObjective: "",
    enableProfileSave: false,
    enableObjectiveSave: false,
    imageUploadModal: false,
    loading: false,
    isApplyDialogOpen: false
};

function rootReducer(state = initialState, action) {
    if (action.type === LOADING) {
        return Object.assign({}, state, {
            loading: true
        });
    }
    if (action.type === LOGIN_USER_SUCCESS) {
        var decoded = jwt_decode(action.payload.token.split(' ')[1]);
        sessionStorage.setItem("persona", decoded.persona);
        sessionStorage.setItem("email", decoded.email);
        sessionStorage.setItem("id", decoded.id);
        sessionStorage.setItem("name", decoded.name);
        sessionStorage.setItem("image", decoded.image);
        sessionStorage.setItem("token", action.payload.token);
        delete action.payload['password'];
        return Object.assign({}, state, {
            user: action.payload,
            invalidCredentials: false
        });
    }
    if (action.type === LOGIN_USER_FAILURE) {
        return Object.assign({}, state, {
            user: {},
            invalidCredentials: true
        });
    }
    if (action.type === LOGOUT_USER) {
        sessionStorage.removeItem("persona");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("id");
        sessionStorage.removeItem("token");
        return Object.assign({}, state, {
            user: {
                "name": "",
                "id": "",
                "email": "",
                "persona": "",
                "token": ""
            },
            invalidCredentials: false,
            profile: {},
            jobsOfCompany: [],
            enableCreateJob: false,
            eventsOfCompany: [],
            enableCreateEvent: false,
            signUpSuccessful: false,
            signupFailedError: false,
            students: [],
            studentProfile: {},
            enableDescriptionSave: false,
            enableCompanyProfileEdit: false,
            enableCompanyContactEdit: false,
            studentsData: [],
            majors: [],
            jobs: [],
            events: [],
            messages: [],
            currentMessage: "",
            registrationsOfStudent: [],
            applicationsOfStudent: [],
            events: [],
            companyProfile: [],
            newSkill: "",
            careerObjective: "",
            enableProfileSave: false,
            enableObjectiveSave: false,
            imageUploadModal: false,
            loading: false,
            isApplyDialogOpen: false
        });
    }
    if (action.type === SIGNUP_USER_SUCCESS) {
        delete action.payload['password'];
        return Object.assign({}, state, {
            signUpSuccessful: true,
            signupFailedError: false
        });
    }
    if (action.type === CLOSE_SIGNUP_MODAL) {
        return Object.assign({}, state, {
            signUpSuccessful: false
        });
    }
    if (action.type === SIGNUP_USER_FAILURE) {
        return Object.assign({}, state, {
            signUpSuccessful: false,
            signupFailedError: true
        });
    }
    if (action.type === FETCH_JOBS_OF_COMPANY) {
        return Object.assign({}, state, {
            jobsOfCompany: action.payload
        });
    }
    if (action.type === FETCH_APPLICANTS_OF_COMPANY) {
        return Object.assign({}, state, {
            applicantsOfCompany: action.payload?action.payload[0].applications:[]
        });
    }
    
    if (action.type === TOGGLE_CREATE_JOB) {
        return Object.assign({}, state, {
            enableCreateJob: !state.enableCreateJob
        });
    }
    if (action.type === CREATE_JOB_SUCCESS) {
        return Object.assign({}, state, {
            enableCreateJob: false
        });
    }
    if (action.type === CREATE_JOB_FAILURE) {
        return Object.assign({}, state, {
            enableCreateJob: true
        });
    }
    if (action.type === FETCH_EVENTS_OF_COMPANY) {
        return Object.assign({}, state, {
            eventsOfCompany: action.payload
        });
    }
    if (action.type === TOGGLE_CREATE_EVENT) {
        return Object.assign({}, state, {
            enableCreateEvent: !state.enableCreateEvent
        });
    }
    if (action.type === CREATE_EVENT_SUCCESS) {
        return Object.assign({}, state, {
            enableCreateEvent: false
        });
    }
    if (action.type === CREATE_EVENT_FAILURE) {
        return Object.assign({}, state, {
            enableCreateEvent: true
        });
    }
    if (action.type === FETCH_STUDENTS) {
        return Object.assign({}, state, {
            students: action.payload
        });
    }
    if (action.type === FETCH_STUDENT_PROFILE) {
        return Object.assign({}, state, {
            studentProfile: action.payload
        });
    }
    if (action.type === FETCH_PROFILE) {
        sessionStorage.setItem("image", action.payload.image);
        return Object.assign({}, state, {
            profile: action.payload,
            loading: false
        });
    }
    if (action.type === COMPANY_DESC_EDIT) {
        return Object.assign({}, state, {
            enableDescriptionSave: true
        });
    }
    if (action.type === COMPANY_DESC_SUCCESS) {
        return Object.assign({}, state, {
            enableDescriptionSave: false
        });
    }
    if (action.type === COMPANY_DESC_FAILED) {
        return Object.assign({}, state, {
            enableDescriptionSave: true
        });
    }
    if (action.type === COMPANY_PROFILE_EDIT) {
        return Object.assign({}, state, {
            enableCompanyProfileEdit: !state.enableCompanyProfileEdit
        });
    }
    if (action.type === COMPANY_PROFILE_SUCCESS) {
        return Object.assign({}, state, {
            enableCompanyProfileEdit: false
        });
    }
    if (action.type === COMPANY_PROFILE_FAILED) {
        return Object.assign({}, state, {
            enableCompanyProfileEdit: true
        });
    }
    if (action.type === COMPANY_CONTACT_EDIT) {
        return Object.assign({}, state, {
            enableCompanyContactEdit: !state.enableCompanyContactEdit
        });
    }
    if (action.type === COMPANY_CONTACT_SUCCESS) {
        return Object.assign({}, state, {
            enableCompanyContactEdit: false
        });
    }
    if (action.type === COMPANY_CONTACT_FAILED) {
        return Object.assign({}, state, {
            enableCompanyContactEdit: true
        });
    }
    if (action.type === COMPANY_PROFILE) {
        return Object.assign({}, state, {
            enableCompanyContactEdit: false,
            enableCompanyProfileEdit: false,
            enableDescriptionSave: false
        });
    }
    if (action.type === FETCH_ALL_STUDENTS) {
        let filters = []
        action.payload.map(student => {
            student.education.map((education, index) => {
                if (index === 0) filters.push(education.major)
            })
        })
        return Object.assign({}, state, {
            studentsData: action.payload,
            majors: _.uniq(filters),
            loading: false
        });
    }
    if (action.type === FETCH_JOBS) {
        return Object.assign({}, state, {
            jobs: action.payload,
            loading: false
        });
    }
    if (action.type === CONVERSATIONS) {
        return Object.assign({}, state, {
            messages: action.payload,
            loading: false
        });
    }
    if (action.type === CURRENT_MESSAGE) {
        return Object.assign({}, state, {
            currentMessage: action.payload
        });
    }
    if (action.type === SEND_MESSAGE) {
        return Object.assign({}, state, {
            currentMessage: action.payload
        });
    }
    if (action.type === FETCH_STUDENT_REGISTRATIONS) {
        return Object.assign({}, state, {
            registrationsOfStudent: action.payload,
            loading: false
        });
    }
    if (action.type === FETCH_STUDENT_APPLICATIONS) {
        return Object.assign({}, state, {
            applicationsOfStudent: action.payload,
            loading: false
        });
    }
    if (action.type === FETCH_EVENTS) {
        return Object.assign({}, state, {
            events: action.payload,
            loading: false
        });
    }
    if (action.type === FETCH_COMPANY_PROFILE) {
        return Object.assign({}, state, {
            companyProfile: action.payload
        });
    }
    if (action.type === NEW_SKILL) {
        return Object.assign({}, state, {
            newSkill: action.payload
        });
    }
    if (action.type === TOGGLE_PERSONAL_INFO_EDIT) {
        return Object.assign({}, state, {
            enableProfileSave: action.payload
        });
    }
    if (action.type === TOGGLE_OBJECTIVE) {
        return Object.assign({}, state, {
            enableObjectiveSave: action.payload
        });
    }
    if (action.type === TOGGLE_PROFILE_PIC) {
        return Object.assign({}, state, {
            imageUploadModal: action.payload
        });
    }
    if (action.type === TOGGLE_APPLY_MODAL) {
        return Object.assign({}, state, {
            isApplyDialogOpen: action.payload
        });
    }
    if (action.type === JOB_APPLY_SUCCESS) {
        return Object.assign({}, state, {
            isApplyDialogOpen: false
        });
    }
    if (action.type === JOB_APPLY_FAILURE) {
        return Object.assign({}, state, {
            isApplyDialogOpen: true
        });
    }
    return state;
}

export default rootReducer;