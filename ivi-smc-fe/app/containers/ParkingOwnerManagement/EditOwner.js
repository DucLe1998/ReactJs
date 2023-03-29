import {
  Tooltip,
  DialogActions,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
  Badge,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import {
  IconAdd,
  IconFilter,
  IconDelete,
  IconEdit,
  IconImport,
  IconExport,
} from 'constant/ListIcons';
import { ScrollView } from 'devextreme-react';
import { Popup } from 'devextreme-react/popup';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from 'components/DatePicker';
import { TextBox } from 'devextreme-react/text-box';
import { BsX } from 'react-icons/bs';
import BtnCancel from 'components/Button/BtnCancel';
import { KeyboardDatePicker, TimePicker } from '@material-ui/pickers';
import A from '../../components/A';
import { IconButtonHeader } from '../../components/CommonComponent';
import IconBtn from '../../components/Custom/IconBtn';
import PopupDelete from '../../components/Custom/popup/PopupDelete';
import PageSearch from '../../components/PageSearch';
import TableCustom from '../../components/TableCustom';
import { getApi, postApi, putApi } from '../../utils/requestUtils';
import { showError, showSuccess } from '../../utils/toast-utils';
import { buildUrlWithToken } from '../../utils/utils';
import { API_PARKING, API_PARKING_LOT } from '../apiUrl';
import { getErrorMessage } from '../Common/function';
import ModalImage from '../../components/ModalImage';
import Loading from '../Loading';
import ImportOwner from './creens/ImportOwner';
import AddUser from './creens/AddUser';
import FilterMap from './creens/Filter';
import reducer from './reducer';
import saga from './saga';
import makeSelectMapIndoorManagement from './selectors';
import { useStyles } from './styled';
import BtnSuccess from '../../components/Button/BtnSuccess';
import VAutocomplete from '../../components/VAutocomplete';
import MultiSelect from '../../components/MultiSelect';
const intexamle = {
  cnc: null,
  cardCsn: null,
  service: { id: null, name: null },
  rule: { id: null, name: null },
  availableAt: null,
  expiredAt: null,
  lpn: null,
  dscr: null,
  state: null,
  exUsers: [],
};
export function AddOwnerManagement() {
  const classes = useStyles();
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState(intexamle);
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [deleteId, setDeleteid] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showPopupAdd, setShowPopupAdd] = useState(false);
  const [showPopupImport, setShowPopupImport] = useState(false);
  const [parkingEnable, setparkingEnable] = useState([]);
  const [reload, setReload] = useState(0);
  const history = useHistory();
  const { id } = useParams();
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
  } = useForm();

  const fetchDataSource = async () => {
    // setLoading(true);
    // await getApi(`${API_PARKING_LOT.PARKING_LOT}`, {
    //   infoLevel: 'basic',
    // }).then((result) => {
    //   const result2 = [];
    //   result.data.map((x) => result2.push({ label: x.name, value: x.id }));
    //   console.log(result2);
    //   setparkingEnable(result2);
    //   setLoading(false);
    // });
    if (id) {
      await getApi(`${API_PARKING_LOT.PARKING_SUBSCRIBERS}/${id}`)
        .then((response) => {
          console.log(response.data);
          const setData = response.data;
          setData.service = {
            id: response.data?.serviceId,
            name: response.data?.name,
          };
          setData.rule = {
            id: response.data?.ruleId,
            name: response.data?.ruleName,
          };
          setDataSource(response.data);
        })
        .catch((err) => {
          showError(getErrorMessage(err));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleChangeFilter = (data) => {
    // setFilter({ ...filter, ...data });
    setReload(reload + 1);
  };
  const setDetailFormValue = () => {
    reset(dataSource);
  };
  useEffect(() => {
    if (dataSource) {
      setDetailFormValue();
    }
  }, [dataSource]);
  useEffect(() => {
    fetchDataSource();
  }, [id]);

  const addUserPopup = () => (
    <Popup
      visible={showPopupAdd}
      onHiding={() => setShowPopupAdd(!showPopupAdd)}
      dragEnabled
      showTitle={false}
      width="70%"
      height="auto"
      maxHeight="100%"
      className={classes.popup}
    >
      <IconBtn
        onClick={() => setShowPopupAdd(false)}
        style={{
          padding: 12,
          position: 'absolute',
          top: 6,
          right: 6,
          zIndex: 9,
        }}
        icon={<BsX color="gray" />}
      />
      <ScrollView width="100%" height="100%">
        <AddUser
          onClose={() => setShowPopupAdd(false)}
          setReload={1}
          dataOnChange={(data) => {
            const dataNew = { ...dataSource };
            if (dataSource?.exUsers) {
              dataNew.exUsers = [...dataSource?.exUsers, data];
            } else {
              dataNew.exUsers = [];
              dataNew.exUsers.push(data);
            }
            setDataSource(dataNew);
            setShowPopupAdd(false);
          }}
        />
      </ScrollView>
    </Popup>
  );
  const editPopup = () => (
    <Popup
      visible={editId !== null}
      onHiding={() => setEditId(null)}
      dragEnabled
      showTitle
      width="50%"
      height="auto"
      className={classes.popup}
    >
      <ImportOwner
        onClose={() => setEditId(false)}
        id={editId}
        setReload={() => setReload(reload + 1)}
      />
    </Popup>
  );
  const ImportPopup = (
    <Popup
      visible={showPopupImport}
      onHiding={() => setShowPopupImport(!showPopupImport)}
      dragEnabled
      showTitle
      width="340"
      height="auto"
      maxHeight="100%"
      className={classes.popup}
    >
      <ScrollView width="100%" height="100%">
        <ImportOwner
          onClose={() => setShowPopupImport(false)}
          setReload={() => setReload(reload + 1)}
        />
      </ScrollView>
    </Popup>
  );
  const deletePopup = () => (
    <PopupDelete
      onClickSave={() => handlerDelete()}
      onClose={() => setDeleteid(null)}
      typeTxt="user"
    />
  );

  const handlerDelete = () => {
    const users = [];

    dataSource.exUsers.map((x) => {
      x != deleteId ? users.push(x) : '';
    });
    setDeleteid(null);
    const dataNew = { ...dataSource };
    dataNew.exUsers = users;
    setDataSource(dataNew);
  };

  const stt = ({ data }) => <div className="center-content">{stt++}</div>;
  const renderLinkHmi = ({ data }) => (
    <Link to={`/parking/hmi/${data.id}`}>{data.name}</Link>
  );
  const renderLayoutCell = ({ data }) => (
    <Tooltip title={data?.layout.fileName || ''}>
      <A
        onClick={() => setImageUrl(data.layout.fileUrl)}
        style={{ cursor: 'pointer' }}
      >
        {data.layout.fileName}
      </A>
    </Tooltip>
  );
  const exportIcon = (icon) => <img src={icon} style={{ maxHeight: 18 }} />;
  const renderActionCell = ({ data }) => (
    <div className="center-content">
      <IconBtn
        icon={exportIcon(IconEdit)}
        onClick={() => {
          // setEditId(data);
        }}
        style={{ padding: 5 }}
      />
      <IconBtn
        icon={exportIcon(IconDelete)}
        onClick={() => {
          setDeleteid(data);
        }}
        style={{ padding: 5 }}
      />
    </div>
  );
  const onSubmit = async (values) => {
    setLoading(true);
    const params = {
      cnc: values?.cnc,
      cardCsn: values?.cardCsn,
      serviceId: values?.service?.id,
      serviceName: values?.service?.name,
      // availableAt: values?.availableAt,
      // expiredAt: values?.expiredAt,
      lpn: values?.lpn,
      dscr: values?.dscr,
      state: values?.state,
      exUsers: dataSource.exUsers,
    };
    putApi(`${API_PARKING_LOT.PARKING_SUBSCRIBERS}/${id}`, params)
      .then(() => {
        showSuccess('Thành công');
        setReload();
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const columns = [
    {
      caption: 'STT',
      alignment: 'center',
      cellRender: (props) => props?.rowIndex + 1,
      width: '5%',
    },
    {
      dataField: 'fullName',
      caption: 'Họ tên',
      alignment: 'left',
    },
    {
      dataField: 'orgUnitId',
      caption: 'Mã đinh danh',
      alignment: 'left',
    },
    {
      dataField: 'mobile',
      caption: 'Số điện thoại',
    },
    {
      dataField: 'pinCode',
      caption: 'Mã thẻ',
    },
    {
      dataField: 'avatarUrl',
      caption: 'Ảnh khuôn mặt',
    },
    {
      caption: 'Hành động',
      cellRender: renderActionCell,
      alignment: 'center',
      fixed: true,
      fixedPosition: 'right',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Sửa thuê bao</title>
      </Helmet>
      <>
        {loading && <Loading />}
        {showPopupAdd && addUserPopup()}
        {showPopupImport && ImportPopup()}
        {deleteId && deletePopup()}
        {editId && editPopup()}
        {imageUrl && (
          <ModalImage
            onClose={() => {
              setImageUrl(null);
            }}
            imageUrl={buildUrlWithToken(imageUrl)}
          />
        )}
        <PageSearch
          title="Sửa thuê bao"
          showSearch={false}
          // onSearchValueChange={newVal => {
          //   setFilter({ ...filter, keyword: newVal });
          // }}
          showBackButton
          onBack={() => {
            history.push('/parking/owner');
          }}
        >
          <BtnSuccess onClick={handleSubmit(onSubmit)}>Sửa</BtnSuccess>
        </PageSearch>
      </>

      <div className={classes.tableContent}>
        <h3> Thông tin thuê bao</h3>
        <form className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <FormLabel required>Mã thuê bao</FormLabel>
              <Controller
                control={control}
                name="cnc"
                defaultValue=""
                render={(props) => (
                  <TextBox
                    maxLength="50"
                    width="100%"
                    defaultValue="123"
                    disabled
                    style={{
                      background: '#F1F1F1',
                      color: '#A4A4A4',
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormLabel>Mã thẻ</FormLabel>
              <Controller
                control={control}
                name="cardCsn"
                render={(props) => (
                  <TextBox
                    maxLength="50"
                    width="100%"
                    placeholder="Nhập mã thẻ"
                    value={props.value}
                    onValueChanged={(e) => {
                      props.onChange(e.value);
                      // setValue('area',e.value)
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormLabel>Chọn loại thẻ</FormLabel>
              <Controller
                control={control}
                name="service"
                defaultValue=""
                render={(props) => (
                  <VAutocomplete
                    value={props.value}
                    fullWidth
                    // disabled={!watchFields.block}
                    // disableClearable
                    noOptionsText="Không có dữ liệu"
                    getOptionLabel={(option) => option?.name || ''}
                    firstIndex={1}
                    getOptionSelected={(option, selected) =>
                      option.id == selected.id
                    }
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
                          .catch((err) => reject(getErrorMessage(err)));
                      })
                    }
                    onChange={(e, value) => {
                      props.onChange(value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Chọn loại thẻ"
                        error={!!errors.floor}
                        helperText={errors.floor && errors.floor.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormLabel>Biển số</FormLabel>
              <Controller
                control={control}
                name="lpn"
                render={(props) => (
                  <TextBox
                    maxLength="50"
                    width="100%"
                    placeholder="Nhập biển số"
                    value={props.value}
                    onValueChanged={(e) => {
                      props.onChange(e.value);
                      // setValue('area',e.value)
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormLabel>Mô tả xe</FormLabel>
              <Controller
                control={control}
                name="dscr"
                render={(props) => (
                  <TextBox
                    maxLength="50"
                    width="100%"
                    placeholder="Nhập mô tả xe"
                    value={props.value}
                    onValueChanged={(e) => {
                      props.onChange(e.value);
                      // setValue('area',e.value)
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormLabel required>Trạng thái</FormLabel>
              <Controller
                control={control}
                name="state"
                render={(props) => (
                  <VAutocomplete
                    value={props.value}
                    fullWidth
                    // disabled={!watchFields.block}
                    // disableClearable
                    noOptionsText="Không có dữ liệu"
                    getOptionLabel={(option) => option?.value}
                    firstIndex={1}
                    getOptionSelected={(option, selected) => option?.id == selected?.id}
                    loadData={() =>
                      new Promise((resolve, reject) => {
                        getApi(`${API_PARKING_LOT.GET_DATA_STATE('subscribers')}`)
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Trạng thái"
                      />
                    )}
                  />
                )}
              />
              {errors.state && (
                <FormHelperText style={{ color: '#f44336' }}>
                  {errors.state?.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl error={errors.availableAt} fullWidth>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <Controller
                  control={control}
                  name="availableAt"
                  defaultValue=""
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
                <FormLabel>Ngày kết thúc</FormLabel>
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
              <FormControl error={errors.rule} fullWidth>
                <FormLabel required>Rule</FormLabel>
                <Controller
                  control={control}
                  name="rule"
                  render={(props) => (
                    <VAutocomplete
                      value={props.value}
                      fullWidth
                      placeholder="Chọn Rule"
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
                            .catch((err) => reject(err));
                        })
                      }
                      onChange={(e, value) => {
                        props.onChange(value);
                      }}
                    />
                  )}
                />
                {errors.rule && (
                  <FormHelperText>{errors.rule?.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl error={errors.wLPkLs} fullWidth>
                <FormLabel required>Bãi xe được vào</FormLabel>
                <Controller
                  control={control}
                  name="wLPkLs"
                  defaultValue={[]}
                  render={(props) => (
                    <VAutocomplete
                      value={props.wLPkLs}
                      onChange={(e, value) => {
                        props.onChange(value);
                      }}
                      fullWidth
                      multiple
                      getOptionLabel={(option) => option.name || ''}
                      itemSize={72}
                      limitTags={2}
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
                            page,
                            keyword,
                          })
                            .then((result) => {
                              resolve({
                                data: result?.data,
                                totalCount: result?.count,
                              });
                            })
                            .catch((err) => reject(getErrorMessage(err)));
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Chọn bãi xe được vào"
                        />
                      )}
                    />
                  )}
                />
                {errors.wLPkLs && (
                  <FormHelperText>{errors.wLPkLs?.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </div>
      <div className={classes.tableContent}>
        <Grid container spacing={1} style={{ margin: '10px 0px 20px 0px' }}>
          <Grid item xs={12} sm={6}>
            <h3>Thông tin chủ xe</h3>
          </Grid>
          <Grid item xs={12} sm={6} align="right">
            <BtnSuccess
              onClick={() => {
                setShowPopupAdd(true);
              }}
            >
              Thêm chủ xe
            </BtnSuccess>
          </Grid>
        </Grid>
        {/* {useMemo(
          () => (
            <TableCustom data={dataSource?.rows || []} columns={columns}  pushClass={'table-grid center-row-grid'}/>
          ),
          [dataSource],
        )} */}
        <TableCustom
          data={dataSource?.exUsers || []}
          columns={columns}
        />
      </div>
    </>
  );
}
export default AddOwnerManagement;
