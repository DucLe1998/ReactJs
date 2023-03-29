import React from 'react';
import { Button } from 'devextreme-react/button';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useStyles } from 'containers/User/style';
import {
  RowContent,
  RowItem,
  RowLabel,
} from '../../../components/CommonComponent';

export function PopupProgress({ stop, progress = 0 }) {
  const classes = useStyles();

  function CircularProgressWithLabel(props) {
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" {...props} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="caption"
            component="div"
            color="textSecondary"
            style={{ fontSize: 20 }}
          >{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <div className={classes.marginCard} style={{ textAlign: 'center' }}>
      <div className={classes.circularProgress}>
        <CircularProgressWithLabel value={progress} />
      </div>
      <p style={{ marginTop: 20 }}>
        <b>Đang nhập danh sách khu vực vào hệ thống...</b>
      </p>
      <RowItem style={{ float: 'right', marginTop: 20 }}>
        <RowLabel />
        <RowContent>
          <Button
            className={clsx(classes.button, classes.buttonFilter)}
            onClick={stop}
          >
            Dừng
          </Button>
        </RowContent>
      </RowItem>
    </div>
  );
}
