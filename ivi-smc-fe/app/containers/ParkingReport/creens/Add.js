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
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
  IconButton,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import * as yup from 'yup';
import Checkbox from '@material-ui/core/Checkbox';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import VAutocomplete from 'components/VAutocomplete';
import {
  callApiWithConfig,
  getApi,
  postApi,
  putApi,
  METHODS,
} from 'utils/requestUtils';
import styled from 'styled-components';
import { validationSchema } from 'utils/utils';
import { showError, showSuccess } from 'utils/toast-utils';
import BtnSuccess from 'components/Button/BtnSuccess';
import Close from '@material-ui/icons/Close';
import FileUploader from 'devextreme-react/file-uploader';
import { KeyboardDatePicker, TimePicker } from '@material-ui/pickers';
import TableCustom from 'components/TableCustom';
import { ValidationRule, Column } from 'devextreme-react/data-grid';
import AddIcon from '@material-ui/icons/Add';
import ShortMultiSelect from 'components/ShortMultiSelect';
import {
  add,
  eachDayOfInterval,
  isAfter,
  startOfDay,
  isSameDay,
} from 'date-fns';
import { min2Time, time2Min } from 'utils/functions';
import { NumberBox } from 'devextreme-react/number-box';
import Loading from '../../Loading';
import { getErrorMessage } from '../../Common/function';
import { API_PARKING_LOT } from '../../apiUrl';
import { useStyles } from '../styled';
const WEEKDAYS = [
  {
    label: 'T2',
    value: 'MONDAY',
  },
  {
    label: 'T3',
    value: 'TUESDAY',
  },
  {
    label: 'T4',
    value: 'WEDNESDAY',
  },
  {
    label: 'T5',
    value: 'THURSDAY',
  },
  {
    label: 'T6',
    value: 'FRIDAY',
  },
  {
    label: 'T7',
    value: 'SATURDAY',
  },
  {
    label: 'CN',
    value: 'SUNDAY',
  },
];
const today = new Date();
const initValues = {
  name: null,
  dscr: null,
  timeConfig: 'dayOfWeek',
  availableAt: new Date(),
  expiredAt: new Date(today.setFullYear(10 + today.getFullYear())),
  wlpkLs: [],
  money: 1000000,
  wlservices: [],
  wlvehComs: [],
  state: { id: 'active', value: 'Hoạt động' },
  conditionApply: { id: 'other', value: 'Khác' },
  hourFrameStartAt: min2Time('0'),
  hourFrameStopAt: min2Time(60 * 24 - 1),
};
const DAYS_OF_WEEK = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];
const DAYS_OF_MONTH = [];
const MONTHDAYS = [];
for (let date = 1; date <= 31; date++) {
  DAYS_OF_MONTH.push(date);
  MONTHDAYS.push({
    label: date,
    value: date,
  });
}
export const AddPromote = ({ onClose, id, setReload }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [fileUploadDataName, setFileUploadDataName] = useState();
  const [fileUploadDataId, setFileUploadDataId] = useState();
  const [fileUploadError, setFileUploadError] = useState('');
  const [timeConfig, setTimeConfig] = useState('dayOfWeek');
  const [priceByHour, setPriceByHour] = useState([]);
  const [price, setPrice] = useState(null);
  const [dayOfWeeks, setDayOfWeeks] = useState([]);
  const [dayOfMonth, setDayOfMonth] = useState([]);
  const fetchDataSource = () => {
    setLoading(true);
    getApi(`${API_PARKING_LOT.PARKING_PROMOTE}/${id}`)
      .then((response) => {
        const setData = response.data;
        setData.timeConfig = response.data?.applyDayType;
        setData.availableAt = new Date(response.data?.availableAt);
        setData.expiredAt = new Date(response.data?.expiredAt);
        setTimeConfig(response.data?.applyDayType);
        setDayOfWeeks(response.data?.listDay);
        setDayOfMonth(response.data?.listDate);
        // setDetail(setData);
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
      dscr: values?.dscr,
      availableAt: new Date(values?.availableAt).getTime(),
      expiredAt: new Date(values?.expiredAt).getTime(),
      wlpkLs: values?.wlpkLs,
      wlservices: values?.wlservices,
      wlvehComs: values?.wlvehComs,
      state: values?.state,
      money: values?.money,
      conditionApply: values?.conditionApply,
      applyDayType: timeConfig,
      listDate: dayOfMonth,
      listDay: dayOfWeeks,
      hourFrameStartAt: values?.hourFrameStartAt,
      hourFrameStopAt: values?.hourFrameStopAt,
    };
    if (id) handleUpdate(params);
    else handleAdd(params);
  };
  const handleAdd = (params) => {
    setLoading(true);
    postApi(API_PARKING_LOT.PARKING_PROMOTE, params)
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
    putApi(`${API_PARKING_LOT.PARKING_PROMOTE}/${id}`, params)
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
  const headerRender = ({ component }) => (
    <Tooltip title="Thêm khung giờ">
      <IconButton
        size="small"
        onClick={() => {
          component.addRow();
        }}
        color="primary"
      >
        <p
          style={{
            color: '#117B5B',
            margin: 0,
            cursor: 'pointer',
            marginRight: '10px',
            fontSize: '14px',
          }}
        >
          Thêm khung giờ
        </p>
        <AddIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
  const timeStart = ({ data }) => (
    <TimePicker
      format="HH:mm"
      placeholder="HH:mm"
      value={data.value}
      // minutesStep={blockTime}
      variant="inline"
      onChange={(e) => data.setValue(e)}
      inputVariant="outlined"
    />
  );
  const timeEnd = ({ data }) => (
    <TimePicker
      format="HH:mm"
      placeholder="HH:mm"
      value={data.value}
      // minutesStep={blockTime}
      variant="inline"
      onChange={(e) => data.setValue(e)}
      inputVariant="outlined"
    />
  );

  const numberMoney = ({ data }) => (
    <NumberBox
      value={data.value}
      defaultValue={data.value}
      format="#,##0 VNĐ"
      onValueChange={(values) => {
        data.setValue(values);
      }}
      variant="outlined"
      size="small"
    />
  );
  const priceByHourCol = [
    {
      dataField: 'availableAt',
      caption: 'Giờ bắt đầu',
      allowEditing: true,
      editCellComponent: timeStart,
    },
    {
      dataField: 'endTime',
      caption: 'Giờ kết thúc',
      allowEditing: true,
      editCellComponent: timeEnd,
    },
    {
      dataField: 'price',
      caption: 'Giá (VND)',
      editCellComponent: numberMoney,
      requied: true,
    },
    {
      // cellRender: actionRender,
      headerCellRender: headerRender,
      alignment: 'center',
      width: 120,
    },
  ];
  const tableConfig = (
    <TableCustom
      hideTable={false}
      data={priceByHour}
      // onEditorPreparing={onEditorPreparing}
      // scrolling={{ mode: 'virtual' }}
      editing={{
        mode: 'row',
        allowUpdating: true,
        allowDeleting: true,
        useIcons: true,
        newRowPosition: 'last',
      }}
      pagingProps={{ enabled: true, pageSize: 20 }}
      // onInitNewRow={onInitVehicles}
      // focusedRowEnabled
    >
      {React.Children.toArray(
        priceByHourCol.map((defs) => (
          <Column {...defs}>
            {defs?.requied && <ValidationRule type="required" />}
          </Column>
        )),
      )}
    </TableCustom>
  );
  const isDisableDayOfWeekOption = (option) => {
    const { availableAt, expiredAt } = getValues();
    if (!expiredAt) return false;
    if (!availableAt) return false;
    // ngay bat dau > ngay ket thuc => data dang sai => disable het khong cho chon thu trong tuan
    if (isAfter(startOfDay(availableAt), startOfDay(expiredAt))) {
      return true;
    }
    const eachDayOfRange = eachDayOfInterval({
      start: availableAt,
      end: expiredAt,
    });
    // range date > 14 => cac ngay da duoc lap it nhat 2 lan => thoa man dieu kien => ko disable
    if (eachDayOfRange.length > 7) {
      return false;
    }

    // let count = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const dayOfWeek of eachDayOfRange) {
      if (DAYS_OF_WEEK[dayOfWeek.getDay()] === option.value) {
        // formik.setFieldValue('dayOfWeeks', [...formik.values.dayOfWeeks, option.value]);
        return false;
      }
    }
    return true;
  };
  const isDisableDayOfMonthOption = (option) => {
    const { availableAt, expiredAt } = getValues();
    if (!expiredAt) return false;
    if (!availableAt) return false;
    // ngay bat dau > ngay ket thuc => data dang sai => disable het khong cho chon thu trong tuan
    if (isAfter(startOfDay(availableAt), startOfDay(expiredAt))) {
      return true;
    }
    const eachDayOfRange = eachDayOfInterval({
      start: availableAt,
      end: expiredAt,
    });
    // range date > 14 => cac ngay da duoc lap it nhat 2 lan => thoa man dieu kien => ko disable
    if (eachDayOfRange.length > 31) {
      return false;
    }

    // let count = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const dayOfMonth of eachDayOfRange) {
      if (dayOfMonth.getDate() == option.value) {
        // formik.setFieldValue('dayOfWeeks', [...formik.values.dayOfWeeks, option.value]);
        return false;
      }
    }

    return true;
  };
  return (
    <form className={classes.modal}>
      {loading && <Loading />}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <FormLabel>ID</FormLabel>
            <Controller
              control={control}
              name="code"
              render={(props) => (
                <TextField
                  autoComplete="off"
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  placeholder="ID"
                  value={props.value}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                  }}
                  disable
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <FormLabel required>Tên gói</FormLabel>
            <Controller
              control={control}
              name="name"
              render={(props) => (
                <TextField
                  autoComplete="off"
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  placeholder="Nhập tên gói"
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
          <FormControl fullWidth>
            <FormLabel>Số lượng tối đa</FormLabel>
            <Controller
              control={control}
              name="maxUseLimit"
              render={(props) => (
                <TextField
                  autoComplete="off"
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  placeholder="Nhập số lượng"
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
          <FormControl fullWidth>
            <FormLabel>Số tiền</FormLabel>
            <Controller
              control={control}
              name="money"
              render={(props) => (
                <TextField
                  autoComplete="off"
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  placeholder="Nhập số tiền"
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
          <FormControl
            size="small"
            fullWidth
            margin="dense"
            error={errors.hourFrameStartAt}
          >
            <FormLabel required>Giờ bắt đầu</FormLabel>
            <Controller
              control={control}
              name="hourFrameStartAt"
              render={(props) => (
                <TimePicker
                  format="HH:mm"
                  placeholder="HH:mm"
                  value={props.value}
                  variant="inline"
                  size="small"
                  onChange={(e) => props.onChange(e)}
                  inputVariant="outlined"
                  error={errors.hourFrameStartAt}
                  helperText={errors.hourFrameStartAt?.message}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl
            size="small"
            fullWidth
            margin="dense"
            error={errors.hourFrameStopAt}
          >
            <FormLabel required>Giờ kết thúc</FormLabel>
            <Controller
              control={control}
              name="hourFrameStopAt"
              render={(props) => (
                <TimePicker
                  format="HH:mm"
                  placeholder="HH:mm"
                  value={props.value}
                  variant="inline"
                  size="small"
                  onChange={(e) => props.onChange(e)}
                  inputVariant="outlined"
                  error={errors.hourFrameStopAt}
                  helperText={errors.hourFrameStopAt?.message}
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
          <FormControl error={errors.versionType} fullWidth>
            <FormLabel>Điều kiện áp dụng</FormLabel>
            <Controller
              control={control}
              name="conditionApply"
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  placeholder="Chọn điều khoản áp dụng"
                  fullWidth
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={(option) => option?.value}
                  firstIndex={1}
                  getOptionSelected={(option, selected) =>
                    option?.id == selected?.id
                  }
                  loadData={() =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.GET_DATA_APPlY('promotes')}`)
                        .then((result) => {
                          resolve({
                            data: [...result.stateType],
                            totalCount: result?.stateType?.length || 0,
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
            {errors.versionType && (
              <FormHelperText>{errors.versionType?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormLabel>Cấu hình thời gian</FormLabel>
          <Controller
            control={control}
            name="timeConfig"
            render={(props) => (
              <RadioGroup
                value={props.value}
                onChange={(e) => {
                  // setValue('timeConfig', e.target.value);
                  setTimeConfig(e.target.value);
                  props.onChange(e.target.value);
                }}
                row
              >
                <FormControlLabel
                  value="dayOfWeek"
                  control={<Radio color="primary" />}
                  label="Theo thứ"
                />
                <FormControlLabel
                  value="dateOfMonth"
                  control={<Radio color="primary" />}
                  label="Theo ngày"
                />
              </RadioGroup>
            )}
          />
        </Grid>
        <Grid item sm={12}>
          <FormControl error={errors.time} fullWidth>
            {timeConfig == 'dayOfWeek' && (
              <div style={{ height: '40px', display: 'flex' }}>
                <ShortMultiSelect
                  options={WEEKDAYS}
                  displayExpr={(option) => option.label}
                  valueExpr="value"
                  getOptionDisabled={isDisableDayOfWeekOption}
                  value={dayOfWeeks}
                  onChange={(e) => {
                    setDayOfWeeks(e);
                  }}
                />
              </div>
            )}
            {timeConfig == 'dateOfMonth' && (
              <div style={{ height: '40px', display: 'flex' }}>
                <ShortMultiSelect
                  options={MONTHDAYS}
                  displayExpr={(option) => option.label}
                  valueExpr="value"
                  getOptionDisabled={isDisableDayOfMonthOption}
                  value={dayOfMonth}
                  onChange={(e) => {
                    setDayOfMonth(e);
                  }}
                />
              </div>
            )}
            {errors.time && (
              <FormHelperText>{errors.time?.message}</FormHelperText>
            )}
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

export default AddPromote;
