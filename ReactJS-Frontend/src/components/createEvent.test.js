import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CreateEvent from './createEvent';
configure({ adapter: new Adapter() });

describe('Create Job Page Component', () => {
    let component;
    const props = {
        student: {
        }
    }
    beforeEach(() => {

    })
    it('Should Render Correctly', () => {

        component = renderer.create(
            <CreateEvent />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Enable the Profile Edit option on clicking the edit Icon', () => {

        component = renderer.create(
            <CreateEvent  {...props} />
        );
        let job = component.getInstance();
        expect(job.state.name).toBe("");
        job.nameChangeHandler({ "target": { "value": "JS Bootcamp" } });
        expect(job.state.name).toBe("JS Bootcamp");
    });

})