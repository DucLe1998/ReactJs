/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import { Button } from '@material-ui/core';
// import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import CtDropDownTree from 'components/Custom/AreaTree/CtDropDownTree';
import { Popup } from 'devextreme-react/popup';
import IconCardLg1 from 'components/Custom/Icon/FileIcon/IconCardLa1';
import IconFaceLg1 from 'components/Custom/Icon/FileIcon/IconFaceLg1';
// import IconFirmUpg from 'components/Custom/Icon/FileIcon/IconFirmUpg';
import IconTouchLg2 from 'components/Custom/Icon/FileIcon/IconTouchLg2';
import TabMainUseState from 'components/Custom/Tab/TabMainUseState';
import CtSelectBox from 'components/Custom/Select/CtSelectBox';
import { useParams, useHistory } from 'react-router-dom';
import Loading from 'containers/Loading/Loadable';
import TitlePage from 'components/Custom/TitlePage';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PopupDelete from 'components/Custom/popup/PopupDelete';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import CustomTable from 'components/Custom/table/CustomTable';
import gui from 'utils/gui';
// import { COLUMNSLISTUSER_DETAIL } from 'containers/ListStaff/constants';
import IconBtn from 'components/Custom/IconBtn';
import { BiFilterAlt } from 'react-icons/bi';
import PageHeader from 'components/PageHeader';
import Btn from 'components/Custom/Btn';
import CheckBox from 'components/TextInput/CheckBox';
import LabelInput from 'components/TextInput/element/LabelInput';
import ShowErrorValidate from 'components/TextInput/ShowErrorValidate';
import TextInput from 'components/TextInput/TextInput';
import ToggleSwitch from 'components/TextInput/ToggleSwitch';
import { callApi } from 'utils/requestUtils';
import utils, { validationSchema } from 'utils/utils';
import { listCommand } from './data';
import './styles.css';

import { API_AC_ADAPTER, DEVICE_TYPE_DEVICE, VECTOR_IN_OUT } from './constants';
import FilterUserInDevice from './popups/FilterUserInDevice';
import { COLUMNSLISTUSER_DETAIL } from '../ACGroupUser/constants';

