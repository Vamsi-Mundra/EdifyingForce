import { FETCH_ALL_STUDENTS } from "../constants/action-types";
import { FETCH_JOBS } from "../constants/action-types";
import { FETCH_EVENTS } from "../constants/action-types";
import {
    FETCH_STUDENT_REGISTRATIONS,
    FETCH_STUDENT_APPLICATIONS, FETCH_PROFILE,
    FETCH_COMPANY_PROFILE, NEW_SKILL,
    TOGGLE_PERSONAL_INFO_EDIT, TOGGLE_OBJECTIVE,
    TOGGLE_PROFILE_PIC, TOGGLE_APPLY_MODAL,
    APPLY_FOR_JOB, LOADING, JOB_APPLY_SUCCESS, JOB_APPLY_FAILURE
} from '../constants/action-types';

import _ from 'lodash';
import axios from 'axios';

export function storeStudentsData(payload) {
    return { type: FETCH_ALL_STUDENTS, payload };
}

export const fetchAllStudents = () => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'student/profiles?id=' + sessionStorage.getItem("id");
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

export function storeJobsData(payload) {
    return { type: FETCH_JOBS, payload };
}

export const fetchJobs = () => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'mentors?studentId=' + sessionStorage.getItem("id");
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(storeJobsData(response.data));
                } else {
                    dispatch(storeJobsData([]));
                }
            })
            .catch((error) => {
                console.log("Error in fetching mentors data")
                dispatch(storeJobsData([]));
            });
    };
};
export function storeRegistrations(payload) {
    return { type: FETCH_STUDENT_REGISTRATIONS, payload };
}

export const fetchRegistrations = () => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'student/' + sessionStorage.getItem("id") + "/registrations";
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(storeRegistrations(response.data));
                } else {
                    dispatch(storeRegistrations([]));
                }
            })
            .catch((error) => {
                console.log("Error in fetching registrations data")
                dispatch(storeRegistrations([]));
            });
    };
}
export function storeApplications(payload) {
    return { type: FETCH_STUDENT_APPLICATIONS, payload };
}

export const fetchApplications = () => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'student/' + sessionStorage.getItem("id") + "/applications";
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data)
                    dispatch(storeApplications(response.data));
                } else {
                    dispatch(storeApplications([]));
                }
            })
            .catch((error) => {
                console.log("Error in fetching applications data")
                dispatch(storeApplications([]));
            });
    };
}

export function storeEvents(payload) {
    return { type: FETCH_EVENTS, payload };
}

export const fetchEvents = () => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'events';
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(storeEvents(response.data));
                } else {
                    dispatch(storeEvents([]));
                }
            })
            .catch((error) => {
                console.log("Error in fetching events data")
                dispatch(storeEvents([]));
            });
    };
}
export function storeStudentProfile(payload) {
    return { type: FETCH_PROFILE, payload };
}

export const fetchStudentProfile = () => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'student/' + sessionStorage.getItem("id") + '/profile'
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
                console.log("Error in fetching student data")
                dispatch(storeStudentProfile({}));
            });
    };
}

export function storeCompanyProfile(payload) {
    return { type: FETCH_COMPANY_PROFILE, payload };
}

export const fetchCompanyProfile = (id) => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'company?id=' + id
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

export function setCurrentSkill(payload) {
    return { type: NEW_SKILL, payload };
}

export const updateSkills = ({ skills, newSkill }) => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.put(url, {
            skills: skills
        })
            .then(response => {
                if (response.status === 200) {
                    dispatch(setCurrentSkill(""));
                    dispatch(fetchStudentProfile());
                } else {
                    dispatch(setCurrentSkill(newSkill));
                    dispatch(fetchStudentProfile());
                }
            })
            .catch((error) => {
                dispatch(setCurrentSkill(newSkill));
                dispatch(fetchStudentProfile());
            });
    };
}

export function toggleProfilePicModal(payload) {
    return { type: TOGGLE_PROFILE_PIC, payload };
}

export function toggleObjectiveEdit(payload) {
    return { type: TOGGLE_OBJECTIVE, payload };
}

export const updateObjective = (payload) => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.put(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(fetchStudentProfile());
                    dispatch(toggleObjectiveEdit(false));
                } else {
                    dispatch(fetchStudentProfile());
                    dispatch(toggleObjectiveEdit(true));
                }
            })
            .catch((error) => {
                dispatch(fetchStudentProfile());
                dispatch(toggleObjectiveEdit(true));
            });
    };
}

export function togglePersonalInfoEdit(payload) {
    return { type: TOGGLE_PERSONAL_INFO_EDIT, payload };
}

export const updatePersonalInfo = (payload) => {
    return dispatch => {
        let url = process.env.REACT_APP_BACKEND_URL + 'student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.put(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(fetchStudentProfile());
                    dispatch(togglePersonalInfoEdit(false));
                } else {
                    dispatch(fetchStudentProfile());
                    dispatch(togglePersonalInfoEdit(true));
                }
            })
            .catch((error) => {
                dispatch(fetchStudentProfile());
                dispatch(togglePersonalInfoEdit(true));
            });
    };
}

export function enableApplyModal(payload) {
    return { type: TOGGLE_APPLY_MODAL, payload };
}

