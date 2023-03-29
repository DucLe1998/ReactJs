/*
 * Policy Messages
 *
 * This contains all the text for the Policy container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Policy';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the Policy container!',
  },
  copyTitle: {
    id: `${scope}.copy`,
    defaultMessage: 'This is the Policy container!',
  },
  copyConfirm: {
    id: `${scope}.copyConfirm`,
    defaultMessage: 'This is the Policy container!',
  },
  columnCodePolicy: {
    id: `${scope}.columnCodePolicy`,
    defaultMessage: 'Code policy',
  },
  columnNamePolicy: {
    id: `${scope}.columnNamePolicy`,
    defaultMessage: 'Name policy',
  },
  columnDescriptionPolicy: {
    id: `${scope}.columnDescriptionPolicy`,
    defaultMessage: 'Description',
  },
  columnStatusPolicy: {
    id: `${scope}.columnStatusPolicy`,
    defaultMessage: 'Status',
  },
  columnCenterPolicy: {
    id: `${scope}.columnCenterPolicy`,
    defaultMessage: 'Center',
  },
  deleteTitle: { id: `${scope}.deleteTitle`, defaultMessage: 'Delete policy' },
  deleteConfirm: {
    id: `${scope}.deleteConfirm`,
    defaultMessage:
      'Make sure that no other users are using this role before deleting!',
  },
  listTitle: { id: `${scope}.listTitle`, defaultMessage: 'List Policy' },
  filter: { id: `${scope}.filter`, defaultMessage: 'Filter Policy' },
  filterUnActive: { id: `${scope}.filterUnActive`, defaultMessage: 'Inactive' },
  filterActive: { id: `${scope}.filterActive`, defaultMessage: 'Active' },
  filterAll: { id: `${scope}.filterAll`, defaultMessage: 'All' },
  titleAdd: { id: `${scope}.titleAdd`, defaultMessage: 'Thêm mới vai trò' },
  titleEdit: { id: `${scope}.titleEdit`, defaultMessage: 'Edit Policy' },
  function: { id: `${scope}.function`, defaultMessage: 'Function' },
  category: { id: `${scope}.category`, defaultMessage: 'Category' },
  columnNameFunction: {
    id: `${scope}.columnNameFunction`,
    defaultMessage: 'Name Function',
  },
  columnCodeFunction: {
    id: `${scope}.columnCodeFunction`,
    defaultMessage: 'Code Function',
  },
  columnListFunction: {
    id: `${scope}.columnListFunction`,
    defaultMessage: 'List Function',
  },
  columnListDetailFunction: {
    id: `${scope}.columnListDetailFunction`,
    defaultMessage: 'List detail',
  },
  columnUpdateFunction: {
    id: `${scope}.columnUpdateFunction`,
    defaultMessage: 'Update',
  },
  columnCreateFunction: {
    id: `${scope}.columnCreateFunction`,
    defaultMessage: 'Create',
  },
  columnRemoveFunction: {
    id: `${scope}.columnRemoveFunction`,
    defaultMessage: 'Delete',
  },
  columnNameCategory: {
    id: `${scope}.columnNameCategory`,
    defaultMessage: 'Name category',
  },
  columnSeeCategory: {
    id: `${scope}.columnSeeCategory`,
    defaultMessage: 'See',
  },
  titleDeleteUserConfirm: {
    id: `${scope}.titleDeleteUserConfirm`,
    defaultMessage: 'Delete User',
  },
  titleDeleteUser: {
    id: `${scope}.titleDeleteUser`,
    defaultMessage: 'Are you sure you want to delete the user in this role?',
  },
  nameUserAdd: { id: `${scope}.nameUserAdd`, defaultMessage: 'Name User' },
  fullnameUserAdd: {
    id: `${scope}.fullnameUserAdd`,
    defaultMessage: 'Full name',
  },
  emailUserAdd: { id: `${scope}.emailUserAdd`, defaultMessage: 'Email' },
  sdtUserAdd: { id: `${scope}.sdtUserAdd`, defaultMessage: 'Telephone' },
  unitUserAdd: { id: `${scope}.unitUserAdd`, defaultMessage: 'Unit' },
  addSuccess: { id: `${scope}.addSuccess`, defaultMessage: 'Add success' },
  positionUserAdd: {
    id: `${scope}.positionUserAdd`,
    defaultMessage: 'Position',
  },
  titleSearchUser: {
    id: `${scope}.titleSearchUser`,
    defaultMessage: 'Add user to the policy',
  },
  titlePolicyManagerUser: {
    id: `${scope}.titlePolicyManagerUser`,
    defaultMessage: 'Manage users of the role',
  },
  listUser: { id: `${scope}.listUser`, defaultMessage: 'List User' },
});
