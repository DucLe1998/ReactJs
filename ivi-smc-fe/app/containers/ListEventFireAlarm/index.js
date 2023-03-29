/**
 *
 * ListEventFireAlarm
 *
 */

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Loading from 'containers/Loading';
import PageHeader from 'components/PageHeader';
import { IconFilter } from 'constant/ListIcons';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { DataGrid, Popup } from 'devextreme-react';
import { Tooltip } from '@material-ui/core';
import {
  Column,
  LoadPanel,
  Paging,
  Scrolling,
} from 'devextreme-react/data-grid';
import NoData from 'components/NoData';
import { get } from 'lodash';
import faker from 'faker';
import makeSelectListEventFireAlarm from './selectors';
import reducer from './reducer';
import saga from './saga';
import { useStyles } from './styled';
// import { useIntl } from 'react-intl';
import { IconButtonSquare } from '../../components/CommonComponent';
import FilterEventFireAlarm from './screens/FilterEventFireAlarm';
// import messages from './messages';

const initialFilter = {
  deviceType: null,
  eventType: null,
  zone: null,
  block: null,
  functionLocation: null,
  fromDate: null,
  toDate: null,
  sort: null,
  limit: 25,
  page: 1,
};

const key = 'listEventFireAlarm';

export function ListEventFireAlarm() {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const classes = useStyles();
  // const intl = useIntl();

  const [filter, setFilter] = useState(initialFilter);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const [showPopupFilter, setShowPopupFilter] = useState(false);

  const columns = [
    {
      caption: 'STT',
      cellRender: props => props?.rowIndex * filter.page + 1,
      allowSorting: false,
      alignment: 'center',
    },
    {
      dataField: 'device',
      caption: 'Thiết bị',
      alignment: 'center',
      allowSorting: true,
    },
    {
      dataField: 'areaName',
      caption: 'Khu vực',
      alignment: 'center',
      allowSorting: true,
    },
    {
      dataField: 'eventType',
      caption: 'Loại sự kiện',
      alignment: 'center',
      allowSorting: true,
    },
    {
      dataField: 'time',
      caption: 'Thời gian',
      alignment: 'center',
      allowSorting: true,
    },
  ];

  const filterPopup = () => (
    <Popup
      visible={showPopupFilter}
      title="Lọc sự kiện"
      onHiding={() => setShowPopupFilter(false)}
      dragEnabled
      showTitle
      width="570px"
      height="auto"
      className={classes.popup}
    >
      <FilterEventFireAlarm
        onClose={() => setShowPopupFilter(false)}
        handleChangeFilter={handleChangeFilter}
        initValues={filter}
      />
    </Popup>
  );

  const handleChangePageIndex = pageIndex => {
    setFilter({ ...filter, page: pageIndex });
  };
  const handlePageSize = e => {
    setFilter({ ...filter, page: 1, limit: e.target.value });
  };

  const handleChangeFilter = data => {
    setFilter({ ...filter, ...data });
  };

  const handlePropertyChange = e => {
    if (e.fullName.includes('sortOrder')) {
      if (e.value) {
        const direction = e.value == 'asc' ? '+' : '-';
        const key = columns[e.fullName.slice(8, -11)].dataField;
        setFilter({ ...filter, sort: direction + key });
      } else setFilter({ ...filter, sort: undefined });
    }
  };

  const fetchData = () => {
    const data = {
      rows: new Array(get(filter, 'query.limit', filter.limit))
        .fill()
        .map((d, i) => ({
          id: i + 1,
          device: faker.name.firstName(),
          areaName: faker.address.streetName(),
          eventType: faker.address.countryCode(),
          time: faker.date.past(),
        })),
      count: 100,
    };
    setDataSource(data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => fetchData(), 700);
    return () => clearTimeout(timer);
  }, [filter]);

  return (
    <React.Fragment>
      <Helmet>
        <title>MapIndoorManagement</title>
        <meta name="description" content="Description of MapIndoorManagement" />
      </Helmet>
      <React.Fragment>
        {loading && <Loading />}
        {showPopupFilter && filterPopup()}
        <PageHeader
          title="Thông tin bản đồ"
          // showSearch
          showPager
          totalCount={dataSource?.count ? dataSource?.count : 0}
          pageIndex={filter.page}
          rowsPerPage={filter.limit}
          handleChangePageIndex={pageIndex => {
            handleChangePageIndex(pageIndex);
          }}
          handlePageSize={handlePageSize}
          // onSearchValueChange={newVal => {
          //   setFilter({ ...filter, keyword: newVal });
          // }}
        >
          <Tooltip title="Thêm mới">
            <IconButtonSquare
              onClick={() => {
                setShowPopupFilter(true);
              }}
            >
              <img src={IconFilter} alt="" style={{ width: 20, height: 20 }} />
            </IconButtonSquare>
          </Tooltip>
        </PageHeader>
        {!dataSource?.rows?.length ? (
          <NoData text="Không có dữ liệu" />
        ) : (
          <DataGrid
            dataSource={dataSource?.rows || []}
            noDataText="Không có dữ liệu"
            columnAutoWidth
            showRowLines={false}
            showColumnLines={false}
            style={{
              maxHeight: 'calc(100vh - 180px)',
              width: '100%',
            }}
            className={classes.dataGrid}
            onRowPrepared={e => {
              e.rowElement.style.color = e?.data?.isFieldError
                ? '#FF0000'
                : '#2C2C2E';
              e.rowElement.style.height = e?.data?.height || '56px';
              if (e.rowType == 'header') {
                e.rowElement.style.backgroundColor =
                  'rgba(194, 207, 224, 0.08)';
              } else {
                e.rowElement.style.backgroundColor =
                  e.rowIndex % 2 ? '#F2F5F7' : '#FFFFFF';
              }
            }}
            onOptionChanged={handlePropertyChange}
          >
            <Paging enabled={false} />
            <Scrolling mode="infinite" />
            <LoadPanel enabled={false} />
            {(columns || []).map(defs => (
              <Column {...defs} key={defs.dataField || Math.random()} />
            ))}
          </DataGrid>
        )}
      </React.Fragment>
    </React.Fragment>
  );
}

ListEventFireAlarm.propTypes = {};

const mapStateToProps = createStructuredSelector({
  listEventFireAlarm: makeSelectListEventFireAlarm(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ListEventFireAlarm);
