/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React, { useEffect, Fragment, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import PageHeader from 'components/PageHeader';
import { useInjectSaga } from 'utils/injectSaga';
import { Link } from 'react-router-dom';
import Loading from 'containers/Loading/Loadable';

import IconButton from '@material-ui/core/IconButton';
import IconDetails from 'containers/Card/icon/IconDetails';
import { IconDownLoad } from 'components/Custom/Icon/ListIcon';
import saga from '../saga';
import reducer from '../reducer';
import {
  downloadAllCompanyCardDashBoard,
  downloadCompanyCardDashBoard,
  loadData,
  loadDataDetail,
} from '../actions';
import utils, { showAlertError } from '../../../utils/utils';
import {
  makeSelectData,
  makeSelectLoading,
  makeSelectIsReloading,
  makeSelectDataDetail,
} from '../selectors';
import IconBtn from '../../../components/Custom/IconBtn';
import CustomTable from '../../../components/Custom/table/CustomTable';

const key = 'carddashboard';
const defSearchValue = { keywork: '' };
const CardEmployeeDetails = ({
  loading,
  error,
  data,
  onLoadData,
  onDownLoad,
  onDownLoadCompany,
  isReloading,
  history,
  location,
}) => {
  const refAccessControlDevice = useRef({});

  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [searchValue, setSearchValue] = useState(defSearchValue);
  const [pageSize, setPageSize] = useState(25);
  const [pageIndex, setPageIndex] = useState(1);

  useEffect(() => {
    fetchData();
  }, [pageSize, pageIndex, searchValue.keywork]);

  useEffect(() => {
    if (isReloading) {
      fetchData();
    }
  }, [isReloading]);

  const fetchData = () => {
    const query = utils.queryString({
      page: pageIndex,
      limit: pageSize,
      keyword: searchValue.keywork,
    });
    onLoadData(query);
  };

  const handlerDownloadCompany = () => {
    onDownLoadCompany();
  };

  const handlerDownload = (v) => {
    const dto = {
      companyId: v.companyId,
      isGuest: false,
    };
    onDownLoad(dto);
  };

  const afterSearch = () => {
    setPageIndex(1);
    // setPageSize(gui.optionsPageSize[0]);
  };

  const handleChangePageIndex = (pageIndex) => {
    setPageIndex(pageIndex);
  };

  const handlePageSize = (e) => {
    const { value } = e.target;
    setPageSize(value);
    setPageIndex(1);
  };

  if (error) showAlertError();

  const actionRenderer = ({ data }) => (
    <Fragment>
      <IconButton
        onClick={() => {
          handlerDownload(data);
        }}
        color="primary"
      >
        <IconDownLoad fontSize="small" />
      </IconButton>
      <Link
        to={{
          pathname: '/card',
          state: {
            ...(location?.state || {}),
            cardMng: {
              cardUserType: { value: 'EMPLOYEE', label: 'Nhân viên' },
              company: {
                orgUnitId: data.companyId,
                orgUnitName: data.companyName,
              },
            },
          },
        }}
      >
        <IconButton>
          <IconDetails fontSize="small" />
        </IconButton>
      </Link>
    </Fragment>
  );

  return (
    <Fragment>
      <PageHeader
        title="Tổng số thẻ được cấp theo P&L"
        // showSearch
        showPager
        pageIndex={pageIndex}
        totalCount={(data && data.count) || 0}
        rowsPerPage={pageSize}
        handlePageSize={handlePageSize}
        handleChangePageIndex={handleChangePageIndex}
        onSearchValueChange={(e) => {
          afterSearch();
          setSearchValue((v) => ({ ...v, keywork: e }));
        }}
        showBackButton
        onBack={() => {
          history.replace('/card-dashboard');
        }}
      >
        <IconBtn
          style={styles.iconBtnHeader}
          onClick={() => handlerDownloadCompany()}
          icon={<IconDownLoad color="gray" />}
          // showTooltip={intl.formatMessage(messages.firmware_upgrade)}
        />
      </PageHeader>
      <CustomTable
        data={(data && data.statisticCardCompany) || []}
        disabledSelect
        innerRef={refAccessControlDevice}
        row={[
          {
            dataField: 'companyName',
            caption: 'Danh sách đơn vị',
          },
          {
            dataField: 'totalEmployees',
            caption: 'Tổng số lượng nhân viên',
            alignment: 'center',
          },
          {
            dataField: 'employeeAllocatedCards',
            caption: 'Số lượng thẻ gán cho nhân viên',
            alignment: 'center',
          },
          {
            caption: 'Hành động',
            cellRender: actionRenderer,
            alignment: 'center',
          },
        ]}
      />
      {loading && <Loading />}
    </Fragment>
  );
};

const styles = {
  iconBtnHeader: {
    backgroundColor: 'rgba(116, 116, 128, 0.08)',
    height: 36,
    width: 36,
    borderRadius: 6,
  },
};

const mapStateToProps = createStructuredSelector({
  data: makeSelectData(),
  loading: makeSelectLoading(),
  isReloading: makeSelectIsReloading(),
  dataDetail: makeSelectDataDetail(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadData: (evt) => {
      dispatch(loadData(evt));
    },
    loadDataDetail: (evt) => {
      dispatch(loadDataDetail(evt));
    },
    onDownLoad: (evt, id) => {
      dispatch(downloadCompanyCardDashBoard(evt, id));
    },
    onDownLoadCompany: (evt) => {
      dispatch(downloadAllCompanyCardDashBoard(evt));
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CardEmployeeDetails);
