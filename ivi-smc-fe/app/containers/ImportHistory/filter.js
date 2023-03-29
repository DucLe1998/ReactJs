import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormLabel,
} from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import btnMsg from '../Common/Messages/button';

export default function FilterPopover(props) {
  const { formatMessage } = useIntl();
  const { initialState, onSubmit } = props;
  const [filter, setFilter] = useState(initialState);
  const handleFilterChange = (key, value) => {
    setFilter({ ...filter, [key]: value });
  };
  return (
    <Fragment>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <FormLabel>{formatMessage({ id: 'app.column.fromDate' })}</FormLabel>
          <DatePicker
            size="small"
            variant="inline"
            inputVariant="outlined"
            fullWidth
            value={filter.startCreatedAt}
            onChange={newDate => handleFilterChange('startCreatedAt', newDate)}
            maxDate={filter.endCreatedAt || new Date('2100-01-01')}
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
            value={filter.endCreatedAt}
            onChange={newDate => handleFilterChange('endCreatedAt', newDate)}
            minDate={filter.startCreatedAt || new Date('1900-01-01')}
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
