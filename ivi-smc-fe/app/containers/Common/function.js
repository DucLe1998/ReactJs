import { createIntl, createIntlCache } from 'react-intl';
import Cookies from 'js-cookie';
import { API_IAM } from '../apiUrl';
const messages = {
  en: {
    '500': 'Something went wrong. Please contact with administrator.',
    '403': 'You dont have permission',
    '401': 'Session timeout. please login again',
    '400': 'Given infomations are invalid',
    network: 'Network error',
    other: 'Something went wrong',
  },
  vi: {
    '500':
      'Có lỗi server xảy ra. Vui lòng liên hệ với quản trị để được hỗ trợ.',
    '403': 'Bạn không có quyền truy cập chức năng này',
    '401': 'Phiên làm việc của bạn đã hết. Vui lòng đăng nhập lại',
    '400': 'Thông tin không hợp lệ',
    network: 'Mất kết nối mạng, vui lòng kiểm tra kết nối mạng.',
    other: 'Có lỗi xảy ra vui lòng thử lại sau.',
  },
};
const cache = createIntlCache();

export function getErrorMessage(err) {
  if (typeof err == 'string') {
    return err;
  }
  const currentLng = localStorage.getItem('lng');
  const intl = createIntl(
    {
      locale: currentLng,
      messages: messages[currentLng],
      defaultLocale: 'en',
    },
    cache,
  );
  if (err.response) {
    switch (err.response.status) {
      case 400:
        if (
          err.response.data &&
          err.response.data.errors &&
          err.response.data.errors.length > 0
        ) {
          return err.response.data.errors[0].message;
        }
        if (err.response.data) {
          return err.response.data.message;
        }
        return intl.formatMessage({ id: '400' });

      case 401:
        if (Object.values(API_IAM.LOGIN_API).indexOf(err.config.url) === -1) {
          window.localStorage.setItem('token', '');
          window.localStorage.setItem('userData', '');
          window.localStorage.setItem('userInfo', '');
          window.localStorage.setItem('username', '');
          Cookies.remove('expired_time');
          Cookies.remove('refresh_token');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          return intl.formatMessage({ id: '401' });
        }
        return err.response.data.message;
      case 403:
        if (
          err.response.data &&
          err.response.data.errors &&
          err.response.data.errors.length > 0
        ) {
          return err.response.data.errors[0].message;
        }
        if (err.response.data && err.response.data.message) {
          return err.response.data.message;
        }
        return intl.formatMessage({ id: '403' });

      // case 404:
      //   if (err.response && err.response.data) return err.response.data.message;
      //   return err.message;
      case 500:
        return intl.formatMessage({ id: '500' });
      default:
        if (err.response && err.response.data && err.response.data.message)
          return err.response.data.message;
        return intl.formatMessage({ id: 'other' });
    }
  } else {
    if (err.message == 'Network Error') {
      return intl.formatMessage({ id: 'network' });
    }
    return intl.formatMessage({ id: 'other' });
  }
}
