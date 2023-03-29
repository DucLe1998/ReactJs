/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable consistent-return */
/* eslint-disable radix */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState } from 'react';

import { useHistory } from 'react-router-dom';
import Pagination from 'components/PageHeader/Pagination';
import { callApi } from 'utils/requestUtils';
import CustomTable from 'components/Custom/table/CustomTable';
import useUrlState from '@ahooksjs/use-url-state';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import PopupDelete from 'components/Custom/popup/PopupDelete';
import utils from 'utils/utils';
import HeaderMain from 'components/Custom/Header/HeaderMain';
import Dialog from 'components/Dialog';
import gui from 'utils/gui';
import { IconPlus } from 'components/Custom/Icon/ListIcon';
import Loading from 'containers/Loading/Loadable';

import { COLUMNS_LIST_SCHEDULE } from './constants';
import AddHoliday, { REPEAT_TYPE_LIST } from './popups/AddHoliday';

const initValueFilter = {
  keyword: '',
  keywordHoliday: '',
  limit: 25,
  page: 1,
  tab: '1',
};

export function ACSchedule() {
  const refAcSchedule = useRef({});
  const refAcHolidayGroup = useRef({});
  const history = useHistory();

  const [valueFilter, setValueFilter] = useUrlState(initValueFilter);

  const [listSchedule, setListSchedule] = useState({});

  const [loading, setLoading] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const [openViewDelete, setOpenViewDelete] = useState(false);
  const [isOpenAddHoliday, setIsOpenAddHoliday] = useState(false);
  const [listHoliday, setListHoliday] = useState({});
  const [selectRowsHolidays, setSelectRowsHolidays] = useState([]);
  const [itemDataOnly, setItemDataOnly] = useState('');

  const [dataDeleteSchedule, setDataDeleteSchedule] = useState([]);
  const [dataDeleteHoliday, setDataDeleteHoliday] = useState([]);

  const COLUMNS_LIST_HOLIDAY = [
    {
      caption: 'STT',
      cellRender: (e) => <div>{e.rowIndex + 1}</div>,
      width: 100,
      alignment: 'center',
    },
    {
      dataField: 'name',
      caption: 'Tên',
      cellRender: (e) => (
        <div
          onClick={() => {
            setIsOpenAddHoliday(true);
            setItemDataOnly(e.data);
          }}
          style={{ color: '#7ab8eb', cursor: 'pointer' }}
        >
          {e.value}
        </div>
      ),
    },
    {
      dataField: 'description',
      caption: 'Mô tả',
    },
    {
      dataField: 'type',
      caption: 'Chu kỳ',
      cellRender: (v) => {
        const found = REPEAT_TYPE_LIST.find((a) => a.id === v.value);
        return <div>{found?.text || ''}</div>;
      },
    },
    // {
    //   dataField: 'createBy',
    //   caption: 'Người tạo',
    // },
  ];

  useEffect(() => {
    if (valueFilter?.tab) {
      fetchData();
    }
  }, [valueFilter]);

  const fetchData = () => {
    switch (valueFilter.tab) {
      case '1':
        return fetchDataListSchedule();
      case '2':
        return fetchDataListHoliday();
      default:
        break;
    }
  };

  const fetchDataListHoliday = async () => {
    const payload = {
      keyword: valueFilter.keywordHoliday || null,
      page: parseInt(valueFilter.page),
      limit: parseInt(valueFilter.limit),
    };

    const dto = utils.queryString(payload);

    setLoading(true);
    try {
      const res = await callApi(
        `${ACCESS_CONTROL_API_SRC}/holidays?${dto}`,
        'GET',
      );
      setListHoliday(res.data);
      if (refAcHolidayGroup && refAcHolidayGroup.current) {
        refAcHolidayGroup.current.instance.clearSelection();
      }
      setSelectRowsHolidays([]);
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataListSchedule = async () => {
    const payload = {
      keyword: valueFilter.keyword || null,
      page: parseInt(valueFilter.page),
      limit: parseInt(valueFilter.limit),
    };

    const dto = utils.queryString(payload);

    setLoading(true);
    try {
      const res = await callApi(
        `${ACCESS_CONTROL_API_SRC}/schedules?${dto}`,
        'GET',
      );
      setListSchedule(res.data);
      if (refAcSchedule && refAcSchedule.current) {
        refAcSchedule.current.instance.clearSelection();
      }
      setSelectedRows([]);
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const ViewContentTab = () => {
    switch (valueFilter?.tab) {
      case '2':
        return (
          <>
            <div className="ct-content-main-only">
              <CustomTable
                data={listHoliday?.rows || []}
                onSelectionChanged={(e) => setSelectRowsHolidays(e)}
                row={COLUMNS_LIST_HOLIDAY}
                innerRef={refAcHolidayGroup}
                height={gui.heightTable}
              />
              <div
                style={{
                  marginTop: 20,
                }}
              >
                <Pagination
                  totalCount={listHoliday?.count || 0}
                  pageIndex={parseInt(valueFilter.page || 1)}
                  rowsPerPage={parseInt(valueFilter.limit || 25)}
                  handlePageSize={(e) =>
                    setValueFilter({ limit: e.target.value, page: 1 })
                  }
                  handleChangePageIndex={(e) => setValueFilter({ page: e })}
                />
              </div>
            </div>

            {detailsDrawer}

            {openViewDelete && (
              <PopupDelete
                title="Xác nhận xoá nhóm ngày nghỉ"
                width="600px"
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
                      Các lịch sau đây đang sử dụng đến nhóm ngày nghỉ dự định
                      xóa:
                    </div>
                    <div
                      style={{
                        marginLeft: 12,
                        height: 'auto',
                        maxHeight: 200,
                        overflow: 'auto',
                      }}
                    >
                      {dataDeleteHoliday &&
                        dataDeleteHoliday?.map((item, index) => (
                          <div key={index.toString()}>{item.name}</div>
                        ))}
                    </div>
                    <div style={{ marginTop: 16 }}>
                      Nhóm ngày nghỉ sẽ bị xoá hoàn toàn khỏi hệ thống, bạn có
                      chắc chắn xoá {selectRowsHolidays?.length || 0} nhóm ngày
                      nghỉ này không?
                    </div>
                  </div>
                )}
                onClickSave={async () => {
                  try {
                    const dto = selectRowsHolidays.map((o) => o.id);

                    await callApi(
                      `${ACCESS_CONTROL_API_SRC}/holidays`,
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
          </>
        );

      default:
        return (
          <>
            <div className="ct-content-main-only">
              <CustomTable
                data={listSchedule?.rows || []}
                onSelectionChanged={(e) => setSelectedRows(e)}
                row={COLUMNS_LIST_SCHEDULE}
                innerRef={refAcSchedule}
                height={gui.heightTable}
              />
              <div
                style={{
                  marginTop: 20,
                }}
              >
                <Pagination
                  totalCount={listSchedule?.count || 0}
                  pageIndex={parseInt(valueFilter.page || 1)}
                  rowsPerPage={parseInt(valueFilter.limit || 25)}
                  handlePageSize={(e) =>
                    setValueFilter({ limit: e.target.value, page: 1 })
                  }
                  handleChangePageIndex={(e) => setValueFilter({ page: e })}
                />
              </div>
            </div>

            {openViewDelete && (
              <PopupDelete
                title="Xác nhận xoá lịch hoạt động"
                width="600px"
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
                      Các cấp truy cập cửa và cấp phân tầng đang dùng đến lịch
                      này gồm có:
                    </div>
                    <div
                      style={{
                        marginLeft: 12,
                        height: 'auto',
                        maxHeight: 200,
                        overflow: 'auto',
                      }}
                    >
                      {dataDeleteSchedule &&
                        dataDeleteSchedule?.map((item, index) => (
                          <div key={index.toString()}>{item}</div>
                        ))}
                    </div>
                    <div style={{ marginTop: 16 }}>
                      Lịch hoạt động sẽ bị xoá hoàn toàn khỏi hệ thống, bạn có
                      chắc chắn xoá {selectedRows?.length || 0} lịch hoạt động
                      này không?
                    </div>
                  </div>
                )}
                onClickSave={async () => {
                  try {
                    const dto = selectedRows.map((o) => o.id);

                    await callApi(
                      `${ACCESS_CONTROL_API_SRC}/schedules`,
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
          </>
        );
    }
  };

  const checkValueSearch = () => {
    switch (valueFilter?.tab) {
      case '2':
        return valueFilter.keywordHoliday;
      default:
        return valueFilter.keyword;
    }
  };

  const detailsDrawer = (
    <Dialog
      open={isOpenAddHoliday}
      maxWidth="sm"
      fullWidth
      onClose={() => setIsOpenAddHoliday(false)}
      title="Thêm mới nhóm ngày nghỉ"
    >
      <AddHoliday
        onClose={() => setIsOpenAddHoliday(false)}
        onCloseSuccess={() => {
          setIsOpenAddHoliday(false);
          fetchData();
        }}
        data={itemDataOnly}
        listHoliday={listHoliday}
      />
    </Dialog>
  );

  return (
    <div className="ct-root-page">
      <HeaderMain
        data={[
          { label: 'Lịch hoạt động', key: '1' },
          // { label: 'Nhóm ngày nghỉ', key: '2' },
        ]}
        defaultValueSearch={checkValueSearch()}
        onSearchValueChange={(e) => {
          switch (valueFilter?.tab) {
            case '1':
              return setValueFilter({ keyword: e, page: 1 });
            case '2':
              return setValueFilter({
                page: 1,
                keywordHoliday: e,
              });
            default:
              break;
          }
        }}
        buttonRight={() => {
          switch (valueFilter?.tab) {
            case '1':
              return (
                <div
                  style={{
                    opacity: selectedRows?.length === 0 ? 0.5 : 1,
                    cursor: selectedRows?.length === 0 ? '' : 'pointer',
                  }}
                  disabled={selectedRows?.length === 0}
                  className="ct-flex-row btn-delete"
                  onClick={async () => {
                    if (selectedRows?.length > 0) {
                      setOpenViewDelete(true);
                      try {
                        const dto = selectedRows.map((o) => o.id);

                        const res = await callApi(
                          `${ACCESS_CONTROL_API_SRC}/schedules/find-access-level-by-schedules`,
                          'POST',
                          dto,
                        );
                        setDataDeleteSchedule(res.data);
                      } catch (error) {
                        utils.showToastErrorCallApi(error);
                      }
                    }
                  }}
                >
                  Xóa
                </div>
              );
            case '2':
              return (
                <div
                  style={{
                    opacity: selectRowsHolidays?.length === 0 ? 0.5 : 1,
                  }}
                  disabled={selectRowsHolidays?.length === 0}
                  className="ct-flex-row btn-delete"
                  onClick={async () => {
                    if (selectRowsHolidays?.length > 0) {
                      setOpenViewDelete(true);
                      try {
                        const dto = selectRowsHolidays.map((o) => o.id);

                        const res = await callApi(
                          `${ACCESS_CONTROL_API_SRC}/schedules/find-schedules-by-holidays`,
                          'POST',
                          dto,
                        );
                        setDataDeleteHoliday(res.data);
                      } catch (error) {
                        utils.showToastErrorCallApi(error);
                      }
                    }
                  }}
                >
                  Xóa
                </div>
              );
            default:
              break;
          }
        }}
        ViewLeft={() => {
          switch (valueFilter?.tab) {
            case '2':
              return (
                <div className="ct-flex-row">
                  {[
                    {
                      label: 'Thêm mới',
                      icon: <IconPlus />,
                      width: 115,
                      onClick: () => {
                        setItemDataOnly('');
                        setIsOpenAddHoliday(true);
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
                    </div>
                  ))}
                </div>
              );
            default:
              return (
                <div className="ct-flex-row">
                  {[
                    {
                      label: 'Thêm mới',
                      icon: <IconPlus />,
                      width: 115,
                      onClick: () => {
                        history.push(`/access-control/schedule/create/null`);
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
      {loading && <Loading />}
      {ViewContentTab()}
    </div>
  );
}

export default ACSchedule;
