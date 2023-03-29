import React, { useState } from "react";
import WidthDetector from "@atlaskit/width-detector";
import styled from "styled-components";
import Draws from "./Draws";

const ImageBoard = ({
  url,
  resolution,
  children,
  stageProps = {},
  containerChild
}) => {
  const [size, setSize] = useState(null);
  if (!url) return null;

  const onLoaded = (e) => {
    const { naturalHeight, naturalWidth } = e.target;
    setSize({ width: naturalWidth, height: naturalHeight });
  };
  return (
    <WidthDetector>
      {(containerWidth) => {
        return (
          <Container>
            <Img id={"camera-config"} src={url} onLoad={onLoaded} />
            {size && (
              <Draws
                containerWidth={containerWidth}
                videoSize={size}
                resolution={resolution}
                stageProps={stageProps}
              >
                {children}
              </Draws>
            )}
            {containerChild}
          </Container>
        );
      }}
    </WidthDetector>
  );
};

const Img = styled.img`
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: "#fff";
  border-radius: 3px;
  height: 100%;
  width: 100%;
`;

export default ImageBoard;
