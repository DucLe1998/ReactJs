/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  Box,
  IconButton,
  Link,
  List as MuiList,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Skeleton } from '@material-ui/lab';
import { useDebounceEffect, useDebounceFn } from 'ahooks';
import useAxios from 'axios-hooks';
import clsx from 'clsx';
import Dialog from 'components/Dialog';
import { REGISTRATION_API, NAVIGATION_API } from 'containers/apiUrl';
import MapContainer from 'containers/Map';
import { format } from 'date-fns';
import List from 'devextreme-react/list';
import DataSource from 'devextreme/data/data_source';
import L from 'leaflet';
import React, { createRef, useEffect, useMemo, useState } from 'react';
import SVG from 'react-inlinesvg';
import { Marker, Polyline } from 'react-leaflet';
import SockJsClient from 'react-stomp';
import styled from 'styled-components';
import { min2Time } from 'utils/functions';
import { showError } from 'utils/toast-utils';
import { buildUrlWithToken } from 'utils/utils';
import carImg from './car.png';
import carHoverImg from './car_hovered.png';
import LostGPSImg from './lost_gps.svg';
import CarMarker from './marker';
import TimeOutImg from './time_out.svg';
import WarningStatus from './warningStatus';
import WrongPlaceImg from './wrong_place.svg';

