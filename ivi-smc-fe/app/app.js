/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '!file-loader?name=[name].[ext]!./images/event.png';
// Load the favicon and the .htaccess file
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import '@babel/polyfill';
import { ConnectedRouter } from 'connected-react-router';
// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';
import 'file-loader?name=.htaccess!./.htaccess'; // eslint-disable-line import/extensions
import FontFaceObserver from 'fontfaceobserver';
// import * as OfflinePluginRuntime from 'offline-plugin/runtime';
// Import all the third party stuff
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'sanitize.css/sanitize.css';
import history from 'utils/history';

import configureStore from './configureStore';
// Import root app
import App from './containers/App';
// Import i18n messages
import { translationMessages } from './i18n';

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
// const openSansObserver = new FontFaceObserver('Open Sans', {});

// // When Open Sans is loaded, add a font-family using Open Sans to the body
// openSansObserver.load().then(() => {
//   document.body.classList.add('fontLoaded');
// });
const laToObserver = new FontFaceObserver('Roboto', {});
laToObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
});

// Create redux store with history
const initialState = {};
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');
const render = messages => {
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <ConnectedRouter history={history}>
          <DndProvider backend={HTML5Backend}>
            <App />
          </DndProvider>
        </ConnectedRouter>
      </LanguageProvider>
    </Provider>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'));
  })
    .then(() =>
      Promise.all([
        import('intl/locale-data/jsonp/en.js'),
        import('intl/locale-data/jsonp/vi.js'),
      ]),
    ) // eslint-disable-line prettier/prettier
    .then(() => render(translationMessages))
    .catch(err => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
// if (process.env.NODE_ENV === 'production') {
//   // require('offline-plugin/runtime').install(); // eslint-disable-line global-require

//   OfflinePluginRuntime.install({
//     // onUpdating: () => {
//     //   console.log('SW Event:', 'onUpdating');
//     // },
//     onUpdateReady: () => {
//       // console.log('SW Event:', 'onUpdateReady');
//       // Tells to new SW to take control immediately
//       OfflinePluginRuntime.applyUpdate();
//     },
//     onUpdated: () => {
//       // console.log('SW Event:', 'onUpdated');
//       // Reload the webpage to load into the new version
//       window.location.reload();
//     },
//     // onUpdateFailed: () => {
//     //   console.log('SW Event:', 'onUpdateFailed');
//     // },
//   });
// }
