/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable consistent-return */
/* eslint-disable radix */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Popup } from 'devextreme-react/popup';
import { useParams } from 'react-router-dom';
import CustomTable from 'components/Custom/table/CustomTable';
import OptionTable from 'components/Custom/SortTable/OptionTable';
import Pagination from 'components/PageHeader/Pagination';
import useUrlState from '@ahooksjs/use-url-state';
import utils, { checkSortTable } from 'utils/utils';
import Loading from 'containers/Loading/Loadable';
import axios from 'axios';
import CtLoadingDownLoadFile from 'components/Custom/Download/CtLoadingDownLoadFile';
import { callApi } from 'utils/requestUtils';
import HeaderMain from 'components/Custom/Header/HeaderMain';
import { API_HOST } from 'containers/apiUrl';
import { DEVICE_TYPE_DEVICE } from 'containers/AC/ACDevice/constants';
import gui from 'utils/gui';
import {
  IconArrowDown,
  IconDownLoad,
  IconFilter,
  IconOption,
} from 'components/Custom/Icon/ListIcon';
import moment from 'moment';
import CtExport from './components/CtExport';
import Filter from './popups/filter';
import FilterColumn from './popups/FilterColumns';

const useStyles = makeStyles(() => ({
  filter: {
    zIndex: '1299 !important',
  },
}));

const initValueFilter = {
  limit: 25,
  page: 1,
};

