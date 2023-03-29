import React, { useEffect, Fragment, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import Loading from 'containers/Loading/Loadable';
import EditIcon from 'images/Icon-Edit2.svg';
import { useHistory, useParams, Link } from 'react-router-dom';
import BackIcon from 'images/Icon-Back-3-10.svg';
import { Button } from 'devextreme-react/button';
import { TextBox } from 'devextreme-react/text-box';
// import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import { checkAuthority } from 'utils/functions';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import moment from 'moment';
import { showError } from 'utils/toast-utils';
import { getApi } from 'utils/requestUtils';
import { API_CAMERA_AI, API_EVENTS } from 'containers/apiUrl';
import Img from 'components/Imge';
import { format, startOfDay, endOfDay } from 'date-fns';
import PageHeader from 'components/PageHeader';
import { DataGrid, DateBox } from 'devextreme-react';
import _ from 'lodash';
import {
  Column,
  LoadPanel,
  Paging,
  Scrolling,
} from 'devextreme-react/data-grid';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

import { loadData, UpdateData, setFormType, showLoading } from './actions';
import { makeSelectLoading, makeSelectData, makeForm } from './selectors';
import ModalImage from '../ListUserCameraAi/items/ModalImage';
import { getImageUrlFromMinio } from '../../utils/utils';

const key = 'IntrusionCameraAi';
const now = new Date().getTime();

const initFilterValues = {
  time: null,
  limit: 25,
  page: 1,
};

export function IntrusionCameraAi({
  // onLoadData,
  onUpdate,
  loading,
  onShowLoading,
  // data,
  userAuthority,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const intl = useIntl();

  const resourceCode = 'cameraai/events';
  const scopes = checkAuthority(['update'], resourceCode, userAuthority);

  const [showModalImage, setShowModalImage] = useState(null);
  const [timeOccur, setTimeOccur] = useState();
  const { id } = useParams();
  const history = useHistory();
  const [descriptionValue, setDescriptionValue] = useState(null);
  const [disableLive, setDisableLive] = useState(true);

  // const [movementHistory, setMovementHistory] = useState(null);
  const [data, setData] = useState(null);

  // const [filterValues, setFilterValues] = useState(initFilterValues);

  // const handleChangePageIndex = (pageIndex) => {
  //   setFilterValues({ ...filterValues, page: pageIndex });
  // };

  // const handlePageSize = (e) => {
  //   setFilterValues({ ...filterValues, page: 1, limit: e.target.value });
  // };

  // const handleDatebox = (value) => {
  //   setFilterValues({ ...filterValues, page: 1, time: value });
  // };

  const convertDate = () => {
    if (data) {
      const dateOccur = new Date(parseInt(data?.timeOccur, 10));
      setTimeOccur(moment(dateOccur).format('DD/MM/YYYY - HH:mm'));
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1);
      if (currentDate.getTime() < dateOccur.getTime()) {
        setDisableLive(false);
      }
    }
  };

  const updateDescription = () => {
    if (!(descriptionValue === data?.description)) {
      const data = {
        description: descriptionValue,
      };
      onUpdate(id, data);
    }
  };

  // const renderImageCell = ({ value }) => (
  //   <Fragment>
  //     <Img
  //       src={getImageUrlFromMinio(value)}
  //       style={{ maxWidth: '91px', height: '56px', minWidth: '56px' }}
  //       onClick={() => setShowModalImage(getImageUrlFromMinio(value))}
  //     />
  //   </Fragment>
  // );

  // const renderTimeOccurCell = ({ data }) => (
  //   <span>
  //     {data?.timeOccur
  //       ? format(data?.timeOccur, 'HH:mm:ss - dd/MM/yyyy')
  //       : null}
  //   </span>
  // );

  // const columns = [
  //   {
  //     dataField: 'timeOccur',
  //     caption: 'Thời gian',
  //     cellRender: renderTimeOccurCell,
  //     alignment: 'left',
  //     allowSorting: false,
  //   },
  //   {
  //     dataField: 'deviceName',
  //     caption: 'Thiết bị',
  //     alignment: 'center',
  //     allowSorting: false,
  //   },
  //   {
  //     dataField: 'areaName',
  //     caption: 'Khu vực',
  //     alignment: 'center',
  //     allowSorting: false,
  //   },
  //   {
  //     dataField: 'imageUrl',
  //     caption: 'Ảnh',
  //     cellRender: renderImageCell,
  //     alignment: 'center',
  //     allowSorting: false,
  //   },
  // ];

  // const renderTable = useMemo(
  //   () => (
  //     <>
  //       <DataGrid
  //         className="center-row-grid"
  //         dataSource={movementHistory?.rows || []}
  //         noDataText="Chưa ghi nhận lịch sử di chuyển của đổi tượng"
  //         style={{
  //           minHeight: '500px',
  //           maxHeight: `calc(100vh - ${50 + 84 + 25}px)`,
  //           width: '100%',
  //         }}
  //         columnAutoWidth
  //         showRowLines
  //         showColumnLines={false}
  //         rowAlternationEnabled
  //       >
  //         <Paging enabled={false} />
  //         <Scrolling mode="infinite" />
  //         <LoadPanel enabled={false} />
  //         {columns.map((defs, index) => (
  //           // eslint-disable-next-line react/no-array-index-key
  //           <Column {...defs} key={index} />
  //         ))}
  //       </DataGrid>
  //     </>
  //   ),
  //   [movementHistory],
  // );

  // const fetchMovementHistory = async () => {
  //   if (data?.objectId) {
  //     onShowLoading(true);
  //     try {
  //       const payload = {
  //         uuid: data?.objectId,
  //         limit: filterValues.limit,
  //         page: filterValues.page,
  //         startTime: filterValues.time
  //           ? startOfDay(filterValues.time).valueOf()
  //           : null,
  //         endTime: filterValues.time
  //           ? endOfDay(filterValues.time).valueOf()
  //           : null,
  //       };
  //       const res = await getApi(
  //         API_CAMERA_AI.MOVEMENT_HISTORY_3_5,
  //         _.pickBy(payload),
  //       );
  //       setMovementHistory(res.data);
  //     } catch (error) {
  //       if (error?.response?.status !== 400) {
  //         showError(error);
  //       }
  //     } finally {
  //       onShowLoading(false);
  //     }
  //   }
  // };

  const fetchDetail = async () => {
    onShowLoading(true);
    try {
      const res = await getApi(
        API_EVENTS.LIST_EVENTS,
      );
      for (const item of res.data.rows) {
        if (item.id == id) {
          setData(item);
        }
      }
    } catch (error) {
      showError(error);
    } finally {
      onShowLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  useEffect(() => {
    if (data) {
      convertDate();
      setDescriptionValue(data?.description);
    }
  }, [data]);

  // useEffect(() => {
  //   if (data) {
  //     fetchMovementHistory();
  //   }
  // }, [data, filterValues]);

  return (
    <Fragment>
      {loading && <Loading />}
      {showModalImage && (
        <ModalImage
          onClose={() => {
            setShowModalImage(null);
          }}
          imageUrl={showModalImage}
        />
      )}
      <Container>
        <Header>
          {/* <div className="left-header">
            <button
              onClick={() => {
                history.push(`/camera-ai/list-event`);
              }}
              type="button"
              style={{
                backgroundColor: 'inherit',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <img src={BackIcon} alt="" />
            </button>
            <span className="title" />
          </div> */}
          <PageHeader
            showBackButton
            title={"Chi tiết sự kiên xâm nhập trái phép"}
            onBack={()=> {history.push(`/camera-ai/list-event`);
            }}
          >  
          </PageHeader>
          {/* <div className="right-header">
            <Link
              to={{
                pathname: `/camera-ai/list-item/live/${data?.deviceId}/${data?.timeOccur}`,
              }}
              style={disableLive ? { pointerEvents: 'none' } : null}
            >
              <Button
                disabled={disableLive}
                style={{
                  background: '#00554A',
                  boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
                  borderRadius: '8px',
                  height: '40px',
                  width: '117px',
                  color: '#fff',
                  marginRight: '32px',
                }}
              >
                {intl.formatMessage(messages.liveStream)}
              </Button>
            </Link>
            <Link
              to={{
                pathname: `/camera-ai/list-item/playback/${data?.deviceId}/${data?.timeOccur}`,
              }}
            >
              <Button
                style={{
                  background: '#00554A',
                  boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
                  borderRadius: '8px',
                  height: '40px',
                  width: '104px',
                  color: '#fff',
                }}
              >
                {intl.formatMessage(messages.playBack)}
              </Button>
            </Link>
          </div> */}
        </Header>
        <ContentContainer>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid container item xs={12} spacing={10}>
              <Grid item xs={7}>
                <div
                  style={{
                    fontWeight: '500',
                    fontSize: '16px',
                    lineHeight: '23px',
                    letterSpacing: '0.38px',
                  }}
                >
                  {intl.formatMessage(messages.image)}
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '392px',
                  }}
                >
                  {/* eslint-disable-next-line jsx-a11y/alt-text,jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                  <img
                    style={{
                      maxWidth: '100%',
                      height: '392px',
                      borderRadius: '8px',
                      marginBottom: '20px',
                    }}
                    src={getImageUrlFromMinio(data?.imageUrl)}
                    onClick={() => {
                      setShowModalImage(getImageUrlFromMinio(data?.imageUrl));
                    }}
                  />
                </div>
              </Grid>
              <Grid item xs={5}>
                <div>
                  <Label>{intl.formatMessage(messages.area)}</Label>
                  <TextBox
                    style={{
                      background: 'rgba(60, 60, 67, 0.1)',
                    }}
                    disabled
                    stylingMode="outlined"
                    value={data?.areaName}
                    mode="text"
                  />
                  <Label>{intl.formatMessage(messages.time)}</Label>
                  <TextBox
                    style={{
                      background: 'rgba(60, 60, 67, 0.1)',
                    }}
                    disabled
                    stylingMode="outlined"
                    value={timeOccur}
                    mode="text"
                  />
                  <Label>{intl.formatMessage(messages.device)}</Label>
                  <TextBox
                    style={{
                      background: 'rgba(60, 60, 67, 0.1)',
                    }}
                    disabled
                    stylingMode="outlined"
                    value={data?.deviceName}
                    mode="text"
                  />
                  <div style={{ display: 'flex' }}>
                    <Label>{intl.formatMessage(messages.note)}</Label>
                    <img
                      style={{
                        marginLeft: '6px',
                        marginBottom: '-12px',
                      }}
                      src={EditIcon}
                      alt=""
                    />
                  </div>
                  <TextareaAutosize
                    disabled={!scopes.update}
                    style={{
                      height: '150px',
                      width: '100%',
                      border: '0.5px solid #117B5B',
                      borderRadius: '6px',
                      padding: '8px 23px',
                    }}
                    value={descriptionValue}
                    onChange={(e) => {
                      setDescriptionValue(e.target.value);
                    }}
                    onBlur={() => {
                      updateDescription();
                    }}
                    placeholder={intl.formatMessage(messages.enterNotes)}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
          <hr
            style={{
              border: '1px solid rgba(0, 0, 0, 0.12)',
              margin: '23px 0px',
            }}
          />
          {/* <PageHeader
            title="Lộ trình di chuyển của đối tượng"
            // showSearch
            showPager
            totalCount={movementHistory?.count || 0}
            pageIndex={filterValues.page}
            rowsPerPage={filterValues.limit}
            handleChangePageIndex={handleChangePageIndex}
            handlePageSize={handlePageSize}
          >
            <DateBox
              type="date"
              showAnalogClock={false}
              showClearButton
              value={filterValues?.time || null}
              useMaskBehavior
              onValueChanged={(e) => {
                handleDatebox(e.value);
              }}
              placeholder="Chọn ngày"
              displayFormat="dd/MM/yyyy"
              max={now}
            />
          </PageHeader>
          {renderTable} */}
        </ContentContainer>
      </Container>
    </Fragment>
  );
}

const Container = styled.div`
  margin-top: 21px;
  width: 100%;
  height: 100%;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  & .title {
    display: inline-block;
    width: 43%;
    float: left;
    font-weight: 500;
    font-size: 20px;
    line-height: 23px;
    letter-spacing: 0.38px;
    color: rgba(0, 0, 0, 0.8);
    margin-top: 9px;
  }
  .left-header {
    width: 50%;
    display: flex;
    justify-content: flex-start;
  }
  .right-header {
    width: 50%;
    display: flex;
    justify-content: flex-end;
    padding-right: 90px;
  }
  }
`;

const Label = styled.div`
  & {
    margin-top: 24px;
    height: 18px;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 10px;
    color: #252525;
    opacity: 0.8;
  }
`;
const ContentContainer = styled.div`
  margin-top: 20px;
  min-height: 100%;
  background: #ffffff;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  padding: 20px 35px;
`;

IntrusionCameraAi.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  data: makeSelectData(),
  form: makeForm(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadData: (event) => {
      dispatch(loadData(event));
    },
    onUpdate: (id, data) => {
      dispatch(UpdateData(id, data));
    },
    onSetFormType: (evt) => {
      dispatch(setFormType(evt));
    },
    onShowLoading: (event) => {
      dispatch(showLoading(event));
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(IntrusionCameraAi);
