/**
 *
 * UpdatePassword
 *
 */

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box';
import { Alert } from '@material-ui/lab';
import styled from 'styled-components';
import LoginImg from 'images/logotnp.svg';
import BackgroundImg from 'images/background.svg';
import HideIcon from 'images/Icon-Hide.svg';
import ShowIcon from 'images/Icon-Show.svg';
import LoginImgSmall from 'images/logo.svg';
import Swal from 'sweetalert2';
import {
  makeSelectLoading,
  makeSelectApiMessage,
  makeSelectError,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import Loading from '../Loading';
import { clearError, updatePassword } from './actions';

const Container = styled.div`
  width: 100%;
  background-image: url('${BackgroundImg}');
  background-size: cover;
  display: flex;
`;
const LoginContainer = styled.div`
  & {
    display: flex;
    margin: auto;
    width: 873px;
    box-shadow: -5px 2px 50px 8px rgba(0, 0, 0, 0.25);
    flex-direction: row;
    border-radius: 20px
  }
  @media (max-width: 900px) {
    & {
      flex-direction: column;
      max-width: 34.5rem;
    }
  }
}
`;
const LogoImageDesktop = styled.div`
  & {
    flex: 1;
    align-self: center;
    text-align: center;
    border-radius: 20px;
  }
  @media (max-width: 900px) {
    & {
      display: none;
    }
  }
`;
const LoginFormContainer = styled.div`
  & {
    flex-basis: 65%;
    min-height: 606px;
    padding: 80px;
    background-color: #fff;
    border-radius: 0px 20px 20px 0px;
  }
  @media (max-width: 900px) {
    & {
      border-radius: 20px;
    }
  }
`;
const LogoImageMobile = styled.div`
  text-align: center;
  @media (min-width: 900px) {
    & {
      display: none;
    }
  }
`;
const LoginForm = styled.div`
  & .item {
    width: 100%;
    padding: 0 10px;
    margin-top: 6px;
    background: #f6f6f6;
    border: 1px solid #dddddd;
    box-sizing: border-box;
    border-radius: 23px;
  }
  .error {
    border: 1px solid red !important;
  }
  & .item .dx-button-mode-contained {
    background-color: inherit;
    border: none;
  }
`;

const FormTitle = styled.div`
  margin: 0px;
  text-align: center;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 42px;
  color: rgba(0, 0, 0, 0.8);
  & button {
    border: none;
    margin-right: 25px;
    background-color: #fff;
    cursor: pointer;
  }
`;

const Label = styled.div`
  & {
    margin-top: 24px;
    height: 18px;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
    color: #999999;
  }
`;

const SubmitButton = styled.div`
  margin-top: 52px;
  & .normal {
    display: block;
    width: 200px;
    height: 44px;
    margin: auto;
    border-radius: 73px;
    opacity: 1;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #fff;
  }
  & .disable {
    background: rgba(60, 60, 67, 0.3);
  }
  & .submit {
    background: radial-gradient(
      141.67% 286.21% at 58.1% -75.93%,
      #117b5b 0%,
      #00695c 100%
    );
    box-shadow: 0px 14px 34px rgba(12, 109, 56, 0.15),
      0px 4.32003px 11px rgba(12, 109, 56, 0.14);
  }
  & .dx-state-disabled .dx-button .dx-button-text,
  .dx-state-disabled.dx-button .dx-button-text {
    opacity: 1;
  }
`;

const ErrorText = styled.span`
  margin-top: 6px;
  font-family: Roboto;
  font-style: italic;
  font-weight: normal;
  font-size: 13px;
  line-height: 15px;
  color: #ff0000;
`;

const key = 'updatePassword';
const passwordPattern = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
);

