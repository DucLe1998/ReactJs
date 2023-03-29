import React, { useState } from 'react';
import { DialogActions, Grid, TextField, Checkbox } from '@material-ui/core';
import BtnCancel from 'components/Button/BtnCancel';
import BtnSuccess from 'components/Button/BtnSuccess';
import { getApi } from 'utils/requestUtils';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import VAutocomplete from '../components/VAutocomplete';

export const FilterEventColumn = ({ onClose, callback }) => {
  const classes = useStyles();

  const [eventTypes, setEventTypes] = useState([]);
  const [user, setUser] = useState([]);
  const [userType, setUserType] = useState([]);
  const [userGroup, setUserGroup] = useState([]);
  const [door, setDoor] = useState([]);
  const [elevator, setElevator] = useState([]);
  const [device, setDevice] = useState([]);
  const [deviceType, setDeviceType] = useState([]);
  const [deviceGroup, setDeviceGroup] = useState([]);
  const [dataFilter, setDataFilter] = useState({
    eventType: [],
    user: [],
    userType: [],
    userGroup: [],
    door: [],
    elevator: [],
    device: [],
    deviceType: [],
    deviceGroup: [],
  });

  const DEVICE_TYPE_LIST = [
    { name: 'Cam nhiệt', id: 'CAMERA_THERMAL' },
    { name: 'Cửa vào', id: 'CAMERA_ACCESS_IN' },
    { name: 'Cửa ra', id: 'CAMERA_ACCESS_OUT' },
    { name: 'Phân tầng thang máy', id: 'CAMERA_ELEVATOR' },
  ];

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
    { name: 'Chủ nhà', id: 'RESIDENT' },
    { name: 'Nhân viên', id: 'EMPLOYEE' },
    { name: 'Khách', id: 'GUEST' },
  ];

  const onSubmit = () => {
    // console.log('dataFilter', dataFilter);
    callback(dataFilter);
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
              const eventTypelist = [];
              for (let i = 0; i < newVal.length; i++)
                eventTypelist.push(newVal[i].id);
              // console.log('newVal eventType', newVal);
              setDataFilter({
                door: door.map((o) => o.id),
                elevator: elevator.map((o) => o.id),
                user: user.map((o) => o.id),
                userType: userType.map((o) => o.id),
                userGroup: userGroup.map((o) => o.id),
                device: device.map((o) => o.id),
                deviceType: deviceType.map((o) => o.id),
                deviceGroup: deviceGroup.map((o) => o.id),
                eventType: eventTypelist,
              });
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
        <Grid item xs={12} sm={6} />
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
              const doorlist = [];
              for (let i = 0; i < newVal.length; i++)
                doorlist.push(newVal[i].id);
              // console.log('newVal doors', newVal);
              setDataFilter({
                door: doorlist,
                elevator: elevator.map((o) => o.id),
                user: user.map((o) => o.id),
                userType: userType.map((o) => o.id),
                userGroup: userGroup.map((o) => o.id),
                device: device.map((o) => o.id),
                deviceType: deviceType.map((o) => o.id),
                deviceGroup: deviceGroup.map((o) => o.id),
                eventType: eventTypes.map((o) => o.id),
              });
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Thang máy</p>
          <VAutocomplete
            multiple
            value={elevator}
            disableClearable
            firstIndex={1}
            loadData={(page, keyword) =>
              new Promise((resolve, reject) => {
                getApi(`${ACCESS_CONTROL_API_SRC}/elevators/search`, {
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
              setElevator(newVal);
              const elevatorlist = [];
              for (let i = 0; i < newVal.length; i++)
                elevatorlist.push(newVal[i].id);
              // console.log('newVal elevators', newVal);
              setDataFilter({
                door: door.map((o) => o.id),
                elevator: elevatorlist,
                user: user.map((o) => o.id),
                userType: userType.map((o) => o.id),
                userGroup: userGroup.map((o) => o.id),
                device: device.map((o) => o.id),
                deviceType: deviceType.map((o) => o.id),
                deviceGroup: deviceGroup.map((o) => o.id),
                eventType: eventTypes.map((o) => o.id),
              });
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
                getApi(`${ACCESS_CONTROL_API_SRC}/users/search`, {
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
              const userlist = [];
              for (let i = 0; i < newVal.length; i++)
                userlist.push(newVal[i].id);
              // console.log('newVal users', newVal);
              setDataFilter({
                door: door.map((o) => o.id),
                elevator: elevator.map((o) => o.id),
                user: userlist,
                userType: userType.map((o) => o.id),
                userGroup: userGroup.map((o) => o.id),
                device: device.map((o) => o.id),
                deviceType: deviceType.map((o) => o.id),
                deviceGroup: deviceGroup.map((o) => o.id),
                eventType: eventTypes.map((o) => o.id),
              });
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} />
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
              const userGrouplist = [];
              for (let i = 0; i < newVal.length; i++)
                userGrouplist.push(newVal[i].id);
              // console.log('newVal userGroup', newVal);
              setDataFilter({
                door: door.map((o) => o.id),
                elevator: elevator.map((o) => o.id),
                user: user.map((o) => o.id),
                userType: userType.map((o) => o.id),
                userGroup: userGrouplist,
                device: device.map((o) => o.id),
                deviceType: deviceType.map((o) => o.id),
                deviceGroup: deviceGroup.map((o) => o.id),
                eventType: eventTypes.map((o) => o.id),
              });
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
              const userTypelist = [];
              for (let i = 0; i < newVal.length; i++)
                userTypelist.push(newVal[i].id);
              // console.log('newVal userType', newVal);
              setDataFilter({
                door: door.map((o) => o.id),
                elevator: elevator.map((o) => o.id),
                user: user.map((o) => o.id),
                userType: userTypelist,
                userGroup: userGroup.map((o) => o.id),
                device: device.map((o) => o.id),
                deviceType: deviceType.map((o) => o.id),
                deviceGroup: deviceGroup.map((o) => o.id),
                eventType: eventTypes.map((o) => o.id),
              });
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
                getApi(`${ACCESS_CONTROL_API_SRC}/devices/search`, {
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
              setDevice(newVal);
              const devicelist = [];
              for (let i = 0; i < newVal.length; i++)
                devicelist.push(newVal[i].id);
              // console.log('newVal device', newVal);
              setDataFilter({
                door: door.map((o) => o.id),
                elevator: elevator.map((o) => o.id),
                user: user.map((o) => o.id),
                userType: userType.map((o) => o.id),
                userGroup: userGroup.map((o) => o.id),
                device: devicelist,
                deviceType: deviceType.map((o) => o.id),
                deviceGroup: deviceGroup.map((o) => o.id),
                eventType: eventTypes.map((o) => o.id),
              });
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} />
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Nhóm thiết bị</p>
          <VAutocomplete
            multiple
            value={deviceGroup}
            disableClearable
            firstIndex={1}
            loadData={(page, keyword) =>
              new Promise((resolve, reject) => {
                getApi(`${ACCESS_CONTROL_API_SRC}/device-groups`, {
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
              setDeviceGroup(newVal);
              const deviceGrouplist = [];
              for (let i = 0; i < newVal.length; i++)
                deviceGrouplist.push(newVal[i].id);
              // console.log('newVal deviceGroup', newVal);
              setDataFilter({
                door: door.map((o) => o.id),
                elevator: elevator.map((o) => o.id),
                user: user.map((o) => o.id),
                userType: userType.map((o) => o.id),
                userGroup: userGroup.map((o) => o.id),
                device: device.map((o) => o.id),
                deviceType: deviceType.map((o) => o.id),
                deviceGroup: deviceGrouplist,
                eventType: eventTypes.map((o) => o.id),
              });
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Loại thiết bị</p>
          <Autocomplete
            multiple
            disableCloseOnSelect
            value={deviceType}
            options={DEVICE_TYPE_LIST}
            disableClearable
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, selected) =>
              option.name === selected.name
            }
            onChange={(e, newVal) => {
              setDeviceType(newVal);
              const deviceTypelist = [];
              for (let i = 0; i < newVal.length; i++)
                deviceTypelist.push(newVal[i].id);
              // console.log('newVal deviceType', newVal);
              setDataFilter({
                door: door.map((o) => o.id),
                elevator: elevator.map((o) => o.id),
                user: user.map((o) => o.id),
                userType: userType.map((o) => o.id),
                userGroup: userGroup.map((o) => o.id),
                device: device.map((o) => o.id),
                deviceType: deviceTypelist,
                deviceGroup: deviceGroup.map((o) => o.id),
                eventType: eventTypes.map((o) => o.id),
              });
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
            setElevator([]);
            setUser([]);
            setUserType([]);
            setUserGroup([]);
            setDevice([]);
            setDeviceType([]);
            setDeviceGroup([]);
            setDataFilter({
              eventType: [],
              user: [],
              userType: [],
              userGroup: [],
              door: [],
              elevator: [],
              device: [],
              deviceType: [],
              deviceGroup: [],
            });
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
