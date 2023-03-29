/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import { LOAD_LIST_NOTIFY_SUCCESS } from './constants';

// The initial state of the App
export const initialState = {
  loading: 0,
  error: false,
  listNotifications: {
    rows: [],
    totalPage: 0,
  },
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_LIST_NOTIFY_SUCCESS:
        draft.listNotifications = action.data;
        break;
    }
  });

export default appReducer;
