import React, { Fragment, useState } from 'react';
import _ from 'lodash';
import {
  callApiExportFile,
  callApiWithConfig,
  METHODS,
} from 'utils/requestUtils';
import { FIRE_ALARM_API } from 'containers/apiUrl';
import UploadFile from 'components/UploadFile';
import { Popup } from 'devextreme-react';
import { showError, showSuccess } from 'utils/toast-utils';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { getErrorMessage } from 'containers/Common/function';
import { CancelToken } from 'axios';
import { showErrorCustom } from 'utils/utils';
import { PopupProgress } from './PopupProgress';
import { useStyles } from '../styles';

const fileName = 'result';
const fileType =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export const ImportPopup = ({ onClose, reload, setLoading }) => {
  const classes = useStyles();

  const [progress, setProgress] = useState(0);
  const cancelFileUploadUser = React.useRef(null);

  const [popupProgress, setPopupProgress] = useState(false);

  const onDownloadBtnClick = () => {
    callApiExportFile(
      FIRE_ALARM_API.FAS_DOWNLOAD_TEMPLATE,
      'GET',
      null,
      null,
      null,
      {},
    )
      .then(res => {
        FileSaver.saveAs(res, 'template.xlsx');
      })
      .catch(err => {
        showError(err);
      });
  };

  const cancelDownloadAxios = v => {
    cancelFileUploadUser.current = v;
  };

  const progressCb = v => {
    setProgress((v.loaded / v.total) * 100);
  };

  const exportToCSV = apiData => {
    const convertedData = (apiData || []).map(val => ({
      LOCATION_NAME: val.locationName || '',
      FLOOR: val.floorName || '',
      PCCC_DEVICE: val.deviceName || '',
      CAMERA_NAME_1: val.cameraName1 || '',
      CAMERA_NAME_2: val.cameraName2 || '',
      CAMERA_NAME_3: val.cameraName3 || '',
      CAMERA_NAME_4: val.cameraName4 || '',
      'TRẠNG THÁI': val.success || '',
      'MESSAGE LỖI': val.message || '',
    }));
    const ws = XLSX.utils.json_to_sheet(convertedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const handleImportFile = file => {
    setPopupProgress(true);
    setTimeout(() => {
      handleUploadFile(file);
    }, 500);
  };

  const handleUploadFile = async file => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      // formData.append('isPublic ', true);
      try {
        const res = await callApiWithConfig(
          `${FIRE_ALARM_API.FAS_IMPORT}`,
          METHODS.POST,
          formData,
          {
            header: {
              'Content-Type': 'application/multipart/form-data; charset=UTF-8',
            },
            onUploadProgress: progressCb,
            cancelToken: new CancelToken(cancel => cancelDownloadAxios(cancel)),
          },
        );
        if (res && res.code === 200) {
          const val = res.data;
          const arr = val.filter(item => item.success !== true);
          const arrSuccess = val.filter(item => item.success === true);
          if (arrSuccess.length === val.length && val.length > 0) {
            checkResSuccess(val);
          } else if (arr.length >= 0) {
            checkResFailed(val);
          } else {
            checkResError();
          }
          reload();
        }
      } catch (e) {
        checkResError(getErrorMessage(e));
      }
    }
  };

  const onStop = () => {
    if (cancelFileUploadUser.current) cancelFileUploadUser.current();
    setPopupProgress(false);
  };

  const checkResFailed = data => {
    setPopupProgress(false);
    const text =
      'Đã xảy ra lỗi không mong muốn khi nhập danh sách khu vực.\n' +
      'Vui lòng thử lại!';
    showErrorCustom(
      () => {
        exportToCSV(data);
        setProgress(0);
      },
      () => {
        setProgress(0);
      },
      text,
      'error',
      true,
      true,
      '#E2E2E2',
      '#40a574',
      'Xem chi tiết',
      'Đóng',
    );
  };

  const checkResSuccess = data => {
    setPopupProgress(false);
    const text = 'Thông tin khu vực đã được cập nhật vào hệ thống.';
    showErrorCustom(
      () => {
        exportToCSV(data);
        setProgress(0);
      },
      () => {
        setProgress(0);
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

  const checkResError = (
    text = 'Định dạng dữ liệu không đúng. Vui lòng thử lại!',
  ) => {
    setPopupProgress(false);
    showErrorCustom(
      () => {},
      () => {
        setProgress(0);
      },
      text,
      'warning',
      false,
      true,
      '#E2E2E2',
      '#40a574',
      'Xem chi tiết',
      'Đóng',
    );
  };

  return (
    <Fragment>
      {popupProgress && (
        <Popup
          className={classes.popup}
          visible
          showTitle
          onHidden={() => {
            setPopupProgress(false);
          }}
          dragEnabled={false}
          width={600}
          height={320}
        >
          <PopupProgress progress={progress} stop={onStop} />
        </Popup>
      )}
      <Popup
        visible
        onHiding={() => {
          onClose(false);
        }}
        title="Thêm mới khu vực báo cháy"
        dragEnabled
        showTitle
        width="600px"
        height="auto"
      >
        <UploadFile
          title="Bấm để tải file excel và nhập danh sách khu vực báo cháy"
          helperText="Hệ thống sẽ so sánh dữ liệu mà bạn tải lên để thêm mới khu vực báo cháy vào hệ thống. Điều này đồng nghĩa với việc bạn phải chuẩn bị sẵn mẫu dữ liệu cho khu vực báo cháy mà bạn muốn thêm mới.
          Tải mẫu dữ liệu ở đây:"
          onImportFile={file => {
            handleImportFile(file);
          }}
          onDownloadTemplate={() => {
            onDownloadBtnClick();
          }}
          onClose={() => {
            onClose(false);
          }}
        />
      </Popup>
    </Fragment>
  );
};

export default ImportPopup;
