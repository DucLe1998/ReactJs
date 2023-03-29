/* eslint-disable no-unused-expressions */
import { Button, DialogActions, DialogContent } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { API_DETAIL_USER_IDENTITY } from 'containers/apiUrl';
import React, { Fragment, useEffect, useState } from 'react';
import { buildUrlWithToken } from 'utils/utils';
import LoadingIndicator from 'components/LoadingIndicator';
import useAxios from 'axios-hooks';
import { showError } from 'utils/toast-utils';
const Img = React.memo(props => {
  const [loaded, setLoaded] = useState(false);
  const { src } = props;
  return (
    <>
      <div
        style={
          loaded
            ? { display: 'none' }
            : {
                width: '100px',
                height: '100px',
                display: 'grid',
                backgroundColor: '#C4C4C4',
                placeItems: 'center',
              }
        }
      >
        <CircularProgress size={20} />
      </div>
      <img
        {...props}
        src={src}
        alt="Ảnh"
        onLoad={() => setLoaded(true)}
        style={
          loaded ? { width: '100px', height: '100px' } : { display: 'none' }
        }
      />
    </>
  );
});

const ImgCards = ({ data, imgTitle }) => (
  <div style={{ display: 'flex', gap: '34px' }}>
    {React.Children.toArray(
      data.map((item, index) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Img
            src={
              item
                ? item.imageFileUrl
                  ? buildUrlWithToken(item.imageFileUrl)
                  : `data:image/jpeg;base64,${item.imageBase64}`
                : null
            }
          />
          <p style={{ margin: 0, marginTop: '5px', whiteSpace: 'nowrap' }}>
            {imgTitle} {index + 1}
          </p>
        </div>
      )),
    )}
  </div>
);
export default function DialogIdentityDetails({ data, onSubmit }) {
  const [{ data: identityData, loading, error }] = useAxios(
    API_DETAIL_USER_IDENTITY.LIST(data.guestId),
    {
      useCache: false,
    },
  );
  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  return (
    <Fragment>
      <DialogContent>
        {loading ? (
          <LoadingIndicator />
        ) : (
          <Fragment>
            {identityData?.faces?.length ? (
              <ImgCards data={identityData?.faces} imgTitle="Ảnh" />
            ) : (
              <h4>Không có hình ảnh khuôn mặt</h4>
            )}
          </Fragment>
        )}
      </DialogContent>
      <DialogActions>
        {data.faceIdentityStatus == 'WAITING' ? (
          <Fragment>
            <Button
              variant="contained"
              onClick={() => onSubmit('cancel')}
              color="secondary"
            >
              Từ chối
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onSubmit('approve')}
            >
              Phê duyệt
            </Button>
          </Fragment>
        ) : (
          <Button variant="contained" onClick={() => onSubmit(null)}>
            Đóng
          </Button>
        )}
      </DialogActions>
    </Fragment>
  );
}
