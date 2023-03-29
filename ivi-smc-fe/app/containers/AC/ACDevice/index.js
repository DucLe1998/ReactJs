/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable consistent-return */
/* eslint-disable radix */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Popup } from 'devextreme-react/popup';
import CustomTable from 'components/Custom/table/CustomTable';
import OptionTable from 'components/Custom/SortTable/OptionTable';
import axios from 'axios';
import useUrlState from '@ahooksjs/use-url-state';
import PopupDelete from 'components/Custom/popup/PopupDelete';
import utils, { checkSortTable } from 'utils/utils';
import IconBtn from 'components/Custom/IconBtn';
import Pagination from 'components/PageHeader/Pagination';
import CtExport from 'components/Custom/Download/CtExport';
import HeaderMain from 'components/Custom/Header/HeaderMain';
import TreeViewGroup from 'components/Custom/AreaTree/TreeViewGroup';
import CtLoadingDownLoadFile from 'components/Custom/Download/CtLoadingDownLoadFile';
import gui from 'utils/gui';
import {
  IconArrowDown,
  IconDelete,
  IconDownLoad,
  IconFilter,
  IconOption,
  IconSync,
} from 'components/Custom/Icon/ListIcon';
import Loading from 'containers/Loading/Loadable';
import { callApi } from 'utils/requestUtils';
import Filter from './popups/filter';
import {
  API_AC_ADAPTER,
  COLUMNS_LIST_DEVICE,
  DEVICE_TYPE_DEVICE,
} from './constants';
import PopupSyncDevice from './popups/PopupSyncDevice';
import { API_HOST } from 'containers/apiUrl';
const useStyles = makeStyles(() => ({
  filter: {
    zIndex: '1299 !important',
  },
}));

const initValueFilter = {
  keyword: '',
  limit: 25,
  page: 1,
  tab: '1',
};

