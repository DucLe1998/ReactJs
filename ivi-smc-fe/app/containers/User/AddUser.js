import clsx from 'clsx';
import { Button } from 'devextreme-react/button';
import { Popup } from 'devextreme-react/popup';
import { useFormik } from 'formik';
import BackIcon from 'images/Icon-Back-3-10.svg';
import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { postApiCustom, showError } from '../../utils/requestUtils';
import { showSuccess } from '../../utils/toast-utils';
import { API_IAM } from '../apiUrl';
import Loading from '../Loading';
import {
  EMAIL_PATTERN,
  PASSWORD_PATTERN,
  PHONE_PATTERN,
} from '../Login/constants';
import messages from './messages';
import { RenderAuthority } from './render/Authority';
import Delete from './render/Delete';
import { RenderInfoParkingLot } from './render/InfoParkinglot';
import { RenderInformation } from './render/Information';
import { RenderUnitManager } from './render/UnitManager';
import { useStyles } from './style';

export function AddUser({ history, location }) {
  const classes = useStyles();
  const intl = useIntl();
  const formik = useFormik({
    initialValues: {
      username: '',
      employeeCode: '',
      fullName: '',
      email: '',
      phone: '',
      landlinePhone: '',
      ext: '',
      status: true,
      leadershipUnit: false,
      position: '',
      unit: '',
      groupAccess: '',
      positionWork: '',
      expAccount: 1,
      codeIdentify: '',
      typeAccount: 1,
      identityProviderType: '',
    },
    onSubmit: () => {
      save();
    },
  });
  const [expAccount, setExpAccount] = useState(1);
  const [expAccountList, setExpAccountList] = useState([
    {
      label: intl.formatMessage(messages.unknown),
      startUpdatedAt: '',
      endUpdatedAt: '',
      value: 1,
    },
    {
      label: intl.formatMessage(messages.option),
      startUpdatedAt: '',
      endUpdatedAt: '',
      value: 2,
    },
  ]);
  const [openCancel, setOpenCancel] = useState(false);

  const [DVKN, setDVKN] = useState([]);
  const [dataParking, setDataParking] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  // const [identifications, setIdentifications] = useState([]);

  const [loading, setLoading] = useState(false);
  const [DVKNOrigin, setDVKNOrigin] = useState(null);

  const PATTERN = /^[a-zA-Z0-9]*$/;
  const PATTERN_ACCOUNT = /^(?=.*[a-zA-Z])[A-Za-z\d]{3,20}$/;
  const PATTERN_FULLNAME = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{3,100}$/;
  const PATTERN_WORKPHONE = /^(\+\d{1,3}( )?)?((\(\d{1,4}\))|\d{1,4})[- .]?\d{1,4}[- .]?\d{1,4}$|^(\+\d{1,3}( )?)?(\d{1,4}[ ]?){1,4}\d{1,4}$|^(\+\d{1,3}( )?)?(\d{1,4}[ ]?)(\d{1,4}[ ]?){1,4}\d{1,4}$/;
  const requiredError = intl.formatMessage({
    id: 'app.invalid.required',
  });

  const [password, setPassword] = useState({
    value: '',
    error: '',
    touch: false,
  });
  const [confirmPassword, setConfirmPassword] = useState({
    value: '',
    error: '',
    touch: false,
  });
  const [employeeCode, setEmployeeCode] = useState({
    value: '',
    error: '',
    touch: false,
  });
  const [account, setAccount] = useState({
    value: '',
    error: '',
    touch: false,
  });
  const [fullName, setFullName] = useState({
    value: '',
    error: '',
    touch: false,
  });
  const [email, setEmail] = useState({
    value: '',
    error: '',
    touch: false,
  });
  const [phone, setPhone] = useState({
    value: '',
    error: '',
    touch: false,
  });

  const [onTouchOrgUit, setOnTouchOrgUit] = useState(false);
  const [onTouchPosition, setOnTouchPosition] = useState(false);

  const validatorData = (value, pattern, message, state, changeState) => {
    let isError = false;
    let error = '';
    if (value.trim().length === 0) {
      error = requiredError;
      isError = true;
    } else if (pattern !== null) {
      if (!pattern.test(value)) {
        error = message;
        isError = true;
      }
    }
    changeState({
      ...state,
      value,
      error,
      touch: true,
    });
    return isError;
  };
  const goBack = () => {
    history.push({
      pathname: '/user',
      state: location.state,
    });
  };
  const RenderHeader = ({ classes }) => (
    <Header>
      <div className="left-header">
        <button
          type="button"
          style={{
            backgroundColor: 'inherit',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            top: -4,
          }}
          onClick={goBack}
        >
          <img src={BackIcon} alt="back" />
        </button>
        <span className="title">{intl.formatMessage(messages.createUser)}</span>
      </div>
      <div className="right-header">
        <Fragment>
          <Button
            style={{ marginRight: 10 }}
            className={clsx(classes.button, classes.buttonCancel)}
            onClick={() => {
              setOpenCancel(true);
              // history.push(`/user`);
            }}
          >
            {intl.formatMessage(messages.btnCancel)}
          </Button>
          <Button
            // disabled={disableSave}
            // onClick={save}
            className={clsx(classes.button, classes.buttonFilter)}
            style={{ color: 'white' }}
            useSubmitBehavior
          >
            {intl.formatMessage(messages.save)}
          </Button>
        </Fragment>
      </div>
    </Header>
  );

  // const handleSaveIdentify = userId => {
  //   const card = identifications.filter(
  //     i => i.identifyMethod === IDENTIFY_TYPES.CARD.id,
  //   )[0];
  //   if (card) {
  //     postApiCustom(
  //       {
  //         url: API_DETAIL_USER_IDENTITY.ADD_CARD,
  //         payload: {
  //           cardNumber: card.cardNumber,
  //           cardType: card.cardType,
  //           userId,
  //         },
  //       },
  //       () => {
  //         showSuccess('Tạo mới người dùng thành công');
  //         goBack();
  //       },
  //     );
  //   } else {
  //     showSuccess('Tạo mới người dùng thành công');
  //     goBack();
  //   }
  // };

  const validator = () => {
    const employeeCodeError = validatorData(
      employeeCode.value,
      PATTERN,
      intl.formatMessage(messages.validateEmployeeCode),
      employeeCode,
      setEmployeeCode,
    );
    const accountError = validatorData(
      account.value,
      PATTERN_ACCOUNT,
      intl.formatMessage(messages.validateAccount),
      account,
      setAccount,
    );
    const fullNameError = validatorData(
      fullName.value,
      null,
      intl.formatMessage(messages.validateFullName),
      fullName,
      setFullName,
    );
    const emailError = validatorData(
      email.value,
      EMAIL_PATTERN,
      intl.formatMessage(messages.validateEmail),
      email,
      setEmail,
    );
    const phoneError = validatorData(
      phone.value,
      PHONE_PATTERN,
      intl.formatMessage(messages.validatePhone),
      phone,
      setPhone,
    );
    const passwordError = validatorData(
      password.value,
      PASSWORD_PATTERN,
      'Tối thiểu 8 ký tự, bao gồm chữ số, chữ thường, chữ hoa và ký tự đặc biệt',
      password,
      setPassword,
    );
    const passwordConfirmError = validatorData(
      confirmPassword.value,
      PASSWORD_PATTERN,
      'Tối thiểu 8 ký tự, bao gồm chữ số, chữ thường, chữ hoa và ký tự đặc biệt',
      confirmPassword,
      setConfirmPassword,
    );

    // validate hợp lệ - kiểm tra xem mật khẩu có trùng với mật khẩu xác nhận?
    let isNotMatchPW = false;
    if (!passwordError && !passwordConfirmError) {
      if (password.value !== confirmPassword.value) {
        isNotMatchPW = true;
        setConfirmPassword({
          ...confirmPassword,
          error: 'Mật khẩu không trùng với mật khẩu xác nhận',
        });
      }
    }
    return (
      employeeCodeError ||
      accountError ||
      fullNameError ||
      emailError ||
      phoneError ||
      passwordError ||
      passwordConfirmError ||
      isNotMatchPW
    );
  };

  const save = () => {
    const data = formik.values;
    let isReturn = false;
    const validatorError = validator();
    if (data?.unit?.length === 0) {
      setOnTouchOrgUit(true);
      isReturn = true;
    } else {
      setOnTouchOrgUit(false);
    }
    // if (data?.position?.length === 0) {
    //   setOnTouchPosition(true);
    //   isReturn = true;
    // } else {
    //   setOnTouchPosition(false);
    // }
    if (isReturn || validatorError) return;

    const units = [];
    const policyIds = authorities.map(item => item?.policyId);

    DVKN.forEach(item => {
      units.push({
        default: false,
        leader: item.isLeader,
        orgUnitId: item.orgUnitId,
        positionId: item.positionId,
      });
    });
    const payload = {
      default: true,
      email: data.email,
      employeeCode: data.employeeCode,
      fullName: data.fullName?.trim(),
      leader: data.leadershipUnit,
      mobile: data.phone,
      orgUnitId: data.unit,
      password: data.password,
      policyIds,
      positionId:
        data.position && data.position.toString().length > 0
          ? data.position
          : null,
      status: data.status ? 'ACTIVE' : 'INACTIVE',
      units,
      username: data.username,
      vehicles: dataParking,
      workPhone: data.landlinePhone.length > 0 ? data.landlinePhone : null,
      workPhoneExt: data.ext.length > 0 ? data.ext : null,
      groupId: data.groupAccess.length > 0 ? data.groupAccess : null,
      availableAt: expAccount === 2 ? expAccountList[1].startUpdatedAt : null,
      expiredAt: expAccount === 2 ? expAccountList[1].endUpdatedAt : null,
    };
    setLoading(true);
    postApiCustom(
      {
        url: API_IAM.USER,
        payload,
      },
      () => {
        showSuccess('Tạo mới người dùng thành công');
        goBack();
      },
      error => {
        showError(error);
        setLoading(false);
      },
    );
  };

  return (
    <Fragment>
      {loading && <Loading />}
      <form onSubmit={formik.handleSubmit}>
        <RenderHeader classes={classes} />
        <RenderInformation
          isAdd
          isEdit
          isFirstOpen={false}
          setExpAccountList={setExpAccountList}
          expAccountList={expAccountList}
          setExpAccount={setExpAccount}
          expAccount={expAccount}
          formik={formik}
          validatorData={validatorData}
          onTouchOrgUit={onTouchOrgUit}
          onTouchPosition={onTouchPosition}
          setOnTouchOrgUit={setOnTouchOrgUit}
          setOnTouchPosition={setOnTouchPosition}
          employeeCode={employeeCode}
          account={account}
          fullName={fullName}
          email={email}
          phone={phone}
          password={password}
          confirmPassword={confirmPassword}
          setEmployeeCode={setEmployeeCode}
          setAccount={setAccount}
          setFullName={setFullName}
          setEmail={setEmail}
          setPhone={setPhone}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          PATTERN={PATTERN}
          PATTERN_ACCOUNT={PATTERN_ACCOUNT}
          PATTERN_FULLNAME={PATTERN_FULLNAME}
          PATTERN_WORKPHONE={PATTERN_WORKPHONE}
          DVKN={DVKN}
          setDVKN={setDVKN}
          setDVKNOrigin={setDVKNOrigin}
        />
      </form>
      <RenderUnitManager
        isAdd
        isEdit
        DVKN={DVKN}
        setDVKN={setDVKN}
        DVKNOrigin={DVKNOrigin}
      />
      {/* <RenderIdentify
        isAdd
        isEdit
        identifications={identifications}
        setIdentifications={setIdentifications}
      /> */}
      <RenderInfoParkingLot
        isAdd
        isEdit
        dataParking={dataParking}
        setDataParking={setDataParking}
      />
      <RenderAuthority
        isEdit={false}
        isAdd
        authorities={authorities}
        setAuthorities={setAuthorities}
        fullNameUser={fullName.value}
      />
      {openCancel && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage(messages.cancelAddNewUser)}
          showTitle
          onHidden={() => {
            setOpenCancel(false);
          }}
          dragEnabled
          width={600}
          height={150}
        >
          <Delete
            isDeleteUser
            cancelText={intl.formatMessage(messages.btnNo)}
            confirmText={intl.formatMessage(messages.btnOK)}
            close={() => {
              setOpenCancel(false);
            }}
            btnConfirm={goBack}
          />
        </Popup>
      )}
    </Fragment>
  );
}

const Header = styled.div`
  width: 100%;
  padding-top: 10px;
  display: flex;
  .title {
    font-weight: 500;
    font-size: 20px;
    letter-spacing: 0.38px;
    color: rgba(0, 0, 0, 0.8);
  }
  .left-header {
    width: 50%;
  }
  .right-header {
    width: 50%;
    display: flex;
    justify-content: flex-end;
  }
`;
