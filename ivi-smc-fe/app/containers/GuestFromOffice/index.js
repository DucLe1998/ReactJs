import { Paper } from '@material-ui/core';
import axios from 'axios';
import { IconViewDetail } from 'components/Custom/Icon/ListIcon';
import IconBtn from 'components/Custom/IconBtn';
import CustomTable from 'components/Custom/table/CustomTable';
import PageHeader from 'components/PageHeader';
import Loading from 'containers/Loading';
// import FilterICon from 'images/icon-button/filter.svg';
// import { IconButtonSquare } from 'components/CommonComponent';
// import DropDownButton from 'devextreme-react/drop-down-button';
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
// import DialogFilter from './dialogs/DialogFilter';
import NoData from '../../components/NoData';
import { IAM_API_SRC } from '../apiUrl';
import messages from './messages';
import { mainUseStyles } from './styles';

const initParams = {
  limit: 25,
  page: 1,
  keyword: '',
};

export function GuestFromOffice() {
  const intl = useIntl();
  // const resourceCode = 'guest-registration/registration';
  // const scopes = checkAuthority(
  //   ['get', 'update', 'delete', 'create'],
  //   resourceCode,
  //   userAuthority,
  // );

  const classes = mainUseStyles();
  const [data, setData] = useState([]);
  // const [openFilter, setOpenFilter] = useState(false);
  const [params, setParams] = useState(initParams);
  const [loading, setLoading] = useState(false);
  const [isFilter, setFilter] = useState(false);

  const containerRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${IAM_API_SRC}/guests`, { params })
      .then((response) => {
        const res = response.data;
        setData(res);
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        setLoading(false);
        containerRef.current.querySelector('input').focus();
      });
  }, [params]);

  // const handleClickFilter = () => {
  //   setOpenFilter(true);
  // };
  // const handleCloseFilter = () => {
  //   setOpenFilter(false);
  // };
  // const onSuccessFilter = values => {
  //   values.endDate = values.startDate;
  //   setFilter(true);
  //   setOpenFilter(false);
  //   setParams({ ...params, ...values, page: 1 });
  // };

  const handleDetailBtnClick = (id) => {
    history.push(`guests/${id}`);
  };

  const onBack = () => {
    setParams({
      ...initParams,
      limit: params.limit,
      keyword: params.keyword,
    });
    setFilter(false);
  };

  const onSearch = (e) => {
    setParams({ ...params, keyword: e, page: 1 });
  };

  const onChangePage = (e) => {
    if (!e) return;
    if (e !== params.page) {
      setParams({ ...params, page: e });
    }
  };

  const onChangeLimit = (e) => {
    if (!e || !e.target) return;
    if (e.target.value !== params.limit) {
      setParams({ ...params, page: initParams.page, limit: e.target.value });
    }
  };
  const onClickFilter = (v) => {
    setParams({ ...params, expireTime: v, page: 1 });
    setFilter(Boolean(v.length));
  };

  // const poupFilter = () => (
  //   <Dialog
  //     className={classes.dialog}
  //     fullWidth
  //     maxWidth="md"
  //     open={showPopupFilter}
  //     onClose={() => setShowPopupFilter(false)}
  //   >
  //     <DialogFilter
  //       onFilter={onFilter}
  //       initValues={initValuesFilter}
  //       onCancel={() => setShowPopupFilter(false)}
  //     />
  //   </Dialog>
  // );

  return (
    <div ref={containerRef}>
      <Helmet>
        <title>{intl.formatMessage(messages.helmetTitle)}</title>
        <meta name="description" content="Description of Guest From Office" />
      </Helmet>
      <PageHeader
        title="Quản lý khách tới văn phòng"
        // disabled={loading}
        showSearch
        showPager
        placeholderSearch="Tìm kiếm theo tên khách, số điện thoại, số giấy tờ và mã định danh"
        pageIndex={params.page || 0}
        totalCount={data?.count || 0}
        rowsPerPage={params.limit || 0}
        onSearchValueChange={onSearch}
        handleChangePageIndex={onChangePage}
        handlePageSize={onChangeLimit}
        showFilter={isFilter}
        onBack={onBack}
      >
        {/* <Tooltip title="Lọc">
          <Badge color="primary">
            <IconButtonSquare onClick={handleClickFilter}>
              <img src={FilterICon} alt="" style={{ width: 20, height: 20 }} />
            </IconButtonSquare>
          </Badge>
        </Tooltip> */}
        {/* <DropDownButton
          icon="filter"
          displayExpr="label"
          keyExpr="key"
          // dropDownOptions={{ width: 230 }}
          useSelectMode
          selectedItemKey={params?.expireTime || ''}
          items={[
            { label: 'Tất cả', key: '' },
            {
              label: '> 1 tháng',
              key: '1M',
            },
            {
              label: '> 3 tháng',
              key: '3M',
            },
            {
              label: '> 6 tháng',
              key: '6M',
            },
          ]}
          onSelectionChanged={e => onClickFilter(e.item.key)}
        /> */}
      </PageHeader>
      <div className={classes.root}>
        {loading ? (
          <Loading />
        ) : data.rows?.length ? (
          <CustomTable
            data={(data && data.rows) || []}
            disabledSelect
            row={[
              {
                caption: 'STT',
                cellRender: (item) => (
                  <div style={{ textAlign: 'center' }}>
                    {(params.page - 1) * params.limit + (item.rowIndex + 1)}
                  </div>
                ),
                alignment: 'center',
                width: 50,
              },
              {
                dataField: 'fullName',
                caption: 'Tên khách',
              },
              {
                dataField: 'phoneNumber',
                caption: 'Số ĐT',
              },
              {
                dataField: 'identityNumber',
                caption: 'Số giấy tờ',
              },
              {
                dataField: 'accessCode',
                caption: 'Mã định danh',
              },
              {
                dataField: 'updatedAt',
                caption: 'Thời gian cập nhật',
                dataType: 'datetime',
                format: 'HH:mm:ss dd-MM-yyyy',
              },
              {
                caption: 'Hành động',
                cellRender: (v) => (
                  <IconBtn
                    icon={<IconViewDetail />}
                    onClick={() => {
                      handleDetailBtnClick(v.data.id);
                    }}
                  />
                ),
                alignment: 'center',
              },
            ]}
          />
        ) : (
          <Paper
            style={{
              height: 'calc(100vh - 159px)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <NoData text="Không có mục nào phù hợp với điều kiện tìm kiếm của bạn" />
          </Paper>
        )}
      </div>
      {/* <DialogFilter
        openFilter={openFilter}
        handleCloseFilter={handleCloseFilter}
        onSuccess={onSuccessFilter}
      /> */}
    </div>
  );
}

export default GuestFromOffice;
