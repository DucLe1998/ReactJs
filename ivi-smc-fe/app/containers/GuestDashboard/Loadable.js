/**
 *
 * Asynchronously loads the component for GuestDashboard
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
