/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-unstable-nested-components */
/**
 *
 * AcConfigDoor
 *
 */
/* eslint-disable consistent-return */
/* eslint-disable radix */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Popup } from 'devextreme-react/popup';
import { useHistory, Link } from 'react-router-dom';
import CustomTable from 'components/Custom/table/CustomTable';
import Pagination from 'components/PageHeader/Pagination';
import OptionTable from 'components/Custom/SortTable/OptionTable';
import useUrlState from '@ahooksjs/use-url-state';
import PopupDelete from 'components/Custom/popup/PopupDelete';
import { callApi } from 'utils/requestUtils';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import Loading from 'containers/Loading';
import utils, { checkSortTable } from 'utils/utils';
import { Button } from 'devextreme-react/button';
import HeaderMain from 'components/Custom/Header/HeaderMain';
import gui from 'utils/gui';
import { IconPlus } from 'components/Custom/Icon/ListIcon';
import Filter from './popups/filter';

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

export function AcConfigDoor() {
  const classes = useStyles();
  const refAcDoor = useRef({});
  const history = useHistory();
  const [valueFilter, setValueFilter] = useUrlState(initValueFilter);

  const [listDoorAccess, setListDoorAccess] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [accessGroupList, setAccessGroupList] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenOptionTable, setIsOpenOptionTable] = useState(false);
  const [dataColumnTable, setDataColumnTable] = useState('');
  const [openViewDelete, setOpenViewDelete] = useState(false);
  const [isSort, setIsSort] = useState(false);

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
          icon: (
            <Button icon="sortdowntext" stylingMode="text" disabled={isSort} />
          ),
          width: widthColumn,
          onClick: () => {
            if (!isSort) fetchDataSortList();
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

  const COLUMNS_LIST_DOOR = [
    {
      caption: 'STT',
      key: 1,
      id: 1,
      cellRender: (item) => (
        <div style={{ textAlign: 'left' }}>
          {(valueFilter.page - 1) * valueFilter.limit + (item.rowIndex + 1)}
        </div>
      ),
      alignment: 'left',
      width: 40,
    },
    {
      dataField: 'name',
      // caption: 'Tên',
      key: 2,
      id: 2,
      width: 300,
      cellRender: (e) => (
        <Link to={`/access-control/door-access/edit/${e.data.id}`}>
          {e.data.name}
        </Link>
      ),
      headerCellRender: () => renderHeaderCell('Tên', 280),
    },
    {
      dataField: 'description',
      caption: 'Mô tả',
      key: 3,
      id: 3,
    },
    {
      // dataField: 'policies[0].doorName',
      caption: 'Cửa',
      key: 4,
      id: 4,
      cellRender: (e) => (
        <div
          className="ct-flex-row"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 14,
            paddingRight: 4,
            cursor: 'pointer',
            color: '#333',
            fontWeight: 400,
            minHeight: 25,
            paddingLeft: 4,
          }}
        >
          <div>{e.data.policies[0].doorName}</div>
          <div
            style={{
              borderRadius: 8,
              backgroundColor: '#E4E4E4',
              padding: '0 5px 0 5px',
              fontSize: 14,
              fontWeight: 400,
              color: '#333',
            }}
          >
            {e.data.policies.length}
          </div>
        </div>
      ),
    },
    {
      // dataField: 'policies[0].schedule.name',
      caption: 'Lịch',
      key: 5,
      id: 5,
      cellRender: (e) => (
        <div
          className="ct-flex-row"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 14,
            paddingRight: 4,
            cursor: 'pointer',
            color: '#333',
            fontWeight: 400,
            minHeight: 25,
            paddingLeft: 4,
          }}
        >
          <div>
            {e.data.policies[0].schedule
              ? e.data.policies[0].schedule.name
              : 'Luôn luôn'}
          </div>
          <div
            style={{
              borderRadius: 8,
              backgroundColor: '#E4E4E4',
              padding: '0 5px 0 5px',
              fontSize: 14,
              fontWeight: 400,
              color: '#333',
            }}
          >
            {e.data.policies.length}
          </div>
        </div>
      ),
    },
    {
      dataField: 'lastUpdatedByUser.fullName',
      caption: 'Người cập nhật',
      key: 6,
      id: 6,
    },
  ];

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
  // Reserved
  const handleSetValueFilter = (data) => {
    const newDto = {
      status: data?.status?.value || undefined,
      page: 1,
    };
    setValueFilter(newDto);
    setOpenFilter(false);
  };

  const fetchDataList = async () => {
    const payload = {
      keyword: valueFilter.keyword || null,
      page: parseInt(valueFilter.page),
      limit: parseInt(valueFilter.limit),
    };

    const dto = utils.queryString(payload);
    setIsSort(false);

    setLoading(true);
    try {
      const res = await callApi(
        `${ACCESS_CONTROL_API_SRC}/door-accesses?${dto}`,
        'GET',
      );
      setListDoorAccess(res.data);
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

  const fetchDataSortList = async () => {
    const payload = {
      keyword: valueFilter.keyword || null,
      page: parseInt(valueFilter.page),
      limit: parseInt(valueFilter.limit),
    };

    const dto = utils.queryString(payload);
    setIsSort(true);

    setLoading(true);
    try {
      const res = await callApi(
        `${ACCESS_CONTROL_API_SRC}/door-accesses?${dto}`,
        'GET',
      );
      const { rows, ...rest } = res.data;
      setListDoorAccess({
        rows: rows.sort((a, b) => `${a.name}`.localeCompare(b.name)),
        ...rest,
      });
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

  const ViewContentTab = () => (
    <>
      <div className="ct-content-main-only">
        {dataColumnTable && (
          <CustomTable
            data={listDoorAccess.rows || []}
            onSelectionChanged={(e) => setSelectedRows(e)}
            row={COLUMNS_LIST_DOOR}
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
            totalCount={listDoorAccess?.count || 0}
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

      {openViewDelete && (
        <PopupDelete
          title="Xác nhận xóa quản lý truy cập cửa"
          textFollowTitleFunc={() => (
            <div
              style={{
                opacity: 0.6,
                color: '#000',
                fontSize: 18,
                fontWeight: 400,
              }}
            >
              <div>
                Các nhóm quyền truy cập đang sử dụng đến cấp phân tầng này gồm
                có:
              </div>
              <div
                style={{
                  marginLeft: 12,
                  height: 'auto',
                  maxHeight: 200,
                  overflow: 'auto',
                }}
              >
                {accessGroupList &&
                  accessGroupList?.map((item, index) => (
                    <div key={index.toString()}>- Nhóm quyền {item}</div>
                  ))}
              </div>
              <div style={{ marginTop: 16 }}>
                Quản lý truy cập cửa sẽ bị xoá hoàn toàn khỏi hệ thống, bạn có
                chắc chắn xoá {selectedRows?.length || 0} quản lý truy cập cửa
                này không?
              </div>
            </div>
          )}
          onClickSave={async () => {
            try {
              const dto = selectedRows.map((o) => o.id);
              await callApi(
                `${ACCESS_CONTROL_API_SRC}/door-accesses/multi`,
                'DELETE',
                dto,
              );
              utils.showToast('Thành công');
              setOpenViewDelete(false);
              fetchData();
              setAccessGroupList([]);
            } catch (error) {
              utils.showToastErrorCallApi(error);
            }
          }}
          onClose={(v) => {
            setOpenViewDelete(v);
            setAccessGroupList([]);
          }}
        />
      )}
      {/* Reserved */}
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
      {/* Reserved */}
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
    </>
  );

  return (
    <div className="ct-root-page">
      <HeaderMain
        data={[{ label: 'Danh sách quản lý truy cập cửa', key: '1' }]}
        defaultValueSearch={valueFilter.keyword}
        onSearchValueChange={(e) => setValueFilter({ keyword: e, page: 1 })}
        buttonRight={() => (
          <div
            style={{
              opacity: selectedRows?.length === 0 ? 0.5 : 1,
            }}
            disabled={selectedRows?.length === 0}
            className="ct-flex-row btn-delete"
            onClick={async () => {
              if (selectedRows?.length > 0) {
                setOpenViewDelete(true);
                try {
                  const dto = selectedRows.map((o) => o.id);
                  const res = await callApi(
                    `${ACCESS_CONTROL_API_SRC}/door-accesses/notice-information`,
                    'POST',
                    dto,
                  );
                  const cv = res.data.map((o) => o.accessGroupNotices);
                  const nameAG = cv[0].map((o) => o.accessGroupName);
                  for (let i = 1; i < cv.length; i++) {
                    const temp = cv[i].map((o) => o.accessGroupName);
                    for (let k = 0; k < temp.length; k++) nameAG.push(temp[k]);
                  }
                  // Remove duplicated Access group
                  const nameAGFinal = [nameAG[0]];
                  for (let i = 1; i < nameAG.length; i++) {
                    for (let k = 0; k < nameAGFinal.length; k++) {
                      if (nameAG[i] === nameAGFinal[k]) {
                        break;
                      }
                      if (
                        nameAG[i] !== nameAGFinal[k] &&
                        k === nameAGFinal.length - 1
                      ) {
                        nameAGFinal.push(nameAG[i]);
                        break;
                      }
                    }
                  }
                  setAccessGroupList(nameAGFinal);
                } catch (error) {
                  error?.response !== undefined
                    ? utils.showToastErrorCallApi(error)
                    : '';
                }
              }
            }}
          >
            Xóa
          </div>
        )}
        ViewLeft={() => (
          <div className="ct-flex-row">
            {[
              {
                label: 'Thêm mới',
                icon: <IconPlus />,
                width: 115,
                onClick: () => {
                  history.push(`/access-control/door-access/create`);
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

export default AcConfigDoor;
