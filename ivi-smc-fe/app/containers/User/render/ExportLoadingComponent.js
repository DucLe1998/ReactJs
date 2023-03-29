import React from 'react';
import styled from 'styled-components';
import { Card, Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { Button } from 'devextreme-react/button';
import clsx from 'clsx';
import { useStyles } from '../style';
import {
  RowContent,
  RowItem,
  RowLabel,
} from '../../../components/CommonComponent';

const LoadingContainer = styled.div`
  position: fixed;
  z-index: 99999999999;
  top: 60px;
  right: 20px;
  height: 100px;
  width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffffc4;
`;
export default function ExportLoadingComponent({ stop, progessDownload }) {
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
            style={{ fontSize: 15 }}
          >{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <LoadingContainer>
      <Card style={{ padding: 10 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={2}>
            <div className={classes.circularProgressExport}>
              <CircularProgressWithLabel value={progessDownload} />
            </div>
          </Grid>
          <Grid item xs={10}>
            <p style={{ color: '#000000', fontSize: 15 }}>
              <b>Đang xuất danh sách người dùng...</b>
            </p>
            <p style={{ color: '#000000', fontSize: 13 }}>
              Danh sách người dùng đang được xuất ra tệp. Hãy kiên nhẫn và chờ
              đợi!
            </p>
          </Grid>
        </Grid>
        <RowItem style={{ float: 'right' }}>
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
      </Card>
    </LoadingContainer>
  );
}
