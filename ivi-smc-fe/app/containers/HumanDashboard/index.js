/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable global-require */
/**
 *
 * HumanDashboard
 *
 */
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Avatar,
  Badge,
  Grid,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DownloadIcon from '@material-ui/icons/GetAppRounded';
import Skeleton from '@material-ui/lab/Skeleton';
import useAxios from 'axios-hooks';
// import clsx from 'clsx';
import { IconButtonSquare } from 'components/CommonComponent';
import PageHeader from 'components/PageHeader';
import Loading from 'containers/Loading/Loadable';
import { format } from 'date-fns';
import DataGrid, {
  Column,
  Paging,
  Selection,
} from 'devextreme-react/data-grid';
import FileSaver from 'file-saver';
import ExportIcon from 'images/icon-button/ic_export.svg';
import CardIcon from 'images/UserIcons/Card_Icon_Black.svg';
import FacesIcon from 'images/UserIcons/Facescan_Icon_Black.svg';
import FingerIcon from 'images/UserIcons/Fingerprint_Icon_Black.svg';
import { get } from 'lodash';
import React, { Fragment, memo, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { getApi } from 'utils/requestUtils';
import { showError } from 'utils/toast-utils';
// import PropTypes from 'prop-types';
import { API_IAM, IAM_API_SRC } from '../apiUrl';
import { loadList, setPageAction } from './actions';
import BarChart from './barChart';
import { STATISTIC_ITEM } from './constants';
// import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import makeSelectHumanDashboard from './selectors';
const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '12px',
    height: '100%',
    gap: '16px',
  },
  avatar: {
    width: '62px',
    height: '62px',
  },
  total: {
    border: '2px solid #40A574',
  },
}));
const formatNumber = new Intl.NumberFormat('vi', {
  minimumFractionDigits: 0,
}).format;
export function HumanDashboard({ humanDashboard, onloadList, setPage }) {
  const { loading, error, page, needReload, data } = humanDashboard;
  useInjectReducer({ key: 'humanDashboard', reducer });
  useInjectSaga({ key: 'humanDashboard', saga });
  const intl = useIntl();
  const classes = useStyles();
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [
    { data: statisticData, loading: getStatisticLoading },
    executeGetStatistic,
  ] = useAxios(API_IAM.STATISTIC, {
    useCache: false,
    manual: true,
  });
  useEffect(() => {
    executeGetStatistic();
  }, []);

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

  const [
    {
      response: exportCompanyData,
      loading: exportCompanyLoading,
      error: exportCompanyError,
    },
    executeExportCompany,
  ] = useAxios(
    {
      url: API_IAM.COMPANY_STATISTIC,
      method: 'GET',
      responseType: 'blob',
    },
    { manual: true },
  );

  useEffect(() => {
    if (exportCompanyData) {
      // save file export
      FileSaver.saveAs(exportCompanyData, 'Company Statistic.xlsx');
    }
  }, [exportCompanyData]);

  function loadData() {
    const query = {
      keyword: search,
      limit: pageSize,
      page,
      sortBy: sort,
    };
    onloadList(query);
  }

  useEffect(() => {
    loadData();
    setSelectedRowKeys([]);
  }, [pageSize, page, sort, search, needReload]);

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
  const onExportBtnClick = ids => {
    executeExport({
      data: {
        orgUnitIds: ids,
      },
    });
  };
  const onExportDetailBtnClick = id => {
    executeExportCompany({ params: { orgUnitId: id } });
  };
  const actionRenderer = ({ data }) => (
    <Fragment>
      <Tooltip title="Xuất thống kê chi tiết">
        <IconButton
          onClick={() => onExportDetailBtnClick(data.orgUnitId)}
          color="primary"
        >
          <FontAwesomeIcon icon={faFileExport} size="xs" />
        </IconButton>
      </Tooltip>
    </Fragment>
  );
  const renderOrderCell = ({ rowIndex }) => (
    <span>{(page - 1) * pageSize + rowIndex + 1}</span>
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
      caption: 'Tên đơn vị',
      allowSorting: false,
      cssClass: 'valign-center',
    },
    {
      dataField: 'orgUnitCode',
      caption: 'Mã đơn vị',
      allowSorting: false,
      cssClass: 'valign-center',
    },
    {
      dataField: 'empImportedTotal',
      caption: 'Tổng nhân viên đã nhập',
      allowSorting: false,
      cssClass: 'valign-center',
      alignment: 'center',
    },
    {
      dataField: 'empTotal',
      caption: 'Tổng nhân viên trên hệ thống',
      allowSorting: false,
      cssClass: 'valign-center',
      alignment: 'center',
    },
    {
      dataField: 'empNotExistTotal',
      caption: 'Tổng nhân viên chưa có trên hệ thống',
      allowSorting: false,
      cssClass: 'valign-center',
      alignment: 'center',
    },
    {
      dataField: 'empActive',
      caption: 'Active',
      allowSorting: false,
      alignment: 'center',
      cssClass: 'valign-center',
    },
    {
      dataField: 'empInActive',
      caption: 'Chưa active',
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
    {
      caption: intl.formatMessage({ id: 'app.column.action' }),
      cellRender: actionRenderer,
      width: 'auto',
      alignment: 'center',
    },
  ];

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  useEffect(() => {
    if (exportError) {
      showError(exportError);
    }
  }, [exportError]);

  useEffect(() => {
    if (exportCompanyError) {
      showError(exportCompanyError);
    }
  }, [exportCompanyError]);

  function handlePageSize(e) {
    setPageSize(e.target.value);
    setPage(1);
  }
  const handlePropertyChange = e => {
    if (e.fullName.includes('sortOrder')) {
      if (e.value) {
        const direction = e.value == 'asc' ? '+' : '-';
        const key = columns[e.fullName.slice(8, -11)].dataField;
        setSort(direction + key);
      } else setSort(undefined);
    }
  };
  const onSelectionChanged = ({ selectedRowKeys }) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const onItemDownloadClick = url => {
    getApi(
      `${IAM_API_SRC}${url}`,
      {},
      {
        responseType: 'blob',
      },
    )
      .then(res => {
        FileSaver.saveAs(res, 'User not exsited.xlsx');
      })
      .catch(err => showError(err));
  };
  const loadImage = name => require(`images/UserIcons/${name}.svg`);
  return (
    <Fragment>
      <Helmet>
        <title>Thống kê chung</title>
        <meta name="description" content="Description of HumanDashboard" />
      </Helmet>
      {(loading || exportLoading || exportCompanyLoading) && <Loading />}
      <BarChart />
      {useMemo(
        () => (
          <div>
            <div className={classes.header}>
              <Typography component="span" variant="h5" color="textPrimary">
                Thống kê chung
              </Typography>
              <Link
                component="button"
                variant="subtitle2"
                color="textSecondary"
                // disabled={getStatisticLoading}
                // underline="none"
                onClick={() => executeGetStatistic()}
              >
                Cập nhật lúc {format(new Date(), 'HH:mm - dd/MM/yyy')}
              </Link>
            </div>
            <Grid container spacing={3} style={{ padding: '12px' }}>
              {React.Children.toArray(
                STATISTIC_ITEM.map(d => (
                  <Grid item sm={3}>
                    <div className={classes.item}>
                      <Avatar
                        src={loadImage(d.icon)}
                        className={classes.avatar}
                      />
                      <div style={{ flex: 1 }}>
                        <Typography
                          variant="body1"
                          component="p"
                          color="textPrimary"
                        >
                          {d.label}
                        </Typography>
                        <Typography
                          variant="h4"
                          component="p"
                          color="textPrimary"
                        >
                          {getStatisticLoading ? (
                            <Skeleton />
                          ) : (
                            formatNumber(get(statisticData, d.key, 0))
                          )}
                        </Typography>
                      </div>
                      {d.download && (
                        <div style={{ height: '100%' }}>
                          <Tooltip title="Xuất file">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => onItemDownloadClick(d.download)}
                              disabled={get(statisticData, d.key, 0) < 1}
                            >
                              <DownloadIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </Grid>
                )),
              )}
            </Grid>
          </div>
        ),
        [statisticData],
      )}
      <PageHeader
        title="Thống kê theo đơn vị"
        showSearch
        placeholderSearch="Tìm kiếm theo tên, mã đơn vị"
        showPager
        totalCount={data.count}
        pageIndex={page}
        rowsPerPage={pageSize}
        handleChangePageIndex={pageIndex => {
          setPage(pageIndex);
        }}
        handlePageSize={handlePageSize}
        onSearchValueChange={newVal => {
          setSearch(newVal);
          setPage(1);
        }}
      >
        <Tooltip title="Xuất thống kê chung">
          <Badge badgeContent={selectedRowKeys.length} color="primary">
            <IconButtonSquare
              icon={ExportIcon}
              onClick={() => onExportBtnClick(selectedRowKeys)}
              // disabled={selectedRowKeys.length <= 1}
            />
          </Badge>
        </Tooltip>
      </PageHeader>
      <DataGrid
        className="center-row-grid"
        dataSource={data.rows}
        keyExpr="orgUnitId"
        noDataText={intl.formatMessage({ id: 'app.no_data' })}
        onOptionChanged={handlePropertyChange}
        style={{
          height: '100%',
          maxHeight: '678px',
          minHeight: '270px',
          width: '100%',
          maxWidth: '100%',
        }}
        columnAutoWidth
        allowColumnResizing
        showRowLines
        showColumnLines={false}
        onSelectionChanged={onSelectionChanged}
        selectedRowKeys={selectedRowKeys}
        rowAlternationEnabled
        sorting={{ mode: 'none' }}
      >
        <Paging enabled={false} />
        <Selection mode="multiple" showCheckBoxesMode="always" />
        {React.Children.toArray(
          columns.map(defs => <Column {...defs} allowEditing={false} />),
        )}
      </DataGrid>
    </Fragment>
  );
}

HumanDashboard.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  humanDashboard: makeSelectHumanDashboard(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setPage: evt => {
      dispatch(setPageAction(evt));
    },
    onloadList: evt => {
      dispatch(loadList(evt));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(HumanDashboard);
