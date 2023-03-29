/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-unstable-nested-components */
import Grid from '@material-ui/core/Grid';
import TabMainUseState from 'components/Custom/Tab/TabMainUseState';
import { useParams, useHistory } from 'react-router-dom';
import TitlePage from 'components/Custom/TitlePage';
import Loading from 'containers/Loading/Loadable';
import CtDropDownTree from 'components/Custom/AreaTree/CtDropDownTree';
import LabelInput from 'components/TextInput/element/LabelInput';
import CtSelectBox from 'components/Custom/Select/CtSelectBox';
import VAutocomplete from 'components/VAutocomplete';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Btn from 'components/Custom/Btn';
import moment from 'moment';
import ShowErrorValidate from 'components/TextInput/ShowErrorValidate';
import TextInput from 'components/TextInput/TextInput';
import { callApi, getApi } from 'utils/requestUtils';
import utils, { validationSchema } from 'utils/utils';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import './styles.css';
import {
  API_AC_ADAPTER,
  DEVICE_TYPE_DEVICE,
  VECTOR_IN_OUT,
} from '../ACDevice/constants';

const DetailDoor = () => {
  const history = useHistory();

  const { id, type } = useParams();
  const [tab, setTab] = useState('1');

  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, errors, reset } = useForm({
    defaultValue: {
      kernelVersion: 'a',
    },
    resolver: validationSchema({
      name: yup
        .string()
        .trim()
        // .required()
        .max(100, '100 ký tự'),
      des: yup.string().trim().max(250, '250 ký tự'),
    }),
  });

  const [doorGroup, setDoorGroup] = useState('');
  const [deviceGroup, setDeviceGroup] = useState('');
  const [device, setDevice] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [deviceDirection, setDeviceDirection] = useState('');

  const [dataForm, setDataForm] = useState({
    name: '',
    des: '',
  });

  const itemDoorTreeView = localStorage.getItem('item-door-tree-view');
  const itemDoorTreeViewParse = JSON.parse(itemDoorTreeView);

  useEffect(() => {
    if (itemDoorTreeViewParse && type === 'add') {
      setTimeout(() => {
        setDoorGroup({
          id: itemDoorTreeViewParse.id,
          name: itemDoorTreeViewParse.name,
          pathOfTrees: itemDoorTreeViewParse.pathOfTrees,
        });
      }, 300);
    }
  }, []);

  useEffect(() => {
    if (id && id !== 'null') {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await callApi(`${ACCESS_CONTROL_API_SRC}/doors/${id}`, 'GET');
      if (res) {
        const {
          name,
          description,
          doorAccesses,
          lastUpdatedByUser,
          updatedAt,
          deviceModel,
          doorGroup,
        } = res.data;

        try {
          const resDevice = await callApi(
            `${API_AC_ADAPTER}/devices/in-group/${deviceModel.id}`,
            'GET',
          );
          const { deviceType, direction, deviceGroup } = resDevice.data;
          setTimeout(() => {
            setDeviceDirection(
              VECTOR_IN_OUT.find((e) => e.value === direction),
            );
          }, 300);
          setTimeout(() => {
            setDeviceType(
              DEVICE_TYPE_DEVICE.find((e) => e.value === deviceType),
            );
          }, 300);
          setTimeout(() => {
            setDeviceGroup({
              id: deviceGroup.id,
              name: deviceGroup.name,
            });
          }, 300);
        } catch (error) {
          utils.showToastErrorCallApi(error);
        }
        setTimeout(() => {
          setDevice({
            id: deviceModel?.id,
            name: deviceModel?.name,
          });
        }, 300);
        setTimeout(() => {
          setDoorGroup({
            id: doorGroup?.id,
            name: doorGroup?.name,
            pathOfTrees: doorGroup?.pathOfTrees || [],
          });
        }, 300);

        setDataForm({
          name,
          des: description,
        });
        reset({
          name,
          des: description,
          accessLevel: doorAccesses?.map((e) => e.name).join(', ') || '',
          lastUpdatedByUser: lastUpdatedByUser?.fullName || '',
          updatedAt: moment(updatedAt).format('DD/MM/YYYY'),
        });
      }
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const renderShowError = (label, name) => (
    <ShowErrorValidate label={label} errors={errors} name={name} />
  );

  const onSubmit = () => {
    if (type === 'add') {
      // if (!device) {
      //   setTab('2');
      //   utils.showToast('Chưa chọn thiết bị!', 'error');
      //   return;
      // }
      if (!doorGroup) {
        utils.showToast('Chưa chọn nhóm cửa!', 'error');
        return;
      }
    }
    const dto = {
      description: dataForm.des,
      deviceId: device.id,
      doorGroupId: doorGroup.id,
      name: dataForm.name,
    };
    if (type === 'add') {
      callApiUpdate(dto);
    } else {
      callApiUpdate(dto);
    }
  };

  const callApiUpdate = async (v) => {
    setLoading(true);
    try {
      await callApi(
        type === 'add'
          ? `${ACCESS_CONTROL_API_SRC}/doors`
          : `${ACCESS_CONTROL_API_SRC}/doors/${id}`,
        type === 'add' ? 'POST' : 'PUT',
        v,
      );
      if (type === 'add') {
        history.goBack();
      } else {
        fetchData();
      }
      utils.showToast(
        type === 'add' ? 'Tạo thành công' : 'Cập nhật thành công',
      );
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
          <div>
            <Grid container spacing={4}>
              <Grid item sm={6}>
                <CtDropDownTree
                  selectionMode="single"
                  api="device-groups"
                  label="Nhóm thiết bị"
                  allUrlApi={API_AC_ADAPTER}
                  value={deviceGroup}
                  onValueChanged={(newVal) => {
                    setDeviceGroup(newVal);
                    setDevice('');
                  }}
                />
              </Grid>
              <Grid item sm={6}>
                <CtSelectBox
                  value={deviceType}
                  onValueChanged={(v) => {
                    setDeviceType(v);
                  }}
                  disabled={!deviceGroup}
                  data={DEVICE_TYPE_DEVICE.filter((e) => e.value)}
                  label="Loại thiết bị"
                />
              </Grid>
              <Grid item sm={6}>
                <CtSelectBox
                  value={deviceDirection}
                  onValueChanged={(v) => {
                    setDeviceDirection(v);
                  }}
                  disabled={!deviceType}
                  data={VECTOR_IN_OUT.filter((e) => e.value)}
                  label="Chiều định danh"
                />
              </Grid>
              <Grid item sm={6}>
                <div style={{ marginBottom: 16 }}>
                  <LabelInput label="Thiết bị" />
                  <VAutocomplete
                    value={device}
                    disableClearable
                    disabled={!deviceDirection}
                    firstIndex={1}
                    loadData={(page, keyword) =>
                      new Promise((resolve, reject) => {
                        getApi(`${API_AC_ADAPTER}/devices/in-group/${deviceGroup.id}`, {
                          keyword,
                          limit: 50,
                          page,
                          deviceTypeModels: deviceType.value,
                        })
                          .then((result) => {
                            resolve({
                              data: result?.data?.rows,
                              totalCount: result?.data?.count,
                            });
                          })
                          .catch((err) => reject(err));
                      })
                    }
                    getOptionLabel={(option) => option?.deviceName || ''}
                    getOptionSelected={(option, selected) =>
                      option.id == selected.id
                    }
                    onChange={(e, newVal) => setDevice(newVal)}
                  />
                </div>
              </Grid>
            </Grid>
          </div>
        );
      default:
        return (
          <div>
            <Grid container spacing={4}>
              <Grid item sm={4}>
                <TextInput
                  label="Tên cửa *"
                  name="name"
                  innerRef={register()}
                  showError={renderShowError}
                  defaultValue={dataForm.name}
                  // showInputWithValue
                  onChange={(e) =>
                    setDataForm((v) => ({ ...v, name: e || '' }))
                  }
                />
                <TextInput
                  label="Miêu tả"
                  name="des"
                  innerRef={register()}
                  value={dataForm.des}
                  showError={renderShowError}
                  // showInputWithValue
                  onChange={(e) => setDataForm((v) => ({ ...v, des: e }))}
                />
              </Grid>
              <Grid item sm={4}>
                <CtDropDownTree
                  selectionMode="single"
                  api="door-groups"
                  label="Nhóm cửa *"
                  value={doorGroup}
                  dataDefault={doorGroup}
                  onValueChanged={(newVal) => {
                    setDoorGroup(newVal);
                  }}
                />
                {type === 'update' ? (
                  <TextInput
                    label="Người cập nhật cuối"
                    name="lastUpdatedByUser"
                    innerRef={register()}
                    disabled
                  />
                ) : null}
              </Grid>
              <Grid item sm={4}>
                <TextInput
                  label="Access level"
                  name="accessLevel"
                  innerRef={register()}
                  disabled
                />
                <TextInput
                  label="Thời gian cập nhật"
                  name="updatedAt"
                  innerRef={register()}
                  disabled
                />
              </Grid>
            </Grid>
          </div>
        );
    }
  };

  return (
    <div style={{ marginTop: 24, minWidth: 1000 }}>
      <div
        style={{ justifyContent: 'space-between', marginBottom: 24 }}
        className="ct-flex-row"
      >
        <div>
          <TitlePage title={type === 'add' ? 'Thêm mới cửa' : 'Chi tiết cửa'} />
        </div>
        <div className="ct-flex-row">
          <Btn
            colorText="#333"
            className="btn-cancel"
            label="Hủy"
            onClick={() => {
              history.goBack();
            }}
          />
          <Btn
            colorText="#FFF"
            className="btn-save"
            label={type === 'add' ? 'Tạo' : 'Lưu'}
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
            style={{ marginBottom: 16 }}
            callback={(e) => setTab(e)}
            tab={tab}
            data={[
              { label: 'Thông tin chung', key: '1' },
              { label: 'Cấu hình cửa', key: '2' },
            ]}
          />

          {ViewContent()}
        </form>
      </div>

      {loading && <Loading />}
    </div>
  );
};

export default DetailDoor;
