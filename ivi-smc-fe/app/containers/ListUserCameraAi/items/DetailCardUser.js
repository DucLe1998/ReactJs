/**
 *
 * ListUserCameraAi
 *
 */

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
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Avatar2 from 'images/NoAvatar.svg';
import reducer from '../reducer';
import saga from '../saga';
import makeSelectListUserCameraAi from '../selectors';
import { buildUrlWithToken } from '../../../utils/utils';

const key = 'listUserCameraAi';

export function DetailCardUser({ elem }) {
  const classes = useStyles();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [imgUrl, setImgUrl] = useState('');

  const fetchImage = async () => {
    if (elem?.imageUrl) {
      setImgUrl(buildUrlWithToken(elem?.imageUrl));
    } else {
      setImgUrl(Avatar2);
    }
  };

  useEffect(() => {
    fetchImage();
  }, [elem]);
  return (
    <Fragment>
      <Grid item style={{ marginLeft: 50, marginBottom: 50 }}>
        <Card style={{ boxShadow: 'none', maxWidth: 200 }}>
          <CardActionArea
            style={{ display: 'flex', backgroundColor: 'rgb(206 209 215)' }}
          >
            <CardMedia
              component="img"
              // height="186"
              style={{
                maxHeight: 186,
                maxWidth: '100%',
                width: 'fit-content',
              }}
              image={imgUrl}
              onError={() => setImgUrl(Avatar2)}
            />
          </CardActionArea>
          <CardContent>
            <Typography
              variant="body2"
              component="p"
              style={{ margin: ' 8px 0px' }}
            >
              {elem?.companyName || ''}
            </Typography>
            <Typography
              variant="body2"
              component="h3"
              style={{ margin: ' 8px 0px' }}
            >
              {elem?.userDetectedName || ''}
            </Typography>
            <Typography
              variant="body2"
              component="p"
              style={{ margin: ' 8px 0px' }}
            >
              {elem?.code || ''}
            </Typography>
            <Link
              to={{
                pathname: `/camera-ai/list-user/${elem.uuid}`,
              }}
            >
              <Button className={classes.playbackBtn}>
                Lộ trình di chuyển
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Grid>
    </Fragment>
  );
}

const useStyles = makeStyles({
  playbackBtn: {
    background: '#00554A',
    boxShadow: '0px 4px 10px rgb(16 156 241 / 24%)',
    borderRadius: '8px',
    height: 39,
    color: '#fff',
    marginTop: '15px',
    width: 'fit-content',
    display: 'block',
  },
});

DetailCardUser.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  listUserCameraAI: makeSelectListUserCameraAi(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(DetailCardUser);
