import {
  Badge,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  makeStyles,
  OutlinedInput,
  Paper,
  Tooltip,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import clsx from 'clsx';
import { IconButtonSquare } from 'components/CommonComponent';
import CustomTable from 'components/Custom/table/CustomTable';
import PageHeader from 'components/PageHeader';
import RenderDetails from 'components/RenderDetails';
import ToggleSwitch from 'components/TextInput/ToggleSwitch';
import {
  ACCESS_CONTROL_API_SRC,
  API_ACCESS_CONTROL,
  API_DETAIL_USER_IDENTITY,
  GUEST_REGISTRATION,
  IAM_API_SRC,
  API_FILE,
} from 'containers/apiUrl';
import Loading from 'containers/Loading';
import { renderTime } from 'containers/ManageGuests/modules';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import FilterICon from 'images/icon-button/filter.svg';
import fingerprintImg from 'images/vantay.png';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import gui from 'utils/gui';
import { callApi, getApi } from 'utils/requestUtils';
import { showError, showSuccess } from 'utils/toast-utils';
import utils, { buildUrlWithToken, convertDatetime } from 'utils/utils';
import * as yup from 'yup';
import DialogDelete from './dialogs/DialogDelete';
import PopupFilter from './PopupFilter';
const listBtn = ['GUEST_REGISTRATION', 'HISTORY_IN_OUT', 'IDENTITY'];
const now = new Date();
const GENDER_MAP = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
  OTHER: 'Khác',
};
export default function Details({ match, history }) {
  const classes = useStyles();
  const intl = useIntl();
  const id = match?.params?.id || '';
  const [page, setPage] = useState(listBtn[0]);
  const [data, setData] = useState('');
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(0);
  const showLoading = (v) => {
    setLoading((prev) => {
      if (v) {
        return prev + 1;
      }
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  };
  const defaultNew = {
    fullName: '',
    phoneNumber: '',
    identityNumber: '',
    email: '',
    address: '',
  };
  const validationSchema = yup.object().shape({
    fullName: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    phoneNumber: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .matches(
        /^(\\+[0-9][-. ]{0,1})?(([0-9]+)[-. ]{0,1})?([0-9]+[-. ]{0,1}[0-9])$/g,
        'Số điện thoại không hợp lệ',
      ),
    email: yup.string().email(intl.formatMessage({ id: 'app.invalid.email' })),
    identityNumber: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .test('check exist', 'Giấy tờ đã tồn tại', async function isExist(value) {
        const res = await getApi(`${IAM_API_SRC}/guests`, {
          limit: 1,
          page: 1,
          identityNumber: value,
        });
        if (
          res.data.count > 0 &&
          res.data.rows.filter((g) => g.id != id).length > 0
        ) {
          return false;
        }
        return true;
      }),
  });
  const formik = useFormik({
    initialValues: defaultNew,
    validationSchema,
    validateOnChange: false,
    onSubmit: (values) => onSubmit(values),
  });
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = () => {
    showLoading(true);
    callApi(`${IAM_API_SRC}/guests/${id}`, 'GET')
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => showLoading(false));
  };

  const getTabTitle = (pageName) => {
    switch (pageName) {
      case 'GUEST_REGISTRATION':
        return 'Đăng ký khách';
      case 'HISTORY_IN_OUT':
        return 'Lịch sử vào ra';
      case 'IDENTITY':
        return 'Định danh';
      default:
        return '';
    }
  };
  const goBack = () => {
    if (history.length > 2) {
      history.goBack();
    } else {
      history.push('/guests');
    }
  };
  const onSubmit = (values) => {
    const payload = {
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      identityNumber: values.identityNumber,
      email: values.email,
      address: values.address,
      isUpdateIdentity: values.identityNumber != data.identityNumber,
    };
    showLoading(true);
    callApi(`${IAM_API_SRC}/guests/${id}/update`, 'PUT', payload)
      .then((res) => {
        showSuccess('Cập nhật thông tin khách thành công');
        setData(res.data);
        setEdit(false);
        // setChange(change + 1);
      })
      .catch((err) => showError(err))
      .finally(() => showLoading(false));
  };
  return (
    <div
      style={{
        marginTop: 16,
        marginBottom: 16,
      }}
    >
      <Helmet>
        <title>Chi tiết khách</title>
        <meta name="description" content="Chi tiết khách" />
      </Helmet>
      {Boolean(loading) && <Loading />}
      {data && (
        <Paper style={{ padding: '0 24px 24px 24px', marginTop: '16px' }}>
          <PageHeader title="Chi tiết khách" showBackButton onBack={goBack}>
            {edit ? (
              <>
                <Button
                  variant="contained"
                  color="default"
                  onClick={() => {
                    setEdit(false);
                  }}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={formik.handleSubmit}
                >
                  Lưu
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setEdit(true);
                  formik.resetForm({ values: data });
                }}
              >
                Cập nhật
              </Button>
            )}
          </PageHeader>
          <Grid container spacing={3}>
            <Grid item sm={12} md={6} lg={4}>
              <FormControl
                fullWidth
                size="small"
                margin="dense"
                error={
                  edit &&
                  formik.touched.fullName &&
                  Boolean(formik.errors.fullName)
                }
              >
                <FormLabel required={edit}>Tên khách</FormLabel>
                {edit ? (
                  <OutlinedInput
                    name="fullName"
                    value={formik.values.fullName}
                    inputProps={{ maxLength: 50 }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                ) : (
                  <OutlinedInput value={data?.fullName} readOnly />
                )}
                <FormHelperText>
                  {edit && formik.touched.fullName && formik.errors.fullName}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item sm={12} md={6} lg={4}>
              <FormControl
                fullWidth
                size="small"
                margin="dense"
                error={
                  edit &&
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
              >
                <FormLabel required={edit}>Số điện thoại</FormLabel>
                {edit ? (
                  <OutlinedInput
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    inputProps={{ maxLength: 50 }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                ) : (
                  <OutlinedInput readOnly value={data?.phoneNumber} />
                )}
                <FormHelperText>
                  {edit &&
                    formik.touched.phoneNumber &&
                    formik.errors.phoneNumber}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item sm={12} md={6} lg={4}>
              <FormControl
                fullWidth
                size="small"
                margin="dense"
                error={
                  edit &&
                  formik.touched.identityNumber &&
                  Boolean(formik.errors.identityNumber)
                }
              >
                <FormLabel required={edit}>Giấy tờ</FormLabel>
                {edit ? (
                  <OutlinedInput
                    name="identityNumber"
                    value={formik.values.identityNumber}
                    inputProps={{ maxLength: 50 }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                ) : (
                  <OutlinedInput readOnly value={data?.identityNumber} />
                )}
                <FormHelperText>
                  {edit &&
                    formik.touched.identityNumber &&
                    formik.errors.identityNumber}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item sm={12} md={6} lg={4}>
              <FormControl fullWidth size="small" margin="dense">
                <FormLabel>Email</FormLabel>
                {edit ? (
                  <OutlinedInput
                    value={formik.values.email}
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      edit &&
                      formik.touched.email &&
                      Boolean(formik.errors.email)
                    }
                  />
                ) : (
                  <OutlinedInput value={data?.email} readOnly />
                )}
                <FormHelperText>
                  {edit && formik.touched.email && formik.errors.email}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item sm={12} md={6} lg={4}>
              <FormControl fullWidth size="small" margin="dense">
                <FormLabel>Địa chỉ/Công ty</FormLabel>
                {edit ? (
                  <OutlinedInput
                    value={formik.values?.address || ''}
                    name="address"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      edit &&
                      formik.touched.address &&
                      Boolean(formik.errors.address)
                    }
                  />
                ) : (
                  <OutlinedInput value={data?.address} readOnly />
                )}
                <FormHelperText>
                  {edit && formik.touched.address && formik.errors.address}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item sm={12} md={6} lg={4}>
              <FormControl fullWidth size="small" margin="dense">
                <FormLabel>Giới tính</FormLabel>
                <OutlinedInput
                  value={GENDER_MAP[data?.gender || 'OTHER']}
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item sm={12} md={6} lg={4}>
              <FormControl fullWidth size="small" margin="dense">
                <FormLabel>Mã định danh</FormLabel>
                <OutlinedInput value={data?.accessCode} disabled />
              </FormControl>
            </Grid>
            <Grid item sm={12} md={6} lg={4}>
              <FormControl fullWidth size="small" margin="dense">
                <FormLabel>Thời gian cập nhật</FormLabel>
                <OutlinedInput
                  value={convertDatetime(data?.updatedAt)}
                  disabled
                />
              </FormControl>
            </Grid>
            {data.documentFileId && (
              <Grid item sm={12} md={6} lg={4}>
                <div style={{ margin: '8px 4px' }}>
                  <FormLabel>Ảnh giấy tờ</FormLabel>
                  <img
                    alt="document-file"
                    src={API_FILE.DOWNLOAD_PUBLIC_FILE(data.documentFileId)}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}
      <div className={classes.tabWrapper}>
        {listBtn.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setPage(item)}
            className={
              item === page
                ? clsx(classes.tab, classes.tab_active)
                : classes.tab
            }
          >
            {getTabTitle(item)}
          </button>
        ))}
      </div>
      <div>
        <GuestRegistration id={id} page={page} showLoading={showLoading} />
        <HistoryInOut id={id} page={page} showLoading={showLoading} />
        <Identity id={id} page={page} showLoading={showLoading} />
      </div>
    </div>
  );
}

const initParams = {
  limit: 25,
  page: 1,
  keyword: '',
  repeatType: '',
};

const GuestRegistration = ({ page, id, showLoading }) => {
  const [data, setData] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [params, setParams] = useState(initParams);

  useEffect(() => {
    fetchData();
  }, [params]);

  const fetchData = async () => {
    showLoading(true);
    try {
      const query = utils.queryString({
        ...params,
        startDate:
          (params.startDate && moment(params.startDate).format('YYYY-MM-DD')) ||
          null,
        endDate:
          (params.endDate && moment(params.endDate).format('YYYY-MM-DD')) ||
          null,
        guestIds: [id],
      });
      const res = await callApi(
        `${GUEST_REGISTRATION}/registrations?${query}`,
        'GET',
      );
      setData(res.data);
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      showLoading(false);
    }
  };

  const onSearch = (e) => {
    setParams({ ...params, keyword: e, page: 1 });
  };

  const onChangePage = (e) => {
    if (!e) return;
    if (e !== params.page) {
      setParams({ ...params, page: e });
    }
  };

  const onChangeLimit = (e) => {
    if (!e || !e.target) return;
    if (e.target.value !== params.limit) {
      setParams({ ...params, page: 1, limit: e.target.value });
    }
  };

  const handleClickFilter = () => {
    setOpenFilter(true);
  };
  const repeatTypeRender = ({ value }) => {
    switch (value) {
      case 'WEEKLY':
        return 'Lặp lại';
      case 'ONCE':
      default:
        return 'Một lần';
    }
  };
  return (
    <div
      style={{
        display: page === 'GUEST_REGISTRATION' ? 'block' : 'none',
        backgroundColor: '#FFF',
        borderRadius: 12,
      }}
    >
      <div
        style={{
          padding: '0 24px 16px 24px',
        }}
      >
        <PageHeader
          title="Đăng ký khách"
          // disabled={loading}
          showSearch
          showPager
          placeholderSearch="Tìm kiếm người đăng ký, đơn vị đăng ký"
          pageIndex={params.page || 0}
          totalCount={data?.count || 0}
          rowsPerPage={params.limit || 0}
          onSearchValueChange={onSearch}
          handleChangePageIndex={onChangePage}
          handlePageSize={onChangeLimit}
          showFilter={
            !!(params.startDate || params.endDate || params.repeatType)
          }
          // idTextBox="id-search-guest"
          onBack={() => {
            // document.getElementById('id-search-guest').value = '';
            setParams({
              ...initParams,
              ...{
                page: 1,
                limit: params.limit,
                keyword: params.keyword,
              },
            });
          }}
        >
          <Tooltip title="Lọc">
            <Badge
              color="primary"
              variant="dot"
              invisible={
                !(params.startDate || params.endDate || params.repeatType)
              }
            >
              <IconButtonSquare onClick={handleClickFilter}>
                <img
                  src={FilterICon}
                  alt=""
                  style={{ width: 20, height: 20 }}
                />
              </IconButtonSquare>
            </Badge>
          </Tooltip>
        </PageHeader>
      </div>

      <CustomTable
        data={data?.rows || []}
        disabledSelect
        height={gui.screenHeight / 2.2}
        row={[
          {
            caption: 'STT',
            cellRender: (item) =>
              (params.page - 1) * params.limit + (item.rowIndex + 1),
            alignment: 'center',
            width: 50,
          },
          {
            dataField: 'code',
            caption: 'Mã đơn',
            minWidth: 110,
          },
          {
            dataField: 'createdUsername',
            caption: 'Người đăng ký',
            minWidth: 110,
          },
          {
            caption: 'Khu vực làm việc',
            dataField: 'groupName',
            minWidth: 140,
          },
          {
            caption: 'Đơn vị đến',
            dataField: 'areaName',
            minWidth: 140,
          },
          {
            dataField: 'startDate',
            caption: 'Ngày bắt đầu',
          },
          {
            dataField: 'endDate',
            caption: 'Ngày kết thúc',
          },
          {
            cellRender: ({ data }) =>
              renderTime(data.startTimeInMinute, data.endTimeInMinute),
            caption: 'Thời gian',
          },
          {
            dataField: 'repeatType',
            caption: 'Loại yêu cầu',
            cellRender: repeatTypeRender,
          },
        ]}
      />
      {openFilter && (
        <PopupFilter
          onClickSave={(v) => setParams({ ...v, page: 1 })}
          onClose={(v) => setOpenFilter(v)}
          searchValue={params}
        />
      )}
    </div>
  );
};

const Identity = ({ page, id, showLoading }) => {
  const [isOpenPopupDeleteFinger, setIsOpenPopupDeleteFinger] = useState(false);
  const [isOpenPopupDeleteFace, setIsOpenPopupDeleteFace] = useState(false);
  const [identityData, setIdentityData] = useState('');

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = (v) => {
    axios
      .get(API_DETAIL_USER_IDENTITY.LIST(v))
      .then((res) => setIdentityData(res.data))
      .catch((err) => {
        throw err;
      });
  };

  const onClickSwitch = async (v) => {
    showLoading(true);
    try {
      await callApi(`${ACCESS_CONTROL_API_SRC}/users/${id}`, 'PUT', v);
      const res = await axios.get(API_DETAIL_USER_IDENTITY.LIST(id));
      setIdentityData(res.data);
      utils.showToast('Thành công');
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      showLoading(false);
    }
  };

  const faceDetails = () => (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontWeight: 500, fontSize: 20 }}>Khuôn mặt</span>
        {identityData?.faces?.length > 0 && (
          <ToggleSwitch
            onChange={(v) => {
              const dto = {
                availableAt: now.getTime(),
                enableCardIdentification: identityData.enableCardIdentification,
                enableFaceIdentification: v,
                enableFingerprintIdentification:
                  identityData.enableFingerprintIdentification,
              };
              onClickSwitch(dto);
            }}
            checked={identityData?.enableFaceIdentification}
          />
        )}
      </div>
      <div className="ct-flex-row">
        <div style={{ width: '80%' }}>
          <RenderDetails
            nopaper
            data={[
              {
                field: 'Thời gian cập nhật',
                width: 6,
                content: identityData?.faces?.length
                  ? format(
                      new Date(identityData?.faces[0]?.createdAt),
                      'HH:mm dd/MM/yyyy',
                    )
                  : 'Chưa định danh',
              },
              {
                field: 'Trạng thái',
                width: 6,
                content: identityData?.faces?.length
                  ? 'Hoạt động'
                  : 'Chưa định danh',
              },
            ]}
          />
        </div>
        {identityData?.faces?.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <button
              type="button"
              style={styles.btnTxt}
              onClick={async () => {
                setIsOpenPopupDeleteFace(true);
              }}
            >
              Xoá khuôn mặt
            </button>
          </div>
        )}
      </div>
      <div>
        {(identityData?.faces?.length && (
          <>
            <h4 style={{ fontSize: '16px' }}>Hình ảnh khuôn mặt</h4>
            <div style={{ display: 'flex' }}>
              <ImgCards data={identityData?.faces} imgTitle="Ảnh" />
            </div>
          </>
        )) ||
          null}
      </div>
    </div>
  );

  const fingerprintDetails = (
    <div style={{ marginTop: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontWeight: 500, fontSize: 20 }}>Vân tay</span>
        {identityData?.fingerprints?.length > 0 && (
          <ToggleSwitch
            onChange={(v) => {
              const dto = {
                availableAt: now.getTime(),
                enableCardIdentification: identityData.enableCardIdentification,
                enableFaceIdentification: identityData.enableFaceIdentification,
                enableFingerprintIdentification: v,
              };
              onClickSwitch(dto);
            }}
            checked={identityData?.enableFingerprintIdentification}
          />
        )}
      </div>
      <div className="ct-flex-row">
        <div style={{ width: '80%' }}>
          <RenderDetails
            nopaper
            data={[
              {
                field: 'Thời gian cập nhật',
                width: 6,
                content: identityData?.fingerprints?.length
                  ? format(
                      new Date(identityData?.fingerprints[0]?.createdAt),
                      'HH:mm dd/MM/yyyy',
                    )
                  : 'Chưa định danh',
              },
              {
                field: 'Trạng thái',
                width: 6,
                content: identityData?.fingerprints?.length
                  ? 'Hoạt động'
                  : 'Chưa định danh',
              },
            ]}
          />
        </div>
        {identityData?.fingerprints?.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <button
              type="button"
              style={styles.btnTxt}
              onClick={async () => {
                setIsOpenPopupDeleteFinger(true);
              }}
            >
              Xoá vân tay
            </button>
          </div>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          height: '300px',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <img
          src={fingerprintImg}
          alt="Ảnh vân tay"
          style={{
            width: '200px',
            height: '200px',
          }}
        />

        <span style={{ marginTop: '10px' }}>
          {identityData?.fingerprints?.length
            ? `Đã có ${identityData?.fingerprints?.length} vân tay được định danh`
            : 'Chưa có định danh vân tay cho người này'}
        </span>
      </div>
    </div>
  );

  const cardDetails = (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontWeight: 500, fontSize: 20 }}>Thẻ</span>
        {identityData?.cards?.length > 0 && (
          <ToggleSwitch
            onChange={(v) => {
              const dto = {
                availableAt: now.getTime(),
                enableCardIdentification: v,
                enableFaceIdentification: identityData.enableFaceIdentification,
                enableFingerprintIdentification:
                  identityData.enableFingerprintIdentification,
              };
              onClickSwitch(dto);
            }}
            checked={identityData?.enableCardIdentification}
          />
        )}
      </div>
      <CustomTable
        data={identityData?.cardHistories || []}
        disabledSelect
        enabledPaging
        height={333}
        row={[
          {
            caption: 'STT',
            cellRender: (item) =>
              item.rowIndex +
              item.component.pageIndex() * item.component.pageSize() +
              1,
            alignment: 'center',
            // width: 'auto',
          },
          {
            dataField: 'cardNumber',
            caption: 'Mã thẻ',
          },
          {
            dataField: 'cardType',
            caption: 'Loại thẻ',
            cellRender: () => 'MIFARE',
          },
          {
            dataField: 'updatedAt',
            caption: 'Thời gian',
            dataType: 'datetime',
            format: 'HH:mm:ss dd/MM/yyyy',
          },
          {
            dataField: 'cardStatus',
            caption: 'Trạng thái',
            cellRender: (v) =>
              v.data.cardStatus === 'NEW'
                ? 'Chưa cấp'
                : v.data.cardStatus === 'ACTIVE'
                ? 'Đã cấp còn hiệu lực'
                : 'Đã cấp hết hiệu lực',
          },
        ]}
      />
    </div>
  );

  return (
    <div
      style={{
        display: page === 'IDENTITY' ? 'block' : 'none',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 24,
      }}
    >
      {faceDetails()}
      {fingerprintDetails}
      {cardDetails}
      <DialogDelete
        open={isOpenPopupDeleteFinger}
        handleClose={() => setIsOpenPopupDeleteFinger(false)}
        handleSuccess={async () => {
          try {
            await callApi(
              `${ACCESS_CONTROL_API_SRC}/user-fingerprints/user/${id}`,
              'DELETE',
            );
            fetchData(id);
            setIsOpenPopupDeleteFinger(false);
            utils.showToast('Thành công');
          } catch (error) {
            utils.showToastErrorCallApi(error);
          }
        }}
        title="Xóa vân tay"
        content="Nếu xoá vân tay, sẽ không thể tiếp tục định danh tại các thiết bị Access Control"
      />
      <DialogDelete
        open={isOpenPopupDeleteFace}
        handleClose={() => setIsOpenPopupDeleteFace(false)}
        handleSuccess={async () => {
          try {
            await callApi(
              `${ACCESS_CONTROL_API_SRC}/user-faces/${id}`,
              'DELETE',
            );
            fetchData(id);
            setIsOpenPopupDeleteFace(false);
            utils.showToast('Thành công');
          } catch (error) {
            utils.showToastErrorCallApi(error);
          }
        }}
        title="Xóa khuôn mặt"
        content="Nếu xoá khuôn mặt, sẽ không thể tiếp tục định danh tại các thiết bị Access Control"
      />
    </div>
  );
};

