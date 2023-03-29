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
  const handleFilterChange = (key, value) => {
    setData({ ...data, [key]: value });
  };
  const classes = useStyles();
  return (
    <form className={classes.modal}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl size="small" fullWidth margin="dense">
            <FormLabel>Loại cảnh báo</FormLabel>
            <VAutocomplete
              value={data?.alertType}
              fullWidth
              // disabled={!watchFields.block}
              // disableClearable
              noOptionsText="Không có dữ liệu"
              getOptionLabel={(option) => option?.code}
              firstIndex={1}
              getOptionSelected={(option, selected) => option.id == selected.id}
              loadData={(page, keyword) =>
                new Promise((resolve, reject) => {
                  getApi(`${API_PARKING_LOT.GET_TYPE_ALERT('alerts')}`, {
                    limit: 50,
                    page,
                    keyword,
                  })
                    .then((result) => {
                      resolve({
                        data: [...result.data],
                        totalCount: result?.count || 0,
                      });
                    })
                    .catch((err) => reject(getErrorMessage(err)));
                })
              }
              onChange={(e, value) => {
                handleFilterChange('alertType', value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Chọn loại cảnh báo"
                />
              )}
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
