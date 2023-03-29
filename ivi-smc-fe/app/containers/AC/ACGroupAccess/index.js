/* eslint-disable react/no-unstable-nested-components */
/**
 *
 * AcConfigGroupAccess
 *
 */
/* eslint-disable consistent-return */
/* eslint-disable radix */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Popup } from 'devextreme-react/popup';
import Pagination from 'components/PageHeader/Pagination';
import { useHistory, Link } from 'react-router-dom';
import CustomTable from 'components/Custom/table/CustomTable';
import OptionTable from 'components/Custom/SortTable/OptionTable';
import { callApi } from 'utils/requestUtils';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import useUrlState from '@ahooksjs/use-url-state';
import PopupDelete from 'components/Custom/popup/PopupDelete';
import utils, { checkSortTable } from 'utils/utils';
import HeaderMain from 'components/Custom/Header/HeaderMain';
import gui from 'utils/gui';
import { IconPlus } from 'components/Custom/Icon/ListIcon';
import Loading from 'containers/Loading/Loadable';
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

export function AcConfigGroupAccess() {
  const classes = useStyles();
  const refAcDoor = useRef({});
  const history = useHistory();
  const [valueFilter, setValueFilter] = useUrlState(initValueFilter);

  const [listGroupAccess, setListGroupAccess] = useState({});
  const [openFilter, setOpenFilter] = useState(false);

  const [loading, setLoading] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenOptionTable, setIsOpenOptionTable] = useState(false);
  const [dataColumnTable, setDataColumnTable] = useState('');
  const [openViewDelete, setOpenViewDelete] = useState(false);

  useEffect(() => {
    fetchData();
  }, [valueFilter]);

  const fetchData = () => {
    if (valueFilter) {
      fetchDataList(valueFilter);
    }
  };

  const COLUMNS_LIST_GROUP_ACCESS = [
    {
      caption: 'STT',
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
      caption: 'Tên',
      cellRender: (e) => (
        <Link to={`/access-control/group-access/update/${e.data.id}`}>
          {e.value}
        </Link>
      ),
    },
    {
      dataField: 'description',
      caption: 'Mô tả',
    },
    {
      caption: 'Cấp truy cập cửa',
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
            {e?.data?.doorAccesses?.length > 0
              ? e?.data?.doorAccesses[0]?.objectName || ''
              : ''}
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
            {e?.data?.doorAccesses?.filter((o) => o?.objectName)?.length || ''}
          </div>
        </div>
      ),
    },
    {
      // dataField: 'userGroups.name',
      caption: 'Nhóm người',
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
            {e?.data?.userGroups?.length > 0
              ? e?.data?.userGroups[0]?.objectName || ''
              : ''}
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
            {e?.data?.userGroups?.length || ''}
          </div>
        </div>
      ),
    },
    {
      // dataField: 'users.name',
      caption: 'Người',
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
            {e?.data?.users?.length > 0
              ? e?.data?.users[0]?.objectName || ''
              : ''}
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
            {e?.data?.users?.length || ''}
          </div>
        </div>
      ),
    },
    {
      dataField: 'userCreateBy',
      caption: 'Người tạo',
    },
  ];

  const columnsSortTable = localStorage.getItem('columnsSortDoor');
  const newSortTable = JSON.parse(columnsSortTable);

  useEffect(() => {
    if (newSortTable && newSortTable.length > 0) {
      const abc = checkSortTable(newSortTable, COLUMNS_LIST_GROUP_ACCESS);
      setDataColumnTable(abc);
    } else {
      setDataColumnTable(COLUMNS_LIST_GROUP_ACCESS);
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

  const fetchDataList = async () => {
    const payload = {
      keyword: valueFilter.keyword || null,
      page: parseInt(valueFilter.page),
      limit: parseInt(valueFilter.limit),
    };

    const dto = utils.queryString(payload);

    setLoading(true);
    try {
      const res = await callApi(
        `${ACCESS_CONTROL_API_SRC}/access-groups?${dto}`,
        'GET',
      );
      setListGroupAccess(res.data);
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
            data={listGroupAccess.rows || []}
            onSelectionChanged={(e) => setSelectedRows(e)}
            row={COLUMNS_LIST_GROUP_ACCESS}
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
            totalCount={listGroupAccess?.count || 0}
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
          title="Xác nhận xóa quản lý nhóm quyền truy cập"
          textFollowTitleFunc={() => (
            <div
              style={{
                opacity: 0.6,
                color: '#000',
                fontSize: 18,
                fontWeight: 400,
              }}
            >
              Quản lý nhóm quyền truy nhập máy sẽ bị xoá hoàn toàn khỏi hệ
              thống, bạn có chắc chắn xoá {selectedRows?.length || 0} nhóm quyền
              truy nhập này không?
            </div>
          )}
          onClickSave={async () => {
            try {
              const dto = selectedRows.map((o) => o.id);
              await callApi(
                `${ACCESS_CONTROL_API_SRC}/access-groups/multi`,
                'DELETE',
                dto,
              );
              utils.showToast('Thành công');
              setOpenViewDelete(false);
              fetchData();
            } catch (error) {
              utils.showToastErrorCallApi(error);
            }
          }}
          onClose={(v) => setOpenViewDelete(v)}
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
          const abc = checkSortTable(e, COLUMNS_LIST_GROUP_ACCESS);
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
        data={[{ label: 'Danh sách quản lý nhóm quyền truy cập', key: '1' }]}
        defaultValueSearch={valueFilter.keyword}
        onSearchValueChange={(e) => setValueFilter({ keyword: e, page: 1 })}
        buttonRight={() => {
          switch (valueFilter?.tab) {
            default:
              return (
                <div
                  style={{
                    opacity: selectedRows?.length === 0 ? 0.5 : 1,
                  }}
                  disabled={selectedRows?.length === 0}
                  className="ct-flex-row btn-delete"
                  onClick={() => {
                    if (selectedRows?.length > 0) {
                      setOpenViewDelete(true);
                    }
                  }}
                >
                  Xóa
                </div>
              );
          }
        }}
        ViewLeft={() => {
          switch (valueFilter?.tab) {
            default:
              return (
                <div className="ct-flex-row">
                  {[
                    {
                      label: 'Thêm mới',
                      icon: <IconPlus />,
                      width: 115,
                      onClick: () => {
                        history.push(
                          `/access-control/group-access/create/null`,
                        );
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
              );
          }
        }}
      />
      {ViewContentTab()}
    </div>
  );
}

export default AcConfigGroupAccess;
