import { Badge, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import axios from 'axios';
import useAxios from 'axios-hooks';
import { IconButtonSquare } from 'components/CommonComponent';
import PageHeader from 'components/PageHeader';
import TableCustom from 'components/TableCustom';
import { Popup } from 'devextreme-react/popup';
// import { showAlertConfirm } from 'utils/utils';
import TreeView from 'devextreme-react/tree-view';
import AddIcon from 'images/icon-button/add.svg';
import ExportIcon from 'images/icon-button/ic_export.svg';
import ImportIcon from 'images/icon-button/ic_import.svg';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { showError } from 'utils/toast-utils';
import { API_IAM } from '../apiUrl';
import Loading from '../Loading';
import { key } from './constants';
import FilterUser from './filter';
import messages from './messages';
import AddBulkUsers from './render/AddBulkUsers';
import Export from './render/Export';
import ExportLoadingComponent from './render/ExportLoadingComponent';

const useStyles = makeStyles(() => ({
  filter: {
    zIndex: '1299 !important',
  },
  dataContainer: {
    display: 'flex',
    gap: 12,
    height: '100%',
  },
  treeview: {
    height: '100%',
    maxHeight: 'calc(100vh - 159px)',
    backgroundColor: 'white',
    borderRadius: 10,
  },
}));

const initValueFilter = {
  keyword: '',
  email: '',
  employeeCodes: '',
  phoneNumber: '',
  groupIds: null,
  positionIds: null,
  policyIds: null,
  statuses: null,
  availableAt: '',
  expiredAt: '',
  identityProviderType: '',
  accessGroup: '',
  expAccount: null,
  limit: 25, // default limit
  page: 1, // default page
};
export function User({
  // userAuthority,
  history,
  location,
}) {
  // const resourceCode = 'iam/user';
  // const scopes = checkAuthority(
  //   ['get', 'create', 'update'],
  //   resourceCode,
  //   userAuthority,
  // );
  const treeRef = useRef(null);
  const state = location?.state || {};
  const classes = useStyles();
  const intl = useIntl();
  const cancelFileUpload = useRef(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [valueFilter, setValueFilter] = useState({
    ...initValueFilter,
    ...(state[key] || {}),
  });
  const [openExport, setOpenExport] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [progessDownload, setProgessDownload] = useState(0);
  const isFilter = (filterOp) => {
    const { keyword, limit, page, groupIds, ...filter } = filterOp;
    return Object.values(filter).filter((v) => !!v && String(v).length).length;
  };
  const [showFilter, setShowFilter] = useState(isFilter(valueFilter));
  useEffect(() => {
    if (Object.keys(state).length) {
      history.replace({ ...location?.state, [key]: undefined });
    }
  }, []);
  const [showToast, setShowToast] = useState(false);
  const [isCancelDownload, setIsCancelDownload] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(
    axios.CancelToken.source(),
  );

  const handleProgessDownload = (v) => setProgessDownload(v);
  const cancelDownload = () => {
    if (cancelFileUpload.current) cancelFileUpload.current();
  };
  const cancelDownloadAxios = (v) => {
    cancelFileUpload.current = v;
  };
  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  const handleCloseExport = () => {
    setOpenExport(false);
  };
  const handleCloseImport = () => {
    setOpenImport(false);
  };
  const handleSetValueFilter = (obj) => {
    const newState = {
      ...valueFilter,
      ...obj,
      page: 1,
    };
    setValueFilter(newState);
    setOpenFilter(false);
    setShowFilter(isFilter(newState));
  };
  const onBack = () => {
    setValueFilter({
      ...initValueFilter,
      keyword: valueFilter.keyword,
      limit: valueFilter.limit,
    });
    setShowFilter(0);
  };
  // department data
  const [
    { data: getDepartData, loading: getDepartLoading, error: getDepartError },
  ] = useAxios(API_IAM.LIST_DEPARTMENT, {
    useCache: false,
  });
  useEffect(() => {
    if (getDepartError) {
      showError(getDepartError);
    }
  }, [getDepartError]);
  useEffect(() => {
    if (getDepartData && treeRef.current) {
      if (valueFilter.groupIds)
        treeRef.current.instance.selectItem(valueFilter.groupIds.groupId);
    }
  }, [getDepartData]);

  // table data
  const [
    { data: listUser, loading: getUserLoading, error: getUserError },
    executeGetUser,
  ] = useAxios(API_IAM.USER_LIST, {
    useCache: false,
    manual: true,
  });
  const getParams = () => ({
    ...valueFilter,
    groupIds: valueFilter.groupIds?.groupId,
    positionIds: valueFilter.positionIds?.positionId,
    policyIds: valueFilter.policyIds?.policyId,
    accessGroup: valueFilter.accessGroup?.id,
    expAccount: valueFilter.expAccount?.value || undefined,
    availableAt: valueFilter.expAccount?.startUpdatedAt || undefined,
    expiredAt: valueFilter.expAccount?.endUpdatedAt || undefined,
  });
  useEffect(() => {
    const params = getParams();
    executeGetUser({
      params,
    });
  }, [valueFilter]);
  useEffect(() => {
    if (getUserError) {
      showError(getUserError);
    }
  }, [getUserError]);

  const renderActionCell = ({ data }) => (
    <Tooltip title={intl.formatMessage({ id: 'app.tooltip.info' })}>
      <IconButton
        // disabled={!scopes?.get}
        component={Link}
        to={{
          pathname: `/user/details/${data.userId}/info`,
          state: {
            [key]: valueFilter,
          },
        }}
      >
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  const renderOrderCell = ({ rowIndex }) => (
    <span>{(valueFilter.page - 1) * valueFilter.limit + (rowIndex + 1)}</span>
  );

  // const renderIdentifyStatusCell = ({ data }) => (
  //   <div style={{ textAlign: 'left' }}>
  //     <Switch
  //       defaultChecked={data.status === 'ACTIVE'}
  //       color="primary"
  //       name="activated"
  //       onChange={(e, checked) => handleChangeStatus(e, checked, data)}
  //     />
  //   </div>
  // );

  const columns = [
    {
      caption: intl.formatMessage({ id: 'app.column.order' }),
      width: 'auto',
      alignment: 'center',
      cellRender: renderOrderCell,
      minWidth: '60',
    },
    {
      dataField: 'accessCode',
      caption: 'Mã định danh',
    },
    {
      dataField: 'fullName',
      caption: intl.formatMessage(messages.name),
    },
    {
      dataField: 'email',
      caption: intl.formatMessage(messages.email),
    },
    {
      dataField: 'phoneNumber',
      caption: intl.formatMessage(messages.phoneNumber),
    },
    {
      dataField: 'mainGroupName',
      caption: 'Đơn vị',
    },
    // {
    //   dataField: 'status',
    //   caption: intl.formatMessage(messages.status),
    //   visible: scopes.update,
    //   cellRender: renderIdentifyStatusCell,
    // },
    {
      caption: intl.formatMessage({ id: 'app.column.action' }),
      // visible: !(scopes.get === false && scopes.update === false),
      cellRender: renderActionCell,
      width: 'auto',
      minWidth: '103',
      alignment: 'center',
    },
  ];

  const handlePageSize = (e) => {
    setValueFilter({ ...valueFilter, limit: e.target.value, page: 1 });
  };

  const handleChangePageIndex = (pageIndex) => {
    setValueFilter({ ...valueFilter, page: pageIndex });
  };
  const onDepartClick = useCallback(
    (e) => {
      const selectedNodes = e.component
        .getSelectedNodes()
        .map((node) => node.itemData);
      setValueFilter({ ...valueFilter, groupIds: selectedNodes[0] });
    },
    [setValueFilter],
  );
  return (
    <>
      <Helmet>
        <title>{intl.formatMessage(messages.header)}</title>
        <meta name="description" content="User" />
      </Helmet>
      {(getDepartLoading || getUserLoading) && <Loading />}
      {showToast && (
        <ExportLoadingComponent
          progessDownload={progessDownload}
          stop={() => {
            setIsCancelDownload(true);
            cancelTokenSource.cancel();
            setOpenExport(false);
            cancelDownload();
          }}
        />
      )}
      <PageHeader
        title={intl.formatMessage(messages.header)}
        placeholderSearch="Tìm kiếm theo Tên, Email, Mã định danh, Điện Thoại"
        defaultSearch={valueFilter.keyword}
        showFilter={Boolean(showFilter)}
        showSearch
        showPager
        totalCount={listUser?.count}
        pageIndex={valueFilter.page}
        rowsPerPage={valueFilter.limit}
        handlePageSize={handlePageSize}
        handleChangePageIndex={handleChangePageIndex}
        onSearchValueChange={(newVal) => {
          setValueFilter({
            ...valueFilter,
            keyword: newVal,
            page: 1,
          });
        }}
        onBack={onBack}
      >
        <Tooltip title={intl.formatMessage(messages.importUser)}>
          <Badge color="primary">
            <IconButtonSquare
              icon={ImportIcon}
              onClick={() => {
                setOpenImport(true);
              }}
            />
          </Badge>
        </Tooltip>
        <Tooltip title={intl.formatMessage(messages.exportUser)}>
          <Badge color="primary">
            <IconButtonSquare
              icon={ExportIcon}
              onClick={() => {
                setOpenExport(true);
              }}
            />
          </Badge>
        </Tooltip>
        {/* {scopes?.create && ( */}
        <Tooltip title={intl.formatMessage(messages.addUser)}>
          <Badge color="primary">
            <IconButtonSquare
              icon={AddIcon}
              onClick={() => {
                history.push({
                  pathname: `/user/create`,
                  state: {
                    [key]: valueFilter,
                  },
                });
              }}
            />
          </Badge>
        </Tooltip>
        {/* )} */}
        {/* <Tooltip title={intl.formatMessage({ id: 'app.tooltip.filter' })}>
          <Badge color="primary">
            <IconButtonSquare
              icon={FilterICon}
              onClick={() => {
                setOpenFilter(true);
              }}
            />
          </Badge>
        </Tooltip> */}
      </PageHeader>
      <div className={classes.dataContainer}>
        <TreeView
          ref={treeRef}
          items={getDepartData}
          dataStructure="plain"
          displayExpr="groupName"
          parentIdExpr="parentId"
          keyExpr="groupId"
          width={300}
          showCheckBoxesMode="normal"
          searchEnabled
          selectByClick
          selectionMode="single"
          className={classes.treeview}
          onSelectionChanged={onDepartClick}
        />
        {useMemo(
          () => (
            <TableCustom
              data={listUser?.rows || []}
              columns={columns}
              keyExpr="userId"
              maxWidth="calc(100% - 312px)"
              maxHeight="calc(100vh - 159px)"
            />
          ),
          [listUser],
        )}
      </div>

      {openFilter && (
        <Popup
          className={`${classes.filter} popup`}
          visible
          title={intl.formatMessage(messages.filter)}
          showTitle
          onHidden={() => {
            setOpenFilter(false);
          }}
          dragEnabled
          width={700}
          height="auto"
        >
          <FilterUser
            close={handleCloseFilter}
            handleSetValueFilter={handleSetValueFilter}
            initValue={valueFilter}
          />
        </Popup>
      )}
      {openExport && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage(messages.exportListUsers)}
          showTitle
          onHidden={() => {
            setOpenExport(false);
          }}
          dragEnabled
          width={600}
          height={270}
        >
          <Export
            params={getParams()}
            setIsCancelDownload={setIsCancelDownload}
            isCancelDownload={isCancelDownload}
            token={cancelTokenSource.token}
            setCancelTokenSource={setCancelTokenSource}
            close={handleCloseExport}
            setShowToast={setShowToast}
            setProgessDownload={handleProgessDownload}
            cancelDownloadApi={cancelDownloadAxios}
          />
        </Popup>
      )}
      {openImport && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage(messages.importUserTitle)}
          showTitle
          onHidden={() => {
            setOpenImport(false);
          }}
          dragEnabled={false}
          width={600}
          height="auto"
        >
          <AddBulkUsers
            close={handleCloseImport}
            setProgessDownload={handleProgessDownload}
            cancelDownloadApi={cancelDownloadAxios}
          />
        </Popup>
      )}
    </>
  );
}

User.propTypes = {};

export default User;
