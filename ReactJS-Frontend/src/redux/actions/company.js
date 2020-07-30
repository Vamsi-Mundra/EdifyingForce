import { FETCH_JOBS_OF_COMPANY } from "../constants/action-types";
import { TOGGLE_CREATE_JOB } from "../constants/action-types";
import { CREATE_JOB_SUCCESS } from "../constants/action-types";
import { CREATE_JOB_FAILURE } from "../constants/action-types";
import { FETCH_EVENTS_OF_COMPANY } from "../constants/action-types";
import { TOGGLE_CREATE_EVENT } from "../constants/action-types";
import { CREATE_EVENT_SUCCESS } from "../constants/action-types";
import { CREATE_EVENT_FAILURE } from "../constants/action-types";
import { FETCH_STUDENT_PROFILE } from "../constants/action-types";
import { FETCH_STUDENTS } from "../constants/action-types";
import { FETCH_PROFILE } from "../constants/action-types";
import { COMPANY_DESC_FAILED } from "../constants/action-types";
import { COMPANY_DESC_SUCCESS } from "../constants/action-types";
import { COMPANY_DESC_EDIT } from "../constants/action-types";
import { COMPANY_CONTACT_EDIT } from "../constants/action-types";
import { COMPANY_PROFILE_EDIT } from "../constants/action-types";
import { COMPANY_CONTACT_SUCCESS } from "../constants/action-types";
import { COMPANY_CONTACT_FAILED } from "../constants/action-types";
import { COMPANY_PROFILE_SUCCESS } from "../constants/action-types";
import { COMPANY_PROFILE_FAILED } from "../constants/action-types";
import { COMPANY_PROFILE, LOADING , FETCH_APPLICANTS_OF_COMPANY } from "../constants/action-types"
import _ from 'lodash';
import axios from 'axios';

export function toggleCreateJob(payload) {
    return { type: TOGGLE_CREATE_JOB, payload };
}

export function createJobSuccess() {
    return { type: CREATE_JOB_SUCCESS };
}

export function createJobFailure() {
    return { type: CREATE_JOB_FAILURE };
}

export const createJob = (payload) => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'company/' + sessionStorage.getItem("id") + '/jobs';
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.defaults.withCredentials = true;
        axios.post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(fetchJobsOfCompany());
                    dispatch(createJobSuccess());
                }
            })
            .catch((error) => {
                console.log("Error in creating Job")
                dispatch(createJobFailure());
            });
    };
};

export function saveJobData(payload) {
    console.log("saveJobData")
    return { type: FETCH_JOBS_OF_COMPANY, payload };
}

export function saveApplicantsData(payload) {
    // console.log("saveJobData")
    return { type: FETCH_APPLICANTS_OF_COMPANY, payload };
}

export const fetchJobsOfCompany = () => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'company/' + sessionStorage.getItem("id") + '/jobs';
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(saveJobData(response.data));
                } else {
                    dispatch(saveJobData([]));
                }
            })
            .catch((error) => {
                console.log("Error in fetching Job Data")
                dispatch(saveJobData([]));
            });
    };
};

export const fetchAppsOfCompany = () => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'company/' + sessionStorage.getItem("id") + '/applicants';
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(saveApplicantsData(response.data));
                } else {
                    dispatch(saveApplicantsData([]));
                }
            })
            .catch((error) => {
                console.log("Error in fetching Job Data")
                dispatch(saveJobData([]));
            });
    };
};

export function toggleCreateEvent(payload) {
    return { type: TOGGLE_CREATE_EVENT, payload };
}

export function createEventSuccess() {
    return { type: CREATE_EVENT_SUCCESS };
}

export function createEventFailure() {
    return { type: CREATE_EVENT_FAILURE };
}

export const createEvent = (payload) => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'mentor/' + sessionStorage.getItem("id") + '/events';
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(fetchEventsOfCompany());
                    dispatch(createEventSuccess());
                }
            })
            .catch((error) => {
                console.log("Error in creating Event")
                dispatch(createEventFailure());
            });
    };
};

export function saveEventData(payload) {
    return { type: FETCH_EVENTS_OF_COMPANY, payload };
}

export const fetchEventsOfCompany = () => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'company/' + sessionStorage.getItem("id") + '/events';
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(saveEventData(response.data));
                } else {
                    dispatch(saveEventData([]));
                }
            })
            .catch((error) => {
                console.log("Error in fetching Event Data")
                dispatch(saveEventData([]));
            });
    };
};

