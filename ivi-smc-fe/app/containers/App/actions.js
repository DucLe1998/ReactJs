/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  LOAD_LIST_NOTIFY,
  LOAD_LIST_NOTIFY_ERROR,
  LOAD_LIST_NOTIFY_SUCCESS,
} from './constants';

export function loadNotification(filterQuery) {
  return {
    type: LOAD_LIST_NOTIFY,
    filterQuery,
  };
}
export function loadNotificationSuccess(data) {
  return {
    type: LOAD_LIST_NOTIFY_SUCCESS,
    data,
  };
}
export function loadNotificationError(err) {
  return {
    type: LOAD_LIST_NOTIFY_ERROR,
    err,
  };
}
