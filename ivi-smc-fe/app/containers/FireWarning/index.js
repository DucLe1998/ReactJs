import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import LoadingIndicator from 'components/LoadingIndicator';
import Loading from 'containers/Loading';
import { IconFilterBlack, IconReplay } from 'constant/ListIcons';
// import { useIntl } from 'react-intl';
import { DataGrid, Popup } from 'devextreme-react';
import { Badge, IconButton, Tooltip } from '@material-ui/core';
import { getApi, putApiCustom } from 'utils/requestUtils';
import { FIRE_ALARM_API } from 'containers/apiUrl';
import moment from 'moment';
import _ from 'lodash';
import PageHeader from 'components/PageHeader';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { Column, Paging, Selection } from 'devextreme-react/data-grid';
import { checkAuthority } from 'utils/functions';
import { endOfDay, format } from 'date-fns';
import { rootStyles } from './styles';
import Filter from './dialogs/DialogFilter';
import { makeid } from '../../utils/utils';
import { IconButtonSquare } from '../../components/CommonComponent';
import SendFireAlarm from './dialogs/DialogSendFireAlarm';
import { showError } from '../../utils/toast-utils';
import { getErrorMessage } from '../Common/function';

const initialFilter = {
  issueTypeCodes: [],
  deviceType: [],
  floorIdsL: [],
  levelCodes: [],
  statusCodes: [],
  fromDate: null,
  toDate: null,
  sort: null,
  limit: 25,
  page: 1,
};

