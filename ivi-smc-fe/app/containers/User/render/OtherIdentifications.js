import React from 'react';
import { Grid } from '@material-ui/core';
import { Button } from 'devextreme-react/button';
import { makeStyles } from '@material-ui/core/styles';
import { Popup } from 'devextreme-react/popup';
import { DateBox, TextBox } from 'devextreme-react';
import { buildUrlWithToken } from 'utils/utils';
import { RowContent, RowItem, RowLabel } from 'components/CommonComponent';
import clsx from 'clsx';

export const OtherIdentifications = ({ onClose, data }) => {
  const classes = useStyles();

  return (
    <Popup
      visible
      title={
        data.type === 'FACES' ? 'Thông tin khuôn mặt' : 'Thông tin vân tay'
      }
      showTitle
      onHidden={() => {
        onClose(false);
      }}
      dragEnabled
      width={data.type === 'FACES' ? 1000 : 600}
      height="auto"
    >
      <div className={classes.marginCard}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <span className={classes.label}>Thời gian cập nhật</span>
            <DateBox
              disabled
              id="timeUpdate"
              name="timeUpdate"
              type="date"
              displayFormat="dd/MM/yyyy HH:mm"
              value={data?.updatedAt || ''}
              showClearButton={false}
            />
          </Grid>
          <Grid item xs={6}>
            <span className={classes.label}>Trạng thái</span>
            <TextBox
              disabled
              id="status"
              name="status"
              stylingMode="outlined"
              value={
                data?.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'
              }
            />
          </Grid>
          {data.type === 'FINGERPRINTS' && (
            <Grid item xs={6}>
              <span className={classes.label}>Vân tay</span>
              <TextBox
                disabled
                id="status"
                name="status"
                stylingMode="outlined"
                value={data?.fingerprints ? data?.fingerprints?.length : '0'}
              />
            </Grid>
          )}
          {data.type === 'FACES' && (
            <>
              <Grid item xs={12}>
                <p>Thông tin định danh</p>
              </Grid>
              {(data.faces || []).map((item, index) => (
                <Grid key={item.id} item xs={2}>
                  <div
                    style={{
                      width: 150,
                      height: 150,
                      background: 'white',
                      border: '1px solid rgba(0, 0, 0, 0.24)',
                    }}
                  >
                    <img
                      style={{
                        width: 150,
                        height: 150,
                      }}
                      src={
                        item?.imageFileUrl && item.imageFileUrl.length > 0
                          ? buildUrlWithToken(item.imageFileUrl)
                          : `data:image/jpeg;base64,${item.imageBase64}`
                      }
                      alt={item.faceType}
                    />
                  </div>
                  <p style={{ textAlign: 'center' }}>Ảnh {index + 1}</p>
                </Grid>
              ))}
            </>
          )}
        </Grid>
        <RowItem style={{ float: 'right', marginTop: 20 }}>
          <RowLabel />
          <RowContent>
            <Button
              className={clsx(classes.button, classes.buttonFilter)}
              onClick={() => onClose(false)}
            >
              Đóng
            </Button>
          </RowContent>
        </RowItem>
      </div>
    </Popup>
  );
};

const useStyles = makeStyles(() => ({
  switch: {
    width: '100%',
    '& .MuiOutlinedInput-input': {
      color: '#333333',
      // background: '#E2E2E2',
      padding: '10px 14px',
    },
  },
  circularProgress: {
    '& .MuiCircularProgress-root': {
      width: '90px !important',
      height: '90px !important',
    },
    '& .MuiCircularProgress-colorPrimary': {
      color: '#5C5C5C !important',
    },
  },
  circularProgressExport: {
    '& .MuiCircularProgress-root': {
      width: '60px !important',
      height: '60px !important',
    },
    '& .MuiCircularProgress-colorPrimary': {
      color: '#5C5C5C !important',
    },
  },
  textFieldStyle: {
    '& .MuiFormControl-root': {
      width: '100%',
    },
    '& .MuiOutlinedInput-input': {
      padding: '10px 14px',
    },
  },
  fullWidth: {
    width: '100%',
    '& .MuiSwitch-root': {
      position: 'absolute',
      // top: 18,
      right: 5,
    },
    '& .MuiCheckbox-root': {
      position: 'absolute',
      left: 0,
      // padding: '10px 14px',
      // top: 18,
    },
    // '& .MuiCheckbox-colorPrimary.Mui-checked': {
    //   color: '#109CF1',
    // },
  },
  primaryColorButtonChange: {
    '& .MuiCheckbox-colorPrimary.Mui-checked': {
      color: '#109CF1',
    },
  },
  label: {
    marginTop: '0px !important',
  },
  button: {
    fontSize: 12,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px 25px',
    textTransform: 'inherit',
  },
  buttonFilter: {
    background: '#4B67E2',
    color: 'white',
    boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
    '&:hover': {
      background: '#4B67E2',
      color: 'white',
    },
  },
  buttonCancel: {
    background: '#E2E2E2',
    color: 'black',
    boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
    '&:hover': {
      background: '#E2E2E2',
      color: 'black',
    },
  },
  card: {
    marginTop: 20,
  },
  gridMargin: {
    marginTop: 10,
  },
  titleHeader: {
    fontWeight: 700,
    fontSize: 20,
  },
  radio: {
    fontWeight: 500,
    fontSize: 16,
  },
  radioLabel: {
    '& .MuiTypography-body1': {
      width: '100%',
      borderBottom: '0.5px solid rgba(0, 0, 0, 0.12)',
      fontWeight: 500,
    },
  },
  tab: {
    textAlign: 'center',
    '& .MuiToggleButton-label': {
      textTransform: 'initial',
      fontSize: 16,
      fontWeight: 700,
    },
    '& .MuiToggleButton-root': {
      padding: '5px 30px',
      borderRadius: 8,
    },
    '& .MuiToggleButton-root.Mui-selected': {
      background: 'white',
      boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.06)',
      borderRadius: 8,
    },
  },
  header: {
    width: '100%',
    display: 'flex',
  },
  leftHeader: {
    width: '50%',
  },
  rightHeader: {
    alignItems: 'center',
    width: '50%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  headerAdd: {
    fontWeight: 500,
    fontSize: 14,
    textAlign: 'right',
    color: '#117B5B',
    marginRight: 5,
  },
  marginCard: {
    // margin: '0 20px',
  },
  fileUploadIcon: {
    position: 'absolute',
    top: 95,
    right: 30,
    transform: 'rotate(45deg)',
  },
  placeholderUploadIcon: {
    color: '#109CF1',
    '&& .dx-texteditor-input': {
      fontWeight: 700,
      color: '#109CF1',
    },
  },
  textValidate: {
    color: 'red',
    marginTop: 1,
  },
  popupZIndex: {
    zIndex: '1299 !important',
  },
  optionAutocomplate: {
    padding: '0px !important',
  },
}));

export default OtherIdentifications;
