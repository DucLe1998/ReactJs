import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState, useMemo } from 'react';
import {
  DialogActions,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
  Button,
  FormControl,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import * as yup from 'yup';
import Checkbox from '@material-ui/core/Checkbox';
import VAutocomplete from 'components/VAutocomplete';
import { NumberBox } from 'devextreme-react/number-box';
import { getApi, postApi, putApi } from 'utils/requestUtils';
import { validationSchema } from 'utils/utils';
import { showError, showSuccess } from 'utils/toast-utils';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { eachDayOfInterval } from 'date-fns';
import Loading from '../../Loading';
import { getErrorMessage } from '../../Common/function';
import { API_PARKING_LOT } from '../../apiUrl';
import { useStyles } from '../styled';

const today = new Date();
const initValues = {
  name: null,
  dscr: null,
  availableAt: new Date(),
  expiredAt: new Date(today.setFullYear(10 + today.getFullYear())),
  wlpkLs: [],
  money: 1000000,
  wlservices: [],
  wlvehComs: [],
  state: { id: 'active', value: 'Hoạt động' },
  lpn: null,
};

export const AddVoucher = ({ onClose, id, setReload }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const fetchDataSource = () => {
    setLoading(true);
    getApi(`${API_PARKING_LOT.PARKING_VOUCHER}/${id}`)
      .then((response) => {
        const setData = response.data;
        setData.availableAt = new Date(response.data?.availableAt);
        setData.expiredAt = new Date(response.data?.expiredAt);
        reset(setData);
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const schema = validationSchema({
    name: yup.string().nullable().required('Trường này bắt buộc nhập'),
    // versionType: yup.object().nullable().required('Trường này bắt buộc nhập'),
    availableAt: yup.date().required('Trường này bắt buộc nhập').nullable(),
    expiredAt: yup
      .date()
      .required('Trường này bắt buộc nhập')
      .nullable()
      .test(
        'greater time',
        'Ngày kết thúc phải lớn hơn ngày bắt đầu',
        function valid(value) {
          const { availableAt } = this.parent;
          return value.getTime() > availableAt.getTime();
        },
      ),
  });
  const {
    handleSubmit,
    control,
    getValues,
    watch,
    setError,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: initValues,
    resolver: schema,
  });

  useEffect(() => {
    if (id) {
      fetchDataSource();
    }
  }, [id]);
  // const setDetailFormValue = () => {
  //   if (detail?.name) {
  //     reset(detail);
  //   } else {
  //     //reset(initValues);
  //   }
  // };

  // useEffect(() => {
  //   if (detail?.name) {
  //     setDetailFormValue();
  //   }
  // }, [detail]);
  const onSubmit = (values) => {
    setLoading(true);
    const params = {
      name: values?.name,
      availableAt: new Date(values?.availableAt).getTime(),
      expiredAt: new Date(values?.expiredAt).getTime(),
      wlpkLs: values?.wlpkLs,
      wlservices: values?.wlservices,
      wlvehComs: values?.wlvehComs,
      state: values?.state,
      money: values?.money,
      lpn: values?.lpn,
    };
    if (id) handleUpdate(params);
    else handleAdd(params);
  };
  const handleAdd = (params) => {
    setLoading(true);
    postApi(API_PARKING_LOT.PARKING_VOUCHER, params)
      .then(() => {
        showSuccess('Thêm mới thành công', {
          text: 'Dữ liệu đã được cập nhật',
        });
        setReload();
        onClose();
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleUpdate = (params) => {
    setLoading(true);
    putApi(`${API_PARKING_LOT.PARKING_VOUCHER}/${id}`, params)
      .then(() => {
        showSuccess('Cập nhật thành công', {
          text: 'Dữ liệu đã được cập nhật',
        });
        setReload();
        onClose();
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  let timeout = useMemo(() => undefined, []);
  const debounceSearchName = (value) => {
    // eslint-disable-next-line no-unused-expressions
    // clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (!value) return;
      postApi(`${API_PARKING_LOT.PARKING_ENTRY_POINTS}/checkname`, {
        name: value,
      })
        .then((res) => {
          if (res?.existed) {
            setError('name', { message: 'Dữ liệu đã tồn tại trong hệ thống.' });
          }
        })
        .catch((err) => {
          showError(err);
        });
    }, 500);
  };

  return (
    <form className={classes.modal}>
      {loading && <Loading />}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth error={errors.name}>
            <FormLabel required>Tên đợt phát hành</FormLabel>
            <Controller
              control={control}
              name="name"
              render={(props) => (
                <TextField
                  autoComplete="off"
                  disabled={id}
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  placeholder="Nhập tên đợt phát hành"
                  value={props.value}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                  }}
                  variant="outlined"
                  size="small"
                  error={errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <FormLabel>Số lượng voucher</FormLabel>
            <Controller
              control={control}
              name="count"
              render={(props) => (
                <TextField
                  autoComplete="off"
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  placeholder="Nhập số lượng voucher"
                  value={props.value}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                  }}
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl error={errors.availableAt} fullWidth>
            <FormLabel required>Ngày bắt đầu</FormLabel>
            <Controller
              control={control}
              name="availableAt"
              render={(props) => (
                <KeyboardDatePicker
                  id="manageGuest-dialogFilter"
                  size="small"
                  autoOk
                  variant="inline"
                  fullWidth
                  placeholder="Ngày bắt đầu"
                  value={props.value || null}
                  onChange={(e) => {
                    setValue('availableAt', e);
                    props.onChange(e);
                    const { expiredAt } = getValues();
                    if (expiredAt) {
                      const defaultDay = [];
                      const defaultDate = [];
                      const eachDayOfRange = eachDayOfInterval({
                        start: e,
                        end: expiredAt,
                      });
                      for (const dayOfWeek of eachDayOfRange) {
                        const checkDay = DAYS_OF_WEEK[dayOfWeek.getDay()];
                        defaultDay.includes(checkDay)
                          ? ''
                          : defaultDay.push(DAYS_OF_WEEK[dayOfWeek.getDay()]);
                        const checkDate = dayOfWeek.getDate();
                        defaultDate.includes(checkDate)
                          ? ''
                          : defaultDate.push(dayOfWeek.getDate());
                      }
                      setDayOfWeeks(defaultDay);
                      setDayOfMonth(defaultDate);
                    }
                  }}
                  inputVariant="outlined"
                  format="dd/MM/yyyy"
                  error={errors.availableAt}
                  helperText={errors.availableAt?.message}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl error={errors.expiredAt} fullWidth>
            <FormLabel required>Ngày kết thúc</FormLabel>
            <Controller
              control={control}
              name="expiredAt"
              render={(props) => (
                <KeyboardDatePicker
                  id="manageGuest-dialogFilter2"
                  size="small"
                  autoOk
                  variant="inline"
                  fullWidth
                  placeholder="Ngày kết thúc"
                  value={props.value || null}
                  onChange={(e) => {
                    setValue('expiredAt', e);
                    props.onChange(e);
                    const { availableAt } = getValues();
                    if (availableAt) {
                      const defaultDay = [];
                      const defaultDate = [];
                      const eachDayOfRange = eachDayOfInterval({
                        start: availableAt,
                        end: e,
                      });
                      for (const dayOfWeek of eachDayOfRange) {
                        const checkDay = DAYS_OF_WEEK[dayOfWeek.getDay()];
                        defaultDay.includes(checkDay)
                          ? ''
                          : defaultDay.push(DAYS_OF_WEEK[dayOfWeek.getDay()]);
                        const checkDate = dayOfWeek.getDate();
                        defaultDate.includes(checkDate)
                          ? ''
                          : defaultDate.push(dayOfWeek.getDate());
                      }
                      setDayOfWeeks(defaultDay);
                      setDayOfMonth(defaultDate);
                    }
                  }}
                  inputVariant="outlined"
                  format="dd/MM/yyyy"
                  error={errors.expiredAt}
                  helperText={errors.expiredAt?.message}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl error={errors.versionType} fullWidth>
            <FormLabel>Phạm vi</FormLabel>
            <Controller
              control={control}
              name="wlpkLs"
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                  fullWidth
                  multiple
                  getOptionLabel={(option) => option.name || ''}
                  getOptionSelected={(option, selected) =>
                    option.name === selected.name
                  }
                  itemSize={72}
                  limitTags={3}
                  renderOption={(option, { selected }) => (
                    <ListItem>
                      <ListItemIcon>
                        <Checkbox
                          checked={selected}
                          edge="start"
                          tabIndex={-1}
                          disableRipple
                          color="primary"
                        />
                      </ListItemIcon>
                      <ListItemText primary={option.name || ''} />
                    </ListItem>
                  )}
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.PARKING_LOT}`, {
                        infoLevel: 'basic',
                        limit: 50,
                        page,
                        keyword,
                      })
                        .then((result) => {
                          resolve({
                            data: [...result.data],
                            totalCount: result?.count,
                          });
                        })
                        .catch((err) => reject(err));
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder={props?.value[0] ? 'Chọn phạm vi' : 'Tất cả'}
                    />
                  )}
                />
              )}
            />
            {errors.wlpkLs && (
              <FormHelperText>{errors.wlpkLs?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl error={errors.wlvehComs} fullWidth>
            <FormLabel>Hãng xe</FormLabel>
            <Controller
              control={control}
              name="wlvehComs"
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                  fullWidth
                  multiple
                  getOptionLabel={(option) => option.name || ''}
                  getOptionSelected={(option, selected) =>
                    option.name === selected.name
                  }
                  itemSize={72}
                  limitTags={3}
                  renderOption={(option, { selected }) => (
                    <ListItem>
                      <ListItemIcon>
                        <Checkbox
                          checked={selected}
                          edge="start"
                          tabIndex={-1}
                          disableRipple
                          color="primary"
                        />
                      </ListItemIcon>
                      <ListItemText primary={option.name || ''} />
                    </ListItem>
                  )}
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.PARKING_VEH}`, {
                        infoLevel: 'basic',
                        limit: 50,
                        page,
                        keyword,
                      })
                        .then((result) => {
                          resolve({
                            data: [...result.data],
                            totalCount: result.data?.length || 0,
                          });
                        })
                        .catch((err) => reject(err));
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder={props?.value[0] ? 'Chọn hãng xe' : 'Tất cả'}
                    />
                  )}
                />
              )}
            />

            {errors.wlvehComs && (
              <FormHelperText>{errors.wlvehComs?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl error={errors.wlservices} fullWidth>
            <FormLabel>Loại vé</FormLabel>
            <Controller
              control={control}
              name="wlservices"
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                  fullWidth
                  multiple
                  getOptionLabel={(option) => option.name || ''}
                  getOptionSelected={(option, selected) =>
                    option.name === selected.name
                  }
                  itemSize={72}
                  limitTags={3}
                  renderOption={(option, { selected }) => (
                    <ListItem>
                      <ListItemIcon>
                        <Checkbox
                          checked={selected}
                          edge="start"
                          tabIndex={-1}
                          disableRipple
                          color="primary"
                        />
                      </ListItemIcon>
                      <ListItemText primary={option.name || ''} />
                    </ListItem>
                  )}
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.PARKING_SERVICES}`, {
                        infoLevel: 'basic',
                        limit: 50,
                        page,
                        keyword,
                      })
                        .then((result) => {
                          resolve({
                            data: [...result.data],
                            totalCount: result.data?.length || 0,
                          });
                        })
                        .catch((err) => reject(err));
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder={props?.value[0] ? 'Chọn loại vé' : 'Tất cả'}
                    />
                  )}
                />
              )}
            />

            {errors.wlservices && (
              <FormHelperText>{errors.wlservices?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl error={errors.lpn} fullWidth>
            <FormLabel>Biển số xe</FormLabel>
            <Controller
              control={control}
              name="lpn"
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  placeholder="Chọn biển số xe"
                  fullWidth
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={(option) => option?.lpn}
                  firstIndex={1}
                  getOptionSelected={(option, selected) =>
                    option?.id == selected?.id
                  }
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.PARKING_LPNS}`, {
                        infoLevel: 'basic',
                        limit: 50,
                        page,
                        keyword,
                      })
                        .then((result) => {
                          resolve({
                            data: result.data,
                            totalCount: result?.count,
                          });
                        })
                        .catch((err) => reject(err));
                    })
                  }
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                />
              )}
            />
            {errors.lpn && (
              <FormHelperText>{errors.lpn?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl error={errors.state} fullWidth>
            <FormLabel>Trạng thái</FormLabel>
            <Controller
              control={control}
              name="state"
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  fullWidth
                  placeholder="Trạng thái"
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={(option) => option?.value}
                  firstIndex={1}
                  getOptionSelected={(option, selected) =>
                    option?.id == selected?.id
                  }
                  loadData={() =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.GET_DATA_STATE('promotes')}`)
                        .then((result) => {
                          resolve({
                            data: [...result.stateType],
                            totalCount: result?.stateType?.length || 0,
                          });
                        })
                        .catch((err) => reject(getErrorMessage(err)));
                    })
                  }
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                />
              )}
            />
            {errors.state && (
              <FormHelperText style={{ color: '#f44336' }}>
                {errors.state?.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <FormLabel>Số tiền</FormLabel>
            <Controller
              control={control}
              name="money"
              render={(props) => (
                <NumberBox
                  value={props.value}
                  defaultValue={props.value}
                  format="#,##0 VNĐ"
                  onValueChange={(values) => {
                    props.onChange(values);
                  }}
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </FormControl>
        </Grid>
      </Grid>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
        >
          {id ? 'Lưu' : 'Thêm'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddVoucher;
