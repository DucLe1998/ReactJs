import { API_FILE, NAVIGATION_API } from 'containers/apiUrl';
import zip from 'jszip';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import {
  ImageOverlay,
  MapContainer,
  TileLayer,
  ZoomControl,
  GeoJSON,
} from 'react-leaflet';
import styled from 'styled-components';
import useAxios from 'axios-hooks';
import { showError } from 'utils/toast-utils';
import greenPoint from './point.svg';
import bluePoint from './blue_point.svg';
import redPoint from './red_point.svg';
import grayPoint from './gray_point.svg';
const MapWrapper = styled.div`
  & .leaflet-container {
    height: 100%;
  }
`;
const pointIcons = {
  default: L.icon({
    iconUrl: bluePoint,
    iconSize: [25, 25],
  }),
  ALLOWED: L.icon({
    iconUrl: greenPoint,
    iconSize: [25, 25],
  }),
  ACCESS_DENNY: L.icon({
    iconUrl: redPoint,
    iconSize: [25, 25],
  }),
  DISABLED: L.icon({
    iconUrl: grayPoint,
    iconSize: [25, 25],
  }),
};
export default function Map({
  children,
  onContentReady,
  style,
  pointing = {
    visiable: false,
    filter: [],
  },
}) {
  const mapConfig = useRef({});
  // get map info
  const [{ data: mapData, error: getMapError }] = useAxios(
    NAVIGATION_API.GET_MAP,
  );
  useEffect(() => {
    if (getMapError) {
      showError(getMapError);
    }
  }, [getMapError]);

  useEffect(() => {
    if (mapData) {
      executeGetFile({
        url: `${API_FILE.DOWNLOAD_PUBLIC_API}/${mapData.fileMapId}`,
      });
    }
  }, [mapData]);

  // get Map file
  const [{ response: getFileData, error: getFileError }, executeGetFile] =
    useAxios(
      {
        method: 'GET',
        responseType: 'blob',
      },
      {
        manual: true,
      },
    );
  useEffect(() => {
    if (getFileError) {
      showError(getFileError);
    }
  }, [getFileError]);

  useEffect(() => {
    if (getFileData) {
      zip.loadAsync(getFileData).then((z) => {
        z.file('metadata')
          .async('string')
          .then((d) => {
            const data = JSON.parse(d);
            const getBgImage = new Promise((resolve, reject) => {
              const backgroundFile = data.background_map;
              z.file(backgroundFile)
                .async('blob')
                .then((data) => {
                  mapConfig.current.background_map = URL.createObjectURL(data);
                  resolve(data);
                })
                .catch((err) => reject(err));
            });
            const getBounds = new Promise((resolve, reject) => {
              const area = data.map_config.map_area;
              z.file(area)
                .async('string')
                .then((d) => {
                  const data = JSON.parse(d);
                  mapConfig.current.areaBound = L.geoJSON(data).getBounds();
                  resolve(data);
                })
                .catch((err) => reject(err));
            });
            const getPoints = new Promise((resolve, reject) => {
              const pointFile = data.map_config.poi_allowed;
              z.file(pointFile)
                .async('string')
                .then((d) => {
                  const data = JSON.parse(d);
                  data.features = data.features.map((f) => {
                    const { latitude, longitude, ...other } = f.properties;
                    return {
                      geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                      },
                      type: 'Feature',
                      properties: other,
                    };
                  });
                  mapConfig.current.points = data;
                  resolve(data);
                })
                .catch((err) => reject(err));
            });
            Promise.all([getBgImage, getBounds, getPoints])
              .then(() => {
                if (onContentReady) onContentReady();
              })
              .catch((err) => {
                console.log(err);
              });
          });
      });
    }
  }, [getFileData]);
  const pointToLayer = (point, latlng) => {
    let type = 'default';
    if ((pointing?.filter || []).length > 0) {
      const found = pointing.filter.find(
        (item) => item.pointCode == point.properties.code,
      );
      if (found) type = found?.routeType || 'default';
    }
    return L.marker(latlng, {
      icon: pointIcons[type],
    }).bindTooltip(point.properties.name);
  };
  const pointFilter = (feature) => {
    if ((pointing?.filter || []).length <= 0) return true;
    const codes = pointing.filter.map((p) => p.pointCode);
    if (codes.includes(feature.properties.code)) return true;
    return false;
  };
  return (
    <MapWrapper style={style}>
      {Object.keys(mapConfig.current).length > 0 && (
        <MapContainer
          bounds={mapConfig.current.areaBound}
          zoom={15}
          scrollWheelZoom
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          <ImageOverlay
            url={mapConfig.current.background_map}
            bounds={mapConfig.current.areaBound}
          />
          {pointing.visiable && (
            <GeoJSON
              data={mapConfig.current.points}
              pointToLayer={pointToLayer}
              filter={pointFilter}
            />
          )}
          {children}
        </MapContainer>
      )}
    </MapWrapper>
  );
}
