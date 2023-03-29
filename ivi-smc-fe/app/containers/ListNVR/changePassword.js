/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import Loading from 'containers/Loading/Loadable';
import { Button } from 'devextreme-react/button';
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import ShowIcon from 'images/Icon-Show.svg';
import HideIcon from 'images/Icon-Hide.svg';
import {
  Validator,
  RequiredRule,
  CustomRule,
} from 'devextreme-react/validator';
import {
  RowItem,
  RowLabel,
  RowContent,
} from '../../components/CommonComponent';
import reducer from './reducer';
import saga from './saga';
import sagaCommon from '../Common/sagaCommon';
import reducerCommon from '../Common/reducer';
import { makeSelectEditingItem } from './selectors';
import { loadDetail, changePassword } from './actions';
const key = 'nvr';
//----------------------------------------------------------------
function validatePassword(e) {
  if (!e.value || e.value.length < 8 || e.value.length > 16) return false;
  let count = 0;
  if (/(?=.*[0-9])/.test(e.value)) {
    count++;
  }
  if (/(?=.*[a-z])/.test(e.value)) {
    count++;
  }
  if (/(?=.*[A-Z])/.test(e.value)) {
    count++;
  }
  // if (/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(e.value)) {
  //   count++;
  // }
  return count >= 2;
}
export function ChangePassword({
  loading,
  editingRow,
  onClose,
  onChangePassword,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useInjectReducer({ key: 'common', reducer: reducerCommon });
  useInjectSaga({ key: 'common', saga: sagaCommon });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowPasswordNew, setIsShowPasswordNew] = useState(false);
  const [isShowPasswordConfirm, setIsShowPasswordConfirm] = useState(false);
  const intl = useIntl();
  const editForm = useFormik({
    initialValues: {
      newPassword: '',
      oldPassword: '',
    },
    onSubmit: values => {
      onChangePassword(editingRow.id, {
        newPassword: values.newPassword,
        oldPassword: values.oldPassword,
        confirmNewPassword: values.newpasswordConfirm,
      });
    },
  });

  useEffect(() => {
    // onLoadDetail(editingRow.id);
  }, []);
  return (
    <React.Fragment>
      {loading && <Loading />}
      <form onSubmit={editForm.handleSubmit}>
        {/* <RowItem>
          <RowLabel>Username</RowLabel>
          <RowContent>
            <HeaderText>{detailInfo.information.username}</HeaderText>
          </RowContent>
        </RowItem> */}
        <RowItem errorMargin="35px">
          <RowLabel>
            {intl.formatMessage({
              id: 'app.NVR.old_pasword',
            })}
            <span className="required">*</span>
          </RowLabel>
          <RowContent style={{ position: 'relative' }}>
            <TextBox
              width="100%"
              id="oldPassword"
              name="oldPassword"
              placeholder={intl.formatMessage({
                id: 'app.NVR.password.placeholder',
              })}
              stylingMode="outlined"
              defaultValue=""
              mode={isShowPassword ? 'text' : 'password'}
              className="no-border-button"
              onInput={e => {
                editForm.handleChange(e.event);
              }}
            >
              <TextBoxButton
                name="icon"
                location="after"
                options={{
                  icon: `${isShowPassword ? ShowIcon : HideIcon}`,
                  onClick: () => {
                    setIsShowPassword(prev => !prev);
                  },
                }}
              />
              <Validator>
                <RequiredRule
                  message={intl.formatMessage({
                    id: 'app.NVR.message.require_input',
                  })}
                />
                <CustomRule
                  validationCallback={validatePassword}
                  message={intl.formatMessage({
                    id: 'app.NVR.message.password_invalid',
                  })}
                />
              </Validator>
            </TextBox>
          </RowContent>
        </RowItem>
        <RowItem errorMargin="35px">
          <RowLabel>
            {intl.formatMessage({
              id: 'app.NVR.new_pasword',
            })}
            <span className="required">*</span>
          </RowLabel>
          <RowContent style={{ position: 'relative' }}>
            <TextBox
              width="100%"
              id="newPassword"
              name="newPassword"
              placeholder={intl.formatMessage({
                id: 'app.NVR.password.placeholder',
              })}
              stylingMode="outlined"
              defaultValue=""
              mode={isShowPasswordNew ? 'text' : 'password'}
              className="no-border-button"
              onInput={e => {
                editForm.handleChange(e.event);
              }}
            >
              <TextBoxButton
                name="icon"
                location="after"
                options={{
                  icon: `${isShowPasswordNew ? ShowIcon : HideIcon}`,
                  onClick: () => {
                    setIsShowPasswordNew(prev => !prev);
                  },
                }}
              />
              <Validator>
                <RequiredRule
                  message={intl.formatMessage({
                    id: 'app.NVR.message.require_input',
                  })}
                />
                <CustomRule
                  validationCallback={validatePassword}
                  message={intl.formatMessage({
                    id: 'app.NVR.message.password_invalid',
                  })}
                />
              </Validator>
            </TextBox>
          </RowContent>
        </RowItem>
        <RowItem errorMargin="35px">
          <RowLabel>
            {intl.formatMessage({
              id: 'app.NVR.confirm_pasword',
            })}
            <span className="required">*</span>
          </RowLabel>
          <RowContent style={{ position: 'relative' }}>
            <TextBox
              width="100%"
              id="newpasswordConfirm"
              name="newpasswordConfirm"
              placeholder={intl.formatMessage({
                id: 'app.NVR.confirm_pasword',
              })}
              stylingMode="outlined"
              defaultValue=""
              mode={isShowPasswordConfirm ? 'text' : 'password'}
              className="no-border-button"
              onInput={e => {
                editForm.handleChange(e.event);
              }}
            >
              <TextBoxButton
                name="icon"
                location="after"
                options={{
                  icon: `${isShowPasswordConfirm ? ShowIcon : HideIcon}`,
                  onClick: () => {
                    setIsShowPasswordConfirm(prev => !prev);
                  },
                }}
              />
              <Validator>
                <RequiredRule
                  message={intl.formatMessage({
                    id: 'app.NVR.message.require_input',
                  })}
                />
                <CustomRule
                  validationCallback={validatePassword}
                  message={intl.formatMessage({
                    id: 'app.NVR.message.password_invalid',
                  })}
                />
                <CustomRule
                  validationCallback={e => {
                    if (e.value != editForm.values.newPassword) return false;
                    return true;
                  }}
                  message={intl.formatMessage({
                    id:
                      'boilerplate.containers.LoginPage.confirmPassword.notMatch',
                  })}
                />
              </Validator>
            </TextBox>
          </RowContent>
        </RowItem>
        <RowItem>
          <RowLabel />
          <RowContent className="button-container" justifyContent="flex-end">
            <Button
              id="btnClsoe"
              icon="close"
              text={intl.formatMessage({
                id: 'app.button.close',
              })}
              onClick={onClose}
            />
            <Button
              disabled={
                !editForm.values.oldPassword ||
                !editForm.values.newPassword ||
                !editForm.values.newpasswordConfirm
              }
              id="btnSaveAndContinue"
              icon="check"
              text={intl.formatMessage({
                id: 'app.button.save',
              })}
              type="default"
              useSubmitBehavior
            />
          </RowContent>
        </RowItem>
      </form>
    </React.Fragment>
  );
}

ChangePassword.propTypes = {
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  detailInfo: makeSelectEditingItem(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadDetail: id => dispatch(loadDetail(id)),
    onChangePassword: (id, data) => dispatch(changePassword(id, data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ChangePassword);
