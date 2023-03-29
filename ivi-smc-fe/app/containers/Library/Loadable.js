/**
 *
 * Asynchronously loads the component for Library
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
