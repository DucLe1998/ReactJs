import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormLabel,
  Grid,
  InputAdornment,
  OutlinedInput,
} from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarTodayOutlined';
import { Autocomplete } from '@material-ui/lab';
import { DatePicker } from '@material-ui/pickers';
import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import btnMsg from '../Common/Messages/button';
import { STATUS_LIST, TYPE_LIST } from './constants';
export default function FilterPopover(props) {
  const { formatMessage } = useIntl();
  const { initialState, onSubmit } = props;
  const [filter, setFilter] = useState(initialState);
  const handleFilterChange = (key, value) => {
    setFilter({ ...filter, [key]: value });
  };
  // function onReset() {
  //   setFilter(DEFAULT_FILTER);
  // }
  return (
    <Fragment>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth margin="dense">
              <FormLabel>Phân loại</FormLabel>
              <Autocomplete
                id="combo-box-type"
                size="small"
                value={filter.types}
                options={TYPE_LIST}
                getOptionLabel={option => option.name || ''}
                getOptionSelected={(option, value) => option.id == value.id}
                renderInput={params => (
                  <OutlinedInput
                    ref={params.InputProps.ref}
                    inputProps={params.inputProps}
                    {...params.InputProps}
                    fullWidth
                    margin="dense"
                  />
                )}
                onChange={(e, newVal) => handleFilterChange('types', newVal)}
                noOptionsText={formatMessage({ id: 'app.no_data' })}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="dense">
              <FormLabel>
                {formatMessage({ id: 'app.column.status' })}
              </FormLabel>
              <Autocomplete
                id="combo-box-status"
                size="small"
                value={filter.status}
                options={STATUS_LIST}
                getOptionLabel={option => option.text || ''}
                getOptionSelected={(option, selected) =>
                  option.id == selected.id
                }
                renderInput={params => (
                  <OutlinedInput
                    ref={params.InputProps.ref}
                    inputProps={params.inputProps}
                    {...params.InputProps}
                    fullWidth
                    margin="dense"
                  />
                )}
                onChange={(e, newVal) => handleFilterChange('status', newVal)}
                noOptionsText={formatMessage({ id: 'app.no_data' })}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="dense">
              <FormLabel>
                {formatMessage({ id: 'app.column.fromDate' })}
              </FormLabel>
              <DatePicker
                size="small"
                variant="inline"
                inputVariant="outlined"
                fullWidth
                value={filter.startDate}
                onChange={newDate => handleFilterChange('startDate', newDate)}
                maxDate={filter.endDate || new Date('2100-01-01')}
                disableFuture
                maxDateMessage={formatMessage({ id: 'app.invalid.maxDate' })}
                format="dd/MM/yyyy"
                autoOk
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarTodayIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="dense">
              <FormLabel>
                {formatMessage({ id: 'app.column.toDate' })}
              </FormLabel>
              <DatePicker
                size="small"
                variant="inline"
                inputVariant="outlined"
                fullWidth
                value={filter.endDate}
                onChange={newDate => handleFilterChange('endDate', newDate)}
                minDate={filter.startDate || new Date('1900-01-01')}
                disableFuture
                minDateMessage={formatMessage({ id: 'app.invalid.minDate' })}
                autoOk
                format="dd/MM/yyyy"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarTodayIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {/* <Button color="secondary" variant="contained" onClick={() => onReset()}>
          {formatMessage(btnMsg.resetFilter)}
        </Button> */}
        <Button color="default" variant="contained" onClick={() => onSubmit(0)}>
          {formatMessage(btnMsg.cancel)}
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => onSubmit(filter)}
        >
          {formatMessage(btnMsg.apply)}
        </Button>
      </DialogActions>
    </Fragment>
  );
}
