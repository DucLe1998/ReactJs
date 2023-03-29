import { CircularProgress, FormControl, Grid } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import DatePicker from 'components/DateRangePicker';
import { GUEST_DASHBOARD } from 'containers/apiUrl';
import { endOfDay, startOfDay } from 'date-fns';
import ActiveTotal from 'images/GuestDashboardIcons/activeGuestIcon.svg';
import ArrivedTotal from 'images/GuestDashboardIcons/arrivedGuestIcon.svg';
import CardTotal from 'images/GuestDashboardIcons/cardGuestIcon.svg';
import FaceTotal from 'images/GuestDashboardIcons/facesGuestIcon.svg';
import FingerTotal from 'images/GuestDashboardIcons/fingerGuestIcon.svg';
import InactiveTotal from 'images/GuestDashboardIcons/inactiveGuestIcon.svg';
import GuestTotal from 'images/GuestDashboardIcons/totalGuestIcon.svg';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
// import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import Toolbar from 'react-multi-date-picker/plugins/toolbar';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getApi } from 'utils/requestUtils';
import { showError } from 'utils/toast-utils';

const ChartContainer = styled.div`
  margin-top: 20px;
  background-color: white;
  padding: 24px 30px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  & .dxc-val-elements text {
    /* fill: rgba(255, 255, 255, 0.8) !important; */
    font-size: 14px !important;
    font-weight: normal !important;
  }

  & .dxc-arg-elements text {
    /* fill: rgba(255, 255, 255, 0.8) !important; */
    font-size: 14px !important;
    font-weight: normal !important;
  }
  & .dxc-legend text {
    /* fill: rgba(255, 255, 255, 0.8) !important; */
    font-size: 14px !important;
    font-weight: normal !important;
  }
  & .dxc-arg-line {
    display: none;
  }
  & .dxc-val-line {
    display: none;
  }
`;

const now = new Date();

export default function CommonStatistic({ title = 'Tiêu đề' }) {
  const [cardsData, setCardsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [randgeDate, setRangeDate] = useState([]);
  const [reload, setReload] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [start, end] = randgeDate;
      const startDate = start
        ? parseInt(startOfDay(start).valueOf() / 1000, 10)
        : undefined;
      const endDate = end
        ? parseInt(endOfDay(end).valueOf() / 1000, 10)
        : start
        ? parseInt(endOfDay(start).valueOf() / 1000, 10)
        : undefined;
      const response = await getApi(GUEST_DASHBOARD.GUEST_STATISTIC_ALL, {
        startDate,
        endDate,
      });
      const tmpDatas = [];
      Object.entries(response.data).forEach(([k, v]) => {
        let data = {};
        data.total = v;
        switch (k) {
          case 'activeTotal':
            data.icon = ActiveTotal;
            data.label = 'Khách còn hạn';
            data.order = 2;
            break;
          case 'arrivedTotal':
            data.icon = ArrivedTotal;
            data.label = 'Khách đã đến';
            data.order = 1;
            break;
          case 'cardTotal':
            data.icon = CardTotal;
            data.label = 'Thẻ';
            data.order = 5;
            break;
          case 'faceTotal':
            data.icon = FaceTotal;
            data.label = 'Khuôn mặt';
            data.order = 4;
            break;
          case 'fingerTotal':
            data.icon = FingerTotal;
            data.label = 'Vân tay';
            data.order = 6;
            break;
          case 'guestTotal':
            data.icon = GuestTotal;
            data.label = 'Tổng số khách';
            data.order = 7;
            break;
          case 'inactiveTotal':
            data.icon = InactiveTotal;
            data.label = 'Khách hết hạn';
            data.order = 3;
            break;
          default:
            data = {};
            break;
        }
        if (!isEmpty(data)) {
          tmpDatas.push(data);
        }
      });
      setCardsData(
        tmpDatas.sort((first, second) => first.order - second.order),
      );
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const getDayOfWeek = dayOfWeek => {
    switch (dayOfWeek) {
      case 0:
        return 'Chủ nhật';
      case 1:
        return 'Thứ Hai';
      case 2:
        return 'Thứ Ba';
      case 3:
        return 'Thứ Tư';
      case 4:
        return 'Thứ Năm';
      case 5:
        return 'Thứ Sáu';
      case 6:
        return 'Thứ Bảy';
      default:
        return '';
    }
  };

  const getSubTitle = () =>
    `Cập nhật lần cuối vào ${getDayOfWeek(
      now.getDay(),
    )}, ngày ${now.getDate()} tháng ${now.getMonth() +
      1} năm ${now.getFullYear()}`;

  useEffect(() => {
    fetchData();
  }, [reload]);

  return (
    <ChartContainer>
      <div
        style={{
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
        className="ct-flex-row"
      >
        <div>
          <div
            className="title-chart"
            style={{ marginBottom: 4, fontSize: '18px', fontWeight: 'bold' }}
          >
            {title}
          </div>
          <div style={{ fontSize: '12px', color: '#717070' }}>
            <span style={{ fontWeight: 'bold' }}>{getSubTitle()}</span>
          </div>
        </div>
        <FormControl size="small">
          <DatePicker
            eachDaysInRange
            onClose={() => setReload(reload + 1)}
            value={randgeDate}
            onChange={date => setRangeDate(date)}
            calendarPosition="top-end"
            plugins={[
              // <DatePanel header="Ngày" />,
              <Toolbar
                position="bottom"
                names={{
                  today: 'Hiện tại',
                  deselect: 'Bỏ chọn',
                  close: 'Đóng',
                }}
              />,
            ]}
          />
        </FormControl>
      </div>
      {loading ? (
        <div
          style={{ display: 'flex', width: '100%', justifyContent: 'center' }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={3}>
          {cardsData &&
            React.Children.toArray(
              cardsData.map(card => (
                <Grid item container xs={12} sm={6} md={4} justify="flex-end">
                  <CardWapper>
                    <div className="icon-container">
                      <img alt="" src={card.icon} />
                    </div>
                    <div className="info-container">
                      <p className="title">{card.label}</p>
                      <p className="number">{card.total}</p>
                    </div>
                  </CardWapper>
                </Grid>
              )),
            )}
        </Grid>
      )}
      <Link
        to={{
          pathname: '/guest/dashboard/statistic',
          state: {
            startDate: randgeDate[0]
              ? parseInt(
                  startOfDay(randgeDate[0].valueOf()).valueOf() / 1000,
                  10,
                )
              : null,
            endDate: randgeDate[1]
              ? parseInt(endOfDay(randgeDate[1].valueOf()).valueOf() / 1000, 10)
              : randgeDate[0]
              ? parseInt(endOfDay(randgeDate[0].valueOf()).valueOf() / 1000, 10)
              : null,
          },
        }}
      >
        <p style={{ color: '#6264A7', cursor: 'pointer', marginTop: '20px' }}>
          Xem chi tiết <ArrowRightAltIcon />
        </p>
      </Link>
    </ChartContainer>
  );
}

const CardWapper = styled.div`
  padding: 10px;
  border: 1px solid #dddddd;
  border-radius: 12px;
  display: flex;
  width: 100%;
  .icon-container {
    align-self: center;
  }

  .icon-container img {
    margin-left: 25px;
    width: 70px;
  }

  .info-container {
    flex: 1;
    margin-left: 15px;
    display: flex;
    flex-direction: column;
  }
  .info-container p {
    margin: 0px;
    flex: 1;
  }
  .info-container p.title {
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.8);
  }
  .info-container p.number {
    font-weight: 500;
    font-size: 32px;
    color: rgba(0, 0, 0, 0.8);
  }
`;
