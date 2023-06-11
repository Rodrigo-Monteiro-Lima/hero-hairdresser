import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
});
let isRefreshing = false;
let failedRequest: Array<RequestConfig> = [];

interface RequestConfig extends AxiosRequestConfig {
  onFailure?: (error: AxiosError) => void;
  onSuccess?: (response: AxiosResponse) => void;
}
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
const refreshSubscribers: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError | unknown) => {
    const originalRequest = (error as AxiosError)?.config as RequestConfig;
    if (error instanceof AxiosError && error.response?.status === 401) {
      if (error.response?.data.code === 'token.expired') {
        try {
          const refresh_token = localStorage.getItem(
            'refresh_token',
          );
          const response = await api.post('/users/refresh', {
            refresh_token,
          });
          const { token, refresh_token: newToken } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refresh_token', newToken);
          isRefreshing = false;
          onRefreshed(token);

          if (originalRequest?.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axios(originalRequest);
        } catch (error) {
          failedRequest.forEach((request) => {
            request.onFailure?.(error as AxiosError);
          });
          failedRequest = [];
        }

        return new Promise((resolve, reject) => {
          failedRequest.push({
            ...originalRequest,
            onSuccess: (response) => resolve(response),
            onFailure: (error) => reject(error),
          });
        });
      }
    } else {
      // localStorage.removeItem('token');
      // localStorage.removeItem('refresh_token');
      // localStorage.removeItem('user');
    }
    return Promise.reject(error);
  },
);

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
}

export { api };