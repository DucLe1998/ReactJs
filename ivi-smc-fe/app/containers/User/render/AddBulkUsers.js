import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  CircularProgress,
} from '@material-ui/core';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import axios from 'axios';
import { RowContent, RowItem, RowLabel } from 'components/CommonComponent';
import { Popup } from 'devextreme-react/popup';
import { TextBox } from 'devextreme-react/text-box';
import FileSaver from 'file-saver';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { callApiExportFile, callApiWithConfig } from 'utils/requestUtils';
import { showError } from 'utils/toast-utils';
import { showErrorCustom } from 'utils/utils';
import { API_IAM } from '../../apiUrl';
import messages from '../messages';
import { useStyles } from '../style';
import { ListUserImport } from './ListUserImport';
import { PopupProgress } from './PopupProgress';
const { CancelToken, isCancel } = axios;

export function AddBulkUsers({ close }) {
  const classes = useStyles();
  const intl = useIntl();
  const [nameFile, setNameFile] = useState('*.xlsx');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const inputFile = useRef(null);
  const [mode, setMode] = useState('info');
  const [openPopup, setOpenPopup] = useState({
    open: false,
    value: [],
  });
  const cancelFileUploadUser = React.useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [popupProgress, setPopupProgress] = useState({
    open: false,
    value: {},
  });

  const onButtonClick = () => {
    inputFile.current.click();
  };
  const handleFileUpload = e => {
    const { files } = e.target;
    if (files && files.length) {
      const filename = files[0].name;
      const parts = filename?.split('.');
      const fileType = parts?.[parts.length - 1];
      if (fileType !== 'xlsx') {
        const text = 'Format dữ liệu không đúng. Vui lòng thử lại!';
        showErrorCustom(
          () => {},
          () => {},
          text,
          'warning',
          false,
          true,
          '#E2E2E2',
          '#40a574',
          'Xem chi tiết',
          'Đóng',
        );
        return;
      }
      setNameFile(filename.replace(' .xlsx', '.xlsx'));
      setFile(files[0]);
    } else {
      setNameFile('*.xlsx');
      setFile(null);
    }
  };
  const downloadFileExample = () => {
    const url =
      mode == 'info'
        ? API_IAM.USER_DOWNLOAD_TEMPLATE
        : API_IAM.UPLOAD_COVID_TEMPLATE;
    setLoading(true);
    callApiExportFile(url, 'GET', null)
      .then(response => {
        FileSaver.saveAs(response, `users.xlsx`);
      })
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const importFile = () => {
    const formData = new FormData();
    formData.append('file', file);
    if (file === null) {
      const text = 'Tệp tải lên không được để trống!';
      showErrorCustom(
        () => {},
        () => {},
        text,
        'warning',
        false,
        true,
        '#E2E2E2',
        '#40a574',
        'Xem chi tiết',
        'Đóng',
      );
    } else {
      setPopupProgress({
        open: true,
        value: file,
      });
      setTimeout(() => {
        uploadFile(file);
      }, 500);
    }
  };

  const cancelDownloadAxios = v => {
    cancelFileUploadUser.current = v;
  };

  const progressCb = v => {
    setProgress((v.loaded / v.total) * 100);
  };

  const exportToCSV = data => {
    FileSaver.saveAs(data, `users_upload_result.xlsx`);
  };

  const checkResSuccess = data => {
    setPopupProgress({
      open: false,
      value: {},
    });
    const text = 'Thông tin người dùng đã được cập nhật vào hệ thống.';
    showErrorCustom(
      () => {
        exportToCSV(data);
        setProgress(0);
        close();
      },
      () => {
        close();
      },
      text,
      'success',
      true,
      true,
      '#E2E2E2',
      '#40a574',
      'Xem chi tiết',
      'Đóng',
    );
  };

  const checkResError = err => {
    setPopupProgress({
      open: false,
      value: {},
    });
    if (!isCancel(err)) {
      const text = 'Format dữ liệu không đúng. Vui lòng thử lại!';
      showErrorCustom(
        () => {},
        () => {},
        text,
        'warning',
        false,
        true,
        '#E2E2E2',
        '#40a574',
        'Xem chi tiết',
        'Đóng',
      );
    }
  };

  const onStop = () => {
    if (cancelFileUploadUser.current) cancelFileUploadUser.current();
  };

  const uploadFile = async v => {
    const formData = new FormData();
    formData.append('file', v);
    callApiWithConfig(
      mode == 'info' ? API_IAM.USER_UPLOAD : API_IAM.UPLOAD_COVID,
      'POST',
      formData,
      {
        header: {
          'Content-Type': 'application/multipart/form-data; charset=UTF-8',
        },
        onUploadProgress: progressCb,
        cancelToken: new CancelToken(cancel => cancelDownloadAxios(cancel)),
        responseType: 'blob',
      },
    )
      .then(res => {
        checkResSuccess(res);
      })
      .catch(err => {
        checkResError(err);
      });
  };

  return (
    <div className={classes.marginCard}>
      <RadioGroup
        row
        aria-label="mode"
        name="mode"
        value={mode}
        onChange={e => setMode(e.target.value)}
      >
        <FormControlLabel
          value="info"
          control={<Radio color="primary" />}
          label="Thông tin cơ bản"
        />
        <FormControlLabel
          value="covid"
          control={<Radio color="primary" />}
          label="Thông tin y tế"
        />
      </RadioGroup>
      <span style={{ color: '#999999', fontSize: 14 }}>
        {intl.formatMessage(messages.importUserContent)}
      </span>
      <div style={{ position: 'relative' }}>
        <TextBox
          className={classes.placeholderUploadIcon}
          id="email"
          name="email"
          stylingMode="outlined"
          value={nameFile}
          disabled
        />
        <input
          type="file"
          id="file"
          ref={inputFile}
          multiple={false}
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <FontAwesomeIcon
          icon={faPaperclip}
          className={classes.fileUploadIcon}
          onClick={onButtonClick}
        />
      </div>
      <div>
        <p>{intl.formatMessage(messages.importUserContent2)}</p>
        <div style={{ display: 'flex' }}>
          <div style={{ position: 'relative' }}>
            <Button
              variant="contained"
              color="default"
              endIcon={<InsertDriveFileOutlinedIcon />}
              onClick={downloadFileExample}
              disabled={loading}
            >
              {intl.formatMessage(messages.sampleData)}
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                className={classes.buttonProgress}
                color="primary"
              />
            )}
          </div>
        </div>
      </div>
      <RowItem style={{ float: 'right', marginTop: 25 }}>
        <RowLabel />
        <RowContent>
          <Button
            variant="contained"
            color="default"
            style={{ marginRight: 10 }}
            onClick={() => {
              close();
            }}
          >
            {intl.formatMessage(messages.btnCancel)}
          </Button>
          <Button
            disabled={file === null}
            variant="contained"
            color="primary"
            onClick={importFile}
          >
            {intl.formatMessage(messages.btnAdd)}
          </Button>
        </RowContent>
      </RowItem>
      {openPopup.open && (
        <Popup
          className={`${classes.popupZIndex} popup`}
          visible
          title="Chi tiết"
          showTitle
          onHidden={() => {
            setOpenPopup({
              open: false,
              value: [],
            });
            close();
          }}
          dragEnabled
          width="85%"
          height="80%"
        >
          <ListUserImport
            listUser={openPopup.value}
            close={() => {
              setOpenPopup({
                open: false,
                value: [],
              });
              close();
            }}
          />
        </Popup>
      )}
      {popupProgress.open && (
        <Popup
          className={`${classes.popupZIndex} popup`}
          visible
          showTitle
          onHidden={() => {
            setPopupProgress({
              open: false,
              value: {},
            });
          }}
          dragEnabled={false}
          width={600}
          height={320}
        >
          <PopupProgress progress={progress} stop={onStop} />
        </Popup>
      )}
    </div>
  );
}

export default AddBulkUsers;
