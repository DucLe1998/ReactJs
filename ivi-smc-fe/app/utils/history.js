import { createBrowserHistory } from 'history';
const history = createBrowserHistory({
  basename: process.env.SMC_DEFAULT_PATH,
});
export default history;
