import { Controller, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { DialogActions, Grid, TextField } from '@material-ui/core';
import _ from 'lodash';
import { DateBox } from 'devextreme-react';
import ScrollView from 'devextreme-react/scroll-view';
import { rootStyles } from '../styles';
import VAutocomplete from '../../../components/VAutocomplete';
import BtnCancel from '../../../components/Button/BtnCancel';
import BtnSuccess from '../../../components/Button/BtnSuccess';
import { loadFloors } from '../modules';
export const Filter = ({ onClose, handleChangeFilter, initValues }) => {
  const classes = rootStyles();

  const { handleSubmit, control, reset, getValues, watch } = useForm({
    defaultValues: initValues,
  });
  useEffect(() => {
    reset({
      issueTypeCodes: initValues?.issueTypeCodes,
      deviceTypeCodes: initValues?.deviceTypeCodes,
      floorIds: initValues?.floorIds,
      levelCodes: initValues?.levelCodes,
      statusCodes: initValues?.statusCodes,
      startTime: initValues?.startTime,
      endTime: initValues?.endTime,
    });
  }, [initValues]);

  const onSubmit = values => {
    handleChangeFilter(values);
    onClose();
  };

  const resetFilter = () => {
    reset({
      issueTypeCodes: [],
      deviceTypeCodes: [],
      floorIds: [],
      levelCodes: [],
      statusCodes: [],
      startTime: null,
      endTime: null,
    });
  };

  const levelCodes = [
    { levelName: 'Nguy hiểm', levelCodes: 'DANGEROUS' },
    // { levelName: 'Cao', levelCodes: 'HIGH' },
    { levelName: 'Trung bình', levelCodes: 'MEDIUM' },
    // { levelName: 'Thấp', levelCodes: 'LOW' },
  ];

  const statusCodes = [
    { statusName: 'Đang xử lý', statusCode: 'PROCESSING' },
    { statusName: 'Đã xử lý', statusCode: 'FINISHED' },
    { statusName: 'Báo sai', statusCode: 'WRONG' },
    { statusName: 'Đọc', statusCode: 'READ' },
    { statusName: 'Chưa đọc', statusCode: 'UNREAD' },
  ];

  const issueTypeCodes = [
    { issueTypeName: 'Cần kiểm tra đầu báo', issueTypeCodes: 'FIRE_TROUBLE' },
    { issueTypeName: 'Cháy', issueTypeCodes: 'FIRE' },
  ];
  const deviceType = [
    { deviceTypeName: 'Nút báo cháy', deviceType: 'MANUAL_CALL_POINT' },
    { deviceTypeName: 'Đầu báo nhiệt', deviceType: 'ZONE_MODULE' },
    { deviceTypeName: 'Đầu báo khói', deviceType: 'SMOKE_DETECTOR' },
    { deviceTypeName: 'Thiết bị PCCC khác', deviceType: 'OTHER_MODULE ' },
  ];
  return (
    <form className={classes.root}>
      <ScrollView width="100%" maxHeight="calc(100vh - 180px)" height="100%">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <p className={classes.label}>Loại cảnh báo</p>
            <Controller
              control={control}
              name="issueTypeCodes"
              defaultValue={[]}
              render={props => (
                <VAutocomplete
                  value={props.value || []}
                  virtual={false}
                  size="small"
                  multiple
                  limitTags={3}
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={option => option?.issueTypeName || []}
                  firstIndex={1}
                  loadData={() =>
                    new Promise((resolve, reject) => {
                      const data = [...issueTypeCodes];
                      resolve({
                        data,
                        totalCount: data.length,
                      }).catch(err => reject(err));
                    })
                  }
                  getOptionSelected={(option, selected) =>
                    option.issueTypeCodes === selected.issueTypeCodes
                  }
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Chọn loại cảnh báo"
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <p className={classes.label}>Loại thiết bị</p>
            <Controller
              control={control}
              name="deviceTypeCodes"
              defaultValue={[]}
              render={props => (
                <VAutocomplete
                  value={props.value || []}
                  size="small"
                  fullWidth
                  virtual={false}
                  multiple
                  limitTags={3}
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={option => option?.deviceTypeName || ''}
                  firstIndex={1}
                  loadData={() =>
                    new Promise((resolve, reject) => {
                      const data = [...deviceType];
                      resolve({
                        data,
                        totalCount: data.length,
                      }).catch(err => reject(err));
                    })
                  }
                  getOptionSelected={(option, selected) =>
                    option.deviceType === selected.deviceType
                  }
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Chọn loại thiết bị"
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <p className={classes.label}>Tầng</p>
            <Controller
              control={control}
              name="floorIds"
              defaultValue={[]}
              render={props => (
                <VAutocomplete
                  value={props.value || []}
                  size="small"
                  multiple
                  limitTags={3}
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={option => option?.floorName || ''}
                  firstIndex={1}
                  loadData={(page, keyword) => loadFloors(page, keyword)}
                  getOptionSelected={(option, selected) =>
                    option.floorId === selected.floorId
                  }
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Chọn tầng"
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <p className={classes.label}>Mức độ</p>
            <Controller
              control={control}
              name="levelCodes"
              // defaultValue=""
              defaultValue={[]}
              render={props => (
                <VAutocomplete
                  value={props.value || []}
                  size="small"
                  virtual={false}
                  multiple
                  limitTags={3}
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={option => option?.levelName || ''}
                  firstIndex={1}
                  loadData={() =>
                    new Promise((resolve, reject) => {
                      const data = [...levelCodes];
                      resolve({
                        data,
                        totalCount: data.length,
                      }).catch(err => reject(err));
                    })
                  }
                  getOptionSelected={(option, selected) =>
                    option.levelCodes === selected.levelCodes
                  }
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Chọn mức độ"
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <p className={classes.label}>Trạng thái</p>
            <Controller
              control={control}
              name="statusCodes"
              defaultValue={[]}
              render={props => (
                <VAutocomplete
                  value={props.value || []}
                  size="small"
                  virtual={false}
                  multiple
                  limitTags={3}
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={option => option?.statusName || ''}
                  firstIndex={1}
                  loadData={() =>
                    new Promise((resolve, reject) => {
                      const data = [...statusCodes];
                      resolve({
                        data,
                        totalCount: data.length,
                      }).catch(err => reject(err));
                    })
                  }
                  getOptionSelected={(option, selected) =>
                    option.statusCode === selected.statusCode
                  }
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Chọn trạng thái"
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <p className={classes.label}>Từ ngày</p>
            <Controller
              control={control}
              name="startTime"
              render={props => (
                <DateBox // TODO -> are there dates disabled ?
                  type="date"
                  value={props.value}
                  onValueChanged={e => props.onChange(e.value)}
                  placeholder="Chọn ngày"
                  openOnFieldClick
                  acceptCustomValue={false}
                  displayFormat="dd/MM/yyyy"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <p className={classes.label}>Đến ngày</p>
            <Controller // TODO -> are there dates disabled ?
              control={control}
              name="endTime"
              defaultValue=""
              render={props => (
                <DateBox
                  type="date"
                  value={props.value}
                  onValueChanged={e => props.onChange(e.value)}
                  placeholder="Chọn ngày"
                  openOnFieldClick
                  acceptCustomValue={false}
                  displayFormat="dd/MM/yyyy"
                />
              )}
            />
          </Grid>
        </Grid>
        <DialogActions>
          <div style={{ width: '50%' }}>
            <BtnSuccess onClick={resetFilter}>Bỏ điều kiện</BtnSuccess>
          </div>
          <div
            style={{
              width: '50%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <BtnCancel onClick={onClose}>Hủy</BtnCancel>
            <BtnSuccess onClick={handleSubmit(onSubmit)}>Lọc</BtnSuccess>
          </div>
        </DialogActions>
      </ScrollView>
    </form>
  );
};

export default Filter;