const HistoryInOut = ({ page, id, showLoading }) => {
  const [data, setData] = useState([]);
  const [params, setParams] = useState(initParams);

  useEffect(() => {
    fetchData();
  }, [params]);

  const fetchData = async () => {
    showLoading(true);
    try {
      const query = utils.queryString({
        ...params,
        userIds: [id],
      });
      const res = await callApi(
        `${API_ACCESS_CONTROL.LIST_EVENT}?${query}`,
        'GET',
      );
      setData(res.data);
    } catch (error) {
      // utils.showToastErrorCallApi(error);
    } finally {
      showLoading(false);
    }
  };

  const onChangePage = (e) => {
    if (!e) return;
    if (e !== params.page) {
      setParams({ ...params, page: e });
    }
  };

  const onChangeLimit = (e) => {
    if (!e || !e.target) return;
    if (e.target.value !== params.limit) {
      setParams({ ...params, page: initParams.page, limit: e.target.value });
    }
  };

  return (
    <div
      style={{
        display: page === 'HISTORY_IN_OUT' ? 'block' : 'none',
        backgroundColor: '#FFF',
        borderRadius: 12,
      }}
    >
      <div
        style={{
          padding: '0 24px 16px 24px',
        }}
      >
        <PageHeader
          title="Lịch sử ra/vào"
          showSearch={false}
          showPager
          pageIndex={params.page || 0}
          totalCount={data?.count || 0}
          rowsPerPage={params.limit || 0}
          handleChangePageIndex={onChangePage}
          handlePageSize={onChangeLimit}
        />
      </div>

      <CustomTable
        data={data?.rows || []}
        disabledSelect
        height={gui.screenHeight / 2.2}
        row={[
          {
            caption: 'STT',
            cellRender: (item) =>
              (params.page - 1) * params.limit + (item.rowIndex + 1),
            alignment: 'center',
            width: 'auto',
          },
          {
            dataField: 'eventAt',
            caption: 'Thời gian',
            dataType: 'datetime',
            format: 'HH:mm:ss dd-MM-yyyy',
          },
          {
            dataField: 'doorName',
            caption: 'Cửa',
          },
          {
            dataField: 'deviceId',
            caption: 'ID thiết bị',
          },
          {
            dataField: 'deviceName',
            caption: 'Thiết bị',
          },
          {
            dataField: 'eventName',
            caption: 'Sự kiện',
          },
        ]}
      />
    </div>
  );
};

