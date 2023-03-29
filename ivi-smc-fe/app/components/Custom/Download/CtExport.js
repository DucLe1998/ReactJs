import React from 'react';
import { Button } from 'devextreme-react/button';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import axios from 'axios';
import clsx from 'clsx';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import FileIcon from 'images/icon-button/file.svg';

import FileSaver from 'file-saver';
import { RowContent, RowItem, RowLabel } from 'components/CommonComponent';
import { useStyles } from './style';
import { callApiExportFile } from '../../../utils/requestUtils';
import { showError, showSuccess } from '../../../utils/toast-utils';

export function CtExport({
  isCancelDownload,
  close,
  setShowToast,
  setCancelTokenSource,
  setProgessDownload,
  cancelDownloadApi,
  params,
  api,
  fullUrlApi,
}) {
  const classes = useStyles();
  const [value, setValue] = React.useState('excel');
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const progressCb = (v) => {
    const current = parseFloat(v.loaded);
    const aaa = Math.floor((current / v.total) * 100);
    setProgessDownload(aaa);
  };

  const cancelDownload = (v) => cancelDownloadApi(v);

  const exportExcel = async () => {
    setShowToast(true);
    // params.format = 'EXCEL';
    const response = await callApiExportFile(
      fullUrlApi || `${ACCESS_CONTROL_API_SRC}/${api}/download`,
      'GET',
      null,
      progressCb,
      cancelDownload,
      // { page: 1, limit: 5000 },
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
      // AC_USER_STAFF.STAFF_DOWNLOAD,
      'GET',
      null,
      progressCb,
      cancelDownload,
      {},
    );
    // FileSaver.saveAs(response, `file-users-db`);
    return response;
  };

  const exportFile = () => {
    if (value === 'excel') {
      setProgessDownload(0);
      exportExcel()
        .then((response) => {
          setShowToast(false);
          FileSaver.saveAs(response, `file-ac-${api}.xlsx`);
          showSuccess('Xuất danh sách thiết bị thành công');
        })
        .catch(() => {
          setCancelTokenSource(axios.CancelToken.source());
          setShowToast(false);
          if (isCancelDownload) {
            showError('Xuất danh sách thiết bị thất bại');
          } else {
            showError('Có lỗi xảy ra vui lòng thử lại sau');
          }
        });
    } else if (value === 'database') {
      setProgessDownload(0);
      exportDatabase()
        .then((response) => {
          setShowToast(false);
          FileSaver.saveAs(response, `file-ac-${api}.csv`);
          showSuccess('Xuất danh sách thiết bị thành công');
        })
        .catch(() => {
          setCancelTokenSource(axios.CancelToken.source());
          setShowToast(false);
          if (isCancelDownload) {
            showError('Xuất danh sách thiết bị thất bại');
          } else {
            showError('Có lỗi xảy ra vui lòng thử lại sau');
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
            Chọn một phương thức để xuất dữ liệu
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
            label="Tệp tin excel"
          />
          <img
            alt="file"
            src={FileIcon}
            style={{ position: 'absolute', top: 5, right: 12 }}
          />
          {/* <FormControlLabel
            value="database"
            disabled
            control={
              <Radio className={classes.radio} size="small" color="default" />
            }
            label="Tệp cơ sở dữ liệu"
          />
          <img
            alt="db"
            src={DataBaseIcon}
            style={{ position: 'absolute', top: 48, right: 12 }}
          /> */}
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
            Hủy
          </Button>
          <Button
            className={clsx(classes.button, classes.buttonFilter)}
            onClick={() => {
              exportFile();
              close();
            }}
          >
            Đồng ý
          </Button>
        </RowContent>
      </RowItem>
    </div>
  );
}

export default CtExport;
