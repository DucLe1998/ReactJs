import React, { useState } from 'react';
import { DialogActions, Grid, TextField, Checkbox } from '@material-ui/core';
import CtDropDownTree from 'components/Custom/AreaTree/CtDropDownTree';
import BtnCancel from 'components/Button/BtnCancel';
import BtnSuccess from 'components/Button/BtnSuccess';
import { getApi } from 'utils/requestUtils';
import { ACCESS_CONTROL_API_SRC, API_HOST } from 'containers/apiUrl';
import {
  API_AC_ADAPTER,
  DEVICE_TYPE_DEVICE_EVENT,
} from 'containers/AC/ACDevice/constants';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import VAutocomplete from '../components/VAutocomplete';

const EVENT_TYPE_LIST = [
  { name: 'Thiết bị mất kết nối EC', id: 'EC_DISCONNECT_DEVICE' },
  { name: 'Thiết bị mất kết nối Server', id: 'SERVER_DISCONNECT_DEVICE' },
  { name: 'Mở cửa từ xa', id: 'OPEN_DOOR_BY_CMS' },
  { name: 'Mở cửa bằng nút Thoát', id: 'USER_OPEN_DOOR_BY_BUTTON_EXIT' },
  { name: 'Quét khuôn mặt không thành công', id: 'FAIL_FACE_AUTHENTICATION' },
  { name: 'Quét vân tay không thành công', id: 'FAIL_FINGER_AUTHENTICATION' },
  { name: 'Quẹt thẻ không thành công', id: 'FAIL_CARD_AUTHENTICATION' },
  { name: 'Quét khuôn mặt thành công', id: 'SUCCESS_FACE_AUTHENTICATION' },
  { name: 'Quét vân tay thành công', id: 'SUCCESS_FINGER_AUTHENTICATION' },
  { name: 'Quẹt thẻ thành công', id: 'SUCCESS_CARD_AUTHENTICATION' },
];

const USER_TYPE_LIST = [
  { name: 'Nhân viên', id: 'EMPLOYEE' },
  { name: 'Khách', id: 'GUEST' },
];

