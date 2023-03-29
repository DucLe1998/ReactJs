/**
 * Gets the repositories of the user from Github
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import { LOAD_MENU, LOAD_USER_ATHORITY } from './constants';
import {
  loadMenuSuccess,
  loadMenuError,
  loadUserAuthoritySuccess,
  loadUserAuthorityError,
} from './actions';
import { API_IAM, API_CMS } from '../apiUrl';
import { callApi, METHODS } from '../../utils/requestUtils';
// import example data
import menuData from './menuData';

const axios = require('axios');

export function* getListMenu() {
  try {
    const response = yield call(callApi, API_CMS.USER_MENU_API, METHODS.GET);
    console.log([...menuData])
    // if(response.data && response.data.length > 0){
    if(1==2){
      const filterD = response.data
      // .filter(d => [12, 10, 110, 17, 95].includes(d.id))
        .filter((d) => d.functionality.read == 'ACTIVE')
        .map((d) => ({
          ...d,
          isParent: response.data.some((v) => v.parentId && v.parentId == d.id),
        }));
      yield put(loadMenuSuccess(filterD));
    }else{
      const filterD = [...menuData]
      // .filter(d => [12, 10, 110, 17, 95].includes(d.id))
        .filter((d) => d.functionality.read == 'ACTIVE')
        .map((d) => ({
          ...d,
          isParent: response.data.some((v) => v.parentId && v.parentId == d.id),
        }));
      yield put(loadMenuSuccess(filterD));
    }
    
  } catch (err) {
    yield put(loadMenuError(err));
  }
}
export function* getListUserAuthority() {
  const axiosConfig = {
    method: 'get',
    url: API_IAM.LIST_USER_AUTHORITY_API,
  };
  try {
    const response = yield call(axios, axiosConfig);
    yield put(loadUserAuthoritySuccess(response.data.functionalAuthorities));
  } catch (err) {
    yield put(loadUserAuthorityError(err));
  }
}

export default function* getData() {
  yield takeLatest(LOAD_MENU, getListMenu);
  yield takeLatest(LOAD_USER_ATHORITY, getListUserAuthority);
}
