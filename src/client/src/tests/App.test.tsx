/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';

test('renders with default props', () => {
    const { getByText } = render(<App />);
    const output1 = getByText('Tasks');
    const output2 = getByText('Add task');
    const output3 = getByText('Text:');

    expect(output1).toHaveTextContent('Tasks');
    expect(output2).toHaveTextContent('Add task');
    expect(output3).toHaveTextContent('Text:');
});

test('clicking the button calls event handler once', () => {
    const mockHandler = jest.fn();
    const { getByText } = render(<button onClick={mockHandler}>Add</button>);
    const button = getByText('Add');
    fireEvent.click(button);

    expect(mockHandler.mock.calls).toHaveLength(1);
});

test('The initial textbox should be empty', () => {
    const component = render(<App />);
    const input = component.container.querySelector('input');
    expect(input).toHaveValue('');
});

test('Changin the initial node text box should be possible', () => {
    const component = render(<App />);
    const input = component.container.querySelector('input');
    if (input) {
        fireEvent.change(input, {
            target: { value: 'Add physics' },
        });
        expect(input).toHaveValue('Add physics');
    }
});