export function FireWarning({ userAuthority }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();
  const [params, setParams] = useState(initialFilter);
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [showSendFireAlarm, setShowSendFireAlarm] = useState(false);
  // const [showAdd, setShowAdd] = useState(false);
  const [isFilter, setFilter] = useState(false);
  const [initFilter, setInitFilter] = useState(initialFilter);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sendFireAlarmId, setSenFireAlarmId] = useState(null);
  // const intl = useIntl();
  const refFireWarning = useRef({});
  const classes = rootStyles();
  const resourceCode = 'fire-alarm/issue';
  const scopes = checkAuthority(
    ['get', 'update', 'delete', 'create'],
    resourceCode,
    userAuthority,
  );

  const fetchData = () => {
    setLoading(true);
    getApi(FIRE_ALARM_API.LIST, _.pickBy(params))
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleChangePageIndex = pageIndex => {
    setParams({ ...params, page: pageIndex });
  };
  const handlePageSize = e => {
    setParams({ ...params, page: 1, limit: e.target.value });
  };

  const handleChangeFilter = data => {
    setInitFilter(data);
    const dataFilter = {
      issueTypeCodes: data?.issueTypeCodes
        ? data.issueTypeCodes.map(item => item.issueTypeCodes)
        : [],
      levelCodes: data?.levelCodes
        ? data.levelCodes.map(item => item.levelCodes)
        : [],
      statusCodes: data?.statusCodes
        ? data.statusCodes.map(item => item.statusCode)
        : [],
      deviceTypeCodes: data?.deviceTypeCodes
        ? data.deviceTypeCodes.map(item => item.deviceType)
        : [],
      floorIds: data?.floorIds ? data.floorIds.map(item => item.floorId) : [],
      startTime: data?.startTime ? data.startTime.getTime() : null,
      endTime: data?.endTime ? endOfDay(data?.endTime).getTime() : null,
    };
    setFilter(true);
    setParams({ ...params, ...dataFilter, page: 1 });
  };

  const handlePropertyChange = e => {
    if (e.fullName.includes('sortOrder')) {
      if (e.value) {
        const direction = e.value == 'asc' ? '+' : '-';
        const key = columns[e.fullName.slice(8, -11)].dataField;
        setParams({ ...params, sort: direction + key });
      } else setParams({ ...params, sort: undefined });
    }
  };

  function statusTextStyle(text) {
    if (text === 'DANGEROUS') return { color: '#E24545' };
    if (text === 'LOW') return { color: '#40A574' };
    if (text === 'MEDIUM') return { color: '#109CF1' };
    if (text === 'HIGH') return { color: '#F6A609' };
    return {};
  }

  const putListWrong = value => {
    const listWrong = {
      issueIds: value.map(e => e.id),
    };
    putApiCustom(
      {
        url: FIRE_ALARM_API.LIST_WRONG,
        payload: listWrong,
      },
      () => {
        fetchData();
        setSelectedRows([]);
      },
      error => {
        showError(getErrorMessage(error));
      },
    );
  };

  const filterPopup = () => (
    <Popup
      visible={showPopupFilter}
      title="Lọc cảnh báo"
      onHiding={() => setShowPopupFilter(false)}
      dragEnabled
      showTitle
      width="570px"
      height="auto"
      className={classes.popup}
    >
      <Filter
        onClose={() => setShowPopupFilter(false)}
        handleChangeFilter={handleChangeFilter}
        initValues={initFilter}
      />
    </Popup>
  );

  const sendFireAlarmPopup = () => (
    <Popup
      visible={showSendFireAlarm}
      title="Gửi thông báo cháy"
      onHiding={() => {
        setShowSendFireAlarm(false);
        setSenFireAlarmId(null);
      }}
      dragEnabled
      showTitle
      width="570px"
      height="auto"
      className={classes.popup}
    >
      <SendFireAlarm
        onClose={() => {
          setShowSendFireAlarm(false);
          setSenFireAlarmId(null);
        }}
        issueId={sendFireAlarmId}
        setLoading={setLoading}
      />
    </Popup>
  );

  const getTitle = () => {
    if (!params || !params.keyword)
      return 'Danh sách cảnh báo hệ thống báo cháy';
    return 'Kết quả tìm kiếm';
  };

  const renderAction = info =>
    scopes.create && (
      <Tooltip title="Gửi lại cảnh báo cho cứ dân" placement="bottom">
        <Badge color="primary">
          <IconButton
            size="small"
            onClick={() => {
              setSenFireAlarmId(info.id);
              setShowSendFireAlarm(true);
            }}
          >
            <img src={IconReplay} alt="" />
          </IconButton>
        </Badge>
      </Tooltip>
    );
  // <IconOnRowWrap onClick={() => console.log(info)} src={IconEdit} />
  const systemRenderer = item => {
    if (item) return <div>Cảnh báo cháy</div>;
    return <div>Báo cháy giả</div>;
  };

  const renderContent = item => (
    <Fragment>
      <Tooltip title={item.content}>
        <Link to={{ pathname: `/fire-warning/${item.id}` }}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '350px',
            }}
          >
            {item.content}
          </div>
        </Link>
      </Tooltip>
    </Fragment>
  );
  const renderTimeDate = ({ value }) => {
    // return format(new Date(value), 'HH:mm:ss.SSS dd-MM-yyyy');
    return format(new Date(value), 'HH:mm dd-MM-yyyy');
  };

  const handleSelectionChange = e => {
    setSelectedRows(e);
  };

  const columns = [
    {
      dataField: 'order',
      caption: 'STT',
      allowSorting: false,
      cellRender: props =>
        props?.rowIndex + 1 + params?.limit * (params?.page - 1),
      alignment: 'left',
    },
    {
      dataField: 'createdDate',
      caption: 'Thời gian',
      allowSorting: true,
      cellRender: renderTimeDate,
      alignment: 'left',
    },

    {
      dataField: 'location',
      caption: 'Khu vực',
      allowSorting: true,
    },
    {
      dataField: 'content',
      caption: 'Nội dung',
      cellRender: e => renderContent(e?.data),
      allowSorting: true,
    },
    {
      dataField: 'issueTypeName',
      caption: 'Loại cảnh báo',
      allowSorting: true,
    },
    {
      dataField: 'isTrue',
      caption: 'Phân loại',
      allowSorting: true,
      cellRender: systemRenderer,
      alignment: 'left',
    },
    {
      dataField: 'levelName',
      cellRender: ({ data }) => (
        <p style={statusTextStyle(data.levelCode)}>{data.levelName}</p>
      ),
      caption: 'Mức độ',
      allowSorting: true,
    },
    {
      dataField: 'statusName',
      caption: 'Trạng thái',
      allowSorting: true,
    },
    {
      dataField: 'deviceName',
      caption: 'Thiết bị',
      allowSorting: true,
    },
    {
      caption: 'Hành động',
      cellRender: ({ data }) => renderAction(data),
      allowSorting: false,
    },
  ];

  const onClearSearch = () => {
    setFilter(false);
    setInitFilter({ ...initialFilter });
    setParams({ ...initialFilter, limit: params.limit });
  };

  return (
    <div>
      <React.Suspense fallback={<LoadingIndicator />}>
        {loading && <Loading />}
        <Helmet>
          <title>Hệ thống báo cháy</title>
          <meta name="fireAlarm" content="Hệ thống báo cháy" />
        </Helmet>
        <PageHeader
          title={!isFilter ? getTitle() : 'Kết quả lọc'}
          showBackButton={isFilter ? true : params?.keyword || ''}
          onBack={onClearSearch}
          showPager
          totalCount={data?.count ? data?.count : 0}
          pageIndex={params.page}
          rowsPerPage={params.limit}
          handleChangePageIndex={pageIndex => {
            handleChangePageIndex(pageIndex);
          }}
          handlePageSize={handlePageSize}
        >
          {scopes.update && (
            <Tooltip title="Báo sai" placement="top">
              <Badge color="primary">
                <IconButtonSquare
                  disabled={selectedRows.length <= 0}
                  onClick={() => putListWrong(selectedRows)}
                >
                  <InfoOutlinedIcon />
                </IconButtonSquare>
              </Badge>
            </Tooltip>
          )}
          {/* <IconButtonSquare onClick={() => setShowAdd(true)}>
            <img src={IconVector} alt="" style={{ width: 20, height: 20 }} />
          </IconButtonSquare> */}
          <Tooltip title="Lọc" placement="top">
            <Badge color="primary">
              <IconButtonSquare onClick={() => setShowPopupFilter(true)}>
                <img
                  src={IconFilterBlack}
                  alt=""
                  style={{ width: 24, height: 24 }}
                />
              </IconButtonSquare>
            </Badge>
          </Tooltip>
        </PageHeader>
        <DataGrid
          className="center-row-grid"
          style={{
            height: '100%',
            maxHeight: 'calc(100vh - 180px)',
            width: '100%',
          }}
          ref={refFireWarning}
          dataSource={data?.rows || []}
          noDataText="Không có thông báo"
          onSelectionChanged={e => handleSelectionChange(e.selectedRowsData)}
          columnAutoWidth
          // rowAlternationEnabled
          showRowLines={false}
          showColumnLines={false}
          onOptionChanged={handlePropertyChange}
          onRowPrepared={e => {
            if (e.rowType == 'header') {
              e.rowElement.style.backgroundColor = 'rgba(194, 207, 224, 0.08)';
            } else {
              e.rowElement.style.backgroundColor =
                e?.data?.statusCode === 'READ' ? '#fff' : '#f2f5f7';
              e.rowElement.style.fontWeight =
                e?.data?.statusCode === 'READ' ? '' : 'bold';
            }
          }}
        >
          <Selection
            mode="multiple"
            selectAllMode="page"
            showCheckBoxesMode="always"
          />
          <Paging enabled={false} />
          {/* {(columns || []).map(defs => (
              <Column {...defs} key={defs.dataField || Math.random()} />
            ))} */}
          {columns
            .map(i => ({
              ...i,
            }))
            .map(item => (
              <Column
                cssClass="ct-dx-row ct-dx-datagrid-text-content"
                {...item}
                key={makeid(32)}
              />
            ))}
        </DataGrid>

        {showPopupFilter && filterPopup()}
        {showSendFireAlarm && sendFireAlarmPopup()}
      </React.Suspense>
    </div>
  );
}

export default FireWarning;
