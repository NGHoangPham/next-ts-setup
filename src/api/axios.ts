/* eslint-disable no-restricted-syntax */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { i18n } from 'next-i18next';
import { apiBaseUrl } from 'utils/constant';

const defaultErrorCode = 'error:e_ERROR';

export const authRequest = axios.create({
  baseURL: '/api/proxy',
});

export const request = axios.create({
  baseURL: apiBaseUrl,
});

const handleSuccess = (res: AxiosResponse) => {
  if (res.data?.code !== 0) {
    const errorCode = `error:${res.data.msg_code}`;
    if (typeof res.data !== 'object') {
      res.data = { message: i18n?.t(defaultErrorCode) };
    } else {
      res.data.message = i18n?.exists(errorCode) ? i18n?.t(errorCode) : i18n?.t(defaultErrorCode);
    }
    return Promise.reject(res.data);
  }
  return res.data;
};

const handleError = (err: AxiosError) => {
  const data = err?.response?.data;
  const errorCode = `error:${data?.msg_code}`;
  data.message = i18n?.exists(errorCode) ? i18n?.t(errorCode) : i18n?.t(defaultErrorCode);
  return Promise.reject(data);
};

authRequest.interceptors.response.use(handleSuccess, handleError);

authRequest.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    config = {
      ...config,
      data: convertToFormData(config.data),
    };
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

request.interceptors.response.use(handleSuccess, handleError);

request.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    config = {
      ...config,
      data: convertToFormData(config.data),
    };
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

const convertToFormData = (data: { string: string }) => {
  const bodyFormData = new FormData();
  if (data) {
    for (const [key, value] of Object.entries(data)) {
      bodyFormData.append(key, value);
    }
  }
  return bodyFormData;
};
