/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import DateFnsUtils from '@date-io/date-fns';
import { Box, makeStyles } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Header from 'components/Header';
import Page403 from 'containers/403Page/Loadable';
import HomePage from 'containers/HomePage/Loadable';
import LogIn from 'containers/Login/Loadable';
import Menu from 'containers/Menu/Loadable';
import enLocale from 'date-fns/locale/en-GB';
import viLocale from 'date-fns/locale/vi';
// import styles
// import '@sweetalert2/theme-material-ui/material-ui.css';
import 'devextreme/dist/css/dx.common.css';
import { loadMessages, locale } from 'devextreme/localization';
import enMessages from 'devextreme/localization/messages/en.json';
import viMessages from 'devextreme/localization/messages/vi.json';
import 'devextremeStyle.css';
import Cookies from 'js-cookie';
import { SnackbarProvider } from 'notistack';
import React, { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { matchPath, Redirect, Route, Switch } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
// import { checkAuthority } from 'utils/functions';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
// import { makeid } from 'utils/utils';
import 'devextreme/dist/css/dx.light.css';
// import '../../dx.generic.green.css';
import GlobalStyle from '../../global-styles';
import UserAvatar from '../../images/demoimage/profile-pic.jpg';
import '../../styles.css';
import { Page404 } from '../404Page';
import { makeSelectLocale } from '../LanguageProvider/selectors';
// import ListStatistics from '../ListStatistics';
import { makeSelectAuthState, makeSelectCurrentUser } from '../Login/selectors';
import { loadMenu, loadUserAuthority } from '../Menu/actions';
import reducerMenu from '../Menu/reducer';
import sagaMenu from '../Menu/saga';
import {
  makeSelectAllUserAuthority,
  makeSelectIsAuthorityLoaded,
  makeSelectIsDataLoaded,
  makeSelectUserMenuRawData,
} from '../Menu/selectors';
import muiTheme from '../themes';
import { refreshToken } from '../worker';
import reducer from './reducer';
import AppRouters from './routers';
import saga from './saga';
import { makeSelectListNotification } from './selectors';

import { CssBaseline, StyledEngineProvider } from '@mui/material';

const localeMap = {
  vi: viLocale,
  en: enLocale,
};
const localeMessages = {
  vi: viMessages,
  en: enMessages,
};
const key = 'root-app';
const AppWrapper = styled.div`
  display: flex;
  padding: 0px 10px 10px 10px;
  flex-direction: column;
  flex: 1;
  position: relative;
  background-color: var(--page-background-color);
`;
const LayoutRow = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  height: 100%;
  overflow: hidden;
`;

const LayoutColumn = styled.div`
  margin: 0 auto;
  display: flex;
  flex: 1;
  min-height: 100%;
  overflow: auto;
  flex-direction: column;
  background-color: var(--page-background-color);
  overflow: auto;
  &.expand-screen {
    display: none;
  }
`;
const RootContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const useStyles = makeStyles(() => ({
  zIndex: {
    zIndex: 999999,
  },
}));
const CustomSnackbar = (props) => {
  const classes = useStyles();
  return (
    <SnackbarProvider
      {...props}
      classes={{
        containerAnchorOriginTopRight: classes.zIndex,
        containerAnchorOriginBottomRight: classes.zIndex,
      }}
    />
  );
};
export function App({
  userMenus,
  isMenuLoaded,
  isUserAuthorityLoaded,
  userAuthority,
  listNotification,
  authState,
  currentLocale,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useInjectReducer({ key: 'usermenu', reducer: reducerMenu });
  useInjectSaga({ key: 'usermenu', saga: sagaMenu });
  locale(currentLocale);
  loadMessages(localeMessages[currentLocale]);
  const [isExpandScreen] = useState(false);
  const layoutUnauthor = (
    <Switch>
      <Route exact path="/login" component={LogIn} />
      <Route component={LogIn} />
    </Switch>
  );
  const LoadingLayout = (
    <RootContainer>
      <Skeleton variant="rect" height="48px" width="100%" />
      <LayoutRow>
        <Menu />
        {/* <LayoutColumn>
          <Skeleton height="48px" />
          <Box m={3} mb={0} flex={1}>
            <Skeleton variant="rect" height="100%" animation="wave" />
          </Box>
          <Box m={3} mb={0} flex={1}>
            <Skeleton variant="rect" height="100%" animation="wave" />
          </Box>
          <Box m={3} flex={1}>
            <Skeleton variant="rect" height="100%" animation="wave" />
          </Box>
        </LayoutColumn> */}
      </LayoutRow>
    </RootContainer>
  );
  // bypass check permission by menuList

  const pagesNoMenu = ['/', '/profile'];

  const routes = [
    ...AppRouters,
    {
      exact: true,
      path: `/`,
      component: HomePage,
    },
  ];
  // const userMenuChild = userMenus.filter(d => !d.isParent && d.url != '/');
  const ProtectedRoute = memo(
    ({ component: Component, resourceCode, scope, ...rest }) => (
      <Route
        {...rest}
        render={(props) => {
          // need check permission
          const isNotInMenu = pagesNoMenu.find((d) =>
            matchPath(rest.path, {
              path: d,
              exact: true,
            }),
          );
          // const matchMenu =
          //   userMenuChild.length &&
          //   userMenuChild.find(item =>
          //     matchPath(rest.path, {
          //       path: item.url,
          //     }),
          //   );
          const matchMenu = 1;
          let hasPerm = Boolean(matchMenu);
          // if (matchMenu && scope) {
          //   hasPerm = checkAuthority(scope, resourceCode, userAuthority);
          // }
          if (isNotInMenu || hasPerm) {
            return (
              <Component
                {...props}
                // key={makeid(3)}
                userAuthority={userAuthority}
              />
            );
          }
          return <Redirect to="/403" />;
        }}
      />
    ),
  );

  const layoutAuthenticated = (
    <RootContainer>
      <Header avatar={UserAvatar} listNotify={listNotification.rows} />
      <LayoutRow>
        {!isExpandScreen && <Menu />}
        <LayoutColumn
          id="appContentContainer"
          className={isExpandScreen ? 'expand-screen' : ''}
        >
          <AppWrapper
          // style={{ maxHeight: isExpandScreen ? '100%' : 'calc(100% - 61px)' }}
          >
            <Helmet titleTemplate="%s - IVI SMC" defaultTitle="IVI SMC">
              <meta name="description" content="IVI SMC" />
            </Helmet>
            <Switch>
              <Redirect exact from="/home" to="/" />
              {routes.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <ProtectedRoute key={index} {...item} />
              ))}
              <Route path="/403" component={Page403} />
              <Route component={Page404} />
            </Switch>
            <GlobalStyle />
          </AppWrapper>
        </LayoutColumn>
      </LayoutRow>
    </RootContainer>
  );

  useEffect(() => {
    const expiredTime = Cookies.get('expired_time');
    let timer;
    const doRefreshToken = async () => {
      const t = Cookies.get('refresh_token');
      if (t) {
        const timeExpired = await refreshToken(t);
        if (timeExpired) {
          timer = setTimeout(
            doRefreshToken,
            Number(timeExpired) - 2 * 60 * 1000,
          );
        }
      }
    };
    if (expiredTime && authState) {
      const timeToRefresh =
        new Date(Number(expiredTime)) - Date.now() - 2 * 60 * 1000; // refresh before token expired 2 minutes
      if (timeToRefresh <= 0) {
        const t = Cookies.get('refresh_token');
        if (t) {
          timer = setTimeout(doRefreshToken, 100);
        }
      } else {
        timer = setTimeout(doRefreshToken, timeToRefresh);
      }
    }
    return () => {
      clearTimeout(timer);
    };
  }, [authState]);
  return (
    <ThemeProvider theme={muiTheme.red}>
      <CssBaseline />
      <MuiPickersUtilsProvider
        utils={DateFnsUtils}
        locale={localeMap[currentLocale]}
      >
        <CustomSnackbar
          maxSnack={5}
          className="snackbar-noti"
          classes={{ anchorOriginTopRight: 'zIndex' }}
        >
          {authState
            ? isMenuLoaded && isUserAuthorityLoaded
              ? layoutAuthenticated
              : LoadingLayout
            : layoutUnauthor}
          {/* {layoutAuthenticated} */}
        </CustomSnackbar>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  userMenus: makeSelectUserMenuRawData(),
  isMenuLoaded: makeSelectIsDataLoaded(),
  userAuthority: makeSelectAllUserAuthority(),
  isUserAuthorityLoaded: makeSelectIsAuthorityLoaded(),
  listNotification: makeSelectListNotification(),
  authState: makeSelectAuthState(),
  currentLocale: makeSelectLocale(),
});
export function mapDispatchToProps(dispatch) {
  return {
    onLoadMenu: () => {
      dispatch(loadMenu());
    },
    onLoadUserAuthority: () => {
      dispatch(loadUserAuthority());
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(withConnect, memo)(App);