export function AcEvent() {
  const classes = useStyles();
  const refAcEvent = useRef({});
  const { id } = useParams();
  const [valueFilter, setValueFilter] = useUrlState(initValueFilter);

  const [listEvent, setListEvent] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [openFilterColumn, setOpenFilterColumn] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isOpenOptionTable, setIsOpenOptionTable] = useState(false);
  const [dataColumnTable, setDataColumnTable] = useState([]);

  // download file
  const cancelFileUpload = useRef(null);
  const [openExport, setOpenExport] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isCancelDownload, setIsCancelDownload] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(
    axios.CancelToken.source(),
  );
  const [progessDownload, setProgessDownload] = useState(0);
  const [url, setUrl] = useState(false);

  useEffect(() => {
    fetchData();
  }, [valueFilter]);

  const fetchData = () => {
    if (valueFilter) {
      fetchDataList(valueFilter);
    }
  };

  const renderHeaderCell = (nameColumn, widthColumn) => (
    <div className="ct-flex-row">
      {[
        {
          label: nameColumn,
          icon: <IconFilter color="#4B67E2" />,
          width: widthColumn,
          onClick: () => {
            setOpenFilterColumn(true);
          },
        },
      ].map((item, index) => (
        <div
          key={index.toString()}
          style={{
            width: item.width,
            marginRight: 10,
            justifyContent: 'space-between',
            paddingLeft: 4,
            paddingRight: 4,
          }}
          onClick={item.onClick}
          className="ct-div-btn-no-bg ct-flex-row"
        >
          <div>{item.label}</div>
          {item.icon}
        </div>
      ))}
    </div>
  );

  const COLUMNS_LIST_EVENT = [
    {
      caption: 'STT',
      cellRender: (item) => (
        <div>
          {(item.data.page - 1) * item.data.limit + (item.rowIndex + 1)}
        </div>
      ),
      width: 50,
    },
    {
      caption: 'Thời gian',
      cellRender: (v) => (
        <div>
          {v.data.eventAt
            ? moment(v.data.eventAt).format('DD/MM/YYYY HH:mm:ss')
            : 'Unknown'}
        </div>
      ),
    },
    {
      dataField: 'eventCategoryDocument.name',
      caption: 'Sự kiện',
      headerCellRender: () => renderHeaderCell('Sự kiện', 90),
    },
    {
      dataField: 'user.accessCode',
      caption: 'Mã định danh',
    },
    {
      dataField: 'hostName',
      caption: 'Cửa kiểm soát',
      headerCellRender: () => renderHeaderCell('Cửa kiểm soát', 130),
    },
    {
      dataField: 'device.deviceName',
      caption: 'Thiết bị',
      headerCellRender: () => renderHeaderCell('Thiết bị', 90),
    },
    {
      dataField: 'device.deviceType',
      caption: 'Loại thiết bị',
      headerCellRender: () => renderHeaderCell('Loại thiết bị', 115),
      cellRender: (v) => {
        const found = DEVICE_TYPE_DEVICE.find((a) => a.value === v.value);
        return <div>{found?.label || ''}</div>;
      },
    },
    {
      dataField: 'user.fullName',
      caption: 'Đối tượng thực hiện',
      headerCellRender: () => renderHeaderCell('Đối tượng thực hiện', 160),
    },
    {
      caption: 'Không hiển thị',
      type: 'title',
    },
  ].map((item, index) => ({
    alignment: 'center',
    ...item,
    key: index + 1,
    id: index + 1,
  }));

  const columnsSortTable = localStorage.getItem('columnsSortEvent');
  const newSortTable = JSON.parse(columnsSortTable);

  useEffect(() => {
    if (newSortTable && newSortTable.length > 0) {
      const abc = checkSortTable(newSortTable, COLUMNS_LIST_EVENT);
      setDataColumnTable(abc);
    } else {
      setDataColumnTable(COLUMNS_LIST_EVENT);
    }
  }, []);

  const handleSetValueFilter = (data) => {
    const newDto = {
      startDate: data.startDate || '',
      endDate: data.endDate || '',
      page: 1,
    };
    setValueFilter(newDto);
    setOpenFilter(false);
  };

  const handleSetValueFilterColumn = (data) => {
    const newDto = {
      userIds: data.user || [],
      userType: data.userType || [],
      userGroup: data.userGroup || [],
      deviceIds: data.device || [],
      deviceType: data.deviceType || [],
      deviceGroup: data.deviceGroup || [],
      eventType: data.eventTypes || [],
      page: 1,
    };
    setValueFilter(newDto);
    setOpenFilter(false);
  };

  const fetchDataList = async () => {
    const payload = {
      page: parseInt(valueFilter.page),
      limit: parseInt(valueFilter.limit),
      keyword: valueFilter?.keyword || '',
      userIds:
        id !== undefined || null
          ? [id]
          : typeof valueFilter.userIds === 'string'
          ? [valueFilter.userIds]
          : valueFilter.userIds || [],
      listUserType:
        typeof valueFilter.userType === 'string'
          ? [valueFilter.userType]
          : valueFilter.userType || [],
      userGroupIds:
        typeof valueFilter.userGroup === 'string'
          ? [valueFilter.userGroup]
          : valueFilter.userGroup || [],
      hostIds:
        typeof valueFilter.hostIds === 'string'
          ? [valueFilter.hostIds]
          : valueFilter.hostIds || [],
      deviceIds:
        typeof valueFilter.deviceIds === 'string'
          ? [valueFilter.deviceIds]
          : valueFilter.deviceIds || [],
      listDeviceType:
        typeof valueFilter.deviceType === 'string'
          ? [valueFilter.deviceType]
          : valueFilter.deviceType || [],
      deviceGroupIds:
        typeof valueFilter.deviceGroup === 'string'
          ? [valueFilter.deviceGroup]
          : valueFilter.deviceGroup || [],
      eventCategoryCodeList:
        typeof valueFilter.eventType === 'string'
          ? [valueFilter.eventType]
          : valueFilter.eventType || [],
    };
    if (valueFilter.startDate !== undefined || null) {
      payload.startDate = parseInt(valueFilter.startDate);
      payload.endDate = parseInt(valueFilter.endDate);
    }

    const dto = utils.queryString(payload);
    setUrl(dto);
    // console.log('payload', payload, 'dto', dto);

    setLoading(true);
    try {
      const res = await callApi(
        `${API_HOST}/vf/search/api/v0/event/search?${dto}`,
        'POST',
        payload,
      );
      const dataEvent = res.data.rows.map(
        (o) =>
          ({
            ...o,
            ...valueFilter,
          } || []),
      );
      setListEvent({ count: res.data.count, rows: dataEvent });
      if (refAcEvent && refAcEvent.current) {
        refAcEvent.current.instance.clearSelection();
      }
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelDownload = () => {
    if (cancelFileUpload.current) cancelFileUpload.current();
  };

  const findItem = dataColumnTable?.findIndex((e) => e?.type === 'title') || [];
  const arrColumnConvert =
    findItem && dataColumnTable && dataColumnTable?.slice(0, findItem);

  const cancelDownloadAxios = (v) => {
    cancelFileUpload.current = v;
  };

  const ViewContentTab = () => (
    <>
      <div className="ct-content-main-only">
        {dataColumnTable && (
          <CustomTable
            disabledSelect
            // showColumnLines
            data={listEvent.rows || []}
            row={arrColumnConvert}
            innerRef={refAcEvent}
            height={gui.screenHeight - 230}
          />
        )}
        <div
          style={{
            marginTop: 20,
          }}
        >
          <Pagination
            totalCount={listEvent?.count || 0}
            pageIndex={parseInt(valueFilter.page || 1)}
            rowsPerPage={parseInt(valueFilter.limit || 25)}
            handlePageSize={(e) =>
              setValueFilter({ limit: e.target.value, page: 1 })
            }
            handleChangePageIndex={(e) => setValueFilter({ page: e })}
          />
        </div>
      </div>

      {loading && <Loading />}

      {openFilter && (
        <Popup
          className={`${classes.filter} popup`}
          visible
          title="Bộ lọc"
          showTitle
          onHidden={() => {
            setOpenFilter(false);
          }}
          width="50%"
          height="auto"
        >
          <Filter
            onClose={() => setOpenFilter(false)}
            callback={handleSetValueFilter}
            valueFilter={valueFilter}
          />
        </Popup>
      )}

      {openFilterColumn && (
        <Popup
          className={`${classes.filter} popup`}
          visible
          title="Bộ lọc theo cột"
          showTitle
          onHidden={() => {
            setOpenFilterColumn(false);
          }}
          width="50%"
          height="auto"
        >
          <FilterColumn
            onClose={() => setOpenFilterColumn(false)}
            callback={handleSetValueFilterColumn}
            valueFilter={valueFilter}
          />
        </Popup>
      )}

      <OptionTable
        dataColumnTable={dataColumnTable}
        open={isOpenOptionTable}
        keySaveLocal="columnsSortEvent"
        onSave={(e) => {
          const abc = checkSortTable(e, COLUMNS_LIST_EVENT);
          setDataColumnTable(abc);
          fetchData();
        }}
        onClose={(v) => setIsOpenOptionTable(v)}
      />

      {showToast && (
        <CtLoadingDownLoadFile
          progessDownload={progessDownload}
          titleExportLoading="sự kiện"
          stop={() => {
            setIsCancelDownload(true);
            cancelTokenSource.cancel();
            setOpenExport(false);
            cancelDownload();
          }}
        />
      )}

      {openExport && (
        <Popup
          className="popup"
          visible
          title="Tải xuống thông tin sự kiện"
          showTitle
          onHidden={() => {
            setOpenExport(false);
          }}
          dragEnabled
          width={600}
          height={260}
        >
          <CtExport
            // params={getParams()}
            api="event"
            url={url}
            setIsCancelDownload={setIsCancelDownload}
            isCancelDownload={isCancelDownload}
            token={cancelTokenSource.token}
            setCancelTokenSource={setCancelTokenSource}
            close={() => setOpenExport(false)}
            setShowToast={setShowToast}
            setProgessDownload={(v) => setProgessDownload(v)}
            cancelDownloadApi={cancelDownloadAxios}
          />
        </Popup>
      )}
    </>
  );

  return (
    <div className="ct-root-page">
      <HeaderMain
        data={[{ label: 'Danh sách nhật ký sự kiện', key: '1' }]}
        defaultValueSearch={valueFilter.keyword}
        onSearchValueChange={(e) => setValueFilter({ keyword: e, page: 1 })}
        ViewLeft={() => (
          <div className="ct-flex-row">
            {[
              {
                label: 'Tải xuống',
                icon: <IconDownLoad />,
                icon2: <IconArrowDown />,
                width: 140,
                onClick: () => {
                  setOpenExport(true);
                },
              },
              {
                label: (
                  <span
                    style={{
                      color: valueFilter?.status ? '#007BFF' : '',
                    }}
                  >
                    Bộ lọc
                  </span>
                ),
                icon: (
                  <IconFilter color={valueFilter?.status ? '#007BFF' : ''} />
                ),
                width: 92,
                onClick: () => {
                  setOpenFilter(true);
                },
              },
              {
                label: 'Tùy chỉnh',
                icon: <IconOption />,
                width: 120,
                onClick: () => {
                  setIsOpenOptionTable(true);
                },
              },
            ].map((item, index) => (
              <div
                key={index.toString()}
                style={{ width: item.width, marginRight: 10 }}
                onClick={item.onClick}
                className="ct-div-btn-no-bg ct-flex-row"
              >
                {item.icon}
                <div>{item.label}</div>
                {item.icon2 ? item.icon2 : null}
              </div>
            ))}
          </div>
        )}
      />
      {ViewContentTab()}
    </div>
  );
}

export default AcEvent;
