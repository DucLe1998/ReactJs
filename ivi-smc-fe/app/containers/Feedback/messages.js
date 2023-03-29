/*
 * AcConfigDoor Messages
 *
 * This contains all the text for the AcConfigDoor container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Feedback';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Feedbacks',
  },
  title_delete: {
    id: `${scope}.title.delete`,
    defaultMessage: 'Delete feedback',
  },
  text_delete: {
    id: `${scope}.text.delete`,
    defaultMessage: 'Are you sure you want to delete {name}',
  },
  detail: {
    id: `${scope}.detail`,
    defaultMessage: 'Feedback info',
  },
});
