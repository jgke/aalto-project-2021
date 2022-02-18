import axios from 'axios';
import { axiosWrapper } from '../../services/axiosWrapper';
import MockAdapter from 'axios-mock-adapter';
import toast from 'react-hot-toast';
import { mocked } from 'ts-jest/utils';

jest.mock('react-hot-toast');

describe('axios wrapper', () => {
    let mockAxios: MockAdapter;
    const toastMessage = 'testing stuff';
    const mockToast = mocked(toast, true);

    beforeAll(() => (mockAxios = new MockAdapter(axios)));
    afterEach(() => {
        mockAxios.reset();
        mockToast.mockReset();
    });

    interface TData {
        test: string;
    }

    const testData = { test: 'data' };
    const baseUrl = 'test/url';

    test('should return the data when no errors are encountered', async () => {
        mockAxios.onGet(baseUrl).reply(200, testData);

        const res = await axiosWrapper<TData>(
            axios.get<TData>(baseUrl),
            toastMessage
        );

        expect(mockAxios.history.get[0].url).toEqual(baseUrl);
        expect(res).toEqual(testData);
    });

    test('should return undefined on error', async () => {
        mockAxios.onGet(baseUrl).reply(400);

        const res = await axiosWrapper(axios.get<TData>(baseUrl), toastMessage);

        expect(mockAxios.history.get[0].url).toEqual(baseUrl);
        expect(res).toBeUndefined;
    });

    test('should not send a notification when no errors are encountered', async () => {
        mockAxios.onGet(baseUrl).reply(200);
        mockToast.mockImplementation(() =>
            fail('toast notification sent when everything OK')
        );

        await axiosWrapper<TData>(axios.get<TData>(baseUrl), toastMessage);

        expect(mockAxios.history.get[0].url).toEqual(baseUrl);
    });

    test('should send a notification on error', async () => {
        let notificationMessage = '';
        const status = 400;
        const errorMessage = 'error message';

        mockAxios.onGet(baseUrl).reply(status, { message: errorMessage });
        mockToast.mockImplementation(
            (msg) => (notificationMessage = String(msg))
        );

        await axiosWrapper(axios.get<TData>(baseUrl), toastMessage);

        expect(mockAxios.history.get[0].url).toEqual(baseUrl);
        expect(notificationMessage).toEqual(
            `❌ ${toastMessage}: ${status} ${errorMessage}`
        );
    });
});
