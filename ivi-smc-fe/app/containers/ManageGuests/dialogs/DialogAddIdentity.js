import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import TextField from 'components/TextField';
import Loading from 'containers/Loading';
import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { callApiWithConfig, putApi } from 'utils/requestUtils';
import { API_FILE, GUEST_API } from 'containers/apiUrl';
import CameraIcon from '@material-ui/icons/Camera';
import { useDropzone } from 'react-dropzone';
import { showError } from 'utils/toast-utils';
import styled from 'styled-components';

const getBoderColor = ({ isDragActive, isDragReject }) => {
  if (isDragActive) {
    return 'steelblue';
  }
  if (isDragReject) {
    return '#f44336';
  }
  return '#ccc';
};
const DropContainer = styled.div`
  flex: 1;
  border: 3px dashed;
  border-color: ${(props) => getBoderColor(props)};
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 336px;
  cursor: pointer;
`;
export default function DialogEditIdentity({
  open,
  handleClose,
  initialValues,
  onSuccess,
  // guestsData,
  // guestIndex,
}) {
  const guestId = initialValues?.guestId;
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragReject,
    isDragActive,
  } = useDropzone({
    accept: 'image/jpeg,image/png',
    maxSize: 1024 ** 2,
  });
  function getImagePreview(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  useEffect(async () => {
    if (acceptedFiles && acceptedFiles.length) {
      const file = acceptedFiles[0];
      const preview = await getImagePreview(file);
      setFile({ file, preview });
    }
  }, [acceptedFiles]);
  useEffect(() => {
    if (fileRejections && fileRejections.length) {
      // const { errors } = fileRejections[0];
      showError('Tệp không hợp lệ');
    }
  }, [fileRejections]);
  const onSubmitForm = async () => {
    if (guestId && file) {
      setLoading(true);
      const formData = new FormData();
      const fileImport = await new Promise((resolve) => {
        if (file.file) {
          resolve(file.file);
        } else if (file.preview) {
          fetch(file.preview)
            .then((res) => res.blob())
            .then((blob) => {
              const fileimport = new File([blob], `${guestId}.png`, {
                type: 'image/png',
              });
              resolve(fileimport);
            });
        } else {
          resolve(null);
        }
      });
      if (fileImport) {
        formData.append('file', fileImport);
        formData.append('isPublic', true);
        formData.append('service', 'GUEST_REGISTRATION');
        try {
          callApiWithConfig(API_FILE.UPLOAD_API, 'POST', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }).then((res) => {
            const payload = {
              documentFileId: res.data.id,
              isUpdateIdentity: false,
              phoneNumber: initialValues?.phoneNumber,
              fullName: initialValues?.fullName,
            };
            putApi(GUEST_API.UPDATE(guestId), payload).then(() => {
              onSuccess(res.data.id);
            });
            setLoading(false);
          });
        } catch (e) {
          setLoading(false);
          showError(e);
          return null;
        }
      }
    }
    return null;
  };
  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      onClose={(e) => {
        handleClose(e);
      }}
    >
      <DialogTitle>Ảnh giấy tờ</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Số giấy tờ"
              value={initialValues.identityNumber}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Tên khách"
              value={initialValues.fullName}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <div style={{ maxWidth: '100%', position: 'relative' }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                style={{ maxWidth: '100%' }}
              />
              <Tooltip title="Chụp">
                <IconButton
                  size="small"
                  onClick={() => {
                    const imageSrc = webcamRef.current.getScreenshot();
                    setFile({ preview: imageSrc });
                  }}
                  style={{
                    position: 'absolute',
                    bottom: 5,
                    right: 5,
                    border: '1px solid #fff',
                  }}
                >
                  <CameraIcon />
                </IconButton>
              </Tooltip>
            </div>
          </Grid>
          <Grid item xs={6} container>
            <DropContainer {...getRootProps({ isDragReject, isDragActive })}>
              <input {...getInputProps()} />
              {file?.preview ? (
                <img
                  src={file?.preview}
                  alt="anh giay to"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                />
              ) : (
                <div>Chọn hoặc kéo thả tệp ảnh vào đây</div>
              )}
            </DropContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            handleClose();
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmitForm}
          disabled={!file}
        >
          Lưu
        </Button>
      </DialogActions>
      {loading && <Loading />}
    </Dialog>
  );
}
