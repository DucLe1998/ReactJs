import { Button, Tooltip } from '@material-ui/core';
import useAxios from 'axios-hooks';
import PageHeader from 'components/PageHeader';
import { API_IAM } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import DataGrid, { Column, Paging } from 'devextreme-react/data-grid';
import FileSaver from 'file-saver';
import CardIcon from 'images/UserIcons/Card_Icon_Black.svg';
import FacesIcon from 'images/UserIcons/Facescan_Icon_Black.svg';
import FingerIcon from 'images/UserIcons/Fingerprint_Icon_Black.svg';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { showError } from 'utils/toast-utils';
import BarChart from './barChart';

export default function Details(props) {
  const { history, match, location } = props;
  const id = match?.params?.id;
  const intl = useIntl();

  const [filter, setFilter] = useState({
    page: 1,
    limit: 25,
  });
  // company info
  const [{ data: getData, loading: getLoading, error: getError }] = useAxios(
    API_IAM.ORG_UNIT_BY_ID(id),
    {
      useCache: false,
    },
  );
  useEffect(() => {
    if (getError) {
      showError(getError);
    }
  }, [getError]);
  // table data
  const [
    {
      data: getStatisticData,
      loading: getStatisticLoading,
      error: getStatisticError,
    },
    executeGetStatistic,
  ] = useAxios(API_IAM.COMPANY_STATISTIC(id), {
    useCache: false,
    manual: true,
  });
  useEffect(() => {
    if (getData)
      executeGetStatistic({
        params: filter,
      });
  }, [getData, filter]);
  useEffect(() => {
    if (getStatisticError) {
      showError(getStatisticError);
    }
  }, [getStatisticError]);
  const [
    { response: exportData, loading: exportLoading, error: exportError },
    executeExport,
  ] = useAxios(
    {
      url: API_IAM.EXPORT_STATISTIC,
      method: 'POST',
      responseType: 'blob',
    },
    { manual: true },
  );
  useEffect(() => {
    if (exportData) {
      // save file export
      FileSaver.saveAs(exportData, 'TechnoPark Statistic.xlsx');
    }
  }, [exportData]);
  useEffect(() => {
    if (exportError) {
      showError(exportError);
    }
  }, [exportError]);
  function goBack() {
    const from = location?.state?.from;
    if (from) {
      history.push(from);
    } else {
      history.push(`/user/dashboard`);
    }
  }
  const renderHeaderIdentification = type => {
    switch (type) {
      case 'faces':
        return (
          <Tooltip title="Định danh khuôn mặt">
            <img src={FacesIcon} alt="" style={{ width: 40, height: 40 }} />
          </Tooltip>
        );
      case 'finger':
        return (
          <Tooltip title="Định danh vân tay">
            <img src={FingerIcon} alt="" style={{ width: 40, height: 40 }} />
          </Tooltip>
        );
      case 'card':
        return (
          <Tooltip title="Định danh thẻ">
            <img src={CardIcon} alt="" style={{ width: 40, height: 40 }} />
          </Tooltip>
        );

      default:
        return '';
    }
  };
  const renderOrderCell = ({ rowIndex }) => (
    <span>{(filter.page - 1) * filter.limit + rowIndex + 1}</span>
  );
  const columns = [
    {
      caption: intl.formatMessage({ id: 'app.column.order' }),
      width: 'auto',
      alignment: 'center',
      cellRender: renderOrderCell,
    },
    {
      dataField: 'orgUnitName',
      caption: 'Đơn vị',
      allowSorting: false,
      cssClass: 'valign-center',
    },
    {
      dataField: 'fullName',
      caption: 'Tên',
      allowSorting: false,
      cssClass: 'valign-center',
    },
    {
      dataField: 'email',
      caption: 'Email',
      allowSorting: false,
      cssClass: 'valign-center',
      alignment: 'center',
    },
    {
      dataField: 'employeCode',
      caption: 'Mã nhân viên',
      allowSorting: false,
      alignment: 'center',
      cssClass: 'valign-center',
    },
    {
      dataField: 'accessCode',
      caption: 'Mã định danh',
      allowSorting: false,
      alignment: 'center',
      cssClass: 'valign-center',
    },
    {
      dataField: 'phone',
      caption: 'Số điện thoại',
      allowSorting: false,
      alignment: 'center',
      cssClass: 'valign-center',
    },
    {
      dataField: 'position',
      caption: 'Chức vụ',
      allowSorting: false,
      alignment: 'center',
      cssClass: 'valign-center',
    },
    {
      dataField: 'role',
      caption: 'Vai trò',
      allowSorting: false,
      alignment: 'center',
      cssClass: 'valign-center',
    },
    {
      dataField: 'accType',
      caption: 'Loại tài khoản',
      allowSorting: false,
      alignment: 'center',
      cssClass: 'valign-center',
    },
    {
      dataField: 'status',
      caption: 'Trạng thái',
      allowSorting: false,
      alignment: 'center',
      cssClass: 'valign-center',
    },
    {
      dataField: 'faceTotal',
      caption: 'Khuôn mặt',
      allowSorting: false,
      alignment: 'center',
      cssClass: 'valign-center',
      headerCellRender: () => renderHeaderIdentification('faces'),
    },
    {
      dataField: 'fingerTotal',
      caption: 'Vân tay',
      allowSorting: false,
      alignment: 'center',
      cssClass: 'valign-center',
      headerCellRender: () => renderHeaderIdentification('finger'),
    },
    {
      dataField: 'cardTotal',
      caption: 'Thẻ',
      allowSorting: false,
      alignment: 'center',
      cssClass: 'valign-center',
      headerCellRender: () => renderHeaderIdentification('card'),
    },
  ];
  function handlePageSize(e) {
    setFilter({ limit: e.target.value, page: 1 });
  }
  // const handlePropertyChange = e => {
  //   if (e.fullName.includes('sortOrder')) {
  //     if (e.value) {
  //       const direction = e.value == 'asc' ? '+' : '-';
  //       const key = columns[e.fullName.slice(8, -11)].dataField;
  //       setSort(direction + key);
  //     } else setSort(undefined);
  //   }
  // };
  return (
    <Fragment>
      <Helmet>
        <title>{getData?.orgUnitName || 'Thống kê theo đơn vị'}</title>
        <meta name="description" content="Description of AcConfigLevel" />
      </Helmet>
      {(getLoading || getStatisticLoading || exportLoading) && <Loading />}
      <PageHeader
        showBackButton
        title={getData?.orgUnitName || ''}
        onBack={() => goBack()}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={executeExport}
          disabled={!getData}
        >
          Xuất báo cáo
        </Button>
      </PageHeader>
      {getData && <BarChart orgUnitId={id} />}
      <PageHeader
        title="Danh sách nhân viên"
        // showSearch
        // placeholderSearch="Tìm kiếm theo tên, mã đơn vị"
        showPager
        totalCount={getStatisticData?.count || 0}
        pageIndex={filter.page}
        rowsPerPage={filter.limit}
        handleChangePageIndex={pageIndex => {
          setFilter({ ...filter, page: pageIndex });
        }}
        handlePageSize={handlePageSize}
        // onSearchValueChange={newVal => {
        //   setSearch(newVal);
        //   setPage(1);
        // }}
      />
      <DataGrid
        className="center-row-grid"
        dataSource={getStatisticData?.rows || []}
        keyExpr="id"
        noDataText={intl.formatMessage({ id: 'app.no_data' })}
        // onOptionChanged={handlePropertyChange}
        style={{
          height: '100%',
          maxHeight: '388px',
          minHeight: '270px',
          width: '100%',
          maxWidth: '100%',
        }}
        columnAutoWidth
        allowColumnResizing
        showRowLines
        showColumnLines={false}
        rowAlternationEnabled
        sorting={{ mode: 'none' }}
      >
        <Paging enabled={false} />
        {React.Children.toArray(
          columns.map(defs => <Column {...defs} allowEditing={false} />),
        )}
      </DataGrid>
    </Fragment>
  );
}
