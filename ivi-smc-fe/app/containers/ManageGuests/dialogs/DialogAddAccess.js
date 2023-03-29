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
import { GUEST_REGISTRATION, NAVIGATION_API } from '../../apiUrl';
import { dialogAddguestStyles } from '../styles';
export default function DialogAddApproval({
  open,
  handleClose,
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
  const [approvedata, setApproveData] = useState();
  const [reload, setReload] = useState(0);
  const {
    handleSubmit,
    control,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if(approveData){
      let newData = approveData.map((x)=>{
        x.id = x.pointId;
        x.name = x.pointName;
        return x;
      })
      setApproveData(newData);
    }
  }, [approveData]);
  const timeout = useMemo(() => undefined, []);
  const handleDelete = (row) => {
    const new_approvedata = [];
    approvedata.map((x) => (x.pointId != row.pointId ? new_approvedata.push(x) : ''));
    setApproveData(new_approvedata);
    // setReload(reload+1);
  };
  const handleAdd = (row) => {
    setApproveData([...approvedata, row]);
    // setReload(reload+1);
  };
  const onSubmitForm = (values) => {
    setWarning(false);
    clearErrors();
    if (approvedata) {
      const new_data = approvedata.map((x) => ({
        pointId: x.id,
        id: x.id,
        name: x.name,
        pointName: x.name,
        pointCode: x.pointCode,
      }));
      onSuccess(new_data);
    }
  };

  const checkValue = (value) => {
    let ret = true;
    if(approvedata){
      approvedata.map((row) => {
        if (value == row.pointId) ret = false;
      });
    }
    
    return ret;
  };

  useEffect(() => {
    getApiCustom(
      {
        url: `${NAVIGATION_API.POINTS}`,
      },
      (res) => {
        const newRes = res.map((x) => {
          x.pointId = x.id;
          return x;
        });
        setApproveDataSearch(newRes);
      },
    );
  }, []);
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
        <DialogTitle>Thêm điểm</DialogTitle>
        <DialogContent style={{ overflowY: 'unset' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TableContainer style={{ maxHeight: 350 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow className={classes.tableRow}>
                      <TableCell>
                        {intl.formatMessage(messages.orderNumber)}
                      </TableCell>
                      <TableCell>Điểm</TableCell>
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
                          <TableCell>{row.name}</TableCell>
                          <TableCell>
                            {checkValue(row.id) ? (
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
            Thêm
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