export function UpdatePassword({
  onUpdatePassword,
  loading,
  error,
  onClearError,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const intl = useIntl();
  const [isValidForm, setIsValidForm] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isMatchPassword, setIsMatchPassword] = useState(true);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {},
    // We've added a validate function
    validate() {
      const errors = {};
      // Required
      if (!formik.values.password && formik.touched.password) {
        errors.password = 'Required';
      }
      if (!formik.values.confirmPassword && formik.touched.confirmPassword) {
        errors.confirmPassword = 'Required';
      }
      // Pattern password
      if (
        !passwordPattern.test(formik.values.password) &&
        formik.touched.password
      ) {
        errors.invalidPassword = '';
        setIsValidPassword(false);
      } else {
        setIsValidPassword(true);
      }
      // is confirm password match
      if (
        formik.values.password !== formik.values.confirmPassword &&
        formik.touched.password &&
        formik.touched.confirmPassword
      ) {
        errors.matched = '';
        setIsMatchPassword(false);
      } else {
        setIsMatchPassword(true);
      }

      if (Object.keys(errors).length === 0) {
        setIsValidForm(true);
      } else {
        setIsValidForm(false);
      }
      return errors;
    },
    onSubmit: (values) => {
      onUpdatePassword({
        newPassword: values.password,
        confirmationCode: values.confirmationCode,
        successMessage: intl.formatMessage({
          id: 'boilerplate.containers.UpdatePasswordPage.success.message',
        }),
      });
    },
  });

  if (error) {
    Swal.fire({
      title: 'Có lỗi xảy ra',
      text: error,
      icon: 'info',
      imageWidth: 213,
      dangerMode: true,
      showCancelButton: false,
      showCloseButton: true,
      showConfirmButton: true,
      focusConfirm: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không',
      customClass: {
        content: 'content-class',
      },
    }).then(() => {
      onClearError();
    });
  }
  return (
    <Container>
      <LoginContainer>
        {loading && <Loading />}
        <LogoImageDesktop>
          <img src={LoginImg} alt="" />
        </LogoImageDesktop>
        <LoginFormContainer>
          <LoginForm>
            <FormTitle>
              {intl.formatMessage({
                id: 'boilerplate.containers.UpdatePasswordPage.title',
              })}
            </FormTitle>
            <LogoImageMobile>
              <img src={LoginImgSmall} alt="" />
            </LogoImageMobile>
            <form onSubmit={formik.handleSubmit}>
              <Label>
                {intl.formatMessage({
                  id: 'boilerplate.containers.UpdatePasswordPage.confirmationCode.label',
                })}
              </Label>
              <TextBox
                id="confirmationCode"
                name="confirmationCode"
                placeholder={intl.formatMessage({
                  id: 'boilerplate.containers.LoginPage.inputText',
                })}
                stylingMode="outlined"
                className={`item ${error ? 'error' : ''}`}
                defaultValue=""
                mode="text"
                showClearButton
                onInput={(e) => {
                  onClearError();
                  formik.handleChange(e.event);
                }}
                onValueChanged={(e) => {
                  if (e.value === '') {
                    // case clear button
                    setIsValidForm(false);
                  }
                }}
              />
              <Label>
                {intl.formatMessage({
                  id: 'boilerplate.containers.UpdatePasswordPage.newPassword.label',
                })}
              </Label>
              <TextBox
                id="password"
                name="password"
                placeholder={intl.formatMessage({
                  id: 'boilerplate.containers.LoginPage.inputText',
                })}
                stylingMode="outlined"
                className={`item ${!isValidPassword ? 'error' : ''}`}
                defaultValue=""
                mode={`${isShowPassword ? 'text' : 'password'}`}
                onInput={(e) => {
                  formik.touched.password = true;
                  formik.handleChange(e.event);
                }}
              >
                <TextBoxButton
                  name="icon"
                  location="after"
                  options={{
                    icon: `${isShowPassword ? ShowIcon : HideIcon}`,
                    onClick: () => {
                      setIsShowPassword(!isShowPassword);
                    },
                  }}
                />
              </TextBox>
              {!isValidPassword && (
                <Alert severity="error" style={{ marginTop: '16px' }}>
                  {intl.formatMessage({
                    id: 'boilerplate.containers.UpdatePasswordPage.invalid.newPassword.format',
                  })}
                </Alert>
              )}
              <Label>
                {intl.formatMessage({
                  id: 'boilerplate.containers.UpdatePasswordPage.confirmPassword.label',
                })}
              </Label>
              <TextBox
                id="confirmPassword"
                name="confirmPassword"
                placeholder={intl.formatMessage({
                  id: 'boilerplate.containers.LoginPage.inputText',
                })}
                stylingMode="outlined"
                className={`item ${!isMatchPassword ? 'error' : ''}`}
                defaultValue=""
                mode={`${isShowConfirmPassword ? 'text' : 'password'}`}
                onInput={(e) => {
                  formik.touched.confirmPassword = true;
                  formik.handleChange(e.event);
                }}
              >
                <TextBoxButton
                  name="icon"
                  location="after"
                  options={{
                    icon: `${isShowConfirmPassword ? ShowIcon : HideIcon}`,
                    onClick: () => {
                      setIsShowConfirmPassword(!isShowConfirmPassword);
                    },
                  }}
                />
              </TextBox>
              {!isMatchPassword && (
                <ErrorText>
                  {intl.formatMessage({
                    id: 'boilerplate.containers.UpdatePasswordPage.confirmPassword.notMatch',
                  })}
                </ErrorText>
              )}
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <SubmitButton
                  disabled={!isValidForm}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {intl.formatMessage({
                    id: 'boilerplate.containers.UpdatePasswordPage.submit.button',
                  })}
                </SubmitButton>
              </div>
            </form>
          </LoginForm>
        </LoginFormContainer>
      </LoginContainer>
    </Container>
  );
}

UpdatePassword.propTypes = {};

const mapStateToProps = createStructuredSelector({
  apiMessage: makeSelectApiMessage(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

function mapDispatchToProps(dispatch) {
  return {
    onUpdatePassword: (evt) => {
      dispatch(updatePassword(evt));
    },
    onClearError: () => {
      dispatch(clearError());
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(UpdatePassword);
