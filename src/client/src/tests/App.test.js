import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, screen, debug } from '@testing-library/react';
import App from './App';


test('renders with default props', () => {
 const { getByText } = render( <App/> );
 const output = getByText('title:');
    
 expect(output).toHaveAttribute('name', 'Text')
 
})

