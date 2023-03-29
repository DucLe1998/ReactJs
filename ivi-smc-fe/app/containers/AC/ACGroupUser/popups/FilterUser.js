/* eslint-disable no-unsafe-optional-chaining */
import React, { useState } from 'react';
import { DialogActions, Grid, TextField } from '@material-ui/core';
import _ from 'lodash';
import VAutocomplete from 'components/VAutocomplete';
import { getApi } from 'utils/requestUtils';
import { ACCESSGROUP_API } from 'containers/apiUrl';
import BtnCancel from 'components/Button/BtnCancel';
import BtnSuccess from 'components/Button/BtnSuccess';
import { getErrorMessage } from 'containers/Common/function';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { DATE_ACTIVE, STATUS_FILTER } from '../constants';

const USER_TYPE = [
  { value: null, label: 'Tất cả' },
  { value: 'EMPLOYEE', label: 'Nhân viên' },
  { value: 'RESIDENT', label: 'Chủ nhà' },
  { value: 'GUEST', label: 'Khách' },
];

const IDENTIFY_TYPE = [
  // { value: 'ALL', label: 'Tất cả' },
  { value: 'FACE', label: 'Khuôn mặt' },
  { value: 'FINGER_PRINT', label: 'Vân tay' },
  { value: 'CARD', label: 'Thẻ' },
];

export const FilterUser = ({ onClose, callback, valueFilter }) => {
  const classes = useStyles();

  const foundUserType =
    valueFilter?.userType &&
    USER_TYPE.find((e) => e.value == valueFilter.userType);

  const foundIdentifyOption =
    valueFilter?.identifyOption && JSON.parse(valueFilter?.identifyOption);

  const foundAccessGroupIds =
    valueFilter?.accessGroupIds && JSON.parse(valueFilter?.accessGroupIds);

  const foundStatus =
    valueFilter?.status &&
    STATUS_FILTER.find((e) => e.value == valueFilter.status);

  const foundDateActive =
    valueFilter?.validTimeType &&
    DATE_ACTIVE.find((e) => e.value == valueFilter.validTimeType);

  const [dataFilter, setDataFilter] = useState({
    userType: foundUserType || USER_TYPE[0],
    accessGroupIds: foundAccessGroupIds || [],
    identifyOption: foundIdentifyOption || [],
    status: foundStatus || STATUS_FILTER[0],
    validTimeType: foundDateActive || DATE_ACTIVE[0],
  });

  const onSubmit = () => {
    const dto = {
      ...dataFilter,
      identifyOption: dataFilter.identifyOption,
    };
    callback(dto);
    onClose();
  };

  return (
    <div>
      <Grid container spacing={2}>
        {/* <Grid item xs={12} sm={6}>
          <p className={classes.label}>Phân loại</p>
          <Autocomplete
            id="combo-box-setting"
            value={dataFilter.userType}
            options={USER_TYPE}
            disableClearable
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option, selected) =>
              option.value === selected.value
            }
            onChange={(e, value) => {
              setDataFilter((e) => ({ ...e, userType: value }));
            }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" size="small" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} /> */}
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Nhóm quyền truy cập</p>
          <VAutocomplete
            value={dataFilter?.accessGroupIds}
            disableClearable
            multiple
            noOptionsText="Không có dữ liệu"
            getOptionLabel={(option) => option?.name || ''}
            firstIndex={1}
            loadData={(page, keyword) =>
              new Promise((resolve, reject) => {
                const params = {
                  page,
                  keyword,
                  limit: 50,
                };
                getApi(ACCESSGROUP_API.GET_LIST, _.pickBy(params))
                  .then((result) => {
                    const data = [...result.data.rows];
                    // if (page === 1 && data?.length) {
                    //   data.unshift({ id: null, name: 'Tất cả' });
                    // }
                    resolve({
                      data,
                      totalCount: result?.count + 1 || 0,
                    });
                  })
                  .catch((err) => reject(getErrorMessage(err)));
              })
            }
            getOptionSelected={(option, selected) => option.id === selected.id}
            onChange={(e, value) => {
              setDataFilter((e) => ({ ...e, accessGroupIds: value }));
            }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Trạng thái định danh</p>
          <Autocomplete
            id="combo-box-setting"
            value={dataFilter.identifyOption}
            options={IDENTIFY_TYPE}
            disableClearable
            multiple
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option, selected) =>
              option.value === selected.value
            }
            onChange={(e, value) => {
              setDataFilter((e) => ({ ...e, identifyOption: value }));
            }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" size="small" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Trạng thái</p>
          <Autocomplete
            id="combo-box-setting"
            value={dataFilter.status}
            options={STATUS_FILTER}
            disableClearable
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option, selected) =>
              option.value === selected.value
            }
            onChange={(e, value) => {
              setDataFilter((e) => ({ ...e, status: value }));
            }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" size="small" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Thời gian hiệu lực</p>
          <Autocomplete
            id="combo-box-setting"
            value={dataFilter.validTimeType}
            options={DATE_ACTIVE}
            disableClearable
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option, selected) =>
              option.value === selected.value
            }
            onChange={(e, value) => {
              setDataFilter((e) => ({ ...e, validTimeType: value }));
            }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" size="small" />
            )}
          />
        </Grid>
      </Grid>
      <DialogActions style={{ marginTop: 36 }}>
        <BtnCancel onClick={onClose}>Hủy</BtnCancel>
        <BtnSuccess onClick={onSubmit}>Lọc</BtnSuccess>
      </DialogActions>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    padding: '0px 10px',
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& .MuiInputBase-input': {
      boxSizing: 'border-box',
      height: '100%',
    },
    '& .MuiPaper-rounded': {
      borderRadius: '8px',
    },
    '& .MuiDialogActions-root': {
      padding: '32px',
    },
  },
  label: {
    fontWeight: '500',
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#999999',
    margin: '5px 0',
  },
  button: {
    padding: '12px 16px',
    border: 'none',
    outline: 'none',
    lineHeight: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    minWidth: '104px',
    boxSizing: 'border-box',
  },
  iconBtnHeader: {
    backgroundColor: 'rgba(116, 116, 128, 0.08)',
    height: 36,
    width: 36,
    borderRadius: 6,
  },
  popup: {
    zIndex: '1299 !important',
    '& .dx-popup-content': {
      padding: '0px 36px',
    },
    '& .title': {
      padding: '0px',
    },
  },
  uploadImageContainer: {
    width: '100%',
    borderRadius: '12px',
    height: '186px',
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default FilterUser;
