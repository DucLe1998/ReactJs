import {
  Tooltip,
  DialogActions,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
  IconButton,
  Button,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
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
import { KeyboardDatePicker, TimePicker } from '@material-ui/pickers';
import A from 'components/A';
import { IconButtonHeader } from 'components/CommonComponent';
import IconBtn from 'components/Custom/IconBtn';
import PopupDelete from 'components/Custom/popup/PopupDelete';
import PopupCancel from 'components/Custom/popup/PopupCancel';
import PageSearch from 'components/PageSearch';
import TableCustom from 'components/TableCustom';
import { getApi, postApi, putApi } from 'utils/requestUtils';
import { showError, showSuccess } from 'utils/toast-utils';
import { buildUrlWithToken, validationSchema } from 'utils/utils';
import ModalImage from 'components/ModalImage';
import BtnSuccess from 'components/Button/BtnSuccess';
import VAutocomplete from 'components/VAutocomplete';
import MultiSelect from 'components/MultiSelect';
import * as yup from 'yup';
import {
  format,
  add,
  eachDayOfInterval,
  isAfter,
  startOfDay,
  isSameDay,
} from 'date-fns';
import DataGrid, { ValidationRule, Column } from 'devextreme-react/data-grid';
import AddIcon from '@material-ui/icons/Add';
import { API_PARKING, API_PARKING_LOT, IAM_API_SRC, API_FILE } from '../apiUrl';
import { getErrorMessage } from '../Common/function';
import Loading from '../Loading';
import ImportOwner from './creens/ImportOwner';
import AddUser from './creens/AddUser';
import FilterMap from './creens/Filter';
import reducer from './reducer';
import saga from './saga';
import makeSelectMapIndoorManagement from './selectors';
import { useStyles } from './styled';
const today = new Date();
const initValues = {
  cnc: null,
  cardCsn: null,
  service: null,
  availableAt: new Date(),
  expiredAt: new Date(today.setFullYear(10 + today.getFullYear())),
  lpn: null,
  dscr: null,
  state: { id: 'active', value: 'Hoạt động' },
  exUsers: [],
  rule: null,
  wlpkLs: [],
  veh: null,
};
export function AddOwnerManagement() {
  const classes = useStyles();
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState(initValues);
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [deleteId, setDeleteid] = useState(null);
  const [deleteName, setDeleteName] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showPopupAdd, setShowPopupAdd] = useState(false);
  const [showPopupImport, setShowPopupImport] = useState(false);
  const [parkingEnable, setparkingEnable] = useState([]);
  const [openPopupCancel, setOpenPopupCancel] = useState(false);
  const [reload, setReload] = useState(0);
  const history = useHistory();
  const { id } = useParams();
  const schema = validationSchema({
    lpn: yup.string().trim().nullable().required('Trường này bắt buộc nhập'),
    cardCsn: yup.string().trim().nullable().required('Trường này bắt buộc nhập'),
    state: yup.object().shape().nullable().required('Trường này bắt buộc nhập'),
    service: yup
      .object()
      .shape()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    rule: yup.object().shape().nullable().required('Trường này bắt buộc nhập'),
    veh: yup.object().shape().nullable().required('Trường này bắt buộc nhập'),
    wlpkLs: yup.array().required('Trường này bắt buộc nhập'),
    availableAt: yup
      .date()
      .nullable()
      .test(
        'less than 1',
        'Ngày bắt đầu phải trước ngày hiện tại',
        function valid(value) {
          return isAfter(new Date(), value);
        },
      ),
    expiredAt: yup
      .date()
      .nullable()
      .required('Trường này bắt buộc nhập')
      .test(
        'greater than 1',
        'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu',
        function valid(value) {
          const { availableAt } = this.parent;
          return isAfter(value, availableAt) || isSameDay(value, availableAt);
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

  const fetchDataSource = async () => {
    setLoading(true);
    if (id) {
      await getApi(`${API_PARKING_LOT.PARKING_SUBSCRIBERS}/${id}`)
        .then((response) => {
          const setData = response.data;
          console.log(response.data);
          setData.service = {
            id: response.data?.serviceId,
            name: response.data?.serviceName,
          };
          setData.rule = {
            id: response.data?.authRuleId,
            name: response.data?.authRuleName,
          };
          setData.veh = {
            name: response.data?.vehName,
            id: response.data?.vehId,
          };
          const users = [...response.data.exUsers];
          const newUser = users.map((x) => ({
            users: {
              userId: x.id,
              username: x.name,
              fullName: x.fullName,
              phoneNumber: x.mobile,
              userCode: x.userCode,
              accessCode: x.accessCode,
              avatarImageId: x.avatarUrl,
            },
          }));
          setData.exUsers = [...newUser];
          setDataSource(setData);
        })
        .catch((err) => {
          showError(getErrorMessage(err));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const setDetailFormValue = () => {
    reset(dataSource);
  };
  const handleChangeFilter = (data) => {
    // setFilter({ ...filter, ...data });
    setReload(reload + 1);
  };
  useEffect(() => {
    if (id) {
      setDetailFormValue();
    }
  }, [dataSource]);
  useEffect(() => {
    if (id) {
      fetchDataSource();
    }
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
          onSuccess={(data) => {
            const dataNew = { ...dataSource };
            dataNew.exUsers = [...data];
            setShowPopupAdd(false);
            setDataSource(dataNew);
          }}
          initialData={dataSource.exUsers}
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
      typeTxt={deleteName}
    />
  );

  const handlerDelete = () => {
    const users = dataSource.exUsers.filter((x) => x != deleteId);
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
          setDeleteid(data.id);
          setDeleteName(data.name);
        }}
        style={{ padding: 5 }}
      />
    </div>
  );
  const onSubmit = async (values) => {
    const params = {
      cnc: values?.cnc,
      cardCsn: values?.cardCsn,
      serviceId: values?.service?.id,
      serviceName: values?.service?.name,
      availableAt: values?.availableAt,
      expiredAt: values?.expiredAt,
      lpn: values?.lpn,
      dscr: values?.dscr,
      state: values?.state,
      exUsers: values?.exUsers.map((x) => ({
        accessCode: x?.users?.accessCode,
        userCode: x?.users?.userCode,
        fullName: x?.users?.fullName,
        id: x?.users.userId,
        userId: x?.users.userId,
        mobile: x?.users.phoneNumber,
        name: x?.users?.username,
        avatarUrl: x?.users?.avatarImageId,
      })),
      wlpkLs: values?.wlpkLs,
      authRuleName: values?.rule.name,
      authRuleId: values?.rule.id,
      vehName: values?.veh.name,
      vehId: values?.veh.id,
    };
    if (id) handleUpdate(params);
    else handleAdd(params);
  };
  const handleAdd = (params) => {
    setLoading(true);
    postApi(`${API_PARKING_LOT.PARKING_SUBSCRIBERS}`, params)
      .then(() => {
        setDataSource([]);
        reset(initValues);
        setValue('exUsers', []);
        showSuccess('Thêm mới thành công', {
          text: 'Dữ liệu đã được cập nhật',
        });
        history.replace('/parking/owner');
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
    putApi(`${API_PARKING_LOT.PARKING_SUBSCRIBERS}/${id}`, params)
      .then(() => {
        
        showSuccess('Cập nhật thành công', {
          text: 'Dữ liệu đã được cập nhật',
        });
        history.replace('/parking/owner');
        setDataSource([]);
        reset(initValues);
        //setValue('exUsers', []);
      })
      .catch((err) => {
        showError(err);
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
      dataField: 'userCode',
      caption: 'Mã đinh danh',
      alignment: 'left',
    },
    {
      dataField: 'mobile',
      caption: 'Số điện thoại',
    },
    {
      dataField: 'accessCode',
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
  const actionRender = ({ rowIndex, component }) => (
    <Tooltip title="Xóa">
      <IconButton onClick={() => component.deleteRow(rowIndex)} size="small">
        <ClearIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
  const headerRender = ({ component }) => (
    <Tooltip title="Thêm">
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
          Thêm chủ xe
        </p>{' '}
        <AddIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
  // const searchUser = ({ data }) => {
  //   const onValueChanged = (e, value) => {
  //     data.setValue(value);
  //     data.component.closeEditCell();
  //   };
  //   return (
  //     <VAutocomplete
  //       value={data.value}
  //       fullWidth
  //       // disabled={!watchFields.block}
  //       // disableClearable
  //       noOptionsText="Không có dữ liệu"
  //       getOptionLabel={(option) =>
  //         [option?.fullName, option?.phoneNumber].join(',') || ''
  //       }
  //       firstIndex={1}
  //       renderOption={(option, { selected }) => (
  //         <ListItem>
  //           <ListItemText
  //             primary={option.fullName || ''}
  //             secondary={option.phoneNumber}
  //           />
  //         </ListItem>
  //       )}
  //       loadData={(page, keyword) =>
  //         new Promise((resolve, reject) => {
  //           getApi(`${IAM_API_SRC}/users/autocomplete`, {
  //             limit: 50,
  //             page,
  //             keyword,
  //           })
  //             .then((rs) => {
  //               const newResult = rs.data?.rows;
  //               resolve({
  //                 data: newResult.map((x) => ({
  //                   fullName: x.fullName,
  //                   username: x.username,
  //                   phoneNumber: x.phoneNumber,
  //                   userId: x.userId,
  //                   accessCode: x.accessCode,
  //                   userCode: x.userCode,
  //                   avatarImageId: x.avatarImageId,
  //                 })),
  //                 totalCount: rs.data?.count,
  //               });
  //             })
  //             .catch((err) => reject(getErrorMessage(err)));
  //         })
  //       }
  //       onChange={onValueChanged}
  //       renderInput={(params) => (
  //         <TextField
  //           {...params}
  //           variant="outlined"
  //           placeholder="Chọn người đại diện"
  //         />
  //       )}
  //     />
  //   );
  // };
  const searchUser = ({ data }) => {
    const checkAccess = [];
    if (getValues('exUsers')) {
      getValues('exUsers').map((x) =>
        checkAccess.push(x?.users?.username),
      );
    }
    const onValueChanged = (e, value) => {
      
      data.setValue(value);
      data.component.closeEditCell();
    };
    return (
      <VAutocomplete
        value={data.value}
        fullWidth
        itemSize={55}
        // disabled={!watchFields.block}
        // disableClearable
        noOptionsText="Không có dữ liệu"
        getOptionLabel={(option) =>
          [option?.fullName, option?.phoneNumber].join(',') || ''
        }
        firstIndex={1}
        renderOption={(option, { selected }) => (
          <ListItem>
            <ListItemText
              primary={[option.fullName,option.phoneNumber].join('-') || ''}
              secondary={`Mã định danh ${option?.userCode}`}
            />
          </ListItem>
        )}
        loadData={(page, keyword) =>
          new Promise((resolve, reject) => {
            getApi(`${IAM_API_SRC}/users/autocomplete`, {
              limit: 50,
              page,
              keyword,
            })
              .then((result) => {
                // let new_data = result.data?.rows;
                // new_data.position = new_data?.userGroup[0]?.positionName;
                resolve({
                  data: result.data?.rows.filter(
                    (point) => !checkAccess.includes(point?.username),
                  ),
                  totalCount: result.data?.count,
                });
              })
              .catch((err) => reject(getErrorMessage(err)));
          })
        }
        onChange={onValueChanged}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Chọn chủ thuê bao"
          />
        )}
      />
    );
  };
  const renderImage = ({ data }) => {
    if (data?.users?.avatarImageId) {
      return (
        <A
          onClick={() =>
            setImageUrl(
              buildUrlWithToken(API_FILE.DOWNLOAD_PUBLIC_FILE(data?.users?.avatarImageId)),
            )
          }
          style={{ cursor: 'pointer' }}
        >
          <img
            style={{ maxWidth: 120 }}
            src={API_FILE.DOWNLOAD_PUBLIC_FILE(data?.users?.avatarImageId)}
          />
        </A>
      );
    }
  }
  const exUsersCol = [
    {
      caption: 'STT',
      cellRender: (props) => (<p> {props?.rowIndex + 1} </p>),
      width: '40',
    },
    {
      dataField: 'users',
      caption: 'Tên/Tên tài khoản/Số điện thoại',
      cellRender: ({ value }) => [value?.fullName, value?.username, value?.phoneNumber].join`/`,
      editCellComponent: searchUser,
      requied: true,
    },
    {
      dataField: 'users.userId',
      caption: 'userId',
      visible: false,
      allowEditing: false,
    },
    {
      dataField: 'users.fullName',
      caption: 'Tên',
      visible: false,
      allowEditing: false,
    },
    {
      dataField: 'users.username',
      caption: 'Tài khoản',
      visible: false,
      allowEditing: false,
    },
    {
      dataField: 'users.accessCode',
      caption: 'Mã thẻ người dùng',
      allowEditing: false,
    },
    {
      dataField: 'users.userCode',
      caption: 'Mã định danh',
      allowEditing: false,
    },
    {
      dataField: 'users.avatarImageId',
      caption: 'Ảnh khuôn mặt',
      cellRender: renderImage,
      allowEditing: false,
    },
    {
      cellRender: actionRender,
      headerCellRender: headerRender,
      alignment: 'center',
      width: 140,
    },
  ];
  const openCancel = () => (
    <PopupCancel
      onClickSave={() => history.replace(`/parking/owner`)}
      onClose={() => setOpenPopupCancel(false)}
      textFollowTitle="Lưu ý: Các thông tin đã thay đổi sẽ không được lưu lại"
      title="Bạn chắc chắn muốn rời trang này"
    />
  );
  const onRowRemoving = (e) => {
    
    console.log(e);
  };
  return (
    <>
      <Helmet>
        <title>{id ? 'Chi tiết thuê bao' : 'Thêm thuê bao'}</title>
      </Helmet>
      <>
        {loading && <Loading />}
        {showPopupAdd && addUserPopup()}
        {showPopupImport && ImportPopup()}
        {deleteId && deletePopup()}
        {editId && editPopup()}
        {openPopupCancel && openCancel()}
        {imageUrl && (
          <ModalImage
            onClose={() => {
              setImageUrl(null);
            }}
            imageUrl={buildUrlWithToken(imageUrl)}
          />
        )}
        <PageSearch
          title={id ? 'Chi tiết thuê bao' : 'Thêm thuê bao'}
          showSearch={false}
          // onSearchValueChange={newVal => {
          //   setFilter({ ...filter, keyword: newVal });
          // }}
          showBackButton
          onBack={() => {
            history.push('/parking/owner');
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              setOpenPopupCancel(true);
              //history.replace(`/parking/owner`);
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
          >
            {id ? 'Lưu' : 'Thêm'}
          </Button>
        </PageSearch>
      </>
      <form className={classes.root}>
        <div className={classes.tableContent}>
          <h3> Thông tin thuê bao</h3>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <FormLabel>Mã thuê bao</FormLabel>
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
              <FormControl error={errors.cardCsn} fullWidth>
                <FormLabel required>Mã thẻ</FormLabel>
                <Controller
                  control={control}
                  name="cardCsn"
                  render={(props) => (
                    <TextField
                      maxLength="150"
                      width="100%"
                      placeholder="Nhập mã thẻ"
                      value={props.value}
                      onChange={(e) => {
                        props.onChange(e.target.value.replace(/\s/g, ''));
                      }}
                      variant="outlined"
                      size="small"
                      error={errors.cardCsn}
                      helperText={errors.cardCsn?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl error={errors.service} fullWidth>
                <FormLabel required>Loại vé</FormLabel>
                <Controller
                  control={control}
                  name="service"
                  defaultValue=""
                  render={(props) => (
                    <VAutocomplete
                      value={props.value}
                      fullWidth
                      placeholder="Chọn loại vé"
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
                            .catch((err) => reject(err));
                        })
                      }
                      onChange={(e, value) => {
                        props.onChange(value);
                        new Promise((resolve, reject) => {
                          getApi(`${API_PARKING_LOT.PARKING_SERVICES}/${value?.id}`)
                            .then((result) => {
                              setValue('rule',{id: result?.data.ruleId, name: result?.data.ruleName})
                            })
                            .catch((err) => reject(err));
                        })
                      }}
                    />
                  )}
                />
                {errors.service && (
                  <FormHelperText>{errors.service?.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl error={errors.lpn} fullWidth>
                <FormLabel required>Biển số</FormLabel>
                <Controller
                  control={control}
                  name="lpn"
                  render={(props) => (
                    <TextField
                      maxLength="50"
                      width="100%"
                      placeholder="Nhập biển số"
                      value={props.value}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                      }}
                      variant="outlined"
                      size="small"
                      error={errors.lpn}
                      helperText={errors.lpn?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl error={errors.veh} fullWidth>
                <FormLabel required>Hãng xe</FormLabel>
                <Controller
                  control={control}
                  name="veh"
                  render={(props) => (
                    <VAutocomplete
                      value={props.value}
                      fullWidth
                      noOptionsText="Không có dữ liệu"
                      placeholder="Chọn hãng xe"
                      getOptionLabel={(option) => option?.name || ''}
                      firstIndex={1}
                      getOptionSelected={(option, selected) =>
                        option?.id == selected?.id
                      }
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
                      onChange={(e, value) => {
                        props.onChange(value);
                      }}
                    />
                  )}
                />
                {errors.veh && (
                  <FormHelperText>{errors.veh?.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
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
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl error={errors.state} fullWidth>
                <FormLabel required>Trạng thái</FormLabel>
                <Controller
                  control={control}
                  name="state"
                  render={(props) => (
                    <VAutocomplete
                      value={props.value}
                      fullWidth
                      noOptionsText="Không có dữ liệu"
                      placeholder="Trạng thái"
                      getOptionLabel={(option) => option?.value}
                      firstIndex={1}
                      getOptionSelected={(option, selected) =>
                        option?.id == selected?.id
                      }
                      loadData={() =>
                        new Promise((resolve, reject) => {
                          getApi(
                            `${API_PARKING_LOT.GET_DATA_STATE('subscribers')}`,
                          )
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
                {errors.state && (
                  <FormHelperText>{errors.state?.message}</FormHelperText>
                )}
              </FormControl>
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
                      disabled
                    />
                  )}
                />
                {errors.rule && (
                  <FormHelperText>{errors.rule?.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl error={errors.wlpkLs} fullWidth>
                <FormLabel>Bãi xe được vào</FormLabel>
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
                          placeholder={props.value[0] ? "Chọn bãi xe": "Tất cả"}
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
          </Grid>
        </div>
        <div className={classes.tableContent}>
          <Grid container spacing={1} style={{ margin: '10px 0px 20px 0px' }}>
            <Grid item xs={12} sm={6}>
              <h3>Thông tin chủ xe</h3>
            </Grid>
            {/* <Grid item xs={12} sm={6} align="right">
              <BtnSuccess
                onClick={() => {
                  setShowPopupAdd(true);
                }}
              >
                Thêm chủ xe
              </BtnSuccess>
            </Grid> */}
          </Grid>
          {/* {useMemo(
            () => (
              <TableCustom data={dataSource?.rows || []} columns={columns}  pushClass={'table-grid center-row-grid'}/>
            ),
            [dataSource],
          )} */}
          {/* <TableCustom data={dataSource?.exUsers || []} columns={columns} /> */}
          <Controller
            control={control}
            name="exUsers"
            defaultValue=""
            render={(props) => (
              <TableCustom
                hideTable={false}
                data={props.value}
                onRowRemoving={(e) => {
                  console.log(e);
                }}
                scrolling={{ mode: 'virtual' }}
                editing={{
                  mode: 'cell',
                  allowUpdating: true,
                  useIcons: true,
                  newRowPosition: 'last',
                  texts: {
                    confirmDeleteMessage: `Bạn chắc chắn muốn xóa chủ xe?`,
                  },
                }}
                pagingProps={{ enabled: true, pageSize: 20 }}
                onInitNewRow={(e) => {
                  e.data = {
                    users: null,
                  };
                }}
              >
                {React.Children.toArray(
                  exUsersCol.map((defs) => (
                    <Column {...defs}>
                      {defs?.requied && <ValidationRule type="required" />}
                    </Column>
                  )),
                )}
              </TableCustom>
            )}
          />
        </div>
      </form>
    </>
  );
}
export default AddOwnerManagement;
