import {
  Button,
  DialogActions,
  DialogContent,
  Grid,
  MenuItem,
  Select,
} from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import TextField from 'components/TextField';
import TreeSelect from 'components/TreeSelect';
import VAutocomplete from 'components/VAutocomplete';
import React, { useState } from 'react';
import { getApi } from 'utils/requestUtils';
import { API_EVENTS, SAP_API } from '../apiUrl';
import { STATUS_MAP } from './constants';

export default function FilterEvents({ initialState, onSubmit }) {
  const [filter, setFilter] = useState(initialState);
  const handleFilterChange = (key, value) => {
    setFilter({ ...filter, [key]: value });
  };
  return (
    <>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid sm={6} item>
            <TextField label="Loại sự kiện">
              <VAutocomplete
                placeholder="Loại sự kiện"
                value={filter.eventType}
                virtual={false}
                loadData={() =>
                  new Promise((resolve, reject) => {
                    getApi(API_EVENTS.LIST_EVENT_TYPE)
                      .then((res) => {
                        resolve({
                          data: res.data,
                          totalCount: res.data.length,
                        });
                      })
                      .catch((err) => reject(err));
                  })
                }
                getOptionSelected={(option, value) => option.code == value.code}
                onChange={(e, newVal) =>
                  handleFilterChange('eventType', newVal)
                }
              />
            </TextField>
          </Grid>
          <Grid sm={6} item>
            <TextField label="Trạng thái">
              <Select
                value={filter.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                variant="outlined"
                displayEmpty
              >
                <MenuItem value={undefined}>Tất cả</MenuItem>
                {Array.from(STATUS_MAP.keys()).map((d) => (
                  <MenuItem value={d} key={d}>
                    {STATUS_MAP.get(d).text}
                  </MenuItem>
                ))}
              </Select>
            </TextField>
          </Grid>
          <Grid sm={6} item>
            <TextField label="Thiết bị">
              <VAutocomplete
                placeholder="Thiết bị"
                value={filter.device}
                virtual={false}
                loadData={() =>
                  new Promise((resolve, reject) => {
                    getApi(API_EVENTS.LIST_EVENT_DEVICE)
                      .then((res) => {
                        resolve({
                          data: res.data,
                          totalCount: res.data.length,
                        });
                      })
                      .catch((err) => reject(err));
                  })
                }
                getOptionLabel={(option) => option?.deviceName || ''}
                getOptionSelected={(option, value) => option.id == value.id}
                onChange={(e, newVal) => handleFilterChange('device', newVal)}
              />
            </TextField>
          </Grid>
          <Grid item sm={6}>
            <TextField label="Khu vực">
              <TreeSelect
                placeholder="Khu vực"
                value={filter.area}
                onValueChanged={(newVal) => handleFilterChange('area', newVal)}
                keyExpr="id"
                displayExpr="areaName"
                searchEnabled
                hasItemsExpr={(node) => !node?.isLeaf}
                loadData={(node) =>
                  new Promise((resolve, reject) => {
                    let url = SAP_API.ROOT_AREA;
                    if (node?.key) {
                      url = SAP_API.CHILD_AREA(node.key);
                    }
                    getApi(url)
                      .then((ret) => {
                        resolve(ret.data);
                      })
                      .catch((err) => reject(err));
                  })
                }
              />
            </TextField>
          </Grid>
          <Grid item sm={6}>
            <TextField label="Thời gian bắt đầu">
              <DateTimePicker
                size="small"
                variant="inline"
                inputVariant="outlined"
                fullWidth
                autoOk
                value={filter.startTime || null}
                onChange={(newVal) => handleFilterChange('startTime', newVal)}
                format="dd/MM/yy HH:mm"
                maxDate={filter.endTime || new Date('2100-01-01')}
                disableFuture
              />
            </TextField>
          </Grid>
          <Grid item sm={6}>
            <TextField label="Thời gian kết thúc">
              <DateTimePicker
                size="small"
                variant="inline"
                inputVariant="outlined"
                fullWidth
                autoOk
                value={filter.endTime || null}
                onChange={(newVal) => handleFilterChange('endTime', newVal)}
                format="dd/MM/yy HH:mm"
                minDate={filter.startTime || new Date('1900-01-01')}
                disableFuture
              />
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => onSubmit(0)}>
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSubmit(filter)}
        >
          Lọc
        </Button>
      </DialogActions>
    </>
  );
}
