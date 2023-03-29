/* eslint-disable import/no-unresolved */
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  FormControl,
  FormLabel,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { KeyboardDatePicker, TimePicker } from '@material-ui/pickers';
import MultiAutocomplete from 'components/MultiAutocomplete';
import VAutocomplete from 'components/VAutocomplete';
import { IAM_API_SRC } from 'containers/apiUrl';
import { getErrorMessage } from 'containers/Common/function';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { getApi } from 'utils/requestUtils';
import messages from '../messages';
import { STATUS_MAP, REPEAT_TYPE_MAP } from '../modules';
export default function DialogFilter({
  handleCloseFilter,
  onSuccess,
  initialValues,
}) {
  const [data, setData] = useState(initialValues);
  const handleFilterChange = (key, value) => {
    setData({ ...data, [key]: value });
  };
  const intl = useIntl();

  return (
    <>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>{intl.formatMessage(messages.createdBy)}</FormLabel>
              <VAutocomplete
                value={data.createdBy}
                onChange={(e, newValue) =>
                  handleFilterChange('createdBy', newValue)
                }
                fullWidth
                multiple
                getOptionLabel={(option) => option.fullName || ''}
                itemSize={72}
                limitTags={2}
                renderOption={(option, { selected }) => (
                  <ListItem>
                    <ListItemIcon>
                      <Checkbox
                        checked={selected}
                        edge="start"
                        tabIndex={-1}
                        disableRipple
                        color="primary"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={option.fullName || ''}
                      secondary={option.email}
                    />
                  </ListItem>
                )}
                loadData={(page, keyword) =>
                  new Promise((resolve, reject) => {
                    getApi(`${IAM_API_SRC}/users/search`, {
                      limit: 50,
                      page,
                      keyword,
                    })
                      .then((result) => {
                        resolve({
                          data: result.data?.rows,
                          totalCount: result.data?.count,
                        });
                      })
                      .catch((err) => reject(getErrorMessage(err)));
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Nhập tên, email, mã nhân viên, số điện thoại"
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>Loại yêu cầu</FormLabel>
              <Autocomplete
                size="small"
                name="repeatType"
                value={data.repeatType}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Loại yêu cầu"
                  />
                )}
                options={Object.values(REPEAT_TYPE_MAP)}
                getOptionLabel={(option) => option?.value || ''}
                getOptionSelected={(option, selected) =>
                  option.key === selected.key
                }
                onChange={(e, newValue) => {
                  handleFilterChange('repeatType', newValue);
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>Ngày tạo</FormLabel>
              <KeyboardDatePicker
                id="manageGuest-dialogFilter2"
                size="small"
                autoOk
                variant="inline"
                fullWidth
                placeholder="Ngày tạo"
                name="createdAt"
                value={data?.createdAt || null}
                onChange={(e) => {
                  handleFilterChange('createdAt', e);
                }}
                inputVariant="outlined"
                format="dd/MM/yyyy"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>
                {intl.formatMessage(messages.repeatTypeStatus)}
              </FormLabel>
              <MultiAutocomplete
                name="status"
                value={data.status}
                placeholder="Trạng thái"
                options={Object.values(STATUS_MAP)}
                getOptionLabel={(option) => option?.text || ''}
                getOptionSelected={(option, selected) =>
                  option.key === selected.key
                }
                onChange={(e, newValue) => {
                  handleFilterChange('status', newValue);
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>{intl.formatMessage(messages.startTime)}</FormLabel>
              <TimePicker
                size="small"
                format="HH:mm"
                aria-describedby="start-time-helper-text"
                placeholder="Thời gian bắt đầu"
                value={data.startTime || null}
                minutesStep={15}
                variant="inline"
                onChange={(e) => handleFilterChange('startTime', e)}
                style={{ width: '100%' }}
                inputVariant="outlined"
                invalidDateMessage="Định dạng không đúng"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>{intl.formatMessage(messages.endTime)}</FormLabel>
              <TimePicker
                size="small"
                format="HH:mm"
                aria-describedby="start-time-helper-text"
                placeholder="Thời gian kết thúc"
                value={data.endTime || null}
                minutesStep={15}
                variant="inline"
                onChange={(e) => handleFilterChange('endTime', e)}
                style={{ width: '100%' }}
                inputVariant="outlined"
                invalidDateMessage="Định dạng không đúng"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>
                {intl.formatMessage(messages.appointmentDate)}
              </FormLabel>
              <KeyboardDatePicker
                id="manageGuest-dialogFilter"
                size="small"
                autoOk
                variant="inline"
                fullWidth
                placeholder="Ngày hẹn khách"
                name="startDate"
                value={data?.startDate || null}
                onChange={(e) => {
                  handleFilterChange('startDate', e);
                }}
                inputVariant="outlined"
                format="dd/MM/yyyy"
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseFilter} variant="contained">
          Hủy
        </Button>
        <Button
          onClick={() => onSuccess(data)}
          variant="contained"
          color="primary"
        >
          {intl.formatMessage(messages.filter)}
        </Button>
      </DialogActions>
    </>
  );
}