const { SOCKET_HOST } = process.env;
const Container = styled.div`
  padding-top: 25px;
  display: flex;
  height: calc(100vh - 75px);
  .car-marker {
    display: flex;
    align-items: center;
    background-image: url(${carImg});
    background-size: contain;
  }
  .car-marker-hovered {
    background-image: url(${carHoverImg});
  }
  .item-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
  }
`;
const useStyles = makeStyles(() => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  infoWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  warningWrapper: {
    display: 'flex',
    gap: 5,
  },
  inprogress: {
    '& > svg': {
      '&> circle': {
        fill: '#FF7F0B',
      },
    },
  },
  warningItem: {
    cursor: 'pointer',
    margin: '12px 0',
    padding: 12,
    backgroundColor: '#FFCFCF',
    borderRadius: 10,
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  warningItemInProgress: {
    backgroundColor: '#FFE5CE',
  },
}));
const WARNING_TYPE = {
  WRONG_PLACE: {
    label: 'Xe dừng đỗ trong khu vực cấm',
    icon: WrongPlaceImg,
    marker: L.icon({
      iconUrl: WrongPlaceImg,
      iconSize: [32, 32],
    }),
  },
  TIME_OUT: {
    label: 'Xe đi sai khung giờ',
    icon: TimeOutImg,
    marker: L.icon({
      iconUrl: TimeOutImg,
      iconSize: [32, 32],
    }),
  },
  LOST_GPS: {
    label: 'Mất kết nối thiết bị',
    icon: LostGPSImg,
    marker: L.icon({
      iconUrl: TimeOutImg,
      iconSize: [32, 32],
    }),
  },
};
const listRef = createRef();
export default function Navigation() {
  const wsUrl = buildUrlWithToken(SOCKET_HOST);
  const classes = useStyles();
  const [selectedCar, setSelectedCar] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [carLog, setCarLog] = useState([]);
  const [carList, setCarList] = useState([]);
  const [needReload, setNeedReload] = useState(0);
  const [needReloadOne, setNeedReloadOne] = useState(0);
  const [hoveredCar, setHoveredCar] = useState(null);
  const [selectedWarning, setSelectedWarning] = useState(null);
  const dataSource = new DataSource({
    store: carList,
    paginate: false,
  });
  const onContentReady = () => {
    executeGetList();
  };
  const carItemRender = (data) => (
    <div className="item-wrapper" id={data.id}>
      <div>{data.numberPlate}</div>
      {data.warnings && data.warnings.length > 0 && (
        <div className={classes.warningWrapper}>
          {React.Children.toArray(
            data.warnings.map((item) => {
              const { icon } = WARNING_TYPE[item.type];
              return (
                <span
                  className={clsx(
                    item.status == 'PROCESSING' && classes.inprogress,
                  )}
                >
                  <SVG src={icon} />
                </span>
              );
            }),
          )}
        </div>
      )}
    </div>
  );
  const onCarItemClick = ({ itemData }) => {
    setSelectedCar(itemData);
    executeGetRoute({ url: NAVIGATION_API.DETAILS_ROUTE(itemData.id) });
    executeGetRegistration({
      url: REGISTRATION_API.VEHICLE_ROUTE(
        itemData.registrationId,
        itemData.vehicleId,
      ),
    });
  };
  // get list route
  const [{ data: getListData, error: getListError }, executeGetList] = useAxios(
    {
      url: NAVIGATION_API.LIST_ROUTE,
      method: 'GET',
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (getListError) {
      showError(getListError);
    }
  }, [getListError]);
  useEffect(() => {
    if (getListData) {
      let scrollTop = null;
      if (listRef && listRef.current) {
        scrollTop = listRef.current.instance.scrollTop();
      }
      setCarList(getListData);
      if (listRef.current) {
        setTimeout(() => {
          listRef.current.instance.scrollTo(scrollTop);
        }, 0);
      }
    }
  }, [getListData]);
  // get tracking route
  const [
    { data: getRouteData, error: getRouteError, loading: getRouteLoaing },
    executeGetRoute,
    cancelGetRoute,
  ] = useAxios(
    {
      method: 'GET',
    },
    {
      useCache: false,
      manual: true,
    },
  );
  useEffect(() => {
    if (getRouteError) {
      showError(getRouteError);
    }
  }, [getRouteError]);
  useEffect(() => {
    if (getRouteData) {
      const data = getRouteData.trackings.map((item) => [
        item.latitude,
        item.longitude,
      ]);
      const markers = getRouteData.trackings.filter(
        (item) => item.trackingStatus != 'TRACKING',
      );
      setSelectedCar({
        ...getRouteData,
        trackings: data,
        lastTracking: getRouteData.trackings[0],
        markers,
      });
    }
  }, [getRouteData]);
  // get registration
  const [
    {
      data: getRegistrationData,
      error: getRegistrationError,
      loading: getRegistrationLoading,
    },
    executeGetRegistration,
    cancelGetRegistration,
  ] = useAxios(
    {
      method: 'GET',
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (getRegistrationError) {
      showError(getRegistrationError);
    }
  }, [getRegistrationError]);
  useEffect(() => {
    if (getRegistrationData) {
      const {
        allowedVehicleRoutes = [],
        accessDennyVehicleRoutes = [],
        ...other
      } = getRegistrationData;
      const markers = [...allowedVehicleRoutes, ...accessDennyVehicleRoutes];

      setRegistration({ ...other, markers });
    }
  }, [getRegistrationData]);
  useDebounceEffect(
    () => {
      if (needReload) executeGetList();
    },
    [needReload],
    {
      wait: 1000,
    },
  );
  useDebounceEffect(
    () => {
      if (needReloadOne && selectedCar)
        executeGetRoute({ url: NAVIGATION_API.DETAILS_ROUTE(selectedCar.id) });
    },
    [needReloadOne],
    {
      wait: 1000,
    },
  );
  function onMessage(data) {
    setCarLog([...carLog, data]);
    if (selectedCar) {
      if (data.numberPlate == selectedCar.numberPlate)
        setNeedReloadOne(needReloadOne + 1);
    } else setNeedReload(needReload + 1);
  }
  const timeRender = ({ startTimeInMinute, endTimeInMinute }) => {
    const start = min2Time(startTimeInMinute);
    const end = min2Time(endTimeInMinute);
    return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
  };
  const clearSelectedCar = () => {
    setSelectedCar(null);
    setRegistration(null);
    setNeedReload(needReload + 1);
    setHoveredCar(null);
    if (getRouteLoaing) cancelGetRoute();
    if (getRegistrationLoading) cancelGetRegistration();
  };
  const loadingRegistration = React.Children.toArray(
    new Array(5)
      .fill()
      .map(() => (
        <Skeleton
          variant="rect"
          animation="wave"
          width="100%"
          height="48px"
          style={{ marginTop: '7px' }}
        />
      )),
  );
  const onWarningClick = (data) => {
    setSelectedWarning(data);
  };
  const carInfoRender = selectedCar && (
    <div className={classes.infoWrapper}>
      <div className={classes.header}>
        <IconButton onClick={clearSelectedCar} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="p">
          {selectedCar.numberPlate}
        </Typography>
      </div>
      <div style={{ overflow: 'auto' }}>
        {selectedCar.warnings && selectedCar.warnings.length > 0 && (
          <div>
            {React.Children.toArray(
              selectedCar.warnings.map((item) => {
                const type = WARNING_TYPE[item.type];
                return (
                  <div
                    role="button"
                    tabIndex="0"
                    className={clsx(
                      classes.warningItem,
                      item.status == 'PROCESSING' &&
                        classes.warningItemInProgress,
                    )}
                    onClick={() => onWarningClick(item)}
                  >
                    <span
                      className={clsx(
                        item.status == 'PROCESSING' && classes.inprogress,
                      )}
                    >
                      <SVG src={type.icon} />
                    </span>
                    <span>{type.label}</span>
                  </div>
                );
              }),
            )}
          </div>
        )}
        {registration ? (
          <div>
            <Typography color="primary" variant="h6" component="p">
              Thông tin xe
            </Typography>
            <MuiList disablePadding>
              <ListItem>
                <ListItemText
                  primary="Tên xe"
                  secondary={registration?.vehicleName}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Người đại diện"
                  secondary={registration?.guestRepresentation?.fullName}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Số điện thoại"
                  secondary={registration?.guestRepresentation?.phoneNumber}
                />
              </ListItem>
            </MuiList>
            <Link
              color="primary"
              variant="h6"
              target="_blank"
              href={`/guest-registrations/details/${registration.registrationId}/list`}
            >
              Thông tin đơn đăng ký
            </Link>
            <MuiList disablePadding>
              <ListItem>
                <ListItemText
                  primary="Mã đơn"
                  secondary={registration?.registrationCode}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Thời gian"
                  secondary={timeRender(registration)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Khu vực"
                  secondary={registration?.area?.areaName}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Đơn vị"
                  secondary={registration?.group?.groupName}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Mục đích"
                  secondary={registration?.note}
                />
              </ListItem>
            </MuiList>
          </div>
        ) : (
          loadingRegistration
        )}
      </div>
    </div>
  );
  const trackingAllRender = useMemo(
    () =>
      carList &&
      carList.length &&
      React.Children.toArray(
        carList
          .filter((item) => item.lastTracking)
          .map((item) => (
            <CarMarker
              data={item.lastTracking}
              onClick={() => onCarItemClick({ itemData: item })}
              isHovered={hoveredCar && item.id == hoveredCar}
              warnings={item.warnings}
            />
          )),
      ),
    [carList, hoveredCar],
  );
  const trackingOneRender = selectedCar && (
    <>
      {selectedCar?.lastTracking && (
        <CarMarker
          data={selectedCar?.lastTracking}
          warnings={selectedCar.warnings}
        />
      )}
      {selectedCar.trackings && <Polyline positions={selectedCar.trackings} />}
      {selectedCar.markers &&
        React.Children.toArray(
          selectedCar.markers.map((item) => (
            <Marker
              icon={WARNING_TYPE[item.trackingStatus].marker}
              position={[item.latitude, item.longitude]}
            />
          )),
        )}
    </>
  );
  const { run } = useDebounceFn(
    (newVal) => {
      if (newVal) {
        const ele = newVal.getElementsByClassName('item-wrapper')[0];
        const id = ele?.id || null;
        setHoveredCar(id);
      } else setHoveredCar(null);
    },
    {
      wait: 500,
    },
  );
  const onOptionChanged = (args) => {
    if (args.name == 'hoveredElement') {
      run(args.value ? args.value[0] : null);
    }
  };
  const handleWarningDialogClose = (ret) => {
    if (ret) {
      console.log(ret);
      setSelectedWarning(null);
    } else setSelectedWarning(null);
  };
  const warningDialog = selectedWarning && (
    <Dialog
      title={WARNING_TYPE[selectedWarning.type].label}
      open={Boolean(selectedWarning)}
      onClose={() => handleWarningDialogClose(0)}
      maxWidth="sm"
      fullWidth
    >
      <WarningStatus
        initValue={selectedWarning}
        onSubmit={handleWarningDialogClose}
      />
    </Dialog>
  );
  const listCarRender = useMemo(
    () => (
      <List
        ref={listRef}
        dataSource={dataSource}
        height="100%"
        itemRender={carItemRender}
        displayExpr="numberPlate"
        keyExpr="id"
        noDataText="Không có dữ liệu"
        searchEnabled
        searchExpr="numberPlate"
        pageLoadMode="scrollBottom"
        onItemClick={onCarItemClick}
        onOptionChanged={onOptionChanged}
        // useNativeScrolling={false}
      />
    ),
    [carList],
  );
  return (
    <Container>
      {warningDialog}
      <SockJsClient
        url={wsUrl}
        topics={['/topic/notification']}
        headers={{
          'Access-Control-Allow-Credentials': true,
        }}
        onMessage={({ data }) => {
          const newData = JSON.parse(data);
          onMessage(newData);
        }}
      />
      <Box width={320} bgcolor="white" p={1}>
        {selectedCar ? carInfoRender : listCarRender}
      </Box>
      <MapContainer
        style={{ height: '100%', flex: 1 }}
        onContentReady={onContentReady}
        pointing={{
          visiable: selectedCar && Boolean(registration),
          filter: registration?.markers || [],
        }}
      >
        {selectedCar ? trackingOneRender : trackingAllRender}
      </MapContainer>
    </Container>
  );
}
