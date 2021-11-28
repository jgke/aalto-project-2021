import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom'
import App from '../App';


test('renders with default props', () => {
 const { getByText } = render(<App/>);
 const input = getByText('title:');

 expect(input).toHaveAttribute('name', 'Text')
 
})