export function ACDevice() {
  const classes = useStyles();
  const refAcDevice = useRef({});

  const [valueFilter, setValueFilter] = useUrlState(initValueFilter);

  const [listDevice, setListDevice] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [reloadTreeView, setReloadTreeView] = useState(0);

  const [loading, setLoading] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenOptionTable, setIsOpenOptionTable] = useState(false);
  const [dataColumnTable, setDataColumnTable] = useState('');
  const [openViewDelete, setOpenViewDelete] = useState(false);
  const [openViewSyncDevice, setOpenViewSyncDevice] = useState(false);

  // download file
  const cancelFileUpload = useRef(null);
  const [openExport, setOpenExport] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isCancelDownload, setIsCancelDownload] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(
    axios.CancelToken.source(),
  );
  const [progessDownload, setProgessDownload] = useState(0);

  const cancelDownload = () => {
    if (cancelFileUpload.current) cancelFileUpload.current();
  };

  const cancelDownloadAxios = (v) => {
    cancelFileUpload.current = v;
  };

  useEffect(() => {
    if (valueFilter?.tab) {
      fetchData();
    }
  }, [valueFilter]);

  const fetchData = () => {
    if (valueFilter.groupId) {
      fetchDataListDevice(valueFilter.groupId);
    }
  };

  const columnsSortTable = localStorage.getItem('columnsSortDevice');
  const newSortTable = JSON.parse(columnsSortTable);

  useEffect(() => {
    if (!valueFilter.tab) {
      setValueFilter({ tab: '1' });
    }
    if (newSortTable && newSortTable.length > 0) {
      const abc = checkSortTable(newSortTable, COLUMNS_LIST_DEVICE);
      setDataColumnTable(abc);
    } else {
      setDataColumnTable(COLUMNS_LIST_DEVICE);
    }
  }, []);

  const handleSetValueFilter = (data) => {
    const newDto = {
      devicePosittion: data?.devicePosittion?.value || undefined,
      direction: data?.direction?.value || undefined,
      deviceType: data?.deviceType.value || undefined,
      status: data?.status?.value || undefined,
      page: 1,
    };
    setValueFilter(newDto);
    setOpenFilter(false);
  };

  const fetchDataListDevice = async (id) => {
    const found =
      valueFilter?.deviceType &&
      DEVICE_TYPE_DEVICE.find((e) => e.value === valueFilter.deviceType);
    const payload = {
      keyword: valueFilter.keyword || null,
      page: parseInt(valueFilter.page),
      limit: parseInt(valueFilter.limit),
      // assigned:
      //   valueFilter?.devicePosittion === 'true'
      //     ? 'TRUE'
      //     : valueFilter?.devicePosittion === 'false'
      //     ? 'FALSE'
      //     : null,
      // status: valueFilter?.status || null,
      // deviceType: found?.value || null,
      groupId: id,
      // direction: valueFilter?.direction || '',
    };

    if (valueFilter?.devicePosittion) {
      payload.assigned =
        valueFilter?.devicePosittion === 'true'
          ? 'TRUE'
          : valueFilter?.devicePosittion === 'false'
          ? 'FALSE'
          : null;
    }
    if (found?.value) {
      payload.deviceType = found?.value;
    }
    if (valueFilter?.direction) {
      payload.direction = valueFilter?.direction;
    }

    if (valueFilter?.status) {
      payload.status = valueFilter?.status;
    }

    const dto = utils.queryString(payload);
    setLoading(true);
    try {
      const res = await callApi(`${API_AC_ADAPTER}/devices/in-group/${id}`, 'GET');
      setListDevice(res.data);
      if (refAcDevice && refAcDevice.current) {
        refAcDevice.current.instance.clearSelection();
      }
      setSelectedRows([]);
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const findItem =
    (dataColumnTable &&
      dataColumnTable?.findIndex((e) => e.type === 'title')) ||
    [];
  const arrColumnConvert =
    findItem && dataColumnTable && dataColumnTable?.slice(0, findItem);

  const ViewContentTab = () => (
    <>
      <div
        className="ct-content-main"
        style={{
          height: gui.heightContentOfScreen,
          maxHeight: gui.heightContentOfScreen,
        }}
      >
        <div className="ct-content-main-left">
          <TreeViewGroup
            textApi="thiết bị"
            api="device"
            allUrlApi={API_AC_ADAPTER}
            titleDelete="Xóa nhóm thiết bị"
            ContentDelete="Cần thực hiện việc xoá toàn bộ thiết bị trong thư mục mới có thể 
        tiến hành việc xoá thư mục này"
            reloadTreeView={reloadTreeView}
            elementTotal="totalDevices"
            groupId={valueFilter.groupId}
            callback={(e) => {
              setValueFilter({ page: 1, groupId: e });
            }}
            callbackReload={() => fetchData()}
          />
        </div>
        <div className="ct-content-main-right">
          {arrColumnConvert && (
            <CustomTable
              data={listDevice?.rows || []}
              onSelectionChanged={(e) => setSelectedRows(e)}
              row={arrColumnConvert}
              innerRef={refAcDevice}
              height={gui.heightTable}
            />
          )}
          <div
            style={{
              marginTop: 20,
            }}
          >
            <Pagination
              totalCount={listDevice?.count || 0}
              pageIndex={parseInt(valueFilter.page || 1)}
              rowsPerPage={parseInt(valueFilter.limit || 25)}
              handlePageSize={(e) =>
                setValueFilter({ limit: e.target.value, page: 1 })
              }
              handleChangePageIndex={(e) => setValueFilter({ page: e })}
            />
          </div>
        </div>
      </div>

      {loading && <Loading />}

      {openViewDelete && (
        <PopupDelete
          title={
            selectedRows.find((q) => q.deviceState === 'CONNECTED')
              ? 'Không thể thực hiện xoá thiết bị'
              : 'Xác nhận xóa thiết bị'
          }
          textFollowTitle={
            selectedRows.find((q) => q.deviceState === 'CONNECTED')
              ? `Có thiết bị đang trong trạng thái kết nối không thể bị xoá, vui lòng 
          ngắt kết nối thiết bị`
              : `Thiết bị sẽ bị xóa hoàn toàn khỏi hệ thống, bạn có chắc chắn xóa ${
                  selectedRows?.length || 0
                } thiết bị dùng này`
          }
          hiddenBtnClose={selectedRows.find(
            (q) => q.deviceState === 'CONNECTED',
          )}
          saveTxt={
            selectedRows.find((q) => q.deviceState === 'CONNECTED')
              ? 'Đồng ý'
              : ''
          }
          onClickSave={async () => {
            if (selectedRows.find((q) => q.deviceState === 'CONNECTED')) {
              return setOpenViewDelete(false);
            }
            try {
              const dto = {
                deviceIds: selectedRows.map((o) => o.id),
              };

              await callApi(
                `${API_AC_ADAPTER}/devices/multiple`,
                'DELETE',
                dto,
              );
              utils.showToast('Thành công');
              setOpenViewDelete(false);
              fetchData();
              setReloadTreeView((v) => v + 1);
            } catch (error) {
              utils.showToastErrorCallApi(error);
            }
          }}
          onClose={(v) => setOpenViewDelete(v)}
        />
      )}

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

      <OptionTable
        dataColumnTable={dataColumnTable}
        open={isOpenOptionTable}
        keySaveLocal="columnsSortDevice"
        onSave={(e) => {
          const abc = checkSortTable(e, COLUMNS_LIST_DEVICE);
          setDataColumnTable(abc);
          fetchData();
        }}
        onClose={(v) => setIsOpenOptionTable(v)}
      />

      {openViewSyncDevice && (
        <PopupSyncDevice
          selectedRows={selectedRows}
          onClose={(v) => setOpenViewSyncDevice(v)}
        />
      )}

      {showToast && (
        <CtLoadingDownLoadFile
          titleExportLoading="thiết bị"
          progessDownload={progessDownload}
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
          title="Tải xuống thông tin thiết bị"
          showTitle
          onHidden={() => {
            setOpenExport(false);
          }}
          dragEnabled
          width={600}
          height={230}
        >
          <CtExport
            // params={getParams()}
            fullUrlApi={`${API_HOST}/vf/ac-adapters/v1/devices/export`}
            api="devices"
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
        data={[{ label: 'Thiết bị', key: '1' }]}
        placeholderSearch="Nhập thông tin tìm kiếm...."
        defaultValueSearch={valueFilter.keyword}
        onSearchValueChange={(e) => setValueFilter({ keyword: e, page: 1 })}
        buttonRight={() => (
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
                icon: (
                  <IconBtn
                    icon={<IconDelete />}
                    disabled={selectedRows.length == 0}
                    style={styles.iconBtnHeader}
                    showTooltip="Xóa thiết bị"
                  />
                ),
                width: 40,
                onClick: () => {
                  if (selectedRows.length > 0) {
                    setOpenViewDelete(true);
                  }
                },
              },
              {
                icon: (
                  <IconBtn
                    icon={
                      <IconFilter
                        color={
                          valueFilter?.deviceType ||
                          valueFilter?.status ||
                          valueFilter?.direction ||
                          valueFilter?.devicePosittion
                            ? '#007BFF'
                            : ''
                        }
                      />
                    }
                    style={styles.iconBtnHeader}
                    showTooltip="Bộ lọc"
                  />
                ),
                width: 40,
                onClick: () => setOpenFilter(true),
              },
              {
                icon: (
                  <IconBtn
                    icon={<IconOption />}
                    style={styles.iconBtnHeader}
                    showTooltip="Tùy chỉnh"
                  />
                ),
                width: 40,
                onClick: () => setIsOpenOptionTable(true),
              },
              {
                icon: (
                  <IconBtn
                    icon={<IconSync />}
                    style={styles.iconBtnHeader}
                    disabled={selectedRows.length == 0}
                    showTooltip="Đồng bộ"
                  />
                ),
                width: 40,
                onClick: () => {
                  if (selectedRows.length > 0) {
                    setOpenViewSyncDevice(true);
                  }
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

const styles = {
  iconBtnHeader: {
    backgroundColor: 'rgba(116, 116, 128, 0.08)',
    height: 36,
    width: 36,
    borderRadius: 6,
  },
};

export default ACDevice;
