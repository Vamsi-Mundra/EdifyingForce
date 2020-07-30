import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProfileCard from './profileCard';
configure({ adapter: new Adapter() });

describe('Student Profile Page Component', () => {
    let component;
    const props = {
        student: {
            id: "-T1UjbfE",
            name: "Akhil Reddy",
            email: "akhil@sjsu.edu",
            college: "San Jose State University",
            city: "San Jose",
            dob: "1995-05-14T07:00:00.000Z",
            state: "CA",
            country: "United States",
            mobile: "6692046177",
            skills: " React JS,Node,Docker,Node JS",
            career_objective: "Looking for Internships ",
            image: null,
            education: [
                {
                    college_name: "San Jose State University",
                    degree: "Master's",
                    major: "Software Engineering",
                    year_of_starting: 2020,
                    month_of_starting: 1,
                    year_of_passing: 2021,
                    month_of_passing: 12,
                    cgpa: 3,
                    student_id: "-T1UjbfE",
                    id: "ye764t"
                }
            ],
            experience: []
        }
    }
    beforeEach(() => {

    })
    it('Should Render Correctly', () => {

        component = renderer.create(
            <ProfileCard  {...props} />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        expect(component.getInstance().state.name).toBe('');
    });

    it('Enable the Profile Edit option on clicking the edit Icon', () => {

        component = renderer.create(
            <ProfileCard  {...props} />
        );
        let profile = component.getInstance();
        expect(profile.state.enableProfileSave).toBe(false);
        profile.enableProfileEdit();
        expect(profile.state.enableProfileSave).toBe(true);
    });

})