import {
  Card,
  CardContent,
  Checkbox,
  Grid,
  Switch,
  Typography,
} from '@material-ui/core';
import { TextBox } from 'devextreme-react/text-box';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import SelectBox from 'devextreme-react/select-box';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { Popup } from 'devextreme-react/popup';
import { addMonths } from 'date-fns';
import moment from 'moment';
import clsx from 'clsx';
import messages from '../messages';
import { Label } from '../../Login/style';
import { useStyles } from '../style';
import {
  EMAIL_PATTERN,
  PASSWORD_PATTERN,
  PHONE_PATTERN,
} from '../../Login/constants';
import OptionExpAccount from './OptionExpAccount';
import { getApi } from '../../../utils/requestUtils';
import { API_IAM } from '../../apiUrl';
import VAutocomplete from '../../../components/VAutocomplete';

export const RenderInformation = React.memo(function({
  user,
  isEdit,
  isAdd,
  formik,
  onTouchOrgUit,
  onTouchPosition,
  validatorData,
  employeeCode,
  account,
  fullName,
  email,
  phone,
  password,
  confirmPassword,
  setEmployeeCode,
  setAccount,
  setFullName,
  setEmail,
  setPhone,
  setPassword,
  setConfirmPassword,
  PATTERN,
  PATTERN_ACCOUNT,
  expAccountList,
  setExpAccountList,
  setExpAccount,
  expAccount,
  setDVKNOrigin,
  DVKN,
  setDVKN,
}) {
  const intl = useIntl();
  const classes = useStyles();
  const [status, setStatus] = useState(true);
  const [openExpAccount, setOpenExpAccount] = useState(false);
  const typeAccount = [
    {
      label: intl.formatMessage(messages.accountLocal),
      value: 1,
    },
  ];
  const typeAccountLDAP = [
    {
      label: intl.formatMessage(messages.accountLDAP),
      value: 2,
    },
  ];
  const typeAccountVin3s = [
    {
      label: intl.formatMessage(messages.accountVin3S),
      value: 3,
    },
  ];
  const [typeAcc, setTypeAcc] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addMonths(new Date(), 3));
  const [stDate, setStDate] = useState(null);
  const [leadershipUnit, setLeadershipUnit] = useState(false);

  useEffect(() => {
    if (!isAdd) {
      const mainOrgUnit = user?.orgUnits?.filter(item => item.isDefault);
      formik.values.username = user?.username;
      setAccount({
        value: user?.username || '',
        error: '',
        touch: true,
      });
      formik.values.employeeCode = user?.employeeCode || '';
      setEmployeeCode({
        value: user?.employeeCode || '',
        error: '',
        touch: true,
      });
      formik.values.fullName = user?.fullName || '';
      setFullName({
        value: user?.fullName || '',
        error: '',
        touch: true,
      });
      formik.values.email = user?.email || '';
      setEmail({
        value: user?.email || '',
        error: '',
        touch: true,
      });
      formik.values.phone = user?.phoneNumber || '';
      setPhone({
        value: user?.phoneNumber || '',
        error: '',
        touch: true,
      });
      formik.values.landlinePhone = user?.workPhone || '';
      formik.values.ext = user?.workPhoneExt || '';
      formik.values.status = user.status === 'ACTIVE';
      formik.values.positionWork = null;
      formik.values.availableAt = user?.availableAt || null;
      formik.values.expiredAt = user?.expiredAt || null;
      formik.values.expAccount = null;
      formik.values.accessCode = user?.accessCode || '';
      setStatus(user.status === 'ACTIVE');
      // setGroupAccess(null);
      // setPositionWork(null);
      formik.values.groupAccess = user?.groupId || '';
      formik.values.groupAccessName = user?.groupName || '';
      formik.values.identityProviderType = user?.identityProviderType || '';
      if (user?.identityProviderType === 'LDAP') {
        setTypeAcc(2);
      } else if (user?.identityProviderType === 'VIN3S') {
        setTypeAcc(3);
      }
      if (mainOrgUnit) {
        const val = mainOrgUnit[0];
        setLeadershipUnit(val?.isLeader || false);
        formik.values.leadershipUnit = val?.isLeader || false;
        formik.values.unit = val?.orgUnitId;
        formik.values.position = val?.positionId;
        formik.values.orgUnitName = val?.orgUnitName || '';
        formik.values.positionName = val?.positionName || '';
      }

      // Chi tiết - Chỉnh sửa => set Thời hạn hiệu lực tài khoản mặc định = 2 nếu có
      if (
        formik.values.availableAt !== null &&
        formik.values.expiredAt !== null
      ) {
        formik.values.expAccount = 2;
        setExpAccount(2);
        const start = moment(new Date(formik.values.availableAt)).format(
          'DD/MM/yyyy',
        );
        const end = moment(new Date(formik.values.expiredAt)).format(
          'DD/MM/yyyy',
        );
        setStDate(formik.values.availableAt);
        setStartDate(formik.values.availableAt);
        setEndDate(formik.values.expiredAt);
        const list = [...expAccountList];
        list[1] = {
          label: `${start} - ${end}`,
          startUpdatedAt: formik.values.availableAt,
          endUpdatedAt: formik.values.expiredAt,
          value: 2,
        };
        setExpAccountList([...list]);
      } else {
        formik.values.expAccount = 1;
        setExpAccount(1);
        setStartDate(null);
        setEndDate(null);
        const list = [...expAccountList];
        list[0] = {
          label: intl.formatMessage(messages.unknown),
          startUpdatedAt: '',
          endUpdatedAt: '',
          value: 1,
        };
        setExpAccountList([...list]);
      }
    }
  }, [user]);

  const RequiredComponent = () => (
    <>{(isAdd || isEdit) && <span style={{ color: 'red' }}> *</span>}</>
  );

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.titleHeader}>
            {intl.formatMessage(messages.profile)}
          </Typography>
          <Grid container spacing={3} className={classes.gridMargin}>
            <Grid container item xs={4}>
              <div className={clsx(classes.fullWidth, classes.textFieldStyle)}>
                <Label className={classes.label}>
                  {intl.formatMessage(messages.mnv)}
                  <RequiredComponent />
                </Label>
                <TextField
                  disabled={!isEdit}
                  variant="outlined"
                  placeholder={intl.formatMessage(messages.mnv)}
                  error={employeeCode?.touch && employeeCode.error.length > 0}
                  helperText={`${
                    employeeCode?.touch ? employeeCode.error : ''
                  }`}
                  value={employeeCode?.value}
                  onChange={event => {
                    const value = event.target.value.trim() || '';
                    validatorData(
                      value,
                      PATTERN,
                      intl.formatMessage(messages.validateEmployeeCode),
                      employeeCode,
                      setEmployeeCode,
                    );
                    formik.values.employeeCode = value;
                  }}
                />
              </div>
            </Grid>
            <Grid container item xs={4}>
              <div className={clsx(classes.fullWidth, classes.textFieldStyle)}>
                <Label className={classes.label}>
                  {intl.formatMessage(messages.account)}
                  <RequiredComponent />
                </Label>
                <TextField
                  disabled={!isAdd}
                  variant="outlined"
                  placeholder={intl.formatMessage(messages.account)}
                  error={account?.touch && account.error.length > 0}
                  helperText={`${account?.touch ? account.error : ''}`}
                  value={account?.value}
                  onChange={event => {
                    const value = event.target.value.trim() || '';
                    validatorData(
                      value,
                      PATTERN_ACCOUNT,
                      intl.formatMessage(messages.validateAccount),
                      account,
                      setAccount,
                    );
                    formik.values.username = value;
                  }}
                />
              </div>
            </Grid>
            <Grid container item xs={4}>
              <div className={clsx(classes.fullWidth, classes.textFieldStyle)}>
                <Label className={classes.label}>
                  {intl.formatMessage(messages.fullName)}
                  <RequiredComponent />
                </Label>
                <TextField
                  disabled={!isEdit}
                  variant="outlined"
                  placeholder={intl.formatMessage(messages.fullName)}
                  error={fullName?.touch && fullName.error.length > 0}
                  helperText={`${fullName?.touch ? fullName.error : ''}`}
                  value={fullName?.value}
                  onChange={event => {
                    const value = event.target.value || '';
                    validatorData(
                      value,
                      null,
                      intl.formatMessage(messages.validateFullName),
                      fullName,
                      setFullName,
                    );
                    formik.values.fullName = value;
                  }}
                />
              </div>
            </Grid>

            <Grid container item xs={4}>
              <div className={clsx(classes.fullWidth, classes.textFieldStyle)}>
                <Label className={classes.label}>
                  {intl.formatMessage(messages.email)}
                  <RequiredComponent />
                </Label>
                <TextField
                  disabled={!isEdit}
                  variant="outlined"
                  placeholder={intl.formatMessage(messages.email)}
                  error={email?.touch && email.error.length > 0}
                  helperText={`${email?.touch ? email.error : ''}`}
                  value={email?.value}
                  autoComplete="off"
                  onChange={event => {
                    const value = event.target.value.trim() || '';
                    validatorData(
                      value,
                      EMAIL_PATTERN,
                      intl.formatMessage(messages.validateEmail),
                      email,
                      setEmail,
                    );
                    formik.values.email = value;
                  }}
                />
              </div>
            </Grid>
            {isAdd && (
              <>
                <Grid container item xs={4}>
                  <div
                    className={clsx(classes.fullWidth, classes.textFieldStyle)}
                  >
                    <Label className={classes.label}>
                      Mật khẩu
                      <RequiredComponent />
                    </Label>
                    <TextField
                      type="password"
                      variant="outlined"
                      autoComplete="new-password"
                      placeholder="Mật khẩu"
                      error={password?.touch && password.error.length > 0}
                      helperText={`${password?.touch ? password.error : ''}`}
                      value={password?.value}
                      onChange={event => {
                        const value = event.target.value || '';
                        validatorData(
                          value,
                          PASSWORD_PATTERN,
                          'Tối thiểu 8 ký tự, bao gồm chữ số, chữ thường, chữ hoa và ký tự đặc biệt',
                          password,
                          setPassword,
                        );
                        formik.values.password = value;
                      }}
                    />
                  </div>
                </Grid>
                <Grid container item xs={4}>
                  <div
                    className={clsx(classes.fullWidth, classes.textFieldStyle)}
                  >
                    <Label className={classes.label}>
                      {intl.formatMessage(messages.confirmPassword)}
                      <RequiredComponent />
                    </Label>
                    <TextField
                      type="password"
                      variant="outlined"
                      placeholder={intl.formatMessage(messages.confirmPassword)}
                      error={
                        confirmPassword?.touch &&
                        confirmPassword.error.length > 0
                      }
                      helperText={`${
                        confirmPassword?.touch ? confirmPassword.error : ''
                      }`}
                      value={confirmPassword?.value}
                      onChange={event => {
                        const value = event.target.value || '';
                        validatorData(
                          value,
                          PASSWORD_PATTERN,
                          'Tối thiểu 8 ký tự, bao gồm chữ số, chữ thường, chữ hoa và ký tự đặc biệt',
                          confirmPassword,
                          setConfirmPassword,
                        );
                      }}
                    />
                  </div>
                </Grid>
              </>
            )}
            <Grid container item xs={4}>
              <div
                className={classes.fullWidth}
                style={{
                  position: 'relative',
                }}
              >
                <Label className={classes.label}>
                  {intl.formatMessage(messages.status)}
                </Label>
                <TextField
                  variant="outlined"
                  className={classes.switch}
                  disabled
                  placeholder={
                    status
                      ? intl.formatMessage({
                          id: 'app.status.enabled',
                        })
                      : intl.formatMessage({
                          id: 'app.status.disabled',
                        })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Switch
                          id="status"
                          name="status"
                          checked={status}
                          onChange={(e, checked) => {
                            if (!isEdit) {
                              return;
                            }
                            setStatus(checked);
                            formik.values.status = checked;
                          }}
                          color="primary"
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </Grid>
            <Grid container item xs={4}>
              <div className={classes.fullWidth}>
                <Label className={classes.label}>
                  {intl.formatMessage(messages.unit)}
                  <RequiredComponent />
                </Label>
                <VAutocomplete
                  value={{
                    orgUnitId: formik.values.unit || '',
                    orgUnitName: formik.values.orgUnitName || '',
                  }}
                  virtual={false}
                  disableClearable
                  disabled={!isEdit}
                  fullWidth
                  getOptionLabel={option => option?.orgUnitName || ''}
                  firstIndex={1}
                  loadData={() =>
                    new Promise((resolve, reject) => {
                      getApi(API_IAM.ORG_UNIT_ME)
                        .then(result => {
                          resolve({
                            data: result.data,
                            totalCount: result.data.length,
                          });
                        })
                        .catch(err => reject(err));
                    })
                  }
                  getOptionSelected={(option, selected) =>
                    option.orgUnitId === selected.orgUnitId
                  }
                  onChange={(e, value) => {
                    setDVKNOrigin(value.orgUnitId);
                    const list = [...DVKN];
                    setDVKN([
                      ...list.filter(
                        item => item.orgUnitId !== value.orgUnitId,
                      ),
                    ]);
                    formik.setFieldValue('unit', value.orgUnitId);
                    formik.setFieldValue('orgUnitName', value.orgUnitName);
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder={intl.formatMessage(
                        messages.orgUnitPlaceholder,
                      )}
                      error={onTouchOrgUit && formik.values.unit.length === 0}
                      helperText={`${
                        onTouchOrgUit && formik.values.unit.length === 0
                          ? intl.formatMessage({
                              id: 'app.invalid.required',
                            })
                          : ''
                      }`}
                    />
                  )}
                />
              </div>
            </Grid>

            <Grid container item xs={4}>
              <div className={clsx(classes.fullWidth, classes.textFieldStyle)}>
                <Label className={classes.label}>
                  {intl.formatMessage(messages.phone)}
                  <RequiredComponent />
                </Label>
                <TextField
                  disabled={!isEdit}
                  variant="outlined"
                  placeholder={intl.formatMessage(messages.phone)}
                  error={phone?.touch && phone.error.length > 0}
                  helperText={`${email?.touch ? phone.error : ''}`}
                  value={phone?.value}
                  onChange={event => {
                    const value = event.target.value.trim() || '';
                    const PatternPhone = isAdd
                      ? PHONE_PATTERN
                      : user?.identityProviderType !== 'LDAP'
                      ? PHONE_PATTERN
                      : null;
                    validatorData(
                      value,
                      PatternPhone,
                      intl.formatMessage(messages.validatePhone),
                      phone,
                      setPhone,
                    );
                    formik.values.phone = value;
                  }}
                />
              </div>
            </Grid>
            <Grid container item xs={4}>
              <div className={clsx(classes.fullWidth, classes.textFieldStyle)}>
                <Label className={classes.label}>
                  {intl.formatMessage(messages.landlinePhone)}
                </Label>
                <TextField
                  disabled={!isEdit}
                  variant="outlined"
                  id="landlinePhone"
                  name="landlinePhone"
                  placeholder={intl.formatMessage(messages.landlinePhone)}
                  value={formik?.values.landlinePhone}
                  onChange={formik.handleChange}
                />
              </div>
            </Grid>

            <Grid container item xs={4}>
              <div className={clsx(classes.fullWidth, classes.textFieldStyle)}>
                <Label className={classes.label}>
                  {intl.formatMessage(messages.ext)}
                </Label>
                <TextField
                  disabled={!isEdit}
                  variant="outlined"
                  id="ext"
                  name="ext"
                  placeholder={intl.formatMessage(messages.ext)}
                  value={formik?.values.ext}
                  onChange={formik.handleChange}
                />
              </div>
            </Grid>

            <Grid container item xs={4}>
              <div className={classes.fullWidth}>
                <Label className={classes.label}>
                  {intl.formatMessage(messages.position)}
                </Label>
                <VAutocomplete
                  value={{
                    positionId: formik.values.position,
                    positionName: formik.values.positionName,
                  }}
                  disableClearable={false}
                  disabled={!isEdit}
                  fullWidth
                  getOptionLabel={option => option?.positionName || ''}
                  firstIndex={1}
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      const params = {
                        limit: 50,
                        page,
                      };
                      if (keyword !== '') {
                        params.keyword = keyword;
                      }
                      getApi(API_IAM.POSITION, params)
                        .then(result => {
                          resolve({
                            data: result.data.rows,
                            totalCount: result.data.count,
                          });
                        })
                        .catch(err => reject(err));
                    })
                  }
                  getOptionSelected={(option, selected) =>
                    option.positionId === selected.positionId
                  }
                  onChange={(e, value) => {
                    formik.setFieldValue('position', value?.positionId || null);
                    formik.setFieldValue(
                      'positionName',
                      value?.positionName || null,
                    );
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder={intl.formatMessage(
                        messages.positionPlaceholder,
                      )}
                      error={
                        onTouchPosition && formik.values.position.length === 0
                      }
                      // onBlur={() => {
                      //   setOnTouchPosition(true);
                      // }}
                      helperText={`${
                        onTouchPosition && formik.values.position.length === 0
                          ? intl.formatMessage({
                              id: 'app.invalid.required',
                            })
                          : ''
                      }`}
                    />
                  )}
                />
              </div>
            </Grid>

            <Grid container item xs={4}>
              <div
                className={classes.fullWidth}
                style={{ position: 'relative' }}
              >
                <Label className={classes.label}>
                  {/* {intl.formatMessage(messages.leadershipUnit)} */}
                </Label>
                <TextField
                  disabled
                  variant="outlined"
                  className={classes.switch}
                  id="isLanhDaoDonVi"
                  name="isLanhDaoDonVi"
                  placeholder={intl.formatMessage(messages.leadershipUnit)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Checkbox
                          disabled={!isEdit}
                          // defaultChecked={formik.values.leadershipUnit}
                          checked={leadershipUnit}
                          name="leadershipUnit"
                          color="primary"
                          onChange={e => {
                            formik.values.leadershipUnit = e.target.checked;
                            setLeadershipUnit(e.target.checked);
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </Grid>

            {!isAdd && (
              <Grid container item xs={4}>
                <div className={classes.fullWidth}>
                  <Label className={classes.label}>
                    {intl.formatMessage(messages.typeAccount)}
                  </Label>
                  <SelectBox
                    items={
                      typeAcc === 2
                        ? typeAccountLDAP
                        : typeAcc === 3
                        ? typeAccountVin3s
                        : typeAccount
                    }
                    name="typeAccount"
                    disabled
                    placeholder={intl.formatMessage(messages.typeAccount)}
                    width="100%"
                    displayExpr="label"
                    valueExpr="value"
                    value={typeAcc}
                  />
                </div>
              </Grid>
            )}

            <Grid container item xs={4}>
              <div className={classes.fullWidth}>
                <Label className={classes.label}>
                  {intl.formatMessage(messages.expAccount)}
                </Label>
                <SelectBox
                  items={expAccountList}
                  name="expAccount"
                  disabled={!isEdit}
                  placeholder={intl.formatMessage(messages.expAccount)}
                  width="100%"
                  displayExpr="label"
                  valueExpr="value"
                  value={expAccount}
                  onItemClick={e => {
                    // popup options
                    if (e.itemIndex === 1) {
                      setOpenExpAccount(true);
                    }
                  }}
                  onValueChanged={e => {
                    // không xác định
                    if (e.value === 1) {
                      const list = [...expAccountList];
                      list[1] = {
                        label: intl.formatMessage(messages.option),
                        startUpdatedAt: '',
                        endUpdatedAt: '',
                        value: 2,
                      };
                      setExpAccountList([...list]);
                      setExpAccount(e.value); // 1
                      setStartDate(null);
                      setEndDate(null);
                      formik.values.expAccount = e.value;
                    }
                  }}
                />
              </div>
            </Grid>

            {!isAdd && (
              <Grid container item xs={4}>
                <div className={classes.fullWidth}>
                  <Label className={classes.label}>
                    {intl.formatMessage(messages.accessCode)}
                  </Label>
                  <TextBox
                    disabled
                    id="accessCode"
                    name="accessCode"
                    placeholder={intl.formatMessage(messages.accessCode)}
                    stylingMode="outlined"
                    value={formik?.values.accessCode}
                  />
                </div>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
      {openExpAccount && (
        <Popup
          className="popup"
          visible
          title="Tùy chỉnh thời gian hiệu lực của tài khoản"
          showTitle
          onHidden={() => {
            setOpenExpAccount(false);
          }}
          dragEnabled
          width={600}
          height={200}
        >
          <OptionExpAccount
            isMinMonth
            minDate={stDate}
            startDateInput={startDate}
            endDateInput={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            confirmText={intl.formatMessage(messages.btnChoose)}
            cancelText={intl.formatMessage(messages.btnCancel)}
            confirm={(startDate, endDate) => {
              setExpAccount(2); // Tùy chọn => set startDate - endDate
              const start = moment(new Date(startDate)).format('DD/MM/yyyy');
              const end = moment(new Date(endDate)).format('DD/MM/yyyy');
              const list = [...expAccountList];
              list[1] = {
                label: `${start} - ${end}`,
                startUpdatedAt: startDate,
                endUpdatedAt: endDate,
                value: 2,
              };
              setStartDate(startDate);
              setEndDate(endDate);
              setExpAccountList([...list]);
              setOpenExpAccount(false);
            }}
            close={() => {
              setOpenExpAccount(false);
            }}
          />
        </Popup>
      )}
    </div>
  );
});
