import { IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import Logo from 'components/Logo';
import logoviettel from 'images/viettellogo1.png';
import { API_IAM } from 'containers/apiUrl';
import reducer from 'containers/App/reducer';
import saga from 'containers/App/saga';
import sagaNotify from 'containers/ListNotification/saga';
import { logout } from 'containers/Login/actions';
import reducerLogin from 'containers/Login/reducer';
import sagarLogin from 'containers/Login/saga';
// import LocaleToggle from 'containers/LocaleToggle';
import { changeExpandMenu } from 'containers/Menu/actions';
// import NotiPopup from 'containers/MyNotification/popup';
import DropDownButton from 'devextreme-react/drop-down-button';
import React, { memo, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { getApi } from 'utils/requestUtils';
import messages from './messages';
const key = 'app-header';
const ExpandButton = styled(IconButton)`
  && {
    padding: 10px;
    margin-right: 12px;
  }
`;
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;
const SMCHeader = styled.div`
  background-color: var(--bg-header-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 15px;
  box-shadow: 0 10px 30px 0 rgba(82, 63, 105, 0.08);
`;
const RightContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;
const ListUserAction = styled(DropDownButton)`
  height: 34px;
  min-width: 107px;
  position: relative;
  border-radius: 10px;
  // &:hover {
  //   background-color: rgba(0, 0, 0, 0.03);
  //   .dx-dropdownbutton-toggle {
  //     background-color: rgba(0, 0, 0, 0.03) !important;
  //   }
  // }
  .dx-dropdownbutton-action.dx-buttongroup-last-item.dx-button
    .dx-button-content {
    position: relative;
    padding: 0 40px 0 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    grid-gap: 10px;
    background-color: var(--main-second-color);
    border-radius: 10px;
    height: 34px;
    justify-content: flex-end;
  }
  .dx-button-content:after {
    content: '${(props) =>
      props.icon
        ? props.icon
        : props.userName
        ? props.userName.slice(0, 1)
        : ''}';
    background-color: var(--primary-color);
    width: 24px;
    height: 24px;
    position: absolute;
    right: 7px;
    border-radius: 50%;
    color: #fff;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dx-button-content img {
    width: 22px;
    height: 22px;
    border-radius: 50%;
  }
  .dx-dropdownbutton-toggle,
  .dx-buttongroup-item-content {
    border: 0px;
  }
  .dx-dropdownbutton-toggle:hover {
    background-color: rgba(0, 0, 0, 0.03) !important;
  }
  .dx-icon-spindown {
    display: none !important;
  }
  .dx-button-text {
    color: #000;
  }
`;
// const WhiteLocaleToggle = styled.div`
//   .MuiButton-root {
//     color: white;
//   }
// `;
function Header({ onChangeExpandMenu, onLogout }) {
  const { formatMessage } = useIntl();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key: 'notification', saga: sagaNotify });
  useInjectSaga({ key, saga });
  useInjectReducer({ key: 'login', reducer: reducerLogin });
  useInjectSaga({ key: 'login', saga: sagarLogin });
  const history = useHistory();
  const [isExpand, setIsExpand] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: '', image: null });
  const fetchUserInfor = () => {
    getApi(`${API_IAM.CURRENT_USER_DETAIL}`)
      .then((res) => {
        const userInfo = {
          username: res.data.username,
          image: res.data.avatarImageUrl,
        };
        setUserInfo(userInfo);
        window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
        window.localStorage.setItem(
          'userData',
          JSON.stringify(res?.data || []),
        );
      })
      .catch(() => {
        const userInfo = {
          username: window.localStorage.getItem('username'),
          image: null,
        };
        setUserInfo(userInfo);
        window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
      });
  };
  useEffect(() => {
    const checkMenuExpandState = window.localStorage.getItem('menuExpanded');
    if (checkMenuExpandState) {
      onChangeExpandMenu(checkMenuExpandState === 'true');
      setIsExpand(checkMenuExpandState === 'true');
    }
    const info = window.localStorage.getItem('userInfo');
    if (info) {
      setUserInfo(JSON.parse(info));
    } else {
      fetchUserInfor();
    }
  }, []);
  return (
    <SMCHeader id="appHeader">
      <LogoContainer>
        <ExpandButton
          onClick={() => {
            if (!isExpand) {
              setIsExpand((prevState) => {
                window.localStorage.setItem('menuExpanded', !prevState);
                onChangeExpandMenu(!prevState);
                return !prevState;
              });
            } else {
              setIsExpand((prevState) => {
                window.localStorage.setItem('menuExpanded', !prevState);
                onChangeExpandMenu(!prevState);
                return !prevState;
              });
            }
          }}
        >
          {isExpand ? <MenuOpenIcon /> : <MenuIcon />}
        </ExpandButton>
        <img src={logoviettel} alt="logo" style={{maxHeight: '25px'}} />
      </LogoContainer>
      <RightContainer>
        {/* <WhiteLocaleToggle>
        <LocaleToggle />
      </WhiteLocaleToggle> */}
        {/* <NotiPopup /> */}
        <ListUserAction
          dropDownOptions={{
            width: 'inherit',
            minWidth: '220px',
          }}
          useSelectMode={false}
          text={userInfo.username || 'T'}
          userName={userInfo.username || 'T'}
          icon={userInfo.image ? userInfo.image : null}
          items={[
            {
              id: 'PROFILE',
              name: formatMessage(messages.profile),
              icon: 'user',
            },
            {
              id: 'LOGOUT',
              name: formatMessage(messages.logout),
              icon: 'runner',
            },
          ]}
          displayExpr="name"
          keyExpr="id"
          hoverStateEnabled
          activeStateEnabled
          onItemClick={(e) => {
            switch (e.itemData.id) {
              case 'PROFILE':
                history.push(`/profile`);
                break;
              case 'LOGOUT':
                onLogout();
                break;
              default:
                break;
            }
          }}
        />
      </RightContainer>
    </SMCHeader>
  );
}

const mapStateToProps = createStructuredSelector({});
export function mapDispatchToProps(dispatch) {
  return {
    onChangeExpandMenu: (isExpand) => {
      dispatch(changeExpandMenu(isExpand));
    },
    onLogout: () => {
      dispatch(logout());
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Header);
