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
import { API_PARKING_LOT } from 'containers/apiUrl';
import { getErrorMessage } from 'containers/Common/function';
import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import { getApi } from 'utils/requestUtils';
import { showError, showSuccess } from 'utils/toast-utils';
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
  const [deviceTypeId, setDeviceTypeId] = useState(data?.deviceType?.id);
  const [laneId, setLaneId] = useState(data?.lane?.id);
  const handleFilterChange = (key, value) => {
    setData({ ...data, [key]: value });
  };
  const handleAllFilterChange = (value) => {
    setData({ ...data, ...value });
  };
  const classes = useStyles();
  return (
    <form className={classes.modal}>
      <Grid container spacing={2}>
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
            getOptionSelected={(option, selected) => option.id == selected.id}
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
              // handleFilterChange('pkLot', value);
              if (value?.id) {
                handleAllFilterChange({
                  pkLot: value,
                  entrypt: null,
                  lane: null,
                });
              } else {
                handleAllFilterChange({
                  pkLot: null,
                  entrypt: null,
                  lane: null,
                });
              }
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
        <FormControl size="small" fullWidth margin="dense">
          <FormLabel>Entry points</FormLabel>
          <VAutocomplete
            value={data.entrypt}
            fullWidth
            // disabled={!watchFields.block}
            // disableClearable
            noOptionsText="Không có dữ liệu"
            getOptionLabel={(option) => option?.name || ''}
            firstIndex={1}
            getOptionSelected={(option, selected) => option.id == selected.id}
            loadData={(page, keyword) =>
              new Promise((resolve, reject) => {
                getApi(`${API_PARKING_LOT.PARKING_ENTRY_POINTS}`, {
                  infoLevel: 'basic',
                  pkLotId,
                  limit: 50,
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
              setEntrypId(value?.id);
              // handleFilterChange('entrypt', value);
              if (value?.id) {
                getApi(`${API_PARKING_LOT.PARKING_ENTRY_POINTS}/${value?.id}`)
                  .then((response) => {
                    handleAllFilterChange({
                      pkLot: {
                        id: response.data?.pkLotId,
                        name: response.data?.pkLotName,
                      },
                      entrypt: value,
                      lane: null,
                    });
                  })
                  .catch((err) => {
                    showError(err);
                  });
              } else {
                handleAllFilterChange({
                  entrypt: value,
                  lane: null,
                });
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Chọn entry point"
              />
            )}
          />
        </FormControl>
        <FormControl size="small" fullWidth margin="dense">
          <FormLabel>Làn xe</FormLabel>
          <VAutocomplete
            value={data.lane}
            fullWidth
            placeholder="Chọn làn xe"
            noOptionsText="Không có dữ liệu"
            getOptionLabel={(option) => option?.name || ''}
            firstIndex={1}
            getOptionSelected={(option, selected) => option.id == selected.id}
            loadData={(page, keyword) =>
              new Promise((resolve, reject) => {
                getApi(`${API_PARKING_LOT.PARKING_LANES}`, {
                  infoLevel: 'basic',
                  pkLotId,
                  entryptId: entrypId,
                  limit: 50,
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
              // handleFilterChange('lane', value);
              if (value?.id) {
                getApi(`${API_PARKING_LOT.PARKING_LANES}/${value?.id}`)
                  .then((response) => {
                    handleAllFilterChange({
                      pkLot: {
                        id: response.data?.pkLotId,
                        name: response.data?.pkLotName,
                      },
                      entrypt: {
                        id: response.data?.entryptId,
                        name: response.data?.entryptName,
                      },
                      lane: value,
                    });
                  })
                  .catch((err) => {
                    showError(err);
                  });
              } else {
                handleFilterChange('lane', value);
              }
            }}
          />
        </FormControl>
        <FormControl size="small" fullWidth margin="dense">
          <FormLabel>Loại thiết bị</FormLabel>
          <VAutocomplete
            value={data.deviceType}
            fullWidth
            // disabled={!watchFields.block}
            // disableClearable
            noOptionsText="Không có dữ liệu"
            getOptionLabel={(option) => option?.value || ''}
            firstIndex={1}
            getOptionSelected={(option, selected) => option?.id == selected?.id}
            loadData={(page, keyword) =>
              new Promise((resolve, reject) => {
                getApi(`${API_PARKING_LOT.GET_DATA_TYPE('devices')}`, {
                  limit: 50,
                  page,
                  keyword,
                })
                  .then((result) => {
                    resolve({
                      data: [...result.deviceType],
                      totalCount: result?.deviceType?.length || 0,
                    });
                  })
                  .catch((err) => reject(getErrorMessage(err)));
              })
            }
            onChange={(e, value) => {
              // props.onChange(value);
              // handleFilterChange('pklot', value)
              setDeviceTypeId(value?.id);
              handleFilterChange('deviceType', value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Chọn loại thiết bị"
              />
            )}
          />
        </FormControl>
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
