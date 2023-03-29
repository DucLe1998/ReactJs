/**
 *
 * GuestDashboard
 *
 */

import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import PageHeader from 'components/PageHeader';
import Loading from 'containers/Loading';
import makeSelectGuestDashboard from './selectors';
import reducer from './reducer';
import saga from './saga';
import BarChart from './BarChart';
import CommonStatistic from './CommonStatistic';

export function GuestDashboard() {
  useInjectReducer({ key: 'guestDashboard', reducer });
  useInjectSaga({ key: 'guestDashboard', saga });

  return (
    <Fragment>
      <Helmet>
        <title>Dashboard thống kê Khách</title>
        <meta name="description" content="Description of MapIndoorManagement" />
      </Helmet>
      <Fragment>
        <PageHeader title="Dashboard thống kê Khách" />
        <BarChart title="Biểu đồ thống kê thay đổi lượng khách" />
        <CommonStatistic title="Thống kê chung" />
      </Fragment>
    </Fragment>
  );
}

GuestDashboard.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  guestDashboard: makeSelectGuestDashboard(),
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

export default compose(withConnect)(GuestDashboard);
