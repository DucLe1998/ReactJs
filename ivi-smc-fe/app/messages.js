import { defineMessages } from 'react-intl';

export const scope = 'app';

export default defineMessages({
  statusEnabled: {
    id: `${scope}.status.enabled`,
    defaultMessage: 'Enabled',
  },
  statusDisabled: {
    id: `${scope}.status.disabled`,
    defaultMessage: 'Disabled',
  },
  nodata: {
    id: `${scope}.no_data`,
    defaultMessage: 'No data',
  },
  uploadReady: {
    id: `${scope}.file_upload.message.ready_upload`,
    defaultMessage: 'Ready to upload',
  },
});
