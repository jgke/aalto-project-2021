import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react';
import { Graph } from '../Graph'



test('renders with default props', () => {
    const { getByText } = render(<Graph/>);
    const input = getByText('title:');
   
    expect(input).toHaveAttribute('name', 'Text')
          
        
      })

    




