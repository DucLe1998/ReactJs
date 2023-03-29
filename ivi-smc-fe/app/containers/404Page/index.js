import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import styled from 'styled-components';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import reducerMenu from 'containers/Menu/reducer';
import sagaMenu from 'containers/Menu/saga';
import PageErrorBackground from '../../images/pageErrorBackground.svg';
import { makeSelectUserMenu } from '../Menu/selectors';
import Icon404 from '../../images/Icon404.svg';
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
export function Page404({ userMenus }) {
  useInjectReducer({ key: 'usermenu', reducer: reducerMenu });
  useInjectSaga({ key: 'usermenu', saga: sagaMenu });
  const history = useHistory();
  let defaultMenu = '/';
  let defaultMenuText = 'Trang chủ';
  if (userMenus && userMenus.length > 0) {
    if (userMenus[0].functionUrl && userMenus[0].functionUrl != '#') {
      defaultMenu = userMenus[0].functionUrl;
    } else if (userMenus[0].children && userMenus[0].children.length > 0) {
      defaultMenu = userMenus[0].children[0].functionUrl;
    }
    defaultMenuText = userMenus[0].functionName;
  }
  return (
    <Container style={{ background: `url(${PageErrorBackground})` }}>
      <h2> KHÔNG TÌM THẤY TRANG</h2>
      <h4>
        Chúng tôi không tìm thấy trang bạn yêu cầu. Vui lòng kiểm tra lại đường
        dẫn URL hoặc quay lại vào một thời điểm khác
      </h4>
      {userMenus && userMenus.length > 0 ? (
        <ButtonBack
          onClick={() => {
            history.push(process.env.SMC_DEFAULT_PATH + defaultMenu);
          }}
        >
          Quay lại {defaultMenuText}
        </ButtonBack>
      ) : null}
      <img
        src={Icon404}
        style={{ marginTop: '20px', marginRight: '-135px' }}
        alt="404"
      />
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

export default compose(withConnect)(Page404);
