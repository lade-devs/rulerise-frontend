import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const baseURL = 'https://dummyjson.com';

class ApiCall {
    async get(url: string): Promise<any> {
        const params: AxiosRequestConfig = {
            method: "GET",
            url,
            baseURL: baseURL
        };

        let response: AxiosResponse;

        try {
            response = await axios.request(params);
        } catch (e) {
            return {
                status: 'error',
            };
        }

        return response.data;
    }
}

export default ApiCall;
