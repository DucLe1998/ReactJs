import {
  Button,
  DialogActions,
  DialogContent,
  Grid,
  MenuItem,
  Select,
} from '@material-ui/core';
import TextField from 'components/TextField';
import TreeSelect from 'components/TreeSelect';
import { API_IAM } from 'containers/apiUrl';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import DatePicker from 'components/DateRangePicker';
import Toolbar from 'react-multi-date-picker/plugins/toolbar';
import { getApi } from 'utils/requestUtils';
import btnMsg from '../Common/Messages/button';
import {
  // DEFAULT_FILTER,
  STATUS_MAP,
  TYPE_MAP,
  USER_TYPE_MAP,
} from './constants';
export default function Filter({ onSubmit, initialState }) {
  const { formatMessage } = useIntl();
  const [filter, setFilter] = useState(initialState);
  const handleFilterChange = (key, value) => {
    setFilter({ ...filter, [key]: value });
  };
  return (
    <>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item sm={12} md={6}>
            <TextField label="Loại thẻ">
              <Select
                displayEmpty
                value={filter.cardType}
                onChange={(e) => handleFilterChange('cardType', e.target.value)}
                variant="outlined"
              >
                <MenuItem value="">Tất cả</MenuItem>
                {TYPE_MAP.map((d) => (
                  <MenuItem value={d} key={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </TextField>
          </Grid>
          <Grid item sm={12} md={6}>
            <TextField label="Đối tượng">
              <Select
                displayEmpty
                value={filter.cardUserType}
                onChange={(e) =>
                  handleFilterChange('cardUserType', e.target.value)
                }
                variant="outlined"
              >
                <MenuItem value="">Tất cả</MenuItem>
                {Array.from(USER_TYPE_MAP.keys()).map((d) => (
                  <MenuItem value={d} key={d}>
                    {USER_TYPE_MAP.get(d)}
                  </MenuItem>
                ))}
              </Select>
            </TextField>
          </Grid>
          <Grid item sm={12} md={6}>
            <TextField label="Trạng thái">
              <Select
                displayEmpty
                value={filter.cardStatus}
                onChange={(e) =>
                  handleFilterChange('cardStatus', e.target.value)
                }
                variant="outlined"
              >
                <MenuItem value="">Tất cả</MenuItem>
                {Array.from(STATUS_MAP.keys()).map((d) => (
                  <MenuItem value={d} key={d}>
                    {STATUS_MAP.get(d)}
                  </MenuItem>
                ))}
              </Select>
            </TextField>
          </Grid>
          <Grid item sm={12} md={6}>
            <TextField label="Đơn vị">
              <TreeSelect
                placeholder="Đơn vị"
                value={filter.group}
                onValueChanged={(newVal) => handleFilterChange('group', newVal)}
                keyExpr="groupId"
                displayExpr="groupName"
                searchEnabled
                hasItemsExpr={(node) => !node?.isLeaf}
                loadData={(node) =>
                  new Promise((resolve, reject) => {
                    if (node?.id) {
                      resolve([]);
                    }
                    getApi(API_IAM.LIST_DEPARTMENT)
                      .then((ret) => {
                        resolve(ret.data);
                      })
                      .catch((err) => reject(err));
                  })
                }
              />
            </TextField>
          </Grid>
          <Grid item sm={12} md={6}>
            <TextField label="Thời gian nhập thẻ">
              <DatePicker
                zIndex={1301}
                placeholder="Ngày xuất bản"
                value={filter.createdAt}
                onChange={(val) => handleFilterChange('createdAt', val)}
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
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
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
