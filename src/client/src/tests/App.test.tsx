/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import { App } from '../App';

describe('App', () => {
    beforeAll(() => {
        window.ResizeObserver =
            window.ResizeObserver ||
            jest.fn().mockImplementation(() => ({
                disconnect: jest.fn(),
                observe: jest.fn(),
                unobserve: jest.fn(),
            }));

        Object.defineProperties(window.HTMLElement.prototype, {
            offsetHeight: {
                get() {
                    return parseFloat(this.style.height) || 1;
                },
            },
            offsetWidth: {
                get() {
                    return parseFloat(this.style.width) || 1;
                },
            },
        });
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.SVGElement as any).prototype.getBBox = () => ({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        });
    });

    let testApp: RenderResult;

    beforeEach(() => {
        testApp = render(<App />);
    });

    test('Changin the initial node text box should be possible', () => {
        const input = testApp.container.querySelector('input');
        if (input) {
            fireEvent.change(input, {
                target: { value: 'Add physics' },
            });
            expect(input).toHaveValue('Add physics');
        }
    });

    test('App should include graph', () => {
        const graph = testApp.container.querySelector('Graph');
        expect(graph).toBeVisible;
        expect(graph).toBeInTheDocument;
    });
});
