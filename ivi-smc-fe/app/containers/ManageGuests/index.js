import {
  Badge,
  Box,
  Grid,
  IconButton,
  Popover,
  Tooltip,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import ReplayIcon from '@material-ui/icons/Replay';
import axios from 'axios';
import { IconButtonSquare } from 'components/CommonComponent';
import Dialog from 'components/Dialog';
import PopoverComponent from 'components/Filter/popover';
import Label from 'components/Label';
import PageHeader from 'components/PageHeader';
import SMCTab from 'components/SMCTab';
import TableCustom from 'components/TableCustom';
import Loading from 'containers/Loading';
import AddIcon from 'images/icon-button/add.svg';
import CustomIcon from 'images/icon-button/custom.svg';
import FilterICon from 'images/icon-button/filter.svg';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { time2Min } from 'utils/functions';
import { showError, showSuccess } from 'utils/toast-utils';
import { showAlertConfirm } from 'utils/utils';
import { GUEST_REGISTRATION } from '../apiUrl';
import DialogCustom from './dialogs/DialogCustom';
import DialogFilter from './dialogs/DialogFilter';
import messages from './messages';
import { formatDate, renderTime, REPEAT_TYPE_MAP, STATUS_MAP } from './modules';
const initParams = {
  limit: 25,
  page: 1,
  keyword: '',
};
const initCustom = {
  code: {
    label: 'Mã đơn',
    display: true,
    require: true,
  },
  startDate: {
    label: 'Ngày hẹn',
    display: true,
    require: true,
  },
  endTimeInMinute: {
    label: 'Thời gian',
    display: true,
    require: true,
  },
  address: {
    label: 'Khu vực làm việc',
    display: true,
    require: false,
  },
  area: {
    label: 'Đơn vị đến',
    display: true,
    require: false,
  },
  register: {
    label: 'Người đăng ký',
    display: false,
    require: false,
  },
  guestLength: {
    label: 'Số khách',
    display: true,
    require: false,
  },
  vehicles: {
    label: 'Số lượng xe',
    display: false,
    require: false,
  },
  repeatType: {
    label: 'Loại yêu cầu',
    display: true,
    require: true,
  },
  guestName: {
    label: 'Tên khách',
    display: false,
    require: false,
  },
  identityNumber: {
    label: 'Giấy tờ',
    display: true,
    require: false,
  },
  phoneNumber: {
    label: 'Số điện thoại',
    display: false,
    require: false,
  },
  status: {
    label: 'Trạng thái',
    display: true,
    require: true,
  },
};
const key = 'ManageGuests';
export function ManageGuests({
  // userAuthority,
  history,
  location,
}) {
  const intl = useIntl();
  //* * to do */
  // const resourceCode = 'guest-registration/registration';
  // const scopes = checkAuthority(
  //   ['get', 'update', 'delete', 'create'],
  //   resourceCode,
  //   userAuthority,
  // );
  const scopes = {
    get: true,
    update: true,
    delete: true,
    create: true,
    patch: true,
  };

  const ParentPopupState = createContext(null);

  //* * end to do *//
  const state = location?.state || {};
  const [data, setData] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [openCustom, setOpenCustom] = useState(false);
  const [custom, setCustom] = useState(initCustom);
  const [params, setParams] = useState({
    ...initParams,
    ...(state[key] || {}),
  });
  const [loading, setLoading] = useState(false);
  const isFilter = (filterOp) => {
    const { keyword, limit, page, ...filter } = filterOp;
    return Object.values(filter).filter((v) => !!v && String(v).length).length;
  };
  const [showFilter, setShowFilter] = useState(isFilter(params));
  useEffect(() => {
    if (Object.keys(state).length) {
      history.replace({ ...location?.state, [key]: undefined });
    }
  }, []);
  // const [addIdentification, setAddIdentification] = useState(false);
  // const [verifyIdentifi, setVerifyIdentifi] = useState(false);
  // const containerRef = useRef(null);
  // control table
  useEffect(() => {
    setLoading(true);
    const { keyword, limit, page, ...filter } = params;
    axios
      .get(`${GUEST_REGISTRATION}/registrations`, {
        params: {
          keyword,
          limit,
          page,
          createdUserIds: (filter?.createdBy || []).map((item) => item.userId),
          startDate: filter?.startDate
            ? formatDate(filter?.startDate)
            : undefined,
          endDate: filter?.startDate
            ? formatDate(filter?.startDate)
            : undefined,
          startTimeInMinute: time2Min(filter?.startTime) || undefined,
          endTimeInMinute: time2Min(filter?.endTime) || undefined,
          statuses: (filter?.status || []).map((item) => item.key),
          repeatType: filter?.repeatType?.key,
          createdAt: filter?.createdAt
            ? formatDate(filter?.createdAt)
            : undefined,
          // companyId: (filter?.companies || []).map((i) => i.orgUnitId),
        },
      })
      .then((response) => {
        const res = response.data;
        setData(res);
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const renderButtons = (status, id) => {
    const detailBtn = (
      <Tooltip title="Chi tiết">
        <IconButton
          size="small"
          component={Link}
          to={{
            pathname: `/guest-registrations/details/${id}/list`,
            state: {
              [key]: params,
            },
          }}
        >
          <InfoIcon />
        </IconButton>
      </Tooltip>
    );
    if (['WAITING', 'APPROVED'].includes(status))
      return (
        <>
          <Tooltip title="Hủy đăng ký">
            <IconButton
              onClick={() => handleCancelBtnClick(id)}
              size="small"
              disabled={!scopes.delete}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
          {detailBtn}
        </>
      );
    if (['COMPLETE', 'UNSUCCESSFUL', 'CANCELLED', 'REMOVE'].includes(status))
      return (
        <>
          <Tooltip title="Đăng ký lại">
            <IconButton
              size="small"
              onClick={() => reRegister(id)}
              disabled={!scopes.create}
            >
              <ReplayIcon />
            </IconButton>
          </Tooltip>
          {detailBtn}
        </>
      );
    return null;
  };

  const handleClickAdd = () => {
    history.push({
      pathname: '/guest-registrations/add-guest',
      state: {
        [key]: params,
      },
    });
  };

  const handleClickFilter = () => {
    setOpenFilter(true);
  };
  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  const handleClickCustom = () => {
    setOpenCustom(true);
  };
  const handleCloseCustom = () => {
    setOpenCustom(false);
  };
  const onSuccessFilter = (values) => {
    const newParams = { ...params, ...values, page: 1 };
    setParams(newParams);
    setOpenFilter(false);
    setShowFilter(isFilter(newParams));
  };
  const onSuccessCustom = (values) => {
    setCustom({ ...values });
    setOpenCustom(false);
  };
  // handle huy dang ky
  const handleCancelBtnClick = (id) => {
    showAlertConfirm({
      text: 'Bạn có chắc chắn muốn hủy đơn đăng ký này?',
    }).then(({ value }) => {
      if (value) {
        axios
          .patch(`${GUEST_REGISTRATION}/registrations/${id}/cancel`)
          .then(() => {
            setParams({ ...params, page: 1 });
            showSuccess('Hủy đăng ký thành công', {
              text: 'Yêu cầu đăng ký khách đã bị hủy',
            });
          })
          .catch((error) => {
            showError(error);
          });
      }
    });
  };
  const reRegister = (id) => {
    history.push({
      pathname: `/guest-registrations/${id}/re-register`,
      state: {
        [key]: params,
      },
    });
  };

  const onBack = () => {
    setParams({
      ...initParams,
      limit: params.limit,
      keyword: params.keyword,
    });
    setShowFilter(0);
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
      setParams({ ...params, page: initParams.page, limit: e.target.value });
    }
  };
  const highLightText = (searchText, inputText) => {
    let outPut = inputText;
    if (!searchText) return outPut;
    const index = inputText.toLowerCase().indexOf(searchText.toLowerCase());
    if (index >= 0) {
      outPut = (
        <>
          <span>{inputText.substring(0, index)}</span>
          <span style={{ color: '#109CF1' }}>
            {inputText.substring(index, index + searchText.length)}
          </span>
          <span>{inputText.substring(index + searchText.length)}</span>
        </>
      );
    }
    return outPut;
  };
  const approveHeader = (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Box sx={{ my: 2 }}>
          <SMCTab
            items={[
              { id: '/guest-registrations', text: 'Danh sách đơn' },
              { id: '/guest-registrations/approver', text: 'Phê duyệt' },
            ]}
            selectedTabId="/guest-registrations"
            onChange={(id) => {
              history.push(id);
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
  const renderTitleHeader = () => (
    <p>
      Trạng thái
      <PopupState variant="popover" popupId="guest-status-filter-popup">
        {(popupState) => (
          <>
            <img
              src={FilterICon}
              alt=""
              style={{
                width: 16,
                height: 16,
                cursor: 'pointer',
                marginLeft: 5,
              }}
              {...bindTrigger(popupState)}
            />
            <ParentPopupState.Provider value={popupState}>
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                getContentAnchorEl={null}
              >
                <PopoverComponent
                  value={params.status || []}
                  item={{
                    field: 'status',
                    label: 'Trạng thái',
                    type: 'List',
                    defaultValue: [],
                    props: {
                      searchExpr: 'value',
                      dataSource: Object.values(STATUS_MAP),
                      keyExpr: 'key',
                      displayExpr: 'text',
                    },
                  }}
                  onChange={(field, newVal) => {
                    const value = { [field]: newVal };
                    onSuccessFilter(value);
                  }}
                  popupState={popupState}
                />
              </Popover>
            </ParentPopupState.Provider>
          </>
        )}
      </PopupState>
    </p>
  );
  const statusRender = ({ value }) => {
    const obj = STATUS_MAP[value || 'WAITING'];
    return <Label {...obj} variant="ghost" />;
  };
  const createrRender = ({ data }) => (
    <Tooltip title={data?.createdUsername}>
      <span>
        {data?.createdUsername
          ? highLightText(params.keyword, data.createdUsername)
          : ''}
      </span>
    </Tooltip>
  );
  const codeRender = ({ data }) => (
    <Link
      to={{
        pathname: `/guest-registrations/details/${data.id}/list`,
        state: {
          [key]: params,
        },
      }}
    >
      {data?.code || 'code'}
    </Link>
  );
  const orderRender = ({ rowIndex }) =>
    rowIndex + 1 + params.limit * (params.page - 1);
  const columns = [
    {
      caption: intl.formatMessage({ id: 'app.column.order' }),
      cellRender: orderRender,
      alignment: 'center',
      // fixed: true,
      minWidth: 40,
      width: 'auto',
    },
    {
      caption: 'Mã đơn',
      // fixed: true,
      minWidth: 130,
      cellRender: codeRender,
      visible: custom?.code?.display,
    },
    {
      dataField: 'startDate',
      caption: 'Ngày hẹn',
      dataType: 'date',
      format: 'dd/MM/yyyy',
      width: 'auto',
      minWidth: 120,
      visible: custom?.startDate?.display,
    },
    {
      caption: 'Thời gian',
      cellRender: ({ data }) =>
        renderTime(data.startTimeInMinute, data.endTimeInMinute),
      width: 'auto',
      minWidth: 120,
      visible: custom?.time?.display,
    },
    {
      caption: 'Khu vực làm việc',
      dataField: 'groupName',
      // width: 'auto',
      minWidth: 140,
      visible: custom?.address?.display,
    },
    {
      caption: 'Đơn vị đến',
      dataField: 'areaName',
      // width: 'auto',
      minWidth: 140,
      visible: custom?.area?.display,
    },
    {
      caption: 'Người đăng ký',
      cellRender: createrRender,
      // width: 'auto',
      minWidth: 110,
      visible: custom?.register?.display,
    },
    {
      dataField: 'guestInfo.guestCount',
      caption: 'Số khách',
      width: 'auto',
      minWidth: 100,
      visible: custom?.guestLength?.display,
    },
    {
      caption: 'Số lượng xe',
      dataField: 'vehicleCount',
      width: 'auto',
      minWidth: 100,
      visible: custom?.vehicles?.display,
    },
    {
      dataField: 'repeatType',
      caption: 'Loại yêu cầu',
      cellRender: ({ value }) => REPEAT_TYPE_MAP[value || 'ONCE']?.value || '',
      width: 'auto',
      minWidth: 100,
      visible: custom?.repeatType?.display,
    },
    {
      dataField: 'guestInfo.representerName',
      caption: 'Tên khách',
      minWidth: 140,
      // width: 'auto',
      visible: custom?.guestName?.display,
    },
    {
      dataField: 'guestInfo.identityNumber',
      caption: 'Số giấy tờ',
      // width: 'auto',
      minWidth: 140,
      visible: custom?.identityNumber?.display,
    },
    {
      dataField: 'guestInfo.representerPhoneNumber',
      caption: 'Số điện thoại',
      width: 'auto',
      minWidth: 140,
      visible: custom?.phoneNumber?.display,
    },
    {
      caption: 'Trạng thái',
      dataField: 'status',
      headerCellRender: renderTitleHeader,
      cellRender: statusRender,
      fixed: true,
      fixedPosition: 'right',
      minWidth: 140,
      width: 'auto',
      alignment: 'center',
      visible: custom?.status?.display,
    },
    {
      caption: 'Hành động',
      cellRender: ({ data }) => renderButtons(data.status, data.id),
      allowSorting: false,
      width: 120,
      alignment: 'center',
      fixed: true,
      fixedPosition: 'right',
      allowResizing: false,
    },
  ];
  const renderTable = useMemo(
    () => (
      <TableCustom
        columns={columns}
        hideTable={false}
        data={data.rows || []}
        style={{
          maxHeight: 'calc(100vh - 239px)',
          width: '100%',
        }}
      />
    ),
    [data, custom],
  );
  const dialogFilter = (
    <Dialog
      open={openFilter}
      onClose={handleCloseFilter}
      title={intl.formatMessage(messages.dialogFilterTitle)}
      maxWidth="md"
      fullWidth
    >
      <DialogFilter
        initialValues={params}
        handleCloseFilter={handleCloseFilter}
        onSuccess={onSuccessFilter}
      />
    </Dialog>
  );
  const dialogCustom = (
    <Dialog
      open={openCustom}
      onClose={handleCloseCustom}
      title="Tùy chỉnh"
      maxWidth="xs"
      fullWidth
    >
      <DialogCustom
        initialValues={custom}
        handleCloseCustom={handleCloseCustom}
        onSuccess={onSuccessCustom}
      />
    </Dialog>
  );
  return (
    <>
      <Helmet>
        <title>{intl.formatMessage(messages.helmetTitle)}</title>
        <meta name="description" content="Description of ManageGuests" />
      </Helmet>
      <PageHeader
        title="Quản lý khách tới văn phòng"
        disabled={loading}
        showSearch
        showPager
        placeholderSearch="Tìm kiếm tên người đăng ký, tên và giấy tờ khách đăng ký, mã đơn"
        defaultSearch={params.keyword}
        pageIndex={params.page || 0}
        totalCount={data?.count || 0}
        rowsPerPage={params.limit || 0}
        onSearchValueChange={onSearch}
        handleChangePageIndex={onChangePage}
        handlePageSize={onChangeLimit}
        showFilter={Boolean(showFilter)}
        onBack={onBack}
      >
        <Tooltip title="Thêm mới đăng ký">
          <Badge color="primary">
            <IconButtonSquare
              onClick={handleClickAdd}
              disabled={!scopes.update}
            >
              <img src={AddIcon} alt="" style={{ width: 20, height: 20 }} />
            </IconButtonSquare>
          </Badge>
        </Tooltip>
        <Tooltip title="Lọc">
          <Badge color="primary" badgeContent={showFilter}>
            <IconButtonSquare onClick={handleClickFilter}>
              <img src={FilterICon} alt="" style={{ width: 20, height: 20 }} />
            </IconButtonSquare>
          </Badge>
        </Tooltip>
        <Tooltip title="Tùy chỉnh">
          <Badge color="primary">
            <IconButtonSquare onClick={handleClickCustom}>
              <img src={CustomIcon} alt="" style={{ width: 20, height: 20 }} />
            </IconButtonSquare>
          </Badge>
        </Tooltip>
      </PageHeader>
      {loading && <Loading />}
      {approveHeader}
      {renderTable}
      {dialogFilter}
      {dialogCustom}
    </>
  );
}

export default ManageGuests;
