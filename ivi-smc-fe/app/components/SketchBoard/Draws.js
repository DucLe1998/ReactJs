import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Stage } from 'react-konva';

const Draws = ({
  resolution,
  containerWidth,
  videoSize,
  children,
  stageProps,
}) => {
  const { scaleX, scaleY, containerHeight } = useMemo(() => {
    const containerHeight =
      (videoSize.height / videoSize.width) * containerWidth;
    let scaleX;
    let scaleY;
    if (resolution?.width && resolution?.height) {
      scaleX = containerWidth / resolution.width;
      scaleY = containerHeight / resolution.height;
    } else {
      const scale = containerWidth / videoSize.width;
      scaleX = scale;
      scaleY = scale;
    }
    return { scaleX, scaleY, containerHeight };
  }, [
    resolution?.width,
    resolution?.height,
    containerWidth,
    videoSize.width,
    videoSize.height,
  ]);

  return (
    <StyledStage
      width={containerWidth}
      height={containerHeight}
      scaleX={scaleX}
      scaleY={scaleY}
      {...stageProps}
    >
      {children}
    </StyledStage>
  );
};

const StyledStage = styled(Stage)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
`;

export default Draws;
