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
import { Link, useHistory } from 'react-router-dom';
import Loading from 'containers/Loading/Loadable';

import IconButton from '@material-ui/core/IconButton';
import IconDetails from 'containers/Card/icon/IconDetails';
import { IconDownLoad } from 'components/Custom/Icon/ListIcon';
import saga from '../saga';
import reducer from '../reducer';
import {
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
import CustomTable from '../../../components/Custom/table/CustomTable';

const key = 'carddashboard';
const defSearchValue = { keywork: '' };
const CardGuestDetails = ({
  loading,
  error,
  data,
  onLoadData,
  onDownLoad,
  isReloading,
}) => {
  const history = useHistory();
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

  const handlerDownload = (v) => {
    const dto = {
      companyId: v.companyId,
      isGuest: true,
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
              cardUserType: { value: 'GUEST', label: 'Khách' },
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
      />

      <CustomTable
        data={(data && data.statisticCardCompany) || []}
        disabledSelect
        innerRef={refAccessControlDevice}
        row={[
          {
            dataField: 'companyName',
            caption: 'Danh sách đơn vị',
            // alignment: 'center',
          },
          {
            dataField: 'guestAllocatedCards',
            caption: 'Tổng số thẻ đã cấp',
            alignment: 'center',
          },
          {
            dataField: 'guestCardsUnexpired',
            caption: 'Tổng số thẻ đã cấp còn hiệu lực',
            alignment: 'center',
          },
          {
            dataField: 'guestCardsExpired',
            caption: 'Tổng số thẻ đã cấp hết hiệu lực',
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
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CardGuestDetails);