export const applyForAJob = ({ url, formData, config }) => {
    return dispatch => {
        dispatch({ type: LOADING })
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.post(url, formData, config)
            .then(response => {
                if (response.status === 200) {
                    dispatch({ type: LOADING })
                    dispatch({ type: JOB_APPLY_SUCCESS })
                    dispatch(fetchJobs());
                } else {
                    dispatch({ type: LOADING })
                    dispatch({ type: JOB_APPLY_FAILURE })
                }
            })
            .catch((error) => {
                dispatch({ type: LOADING })
                dispatch({ type: JOB_APPLY_FAILURE })
            });
    };
}

export const uploadProfilePicture = ({ formData, config }) => {
    return dispatch => {
        dispatch({ type: LOADING })
        const url = process.env.REACT_APP_BACKEND_URL + 'student/' + sessionStorage.getItem("id") + "/image"
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.post(url, formData, config)
            .then(response => {
                if (response.status === 200) {
                    dispatch({ type: LOADING })
                    dispatch(toggleProfilePicModal(false));
                    dispatch(fetchStudentProfile());
                } else {
                    dispatch({ type: LOADING })
                    dispatch(toggleProfilePicModal(true));
                    dispatch(fetchStudentProfile());
                }
            })
            .catch((error) => {
                dispatch({ type: LOADING })
                dispatch(toggleProfilePicModal(true));
                dispatch(fetchStudentProfile());
            });
    };
}

export const addNewSchool = (education) => {
    return dispatch => {
        dispatch({ type: LOADING })
        const url = process.env.REACT_APP_BACKEND_URL + 'student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.post(url, education)
            .then(response => {
                if (response.status === 200) {
                    dispatch({ type: LOADING })
                    dispatch(fetchStudentProfile());
                } else {
                    dispatch({ type: LOADING })
                    dispatch(fetchStudentProfile());
                }
            })
            .catch((error) => {
                dispatch({ type: LOADING })
                dispatch(fetchStudentProfile());
            });
    };
}

export const editSchool = (education) => {
    return dispatch => {
        dispatch({ type: LOADING })
        const url = process.env.REACT_APP_BACKEND_URL + 'student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.put(url, education)
            .then(response => {
                if (response.status === 200) {
                    dispatch({ type: LOADING })
                    dispatch(fetchStudentProfile());
                } else {
                    dispatch({ type: LOADING })
                    dispatch(fetchStudentProfile());
                }
            })
            .catch((error) => {
                dispatch({ type: LOADING })
                dispatch(fetchStudentProfile());
            });
    };
}

export const deleteSchool = (url) => {
    return dispatch => {
        dispatch({ type: LOADING })
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.delete(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch({ type: LOADING })
                    dispatch(fetchStudentProfile());
                } else {
                    dispatch({ type: LOADING })
                    dispatch(fetchStudentProfile());
                }
            })
            .catch((error) => {
                dispatch({ type: LOADING })
                dispatch(fetchStudentProfile());
            });
    };
}

export const addNewExperience = ({ experience }) => {
    return dispatch => {
        dispatch({ type: LOADING })
        const url = process.env.REACT_APP_BACKEND_URL + 'student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.post(url, { experience })
            .then(response => {
                if (response.status === 200) {
                    dispatch({ type: LOADING })
                    dispatch(fetchStudentProfile());
                } else {
                    dispatch({ type: LOADING })
                    dispatch(fetchStudentProfile());
                }
            })
            .catch((error) => {
                dispatch({ type: LOADING })
                dispatch(fetchStudentProfile());
            });
    };
}

export const editExperience = (experience) => {
    return dispatch => {
        dispatch({ type: LOADING })
        const url = process.env.REACT_APP_BACKEND_URL + 'student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.put(url, experience)
            .then(response => {
                if (response.status === 200) {
                    dispatch({ type: LOADING })
                    dispatch(fetchStudentProfile());
                } else {
                    dispatch({ type: LOADING })
                    dispatch(fetchStudentProfile());
                }
            })
            .catch((error) => {
                dispatch({ type: LOADING })
                dispatch(fetchStudentProfile());
            });
    };
}

export const deleteExperience = (url) => {
    return dispatch => {
        dispatch({ type: LOADING })
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.delete(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch({ type: LOADING })
                    dispatch(fetchStudentProfile());
                } else {
                    dispatch({ type: LOADING })
                    dispatch(fetchStudentProfile());
                }
            })
            .catch((error) => {
                dispatch({ type: LOADING })
                dispatch(fetchStudentProfile());
            });
    };
}

export const applyForEvent = ({ url, data }) => {
    return dispatch => {
        dispatch({ type: LOADING })
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.post(url, data)
            .then(response => {
                if (response.status === 200) {
                    dispatch({ type: LOADING })
                    dispatch(fetchEvents());
                } else {
                    dispatch({ type: LOADING })
                    dispatch(fetchEvents());
                }
            })
            .catch((error) => {
                dispatch({ type: LOADING })
                dispatch(fetchEvents());
            });
    };
}

export const updateName = ({ name }) => {
    return dispatch => {
        dispatch({ type: LOADING })
        let url = process.env.REACT_APP_BACKEND_URL + 'student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
        axios.put(url, {
            name
        })
            .then(response => {
                if (response.status === 200) {
                    dispatch({ type: LOADING })
                    dispatch(fetchStudentProfile());
                } else {
                    dispatch({ type: LOADING })
                    dispatch(fetchStudentProfile());
                }
            })
            .catch((error) => {
                dispatch({ type: LOADING })
                dispatch(fetchStudentProfile());
            });
    };
}