import Cookies from 'js-cookie';
import { API_IAM } from './apiUrl';
import { clearLoginData } from '../utils/utils';
const axios = require('axios');
export async function refreshToken(refreshToken) {
  if (window.localStorage.getItem('token')) {
    const axiosConfigRefeshToken = {
      method: 'post',
      url: API_IAM.REFRESH_TOKEN_API,
      // withCredentials: true,
      data: { refreshToken },
    };
    try {
      const response = await axios(axiosConfigRefeshToken);
      Cookies.set('refresh_token', response.refresh_token);
      Cookies.set('expired_time', Date.now() + response.expires_in * 1000);
      window.localStorage.setItem('token', response.access_token);
      return response.expires_in * 1000;
    } catch (ex) {
      // console.warn('token refresh not success...', ex);
      clearLoginData(true);
      return null;
    }
  }
  return '';
}
