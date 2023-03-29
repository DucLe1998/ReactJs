import React, { useRef, useState } from 'react';
import SketchBoard from 'components/SketchBoard';
import { Layer } from 'react-konva';
import { Polygon } from 'components/Shapes';
import { Button, Chip } from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDrawPolygon } from '@fortawesome/free-solid-svg-icons';
const colorMap = [red, green, blue];
export default ({ camId, area, setArea }) => {
  const layerRef = useRef();
  const stageRef = useRef();
  const stageProps = { innerRef: stageRef };
  const onDelete = (index) => {
    const data = [...area];
    data.splice(index, 1);
    setArea(data);
  };
  const [loaded, setLoaded] = useState(null);
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
      }}
    >
      <SketchBoard camId={camId} stageProps={stageProps} onLoaded={setLoaded}>
        <Layer ref={layerRef}>
          {area &&
            React.Children.toArray(
              area.map((item, index) => (
                <Polygon
                  bound={loaded}
                  points={item}
                  onTransform={({ points }) => {
                    const data = [...area];
                    data[index] = points;
                    setArea(data);
                  }}
                  color={colorMap[index]}
                  closed
                />
              )),
            )}
        </Layer>
      </SketchBoard>
      <div
        style={{
          minWidth: 150,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<FontAwesomeIcon icon={faDrawPolygon} />}
          onClick={() => {
            const data = [...area];
            data.push([10, 10, 300, 10, 300, 300, 10, 300]);
            setArea(data);
          }}
          disabled={!camId || !loaded || !area || area.length >= 3}
        >
          Detection area
        </Button>
        {React.Children.toArray(
          area.map((item, index) => (
            <Chip
              color="secondary"
              label={`Area ${index + 1}`}
              style={{ backgroundColor: colorMap[index][500] }}
              onDelete={() => onDelete(index)}
            />
          )),
        )}
      </div>
    </div>
  );
};