const ViewComponent = ({ title, children }) => (
  <div className="ct-view-component">
    <div
      style={{
        backgroundColor: '#FFF',
        padding: 6,
        marginBottom: 8,
        marginTop: 16,
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

const DetailDevices = () => {
  const intl = useIntl();

  const { id } = useParams();

  const [tab, setTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [isOpenConfirmRestore, setIsOpenConfirmRestore] = useState(false);
  const [isOpenConfirmRestore2, setIsOpenConfirmRestore2] = useState(false);

  const { register, handleSubmit, errors, reset, watch } = useForm({
    defaultValue: {
      enableThermalDetection: false,
    },
    resolver: validationSchema({
      name: yup.string().trim().max(100, '100 ký tự'),
      ipAddress: yup.string().trim().max(100, '100 ký tự'),
      gatewayAddress: yup.string().trim().max(100, '100 ký tự'),
      macAddress: yup.string().trim().max(100, '100 ký tự'),
      subnetMark: yup.string().trim().max(100, '100 ký tự'),
      description: yup.string().trim().max(254, '255 ký tự'),
    }),
  });

  const enableDHPC = watch('enableDHPC');

  const [valueListDeviceId, setValueListDeviceId] = useState('');
  // const [loadingUpgrade, setLoadingUpgrade] = useState(false);

  const [dataState, setDataState] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [deviceDerection, setDeviceDerection] = useState('');

  // const [dataFirmVersion, setDataFirmVersion] = useState('');

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await callApi(`${API_AC_ADAPTER}/devices/${id}`, 'GET');
      if (res) {
        setDataState(res.data);
        const {
          name,
          model,
          description,
          hardwareVersion,
          deviceGroup,
          authenticationConfiguration,
          doorName,
          deviceType,
          direction,
          firmware,
          ipAddress,
          settings,
          serialNumber,
        } = res.data;
        const foundDeviceType = DEVICE_TYPE_DEVICE.find(
          (e) => e.value === deviceType,
        );
        const foundDeviceDerection = VECTOR_IN_OUT.find(
          (e) => e.value === direction,
        );
        setDeviceType(foundDeviceType);
        setDeviceDerection(foundDeviceDerection);
        setTimeout(() => {
          setValueListDeviceId({
            id: deviceGroup._id,
            name: deviceGroup.name,
          });
        }, 300);
        reset({
          name,
          firmware,
          doorName,
          code: serialNumber || '',
          model,
          description,
          hardwareVersion,
          enableDHPC: settings?.enableDHPC || false,
          enableFingerprintAuthentication:
            authenticationConfiguration?.enableFingerprintAuthentication ||
            false,
          enableFaceAuthentication:
            authenticationConfiguration?.enableFaceAuthentication || false,
          enableCardAuthentication:
            authenticationConfiguration?.enableCardAuthentication || false,
          enableThermalDetection:
            authenticationConfiguration?.enableThermalDetection || false,
          ipAddress,
          gatewayAddress: settings?.gateway || '',
          macAddress: settings?.macAddress || '',
          subnetMark: settings?.netmask || '',
        });
      }
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
    // const dto = {
    //   deviceIds: [id],
    // };
    // const res = await callApi(
    //   `${API_AC_ADAPTER}/devices/check-upgrade-firmware`,
    //   'POST',
    //   dto,
    // );
    // setDataFirmVersion(res.data[0]);
  };

  const renderShowError = (label, name) => (
    <ShowErrorValidate label={label} errors={errors} name={name} />
  );

  const handlerRestoreToDefault = async (v) => {
    setLoading(true);
    try {
      const dto = {
        deviceIds: [id],
        payload: {
          command:
            v === 'all'
              ? listCommand.RESTORE_ALL_TO_DEFAULT
              : listCommand.RESTORE_WITHOUT_NETWORK_TO_DEFAULT,
        },
      };
      await callApi(`${API_AC_ADAPTER}/devices/command`, 'POST', dto);
      setIsOpenConfirmRestore(false);
      setIsOpenConfirmRestore2(false);
      utils.showToast('Thành công');
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  // const onClickBtnUpgrade = async () => {
  //   setLoadingUpgrade(true);
  //   try {
  //     const dto = {
  //       deviceIds: [id],
  //     };
  //     await callApi(`${API_AC_ADAPTER}/devices/upgrade-firmware`, 'POST', dto);
  //     fetchData(data);
  //     utils.showToast('Nâng cấp thành công');
  //   } catch (error) {
  //     utils.showToastErrorCallApi(error);
  //   } finally {
  //     setLoadingUpgrade(false);
  //   }
  // };

  const onSubmit = () => {
    const { name, code, model, description, hardwareVersion } = watch();
    const allValue = watch();

    switch (tab) {
      case '1': {
        const dto = {
          ...dataState,
          name,
          code,
          model,
          deviceType: deviceType?.value,
          direction: deviceDerection?.value,
          description,
          deviceGroupId: valueListDeviceId?.id || null,
          hardwareVersion,
        };
        return callApiUpdate(dto, '1');
      }
      case '2': {
        const dto = {
          ...dataState,
          settings: {
            ...allValue,
          },
        };
        return callApiUpdate(dto, '2');
      }
      case '3': {
        const dto = {
          ...dataState,
          authenticationConfiguration: {
            ...allValue,
          },
        };
        return callApiUpdate(dto, '3');
      }
      default:
    }
  };

  const callApiUpdate = async (v) => {
    const dto = {
      ...v,
      ecStatus: true,
    };
    console.log('dto', dto);
    setLoading(true);
    try {
      await callApi(`${API_AC_ADAPTER}/devices/${id}`, 'PUT', dto);
      fetchData();
      utils.showToast('Cập nhật thành công');
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const ViewContent = () => {
    switch (tab) {
      case '2':
        return (
          <ViewComponent title="TCP/IP">
            <CheckBox
              name="enableDHPC"
              innerRef={register()}
              textInput="Sử dụng DHCP"
            />

            <Grid container spacing={4}>
              <Grid item sm={4}>
                <TextInput
                  label="Địa chỉ IP"
                  name="ipAddress"
                  innerRef={register()}
                  showError={renderShowError}
                  disabled={enableDHPC}
                />
              </Grid>
              <Grid item sm={4}>
                <TextInput
                  label="Gateway"
                  name="gatewayAddress"
                  innerRef={register()}
                  showError={renderShowError}
                  disabled={enableDHPC}
                />
                <TextInput
                  label="Địa chỉ Mac"
                  name="macAddress"
                  innerRef={register()}
                  showError={renderShowError}
                />
              </Grid>
              <Grid item sm={4}>
                <TextInput
                  label="Subnet Mask"
                  name="subnetMark"
                  innerRef={register()}
                  showError={renderShowError}
                  disabled={enableDHPC}
                />
              </Grid>
            </Grid>
          </ViewComponent>
        );
      case '3':
        return (
          <>
            <div className="ct-flex-row" style={{ alignItems: 'flex-start' }}>
              <div style={{ marginRight: 24 }}>
                <div className="custom-label-imput">Chế độ xác thực</div>
                <div
                  style={{ marginBottom: 40, marginTop: 16, display: 'flex' }}
                >
                  <div>
                    <div
                      style={{
                        border: '1px solid #DDDDDD',
                        padding: '0 55px 0 55px',
                      }}
                      className="ct-flex-row"
                    >
                      <div
                        style={{
                          marginRight: 50,
                        }}
                      >
                        <IconTouchLg2 />
                      </div>
                      <div
                        style={{
                          height: 50,
                          width: 1,
                          backgroundColor: '#DDDDDD',
                          marginRight: 50,
                        }}
                      />

                      <ToggleSwitch
                        height={25}
                        disabledTextValue
                        name="enableFingerprintAuthentication"
                        innerRef={register()}
                      />
                    </div>
                    <div
                      style={{
                        border: '1px solid #DDDDDD',
                        padding: '0 55px 0 52px',
                      }}
                      className="ct-flex-row"
                    >
                      <div
                        style={{
                          marginRight: 51,
                        }}
                      >
                        <IconFaceLg1 />
                      </div>
                      <div
                        style={{
                          height: 50,
                          width: 1,
                          backgroundColor: '#DDDDDD',
                          marginRight: 50,
                        }}
                      />
                      <ToggleSwitch
                        height={25}
                        disabledTextValue
                        name="enableFaceAuthentication"
                        innerRef={register()}
                      />
                    </div>
                    <div
                      style={{
                        border: '1px solid #DDDDDD',
                        padding: '0 55px 0 50px',
                      }}
                      className="ct-flex-row"
                    >
                      <div
                        style={{
                          marginRight: 50,
                        }}
                      >
                        <IconCardLg1 />
                      </div>
                      <div
                        style={{
                          height: 50,
                          width: 1,
                          backgroundColor: '#DDDDDD',
                          marginRight: 50,
                        }}
                      />
                      <ToggleSwitch
                        height={25}
                        disabledTextValue
                        name="enableCardAuthentication"
                        innerRef={register()}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <ToggleSwitch
                  name="enableThermalDetection"
                  innerRef={register()}
                  disabled
                  label="Kết hợp đo thân thiệt"
                />
                <div>
                  Chú ý: Ngưỡng nhiệt độ an toàn mặc định là 37 độ. Cho phép
                  điều chỉnh ngưỡng nhiệt từ 27 đến 42 độ
                </div>
              </div>
            </div>
            <ViewTable id={id} />
          </>
        );

      default:
        return (
          <div>
            <Grid container spacing={4}>
              <Grid item sm={4}>
                <TextInput
                  label={intl.formatMessage({ id: 'app.column.name' })}
                  name="name"
                  innerRef={register()}
                  showError={renderShowError}
                />
                <CtSelectBox
                  value={deviceType}
                  onValueChanged={(v) => {
                    setDeviceType(v);
                  }}
                  data={DEVICE_TYPE_DEVICE.filter((e) => e.value)}
                  label="Loại thiết bị"
                />
                <CtSelectBox
                  value={deviceDerection}
                  onValueChanged={(v) => {
                    setDeviceDerection(v);
                  }}
                  data={VECTOR_IN_OUT.filter((e) => e.value)}
                  label="Chiều định danh"
                />
              </Grid>
              <Grid item sm={4}>
                <CtDropDownTree
                  selectionMode="single"
                  api="device-groups"
                  label="Nhóm thiết bị"
                  allUrlApi={API_AC_ADAPTER}
                  value={valueListDeviceId}
                  onValueChanged={(newVal) => {
                    setValueListDeviceId(newVal);
                  }}
                />

                {/* {dataFirmVersion ? ( */}
                <div>
                  <LabelInput label="Nâng cấp phiên bản app" />
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <TextInput
                      // defaultValue={dataFirmVersion?.firmwareVersion}
                      disabled
                      name="firmware"
                      innerRef={register()}
                    />
                    {/* {loadingUpgrade ? (
                      <div
                        style={{
                          marginTop: -12,
                          width: 460,
                          marginLeft: 16,
                        }}
                      >
                        <CircularProgress size={24} />
                      </div>
                    ) : (
                      <Btn
                        colorText="#117B5B"
                        className="ct-btn-label-border"
                        label="Cập nhật"
                        disabled={dataFirmVersion.isLatestFirmwareVersion}
                        showTooltip={
                          (dataFirmVersion?.isLatestFirmwareVersion &&
                            ' (Phiên bản cao nhất)') ||
                          ''
                        }
                        icon={<IconFirmUpg />}
                        onClick={onClickBtnUpgrade}
                      />
                    )} */}
                  </div>
                </div>
                {/* ) : (
                  <div style={{ marginBottom: 16 }}>Đang tải dữ liệu ...</div>
                )} */}

                <TextInput
                  label="Hardware Version"
                  name="hardwareVersion"
                  innerRef={register()}
                  disabled
                />
                <TextInput
                  label="Vị trí"
                  name="doorName"
                  innerRef={register()}
                  disabled
                />
              </Grid>
              <Grid item sm={4}>
                <TextInput
                  label="ID thiết bị"
                  name="code"
                  innerRef={register()}
                  disabled
                />
                <TextInput
                  label="Tên sản phẩm"
                  name="model"
                  innerRef={register()}
                  disabled
                />
                <div style={{ marginBottom: 16 }}>
                  <div className="custom-label-imput">
                    Khôi phục cài đặt thiết bị
                  </div>
                  <div>
                    <Button
                      style={{
                        border: '1px solid #007bff',
                        textTransform: 'none',
                        height: 40,
                        width: '30%',
                        color: '#007bff',
                      }}
                      size="small"
                      onClick={() => setIsOpenConfirmRestore(true)}
                    >
                      Toàn bộ
                    </Button>
                    <Button
                      style={{
                        border: '1px solid #007bff',
                        textTransform: 'none',
                        height: 40,
                        marginLeft: 16,
                        width: 'calc(70% - 16px)',
                        color: '#007bff',
                      }}
                      size="small"
                      onClick={() => setIsOpenConfirmRestore2(true)}
                    >
                      Khôi phục trừ cài đặt mạng
                    </Button>
                  </div>
                </div>
                <TextInput
                  label="Ghi chú"
                  name="description"
                  innerRef={register()}
                  showError={renderShowError}
                />
              </Grid>
            </Grid>
          </div>
        );
    }
  };

  const history = useHistory();

  return (
    <div style={{ marginTop: 24, minWidth: 1000 }}>
      <div
        style={{ justifyContent: 'space-between', marginBottom: 24 }}
        className="ct-flex-row"
      >
        <div>
          <TitlePage title="Chi tiết thiết bị" />
        </div>
        <div className="ct-flex-row">
          <Btn
            colorText="#333"
            className="btn-cancel"
            label={intl.formatMessage({ id: 'app.button.cancel' })}
            onClick={() => {
              history.goBack();
            }}
          />
          <Btn
            colorText="#FFF"
            className="btn-save"
            label={intl.formatMessage({ id: 'app.button.save' })}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
      <div
        style={{
          padding: '12px 26px 26px 26px',
          borderRadius: 8,
          // pointerEvents: !scopes?.update && 'none',
          backgroundColor: '#FFF',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TabMainUseState
            callback={(e) => setTab(e)}
            style={{ marginBottom: 16 }}
            data={[
              { label: 'Thông tin chung', key: '1' },
              { label: 'Cấu hình mạng', key: '2' },
              // { label: 'Cấu hình xác thực', key: '3' },
            ]}
          />

          {ViewContent()}
        </form>
      </div>

      {isOpenConfirmRestore && (
        <PopupDelete
          onClickSave={() => {
            handlerRestoreToDefault('all');
          }}
          data={dataState}
          onClose={(v) => setIsOpenConfirmRestore(v)}
          textFollowTitle="Việc khôi phục cài đặt gốc sẽ xoá toàn bộ cấu hình, phiên bản,
          các thông tin trên thiết bị"
          title="Xác nhận khôi phục cài đặt thiết bị"
        />
      )}
      {isOpenConfirmRestore2 && (
        <PopupDelete
          onClickSave={() => {
            handlerRestoreToDefault('without_network');
          }}
          data={dataState}
          onClose={(v) => setIsOpenConfirmRestore2(v)}
          textFollowTitle="Việc khôi phục cài đặt gốc sẽ xoá toàn bộ cấu hình, phiên bản,
          các thông tin trên thiết bị và giữ lại các cấu hình cài đặt mạng"
          title="Xác nhận khôi phục cài đặt thiết bị ( trừ cài đặt mạng)"
        />
      )}

      {loading && <Loading />}
    </div>
  );
};

const styles = {
  btnOutline: {
    border: '1px solid #117B5B',
    textTransform: 'none',
    height: 40,
    color: '#117B5B',
    marginLeft: 16,
    borderRadius: 8,
  },
  viewLicense: {
    borderRadius: 6,
    border: '1px solid rgba(0, 0, 0, 0.24)',
    height: 40,
    width: '100%',
    cursor: 'pointer',
    paddingLeft: 8,
    justifyContent: 'space-between',
    paddingRight: 8,
    overflow: 'hidden',
  },
};

export default DetailDevices;

const initValueFilter = {
  keyword: '',
  userType: '',
  status: '',
  userGroup: '',
};

const ViewTable = ({ id }) => {
  // const [searchValue, setSearchValue] = useState('');
  const [pageSize, setPageSize] = useState(gui.optionsPageSize[0]);
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState('');
  const [valueFilter, setValueFilter] = useState(initValueFilter);
  const [openFilter, setOpenFilter] = useState(false);

  const afterSearch = () => {
    setPageIndex(1);
    setPageSize(gui.optionsPageSize[0]);
  };

  const handleChangePageIndex = (pageIndex) => {
    setPageIndex(pageIndex);
  };

  const handlePageSize = (e) => {
    const { value } = e.target;
    setPageSize(value);
    setPageIndex(1);
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, valueFilter, pageSize, pageIndex]);

  const fetchData = async () => {
    const payload = {
      keyword: valueFilter.keyword || null,
      userType: valueFilter?.userType?.value || null,
      status: valueFilter?.status?.value || null,
      page: pageIndex,
      limit: pageSize,
      userGroupIds: valueFilter?.userGroup?.id
        ? [valueFilter?.userGroup?.id]
        : null,
    };
    const dto = utils.queryString(payload);
    setLoading(true);
    try {
      const res = await callApi(
        `${API_AC_ADAPTER}/users/in-device/${id}/search?${dto}`,
        'GET',
      );
      setData(res.data);
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetValueFilter = (data) => {
    setValueFilter(data);
    setOpenFilter(false);
    afterSearch();
  };

  return (
    <>
      <div>
        <PageHeader
          title="Danh sách người dùng"
          showSearch
          showPager
          pageIndex={pageIndex}
          totalCount={data?.count || 0}
          rowsPerPage={pageSize}
          handlePageSize={handlePageSize}
          handleChangePageIndex={handleChangePageIndex}
          onSearchValueChange={(e) => {
            afterSearch();
            setValueFilter((v) => ({ ...v, keyword: e }));
          }}
          placeholderSearch="Tìm kiếm theo tên"
        >
          <IconBtn
            style={styles.iconBtnHeader}
            onClick={() => {
              setOpenFilter(true);
            }}
            icon={<BiFilterAlt color="gray" />}
            showTooltip="Bộ lọc"
          />
        </PageHeader>
        <CustomTable
          data={data.rows || []}
          disabledSelect
          row={COLUMNSLISTUSER_DETAIL}
          height={gui.screenHeight / 2}
        />
      </div>
      {loading && <Loading />}

      {openFilter && (
        <Popup
          visible
          style={{
            zIndex: '1299 !important',
          }}
          title="Bộ lọc"
          showTitle
          onHidden={() => {
            setOpenFilter(false);
          }}
          width="50%"
          height="auto"
        >
          <FilterUserInDevice
            onClose={() => setOpenFilter(false)}
            callback={handleSetValueFilter}
            data={valueFilter}
          />
        </Popup>
      )}
    </>
  );
};
