import axios from 'axios';
import { Message as ArcoMessage, Message } from '@arco-design/web-react';
import { get } from 'lodash';

type errorTip = {
  url: string;
  errorMessage: string;
}[];

let errors: errorTip = [];
const errorTipInternalTime = 5000;

function messageError(response, message) {
  const url = get(response, 'config.url', '/').split('?')?.[0];

  if (
    errors.length > 0 &&
    errors.findIndex((error) => {
      return error.errorMessage === message;
    }) > -1
  ) {
    // console.log(url, message, '  重复 messageError ');
    return;
  } else {
    errors.push({
      url,
      errorMessage: message,
    });
    // console.log(url, message, '  非重复 messageError ');
    ArcoMessage.error(message);

    setTimeout(() => {
      errors = errors.filter((error) => {
        return error.url !== url && error.errorMessage !== message;
      });
    }, errorTipInternalTime);
  }
}

export const request = axios.create({
  baseURL: '/',
  timeout: 60000,
});
request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
request.interceptors.response.use(
  (response) => {
    {
      return response.data;
    }
  },
  (error) => {
    const { response } = error;
    console.log(response, 'response');
    let noErrorTipFlag = false;
    const errorMsg = error?.response?.data?.message || error?.message;
    const data = JSON.parse(response.config.data || '{}');
    if (response.config.params?.NoErrorTip || data?.NoErrorTip) {
      noErrorTipFlag = true;
      // 禁用request 报错
    }
    if (noErrorTipFlag) {
      return Promise.reject(new Error(errorMsg));
    }

    // if (response) {
    //   const message = get(error, 'response.data.message', '');
    //   if (message) {
    //     messageError(response, message);
    //   } else {
    //     messageError(response, error.toJSON().message);
    //   }
    // } else {
    const { message } = error;
    if (message.indexOf('timeout') >= 0) {
      messageError(response, '网络超时');
    } 
    // else {
    //   messageError(error, error.toString());
    // }
    // }

    return Promise.reject(error);
  }
);
export default request;
