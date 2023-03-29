import L from 'leaflet';
import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Tooltip } from 'react-leaflet';
import { LeafletTrackingMarker } from 'react-leaflet-tracking-marker';
import circle from './circle.svg';
export default function CarMarker(props) {
  const { data, onClick, isHovered, warnings, ...other } = props;
  const { latitude, longitude, numberPlate } = data;
  const warningHtml = ReactDOMServer.renderToStaticMarkup(
    <img src={circle} alt="warning" width={42} />,
  );
  const carIcon = L.divIcon({
    html: warnings && warnings.length > 0 ? warningHtml : '',
    iconSize: isHovered ? [78, 48] : [52, 32],
    className: isHovered ? 'car-marker car-marker-hovered' : 'car-marker',
  });
  const [prevPos, setPrevPos] = useState([latitude, longitude]);
  useEffect(() => {
    if (prevPos[0] !== latitude && prevPos[1] !== longitude) {
      setPrevPos([latitude, longitude]);
    }
  }, [latitude, longitude, prevPos]);
  return (
    <LeafletTrackingMarker
      icon={carIcon}
      position={[latitude, longitude]}
      previousPosition={prevPos}
      duration={1000}
      eventHandlers={
        onClick
          ? {
              click: onClick,
            }
          : undefined
      }
      {...other}
    >
      <Tooltip>{numberPlate}</Tooltip>
    </LeafletTrackingMarker>
  );
}
