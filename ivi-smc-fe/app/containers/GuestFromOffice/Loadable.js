/**
 *
 * Asynchronously loads the component for ManageGuests
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
