import React, { useEffect, useState } from 'react';
import ExportIcon from 'images/icon-button/ic_export.svg';
import { Button } from 'devextreme-react/button';
import PageHeader from '../../components/PageHeader';
import TableCustom from '../../components/TableCustom';
import {showSuccess} from "../../utils/toast-utils";

const initValue = {
  page: 1,
  limit: 25,
};
const val = {
  page: 1,
  limit: 25,
  count: 100,
  rows: [
    {
      date: '10/12/2021',
      empInOut: 1234,
      guestInOut: 20,
      test: 451,
    },
    {
      date: '09/12/2021',
      empInOut: 1234,
      guestInOut: 20,
      test: 451,
    },
    {
      date: '08/12/2021',
      empInOut: 1234,
      guestInOut: 20,
      test: 451,
    },
    {
      date: '07/12/2021',
      empInOut: 1234,
      guestInOut: 20,
      test: 451,
    },
  ],
};

export default function History({ onBack }) {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState(initValue);

  const handlePageSize = e => {
    setQuery({ ...query, limit: e.target.value, page: 1 });
  };
  const handleChangePageIndex = pageIndex => {
    setQuery({ ...query, page: pageIndex });
  };
  const exportFile = () => {
    showSuccess('Xuất file thành công');
  };

  useEffect(() => {
    setData(val);
  }, []);

  return (
    <>
      <PageHeader
        title="Lịch sử lưu thông"
        showPager
        totalCount={data?.count}
        pageIndex={data.page}
        rowsPerPage={data.limit}
        handlePageSize={handlePageSize}
        handleChangePageIndex={handleChangePageIndex}
        showBackButton
        onBack={onBack}
      >
        <Button text="Xuất file" icon={ExportIcon} onClick={exportFile} />
      </PageHeader>
      <TableCustom data={data?.rows || []} columns={getColumns()} />
    </>
  );
}

const getColumns = () => [
  {
    dataField: 'date',
    caption: 'Ngày tháng',
    cssClass: 'valign-center',
    dataType: 'date',
    format: 'dd/MM/yyyy',
    width: '25%',
  },
  {
    dataField: 'empInOut',
    caption: 'Số lượng nhân viên ra vào tòa nhà',
    cssClass: 'valign-center',
    width: '25%',
  },
  {
    dataField: 'guestInOut',
    caption: 'Số lượng khách ra vào tòa nhà',
    cssClass: 'valign-center',
    width: '25%',
  },
  {
    dataField: 'test',
    caption: 'Số lượng phương tiện ra vào bãi gửi xe',
    cssClass: 'valign-center',
    width: '25%',
  },
];
