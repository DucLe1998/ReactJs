/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable consistent-return */
/* eslint-disable radix */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import BtnSuccess from 'components/Button/BtnSuccess';
import { Popup } from 'devextreme-react/popup';
import { useHistory } from 'react-router-dom';
import CustomTable from 'components/Custom/table/CustomTable';
import TreeViewGroup from 'components/Custom/AreaTree/TreeViewGroup';
import OptionTable from 'components/Custom/SortTable/OptionTable';
import useUrlState from '@ahooksjs/use-url-state';
import IconBtn from 'components/Custom/IconBtn';
import { callApi } from 'utils/requestUtils';
import PopupDelete from 'components/Custom/popup/PopupDelete';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import utils, { checkSortTable } from 'utils/utils';
import axios from 'axios';
import CtLoadingDownLoadFile from 'components/Custom/Download/CtLoadingDownLoadFile';
import CtExport from 'components/Custom/Download/CtExport';
import HeaderMain from 'components/Custom/Header/HeaderMain';
import Pagination from 'components/PageHeader/Pagination';
import gui from 'utils/gui';
import {
  IconDelete,
  IconDownLoad,
  IconFilter,
  IconPlus,
} from 'components/Custom/Icon/ListIcon';
import Loading from 'containers/Loading/Loadable';
import Filter from './popups/filter';
import { COLUMNS_LIST_DOOR } from './constants';

const useStyles = makeStyles(() => ({
  filter: {
    zIndex: '1299 !important',
  },
}));

const initValueFilter = {
  keyword: '',
  limit: 25,
  page: 1,
};

