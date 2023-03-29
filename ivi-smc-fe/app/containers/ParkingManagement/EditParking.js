/* eslint-disable no-unused-vars */
import {
  Tooltip,
  DialogActions,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
  Button,
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
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from 'components/DatePicker';
import { TextBox } from 'devextreme-react/text-box';
import { BsX } from 'react-icons/bs';
import A from 'components/A';
import { IconButtonHeader } from 'components/CommonComponent';
import IconBtn from 'components/Custom/IconBtn';
import PopupDelete from 'components/Custom/popup/PopupDelete';
import PageSearch from 'components/PageSearch';
import TableCustom from 'components/TableCustom';
import {
  callApiWithConfig,
  getApi,
  METHODS,
  postApi,
  putApi,
} from 'utils/requestUtils';
import { showError, showSuccess } from 'utils/toast-utils';
import { buildUrlWithToken, validationSchema } from 'utils/utils';
import ModalImage from 'components/ModalImage';
import BtnSuccess from 'components/Button/BtnSuccess';
import VAutocomplete from 'components/VAutocomplete';
import MultiSelect from 'components/MultiSelect';
import BtnCancel from 'components/Button/BtnCancel';
import * as yup from 'yup';
import { API_PARKING, API_PARKING_LOT, API_FILE } from '../apiUrl';
import { getErrorMessage } from '../Common/function';
import Loading from '../Loading';
import AddFloor from './creens/AddFloor';
import FilterMap from './creens/Filter';
import reducer from './reducer';
import saga from './saga';
import makeSelectMapIndoorManagement from './selectors';
import { useStyles } from './styled';
const initValues = {
  floors: [],
  name: null,
  state: { id: 'use', value: 'Đang sử dụng' },
  dscr: null,
  type: null,
};

export function EditParkingManagement() {
  const classes = useStyles();
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState(initValues);
  const [detail, setDetail] = useState(null);
  const [dataFloor, setdataFloor] = useState([]);
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [deleteId, setDeleteid] = useState(null);
  const [deleteIdPkLot, setDeleteIdPkLot] = useState(null);
  const [deleteName, setDeleteName] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showPopupAdd, setShowPopupAdd] = useState(false);
  const [showPopupEdit, setShowPopupEdit] = useState(false);
  const [showPopupImport, setShowPopupImport] = useState(false);
  const [reload, setReload] = useState(0);
  const history = useHistory();
  const { id } = useParams();
  const schema = validationSchema({
    name: yup.string().trim().required('Trường này bắt buộc nhập'),
    state: yup.object().shape().nullable().required('Trường này bắt buộc nhập'),
    // block: yup
    //   .object()
    //   .shape()
    //   .nullable(),
    // // .required('Trường này bắt buộc nhập'),
    // floor: yup
    //   .object()
    //   .shape()
    //   .nullable()
    //   .required('Trường này bắt buộc nhập'),
    // map: yup
    //   .mixed()
    //   // .test('type', 'Không đúng định dạng', value => {
    //   //   const SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png'];
    //   //   return SUPPORTED_FORMATS.includes(value?.type);
    //   // })
    //   .required('Trường này bắt buộc nhập'),
    // zipData: yup
    //   .mixed()
    //   // .test('type', 'Không đúng định dạng', value => {
    //   //   const SUPPORTED_FORMATS = ['zip'];
    //   //   return SUPPORTED_FORMATS.includes(value?.type);
    //   // })
    //   .required('Trường này bắt buộc nhập'),
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
    if (id) {
      await getApi(`${API_PARKING_LOT.PARKING_LOT}/${id}`)
        .then((response) => {
          console.log(response.data);
          setDataSource(response.data);
        })
        .catch((err) => {
          showError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
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

  const addFloorPopup = () => (
    <Popup
      visible={showPopupAdd}
      onHiding={() => setShowPopupAdd(!showPopupAdd)}
      dragEnabled
      showTitle
      title="Thêm tầng"
      width="50%"
      height="auto"
      maxHeight="100%"
      className={classes.popup}
    >
      <ScrollView width="100%" height="100%">
        <AddFloor
          onClose={() => setShowPopupAdd(false)}
          dataOnChange={(data) => {
            const dataNew = { ...dataSource };
            dataNew.floors = [...data];
            setDataSource(dataNew);
          }}
          dataSource={dataSource?.floors}
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
      title="Sửa tầng"
      width="50%"
      height="auto"
      maxHeight="100%"
      className={classes.popup}
    >
      <ScrollView width="100%" height="100%">
        <AddFloor
          onClose={() => setEditId(null)}
          dataOnChange={(data) => {
            const dataNew = { ...dataSource };
            dataNew.floors = [...data];
            setDataSource(dataNew);
          }}
          dataSource={dataSource?.floors}
          dataEdit={editId}
        />
      </ScrollView>
    </Popup>
  );

  const deletePopup = () => (
    <PopupDelete
      onClickSave={() => handlerDelete()}
      onClose={() => setDeleteid(null)}
      typeTxt="tầng"
    />
  );

  const handlerDelete = () => {
    const floors = [];

    dataSource.floors.map((x) => {
      x != deleteId ? floors.push(x) : '';
    });
    setDeleteid(null);
    const dataNew = { ...dataSource };
    dataNew.floors = floors;
    setDataSource(dataNew);
  };
  const onSubmit = async (values) => {
    setLoading(true);
    const params = {
      name: values.name,
      state: values?.state,
      dscr: values?.dscr,
      floors: dataSource.floors,
    };
    putApi(`${API_PARKING_LOT.PARKING_LOT}/${id}`, params)
      .then(() => {
        history.replace(`/parking/pklots`);
        showSuccess('Cập nhật thành công', {
          text: 'Dữ liệu đã được cập nhật',
        });
        reset(initValues);
        setValue('floors', []);
        setReload();
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const stt = ({ data }) => <div className="center-content">{stt++}</div>;

  const exportIcon = (icon) => <img src={icon} style={{ maxHeight: 18 }} />;
  const renderActionCell = ({ data, rowIndex }) => (
    <div className="center-content">
      <IconBtn
        icon={exportIcon(IconEdit)}
        onClick={() => {
          setEditId(rowIndex + 1);
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
  const renderState = ({ data }) => <div>{data?.floorState?.value}</div>;
  const renderFloorType = ({ data }) => <div>{data?.floorType?.value}</div>;
  const columns = [
    {
      caption: 'STT',
      alignment: 'center',
      cellRender: (props) => props?.rowIndex + 1,
      width: '5%',
    },
    {
      dataField: 'name',
      caption: 'Tên tầng',
      alignment: 'left',
    },
    {
      dataField: 'floorType',
      caption: 'Loại bãi xe',
      cellRender: renderFloorType,
    },
    {
      caption: 'Số chỗ trống/tổng',
      cellRender: ({ data }) => data?.totalSpot ? `${data?.freeSpot}/${data?.totalSpot}` : '0',
      alignment: 'left',
    },
    {
      dataField: 'freeSpot',
      caption: 'Trống',
      visible: false,
    },
    {
      dataField: 'totalSpot',
      caption: 'Tổng',
      visible: false,
    },
    {
      dataField: 'layoutName',
      caption: 'Layout',
      cellRender: ({ data }) => (
        <A
          onClick={() =>
            setImageUrl(
              buildUrlWithToken(API_FILE.DOWNLOAD_PUBLIC_FILE(data?.layoutUrl)),
            )
          }
          style={{ cursor: 'pointer' }}
        >
          {data.layoutName}
        </A>
      ),
      alignment: 'left',
    },
    {
      dataField: 'layoutUrl',
      caption: 'LayoutId',
      alignment: 'left',
      visible: false,
    },
    {
      dataField: 'layoutUrl',
      caption: 'LayoutId',
      alignment: 'left',
      visible: false,
    },
    {
      dataField: 'dataName',
      caption: 'Dữ liệu',
      cellRender: ({ data }) => (
        <a href={API_FILE.DOWNLOAD_PUBLIC_FILE(data?.dataUrl)}
          target="_blank"
          download
        >
          {data?.dataName}{' '}
        </a>
      ),
    },
    {
      dataField: 'dataUrl',
      caption: 'DataId',
      alignment: 'left',
      visible: false,
    },
    {
      dataField: 'version',
      caption: 'Version',
    },
    {
      dataField: 'floorState',
      caption: 'Trạng thái',
      cellRender: renderState,
    },
    {
      caption: 'Hành động',
      cellRender: renderActionCell,
      alignment: 'center',
      fixed: true,
      fixedPosition: 'right',
    },
  ];
  let timeout = useMemo(() => undefined, []);
  const debounceSearchName = (value) => {
    // eslint-disable-next-line no-unused-expressions
    // clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (!value) return;
      postApi(`${API_PARKING_LOT.PARKING_LOT}/checkname`, { name: value })
        .then((res) => {
          if (res?.existed && value != dataSource?.name) {
            setError('name', { message: 'Dữ liệu đã tồn tại trong hệ thống.' });
          }
        })
        .catch((err) => {
          showError(err);
        });
    }, 500);
  };
  const handlerDeletePkLot = () => {

    setLoading(true);
    axios
      .delete(`${API_PARKING_LOT.PARKING_LOT}/${deleteIdPkLot}`)
      .then(() => {
        setDeleteid(null);
        showSuccess('Cập nhật thành công', {
          text: 'Dữ liệu đã được cập nhật',
        });
        history.push('/parking/pklots');
      })
      .catch(err => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const deletePopupPkLot = () => (
    <PopupDelete
      onClickSave={() => handlerDeletePkLot()}
      onClose={() => setDeleteIdPkLot(null)}
      textFollowTitle={`Bạn chắc chắn muốn xóa ${deleteName}?`}
      title="Xác nhận xóa"
    />
  );
  return (
    <>
      <>
        {loading && <Loading />}
        {showPopupAdd && addFloorPopup()}
        {deleteId && deletePopup()}
        {deleteIdPkLot && deletePopupPkLot()}
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
          title={dataSource?.name}
          showSearch={false}
          // onSearchValueChange={newVal => {
          //   setFilter({ ...filter, keyword: newVal });
          // }}
          showBackButton
          onBack={() => {
            history.push('/parking/pklots');
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              setDeleteIdPkLot(dataSource?.id);
              setDeleteName(dataSource?.name);
            }}
          >
            Xóa
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={Boolean(errors?.name)}
            onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </Button>
        </PageSearch>
      </>

      <div className={classes.tableContent}>
        <form className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <FormControl error={errors.name} fullWidth>
                <FormLabel required> Tên bãi xe</FormLabel>
                <Controller
                  control={control}
                  name="name"
                  render={(props) => (
                    <TextField
                      autoComplete="off"
                      maxLength="50"
                      fullWidth
                      placeholder="Nhập tên bãi xe"
                      value={props.value}
                      onChange={(e) => {
                        clearErrors('name');
                        props.onChange(e.target.value);
                        debounceSearchName(e.target.value);
                      }}
                      error={errors.name}
                      helperText={errors.name?.message}
                      variant="outlined"
                      size="small"
                      inputProps={{ maxLength: 140 }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl error={errors.state} fullWidth>
                <FormLabel required> Trạng thái</FormLabel>
                <Controller
                  control={control}
                  name="state"
                  render={(props) => (
                    <VAutocomplete
                      value={props.value}
                      fullWidth
                      placeholder="Trạng thái"
                      // disabled={!watchFields.block}
                      // disableClearable
                      noOptionsText="Không có dữ liệu"
                      getOptionLabel={(option) => option?.value}
                      firstIndex={1}
                      getOptionSelected={(option, selected) =>
                        option?.id == selected?.id
                      }
                      loadData={() =>
                        new Promise((resolve, reject) => {
                          getApi(`${API_PARKING_LOT.GET_DATA_STATE('pklots')}`)
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
              <FormControl error={errors.dscr} fullWidth>
                <FormLabel> Mô tả</FormLabel>
                <Controller
                  control={control}
                  name="dscr"
                  render={(props) => (
                    <TextField
                      autoComplete="off"
                      maxLength="50"
                      fullWidth
                      placeholder="Nhập mô tả"
                      value={props.value}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                      }}
                      error={errors.dscr}
                      helperText={errors.dscr?.message}
                      variant="outlined"
                      size="small"
                      inputProps={{ maxLength: 140 }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </div>

      <div className={classes.tableFloor}>
        <Grid container spacing={1} style={{ margin: '10px 0px 20px 0px' }}>
          <Grid item xs={12} sm={6}>
            <h3>Danh sách tầng</h3>
          </Grid>
          <Grid item xs={12} sm={6} align="right">
            <BtnSuccess
              onClick={() => {
                setShowPopupAdd(true);
              }}
            >
              Thêm tầng
            </BtnSuccess>
          </Grid>
          <Grid item xs={12}>
            <TableCustom
              data={dataSource.floors || []}
              columns={columns}
              style={{
                maxHeight: 'calc(100vh - 215px)',
                width: '100%',
              }}
            />
          </Grid>
        </Grid>
        {/* {useMemo(
          () => (
            <TableCustom data={dataSource?.rows || []} columns={columns}  pushClass={'table-grid center-row-grid'}/>
          ),
          [dataSource],
        )} */}
        
      </div>
    </>
  );
}
export default EditParkingManagement;
