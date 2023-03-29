import clsx from 'clsx';
// import SMCTab from 'components/SMCTab';
import { Button } from 'devextreme-react/button';
// import { Popup } from 'devextreme-react/popup';
import { useFormik } from 'formik';
import BackIcon from 'images/Icon-Back-3-10.svg';
import React, { Fragment, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getApiCustom, putApi } from '../../utils/requestUtils';
import { showError, showSuccess } from '../../utils/toast-utils';
import { API_IAM } from '../apiUrl';
import { getErrorMessage } from '../Common/function';
import Loading from '../Loading';
import { EMAIL_PATTERN, PHONE_PATTERN } from '../Login/constants';
import messages from './messages';
import { RenderAuthority } from './render/Authority';
// import Delete from './render/Delete';
import Identities from './render/identities';
// import { RenderInfoParkingLot } from './render/InfoParkinglot';
import { RenderInformation } from './render/Information';
import { RenderUnitManager } from './render/UnitManager';
import { useStyles } from './style';
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

export default function DetailUser({ history, location }) {
  const classes = useStyles();
  const formik = useFormik({
    initialValues: {
      username: '',
      employeeCode: '',
      fullName: '',
      email: '',
      phone: '',
      landlinePhone: '',
      ext: '',
      status: false,
      leadershipUnit: false,
      unit: '',
      position: '',
      groupAccess: '',
      positionWork: '',
      expAccount: null,
      codeIdentify: '',
      typeAccount: 1,
      identityProviderType: '',
      accessCode: '',
    },
    onSubmit: () => {
      save();
    },
  });
  const intl = useIntl();
  const { userId, type } = useParams();

  const [isEdit, setIsEdit] = React.useState(type === 'edit');
  // const [openCancelEdit, setOpenCancelEdit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [DVKNOrigin, setDVKNOrigin] = useState(null);

  const [user, setUser] = React.useState({});
  const [DVKN, setDVKN] = useState([]);
  const [dataParking, setDataParking] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [selectedTab, setSelectedTab] = useState('info');

  const [onTouchOrgUit, setOnTouchOrgUit] = useState(false);
  const [onTouchPosition, setOnTouchPosition] = useState(false);

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

  const PATTERN = /^[a-zA-Z0-9]*$/;
  const PATTERN_ACCOUNT = /^(?=.*[a-zA-Z])[A-Za-z\d]{3,20}$/;
  const PATTERN_FULLNAME = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{3,100}$/;
  const PATTERN_WORKPHONE =
    /^(\+\d{1,3}( )?)?((\(\d{1,4}\))|\d{1,4})[- .]?\d{1,4}[- .]?\d{1,4}$|^(\+\d{1,3}( )?)?(\d{1,4}[ ]?){1,4}\d{1,4}$|^(\+\d{1,3}( )?)?(\d{1,4}[ ]?)(\d{1,4}[ ]?){1,4}\d{1,4}$/;
  const requiredError = intl.formatMessage({
    id: 'app.invalid.required',
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
  const goBack = () => {
    history.push({
      pathname: '/user',
      state: location.state,
    });
  };
  const RenderHeader = (
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
        <span className="title">
          {isEdit
            ? intl.formatMessage(messages.editUser)
            : intl.formatMessage(messages.infoUser)}
        </span>
      </div>
      {selectedTab == 'info' && (
        <div className="right-header">
          {isEdit ? (
            <>
              <Button
                style={{ marginRight: 10 }}
                className={clsx(classes.button, classes.buttonCancel)}
                onClick={() => {
                  // setOpenCancelEdit(true);
                  goBack();
                }}
              >
                {intl.formatMessage(messages.btnCancel)}
              </Button>
              <Button
                className={clsx(classes.button, classes.buttonFilter)}
                style={{ color: 'white' }}
                useSubmitBehavior
              >
                {intl.formatMessage(messages.save)}
              </Button>
            </>
          ) : (
            <Button
              style={{ marginRight: 10 }}
              className={clsx(classes.button, classes.buttonFilter)}
              onClick={() => {
                setIsEdit(true);
              }}
            >
              {intl.formatMessage({ id: 'app.tooltip.edit' })}
            </Button>
          )}
        </div>
      )}
    </Header>
  );
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
  const successCallback = () => {
    setLoading(false);
    showSuccess('Cập nhật người dùng thành công');
    goBack();
  };

  // const handleCloseEdit = () => {
  //   setOpenCancelEdit(false);
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
      isEdit ? null : PATTERN_ACCOUNT,
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
    const PatternPhone =
      user?.identityProviderType !== 'LDAP' ? PHONE_PATTERN : null;
    const phoneError = validatorData(
      phone.value,
      PatternPhone,
      intl.formatMessage(messages.validatePhone),
      phone,
      setPhone,
    );
    return (
      employeeCodeError ||
      accountError ||
      fullNameError ||
      emailError ||
      phoneError
    );
  };
  const save = async () => {
    setLoading(true);
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
    if (isReturn || validatorError) {
      setLoading(false);
      return;
    }
    const units = [];
    const policyIds = authorities
      .map((item) => item?.policyId)
      .filter((data) => data !== null);

    DVKN.forEach((item) => {
      units.push({
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
      positionId: data.position ? data.position : null,
      status: data.status ? 'ACTIVE' : 'INACTIVE',
      units,
      userId,
      username: data.username,
      vehicles: dataParking,
      workPhone: data.landlinePhone.length > 0 ? data.landlinePhone : null,
      workPhoneExt: data.ext.length > 0 ? data.ext : null,
      policyIds,
      groupId: data.groupAccess.length > 0 ? data.groupAccess : null,
      availableAt: expAccount === 2 ? expAccountList[1].startUpdatedAt : null,
      expiredAt: expAccount === 2 ? expAccountList[1].endUpdatedAt : null,
    };
    // putApiCustom(
    //   {
    //     url: API_IAM.USER,
    //     payload,
    //   },
    //   () => {
    //     handleSaveIdentify();
    //     setLoading(false);
    //   },
    //   error => {
    //     showError(error);
    //     setLoading(false);
    //   },
    // );
    putApi(API_IAM.USER, payload)
      .then(() => {
        successCallback();
      })
      .catch((error) => {
        showError(getErrorMessage(error));
        setLoading(false);
      });
  };

  const fetchDetail = () => {
    setLoading(true);
    if (!userId) {
      setLoading(false);
      return;
    }
    if (!['edit', 'detail'].includes(type)) {
      setLoading(false);
      goBack();
      return;
    }
    getApiCustom(
      {
        url: API_IAM.USER_DETAIL_BY_ID.replace('@userId', userId),
      },
      (res) => {
        setUser(res);
        const Orgunits = res?.orgUnits?.filter((item) => item.isDefault);
        const subOrgunits = res?.orgUnits?.filter((item) => !item.isDefault);
        setDVKNOrigin(Orgunits[0]?.orgUnitId || null);
        setDVKN(subOrgunits || []);
        setDataParking(res?.vehicles || []);
        setAuthorities(res?.policies || []);
        setLoading(false);
      },
      () => {
        setLoading(false);
      },
    );
  };

  useEffect(() => {
    fetchDetail();
  }, [userId]);

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={formik.handleSubmit}>
        {RenderHeader}
        {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SMCTab
            items={[
              {
                id: 'info',
                text: 'Thông tin cá nhân',
              },
              {
                id: 'auth',
                text: 'Thông tin định danh',
              },
            ]}
            selectedTabId={selectedTab}
            onChange={(id) => {
              setSelectedTab(id);
            }}
          />
        </div> */}
        {selectedTab == 'info' && (
          <>
            <RenderInformation
              isFirstOpen
              isAdd={false}
              isEdit={isEdit}
              setExpAccountList={setExpAccountList}
              expAccountList={expAccountList}
              setExpAccount={setExpAccount}
              expAccount={expAccount}
              user={user}
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
              setEmployeeCode={setEmployeeCode}
              setAccount={setAccount}
              setFullName={setFullName}
              setEmail={setEmail}
              setPhone={setPhone}
              PATTERN={PATTERN}
              PATTERN_ACCOUNT={PATTERN_ACCOUNT}
              PATTERN_FULLNAME={PATTERN_FULLNAME}
              PATTERN_WORKPHONE={PATTERN_WORKPHONE}
              DVKN={DVKN}
              setDVKN={setDVKN}
              setDVKNOrigin={setDVKNOrigin}
            />
            {user?.identityProviderType === 'COGNITO' && (
              <RenderUnitManager
                id={userId}
                isEdit={isEdit}
                DVKN={DVKN}
                setDVKN={setDVKN}
                DVKNOrigin={DVKNOrigin}
              />
            )}
            {/* <RenderInfoParkingLot
              isEdit={isEdit}
              dataParking={dataParking}
              setDataParking={setDataParking}
            /> */}
            <RenderAuthority
              isEdit={isEdit}
              isAdd={false}
              authorities={authorities}
              setAuthorities={setAuthorities}
              fullNameUser={fullName.value}
              user={user}
            />
          </>
        )}
        {selectedTab == 'auth' && <Identities id={userId} />}
      </form>
      {/* {openCancelEdit && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage(messages.cancelUpdateUser)}
          showTitle
          onHidden={() => {
            setOpenCancelEdit(false);
          }}
          dragEnabled
          width={600}
          height={150}
        >
          <Delete
            close={handleCloseEdit}
            confirm={goBack}
            cancelText={intl.formatMessage(messages.btnNo)}
            confirmText={intl.formatMessage(messages.btnOK)}
          />
        </Popup>
      )} */}
    </>
  );
}
