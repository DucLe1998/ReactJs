import React, { useMemo, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { getApiCustom, getApi } from 'utils/requestUtils';
import { useForm, Controller } from 'react-hook-form';
import { IconButtonSquare } from 'components/CommonComponent';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import QRCode from 'react-qr-code';
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
import { TextBox } from 'devextreme-react/text-box';
import DialogAddAccess from './DialogAddAccess';
import DialogAddAllowed from './DialogAddAllowed';
import { API_IAM, GUEST_REGISTRATION, NAVIGATION_API } from '../../apiUrl';
import messages from '../messages';
import { dialogAddguestStyles } from '../styles';
import VAutocomplete from '../../../components/VAutocomplete';
export default function DialogAddVehicles({
  open,
  handleClose,
  initialValues,
  onSuccess,
  guestsData,
  guestIndex,
  guest,
  registrationCode,
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
    reset(initialValues);
    // setDisabled(initialValues?.isRepresentation);
  }, [initialValues]);
  useEffect(() => {
    // const items = guestsData.map((item) => item.numberPlate);
    // items.splice(guestIndex, 1);

    // setIdentityNumbers(items);
    if (guestsData.length > 0) {
      const item = guestsData[guestIndex];
      setAccessDennyVehicleRoutes(item.accessDennyVehicleRoutes);
      setAllowedVehicleRoutes(item.allowedVehicleRoutes);
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
    onSuccess(values);
    setAllowedVehicleRoutes([]);
    setAccessDennyVehicleRoutes([]);
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
    setAllowedVehicleRoutes([...allowedVehicleRoutes.splice(index, 1)]);
  };
  const handleDeleteAccess = (index) => {
    setAccessDennyVehicleRoutes([...accessDennyVehicleRoutes.splice(index, 1)]);
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
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Grid container direction="column">
                <p className={classes.label}>Tên xe</p>
                <Controller
                  control={control}
                  name="name"
                  defaultValue=""
                  render={(props) => (
                    <TextBox
                      maxLength="50"
                      width="100%"
                      name="typeOfCarName"
                      disabled
                      value={guestsData[guestIndex]?.vehicleName}
                      onValueChanged={(e) => {
                        // formik.setFieldValue('documentReference', e.value);
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} md={3}>
              <Grid container direction="column">
                <p className={classes.label}>Loại xe</p>
                <Controller
                  control={control}
                  name="typeOfCarName"
                  defaultValue=""
                  render={(props) => (
                    <TextBox
                      maxLength="50"
                      width="100%"
                      name="typeOfCarName"
                      disabled
                      value={guestsData[guestIndex]?.typeOfCarName}
                      onValueChanged={(e) => {
                        // formik.setFieldValue('documentReference', e.value);
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid item xs={12} md={3}>
              <Grid container direction="column">
                <p className={classes.label}>Biển số xe</p>
                <Controller
                  control={control}
                  name="numberPlate"
                  defaultValue=""
                  render={(props) => (
                    <TextBox
                      maxLength="50"
                      width="100%"
                      name="numberPlate"
                      disabled
                      value={guestsData[guestIndex]?.numberPlate}
                      onValueChanged={(e) => {
                        // formik.setFieldValue('documentReference', e.value);
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} md={3}>
              <Grid container direction="column">
                <p className={classes.label}>Người đại diện</p>
                <Controller
                  control={control}
                  name="guestInfo"
                  defaultValue=""
                  render={(props) => (
                    <TextBox
                      maxLength="50"
                      width="100%"
                      name="guestInfo"
                      disabled
                      value={guestsData[guestIndex]?.guestInfo?.name}
                      onValueChanged={(e) => {
                        // formik.setFieldValue('documentReference', e.value);
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} md={3}>
              <Grid container direction="column">
                <QRCode
                  value={JSON.stringify({
                    numberPlate: guestsData[guestIndex]?.numberPlate,
                    registrationCode,
                  })}
                  size={200}
                  level="M"
                  includeMargin
                />
              </Grid>
            </Grid>

            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Grid container direction="column">
                    <p className={classes.label}>ID thiết bị</p>
                    <Controller
                      control={control}
                      name="guestName"
                      defaultValue=""
                      render={(props) => (
                        <TextBox
                          maxLength="50"
                          width="100%"
                          name="numberPlate"
                          disabled
                          value=""
                          onValueChanged={(e) => {
                            // formik.setFieldValue('documentReference', e.value);
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Grid container direction="column">
                    <p className={classes.label}>Trạng thái thiết bị</p>
                    <Controller
                      control={control}
                      name="guestName"
                      defaultValue=""
                      render={(props) => (
                        <TextBox
                          maxLength="50"
                          width="100%"
                          name="numberPlate"
                          disabled
                          value=""
                          onValueChanged={(e) => {
                            // formik.setFieldValue('documentReference', e.value);
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Grid container direction="column">
                    <p className={classes.label}>Số điện thoại</p>
                    <Controller
                      control={control}
                      name="guestName"
                      defaultValue=""
                      render={(props) => (
                        <TextBox
                          maxLength="50"
                          width="100%"
                          name="numberPlate"
                          disabled
                          value=""
                          onValueChanged={(e) => {
                            // formik.setFieldValue('documentReference', e.value);
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Grid container direction="column">
                    <p className={classes.label}>Thời gian cấp thiết bị</p>
                    <Controller
                      control={control}
                      name="guestName"
                      defaultValue=""
                      render={(props) => (
                        <TextBox
                          maxLength="50"
                          width="100%"
                          name="numberPlate"
                          disabled
                          value=""
                          onValueChanged={(e) => {
                            // formik.setFieldValue('documentReference', e.value);
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Grid container direction="column">
                    <p className={classes.label}>Thời gian trả thiết bị</p>
                    <Controller
                      control={control}
                      name="guestName"
                      defaultValue=""
                      render={(props) => (
                        <TextBox
                          maxLength="50"
                          width="100%"
                          name="numberPlate"
                          disabled
                          value=""
                          onValueChanged={(e) => {
                            // formik.setFieldValue('documentReference', e.value);
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* <Grid item xs={12}>
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {accessDennyVehicleRoutes &&
                        accessDennyVehicleRoutes.map((row, index) => (
                          <TableRow className={classes.tableRow}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.pointName}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid> */}

            {/* <Grid item xs={12}>
              <Grid
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                <h3 style={{ margin: 0, fontSize: '20px', lineHeight: '23px' }}>
                  Lộ trình xe
                </h3>
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allowedVehicleRoutes &&
                        allowedVehicleRoutes.map((row, index) => (
                          <TableRow className={classes.tableRow}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.pointName}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid> */}

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
            Đóng
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
