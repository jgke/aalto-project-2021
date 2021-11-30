import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render} from '@testing-library/react'
import { Graph } from './Graph'



test('graph is visible for users', () => {
    
 const component = render(< Graph />);
 expect(component).toBeVisible
        

})

    




