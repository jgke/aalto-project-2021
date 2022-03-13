/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import { Toolbar } from '../../components/Toolbar';

describe('Toolbar', () => {
    let component: RenderResult;
    const mockCreate = jest.fn();
    const mockHidden = jest.fn();
    const mockReverseConnectState = jest.fn();
    const mockLayout = jest.fn();

    beforeEach(() => {
        mockCreate.mockRestore();
        component = render(
            <Toolbar
                createNode={mockCreate}
                layoutWithDagre={mockLayout}
                reverseConnectState={mockReverseConnectState}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                forceDirected={async () => {}}
                setNodeHidden={mockHidden}
                nodeHidden={false}
            />
        );
    });

    test('calls an appropriate function when a button is clicked', () => {
        const buttons = component.container.querySelectorAll('button');
        expect(buttons[0]).toBeDefined;
        fireEvent.click(buttons[0]);
        expect(mockCreate).toBeCalled;

        expect(buttons[1]).toBeDefined;
        fireEvent.click(buttons[1]);
        expect(mockReverseConnectState).toBeCalled;
    });

    test('renders the button with proper text', () => {
        const button = component.container.querySelector('button');

        expect(button).toHaveTextContent('Create');
    });

    test('has an empty textbox by default', () => {
        const input = component.container.querySelector('input');
        expect(input).toHaveValue('');
    });

    test('can change the text box value', () => {
        const input = component.container.querySelector('input')!;
        fireEvent.change(input, {
            target: { value: 'Add physics' },
        });
        expect(input).toHaveValue('Add physics');
    });

    test('calls a function when checkbox is checked', () => {
        const cb = component.container.querySelector('input')!;
        expect(cb).toBeDefined;
        fireEvent.change(cb, {
            target: { checked: true }
        });

        expect(cb).toBeChecked;
        expect(mockHidden).toBeCalled;
    });
});
