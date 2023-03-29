/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import IconButton from '@material-ui/core/IconButton';
// import { IconDownLoad } from 'components/Custom/Icon/ListIcon';
import IconDetails from 'containers/Card/icon/IconDetails';
// import PopupDownload from 'containers/CardDashboard/screens/popup/PopupDownLoad';
import Loading from 'containers/Loading';
import { format } from 'date-fns';
import viLocale from 'date-fns/locale/vi';
import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import CustomTable from '../../components/Custom/table/CustomTable';
import { showAlertError } from '../../utils/utils';
import { downloadCardDashBoard, loadData, loadDataDetail } from './actions';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectData,
  makeSelectDataDetail,
  makeSelectIsReloading,
  makeSelectLoading,
} from './selectors';
const key = 'carddashboard';
const CardDashboard = ({
  loading,
  error,
  data,
  onLoadData,
  // onDownloadData,
}) => {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  // const [isOpenPopupDownLoad, setIsOpenPopupDownLoad] = useState(false);
  // const [modeDownload, setModeDownLoad] = useState('');

  let companyAllocatedCards = 0;
  let totalEmployees = 0;
  let employeeAllocatedCards = 0;
  // let guestAllocatedCards = 0;
  // let guestCardsExpired = 0;
  // let guestCardsUnexpired = 0;

  useEffect(() => {
    fetchData();
  }, []);

  function calData(lstData) {
    for (let i = 0; i < lstData.length; i++) {
      companyAllocatedCards += lstData[i].companyAllocatedCards;
      totalEmployees += lstData[i].totalEmployees;
      employeeAllocatedCards += lstData[i].employeeAllocatedCards;
      // guestAllocatedCards += lstData[i].guestAllocatedCards;
      // guestCardsExpired += lstData[i].guestCardsExpired;
      // guestCardsUnexpired += lstData[i].guestCardsUnexpired;
    }
  }

  const fetchData = () => {
    companyAllocatedCards = 0;
    totalEmployees = 0;
    employeeAllocatedCards = 0;
    // guestAllocatedCards = 0;
    // guestCardsExpired = 0;
    // guestCardsUnexpired = 0;
    onLoadData();
  };

  if (error) showAlertError();

  // const handlerDownload = v => {
  //   onDownloadData(v);
  // };

  // const actionRendererBuilding = () => (
  //   <Fragment>
  //     <IconButton
  //       onClick={() => {
  //         setModeDownLoad('TOTAL');
  //         setIsOpenPopupDownLoad(true);
  //       }}
  //       color="primary"
  //     >
  //       <IconDownLoad fontSize="small" />
  //     </IconButton>
  //   </Fragment>
  // );

  const actionRendererEmployee = () => (
    <Fragment>
      {/* <IconButton */}
      {/*  onClick={() => { */}
      {/*    setModeDownLoad('COMPANY'); */}
      {/*    setIsOpenPopupDownLoad(true); */}
      {/*  }} */}
      {/*  color="primary" */}
      {/* > */}
      {/*  <IconDownLoad fontSize="small" /> */}
      {/* </IconButton> */}
      <Link to="/card-dashboard/card-employee">
        <IconButton>
          <IconDetails fontSize="small" />
        </IconButton>
      </Link>
    </Fragment>
  );

  const actionRendererGuest = () => (
    <Fragment>
      {/* <IconButton */}
      {/*  onClick={() => { */}
      {/*    setModeDownLoad('GUEST'); */}
      {/*    setIsOpenPopupDownLoad(true); */}
      {/*  }} */}
      {/*  color="primary" */}
      {/* > */}
      {/*  <IconDownLoad fontSize="small" /> */}
      {/* </IconButton> */}
      <Link to="/card-dashboard/card-guest">
        <IconButton>
          <IconDetails fontSize="small" />
        </IconButton>
      </Link>
    </Fragment>
  );

  function formatTime(date) {
    const val = date === undefined ? new Date() : new Date(date);
    return format(val, 'EEEE, dd/MM/yyyy HH:mm', { locale: viLocale });
  }

  return (
    <Fragment>
      {data && data.statisticCardCompany && calData(data.statisticCardCompany)}
      <Title>Báo cáo thống kê số lượng thẻ của tòa nhà</Title>
      <SubTitle>
        Cập nhật lần cuối vào{' '}
        <label style={{ fontWeight: 500 }}>
          {formatTime(data?.statisticTime)}
        </label>
      </SubTitle>
      <CustomTable
        data={[data]}
        disabledSelect
        style={{
          marginBottom: '25px',
        }}
        height="105px"
        row={[
          {
            dataField: 'statisticTime',
            caption: 'Thời gian',
            dataType: 'datetime',
            format: 'dd/MM/yyyy',
            // width: 'auto',
          },
          {
            dataField: 'totalCards',
            caption: 'Tổng số thẻ',
            alignment: 'left',
            // width: '20%',
          },
          {
            dataField: 'allocatedCards',
            caption: 'Số thẻ đã phân phối',
            alignment: 'left',
            // width: '20%',
          },
          {
            dataField: 'remainedCards',
            caption: 'Thẻ tồn',
            alignment: 'left',
            // width: '20%',
          },
        ]}
      />
      <Title>Báo cáo thống kê số lượng thẻ dành cho NV</Title>
      <SubTitle>
        Cập nhật lần cuối vào{' '}
        <label style={{ fontWeight: 500 }}>
          {formatTime(data?.statisticTime)}
        </label>
      </SubTitle>
      <CustomTable
        data={[data]}
        disabledSelect
        height="105px"
        style={{
          marginBottom: '25px',
        }}
        row={[
          {
            dataField: 'statisticTime',
            caption: 'Thời gian',
            dataType: 'datetime',
            format: 'dd/MM/yyyy',
          },
          {
            caption: 'Tổng số thẻ',
            cellRender: () => companyAllocatedCards,
            // width: '20%',
          },
          {
            caption: 'Số lượng nhân viên trên hệ thống',
            cellRender: () => totalEmployees,
            // width: '20%',
          },
          {
            caption: 'Số thẻ đã phân phối cho đơn vị',
            cellRender: () => employeeAllocatedCards,
            // width: '20%',
          },
          {
            caption: 'Hành động',
            cellRender: actionRendererEmployee,
            alignment: 'center',
            // width: '20%',
          },
        ]}
      />
      <Title>Báo cáo thống kê số lượng thẻ dành cho Khách</Title>
      <SubTitle>
        Cập nhật lần cuối vào{' '}
        <label style={{ fontWeight: 500 }}>
          {formatTime(data?.statisticTime)}
        </label>
      </SubTitle>
      <CustomTable
        data={[data]}
        disabledSelect
        style={{
          marginBottom: '25px',
        }}
        height="105px"
        row={[
          {
            dataField: 'statisticTime',
            caption: 'Thời gian',
            dataType: 'datetime',
            format: 'dd/MM/yyyy',
          },
          {
            dataField: 'guestAllocatedCards',
            caption: 'Số thẻ đã cấp',
            // cellRender: () => guestAllocatedCards,
            // width: '20%',
          },
          {
            dataField: 'guestCardsUnexpired',
            caption: 'Số thẻ đã cấp còn hiệu lực',
            // cellRender: () => guestCardsUnexpired,
            // width: '20%',
          },
          {
            dataField: 'guestCardsExpired',
            caption: 'Số thẻ đã cấp hết hiệu lực',
            // cellRender: () => guestCardsExpired,
            // width: '20%',
          },
          {
            caption: 'Hành động',
            cellRender: actionRendererGuest,
            alignment: 'center',
            // width: '20%',
          },
        ]}
      />
      {/* {isOpenPopupDownLoad && ( */}
      {/*  <PopupDownload */}
      {/*    onClickSave={handlerDownload} */}
      {/*    onClose={v => setIsOpenPopupDownLoad(v)} */}
      {/*    mode={modeDownload} */}
      {/*  /> */}
      {/* )} */}
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
    onDownloadData: (evt, id) => {
      dispatch(downloadCardDashBoard(evt, id));
    },
  };
}

const Title = styled.div`
  margin: 15px 0px 0px;
  max-width: 350px;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SubTitle = styled.div`
  margin: 5px 0px 10px;
  max-width: 350px;
  font-size: 12px;
  font-weight: 400;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CardDashboard);
