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
} from '@material-ui/core';
import VAutocomplete from 'components/VAutocomplete';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { API_PARKING_LOT } from 'containers/apiUrl';
import { getErrorMessage } from 'containers/Common/function';
import { KeyboardDatePicker, KeyboardDateTimePicker, TimePicker } from '@material-ui/pickers';
import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import { getApi } from 'utils/requestUtils';
import messages from '../messages';
import { useStyles } from '../styled';
export default function DialogFilter({
  handleCloseFilter,
  onSuccess,
  initialValues,
}) {
  const [data, setData] = useState(initialValues);
  const [pkLotId, setPkLotId] = useState(data?.pkLot?.id);
  const [entrypId, setEntrypId] = useState(data?.entrypt?.id);
  const [deviceTypeId, setDeviceTypeId] = useState(data?.service?.id);
  const [directionId, setDirectionId] = useState(data?.direction?.id);
  const [fromTimeId, setFromTimeId] = useState(data?.fromTime?.id);
  const [laneId, setLaneId] = useState(data?.lane?.id);
  const handleFilterChange = (key, value) => {
    setData({ ...data, [key]: value });
  };
  const classes = useStyles();
  return (
    <form className={classes.modal}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl size="small" fullWidth margin="dense">
            <FormLabel>Bãi gửi xe</FormLabel>
            <VAutocomplete
              value={data.pkLot}
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
                  getApi(`${API_PARKING_LOT.PARKING_LOT}`, {
                    infoLevel: 'basic',
                  })
                    .then((result) => {
                      resolve({
                        data: [...result.data],
                        totalCount: result.data?.length || 0,
                      });
                    })
                    .catch((err) => reject(getErrorMessage(err)));
                })
              }
              onChange={(e, value) => {
                setPkLotId(value?.id);
                handleFilterChange('pkLot', value)
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Chọn bãi gửi xe"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl size="small" fullWidth margin="dense">
            <FormLabel>Lượt</FormLabel>
            <Autocomplete
              size="small"
              name="direction"
              value={data.direction}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Chọn lượt"
                />
              )}
              options={[{ id: 'in', name: 'Lượt vào' }, { id: 'out', name: 'Lượt ra' }]}
              getOptionLabel={(option) => option?.name || ''}
              getOptionSelected={(option, selected) =>
                option.id === selected.id
              }
              onChange={(e, newValue) => {
                setDirectionId(newValue?.id);
                handleFilterChange('direction', newValue);
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl size="small" fullWidth margin="dense">
            <FormLabel>Loại vé</FormLabel>
            <VAutocomplete
              value={data.service}
              fullWidth
              // disabled={!watchFields.block}
              // disableClearable
              noOptionsText="Không có dữ liệu"
              getOptionLabel={(option) => option?.name || ''}
              firstIndex={1}
              getOptionSelected={(option, selected) => option?.id == selected?.id}
              loadData={(page, keyword) =>
                new Promise((resolve, reject) => {
                  getApi(`${API_PARKING_LOT.PARKING_SERVICES}`, {
                    infoLevel: 'basic',
                    page,
                    keyword,
                  })
                    .then((result) => {
                      resolve({
                        data: [...result.data],
                        totalCount: result.data?.length || 0,
                      });
                    })
                    .catch((err) => reject(getErrorMessage(err)));
                })
              }
              onChange={(e, value) => {
                //props.onChange(value);
                //handleFilterChange('pklot', value)
                setDeviceTypeId(value?.id);
                handleFilterChange('service', value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Chọn loại vé"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl size="small" fullWidth margin="dense">
            <FormLabel>Thời gian bắt đầu</FormLabel>
            <KeyboardDateTimePicker
              id="manageGuest-dialogFilter"
              size="small"
              autoOk
              variant="inline"
              fullWidth
              placeholder="Thời gian bắt đầu"
              name="fromTime"
              value={data?.fromTime || null}
              onChange={(e) => {
                handleFilterChange('fromTime', e);
              }}
              inputVariant="outlined"
              format="hh:mm dd/MM/yyyy"
            />
            
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl size="small" fullWidth margin="dense">
            <FormLabel>Thời gian kết thúc</FormLabel>
            <KeyboardDateTimePicker
              id="manageGuest-dialogFilter"
              size="small"
              autoOk
              variant="inline"
              fullWidth
              placeholder="Thời gian kết thúc"
              name="fromTime"
              value={data?.toTime || null}
              onChange={(e) => {
                handleFilterChange('toTime', e);
                //setToTimeId(e);
              }}
              inputVariant="outlined"
              format="hh:mm dd/MM/yyyy"
            />
            
          </FormControl>
        </Grid>
      </Grid>
      <DialogActions>
        <Button onClick={handleCloseFilter} variant="contained">
          Hủy
        </Button>
        <Button
          onClick={() => onSuccess(data)}
          variant="contained"
          color="primary"
        >
          Lọc
        </Button>
      </DialogActions>
    </form>
  );
}

