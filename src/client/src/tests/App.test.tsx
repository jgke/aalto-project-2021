/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import App from '../App';

// test for submit button


test('renders with default props', () => {
    const { getByText } = render( <App/> );
    const output1 = getByText('Tasks');
    const output2 = getByText('Add task');
    const output3 = getByText('Text:');

    expect(output1).toHaveTextContent('Tasks');
    expect(output2).toHaveTextContent('Add task');
    expect(output3).toHaveTextContent('Text:');
 
});

test('should display a blank input bar', async () => {
    const { findByTestId } = render( <App/> );
    const form = await findByTestId('nodetext');
    
    expect(form).toHaveValue('');
    
});

