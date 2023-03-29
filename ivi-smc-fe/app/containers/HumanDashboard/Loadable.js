/**
 *
 * Asynchronously loads the component for HumanDashboard
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
