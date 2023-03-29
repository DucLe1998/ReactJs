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
import VAutocomplete from 'components/VAutocomplete';
// import { subDays } from 'date-fns';
import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import { getApi } from 'utils/requestUtils';
import { EVENT_API } from '../apiUrl';
import AreaTreeList from '../Common/AreaTree/Loadable';
import btnMsg from '../Common/Messages/button';
import { DEVICE_TYPE, WARNING_STATUS } from './constants';
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
  // function maxDate() {
  //   return filter.toDate
  //     ? {
  //         maxDate: filter.toDate,
  //       }
  //     : {};
  // }
  // function minDate() {
  //   return filter.toDate
  //     ? {
  //         minDate: filter.fromDate,
  //       }
  //     : {};
  // }
  return (
    <Fragment>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <FormLabel>{formatMessage(messages.column_deviceType)}</FormLabel>
          <Autocomplete
            id="combo-box-type"
            size="small"
            value={filter.deviceType}
            options={DEVICE_TYPE}
            // getOptionLabel={option => option.name || ''}
            // getOptionSelected={(option, value) => option.name == value.name}
            renderInput={params => (
              <OutlinedInput
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                {...params.InputProps}
                fullWidth
                margin="dense"
              />
            )}
            onChange={(e, newVal) => handleFilterChange('deviceType', newVal)}
            noOptionsText={formatMessage({ id: 'app.no_data' })}
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <FormLabel>{formatMessage(messages.column_warningType)}</FormLabel>
          <VAutocomplete
            id="combo-box-warning-type"
            virtual={false}
            value={filter.type}
            loadData={() =>
              new Promise((resolve, reject) => {
                getApi(EVENT_API.TYPE)
                  .then(result => {
                    resolve({
                      data: result.data,
                      totalCount: result.data.length,
                    });
                  })
                  .catch(err => reject(err));
              })
            }
            // getOptionLabel={option => option.objectName || ''}
            getOptionSelected={(option, selected) =>
              option.code == selected.code
            }
            onChange={(e, newVal) => handleFilterChange('type', newVal)}
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <FormLabel>{formatMessage({ id: 'app.column.area' })}</FormLabel>
          <AreaTreeList
            value={filter.area}
            onValueChanged={newVal => {
              handleFilterChange('area', newVal);
            }}
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <FormLabel>{formatMessage({ id: 'app.column.status' })}</FormLabel>
          <Autocomplete
            id="combo-box-status"
            size="small"
            value={filter.status}
            options={WARNING_STATUS}
            getOptionLabel={option => formatMessage(option.text) || ''}
            getOptionSelected={(option, selected) => option.id == selected.id}
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
        <FormControl fullWidth margin="dense">
          <FormLabel>{formatMessage({ id: 'app.column.fromDate' })}</FormLabel>
          <DatePicker
            size="small"
            variant="inline"
            inputVariant="outlined"
            fullWidth
            value={filter.fromDate}
            onChange={newDate => handleFilterChange('fromDate', newDate)}
            maxDate={filter.toDate || new Date('2100-01-01')}
            disableFuture
            maxDateMessage={formatMessage({ id: 'app.invalid.maxDate' })}
            format="dd/MM/yy"
            autoOk
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
            minDate={filter.fromDate || new Date('1900-01-01')}
            disableFuture
            minDateMessage={formatMessage({ id: 'app.invalid.minDate' })}
            autoOk
            format="dd/MM/yy"
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
