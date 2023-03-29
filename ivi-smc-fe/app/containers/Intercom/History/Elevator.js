import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import useUrlState from '@ahooksjs/use-url-state';
import utils, { checkSortTable } from 'utils/utils';
import IconBtn from 'components/Custom/IconBtn';
import Pagination from 'components/PageHeader/Pagination';
import gui from 'utils/gui';
import {
  IconArrowDown,
  IconDelete,
  IconEdit,
  IconDownLoad,
  IconFilter,
  IconOption,
  IconSync,
} from 'components/Custom/Icon/ListIcon';
import Loading from 'containers/Loading/Loadable';
import { callApi } from 'utils/requestUtils';
import HeaderMain from 'components/Custom/Header/HeaderMain';
import { IconPlus } from 'components/Custom/Icon/ListIcon';

// Popup
import Dialog from 'components/Dialog';
import { Popup } from 'devextreme-react/popup';
import Add from './popups/Add';
import Delete from './popups/Delete';
import Filter from './popups/Filter';
import PopupDelete from 'components/Custom/popup/PopupDelete';


// COLUME TABLE
import { COLUMNS_LIST, initValueFilter, titlePopup } from '../constants/elevator';
import CustomTable from 'components/Custom/table/CustomTable';

// Mocdata
import { deviceList } from '../Mocdata/elevator';


const useStyles = makeStyles(() => ({
  filter: {
    zIndex: '1299 !important',
  },
}));

export function Elevator() { 
  const classes = useStyles();
  const ref = useRef({});
  const [valueFilter, setValueFilter] = useUrlState(initValueFilter);
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
      fetchDataListDevice(valueFilter);
  }, [valueFilter]);
  const fetchDataListDevice = async (id) => {
    const payload = {
      keyword: valueFilter.keyword || null,
      page: parseInt(valueFilter.page),
      limit: parseInt(valueFilter.limit),
      //deviceGroupId: id,
    };

    // setLoading(true);
    // try {
    //   const res = await callApi(`${API_AC_ADAPTER}/devices?${dto}`, 'GET');
    //   setListDevice(res);
    //   if (refAcDevice && refAcDevice.current) {
    //     refAcDevice.current.instance.clearSelection();
    //   }
    //   setSelectedRows([]);
    // } catch (error) {
    //   utils.showToastErrorCallApi(error);
    // } finally {
    //   setLoading(false);
    // }
  };
  const handleSetValueFilter = (data) => {
    const newDto = {
      ...valueFilter,
      ...data,
      page: 1,
    };
    setValueFilter(newDto);
    setOpenFilter(false);
  };
  const ViewContentTab = () => ( 
    <>
      {loading && <Loading />}
      <div className="ct-content-main-only">
        <CustomTable
          data={deviceList?.rows || []}
          //onSelectionChanged={(e) => setSelectRowsHolidays(e)}
          row={[
            ...COLUMNS_LIST,
            {
              dataField: 'Hành động',
              alignment: 'center',
              cellRender: (v) => (
                <div className="ct-flex-row">
                  <IconBtn
                    icon={<IconDelete />}
                    onClick={() => {
                      // setDataState(
                      //   deviceList.rows.filter((e) => e.id !== v.data.id),
                      // );
                    }}
                  />
                  <IconBtn
                    icon={<IconEdit />}
                    onClick={() => {
                      // setDataState(
                      //   deviceList.rows.filter((e) => e.id !== v.data.id),
                      // );
                    }}
                  />
                </div>
                
              ),
            },
          ]}
          disabledSelect
        />
        <div
          style={{
            marginTop: 20,
          }}
        >
          <Pagination
            totalCount={deviceList?.count || 0}
            pageIndex={parseInt(valueFilter.page || 1)}
            rowsPerPage={parseInt(valueFilter.limit || 25)}
            handlePageSize={(e) =>
              setValueFilter({ limit: e.target.value, page: 1 })
            }
            handleChangePageIndex={(e) => setValueFilter({ page: e })}
          />
        </div>
      </div>
      
    </>
  );
  return (
    <div className="ct-root-page">
      <HeaderMain
        data={[{ label: 'Thiết bị', key: '1' }]}
        placeholderSearch="Nhập thông tin tìm kiếm...."
        defaultValueSearch={valueFilter.keyword}
        onSearchValueChange={(e) => setValueFilter({ keyword: e, page: 1 })}
        ViewLeft={() => { 
          return (
            <div className="ct-flex-row">
              {[
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
                  label: 'Thêm mới',
                  icon: <IconPlus />,
                  width: 115,
                  onClick: () => {
                    setIsOpenAdd(true);
                    //history.push(`/access-control/schedule/create/null`);
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
          )
        }}
      />
      {openFilter && (
        <Popup
          className={`${classes.filter} popup`}
          visible
          title={titlePopup.filter}
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
      {isOpenAdd && (
        <Popup
          className={`${classes.filter} popup`}
          visible
          title={editId ? titlePopup.edit : titlePopup.add}
          showTitle
          onHidden={() => {
            setIsOpenAdd(false);
          }}
          width="50%"
          height="auto"
        >
          <Add
            onClose={() => setIsOpenAdd(false)}
            id={editId}
            setReload={() => setReload(reload + 1)}
          />
        </Popup>
      )}
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
export default Elevator;