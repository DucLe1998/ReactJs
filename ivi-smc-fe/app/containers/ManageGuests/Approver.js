import {
  Badge,
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  Popover,
  Tooltip,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/InfoOutlined';
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
import React, { createContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { time2Min } from 'utils/functions';
import { showError } from 'utils/toast-utils';
import { GUEST_REGISTRATION } from '../apiUrl';
import DialogApprove from './dialogs/DialogApprove';
import DialogCustom from './dialogs/DialogCustom';
import DialogFilter from './dialogs/DialogFilterApprover';
import DialogReject from './dialogs/DialogReject';
import DialogResult from './dialogs/DialogResult';
import messages from './messages';
import {
  formatDate,
  renderTime,
  REPEAT_TYPE_MAP,
  STATUS_APPROVE_MAP,
} from './modules';

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
const key = 'ManageGuestsApprove';
export function Approver({ history, location }) {
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
  const state = location?.state || {};
  const [data, setData] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [openCustom, setOpenCustom] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [openResult, setOpenResult] = useState(false);
  const [titleResult, setTitleResult] = useState();
  const [resultData, setResultData] = useState({});
  const [openReject, setOpenReject] = useState(false);
  const [custom, setCustom] = useState(initCustom);
  const [idCheckAll, setIdCheckAll] = useState(false);
  const [idWaiting, setIdWaiting] = useState([]);
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
  const [idList, setidList] = useState([]);

  useEffect(() => {
    if (Object.keys(state).length) {
      history.replace({ ...location?.state, [key]: undefined });
    }
  }, []);
  useEffect(() => {
    setLoading(true);
    const { keyword, limit, page, ...filter } = params;
    axios
      .get(`${GUEST_REGISTRATION}/approver/registrations`, {
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
          approvalStatusMe: (filter?.approvalStatusMe || []).map(
            (item) => item.key,
          ),
          repeatType: filter?.repeatType?.key,
          createdAt: filter?.createdAt
            ? formatDate(filter?.createdAt)
            : undefined,
        },
      })
      .then((response) => {
        const res = response.data;
        setData(res);
        if (res.rows) {
          const idWait = res.rows.reduce((total, cur) => {
            if (cur?.approvalStatusMe == 'WAITING' && cur.status == 'WAITING') {
              return [...total, cur.id];
            }
            return total;
          }, []);
          setIdWaiting(idWait);
        }
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
        // containerRef.current.querySelector('input').focus();
      });
  }, [params]);

  useEffect(() => {
    if (idList.length > 0) {
      const all = idList.length == idWaiting.length;
      setIdCheckAll(all);
    } else {
      setIdCheckAll(false);
    }
  }, [idList]);
  const actionCheckbox = (event) => {
    if (event.target.checked) {
      setidList([...idList, event.target.name]);
    } else {
      setidList(idList.filter((x) => x != event.target.name));
    }
  };
  const renderChexbox = ({ data }) => {
    if (data.approvalStatusMe === 'WAITING' && data.status == 'WAITING') {
      return (
        <Checkbox
          key={data.id}
          // defaultChecked={Boolean(idList.includes(data.id))}
          checked={Boolean(idList.includes(data.id))}
          onChange={actionCheckbox}
          name={data.id}
        />
      );
    }
    return null;
  };
  const renderButtons = (approvalStatusMe, id) => {
    if (approvalStatusMe) {
      return (
        <Tooltip title="Chi tiết">
          <IconButton
            size="small"
            // component={Link}
            onClick={() =>
              history.push(`/guest-registrations/details/${id}/approve`)
            }
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      );
    }
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
                // classes={{ list: classes.menu }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                getContentAnchorEl={null}
              >
                <PopoverComponent
                  value={params.approvalStatusMe || []}
                  item={{
                    field: 'approvalStatusMe',
                    label: 'Trạng thái',
                    type: 'List',
                    defaultValue: [],
                    props: {
                      searchExpr: 'value',
                      dataSource: Object.values(STATUS_APPROVE_MAP),
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
  const checkAllEvent = (event) => {
    if (event.target.checked) {
      setidList([...idWaiting]);
    } else {
      setidList([]);
    }
  };
  const renderApproveHeader = () => (
    <Checkbox
      defaultChecked={idCheckAll}
      onChange={checkAllEvent}
      name="checkAll"
    />
  );

  const statusRender = ({ value }) => {
    const obj = STATUS_APPROVE_MAP[value || 'WAITING'];
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
  const locationRender = ({ data }) => (
    <p style={{ margin: '5px' }}>{`${data.groupName}`}</p>
  );
  const areaRender = ({ data }) => (
    <p style={{ margin: '5px' }}>{data.areaName}</p>
  );
  const codeRender = ({ data }) => (
    <Link
      to={{
        pathname: `/guest-registrations/details/${data.id}/approve`,
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
      minWidth: 40,
      width: 'auto',
    },
    {
      caption: 'Mã đơn',
      minWidth: 70,
      cellRender: codeRender,
      width: 'auto',
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
      cellRender: locationRender,
      width: 'auto',
      minWidth: 140,
      visible: custom?.address?.display,
    },
    {
      caption: 'Đơn vị đến',
      cellRender: areaRender,
      width: 'auto',
      minWidth: 140,
      visible: custom?.area?.display,
    },
    {
      caption: 'Người đăng ký',
      cellRender: createrRender,
      width: 'auto',
      maxWidth: 120,
      visible: custom?.register?.display,
    },
    {
      dataField: 'guestInfo.guestCount',
      caption: 'Số khách',
      width: 'auto',
      minWidth: 100,
      alignment: 'center',
      visible: custom?.guestLength?.display,
    },
    {
      caption: 'Số lượng xe',
      cellRender: ({ data }) => data?.vehicles?.length,
      width: 'auto',
      minWidth: 100,
      alignment: 'center',
      visible: custom?.vehicles?.display,
    },
    {
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
      width: 'auto',
      visible: custom?.guestName?.display,
    },
    {
      dataField: 'guestInfo.identityNumber',
      caption: 'Số giấy tờ',
      width: 'auto',
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
      dataField: 'approvalStatusMe',
      caption: 'Trạng thái',
      headerCellRender: renderTitleHeader,
      cellRender: statusRender,
      fixed: true,
      fixedPosition: 'right',
      minWidth: 140,
      width: 'auto',
      visible: custom?.status?.display,
      alignment: 'center',
    },
    {
      caption: 'Hành động',
      cellRender: ({ data }) => renderButtons(data.approvalStatusMe, data.id),
      allowSorting: false,
      width: 140,
      alignment: 'center',
      fixed: true,
      fixedPosition: 'right',
      allowResizing: false,
    },
    {
      headerCellRender: renderApproveHeader,
      cellRender: renderChexbox,
      fixed: true,
      fixedPosition: 'right',
      minWidth: 70,
      width: 'auto',
    },
  ];
  const handleCloseApprove = () => {
    setOpenApprove(false);
  };
  const handleCloseReject = () => {
    setOpenReject(false);
  };

  const onSuccessApprove = () => {
    setOpenApprove(false);
    setLoading(true);
    setResultData(null);
    axios
      .patch(`${GUEST_REGISTRATION}/registrations/multi-approve`, idList)
      .then((data) => {
        setResultData(data.data);
        setOpenResult(true);
        setParams({ ...params, page: 1 });
        setidList([]);
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onSuccessReject = (reason) => {
    setOpenReject(false);
    setLoading(true);
    axios
      .patch(`${GUEST_REGISTRATION}/registrations/multi-reject`, {
        ids: idList,
        rejectReason: reason,
      })
      .then((data) => {
        setResultData({ ...data.data, reasonReject: reason });
        setOpenResult(true);
        setParams({ ...params, page: 1 });
        setidList([]);
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleApproveBtnClick = () => {
    setOpenApprove(true);
    setTitleResult('Kết quả phê duyệt');
  };
  const handleRejectBtnClick = () => {
    setOpenReject(true);
    setTitleResult('Danh sách từ chối');
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
            selectedTabId="/guest-registrations/approver"
            onChange={(id) => {
              history.push(id);
            }}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={6} container justifyContent="flex-end">
        <Box sx={{ my: 2 }} justify="flex-end">
          <Button
            variant="contained"
            disabled={idList.length == 0}
            mx={2}
            onClick={handleRejectBtnClick}
          >
            Từ chối
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={idList.length == 0}
            mx={2}
            style={{
              marginLeft: '15px',
            }}
            onClick={handleApproveBtnClick}
          >
            Đồng ý
          </Button>
        </Box>
      </Grid>
    </Grid>
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
  const dialogResult = (
    <Dialog
      open={openResult}
      onClose={() => setOpenResult(false)}
      title={titleResult}
      maxWidth="md"
      fullWidth
    >
      <DialogResult
        initialValues={resultData}
        handleCloseFilter={() => setOpenResult(false)}
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
      <TableCustom
        columns={columns}
        data={data.rows}
        hideTable={false}
        style={{
          maxHeight: 'calc(100vh - 239px)',
          width: '100%',
        }}
      />
      {dialogFilter}
      {dialogCustom}
      {dialogResult}
      <DialogApprove
        open={openApprove}
        handleClose={handleCloseApprove}
        onSuccess={onSuccessApprove}
      />

      <DialogReject
        open={openReject}
        handleClose={handleCloseReject}
        onSuccess={(data) => onSuccessReject(data)}
      />
    </>
  );
}

export default Approver;
