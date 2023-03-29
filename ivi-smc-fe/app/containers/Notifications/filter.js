import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormLabel,
  Grid,
} from '@material-ui/core';
import DatePicker from 'components/DateRangePicker';
import MultiAutocomplete from 'components/MultiAutocomplete';
import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import Toolbar from 'react-multi-date-picker/plugins/toolbar';
import btnMsg from '../Common/Messages/button';
import { LIST_EVENT_TYPE, LIST_STATUS } from './constants';
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
    <>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth margin="dense">
              <FormLabel>Nhóm thông báo</FormLabel>
              <MultiAutocomplete
                id="combo-box-type"
                value={filter.eventTypes}
                options={LIST_EVENT_TYPE}
                getOptionLabel={(option) => option.name || ''}
                getOptionSelected={(option, value) => option.id == value.id}
                onChange={(e, newVal) =>
                  handleFilterChange('eventTypes', newVal)
                }
                placeholder="Nhóm thông báo"
                limitTags={1}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="dense">
              <FormLabel>
                {formatMessage({ id: 'app.column.status' })}
              </FormLabel>
              <MultiAutocomplete
                id="combo-box-status"
                value={filter.statuses}
                options={LIST_STATUS}
                getOptionLabel={(option) => option.text || ''}
                getOptionSelected={(option, selected) =>
                  option.id == selected.id
                }
                onChange={(e, newVal) => handleFilterChange('statuses', newVal)}
                placeholder="Trạng thái"
                limitTags={1}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="dense">
              <FormLabel>Ngày tạo</FormLabel>
              <DatePicker
                value={filter.createAt}
                zIndex={1301}
                onChange={(newDate) => handleFilterChange('createAt', newDate)}
                plugins={[
                  <Toolbar
                    position="bottom"
                    names={{
                      today: 'Hiện tại',
                      deselect: 'Bỏ chọn',
                      close: 'Đóng',
                    }}
                  />,
                ]}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="dense">
              <FormLabel>Ngày gửi</FormLabel>
              <DatePicker
                value={filter.notificationAt}
                zIndex={1301}
                onChange={(newDate) =>
                  handleFilterChange('notificationAt', newDate)
                }
                plugins={[
                  <Toolbar
                    position="bottom"
                    names={{
                      today: 'Hiện tại',
                      deselect: 'Bỏ chọn',
                      close: 'Đóng',
                    }}
                  />,
                ]}
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
    </>
  );
}
