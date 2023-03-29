import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormLabel,
  OutlinedInput,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import VAutocomplete from 'components/VAutocomplete';
import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import { getApi } from 'utils/requestUtils';
import { CAMERA_API } from '../apiUrl';
import AreaTreeList from '../Common/AreaTree/Loadable';
import btnMsg from '../Common/Messages/button';
import { LIST_STATUS } from './constants';

export default function FilterPopover(props) {
  const { initialState, onSubmit } = props;
  const { formatMessage } = useIntl();
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
          <FormLabel>NVR</FormLabel>
          <VAutocomplete
            id="combo-box-doorAccesses"
            name="doorAccesses"
            value={filter.parent}
            firstIndex={1}
            loadData={(page, keyword) =>
              new Promise((resolve, reject) => {
                getApi(CAMERA_API.GET_LIST, {
                  keyword,
                  pageSize: 50,
                  index: page,
                  type: 'NVR',
                })
                  .then(result => {
                    resolve({
                      data: result.data.data,
                      totalCount: result.data.totalRow,
                    });
                  })
                  .catch(err => reject(err));
              })
            }
            getOptionSelected={(option, selected) => option.id == selected.id}
            onChange={(e, newVal) => handleFilterChange('parent', newVal)}
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <FormLabel>{formatMessage({ id: 'app.column.status' })}</FormLabel>
          <Autocomplete
            id="combo-box-status"
            size="small"
            value={filter.statusOfDevice}
            options={LIST_STATUS}
            getOptionLabel={option => option.text || ''}
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
            onChange={(e, newVal) =>
              handleFilterChange('statusOfDevice', newVal)
            }
            noOptionsText={formatMessage({ id: 'app.no_data' })}
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
