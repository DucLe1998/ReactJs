/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-globals */

import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import { Popup } from 'devextreme-react/popup';
import React, { useEffect, useState } from 'react';
import { callApi } from 'utils/requestUtils';
import CustomTable from 'components/Custom/table/CustomTable';
import utils from 'utils/utils';
import Loading from 'containers/Loading/Loadable';
import PopupCustom from 'components/Custom/popup/PopupCustom';
import gui from 'utils/gui';
import PageHeader from 'components/PageHeader';
import IconBtn from 'components/Custom/IconBtn';
import { BiFilterAlt } from 'react-icons/bi';
import { COLUMNS_LIST_DEVICE } from '../constants';
import Filter from './filter';

const PopupListDevice = ({ onClose, valueFt, callback }) => {
  const [loading, setLoading] = useState(false);

  const [pageSize, setPageSize] = useState(gui.optionsPageSize[0]);
  const [pageIndex, setPageIndex] = useState(1);
  const [data, setData] = useState('');
  const [valueFilter, setValueFilter] = useState({
    ...valueFt,
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const afterSearch = () => {
    setPageIndex(1);
    setPageSize(gui.optionsPageSize[0]);
  };

  const handleChangePageIndex = (pageIndex) => {
    setPageIndex(pageIndex);
  };

  const handlePageSize = (e) => {
    const { value } = e.target;
    setPageSize(value);
    setPageIndex(1);
  };

  useEffect(() => {
    if (valueFt?.groupId) {
      fetchData();
    }
  }, [valueFilter, pageSize, pageIndex, valueFt.groupId]);

  const fetchData = async () => {
    const payload = {
      keyword: valueFilter.keyword || null,
      page: pageIndex,
      limit: pageSize,
      statuses: valueFilter?.status ? [valueFilter?.status] : null,
      deviceTypeModels: valueFilter?.deviceType || null,
      isAssignedPosition:
        valueFilter?.devicePosittion === 'true'
          ? true
          : valueFilter?.devicePosittion === 'false'
          ? false
          : null,
    };

    const dto = utils.queryString(payload);
    setLoading(true);
    try {
      const res = await callApi(
        `${ACCESS_CONTROL_API_SRC}/devices/in-group/${valueFt?.groupId}/search?${dto}`,
        'GET',
      );
      setData(res.data);
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetValueFilter = (data) => {
    setValueFilter((v) => ({
      ...v,
      status: data?.status?.value || null,
      deviceTypeModels: data?.deviceType?.value || null,
      devicePosittion: data?.devicePosittion?.value || null,
    }));
    setOpenFilter(false);
    afterSearch();
  };

  return (
    <PopupCustom
      onClose={onClose}
      title="Thêm thiết bị"
      width="70%"
      height="auto"
      closeOnOutsideClick
      body={
        <>
          {loading && <Loading />}

          {openFilter && (
            <Popup
              className="popup"
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

          <PageHeader
            showSearch
            showPager
            pageIndex={pageIndex}
            totalCount={data?.count || 0}
            rowsPerPage={pageSize}
            handlePageSize={handlePageSize}
            handleChangePageIndex={handleChangePageIndex}
            onSearchValueChange={(e) => {
              afterSearch();
              setValueFilter((v) => ({ ...v, keyword: e }));
            }}
            placeholderSearch="Tìm kiếm theo tên"
          >
            <IconBtn
              onClick={() => {
                setOpenFilter(true);
              }}
              icon={<BiFilterAlt color="gray" />}
              showTooltip="Bộ lọc"
            />
          </PageHeader>

          <CustomTable
            data={data.rows || []}
            onSelectionChanged={(e) => setSelectedRows(e)}
            height={500}
            row={[
              {
                dataField: 'code',
                caption: 'ID thiết bị',
                alignment: 'center',
              },
              ...COLUMNS_LIST_DEVICE.filter((e) => e.show !== 'index'),
            ]}
          />
        </>
      }
      listBtnFooter={[
        {
          colorText: '#000',
          className: 'btn-cancel',
          label: 'Hủy',
          onClick: () => onClose(false),
        },
        {
          className: 'btn-save',
          label: 'Thêm',
          onClick: () => {
            callback(selectedRows);
            onClose(false);
          },
        },
      ]}
    />
  );
};

export default PopupListDevice;
