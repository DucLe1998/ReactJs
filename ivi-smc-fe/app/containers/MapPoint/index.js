import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import { NAVIGATION_API } from 'containers/apiUrl';
import MapContainer from 'containers/Map';
import List from 'devextreme-react/list';
import L from 'leaflet';
import React, { useEffect, useState } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import { showError } from 'utils/toast-utils';
import LocationIcon from './Location.svg';
const icon = L.icon({
  iconUrl: LocationIcon,
  iconSize: [48, 48],
  iconAnchor: [24, 41],
});
const useStyles = makeStyles(() => ({
  root: {
    paddingTop: '25px',
    display: 'flex',
    height: 'calc(100vh - 75px)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
}));
export default function MapPoint() {
  const classes = useStyles();
  const [selectedPoint, setSelectedPoint] = useState(null);

  // get list route
  const [{ data: getListData, error: getListError }, executeGetList] = useAxios(
    {
      url: NAVIGATION_API.POINTS,
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
  const onContentReady = () => {
    executeGetList();
  };
  const onItemClick = (e) => {
    if (selectedPoint && selectedPoint.id == e.itemData.id) {
      setSelectedPoint(null);
    } else setSelectedPoint(e.itemData);
  };
  return (
    <div className={classes.root}>
      <Box width={320} bgcolor="white" p={1}>
        <List
          dataSource={getListData}
          height="100%"
          displayExpr="name"
          keyExpr="id"
          noDataText="Không có dữ liệu"
          searchEnabled
          searchExpr="name"
          pageLoadMode="scrollBottom"
          selectionMode="single"
          selectedItems={[selectedPoint]}
          onItemClick={onItemClick}
          // itemRender={itemRender}
        />
      </Box>
      <MapContainer
        style={{ height: '100%', flex: 1 }}
        onContentReady={onContentReady}
        pointing={{
          visiable: true,
          filter: [],
        }}
      >
        {selectedPoint && (
          <Marker
            icon={icon}
            position={[selectedPoint.latitude, selectedPoint.longitude]}
          >
            <Tooltip>{selectedPoint.name}</Tooltip>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