export const updateApplicationStatus = ({ status, mentorId, applicationId }) => {
    return dispatch => {
        let payload = {
            "status": status,
            "mentorId": mentorId
        }
        console.log("inside")
        let url = process.env.REACT_APP_BACKEND_URL + 'applications/' + applicationId;
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.put(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(fetchJobsOfCompany());
                }
            })
            .catch((error) => {
                console.log("Error in fetching applications")
            });
    };
};

export function storeStudentsData(payload) {
    return { type: FETCH_STUDENTS, payload };
}

export const fetchAllStudents = (payload) => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'students';
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(storeStudentsData(response.data));
                } else {
                    dispatch(storeStudentsData([]));
                }
            })
            .catch((error) => {
                console.log("Error in fetching students data")
                dispatch(storeStudentsData([]));
            });
    };
};
export function storeStudentProfile(payload) {
    return { type: FETCH_STUDENT_PROFILE, payload };
}

export const fetchStudentProfile = ({ id }) => {
    return dispatch => {
        let url = `${process.env.REACT_APP_BACKEND_URL}student/${id}/profile`
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(storeStudentProfile(response.data));
                } else {
                    dispatch(storeStudentProfile({}));
                }
            })
            .catch((error) => {
                console.log("Error in fetching students data")
                dispatch(storeStudentProfile({}));
            });
    };
};

export function storeCompanyProfile(payload) {
    return { type: FETCH_PROFILE, payload };
}

export const fetchCompanyProfile = () => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'company?id=' + sessionStorage.getItem("id")
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(storeCompanyProfile(response.data));
                } else {
                    dispatch(storeCompanyProfile({}));
                }
            })
            .catch((error) => {
                console.log("Error in fetching company data")
                dispatch(storeCompanyProfile({}));
            });
    };
}
export const toggleCompanyContactEdit = () => {
    return { type: COMPANY_CONTACT_EDIT };
}
export const companyContactUpdateSuccess = (payload) => {
    return { type: COMPANY_CONTACT_SUCCESS, payload };
}
export const companyContactUpdateFailure = (payload) => {
    return { type: COMPANY_CONTACT_FAILED, payload };
}
export const toggleCompanyProfileEdit = () => {
    return { type: COMPANY_PROFILE_EDIT };
}
export const companyProfileUpdateSuccess = (payload) => {
    return { type: COMPANY_PROFILE_SUCCESS, payload };
}
export const companyProfileUpdateFailure = (payload) => {
    return { type: COMPANY_PROFILE_FAILED, payload };
}
export const enableCompanyDescriptionEdit = () => {
    return { type: COMPANY_DESC_EDIT };
}
export const companyDescriptionUpdateSuccess = (payload) => {
    return { type: COMPANY_DESC_SUCCESS, payload };
}
export const companyDescriptionUpdateFailure = (payload) => {
    return { type: COMPANY_DESC_FAILED, payload };
}
export const companyProfile = (payload) => {
    return { type: COMPANY_PROFILE, payload };
}
export const updateCompany = (payload) => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'company/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.put(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(fetchCompanyProfile());
                    if (!_.isUndefined(payload.description)) {
                        dispatch(companyDescriptionUpdateSuccess());
                    }
                    if (!_.isUndefined(payload.contact_name)) {
                        dispatch(companyContactUpdateSuccess());
                    }
                    if (!_.isUndefined(payload.name)) {
                        dispatch(companyProfileUpdateSuccess());
                    }
                }
            })
            .catch((error) => {
                dispatch(fetchCompanyProfile());
                if (!_.isUndefined(payload.description)) {
                    dispatch(companyDescriptionUpdateFailure());
                }
                if (!_.isUndefined(payload.contact_name)) {
                    dispatch(companyContactUpdateFailure());
                }
                if (!_.isUndefined(payload.name)) {
                    dispatch(companyProfileUpdateFailure());
                }
            });
    };
};

export const uploadProfilePicture = ({ formData, config }) => {
    return dispatch => {
        dispatch({ type: LOADING })
        const url = process.env.REACT_APP_BACKEND_URL + 'company/' + sessionStorage.getItem("id") + "/image"
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.post(url, formData, config)
            .then(response => {
                if (response.status === 200) {
                    dispatch({ type: LOADING })
                    dispatch(fetchCompanyProfile());
                } else {
                    dispatch({ type: LOADING })
                    dispatch(fetchCompanyProfile());
                }
            })
            .catch((error) => {
                dispatch({ type: LOADING })
                dispatch(fetchCompanyProfile());
            });
    };
}