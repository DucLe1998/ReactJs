import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import LoginImg from 'images/logo.svg';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectApiMessage,
  makeSelectCurrentUser,
  makeSelectEmail,
  makeSelectErrorLoginMessage,
  makeSelectFirstLoginAPIMessage,
  makeSelectFormType,
  makeSelectIsFirstLogin,
  makeSelectLoading,
} from './selectors';
import { makeSelectUserMenu } from '../Menu/selectors';
import {
  clearApiMessage,
  clearEmail,
  clearLoginErrorMessage,
  forgotPassword,
  login,
  changeTmpPassword,
  setFormType,
} from './actions';
import 'animate.css';
import Loading from '../Loading';
import {
  Container,
  LoginContainer,
  LoginFormContainer,
  LogoImageDesktop,
} from './style';
import { FORM_TYPE } from './constants';
import FormLogin from './loginForm';
import FormForgotPassword from './forgotPasswordForm';
import ChangePasswordForm from './changePasswordForm';
import ChangeTmpPassword from './changeTmpPasswordForm';
// import LocaleToggle from '../LocaleToggle';
const key = 'login';
export function LogIn({ loading, formType }) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  return (
    <Container>
      <LoginContainer>
        {loading && <Loading />}
        
        <LoginFormContainer>
          {formType === FORM_TYPE.LOGIN && <FormLogin />}
          {formType === FORM_TYPE.FORGOT_PASSWORD && <FormForgotPassword />}
          {formType === FORM_TYPE.CHANGE_PASSWORD && <ChangePasswordForm />}
          {formType === FORM_TYPE.CHANGE_TMP_PASSWORD && <ChangeTmpPassword />}
          {/* <div style={{ textAlign: 'center', paddingTop: '24px' }}>
              <LocaleToggle />
            </div> */}
        </LoginFormContainer>
      </LoginContainer>
    </Container>
  );
}

LogIn.propTypes = {};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  errorLogin: makeSelectErrorLoginMessage(),
  userMenus: makeSelectUserMenu(),
  loading: makeSelectLoading(),
  apiMessage: makeSelectApiMessage(),
  email: makeSelectEmail(),
  isFirstLogin: makeSelectIsFirstLogin(),
  firstLoginAPIMessage: makeSelectFirstLoginAPIMessage(),
  formType: makeSelectFormType(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onClickLogin: (evt) => {
      dispatch(login(evt));
    },
    onSendmailForgotpassword: (evt) => {
      dispatch(forgotPassword(evt));
    },
    onClearEmail: () => {
      dispatch(clearEmail());
    },
    onClearApiMessage: () => {
      dispatch(clearApiMessage());
    },
    onClearErrorLoginMessage: () => {
      dispatch(clearLoginErrorMessage());
    },
    onChangeTmpPassword: (data) => {
      dispatch(changeTmpPassword(data));
    },
    onChangeForm: (form) => {
      dispatch(setFormType(form));
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(LogIn);
