import { Badge, Tooltip } from '@material-ui/core';
import { IconFilter, IconExport } from 'constant/ListIcons';
import { Popup } from 'devextreme-react/popup';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { IconButtonHeader } from '../../components/CommonComponent';
import PageSearch from '../../components/PageHeader';
import TableCustom from '../../components/TableCustom';
import { getApi } from '../../utils/requestUtils';
import { showError } from '../../utils/toast-utils';
import { API_PARKING_LOT, API_FILE } from '../apiUrl';
import { getErrorMessage } from '../Common/function';
import Loading from '../Loading';
import { useStyles } from './styled';
import Filter from './creens/FilterMonth';
const initialFilter = {
  keyword: null,
  timeFrom: null,
  timeTo: null,
  limit: 25,
  page: 1,
};

export function ParkingMonthReport() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [reload, setReload] = useState(0);
  const [filter, setFilter] = useState(initialFilter);
  const isFilter = (filterOp) => {
    const { keyword, limit, page, ...filter } = filterOp;
    return Object.values(filter).filter((v) => !!v && String(v).length).length;
  };
  const [showFilter, setShowFilter] = useState(isFilter(filter));
  const fetchDataSource = async () => {
    setLoading(true);
    const params = {
      keyword: filter.keyword || '',
      limit: filter.limit,
      timeFrom: filter.timeFrom,
      timeTo: filter.timeTo,
      page: filter.page,
    };

    await getApi(`${API_PARKING_LOT.PARKING_PROMOTE}`, _.pickBy(params))
      .then((response) => {
        // setDataSource(dataRow);
        setDataSource(response);
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });

    setShowFilter(isFilter(params));
  };

  useEffect(() => {
    fetchDataSource();
  }, [reload, filter]);

  const onSuccessFilter = (values) => {
    const newParams = { ...filter, ...values, page: 1 };
    setFilter(newParams);
    setShowPopupFilter(false);
    setShowFilter(isFilter(newParams));
  };

  const renderDownload = ({ data }) => {
    if (data?.fileId) {
      return (
        <a
          href={API_FILE.DOWNLOAD_PUBLIC_FILE(data?.fileId)}
          target="_blank"
          download
        >
          {data?.name}
        </a>
      );
    }
    return data?.name;
  };
  const columns = [
    {
      caption: 'STT',
      alignment: 'center',
      cellRender: (props) =>
        props?.rowIndex + 1 + filter.limit * (filter.page - 1),
      minWidth: 40,
      width: 'auto',
    },
    {
      dataField: 'name',
      caption: 'Tên gói',
      // cellRender: renderDownload,
      minWidth: 100,
      width: 'auto',
    },
    {
      dataField: 'code',
      caption: 'ID gói',
      width: 'auto',
      minWidth: 100,
    },
    {
      dataField: 'dscr',
      caption: 'Mô tả',
      alignment: 'left',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'availableAt',
      caption: 'Ngày bắt đầu',
      dataType: 'date',
      format: 'dd/MM/yyyy',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'expiredAt',
      caption: 'Ngày kết thúc',
      dataType: 'date',
      format: 'dd/MM/yyyy',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'usedCount',
      caption: 'Số lượt đã dùng',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'maxUseLimit',
      caption: 'Số lượng tối đa',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'wlvehComs',
      caption: 'Các hãng xe áp dụng',
      cellTemplate: (container, options) => {
        const textStr = options.value
          ? options.value.map((x) => x.name).join`,`
          : 'Tất cả';
        container.title = textStr;
        container.textContent = textStr;
      },
      width: 240,
    },
    {
      dataField: 'wlpkLs',
      caption: 'Phạm vi',
      cellTemplate: (container, options) => {
        const textStr = options.value.map((x) => x.name).join`,` || '';
        container.title = textStr;
        container.textContent = textStr;
      },
      width: 240,
    },
    {
      dataField: 'wlservices.name',
      caption: 'Loại vé',
      cellRender: ({ data }) =>
        data.wlservices ? data.wlservices.map((x) => x.name).join`,` : '',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'state.value',
      caption: 'Trạng thái',
      minWidth: 120,
      width: 'auto',
    },
  ];
  const onChangePage = (e) => {
    if (!e) return;
    if (e !== filter.page) {
      setFilter({ ...filter, page: e });
      setReload(reload + 1);
    }
  };
  const onChangeLimit = (e) => {
    if (!e || !e.target) return;
    if (e.target.value !== filter.limit) {
      const lastPage = Math.ceil(dataSource?.count / e.target.value);
      setFilter({
        ...filter,
        page: filter.page > lastPage ? lastPage : filter.page,
        limit: e.target.value,
      });
      setReload(reload + 1);
    }
  };
  const handleChangeFilter = (data) => {
    setFilter({ ...filter, ...data });
    setReload(reload + 1);
  };
  const filterPopup = () => (
    <Popup
      visible={showPopupFilter}
      onHiding={() => setShowPopupFilter(false)}
      title="Lọc doanh thu thuê bao tháng"
      dragEnabled
      showTitle
      maxWidth="652"
      height="auto"
      className={classes.popup}
    >
      <Filter
        onClose={() => setShowPopupFilter(false)}
        handleChangeFilter={handleChangeFilter}
        initValues={filter}
      />
    </Popup>
  );
  return (
    <>
      <Helmet>
        <title> Báo cáo </title>
      </Helmet>
      <>
        {loading && <Loading />}
        {showPopupFilter && filterPopup()}
        <PageSearch
          title="Báo cáo"
          showSearch={false}
          showPager
          defaultSearch={filter.keyword}
          pageIndex={filter.page || 0}
          totalCount={dataSource?.count || 0}
          rowsPerPage={filter.limit || 0}
          handleChangePageIndex={onChangePage}
          handlePageSize={onChangeLimit}
          onSearchValueChange={(newVal) => {
            setFilter({ ...filter, keyword: newVal, page: 1 });
            setReload(reload + 1);
          }}
          showFilter={Boolean(showFilter)}
          onBack={() => {
            setFilter({ ...initialFilter, page: 1 });
            setReload(reload + 1);
          }}
        >
          <Tooltip title="Lọc">
            <Badge color="primary" badgeContent={showFilter}>
              <IconButtonHeader
                onClick={() => {
                  setShowPopupFilter(true);
                }}
              >
                <img
                  src={IconFilter}
                  alt=""
                  style={{ width: 14, height: 14 }}
                />
              </IconButtonHeader>
            </Badge>
          </Tooltip>
          <Tooltip title="Tải xuống">
            <Badge color="primary">
              <IconButtonHeader
                style={{ padding: 0 }}
                onClick={() => {
                  // setShowPopupAdd(true);
                }}
              >
                <img src={IconExport} alt="" />
              </IconButtonHeader>
            </Badge>
          </Tooltip>
        </PageSearch>
      </>

      <div className={classes.tableContent}>
        <h3> Thuê bao tháng </h3>
        <TableCustom
          data={dataSource?.data || []}
          columns={columns}
          style={{
            maxHeight: 'calc(100vh - 215px)',
            width: '100%',
          }}
        />
      </div>
    </>
  );
}
export default ParkingMonthReport;
