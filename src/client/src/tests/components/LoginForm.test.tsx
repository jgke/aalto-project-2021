/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { LoginForm } from '../../components/LoginForm';
import { BrowserRouter } from 'react-router-dom';

/* eslint-disable @typescript-eslint/no-explicit-any */

const getComponent = (loginUser?: any) => (
    <BrowserRouter>
        <LoginForm loginUser={loginUser || jest.fn()} setUser={jest.fn()} />
    </BrowserRouter>
);

describe('<LoginForm>', () => {
    test('is visible to users', async () => {
        let loginForm: any;
        act(() => {
            loginForm = render(getComponent());
        });

        /* expect(loginForm.container).toHaveTextContent('Email');
        expect(loginForm.container).toHaveTextContent('Password'); */

        const input = loginForm.container.querySelectorAll('input');
        expect(input).toHaveLength(2);
    });

    test('writing into the inputs should be possible', async () => {
        let loginForm: any;
        act(() => {
            loginForm = render(getComponent());
        });

        const input = loginForm.container.querySelectorAll('input');

        act(() => {
            fireEvent.change(input[0], {
                target: { value: 'mrtest@example.com' },
            });

            fireEvent.change(input[1], {
                target: { value: 'password123' },
            });
        });

        expect(input[0].value).toBe('mrtest@example.com');
        expect(input[1].value).toBe('password123');
    });

    test('submitting a form with correct values should be possible', () => {
        const loginUser = jest.fn();

        let loginForm: any;
        act(() => {
            loginForm = render(getComponent(loginUser));
        });

        const input = loginForm.container.querySelectorAll('input');
        const form = loginForm.container.querySelector('form');

        act(() => {
            fireEvent.change(input[0], {
                target: { value: 'mrtest@nodes.com' },
            });

            fireEvent.change(input[1], {
                target: { value: 'password123' },
            });
        });

        expect(form).toBeDefined();

        if (form) {
            act(() => {
                fireEvent.submit(form);
            });

            expect(loginUser.mock.calls).toHaveLength(1);
            expect(loginUser.mock.calls[0][0].email).toBe('mrtest@nodes.com');
            expect(loginUser.mock.calls[0][0].password).toBe('password123');

            /*  expect(input[0].value).toBe('')
             expect(input[1].value).toBe('') */
        }
    });

    test('empty email input should not call the submit function', () => {
        const loginUser = jest.fn();

        let loginForm: any;
        act(() => {
            loginForm = render(getComponent(loginUser));
        });

        const input = loginForm.container.querySelectorAll('input');
        const form = loginForm.container.querySelector('form');

        act(() => {
            fireEvent.change(input[1], {
                target: { value: 'password123' },
            });
        });

        if (form) {
            fireEvent.submit(form);
            expect(loginUser.mock.calls).toHaveLength(0);
        }
    });

    test('empty password input should not call the submit function', () => {
        const loginUser = jest.fn();

        let loginForm: any;
        act(() => {
            loginForm = render(getComponent(loginUser));
        });

        const input = loginForm.container.querySelectorAll('input');
        const form = loginForm.container.querySelector('form');

        act(() => {
            fireEvent.change(input[0], {
                target: { value: 'mrtest@nodes.com' },
            });
        });

        if (form) {
            fireEvent.submit(form);
            expect(loginUser.mock.calls).toHaveLength(0);
        }
    });
});
