import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
  ListItem,
  ListItemText,
  ListItemIcon,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
  IconButton,
  Paper,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import * as yup from 'yup';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { TextBox } from 'devextreme-react/text-box';
import { KeyboardDatePicker } from '@material-ui/pickers';
import TableCustom from 'components/TableCustom';
import { ValidationRule, Column } from 'devextreme-react/data-grid';
import AddIcon from '@material-ui/icons/Add';
import { NumberBox } from 'devextreme-react/number-box';
import VAutocomplete from 'components/VAutocomplete';
import { getApi, postApi, putApi } from 'utils/requestUtils';
import { validationSchema } from 'utils/utils';
import { showError, showSuccess } from 'utils/toast-utils';
import BtnCancel from 'components/Button/BtnCancel';
import BtnSuccess from 'components/Button/BtnSuccess';
import { Helmet } from 'react-helmet';
import PageHeader from '../../components/PageHeader';
import Loading from '../Loading';
import { getErrorMessage } from '../Common/function';
import { API_PARKING_LOT } from '../apiUrl';
import { detailStyles } from './styled';
const initValues = {
  name: null,
  rule: null,
  dscr: null,
  state: { id: 'active', value: 'Hoạt động' },
  wlvehComs: [],
  lstModAt: new Date(),
  priceConfig: 'timeFrame',
  price: null,
};

const defineLabel = {
  fixedPricing: 'VND',
  yearly: 'VND/năm',
  monthly: 'VND/tháng',
  daily: 'VND/ngày',
  timeFrame: 'VND',
};

const stateType = [
  {
    id: 'fixedPricing',
    value: 'Cố định',
  },
  {
    id: 'yearly',
    value: 'Theo năm',
  },
  {
    id: 'monthly',
    value: 'Theo tháng',
  },
  {
    id: 'daily',
    value: 'Theo ngày',
  },
  {
    id: 'timeFrame',
    value: 'Theo khung giờ',
  },
];

