/*
 * UpdatePassword Messages
 *
 * This contains all the text for the UpdatePassword container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.containers.UpdatePasswordPage';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Creating a new password',
  },
  newPasswordLabel: {
    id: `${scope}.newPassword.label`,
    defaultMessage: 'New password',
  },
  confirmPasswordLabel: {
    id: `${scope}.confirmPassword.label`,
    defaultMessage: 'Confirm new password',
  },
  submitButton: {
    id: `${scope}.submit.button`,
    defaultMessage: 'Submit',
  },
  invalidNewPasswordFormat: {
    id: `${scope}.invalid.newPassword.format`,
    defaultMessage:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character and minimum eight characters!',
  },
  confirmPasswordNotMatch: {
    id: `${scope}.confirmPassword.notMatch`,
    defaultMessage:
      'The confirmation password does not match the new password!',
  },
  successMessage: {
    id: `${scope}.success.message`,
    defaultMessage: 'Password successfully updated',
  },
});
