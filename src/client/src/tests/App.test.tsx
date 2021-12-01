/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import App from '../App';


test('renders with default props', () => {
    const { getByText } = render( <App/> );
    const output = getByText('Tasks');

    expect(output).toHaveTextContent('Tasks');
 
})

