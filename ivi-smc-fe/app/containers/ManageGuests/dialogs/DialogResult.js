/* eslint-disable import/no-unresolved */
import {
  DialogActions,
  DialogContent,
  TextField,
  Button,
  FormControl,
  FormLabel,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import MultiAutocomplete from 'components/MultiAutocomplete';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { KeyboardDatePicker, TimePicker } from '@material-ui/pickers';
import VAutocomplete from 'components/VAutocomplete';
import { API_IAM, IAM_API_SRC } from 'containers/apiUrl';
import Authentication from 'containers/Authentication';
import { getErrorMessage } from 'containers/Common/function';
import React, { Fragment, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { getApi } from 'utils/requestUtils';
import Done from '@material-ui/icons/Done';
import Close from '@material-ui/icons/Close';
import messages from '../messages';
import { generateId } from '../modules';
import { detailStyles } from '../styles';
export default function DialogResult({
  handleCloseFilter,
  onSuccess,
  initialValues,
  reasonReject,
}) {
  const [data, setData] = useState(initialValues);
  const [dataSuccess, setDataSuccess] = useState([]);
  const [dataFail, setdataFail] = useState([]);
  const [reason, setReason] = useState(reasonReject);
  const classes = detailStyles();
  const intl = useIntl();
  const index = 1;
  useEffect(() => {
    if (data?.failRegistrationCodes) {
      setdataFail([...data.failRegistrationCodes]);
    }
    if (data?.successRegistrationCodes) {
      setDataSuccess([...data.successRegistrationCodes]);
    }
    if (data?.reasonReject) {
      setReason(data?.reasonReject)
    }
  }, [data]);
  return (
    <>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableContainer>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell>STT</TableCell>
                    <TableCell>Mã đơn</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    {reason && <TableCell>Lý do</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataSuccess.map((row, i) => (
                    <TableRow key={generateId()} className={classes.tableRow}>
                      <TableCell>{index + i}</TableCell>
                      <TableCell>{row}</TableCell>
                      <TableCell>
                        <Tooltip
                          title="Thành công"
                          style={{ marginLeft: '8px' }}
                        >
                          <IconButton size="medium">
                            <Done color="success" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      {reason && <TableCell>{reason}</TableCell>}
                    </TableRow>
                  ))}
                  {dataFail.map((row, j) => (
                    <TableRow key={generateId()}>
                      <TableCell>{index + dataSuccess.length + j}</TableCell>
                      <TableCell>{row}</TableCell>
                      <TableCell>
                        <Tooltip
                          title="Thất bại"
                          style={{ marginLeft: '8px' }}
                        >
                          <IconButton size="medium">
                            <Close />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <p>
              Thành công:
              {dataSuccess.length} / {dataSuccess.length + dataFail.length}
            </p>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseFilter} variant="contained" color="primary">
          Đóng
        </Button>
      </DialogActions>
    </>
  );
}
