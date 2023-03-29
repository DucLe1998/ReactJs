import React, { useEffect, useState } from 'react';
import HideIcon from 'images/Icon-Hide.svg';
import ShowIcon from 'images/Icon-Show.svg';

import {
  Box,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  makeStyles,
} from '@material-ui/core';
import { Button as TextBoxButton, TextBox } from 'devextreme-react/text-box';
import { useIntl } from 'react-intl';
import { Button } from 'devextreme-react/button';
import { useFormik } from 'formik';
import DateBox from 'devextreme-react/date-box';
import { ChangePasswordForm, ErrorText, Label } from './style';
import Loading from '../Loading';
import { PASSWORD_PATTERN } from '../Login/constants';
import messages from './messages';
import { API_IAM } from '../apiUrl';
import { getApiCustom, patchApi, showError } from '../../utils/requestUtils';
import { showSuccess } from '../../utils/toast-utils';

const useStyles = makeStyles({
  titleProfile: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 0,
  },
  titleDialog: {
    fontSize: 20,
    fontWeight: 500,
    margin: 0,
  },
  marginCardTitleJob: {
    margin: '30px 0',
    padding: '25px 15px',
  },
  floatRight: {
    float: 'right',
  },
  changePassword: {
    marginTop: 10,
    color: 'white',
    textTransform: 'uppercase',
    background:
      'radial-gradient(141.67% 286.21% at 58.1% -75.93%, #117B5B 0%, #00695C 100%)',
    boxShadow:
      '0px 14px 34px rgba(12, 109, 56, 0.15), 0px 4.32003px 11px rgba(12, 109, 56, 0.14)',
    borderRadius: 73,
  },
  confirmChangePassword: {
    background:
      'radial-gradient(141.67% 286.21% at 58.1% -75.93%, #117B5B 0%, #00695C 100%)',
    border: '1px solid #DDDDDD',
    boxSizing: 'border-box',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: '12px 16px',
  },
  cancelChangePassword: {
    background: '#E2E2E2 !important',
    border: '1px solid #DDDDDD',
    boxSizing: 'border-box',
    color: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: '12px 16px',
  },
  divChangePassword: {
    textAlign: 'right',
    width: '100%',
  },
  dialog: {
    padding: '20px 50px',
  },
  italicParagraph: {
    fontWeight: 500,
    fontSize: 14,
    fontStyle: 'italic',
  },
  textDanger: {
    color: '#E24545',
  },
  marginTextBoxChange: {
    marginTop: '10px',
  },
});

const initialValues = {
  message: '',
  error: false,
  touch: false,
};

