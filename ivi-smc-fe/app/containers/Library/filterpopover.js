import {
  DialogContent,
  Button,
  DialogActions,
  FormControl,
  FormLabel,
  OutlinedInput,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { DatePicker } from '@material-ui/pickers';
import { subDays } from 'date-fns';
import React, { useState, Fragment } from 'react';
import { useIntl } from 'react-intl';
import btnMsg from '../Common/Messages/button';
import { FILE_TYPE } from './constants';
import messages from './messages';
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
        <FormControl fullWidth margin="dense">
          <FormLabel>{formatMessage(messages.column_format)}</FormLabel>
          <Autocomplete
            id="combo-box-type"
            size="small"
            value={filter.type}
            options={FILE_TYPE}
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
            onChange={(e, newVal) => handleFilterChange('type', newVal)}
            noOptionsText="Không có dự liệu"
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <FormLabel>{formatMessage({ id: 'app.column.fromDate' })}</FormLabel>
          <DatePicker
            size="small"
            variant="inline"
            inputVariant="outlined"
            fullWidth
            value={filter.fromDate}
            onChange={newDate => handleFilterChange('fromDate', newDate)}
            disableFuture
            maxDateMessage={formatMessage({ id: 'app.invalid.maxDate' })}
            format="dd/MM/yyyy"
            autoOk
            maxDate={filter.toDate || new Date('2100-01-01')}
            minDate={
              filter.toDate
                ? subDays(filter.toDate, 60)
                : new Date('1900-01-01')
            }
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <FormLabel>{formatMessage({ id: 'app.column.toDate' })}</FormLabel>
          <DatePicker
            size="small"
            variant="inline"
            inputVariant="outlined"
            fullWidth
            value={filter.toDate}
            onChange={newDate => handleFilterChange('toDate', newDate)}
            disableFuture
            minDateMessage={formatMessage({ id: 'app.invalid.minDate' })}
            format="dd/MM/yyyy"
            autoOk
            minDate={filter.fromDate || new Date('1900-01-01')}
          />
        </FormControl>
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