export const FilterEventColumn = ({ onClose, callback, valueFilter }) => {
  const classes = useStyles();

  const foundEventTypes =
    valueFilter?.eventType &&
    EVENT_TYPE_LIST.filter((e) => e.id == valueFilter.eventType);
  const foundUserType =
    valueFilter?.userType &&
    USER_TYPE_LIST.filter((e) => e.id == valueFilter.userType);
  const foundDeviceType =
    valueFilter?.deviceType &&
    DEVICE_TYPE_DEVICE_EVENT.filter((e) => e.id == valueFilter.deviceType);

  const [eventTypes, setEventTypes] = useState(foundEventTypes || []);
  const [user, setUser] = useState([]);
  const [userType, setUserType] = useState(foundUserType || []);
  const [userGroup, setUserGroup] = useState([]);
  const [door, setDoor] = useState([]);
  const [device, setDevice] = useState([]);
  const [deviceType, setDeviceType] = useState(foundDeviceType || []);
  const [deviceGroup, setDeviceGroup] = useState([]);

  const onSubmit = () => {
    const dto = {
      user: user?.map((i) => i.id) || '',
      userType: userType?.map((i) => i.id) || '',
      userGroup: userGroup?.map((i) => i.id) || '',
      device: device?.map((i) => i.id) || '',
      deviceType: deviceType?.map((i) => i.id) || '',
      deviceGroup: deviceGroup?.map((i) => i.id) || '',
      eventTypes: eventTypes?.map((i) => i.id) || '',
    };
    callback(dto);
    onClose();
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Sự kiện</p>
          <Autocomplete
            multiple
            disableCloseOnSelect
            value={eventTypes}
            options={EVENT_TYPE_LIST}
            disableClearable
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, selected) =>
              option.name === selected.name
            }
            onChange={(e, newVal) => {
              setEventTypes(newVal);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={params.InputProps.startAdornment ? null : 'Tất cả'}
                variant="outlined"
                size="small"
              />
            )}
            renderOption={(option, { selected }) => (
              <>
                <Checkbox
                  style={{ marginRight: 8 }}
                  checked={selected}
                  color="primary"
                />
                {option.name}
              </>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Cửa kiểm soát</p>
          <VAutocomplete
            multiple
            value={door}
            disableClearable
            firstIndex={1}
            loadData={(page, keyword) =>
              new Promise((resolve, reject) => {
                getApi(`${ACCESS_CONTROL_API_SRC}/doors`, {
                  keyword,
                  limit: 50,
                  page,
                })
                  .then((result) => {
                    resolve({
                      data: result.data?.rows,
                      totalCount: result.data?.count,
                    });
                  })
                  .catch((err) => reject(err));
              })
            }
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, selected) => option.id == selected.id}
            onChange={(e, newVal) => {
              setDoor(newVal);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Đối tượng thực hiện</p>
          <VAutocomplete
            multiple
            value={user}
            disableClearable
            firstIndex={1}
            loadData={(page, keyword) =>
              new Promise((resolve, reject) => {
                getApi(`${API_HOST}/vf/search/api/v0/accesscontrol/user`, {
                  keyword,
                  limit: 50,
                  page,
                })
                  .then((result) => {
                    resolve({
                      data: result.data?.rows,
                      totalCount: result.data?.count,
                    });
                  })
                  .catch((err) => reject(err));
              })
            }
            getOptionLabel={(option) =>
              option.fullName[option.fullName.length - 1] === ')'
                ? `${option.fullName || ''}`
                : `${option.fullName || ''} (${option.accessCode || ''})`
            }
            getOptionSelected={(option, selected) => option.id == selected.id}
            onChange={(e, newVal) => {
              setUser(newVal);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Nhóm đối tượng</p>
          <VAutocomplete
            multiple
            value={userGroup}
            disableClearable
            firstIndex={1}
            loadData={(page, keyword) =>
              new Promise((resolve, reject) => {
                getApi(`${ACCESS_CONTROL_API_SRC}/user-groups`, {
                  keyword,
                  limit: 50,
                  page,
                })
                  .then((result) => {
                    resolve({
                      data: result.data?.rows,
                      totalCount: result.data?.count,
                    });
                  })
                  .catch((err) => reject(err));
              })
            }
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, selected) => option.id == selected.id}
            onChange={(e, newVal) => {
              setUserGroup(newVal);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Loại đối tượng</p>
          <Autocomplete
            multiple
            disableCloseOnSelect
            value={userType}
            options={USER_TYPE_LIST}
            disableClearable
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, selected) =>
              option.name === selected.name
            }
            onChange={(e, newVal) => {
              setUserType(newVal);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={params.InputProps.startAdornment ? null : 'Tất cả'}
                variant="outlined"
                size="small"
              />
            )}
            renderOption={(option, { selected }) => (
              <>
                <Checkbox
                  style={{ marginRight: 8 }}
                  checked={selected}
                  color="primary"
                />
                {option.name}
              </>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Thiết bị</p>
          <VAutocomplete
            multiple
            value={device}
            disableClearable
            firstIndex={1}
            loadData={(page, keyword) =>
              new Promise((resolve, reject) => {
                getApi(`${API_AC_ADAPTER}/devices`, {
                  keyword,
                  limit: 50,
                  page,
                })
                  .then((result) => {
                    resolve({
                      data: result.results,
                      totalCount: result.totalResults,
                    });
                  })
                  .catch((err) => reject(err));
              })
            }
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, selected) => option.id == selected.id}
            onChange={(e, newVal) => {
              setDevice(newVal);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CtDropDownTree
            selectionMode="single"
            api="device-groups"
            label="Nhóm thiết bị"
            allUrlApi={API_AC_ADAPTER}
            value={deviceGroup}
            onValueChanged={(newVal) => {
              setDeviceGroup(newVal);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Loại thiết bị</p>
          <Autocomplete
            multiple
            disableCloseOnSelect
            value={deviceType}
            options={DEVICE_TYPE_DEVICE_EVENT}
            disableClearable
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, selected) =>
              option.name === selected.name
            }
            onChange={(e, newVal) => {
              setDeviceType(newVal);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={params.InputProps.startAdornment ? null : 'Tất cả'}
                variant="outlined"
                size="small"
              />
            )}
            renderOption={(option, { selected }) => (
              <>
                <Checkbox
                  style={{ marginRight: 8 }}
                  checked={selected}
                  color="primary"
                />
                {option.name}
              </>
            )}
          />
        </Grid>
      </Grid>
      <DialogActions style={{ marginTop: 36 }}>
        <BtnCancel
          onClick={() => {
            setEventTypes([]);
            setDoor([]);
            setUser([]);
            setUserType([]);
            setUserGroup([]);
            setDevice([]);
            setDeviceType([]);
            setDeviceGroup([]);
          }}
        >
          Mặc định
        </BtnCancel>
        <BtnCancel onClick={onClose}>Hủy</BtnCancel>
        <BtnSuccess onClick={onSubmit}>Lọc</BtnSuccess>
      </DialogActions>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    padding: '0px 10px',
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& .MuiInputBase-input': {
      boxSizing: 'border-box',
      height: '100%',
    },
    '& .MuiPaper-rounded': {
      borderRadius: '8px',
    },
    '& .MuiDialogActions-root': {
      padding: '32px',
    },
  },
  label: {
    fontWeight: '500',
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#999999',
    margin: '5px 0',
  },
  warning: {
    fontWeight: '500',
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#DD0000',
    margin: '5px 0',
  },
  button: {
    padding: '12px 16px',
    border: 'none',
    outline: 'none',
    lineHeight: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    minWidth: '104px',
    boxSizing: 'border-box',
  },
  iconBtnHeader: {
    backgroundColor: 'rgba(116, 116, 128, 0.08)',
    height: 36,
    width: 36,
    borderRadius: 6,
  },
  popup: {
    zIndex: '1299 !important',
    '& .dx-popup-content': {
      padding: '0px 36px',
    },
    '& .title': {
      padding: '0px',
    },
  },
  uploadImageContainer: {
    width: '100%',
    borderRadius: '12px',
    height: '186px',
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default FilterEventColumn;
