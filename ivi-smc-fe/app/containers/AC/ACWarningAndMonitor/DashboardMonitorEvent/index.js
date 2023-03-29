/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';

import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { IconCardDashboard } from 'components/Custom/Icon/ListIcon';
import useUrlState from '@ahooksjs/use-url-state';
import { API_HOST } from 'containers/apiUrl';
import { callApi } from 'utils/requestUtils';
import utils from 'utils/utils';
import useInterval from 'utils/hooks/useInterval';
import DounutChartComponent from './components/DounutChart';
import ColumnChart from './components/ColumnChart';
import BtnTimeChart from './components/BtnTimeChart';
import LineChartComponent from './components/LineChartComponent';
import ViewListIdentity from './components/ViewListIdentity';

const initValueFilter = {
  timeType: 'WEEK',
};

function per(num, amount, toFixed) {
  const newData = (amount / num) * 100;
  return newData.toFixed(toFixed ? 0 : 1);
}

const MonitorDashboard = () => {
  const [valueFilter, setValueFilter] = useUrlState(initValueFilter);

  const [countLoading, setCountLoading] = useState(1);

  const [loadingCardStatis, setLoadingCardStatis] = useState(false);
  const [dataCardStatis, setDataCardStatis] = useState('');

  const [loadingUserStatis, setLoadingUserStatis] = useState(false);
  const [dataUserStatis, setDataUserStatis] = useState('');

  const [loadingEventStatis, setLoadingEventStatis] = useState(false);
  const [dataEventStatis, setDataEventStatis] = useState([]);

  useInterval(() => {
    fetchDataCardsStatistics();
    fetchDataUsersStatistics();
    fetchDataEventStatistics();
  }, 60000);

  // console.log('dataEventStatis', dataEventStatis);

  useEffect(() => {
    if (valueFilter.timeType) {
      fetchDataEventStatistics();
    }
  }, [valueFilter]);

  useEffect(() => {
    fetchDataCardsStatistics();
    fetchDataUsersStatistics();
  }, []);

  const fetchDataEventStatistics = async () => {
    try {
      const dto = {
        timeType: valueFilter.timeType,
      };
      const query = utils.queryString(dto);
      setLoadingEventStatis(true);
      const statisticsEvent = await callApi(
        `${API_HOST}/vf/search/api/v0/event/events-statistis?${query}`,
        'GET',
      );
      await setCountLoading((v) => v + 1);
      const abc = await statisticsEvent?.data?.listEvent
        ?.map((e) => ({
          name: moment(e.time).format('DD/MM'),
          line1: e.numberEventSuccessFaceIdentified,
          line2: e.numberSuccessFingerIdentified,
          line3: e.numberEventSuccessCardIdentified,
          line4: e.numberEventWarning,
        }))
        .reverse();
      setDataEventStatis(abc || []);
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoadingEventStatis(false);
    }
  };

  const fetchDataCardsStatistics = async () => {
    try {
      if (countLoading === 1) {
        setLoadingCardStatis(true);
      }
      const statisticsCard = await callApi(
        `${API_HOST}/user-cards/statistics`,
        'GET',
      );
      setCountLoading((v) => v + 1);
      setDataCardStatis(statisticsCard.data);
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoadingCardStatis(false);
    }
  };

  const fetchDataUsersStatistics = async () => {
    try {
      if (countLoading === 1) {
        setLoadingUserStatis(true);
      }
      const statisticsUser = await callApi(
        `${API_HOST}/users/user-statistics`,
        'GET',
      );
      setDataUserStatis(statisticsUser.data);
      setCountLoading((v) => v + 1);
      // console.log('statisticsUser', statisticsUser);
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoadingUserStatis(false);
    }
  };

  const totalIdentified =
    (dataUserStatis &&
      dataUserStatis.numberUserIdentified +
        dataUserStatis.numberUserUnidentified) ||
    0;

  const totalIdentified2 =
    (dataUserStatis && dataUserStatis.numberUserIdentified) || 0;

  return (
    <div style={styles.root}>
      <div style={styles.txtTitle}>Dashboard</div>
      <div style={styles.rootChart}>
        <div
          className="ct-flex-row"
          style={{ justifyContent: 'space-between' }}
        >
          <TitleChart title="Biểu đồ thống kê sự kiện" />
          <BtnTimeChart
            valueFilter={valueFilter}
            callback={(e) => setValueFilter({ timeType: e })}
          />
        </div>
        <div>
          <LineChartComponent
            timeType={valueFilter.timeType}
            loading={loadingEventStatis}
            dataChart={dataEventStatis || []}
          />
        </div>
      </div>
      <div style={styles.rootChart2} className="ct-flex-row">
        <div style={styles.rootchart3}>
          <TitleChart title="Biểu đồ thống kê lượng người đăng ký" />
          <LineRow />
          <div
            style={{
              justifyContent: 'space-between',
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
            }}
          >
            <div style={{ width: '30%' }}>
              <ColumnChart
                loading={loadingUserStatis}
                dataDetail={dataUserStatis}
                dataChart={[
                  {
                    title: 'Số người đang hoạt động ',
                    value: dataUserStatis
                      ? per(
                          dataUserStatis.totalUser,
                          dataUserStatis.numberUserActive,
                          true,
                        )
                      : 0,
                    percen: dataUserStatis
                      ? per(
                          dataUserStatis.totalUser,
                          dataUserStatis.numberUserActive,
                          true,
                        )
                      : 0,
                    zIndex: 3,
                    total: dataUserStatis.numberUserActive,
                  },
                  {
                    title: 'Số người không hoạt động ',
                    value:
                      100 -
                      per(
                        dataUserStatis.totalUser,
                        dataUserStatis.numberUserActive,
                        true,
                      ),
                    percen: '100',
                    zIndex: 1,
                    total: dataUserStatis.numberUserInactive,
                  },
                ]}
                title="Tổng số người đang quản lý trên hệ thống"
              />
            </div>
            <div style={{ width: '45%' }}>
              {loadingUserStatis ? (
                <IconLoading />
              ) : (
                <DounutChartComponent
                  vertical
                  dataDetail={{
                    total: totalIdentified,
                  }}
                  dataChart={[
                    {
                      title: 'Số người đã định danh',
                      value: dataUserStatis
                        ? per(
                            totalIdentified,
                            dataUserStatis.numberUserIdentified,
                          )
                        : 0,
                      total: dataUserStatis.numberUserIdentified,
                    },
                    {
                      title: 'Số người chưa định danh',
                      value: dataUserStatis
                        ? per(
                            totalIdentified,
                            dataUserStatis.numberUserUnidentified,
                          )
                        : 0,
                      total: dataUserStatis.numberUserUnidentified,
                    },
                  ]}
                  lineWidth={20}
                  hightAndWidth={180}
                  title="Tổng số người đăng ký định danh"
                  content={() => (
                    <div>
                      <div
                        style={{
                          color: '#3A3A3C',
                          fontSize: 12,
                          fontWeight: 400,
                        }}
                      >
                        Tổng số định danh
                      </div>
                      <div
                        style={{
                          color: '#0E164C',
                          fontSize: 20,
                          fontWeight: 500,
                        }}
                      >
                        {totalIdentified ? '100' : '0'}%
                      </div>
                    </div>
                  )}
                />
              )}
            </div>
            <div style={{ width: '25%' }}>
              <ViewListIdentity
                dataChart={[
                  {
                    title: 'Vân tay',
                    value:
                      dataUserStatis.numberUserIdentifiedByFingerprint || 0,
                    per: dataUserStatis
                      ? per(
                          totalIdentified2,
                          dataUserStatis.numberUserIdentifiedByFingerprint,
                        )
                      : 0,
                  },
                  {
                    title: 'Khuôn mặt',
                    value: dataUserStatis.numberUserIdentifiedByFace || 0,
                    per: dataUserStatis
                      ? per(
                          totalIdentified2,
                          dataUserStatis.numberUserIdentifiedByFace,
                        )
                      : 0,
                  },
                  {
                    title: 'Thẻ',
                    value: dataUserStatis.numberUserIdentifiedByCard || 0,
                    per: dataUserStatis
                      ? per(
                          totalIdentified2,
                          dataUserStatis.numberUserIdentifiedByCard,
                        )
                      : 0,
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div style={styles.rootChart4}>
          <TitleChart title="Biểu đồ thống kê hiện trạng thẻ" />
          <LineRow />
          <div>
            {loadingCardStatis ? (
              <IconLoading />
            ) : (
              <DounutChartComponent
                dataChart={[
                  {
                    title: 'Thẻ đã cấp phát',
                    value: dataCardStatis
                      ? per(
                          dataCardStatis.totalCards,
                          dataCardStatis.activeCards,
                        )
                      : 0,
                    total: dataCardStatis.activeCards,
                  },
                  {
                    title: 'Thẻ chưa cấp phát',
                    value: dataCardStatis
                      ? per(dataCardStatis.totalCards, dataCardStatis.newCards)
                      : 0,
                    total: dataCardStatis.newCards,
                  },
                  {
                    title: 'Thẻ đang quá hạn trả',
                    value: dataCardStatis
                      ? per(
                          dataCardStatis.totalCards,
                          dataCardStatis.inactiveCards,
                        )
                      : 0,
                    total: dataCardStatis.inactiveCards,
                  },
                ]}
                content={() => (
                  <div>
                    <div style={{ marginBottom: 4 }}>
                      <IconCardDashboard />
                    </div>
                    <div
                      style={{
                        color: '#3A3A3C',
                        fontSize: 12,
                        fontWeight: 400,
                      }}
                    >
                      Tổng số lượng thẻ
                    </div>
                    <div
                      style={{
                        color: '#0E164C',
                        fontSize: 18,
                        fontWeight: 500,
                      }}
                    >
                      {dataCardStatis.totalCards || 0} |{' '}
                      {dataCardStatis ? '100' : '0'}%
                    </div>
                  </div>
                )}
                lineWidth={10}
                hightAndWidth={200}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TitleChart = ({ title, updateAt }) => (
  <div
    style={{
      color: '#1B2559',
    }}
  >
    <div
      style={{
        fontWeight: 500,
        fontSize: 20,
      }}
    >
      {title || 'Biểu đồ thống kê'}
    </div>
    <div
      style={{
        opacity: 0.5,
        fontWeight: 700,
        fontSize: 14,
        marginTop: 4,
      }}
    >
      {moment(updateAt || new Date()).format('hh:mm:ss - DD/MM/YYYY')}
    </div>
  </div>
);

const LineRow = () => (
  <div
    style={{
      width: '100%',
      height: 0,
      border: '0.01px solid rgba(53, 71, 172, 0.12)',
      margin: '16px 0 16px 0',
    }}
  />
);

const IconLoading = () => (
  <div
    className="ct-flex-row"
    style={{
      width: '100%',
      justifyContent: 'center',
      height: '100%',
    }}
  >
    <CircularProgress />
  </div>
);

const styles = {
  root: {
    margin: '20px 0px 0 0px',
    height: '100%',
    maxHeight: '100%',
    minWidth: 1200,
  },
  txtTitle: {
    fontWeight: 500,
    fontSize: 24,
    color: '#1B2559',
  },
  rootChart: {
    height: '46%',
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    background: '#FFFFFF',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.04)',
  },
  rootChart2: {
    height: '46%',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  rootchart3: {
    width: '68%',
    height: '100%',
    borderRadius: 20,
    minWidth: 800,
    padding: 20,
    background: '#FFFFFF',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.04)',
  },
  rootChart4: {
    width: 'calc(32% - 20px)',
    height: '100%',
    borderRadius: 20,
    padding: 20,
    background: '#FFFFFF',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.04)',
  },
};

export default MonitorDashboard;
