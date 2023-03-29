import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Popup } from 'devextreme-react/popup';
import axios from 'axios';
import useUrlState from '@ahooksjs/use-url-state';
import utils, { checkSortTable } from 'utils/utils';
import IconBtn from 'components/Custom/IconBtn';
import Pagination from 'components/PageHeader/Pagination';
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
import HeaderMain from 'components/Custom/Header/HeaderMain';

// COLUME TABLE
import { COLUMNS_LIST } from './constants';
import CustomTable from 'components/Custom/table/CustomTable';


// Mocdata
import { deviceList } from '../Mocdata/device';

const initValueFilter = {
  keyword: '',
  limit: 25,
  page: 1,
};
const useStyles = makeStyles(() => ({
  filter: {
    zIndex: '1299 !important',
  },
}));

export function Device() { 
  const classes = useStyles();
  const ref = useRef({});
  const [valueFilter, setValueFilter] = useUrlState(initValueFilter);
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
      fetchDataListDevice(valueFilter);
      console.log('abc')
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
  const ViewContentTab = () => ( 
    <>
      {loading && <Loading />}
      <div className="ct-content-main-only">
        <CustomTable
          data={deviceList?.rows || []}
          //onSelectionChanged={(e) => setSelectRowsHolidays(e)}
          row={COLUMNS_LIST}
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
        
      />
      {ViewContentTab()}
    </div>
  );
}

export default Device;