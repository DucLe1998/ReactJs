import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import styled from 'styled-components';
import PageErrorBackground from '../../images/pageErrorBackground.svg';
import Icon403 from '../../images/403Icon.png';
import { makeSelectUserMenu } from '../Menu/selectors';

const Container = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
`;
const ButtonBack = styled.div`
  cursor: pointer;
  width: 223px;
  border-radius: 15px;
  color: #fff;
  background-color: #21326f;
  text-transform: uppercase;
  padding: 7px 13px;
  font-size: 16px;
  margin: auto;
  &&:hover {
    background-color: #21326fe6;
  }
`;
export function Page403({ userMenus }) {
  const history = useHistory();
  const defaultMenu = '/';
  const defaultMenuText = 'Trang chủ';
  // if (userMenus.length > 0) {
  //   if (userMenus[0].functionUrl && userMenus[0].functionUrl != '#') {
  //     defaultMenu = userMenus[0].functionUrl;
  //   } else if (userMenus[0].children && userMenus[0].children.length > 0) {
  //     defaultMenu = userMenus[0].children[0].functionUrl;
  //   }
  //   defaultMenuText = userMenus[0].functionName;
  // }
  return (
    <Container style={{ background: `url(${PageErrorBackground})` }}>
      <h2> KHÔNG CÓ QUYỀN TRUY CẬP</h2>
      <h4>
        Tài khoản của bạn không đủ điều kiện hoặc không được cấp quyền truy cập
        chức năng này. Vui lòng liên hệ với admin để được hỗ trợ!
      </h4>
      {userMenus.length > 0 ? (
        <ButtonBack
          onClick={() => {
            history.push(defaultMenu);
          }}
        >
          Quay lại {defaultMenuText}
        </ButtonBack>
      ) : null}
      <img src={Icon403} alt="403" />
    </Container>
  );
}

const mapStateToProps = createStructuredSelector({
  userMenus: makeSelectUserMenu(),
});

export function mapDispatchToProps() {
  return {};
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Page403);
