import React from 'react';
import { Button } from 'devextreme-react/button';
import axios from 'axios';
import clsx from 'clsx';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { useIntl } from 'react-intl';
import FileIcon from 'images/icon-button/file.svg';
import DataBaseIcon from 'images/icon-button/database.svg';
import FileSaver from 'file-saver';
import {
  RowContent,
  RowItem,
  RowLabel,
} from '../../../components/CommonComponent';
import { useStyles } from '../style';
import messages from '../messages';
import { callApiExportFile } from '../../../utils/requestUtils';
import { API_IAM } from '../../apiUrl';
import { showError, showSuccess } from '../../../utils/toast-utils';

export function Export({
  isCancelDownload,
  close,
  setShowToast,
  setCancelTokenSource,
  setProgessDownload,
  cancelDownloadApi,
  params,
}) {
  const classes = useStyles();
  const intl = useIntl();
  const [value, setValue] = React.useState('excel');
  const handleChange = event => {
    setValue(event.target.value);
  };

  const progressCb = v => {
    const current = parseFloat(v.loaded);
    const aaa = Math.floor((current / v.total) * 100);
    setProgessDownload(aaa);
  };

  const cancelDownload = v => cancelDownloadApi(v);

  const exportExcel = async () => {
    setShowToast(true);
    params.format = 'EXCEL';
    const response = await callApiExportFile(
      API_IAM.USER_DOWNLOAD,
      'GET',
      null,
      progressCb,
      cancelDownload,
      params,
    );
    // FileSaver.saveAs(response, `file-users.xlsx`);
    return response;
  };
  const exportDatabase = async () => {
    // const response = await axios.get(API_IAM.USER_DOWNLOAD, {
    //   cancelToken: token,
    // });
    setShowToast(true);
    params.format = 'CSV';
    const response = await callApiExportFile(
      API_IAM.USER_DOWNLOAD,
      'GET',
      null,
      progressCb,
      cancelDownload,
      params,
    );
    // FileSaver.saveAs(response, `file-users-db`);
    return response;
  };

  const exportFile = () => {
    if (value === 'excel') {
      setProgessDownload(0);
      exportExcel()
        .then(response => {
          setShowToast(false);
          FileSaver.saveAs(response, `file-users.xlsx`);
          showSuccess('Xuất danh sách người dùng thành công');
        })
        .catch(() => {
          setCancelTokenSource(axios.CancelToken.source());
          setShowToast(false);
          if (isCancelDownload) {
            showError('Xuất danh sách người dùng thất bại');
          }
        });
    } else if (value === 'database') {
      setProgessDownload(0);
      exportDatabase()
        .then(response => {
          setShowToast(false);
          FileSaver.saveAs(response, `file-users.csv`);
          showSuccess('Xuất danh sách người dùng thành công');
        })
        .catch(() => {
          setCancelTokenSource(axios.CancelToken.source());
          setShowToast(false);
          if (isCancelDownload) {
            showError('Xuất danh sách người dùng thất bại');
          }
        });
    } else {
      close();
    }
  };

  return (
    <div className={classes.marginCard}>
      <FormControl component="fieldset" className={classes.fullWidth}>
        <FormLabel component="legend" style={{ marginBottom: 15 }}>
          <span style={{ color: '#999999', fontSize: 14 }}>
            {intl.formatMessage(messages.chooseMethodExport)}
          </span>
        </FormLabel>
        <RadioGroup
          className={classes.radioLabel}
          name="type"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel
            style={{ marginBottom: 5 }}
            value="excel"
            control={
              <Radio className={classes.radio} size="small" color="default" />
            }
            label={intl.formatMessage(messages.fileExcel)}
          />
          <img
            alt="file"
            src={FileIcon}
            style={{ position: 'absolute', top: 5, right: 12 }}
          />
          <FormControlLabel
            value="database"
            control={
              <Radio className={classes.radio} size="small" color="default" />
            }
            label={intl.formatMessage(messages.fileData)}
          />
          <img
            alt="db"
            src={DataBaseIcon}
            style={{ position: 'absolute', top: 48, right: 12 }}
          />
        </RadioGroup>
      </FormControl>
      <RowItem style={{ float: 'right', marginTop: 25 }}>
        <RowLabel />
        <RowContent>
          <Button
            style={{ marginRight: 10 }}
            className={clsx(classes.button, classes.buttonCancel)}
            onClick={() => {
              close();
            }}
          >
            {intl.formatMessage(messages.btnCancel)}
          </Button>
          <Button
            className={clsx(classes.button, classes.buttonFilter)}
            onClick={() => {
              exportFile();
              close();
            }}
          >
            {intl.formatMessage(messages.btnOK)}
          </Button>
        </RowContent>
      </RowItem>
    </div>
  );
}

export default Export;
