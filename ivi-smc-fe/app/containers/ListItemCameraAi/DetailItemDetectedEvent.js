import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Button } from 'devextreme-react/button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { Link } from 'react-router-dom';
import reducer from './reducer';
import saga from './saga';
import messages from '../ListUserCameraAi/messages';
import ModalImage from '../ListUserCameraAi/items/ModalImage';
import { getImageUrlFromMinio } from '../../utils/utils';

const key = 'ListItem';

export function DetailItemDetectedEvent({ elem }) {
  const intl = useIntl();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const [showModalImage, setShowModalImage] = useState(false);
  const [imgUrl, setImgUrl] = useState('');

  // const getPathImage = () => {
  //   const tmpImg = elem?.imageUrl || '';
  //   let path = '';
  //   if (tmpImg) {
  //     const list = tmpImg.split('/');
  //     const paths = list.slice(3, list.length) || '';
  //     if (paths) {
  //       path = paths.join('/');
  //     }
  //   }
  //   return path;
  // };

  const fetchImage = async () => {
    setImgUrl(getImageUrlFromMinio(elem?.imageUrl));
    // const path = getPathImage();
    // if (path === '') {
    //   setImgUrl('');
    //   return;
    // }
    // try {
    //   const res = await callApiExportFile(
    //     `${API_ROUTE.DOWNLOAD_FILE_API}/${path}`,
    //     'GET',
    //     null,
    //   );
    //   setImgUrl(URL.createObjectURL(res));
    // } catch (error) {
    //   setImgUrl('');
    // }
  };

  useEffect(() => {
    fetchImage();
  }, [elem]);

  return (
    <Fragment>
      <Grid item lg={2} md={3} sm={3} style={{ backgroundColor: '#f5f5fa' }}>
        <Card style={{ boxShadow: 'none', padding: 20, borderRadius: 8 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="186"
              image={imgUrl}
              style={{ borderRadius: '8px' }}
              onClick={() => {
                setShowModalImage(!showModalImage);
              }}
            />
            <CardContent>
              <Typography
                variant="body2"
                color="textSecondary"
                component="h3"
                style={{
                  fontWeight: '500',
                  fontSize: '18px',
                  lineHeight: '22px',
                  color: '#000000',
                }}
              >
                {elem.deviceName}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                style={{
                  fontSize: '14px',
                  lineHeight: '16px',
                  color: '#252525',
                  opacity: '0.6',
                }}
              >
                {moment(elem.timeOccur).format('DD/MM/YYYY HH:mm')}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                style={{
                  fontWeight: '500',
                  fontSize: '13px',
                  lineHeight: '15px',
                  color: '#252525',
                  opacity: '0.6',
                  marginTop: '9px',
                }}
              >
                {elem.blockName}
              </Typography>
            </CardContent>
          </CardActionArea>
          <Link
            to={{
              pathname: `/camera-ai/list-item/playback/${elem.deviceId}/${
                elem.timeOccur
              }`,
              // state: {
              //   ...elem,
              //   action: ACTION.PLAYBACK,
              // },
            }}
          >
            <Button
              style={{
                background: '#00554A',
                boxShadow: '0px 4px 10px rgb(16 156 241 / 24%)',
                borderRadius: '8px',
                height: 39,
                color: '#fff',
                margin: 'auto',
                width: 'fit-content',
                display: 'block',
                padding: '10px',
              }}
            >
              {intl.formatMessage(messages.playback_text)}
            </Button>
          </Link>
        </Card>
      </Grid>
      {showModalImage && (
        <ModalImage
          onClose={() => {
            setShowModalImage(false);
          }}
          imageUrl={imgUrl}
        />
      )}
    </Fragment>
  );
}

DetailItemDetectedEvent.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(DetailItemDetectedEvent);
