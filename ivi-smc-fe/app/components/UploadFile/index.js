/* eslint-disable no-underscore-dangle */
import { faFile, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Button as MatButton } from '@material-ui/core';
import { Button } from 'devextreme-react';
import { RowContent, RowItem, RowLabel } from 'components/CommonComponent';
import FileUploader from 'devextreme-react/file-uploader';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const FileContainer = styled.div`
  background: #fff;
  border: ${props => (props.error ? '1px solid #e24545' : '1px solid #ddd')};
  position: relative;
  border-radius: 4px;
  padding: 0px 0px 0px 0px;
  color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  flex: 1;
  cursor: pointer;
  justify-content: space-between;
  & .file-name {
    display: flex;
    align-items: center;
    padding: 7px 9px 8px;
    height: 100%;
    overflow: hidden;
    white-space: no-wrap;
    text-overflow: ellipses;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 5px;
  color: #e24545;
  font-size: 12px;
`;

const BtnSuccessWrap = styled.div`
  .dx-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 116px;
    height: 40px;
    background: ${props => props.bgColor || '#00554a'};
    border-radius: 8px;
    color: #ffffff;
    &:hover {
      opacity: 0.9;
      box-shadow: 0px 4px 10px rgba(16, 156, 241, 0.24);
      background: #00554a;
    }
    & .dx-button-content {
      display: block;
    }
  }
`;

const BtnCancelWrap = styled.div`
  .dx-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 116px;
    height: 40px;
    background: ${props => props?.bgColor || '#e2e2e2'};
    border: 1px solid #dddddd;
    box-sizing: border-box;
    border-radius: 8px;
    color: ${props => props.color || 'rgba(0, 0, 0, 0.8)'};
    &:hover {
      opacity: 0.9;
      box-shadow: 0px 4px 10px ${props => props?.bgColor || '#e2e2e2'};
      background: ${props => props?.bgColor || '#e2e2e2'};
    }
    & .dx-button-content {
      display: block;
    }
  }
`;

const defaulthelperText =
  'Hệ thống sẽ so sánh dữ liệu mà bạn tải lên để thêm mới thiết bị vào hệ thống. Điều này đồng nghĩa với việc bạn phải chuẩn bị sẵn mẫu dữ liệu cho thiết bị mà bạn muốn thêm mới. Tải mẫu dữ liệu ở đây:';

export function UploadFile({
  title = 'Bấm để tải file excel và nhập danh sách thiết bị',
  helperText = defaulthelperText,
  onDownloadTemplate,
  onClose,
  onImportFile,
  placeholder = '*.xlsx',
}) {
  const fileUpload = useRef(null);
  const [fileUploadName, setFileUploadName] = useState('');
  const [fileUploadError, setFileUploadError] = useState('');
  const [disabledImport, setDisabledImport] = useState(true);
  const handleSave = () => {
    if (
      fileUpload &&
      fileUpload.current &&
      fileUpload.current.instance._files.length > 0
    ) {
      if (
        !fileUpload.current.instance._files.find(el => el.isValid() == false) &&
        fileUpload.current.instance._files.length <= 3 &&
        !fileUpload.current.instance._files[0]._isLoaded
      ) {
        // neeus cos file phair upload file xong sau ddos mowis luu
        fileUpload.current.instance._isCustomClickEvent = true;
        fileUpload.current.instance._uploadButton._$element[0].click();
      } else {
        onImportFile(fileUpload.current.instance._files[0].value);
      }
    }
  };
  return (
    <div style={{ padding: '20px 0px' }}>
      <RowItem direction="column">
        <RowLabel style={{ width: '400px' }}>{title}</RowLabel>
        <RowContent style={{ flexDirection: 'column' }}>
          <FileContainer
            error={fileUploadError}
            onClick={() => {
              fileUpload.current.instance._isCustomClickEvent = true;
              if (
                fileUpload &&
                fileUpload.current &&
                fileUpload.current.instance &&
                fileUpload.current.instance._$fileInput[0]
              ) {
                fileUpload.current.instance._$fileInput[0].click();
              }
            }}
          >
            <div
              className="file-name"
              style={{
                color: fileUploadName ? '#000' : 'inherit',
                borderRadius: '21px',
              }}
            >
              {fileUploadName || placeholder}
            </div>
            <IconButton size="small" color="primary">
              <FontAwesomeIcon icon={faFileImport} />
            </IconButton>
          </FileContainer>
          <ErrorMessage>{fileUploadError}</ErrorMessage>
          <div style={{ margin: '20px 0px' }}>{helperText}</div>
        </RowContent>
        <MatButton
          startIcon={<FontAwesomeIcon icon={faFile} />}
          style={{ color: '#40a574' }}
          variant="contained"
          onClick={() => {
            if (onDownloadTemplate) onDownloadTemplate();
          }}
        >
          Dữ liệu mẫu
        </MatButton>
      </RowItem>
      <FileUploader
        visible={false}
        ref={fileUpload}
        uploadMode="useButtons"
        onValueChanged={e => {
          setDisabledImport(e.value.length <= 0);
          if (e.value.length > 0) {
            setFileUploadName(e.value[0].name);
            if (!fileUpload.current.instance._files[0].isValid()) {
              setDisabledImport(true);
              setFileUploadError(
                fileUpload.current.instance._files[0].$statusMessage.text(),
              );
            } else {
              setFileUploadError('');
            }
          } else {
            setFileUploadName('');
            setFileUploadError('');
          }
        }}
        uploadFile={file => {
          onImportFile(file);
        }}
        maxFileSize={10000000}
        accept=".xls,.xlsx"
        allowedFileExtensions={['.xls', '.xlsx']}
        readyToUploadMessage="Sẵn sàng tải lên"
        invalidMaxFileSizeMessage="Vui lòng chọn file < 100MB. "
        invalidFileExtensionMessage="File không đúng định dạng. "
      />
      <RowItem>
        <RowLabel />
        <RowContent
          className="button-container"
          style={{ justifyContent: 'flex-end' }}
        >
          <BtnCancelWrap>
            <Button variant="contained" onClick={onClose}>
              Hủy
            </Button>
          </BtnCancelWrap>
          <BtnSuccessWrap>
            <Button
              color="primary"
              disabled={disabledImport}
              variant="contained"
              onClick={handleSave}
              style={{ marginLeft: '8px' }}
            >
              Xác nhận
            </Button>
          </BtnSuccessWrap>
        </RowContent>
      </RowItem>
    </div>
  );
}

export default UploadFile;
