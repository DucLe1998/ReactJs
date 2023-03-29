import { defineMessages } from 'react-intl';

export const scope = 'app.invalid';

export default defineMessages({
  fileUploadSize: {
    id: `${scope}.file_upload.size`,
    defaultMessage: 'Size is invalid',
  },
  fileUploadType: {
    id: `${scope}.file_upload.file_type`,
    defaultMessage: 'File type is invalid',
  },
  maxLength: {
    id: `${scope}.maxLength`,
    defaultMessage: 'Maximum {max} characters length',
  },
  maxDate: {
    id: `${scope}.maxDate`,
    defaultMessage: 'Must not greater than end date',
  },
  minDate: {
    id: `${scope}.minDate`,
    defaultMessage: 'Must not less than start date',
  },
  formatDate: {
    id: `${scope}.formatDate`,
    defaultMessage: 'Không đúng định dạng',
  },
  required: {
    id: `${scope}.required`,
    defaultMessage: 'This field is required',
  },
  email: {
    id: `${scope}.email`,
    defaultMessage: 'Email is invalid',
  },
});
