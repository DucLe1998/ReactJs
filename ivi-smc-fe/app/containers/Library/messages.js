/*
 * Library Messages
 *
 * This contains all the text for the Library container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Library';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Library',
  },
  column_format: {
    id: `${scope}.column.format`,
    defaultMessage: 'Format',
  },
  column_size: {
    id: `${scope}.column.size`,
    defaultMessage: 'Size',
  },
  tooltip_download: {
    id: `${scope}.tooltip.download`,
    defaultMessage: 'Download',
  },
  title_delete: {
    id: `${scope}.title.delete`,
    defaultMessage: 'Delete file(s)',
  },
  text_delete: {
    id: `${scope}.text.delete`,
    defaultMessage:
      'Are you sure you want to delete {length, plural, =0 {{name}} =1 {# selected file} other {# selected files}}',
  },
});
