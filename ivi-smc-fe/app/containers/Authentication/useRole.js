import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { callApiWithConfig, METHODS } from 'utils/requestUtils';
import { getUserInfo } from 'utils/functions';
import { makeSelectUserAuthority } from 'containers/Menu/selectors';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import reducerCommon from '../Common/reducer';
import sagaCommon from '../Common/sagaCommon';

function useRole( listRole2, functioncode, roleCode) {
  useInjectReducer({ key: 'menu', reducer: reducerCommon });
  useInjectSaga({ key: 'menu', saga: sagaCommon });
  const cache = useRef({});
  const [isOnline, setIsOnline] = useState(null);
  const [listRole, setListRole] = useState({ dataAuthorities: [], root: false });
  console.log('listRole......', listRole);
  // const userInfo = getUserInfo();
  // const getUserRole = useMemo(() => {
  //   console.log('call api..............');

  // }, []);
  // useEffect(() => {
  //   if (!cache) {
  //     console.log('call api..............');
  //     callApiWithConfig(
  //       'http://technopark.dev.vsm.net/tnp/iam/api/v0/users/me/authority',
  //       METHODS.GET,
  //       null,
  //       {},
  //     )
  //       .then(response => {
  //         setListRole(response.data);
  //         cache.data = response.data;
  //       })
  //       .catch(err => {
  //         console.log('aaaaaaa', err);
  //       });
  //   }
  // }, []);
  const a =
    listRole.dataAuthorities.length > 0
      ? listRole.dataAuthorities
      : cache.data
        ? cache.data.dataAuthorities
        : [];
  return (
    a.findIndex(
      item => item.resourceCode == functioncode && item.scope == roleCode,
    ) >= 1
  );
}
const mapStateToProps = createStructuredSelector({
  listRole2: makeSelectUserAuthority(),
});

export function mapDispatchToProps(dispatch) {
  return {
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(useRole);
