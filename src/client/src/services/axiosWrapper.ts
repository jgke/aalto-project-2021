import { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

//returns the response data
//on error, makes a toast notification, and returns undefined
//axios throws an error when response status is 400+
export async function axiosWrapper<T>(
    promise: Promise<AxiosResponse<T>>,
    where?: string //where this function was called, displayed on the error message
): Promise<T | undefined> {
    return promise
        .then((response: AxiosResponse) => {
            return response.data || { success: true };
        })
        .catch((error: AxiosError) => {
            const response = error.response;
            let toastMessage = `❌ ${where ? where + ': ' : ''}`;

            if (response && response.data && response.data.message) {
                toastMessage += `${response.status} ${response.data.message}`;
            } else {
                toastMessage += error.message;
            }

            toast(toastMessage);

            return;
        });
}