const ImgCards = ({ data, imgTitle }) => (
  <div style={{ display: 'flex', gap: '34px' }}>
    {React.Children.toArray(
      data.map((item, index) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Img
            src={
              item
                ? item.imageFileUrl
                  ? buildUrlWithToken(item.imageFileUrl)
                  : `data:image/jpeg;base64,${item.imageBase64}`
                : null
            }
          />
          <p style={{ margin: 0, marginTop: '5px', whiteSpace: 'nowrap' }}>
            {imgTitle} {index + 1}
          </p>
        </div>
      )),
    )}
  </div>
);

const Img = React.memo((props) => {
  const [loaded, setLoaded] = useState(false);
  const { src } = props;
  return (
    <>
      <div
        style={
          loaded
            ? { display: 'none' }
            : {
                width: '100px',
                height: '100px',
                display: 'grid',
                backgroundColor: '#C4C4C4',
                placeItems: 'center',
              }
        }
      >
        <CircularProgress size={20} />
      </div>
      <img
        {...props}
        src={src}
        alt="Ảnh"
        onLoad={() => setLoaded(true)}
        style={
          loaded ? { width: '100px', height: '100px' } : { display: 'none' }
        }
      />
    </>
  );
});

const useStyles = makeStyles({
  root: {
    '& .MuiDialogActions-root': {
      padding: '32px',
    },
  },
  tab: {
    outline: 0,
    border: 0,
    cursor: 'pointer',
    fontSize: 14,
    marginRight: '20px',
    color: 'rgba(60, 60, 67, 0.6)',
    background: 'none',
    fontWeight: 500,
  },
  tab_active: {
    color: ' #1C1D21',
    backgroundColor: '#FFF',
    padding: '11px 24px 11px 24px',
    borderRadius: 8,
  },
  tabWrapper: {
    margin: '19px 32px',
  },
});

const styles = {
  btnTxt: {
    padding: '12px 16px',
    border: 'none',
    outline: 'none',
    lineHeight: '16px',
    boxSizing: 'border-box',
    borderRadius: '8px',
    cursor: 'pointer',
    minWidth: '104px',
    marginLeft: '32px',
    color: '#fff',
    boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
    backgroundColor: '#00554A',
    marginTop: 32,
    marginBottom: 16,
  },
};
