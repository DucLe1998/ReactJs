import { useSize } from 'ahooks';
import ImagePlayer from 'components/CameraPlayer/ImagePlayer';
import React, { useRef, useState } from 'react';
import Draws from './Draws';
const SketchBoard = ({
  camId,
  resolution,
  children,
  stageProps = {},
  containerChild,
  onLoaded,
}) => {
  const [size, setSize] = useState(null);
  const ref = useRef();
  const imgSize = useSize(ref);
  return (
    <div ref={ref} style={{ flex: 1 }}>
      <ImagePlayer
        id={camId}
        onLoaded={(newVal) => {
          setSize(newVal);
          if (onLoaded) onLoaded(newVal);
        }}
      >
        {size && (
          <Draws
            containerWidth={imgSize.width}
            videoSize={size}
            resolution={resolution}
            stageProps={stageProps}
          >
            {children}
          </Draws>
        )}
        {containerChild}
      </ImagePlayer>
    </div>
  );
};

export default SketchBoard;
