import React, { useMemo, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { getApiCustom, getApi } from 'utils/requestUtils';
import { useForm, Controller } from 'react-hook-form';
import { IconButtonSquare } from 'components/CommonComponent';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  DialogContent,
  Grid,
  DialogActions,
  Dialog,
  TextField,
  DialogTitle,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core';
import DialogAddAccess from './DialogAddAccess';
import DialogAddAllowed from './DialogAddAllowed';
import { API_IAM, GUEST_REGISTRATION, NAVIGATION_API } from '../../apiUrl';
import messages from '../messages';

import { dialogAddguestStyles } from '../styles';
import VAutocomplete from '../../../components/VAutocomplete';
export default function DialogEditVehicles({
  open,
  handleClose,
  initialValues,
  onSuccess,
  guestsData,
  guestIndex,
  guest,
}) {
  const classes = dialogAddguestStyles();
  const intl = useIntl();
  const [isDisabled, setDisabled] = useState(false);
  const [typeOfCar, setTypeOfCar] = useState('');
  const [typeOfCarName, setTypeOfCarName] = useState();
  const [guestLocal, setGuestLocal] = useState('');
  const [guestLocalName, setGuestLocalName] = useState('');
  const [isWarning, setWarning] = useState(false);
  const [identityNumbers, setIdentityNumbers] = useState([]);
  const [accessDennyVehicleRoutes, setAccessDennyVehicleRoutes] = useState([]);
  const [allowedVehicleRoutes, setAllowedVehicleRoutes] = useState([]);
  const [guestRepresentationId, setguestRepresentationId] = useState();
  const [openAddAccess, setOpenAddAccess] = useState(false);
  const [openAddAllowed, setOpenAddAllowed] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (initialValues) {
      setTypeOfCarName(initialValues?.typeOfCarName);
      initialValues.typeOfCar = {
        id: initialValues?.typeOfCarId,
        name: initialValues?.typeOfCarName,
      };
      setGuestLocalName(initialValues?.guestName);
      initialValues.guestLocal = {
        id: initialValues?.guestId,
        name: initialValues?.guestName,
      };
    }
    reset(initialValues);
    // setDisabled(initialValues?.isRepresentation);
  }, [initialValues]);
  useEffect(() => {
    // const items = guestsData.map((item) => item.numberPlate);
    // items.splice(guestIndex, 1);

    // setIdentityNumbers(items);
    if (guestsData.length > 0) {
      const item = guestsData[guestIndex];
      if (item) {
        setAccessDennyVehicleRoutes(item?.accessDennyVehicleRoutes);
        setAllowedVehicleRoutes(item?.allowedVehicleRoutes);
      }
    }
  }, [guestsData, guestIndex]);
  // useEffect(() => {
  //   reset({
  //     typeOfCarId: '',
  //     name: '',
  //     numberPlate: '',
  //     guestRepresentationId: '',
  //     accessDennyVehicleRoutes: [
  //       {
  //         pointCode: 'string',
  //         pointId: 'string',
  //         pointName: 'string',
  //       },
  //     ],
  //     allowedVehicleRoutes: [
  //       {
  //         pointCode: 'string',
  //         pointId: 'string',
  //         pointName: 'string',
  //       },
  //     ],
  //   });s
  //   setDisabled(isFirstAdd);
  // }, [isFirstAdd]);

  // useEffect(() => {
  //   console.log(guestsData)
  //   const items = guestsData.map((item) => item.identityNumber);
  //   setIdentityNumbers(items);
  // }, [guestsData]);

  const validateIdentityNumber = (value) => {
    if (identityNumbers.indexOf(value) !== -1) return false;
    return true;
  };
  let timeout = useMemo(() => undefined, []);
  const debounceSearchIdentityNumber = (value) => {
    // eslint-disable-next-line no-unused-expressions
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (!value) return;
      getApiCustom(
        {
          url: `${GUEST_REGISTRATION}/guests`,
          params: { identityNumber: value },
        },
        (res) => {
          if (res.count) {
            setWarning(true);
          }
        },
      );
    }, 700);
  };
  const onSubmitForm = (values) => {
    const result = { ...values };
    result.guestLocalId = +guestLocal;
    result.guestName = guestLocalName;
    result.typeOfCarId = typeOfCar;
    result.typeOfCarName = typeOfCarName;
    result.accessDennyVehicleRoutes = accessDennyVehicleRoutes;
    result.allowedVehicleRoutes = allowedVehicleRoutes;
    setWarning(false);
    clearErrors();
    onSuccess(result);
  };
  const handleClickAddAccess = () => {
    setOpenAddAccess(true);
  };
  const handleCloseAddAccess = () => {
    setOpenAddAccess(false);
  };
  const createAccessData = (data) => {
    setOpenAddAccess(false);
    setAccessDennyVehicleRoutes([...data]);
  };
  const handleClickAddAllowed = () => {
    setOpenAddAllowed(true);
  };
  const handleCloseAddAllowed = () => {
    setOpenAddAllowed(false);
  };
  const createAllowedData = (data) => {
    setOpenAddAllowed(false);
    setAllowedVehicleRoutes([...data]);
  };
  const handleDeleteAllowed = (index) => {
    const newData = [];
    allowedVehicleRoutes.map((x, id) => (id != index ? newData.push(x) : ''));
    setAllowedVehicleRoutes(newData);
  };
  const handleDeleteAccess = (index) => {
    const newData = [];
    accessDennyVehicleRoutes.map((x, id) =>
      id != index ? newData.push(x) : '',
    );
    setAccessDennyVehicleRoutes(newData);
  };
  return (
    <Dialog
      open={open}
      maxWidth="lg"
      fullWidth
      onClose={(e) => {
        setWarning(false);
        handleClose(e);
      }}
      className={classes.root}
    >
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogTitle>Thông tin xe</DialogTitle>
        <DialogContent style={{ overflowY: 'unset' }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Grid container direction="column">
                <p className={classes.label}>Loại xe</p>
                <Controller
                  control={control}
                  name="typeOfCar"
                  defaultValue=""
                  render={(props) => (
                    <VAutocomplete
                      value={props.value}
                      fullWidth
                      // disabled={!watchFields.block}
                      // disableClearable
                      noOptionsText="Không có dữ liệu"
                      getOptionLabel={(option) => option?.name || ''}
                      firstIndex={1}
                      getOptionSelected={(option, selected) =>
                        option.id == selected.id
                      }
                      loadData={() =>
                        new Promise((resolve, reject) => {
                          getApi(`${NAVIGATION_API.TYPE_OF_CAR}`)
                            .then((result) => {
                              resolve({
                                data: [...result.data],
                                totalCount: result.data.length || 0,
                              });
                            })
                            .catch((err) => reject(err));
                        })
                      }
                      onChange={(e, value) => {
                        props.onChange(value);
                        setTypeOfCar(value.id);
                        setTypeOfCarName(value.name);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Chọn loại xe"
                          error={!!errors.floor}
                          helperText={errors.floor && errors.floor.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container direction="column">
                <p className={classes.label}>Tên xe</p>
                <Controller
                  control={control}
                  name="name"
                  rules={{
                    required: true,
                  }}
                  render={(props) => (
                    <TextField
                      autoComplete="off"
                      autoFocus
                      error={!!errors.typeOfCarId}
                      value={props.value}
                      inputProps={{
                        maxLength: 50,
                      }}
                      placeholder="Nhập tên xe"
                      variant="outlined"
                      onChange={props.onChange}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container direction="column">
                <p className={classes.label}>Biển số xe *</p>
                <Controller
                  control={control}
                  name="numberPlate"
                  rules={{
                    required: true,
                  }}
                  render={(props) => (
                    <TextField
                      autoComplete="off"
                      autoFocus
                      error={!!errors.typeOfCarId}
                      value={props.value}
                      inputProps={{
                        maxLength: 50,
                      }}
                      placeholder="Nhập biển số xe"
                      variant="outlined"
                      onChange={props.onChange}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container direction="column">
                <p className={classes.label}>Người đại diện *</p>
                <Controller
                  control={control}
                  name="guestLocal"
                  defaultValue=""
                  render={(props) => (
                    <VAutocomplete
                      value={props.value}
                      fullWidth
                      // disabled={!watchFields.block}
                      // disableClearable
                      noOptionsText="Không có dữ liệu"
                      getOptionLabel={(option) => option?.name || ''}
                      firstIndex={1}
                      getOptionSelected={(option, selected) =>
                        option.id == selected.id
                      }
                      loadData={() => {
                        if (guest) {
                          const result = guest.map((x, index) => ({
                            name: x.fullName,
                            id: index,
                          }));
                          return { data: result, totalCount: result.length };
                        }
                        return { data: [], totalCount: 0 };
                      }}
                      onChange={(e, value) => {
                        props.onChange(value);
                        setGuestLocal(value.id);
                        setGuestLocalName(value.name);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Chọn người đại diện"
                          error={!!errors.floor}
                          helperText={errors.floor && errors.floor.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                <h3 style={{ margin: 0, fontSize: '20px', lineHeight: '23px' }}>
                  Điểm cấm dừng đỗ
                </h3>
                <Grid
                  item
                  xs={4}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  <p
                    style={{
                      color: '#117B5B',
                      margin: 0,
                      cursor: 'pointer',
                      marginRight: '12px',
                    }}
                  >
                    Thêm điểm cấm dừng đỗ
                  </p>
                  <Tooltip title="Thêm">
                    <IconButtonSquare onClick={handleClickAddAccess}>
                      <AddIcon fontSize="small" />
                    </IconButtonSquare>
                  </Tooltip>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TableContainer>
                  <Table
                    style={{ border: '1px solid #dddddd' }}
                    className={classes.table}
                  >
                    <TableHead>
                      <TableRow className={classes.tableRow}>
                        <TableCell>
                          {intl.formatMessage(messages.orderNumber)}
                        </TableCell>
                        <TableCell>Điểm cấm dừng</TableCell>
                        <TableCell>
                          {intl.formatMessage(messages.actions)}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {accessDennyVehicleRoutes &&
                        accessDennyVehicleRoutes.map((row, index) => (
                          <TableRow className={classes.tableRow}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.pointName}</TableCell>
                            <TableCell>
                              <Tooltip title="Xóa">
                                <IconButtonSquare
                                  onClick={() => handleDeleteAccess(index)}
                                >
                                  <DeleteIcon />
                                </IconButtonSquare>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                <h3 style={{ margin: 0, fontSize: '20px', lineHeight: '23px' }}>
                  Đăng ký lộ trình xe
                </h3>
                <Grid
                  item
                  xs={4}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  <p
                    style={{
                      color: '#117B5B',
                      margin: 0,
                      cursor: 'pointer',
                      marginRight: '12px',
                    }}
                  >
                    Thêm lộ trình xe
                  </p>
                  <Tooltip title="Thêm">
                    <IconButtonSquare onClick={handleClickAddAllowed}>
                      <AddIcon fontSize="small" />
                    </IconButtonSquare>
                  </Tooltip>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TableContainer>
                  <Table
                    style={{ border: '1px solid #dddddd' }}
                    className={classes.table}
                  >
                    <TableHead>
                      <TableRow className={classes.tableRow}>
                        <TableCell>
                          {intl.formatMessage(messages.orderNumber)}
                        </TableCell>
                        <TableCell>Điểm dừng</TableCell>
                        <TableCell>
                          {intl.formatMessage(messages.actions)}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allowedVehicleRoutes &&
                        allowedVehicleRoutes.map((row, index) => (
                          <TableRow className={classes.tableRow}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.pointName}</TableCell>
                            <TableCell>
                              <Tooltip title="Xóa">
                                <IconButtonSquare
                                  onClick={() => handleDeleteAllowed(index)}
                                >
                                  <DeleteIcon />
                                </IconButtonSquare>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            onClick={() => {
              setWarning(false);
              handleClose();
            }}
            className={classes.button}
            style={{ border: '1px solid #dddddd' }}
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={classes.button}
            style={{
              marginLeft: '32px',
              color: '#fff',
              boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
              backgroundColor: '#00554A',
            }}
          >
            {intl.formatMessage(messages.save)}
          </button>
        </DialogActions>
      </form>
      <DialogAddAccess
        open={openAddAccess}
        handleClose={handleCloseAddAccess}
        onSuccess={createAccessData}
        approveData={accessDennyVehicleRoutes}
      />
      <DialogAddAllowed
        open={openAddAllowed}
        handleClose={handleCloseAddAllowed}
        onSuccess={createAllowedData}
        approveData={allowedVehicleRoutes}
      />
    </Dialog>
  );
}