export default function AddServices({ history, location }) {
  const classes = detailStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [priceByHour, setPriceByHour] = useState([]);
  const [price, setPrice] = useState(null);
  const [priceConfig, setPriceConfig] = useState('timeFrame');
  const [reload, setReload] = useState(0);
  const { id } = useParams();
  const fetchDataSource = () => {
    setLoading(true);
    getApi(`${API_PARKING_LOT.PARKING_SERVICES}/${id}`)
      .then((response) => {
        const setData = response.data;
        setData.rule = {
          id: response.data?.ruleId,
          name: response.data?.ruleName,
        };
        if (response?.data?.wlvehComs) {
          setData.wlvehComs = [...response?.data?.wlvehComs];
        } else {
          setData.wlvehComs = [];
        }
        if (response?.data?.pricingData) {
          setPriceConfig(response?.data?.pricingData?.pricingType?.id);
          setPrice(response?.data?.pricingData?.price);
          const timeFrame = response?.data?.pricingData?.timeFrameData.map(
            (x) => ({
              startAt: new Date(x.startAt),
              endAt: new Date(x.endAt),
              price: x.price,
            }),
          );
          setPriceByHour(timeFrame);
        }
        setDetail(setData);
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const schema = validationSchema({
    name: yup.string().nullable().required('Trường này bắt buộc nhập'),
    rule: yup.object().nullable().required('Trường này bắt buộc nhập'),
    state: yup.object().nullable().required('Trường này bắt buộc nhập'),
  });
  const {
    handleSubmit,
    control,
    getValues,
    setError,
    setValue,
    reset,
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
  const setDetailFormValue = () => {
    if (detail?.name) {
      reset(detail);
    } else {
      reset(initValues);
    }
  };

  useEffect(() => {
    if (detail) {
      setDetailFormValue();
    }
  }, [detail]);
  const onSubmit = (values) => {
    if (priceConfig != 'timeFrame' && !price) {
      setError('price', {
        type: 'requied',
        message: 'Trường này bắt buộc nhập',
      });
      return;
    }
    if (priceConfig == 'timeFrame' && priceByHour.length == 0) {
      setError('price', {
        type: 'requied',
        message: 'Trường này bắt buộc nhập',
      });

      return;
    }
    setLoading(true);
    const params = {
      name: values.name,
      dscr: values?.dscr,
      ruleId: values?.rule?.id,
      ruleName: values?.rule?.name,
      state: values?.state,
      wlvehComs: values?.wlvehComs,
      lstModAt: new Date(values?.lstModAt).getTime(),
      pricingData: {
        pricingType: stateType.filter((x) => x.id == priceConfig)[0],
        price,
        timeFrameData: priceByHour.map((x) => ({
          startAt: x.startAt.getTime(),
          endAt: x.endAt.getTime(),
          price: x.price,
        })),
      },
    };
    if (id) handleUpdate(params);
    else handleAdd(params);
  };
  const handleAdd = (params) => {
    setLoading(true);
    postApi(API_PARKING_LOT.PARKING_SERVICES, params)
      .then(() => {
        showSuccess('Thêm mới thành công', {
          text: 'Dữ liệu đã được cập nhật',
        });
        setReload(reload + 1);
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleUpdate = (params) => {
    setLoading(true);
    putApi(`${API_PARKING_LOT.PARKING_SERVICES}/${id}`, params)
      .then(() => {
        showSuccess('Cập nhật thành công', {
          text: 'Dữ liệu đã được cập nhật',
        });
        setReload(reload + 1);
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
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
      dataField: 'startAt',
      caption: 'Giờ bắt đầu',
      dataType: 'datetime',
      format: 'shortTime',
      editorOptions: { type: 'time' },
      // editCellComponent: timeStart,
      // cellRender: ({ data }) => data.startAt,
    },
    {
      dataField: 'endAt',
      caption: 'Giờ kết thúc',
      dataType: 'datetime',
      format: 'shortTime',
      editorOptions: { type: 'time', displayFormat: 'shortTime' },
      // cellRender: ({ data }) => data.endAt,
    },
    {
      dataField: 'price',
      caption: 'Giá (VND)',
      editCellComponent: numberMoney,
      cellRender: ({ data }) =>
        data.price ? new Intl.NumberFormat().format(data.price) : '',
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
        mode: 'cell',
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
  const backToManage = () => {
    history.replace({
      pathname: '/parking/services',
      state: location.state,
    });
  };
  return (
    <div className={classes.root}>
      <Helmet>
        <title>Quản lý dịch vụ</title>
        <meta name="description" content="Quản lý dịch vụ" />
      </Helmet>
      <form className={classes.modal}>
        {loading && <Loading />}
        <PageHeader
          title={id ? getValues().name : 'Thêm loại vé'}
          showBackButton
          onBack={backToManage}
        >
          <BtnCancel onClick={() => history.goBack()}>Hủy</BtnCancel>
          <BtnSuccess onClick={handleSubmit(onSubmit)}>
            {id ? 'Lưu' : 'Thêm'}
          </BtnSuccess>
        </PageHeader>
        <Paper className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item xs={4} sm={4}>
              <FormControl error={errors.name} fullWidth>
                <FormLabel required>Tên loại vé</FormLabel>
                <Controller
                  control={control}
                  name="name"
                  render={(props) => (
                    <TextField
                      maxLength="50"
                      width="100%"
                      placeholder="Tên loại vé"
                      value={props.value}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                      }}
                      error={errors.name}
                      helperText={errors.name?.message}
                      variant="outlined"
                      size="small"
                      inputProps={{ maxLength: 50 }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={4}>
              <FormLabel>Miêu tả</FormLabel>
              <Controller
                control={control}
                name="dscr"
                render={(props) => (
                  <TextBox
                    maxLength="50"
                    width="100%"
                    placeholder="Nhập miêu tả"
                    value={props.value}
                    onValueChanged={(e) => {
                      props.onChange(e.value);
                      // setValue('area',e.value)
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4} sm={4}>
              <FormControl error={errors.state} fullWidth>
                <FormLabel required>Trạng thái</FormLabel>
                <Controller
                  control={control}
                  name="state"
                  render={(props) => (
                    <VAutocomplete
                      value={props.value}
                      fullWidth
                      disabled={id}
                      placeholder="Trạng thái"
                      noOptionsText="Không có dữ liệu"
                      getOptionLabel={(option) => option?.value}
                      firstIndex={1}
                      getOptionSelected={(option, selected) =>
                        option?.id == selected?.id
                      }
                      loadData={() =>
                        new Promise((resolve, reject) => {
                          getApi(
                            `${API_PARKING_LOT.GET_DATA_STATE('services')}`,
                          )
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

            <Grid item xs={4} sm={4}>
              <FormControl error={errors.rule} fullWidth>
                <FormLabel required>Rule</FormLabel>
                <Controller
                  control={control}
                  name="rule"
                  defaultValue=""
                  render={(props) => (
                    <VAutocomplete
                      value={props.value}
                      fullWidth
                      disabled={id}
                      placeholder="Chọn rule"
                      noOptionsText="Không có dữ liệu"
                      getOptionLabel={(option) => option?.name || ''}
                      firstIndex={1}
                      getOptionSelected={(option, selected) =>
                        option.id == selected.id
                      }
                      loadData={(page, keyword) =>
                        new Promise((resolve, reject) => {
                          getApi(`${API_PARKING_LOT.PARKING_RULES}`, {
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
                            .catch((err) => reject(getErrorMessage(err)));
                        })
                      }
                      onChange={(e, value) => {
                        props.onChange(value);
                      }}
                    />
                  )}
                />
                {errors.rule && (
                  <FormHelperText style={{ color: '#f44336' }}>
                    {errors.rule?.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <FormControl error={errors.rule} fullWidth>
                <FormLabel required>Hãng xe áp dụng</FormLabel>
                
              </FormControl>

            </Grid> */}
            <Grid item xs={4} sm={4}>
              <FormControl error={errors.wlvehComs} fullWidth>
                <FormLabel>Hãng xe áp dụng</FormLabel>
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
                          placeholder={
                            props.value[0] ? 'Chọn hãng xe' : 'Tất cả'
                          }
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
            <Grid item xs={4} sm={4}>
              <FormControl fullWidth>
                <FormLabel required>Ngày sửa</FormLabel>
                <Controller
                  control={control}
                  name="lstModAt"
                  disabled
                  render={(props) => (
                    <KeyboardDatePicker
                      id="manageGuest-dialogFilter2"
                      size="small"
                      autoOk
                      variant="inline"
                      fullWidth
                      placeholder="Ngày sửa"
                      value={props.value || null}
                      onChange={(e) => {
                        setValue('lstModAt', e);
                      }}
                      inputVariant="outlined"
                      format="dd/MM/yyyy"
                      disabled
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item sm={12}>
              <FormLabel required> Cấu hình giá</FormLabel>
              <Controller
                control={control}
                name="priceConfig"
                defaultValue=""
                render={() => (
                  <RadioGroup
                    value={priceConfig}
                    onChange={(e) => {
                      setValue('priceConfig', e.target.value);
                      setPriceConfig(e.target.value);
                      // props.onChange(e.target.value);
                    }}
                    row
                  >
                    {stateType.map((x) => (
                      <FormControlLabel
                        value={x.id}
                        control={<Radio color="primary" />}
                        label={x.value}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
            </Grid>

            <Grid item sm={8}>
              <FormControl error={errors.price} fullWidth>
                {/* <FormLabel required> {defineLabel[priceConfig]} </FormLabel> */}
                {priceConfig != 'timeFrame' && (
                  <NumberBox
                    value={price}
                    defaultValue=""
                    placeholder={defineLabel[priceConfig]}
                    format="#,##0 VNĐ"
                    onValueChange={(values) => {
                      setPrice(values);
                    }}
                    variant="outlined"
                    size="small"
                  />
                )}
                {priceConfig == 'timeFrame' && (
                  <>
                    <TableCustomWrap>{tableConfig}</TableCustomWrap>
                    {errors.price && (
                      <FormHelperText>{errors.price?.message}</FormHelperText>
                    )}
                  </>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </div>
  );
}

const TableCustomWrap = styled.div`
  .dx-datagrid-nodata {
    display: none;
  }
  .dx-visibility-change-handler {
    min-height: auto !important;
  }
  .dx-fileuploader-files-container {
    height: 0px;
    padding: 0px !important;
  }
`;
