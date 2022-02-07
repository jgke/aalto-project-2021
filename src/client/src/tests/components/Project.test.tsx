/**
 * @jest-environment jsdom
 */

import React from 'react';
import { act, render } from '@testing-library/react';

import { Projects } from '../../components/Projects';
import { IProject } from '../../../../../types';
import { mockUserToken } from '../../../../../testmock';
import { store } from '../../store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

const dummyProjects: IProject[] = [
    {
        id: '1',
        name: 'Name',
        description: 'g242h4h2',
        owner_id: '1',
    },
    {
        id: '2',
        name: 'Name2',
        description: '45j465jk4j5',
        owner_id: '1',
    },
    {
        id: '3',
        name: 'Name3',
        description: '341qWFVAV',
        owner_id: '2',
    },
];

const renderComponent = () => {
    const testObj = {
        projects: dummyProjects,
    };
    return render(
        <BrowserRouter>
            <Provider store={store}>
                <Projects user={mockUserToken} test={testObj} />
            </Provider>
        </BrowserRouter>
    );
};

describe('<Project>', () => {
    test('is visible for users', () => {
        const component = renderComponent();
        expect(component).toBeVisible;
    });

    test('contains cards', () => {
        const component = renderComponent();
        const cards = component.container.querySelectorAll('.project-card');

        expect(cards[0]).toBeInTheDocument;
        expect(cards[0]).toBeVisible;
        expect(cards).toHaveLength(3);
    });

    test('contains form with button', () => {
        const component = renderComponent();
        const form = component.container.querySelector('.project-form');
        const button = component.container.querySelector(
            '.project-form button'
        );
        expect(form).toBeInTheDocument;
        expect(form).toBeVisible;
        expect(button).toBeInTheDocument;
        expect(button).toBeVisible;
    });

    test('clicking edit button should open a form', () => {
        const component = renderComponent();
        const button = component.container.querySelector(
            '.project-card .icon-button'
        );

        act(() => {
            button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        const editButton = component.container.querySelector(
            '.dropdown-item:first-child'
        );

        act(() => {
            editButton!.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );
        });

        const buttons = component.container.querySelectorAll('.project-form');
        expect(buttons).toHaveLength(2);
    });
});
