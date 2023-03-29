import { defineMessages } from 'react-intl';

export const scope = 'app.title';

export default defineMessages({
  error: {
    id: `${scope}.error`,
    defaultMessage: 'Something went wrong',
  },
  filter: {
    id: `${scope}.filter`,
    defaultMessage: 'Filter Condition',
  },
  filterResult: {
    id: `${scope}.filterResult`,
    defaultMessage: 'Filter result',
  },
  rowsPerPage: {
    id: `${scope}.rows_per_page`,
    defaultMessage: '{number} rows/page',
  },
  row: {
    id: `${scope}.row`,
    defaultMessage: 'Items',
  },
  placeholderSearch: {
    id: `${scope}.placeholder.search`,
    defaultMessage: 'Search',
  },
  confirm: {
    id: `${scope}.confirm`,
    defaultMessage: 'Confirmation',
  },
});
