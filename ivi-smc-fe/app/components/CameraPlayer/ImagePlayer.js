import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { CAM_AI_DEVICE } from 'containers/apiUrl';
import { getApi } from 'utils/requestUtils';
import { buildUrlWithToken } from 'utils/utils';

export default React.forwardRef(
  (
    { id, onLoaded, minHeight, children, reloadTime = 10000, changeUrl },
    ref,
  ) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [src, setSrc] = useState('');
    let isCallApi = false;

    useEffect(() => {
      let isMounted = true;
      const fetchImage = async (id, interval = false) => {
        if (interval && !isCallApi) return;
        // nếu không phải interval gọi hàm nayf thì k cần resetState
        if (!interval) resetState();
        const ts = new Date().getTime();
        setError(null);
        try {
          const res = await getApi(CAM_AI_DEVICE.SNAPSHOT(id));
          if (isMounted) {
            if (res.data) {
              const url = `${buildUrlWithToken(res?.data)}&ts=${ts}`;
              if (changeUrl) changeUrl(url);
              setSrc(url);
              setError(null);
            } else {
              setError('Cannot load image from this camera');
            }
            isCallApi = true;
          }
        } catch (error) {
          if (changeUrl) changeUrl(null);
          setError(error.message);
          isCallApi = false;
        }
      };
      if (onLoaded) onLoaded(null);
      fetchImage(id);

      // const interval = setInterval(() => {
      //   fetchImage(id, true);
      // }, reloadTime);

      return () => {
        //   clearInterval(interval);
        isMounted = false;
      };
    }, [id]);

    const resetState = () => {
      setLoading(true);
      setSrc('');
    };

    const onLoad = useCallback(
      (e) => {
        setLoading(false);
        const width = e.currentTarget.naturalWidth;
        const height = e.currentTarget.naturalHeight;
        if (onLoaded) onLoaded({ width, height });
      },
      [onLoaded],
    );

    const onError = useCallback(() => {
      setError('Cannot load image from this camera');
    }, [src]);

    return (
      <Container minHeight={minHeight}>
        {src && (
          <Image
            src={src}
            onLoad={onLoad}
            onError={onError}
            innerRef={ref}
            crossOrigin="anonymous"
          />
        )}
        {loading && !error && (
          <Wrapper>
            <div>Loading</div>
          </Wrapper>
        )}
        {error && (
          <Wrapper>
            {/* <div>Camera mất kết nối</div> */}
            <p>{error}</p>
          </Wrapper>
        )}
        {!loading && !error && children}
      </Container>
    );
  },
);

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  // color: white;
`;

const Container = styled.div`
  position: relative;
  background-color: #fff;
  height: 100%;
  width: 100%;
  ${(props) =>
    props.minHeight &&
    `
        min-height: ${props.minHeight}px;
    `}
`;

const Image = styled.img`
  width: 100%;
  object-fit: fill;
  height: 100%;
  transition: all 0.2s ease;
`;