export function ACDoor() {
  const classes = useStyles();
  const refAcDoor = useRef({});
  const history = useHistory();
  const [valueFilter, setValueFilter] = useUrlState(initValueFilter);

  const [listDoor, setListDoor] = useState({});
  const [openFilter, setOpenFilter] = useState(false);

  const [loading, setLoading] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenOptionTable, setIsOpenOptionTable] = useState(false);
  const [dataColumnTable, setDataColumnTable] = useState('');
  const [openViewDelete, setOpenViewDelete] = useState(false);
  const [reloadTreeView, setReloadTreeView] = useState(0);

  // download file
  const cancelFileUpload = useRef(null);
  const [openExport, setOpenExport] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isCancelDownload, setIsCancelDownload] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(
    axios.CancelToken.source(),
  );
  const [progessDownload, setProgessDownload] = useState(0);

  const [isOpenLockElevator, setIsOpenLockElevator] = useState(false);
  const [isOpenFreeElevator, setIsOpenFreeElevator] = useState(false);
  const [isOpenNormalElevator, setIsOpenNormalElevator] = useState(false);

  useEffect(() => {
    fetchData();
  }, [valueFilter]);

  const fetchData = () => {
    if (valueFilter.groupId) {
      fetchDataList(valueFilter.groupId);
    }
  };

  const columnsSortTable = localStorage.getItem('columnsSortDoor');
  const newSortTable = JSON.parse(columnsSortTable);

  useEffect(() => {
    if (newSortTable && newSortTable.length > 0) {
      const abc = checkSortTable(newSortTable, COLUMNS_LIST_DOOR);
      setDataColumnTable(abc);
    } else {
      setDataColumnTable(COLUMNS_LIST_DOOR);
    }
  }, []);

  const handleSetValueFilter = (data) => {
    const newDto = {
      status: data?.status?.value || undefined,
      page: 1,
    };
    setValueFilter(newDto);
    setOpenFilter(false);
  };

  const fetchDataList = async (id) => {
    const payload = {
      keyword: valueFilter.keyword || null,
      page: parseInt(valueFilter.page),
      limit: parseInt(valueFilter.limit),
      doorStatuses: valueFilter?.status || null,
      doorGroupIds: [id],
    };

    const dto = utils.queryString(payload);

    setLoading(true);
    try {
      const res = await callApi(
        `${ACCESS_CONTROL_API_SRC}/doors?${dto}`,
        'GET',
      );
      setListDoor(res.data);
      if (refAcDoor && refAcDoor.current) {
        refAcDoor.current.instance.clearSelection();
      }
      setSelectedRows([]);
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelDownload = () => {
    if (cancelFileUpload.current) cancelFileUpload.current();
  };

  const cancelDownloadAxios = (v) => {
    cancelFileUpload.current = v;
  };

  const callApiUpdateModeElevator = async (data, mode) => {
    const dto = {
      mode,
      ids: data.map((e) => e.id),
    };

    setLoading(true);
    try {
      await callApi(`${ACCESS_CONTROL_API_SRC}/doors/change-mode`, 'POST', dto);
      setIsOpenFreeElevator(false);
      setIsOpenLockElevator(false);
      setIsOpenNormalElevator(false);
      setSelectedRows([]);
      utils.showToast('Thành công!');
      if (refAcDoor && refAcDoor.current) {
        refAcDoor.current.instance.clearSelection();
      }
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

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
            api="door"
            textApi="cửa"
            titleDelete="Xóa nhóm cửa"
            ContentDelete="Việc xoá nhóm cửa sẽ ảnh hưởng đến nhóm quyền truy cập, và cấp
            truy cập cửa"
            elementTotal="totalDoor"
            reloadTreeView={reloadTreeView}
            groupId={valueFilter.groupId}
            callback={(e) => {
              setValueFilter({ page: 1, groupId: e });
            }}
            callbackReload={() => fetchData()}
          />
        </div>
        <div className="ct-content-main-right">
          {dataColumnTable && (
            <CustomTable
              data={listDoor.rows || []}
              onSelectionChanged={(e) => setSelectedRows(e)}
              row={dataColumnTable}
              innerRef={refAcDoor}
              height={gui.heightTable}
            />
          )}
          <div
            style={{
              marginTop: 20,
            }}
          >
            <Pagination
              totalCount={listDoor?.count || 0}
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
          title="Xác nhận xóa cửa"
          textFollowTitle={`Cửa sẽ bị xoá hoàn toàn khỏi hệ thống, bạn có chắc chắn xoá
          ${selectedRows?.length || 0} cửa dùng này`}
          onClickSave={async () => {
            try {
              const dto = selectedRows.map((o) => o.id);
              await callApi(
                `${ACCESS_CONTROL_API_SRC}/doors/multi`,
                'DELETE',
                dto,
              );
              utils.showToast('Thành công');
              setOpenViewDelete(false);
              setReloadTreeView((v) => v + 1);
              fetchData();
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
        keySaveLocal="columnsSortDoor"
        onSave={(e) => {
          const abc = checkSortTable(e, COLUMNS_LIST_DOOR);
          setDataColumnTable(abc);
          fetchData();
        }}
        onClose={(v) => setIsOpenOptionTable(v)}
      />

      {showToast && (
        <CtLoadingDownLoadFile
          progessDownload={progessDownload}
          titleExportLoading="cửa"
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
          title="Tải xuống thông tin cửa"
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
            api="doors"
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

      {isOpenFreeElevator && (
        <PopupDelete
          title="Xả cửa"
          textFollowTitle="Xả cửa sẽ cho phép người dùng vào bất kỳ phòng nào trong tòa nhà, bạn có chắc chắn xả cửa này"
          onClickSave={() => callApiUpdateModeElevator(selectedRows, 'FREE')}
          onClose={(v) => setIsOpenFreeElevator(v)}
          saveTxt="Đồng ý"
        />
      )}

      {isOpenLockElevator && (
        <PopupDelete
          title="Khóa cửa"
          textFollowTitle="Khóa cửa sẽ dừng hoạt động của cửa trong tòa nhà, bạn có chắc chắn khóa cửa này"
          onClickSave={() => callApiUpdateModeElevator(selectedRows, 'LOCKED')}
          onClose={(v) => setIsOpenLockElevator(v)}
          saveTxt="Đồng ý"
        />
      )}

      {isOpenNormalElevator && (
        <PopupDelete
          title="Đặt lại chế độ"
          textFollowTitle="Đặt lại chế độ sẽ thay đổi cài đặt trước đó, bạn có chắc chắn muốn đặt lại chế độ cửa này"
          onClickSave={() => callApiUpdateModeElevator(selectedRows, 'NORMAL')}
          onClose={(v) => setIsOpenNormalElevator(v)}
          saveTxt="Đồng ý"
        />
      )}
    </>
  );

  return (
    <div className="ct-root-page">
      <HeaderMain
        data={[{ label: 'Danh sách cửa', key: '1' }]}
        placeholderSearch="Nhập thông tin tìm kiếm...."
        defaultValueSearch={valueFilter.keyword}
        onSearchValueChange={(e) => setValueFilter({ keyword: e, page: 1 })}
        buttonRight={() => (
          <div className="ct-flex-row">
            {[
              {
                icon: (
                  <IconBtn
                    icon={<IconPlus />}
                    style={styles.iconBtnHeader}
                    showTooltip="Tạo mới"
                  />
                ),
                width: 40,
                onClick: () => history.push(`/ac-door/add/null`),
              },
              {
                icon: (
                  <IconBtn
                    icon={<IconDownLoad />}
                    style={styles.iconBtnHeader}
                    showTooltip="Tải xuống"
                  />
                ),
                width: 40,
                onClick: () => setOpenExport(true),
              },
              {
                icon: (
                  <IconBtn
                    icon={
                      <IconFilter
                        color={valueFilter?.status ? '#007BFF' : ''}
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
                    icon={<IconDelete />}
                    style={styles.iconBtnHeader}
                    disabled={selectedRows.length == 0}
                    showTooltip="Xóa"
                  />
                ),
                width: 40,
                onClick: () => {
                  if (selectedRows.length > 0) {
                    setOpenViewDelete(true);
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

            <BtnSuccess
              style={{
                ...styles.btnCreateFilter,
                width: 95,
                backgroundColor: '#D14848',
              }}
              disabled={selectedRows?.length <= 0}
              className="ct-flex-row"
              onClick={() => setIsOpenLockElevator(true)}
            >
              Khóa cửa
            </BtnSuccess>
            <BtnSuccess
              style={{
                ...styles.btnCreateFilter,
                width: 95,
                backgroundColor: '#FFFBFB',
                border: '1px solid #D14848',
                color: '#D14848',
              }}
              disabled={selectedRows?.length <= 0}
              className="ct-flex-row"
              onClick={() => setIsOpenFreeElevator(true)}
            >
              Xả cửa
            </BtnSuccess>
            <BtnSuccess
              style={{
                ...styles.btnCreateFilter,
                width: 120,
                backgroundColor: '#FFFFFF',
                border: '1px solid #6589FF',
                color: '#6589FF',
              }}
              disabled={selectedRows?.length <= 0}
              className="ct-flex-row"
              onClick={() => setIsOpenNormalElevator(true)}
            >
              Đặt lại chế độ
            </BtnSuccess>
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
  btnCreateFilter: {
    backgroundColor: '#109CF1',
    width: 122,
    height: 32,
    borderRadius: 90,
    marginLeft: 12,
    justifyContent: 'center',
    color: '#FFF',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
  },
};

export default ACDoor;
