/**
 * Asynchronously loads the component for NotFoundPage
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./detail'), {
  // fallback: <LoadingIndicator />,
});
