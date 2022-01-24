/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import { IProject } from '../../../../types';
import { App } from '../App';

const selectedProject: IProject = {
    id: 1,
    name: 'Name',
    description: '',
    owner_id: '1',
};

const comp = <App selectedProject={selectedProject} />;

test('Renders with default props', () => {
    const { getByText } = render(comp);
    const output2 = getByText('Add task');
    const output3 = getByText('Text:');
    expect(output2).toHaveTextContent('Add task');
    expect(output3).toHaveTextContent('Text:');
});

test('Renders the button with proper content', () => {
    const component = render(comp);
    const button = component.container.querySelector('.addTaskForm button');

    expect(button).toHaveTextContent('Add');
});

test('Button click calls a function', () => {
    jest.mock('../App');
    const { getByText } = render(comp);
    const button = getByText('Add');
    fireEvent.click(button);

    expect(App).toBeCalled;
});

test('The initial textbox should be empty', () => {
    const component = render(comp);
    const input = component.container.querySelector('input');
    expect(input).toHaveValue('');
});

test('Changin the initial node text box should be possible', () => {
    const component = render(comp);
    const input = component.container.querySelector('input');
    if (input) {
        fireEvent.change(input, {
            target: { value: 'Add physics' },
        });
        expect(input).toHaveValue('Add physics');
    }
});

test('App should include graph', () => {
    const component = render(comp);
    const graph = component.container.querySelector('Graph');
    expect(graph).toBeVisible;
    expect(graph).toBeInTheDocument;
});
