/*
 *
 * LanguageProvider reducer
 *
 */

import produce from 'immer';

import { CHANGE_LOCALE } from './constants';
import { DEFAULT_LOCALE } from '../../i18n';
let defaultLocale = localStorage.getItem('lng');
if (!defaultLocale) {
  // if (/^vi\b/.test(navigator.language)) {
  //   defaultLocale = 'vi';
  // } else {
  //   defaultLocale = DEFAULT_LOCALE;
  // }
  defaultLocale = DEFAULT_LOCALE;
  localStorage.setItem('lng', defaultLocale);
}

export const initialState = {
  locale: defaultLocale,
};

/* eslint-disable default-case, no-param-reassign */
const languageProviderReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_LOCALE:
        draft.locale = action.locale;
        localStorage.setItem('lng', action.locale);
        break;
    }
  });

export default languageProviderReducer;
