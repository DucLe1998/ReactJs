/*
 * ListCamera Messages
 *
 * This contains all the text for the ListCamera container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ListCamera';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'List Camera',
  },
  detail: {
    id: `${scope}.detail`,
    defaultMessage: 'Camera info',
  },
});
