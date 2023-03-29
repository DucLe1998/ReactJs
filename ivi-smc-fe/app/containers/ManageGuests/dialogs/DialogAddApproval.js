import React, { useMemo, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { getApiCustom } from 'utils/requestUtils';
import { useForm, Controller } from 'react-hook-form';

import {
  DialogContent,
  Grid,
  DialogActions,
  Dialog,
  TextField,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core';
import { IconButtonSquare } from 'components/CommonComponent';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import messages from '../messages';
import { GUEST_REGISTRATION, API_IAM } from '../../apiUrl';
import { dialogAddguestStyles } from '../styles';
export default function DialogAddApproval({
  open,
  handleClose,
  isFirstAdd,
  onSuccess,
  approveData,
}) {
  const classes = dialogAddguestStyles();
  const intl = useIntl();
  const [isDisabled, setDisabled] = useState(false);
  const [isWarning, setWarning] = useState(false);
  const [identityNumbers, setIdentityNumbers] = useState([]);
  const [accessDennyVehicleRoutes, setAccessDennyVehicleRoutes] = useState([]);
  const [allowedVehicleRoutes, setAllowedVehicleRoutes] = useState([]);
  const [valueInput, setValueInput] = useState('');
  const [approveDataSearch, setApproveDataSearch] = useState('');
  const [approvedata, setApproveData] = useState(approveData);
  const [reload, setReload] = useState(0);
  const {
    handleSubmit,
    control,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset({
      typeOfCarId: '',
      name: '',
      numberPlate: '',
      guestRepresentationId: '',
      accessDennyVehicleRoutes: [
        {
          pointCode: 'string',
          pointId: 'string',
          pointName: 'string',
        },
      ],
      allowedVehicleRoutes: [
        {
          pointCode: 'string',
          pointId: 'string',
          pointName: 'string',
        },
      ],
    });
    setDisabled(isFirstAdd);
  }, [isFirstAdd]);

  useEffect(() => {
    const items = approvedata.map((item) => item.identityNumber);
    setIdentityNumbers(items);
  }, [approveData]);

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
  const handleDelete = (row) => {
    const new_approvedata = [];
    approvedata.map((x) =>
      x.userId != row.userId ? new_approvedata.push(x) : '',
    );
    setApproveData(new_approvedata);
    // setReload(reload+1);
  };
  const handleAdd = (row) => {
    const new_approvedata = [...approvedata, row];
    setApproveData(new_approvedata);
    // setReload(reload+1);
  };
  const onSubmitForm = (values) => {
    setWarning(false);
    clearErrors();
    onSuccess(approvedata);
    console.log(approvedata);
  };

  const checkValue = (value) => {
    let ret = true;
    approvedata.map((row) => {
      if (value == row.userId) ret = false;
    });
    return ret;
  };

  useEffect(() => {
    getApiCustom(
      {
        url: `${API_IAM.LIST_USER}`,
        params: { keyword: valueInput },
      },
      (res) => {
        setApproveDataSearch(res?.rows);
      },
    );
  }, [valueInput]);
  const editUser = (data) => {
    console.log(data);
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
        <DialogTitle>Người phê duyệt</DialogTitle>
        <DialogContent style={{ overflowY: 'unset' }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Grid container direction="column">
                <p className={classes.label}>Tìm kiếm</p>
                <Controller
                  control={control}
                  name="typeOfCarId"
                  rules={{
                    required: true,
                  }}
                  render={(props) => (
                    <TextField
                      autoComplete="off"
                      autoFocus
                      error={!!errors.typeOfCarId}
                      value={valueInput}
                      inputProps={{
                        maxLength: 50,
                      }}
                      placeholder="Nhập tìm kiếm"
                      variant="outlined"
                      onChange={(e) => {
                        setValueInput(e.target.value || '');
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TableContainer style={{ maxHeight: 350 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow className={classes.tableRow}>
                      <TableCell>
                        {intl.formatMessage(messages.orderNumber)}
                      </TableCell>
                      <TableCell>Tên</TableCell>
                      <TableCell>Mã nhân viên</TableCell>
                      <TableCell>Chức vụ</TableCell>
                      <TableCell>Đơn vị</TableCell>
                      <TableCell>
                        {intl.formatMessage(messages.actions)}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {approveDataSearch &&
                      approveDataSearch.map((row, index) => (
                        <TableRow className={classes.tableRow}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.fullName}</TableCell>
                          <TableCell>{row.accessCode}</TableCell>
                          <TableCell> </TableCell>
                          <TableCell>{row.userGroup[0]?.groupName}</TableCell>
                          <TableCell>
                            {checkValue(row.userId) ? (
                              <Tooltip title="Thêm">
                                <IconButton
                                  onClick={() => handleAdd(row)}
                                  size="medium"
                                >
                                  <AddIcon fontSize="medium" />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip
                                title="Xóa"
                                style={{ marginLeft: '8px' }}
                              >
                                <IconButton
                                  onClick={() => handleDelete(row)}
                                  size="medium"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
            onClick={onSubmitForm}
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
    </Dialog>
  );
}
