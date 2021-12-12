/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';

import { Graph } from '../../components/Graph';
import { ReactFlowProps } from 'react-flow-renderer';

const renderGraph = () => {
    const props: ReactFlowProps = {
        elements: [],
    };
    return render(<Graph {...props} />);
};

describe('<Graph>', () => {
    test('graph is visible for users', () => {
        const component = renderGraph();
        expect(component).toBeVisible;
    });
});