export default function Profile() {
  const classes = useStyles();
  const intl = useIntl();

  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [profile, setProfile] = useState({});

  const [passwordOld, setPasswordOld] = useState(initialValues);
  const [passwordNew, setPasswordNew] = useState(initialValues);
  const [passwordConfirm, setPasswordConfirm] = useState(initialValues);

  const [isShowPasswordOld, setIsShowPasswordOld] = useState(false);
  const [isShowPasswordNew, setIsShowPasswordNew] = useState(false);
  const [isShowPasswordConfirm, setIsShowPasswordConfirm] = useState(false);

  const resetFormChangePassword = () => {
    setIsShowPasswordOld(false);
    setIsShowPasswordNew(false);
    setIsShowPasswordConfirm(false);
    setPasswordOld(initialValues);
    setPasswordNew(initialValues);
    setPasswordConfirm(initialValues);
    changePWForm.values.oldPassword = '';
    changePWForm.values.newPassword = '';
    changePWForm.values.confirmPassword = '';
  };
  const cancelChangePW = () => {
    resetFormChangePassword();
    setOpen(false);
  };
  const confirmChangePW = () => {
    const { oldPassword } = changePWForm.values;
    const { newPassword } = changePWForm.values;
    const { confirmPassword } = changePWForm.values;

    const oldError = validate(oldPassword, passwordOld, setPasswordOld);
    const newError = validate(newPassword, passwordNew, setPasswordNew);
    const confirmError = validate(
      confirmPassword,
      passwordConfirm,
      setPasswordConfirm,
    );

    if (oldError || newError || confirmError) {
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordConfirm({
        touch: true,
        error: true,
        message: 'Mật khẩu mới chưa khớp, vui lòng kiểm tra lại',
      });
      return;
    }
    const payload = {
      currentPassword: changePWForm.values.oldPassword,
      newPassword: changePWForm.values.newPassword,
    };
    setIsLoading(true);
    patchApi(API_IAM.PROFILE_CHANGE_PASSWORD, payload)
      .then(() => {
        setIsLoading(false);
        cancelChangePW();
        showSuccess('Thay đổi mật khẩu thành công');
      })
      .catch(error => {
        setIsLoading(false);
        if (error?.response?.data?.error === 'NEW_PASSWORD_SAME_OLD') {
          setPasswordConfirm({
            touch: true,
            error: true,
            message: 'Mật khẩu mới phải khác với mật khẩu hiện tại',
          });
        } else {
          setPasswordConfirm({
            touch: true,
            error: true,
            message: error?.response?.data?.message,
          });
        }
      });
  };

  const validate = (value, data, setData) => {
    let message = '';
    let error = false;
    if (value.trim().length === 0) {
      message = 'Mật khẩu không được để trống';
      error = true;
    }
    if (!PASSWORD_PATTERN.test(value)) {
      message = 'Thông tin sai định dạng, vui lòng kiểm tra lại';
      error = true;
    }
    setData({
      ...data,
      touch: true,
      error,
      message,
    });
    return error;
  };

  const changePWForm = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    setIsLoading(true);
    getApiCustom(
      {
        url: API_IAM.PROFILE,
      },
      res => {
        setIsLoading(false);
        setProfile(res);
      },
      err => {
        setIsLoading(false);
        showError(err);
      },
    );
  }, []);

  const renderChangePassword = () => (
    <div className={classes.divChangePassword}>
      <Button
        id="changePassword"
        className={classes.changePassword}
        text={intl.formatMessage(messages.changePassword)}
        onClick={() => {
          setOpen(true);
        }}
      />
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={() => {
          // setOpen(false);
        }}
        aria-labelledby="dialog-change-password"
      >
        <DialogContent>
          <div className={classes.dialog}>
            <p className={classes.titleDialog}>
              {intl.formatMessage(messages.changePassword)}
            </p>
            <p className={classes.italicParagraph}>
              <span className={classes.textDanger}>
                {intl.formatMessage(messages.notice)}
              </span>
              {intl.formatMessage(messages.textNotice)}
            </p>
            <ChangePasswordForm>
              <form onSubmit={changePWForm.handleSubmit}>
                <TextBox
                  className={classes.marginTextBoxChange}
                  id="oldPassword"
                  name="oldPassword"
                  placeholder={intl.formatMessage(messages.oldPassword)}
                  stylingMode="outlined"
                  defaultValue=""
                  mode={`${isShowPasswordOld ? 'text' : 'password'}`}
                  onValueChanged={e => {
                    validate(e.value, passwordOld, setPasswordOld);
                    changePWForm.values.oldPassword = e.value;
                  }}
                >
                  <TextBoxButton
                    name="icon"
                    options={{
                      icon: `${isShowPasswordOld ? ShowIcon : HideIcon}`,
                      onClick: () => {
                        setIsShowPasswordOld(!isShowPasswordOld);
                      },
                    }}
                  />
                </TextBox>
                {passwordOld.touch && passwordOld.error && (
                  <ErrorText>{passwordOld.message}</ErrorText>
                )}
                <TextBox
                  className={classes.marginTextBoxChange}
                  id="newPassword"
                  name="newPassword"
                  placeholder={intl.formatMessage(messages.newPassword)}
                  stylingMode="outlined"
                  defaultValue=""
                  mode={`${isShowPasswordNew ? 'text' : 'password'}`}
                  onValueChanged={e => {
                    const passwordNewError = validate(
                      e.value,
                      passwordNew,
                      setPasswordNew,
                    );
                    const { confirmPassword } = changePWForm.values;
                    if (confirmPassword.length > 0) {
                      const passwordConfirmError = validate(
                        confirmPassword,
                        passwordConfirm,
                        setPasswordConfirm,
                      );
                      if (!passwordConfirmError && !passwordNewError) {
                        if (confirmPassword !== e.value) {
                          setPasswordConfirm({
                            touch: true,
                            error: true,
                            message:
                              'Mật khẩu mới chưa khớp, vui lòng kiểm tra lại',
                          });
                        }
                      }
                    }

                    changePWForm.values.newPassword = e.value;
                  }}
                >
                  <TextBoxButton
                    name="icon"
                    location="after"
                    options={{
                      icon: `${isShowPasswordNew ? ShowIcon : HideIcon}`,
                      onClick: () => {
                        setIsShowPasswordNew(!isShowPasswordNew);
                      },
                    }}
                  />
                </TextBox>
                {passwordNew.touch && passwordNew.error && (
                  <ErrorText>{passwordNew.message}</ErrorText>
                )}
                <TextBox
                  className={classes.marginTextBoxChange}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder={intl.formatMessage(messages.confirmPassword)}
                  stylingMode="outlined"
                  defaultValue=""
                  mode={`${isShowPasswordConfirm ? 'text' : 'password'}`}
                  onValueChanged={e => {
                    const passwordConfirmError = validate(
                      e.value,
                      passwordConfirm,
                      setPasswordConfirm,
                    );
                    const { newPassword } = changePWForm.values;
                    if (newPassword.length > 0) {
                      const passwordNewError = validate(
                        newPassword,
                        passwordNew,
                        setPasswordNew,
                      );
                      if (!passwordConfirmError && !passwordNewError) {
                        if (newPassword !== e.value) {
                          setPasswordConfirm({
                            touch: true,
                            error: true,
                            message:
                              'Mật khẩu mới chưa khớp, vui lòng kiểm tra lại',
                          });
                        }
                      }
                    }
                    changePWForm.values.confirmPassword = e.value;
                  }}
                >
                  <TextBoxButton
                    name="icon"
                    location="after"
                    options={{
                      icon: `${isShowPasswordConfirm ? ShowIcon : HideIcon}`,
                      onClick: () => {
                        setIsShowPasswordConfirm(!isShowPasswordConfirm);
                      },
                    }}
                  />
                </TextBox>
                {passwordConfirm.touch && passwordConfirm.error && (
                  <ErrorText>{passwordConfirm.message}</ErrorText>
                )}
                <DialogActions>
                  <Button
                    id="btnCancel"
                    className={classes.cancelChangePassword}
                    onClick={cancelChangePW}
                  >
                    {intl.formatMessage({
                      id: 'app.button.cancel',
                    })}
                  </Button>
                  <Button
                    id="btnConfirm"
                    className={classes.confirmChangePassword}
                    onClick={confirmChangePW}
                  >
                    {intl.formatMessage({
                      id: 'boilerplate.containers.accessControlDevices.agree',
                    })}
                  </Button>
                </DialogActions>
              </form>
            </ChangePasswordForm>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div>
      {isLoading && <Loading />}
      {!['LDAP', 'VIN3S'].includes(profile?.identityProviderType) &&
        renderChangePassword()}
      <Box>
        <Card className={classes.marginCardTitleJob}>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={4}>
                <p className={classes.titleProfile}>
                  {intl.formatMessage(messages.profile)}
                </p>
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.fullName)}</Label>
                <TextBox
                  disabled
                  id="fullname"
                  name="fullname"
                  placeholder={intl.formatMessage(messages.fullName)}
                  stylingMode="outlined"
                  mode="text"
                  value={profile?.fullName}
                />
              </Grid>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.employeeCode)}</Label>
                <TextBox
                  disabled
                  id="codeEmployee"
                  name="codeEmployee"
                  placeholder={intl.formatMessage(messages.employeeCode)}
                  stylingMode="outlined"
                  value={profile?.employeeCode}
                  mode="text"
                />
              </Grid>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.masterCode)}</Label>
                <TextBox
                  disabled
                  id="masterCode"
                  name="masterCode"
                  placeholder={intl.formatMessage(messages.masterCode)}
                  stylingMode="outlined"
                  value={profile?.accessCode}
                  mode="text"
                />
              </Grid>
            </Grid>
          </Grid>
        </Card>
        <Card className={classes.marginCardTitleJob}>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={4}>
                <p className={classes.titleProfile}>
                  {intl.formatMessage(messages.jobProfile)}
                </p>
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.policyInformation)}</Label>
                <TextBox
                  disabled
                  id="profileManager"
                  name="profileManager"
                  placeholder={intl.formatMessage(messages.policyInformation)}
                  stylingMode="outlined"
                  value={profile?.juridicalStatus}
                  mode="text"
                />
              </Grid>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.pl)}</Label>
                <TextBox
                  disabled
                  id="PL"
                  name="PL"
                  placeholder={intl.formatMessage(messages.pl)}
                  stylingMode="outlined"
                  value={profile?.pandL}
                  mode="text"
                />
              </Grid>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.banchuoikhoi)}</Label>
                <TextBox
                  disabled
                  id="blockChainBoard"
                  name="blockChainBoard"
                  placeholder={intl.formatMessage(messages.banchuoikhoi)}
                  stylingMode="outlined"
                  value={profile?.band}
                  mode="text"
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.phongvungmien)}</Label>
                <TextBox
                  disabled
                  id="regionalRoom"
                  name="regionalRoom"
                  placeholder={intl.formatMessage(messages.phongvungmien)}
                  stylingMode="outlined"
                  value={profile?.area}
                  mode="text"
                />
              </Grid>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.memberUnit)}</Label>
                <TextBox
                  disabled
                  id="memberUnit"
                  name="memberUnit"
                  placeholder={intl.formatMessage(messages.memberUnit)}
                  stylingMode="outlined"
                  value={profile?.childCompany}
                  mode="text"
                />
              </Grid>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.phongbophannhom)}</Label>
                <TextBox
                  disabled
                  id="groupDepartmentRoom"
                  name="groupDepartmentRoom"
                  placeholder={intl.formatMessage(messages.phongbophannhom)}
                  stylingMode="outlined"
                  value={profile?.department}
                  mode="text"
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.nhomchucdanh)}</Label>
                <TextBox
                  disabled
                  id="titleGroup"
                  name="titleGroup"
                  placeholder={intl.formatMessage(messages.nhomchucdanh)}
                  stylingMode="outlined"
                  value={profile?.titleGroup}
                  mode="text"
                />
              </Grid>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.chucdanh)}</Label>
                <TextBox
                  disabled
                  id="title"
                  name="title"
                  placeholder={intl.formatMessage(messages.chucdanh)}
                  stylingMode="outlined"
                  value={profile?.company?.positionName || profile?.title}
                  mode="text"
                />
              </Grid>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.level)}</Label>
                <TextBox
                  disabled
                  id="rank"
                  name="rank"
                  placeholder={intl.formatMessage(messages.level)}
                  stylingMode="outlined"
                  value={profile?.rank}
                  mode="text"
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.typeEmployee)}</Label>
                <TextBox
                  disabled
                  id="employeeClassification"
                  name="employeeClassification"
                  placeholder={intl.formatMessage(messages.typeEmployee)}
                  stylingMode="outlined"
                  value={profile?.employeeGroup}
                  mode="text"
                />
              </Grid>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.landlinePhone)}</Label>
                <TextBox
                  disabled
                  id="landlinePhoneNumber"
                  name="landlinePhoneNumber"
                  placeholder={intl.formatMessage(messages.landlinePhone)}
                  stylingMode="outlined"
                  value={profile?.workPhone}
                  mode="text"
                />
              </Grid>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.phone)}</Label>
                <TextBox
                  disabled
                  id="mobilePhoneNumber"
                  name="mobilePhoneNumber"
                  placeholder={intl.formatMessage(messages.phone)}
                  stylingMode="outlined"
                  value={profile?.mobile}
                  mode="text"
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.email)}</Label>
                <TextBox
                  disabled
                  id="email"
                  name="email"
                  placeholder={intl.formatMessage(messages.email)}
                  stylingMode="outlined"
                  value={profile?.email}
                  mode="text"
                />
              </Grid>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.dateInOrg)}</Label>
                <DateBox
                  disabled
                  id="dateEnteringCorporation"
                  name="dateEnteringCorporation"
                  type="date"
                  placeholder={intl.formatMessage(messages.dateInOrg)}
                  displayFormat="dd/MM/yyyy"
                  value={profile?.incEntryDate}
                  showClearButton={false}
                />
              </Grid>
              <Grid item xs={4}>
                <Label>{intl.formatMessage(messages.dateInCompany)}</Label>
                <DateBox
                  disabled
                  id="dateOnCompany"
                  name="dateOnCompany"
                  type="date"
                  placeholder={intl.formatMessage(messages.dateInCompany)}
                  displayFormat="dd/MM/yyyy"
                  value={profile?.companyEntryDate}
                  showClearButton={false}
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={12}>
                <Label>{intl.formatMessage(messages.address)}</Label>
                <TextBox
                  disabled
                  id="actualWorkingAddress"
                  name="actualWorkingAddress"
                  placeholder={intl.formatMessage(messages.address)}
                  stylingMode="outlined"
                  value={profile?.address}
                  mode="text"
                />
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </div>
  );
}
