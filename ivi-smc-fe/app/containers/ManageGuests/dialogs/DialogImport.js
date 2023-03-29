import { faFileExcel, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ThemeProvider,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { IAM_API_SRC } from 'containers/apiUrl';
import FileSaver from 'file-saver';
import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { callApiExportFile, postApi } from 'utils/requestUtils';
import { showError } from 'utils/toast-utils';
import Loading from 'containers/Loading/Loadable';
import { utils, writeFile } from 'xlsx';
import { omit } from 'lodash';
const theme = createTheme({
  palette: {
    primary: green,
  },
});
const DropContainer = styled.div`
  border: 3px dashed;
  border-color: ${(props) => (props.isDragReject ? '#f44336' : 'steelblue')};
  min-height: 80px;
  justify-content: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 8px;
`;
export function DialogImport({ open, close, handleSuccess }) {
  const [loading, setLoading] = React.useState(false);
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragReject,
  } = useDropzone({
    accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    maxSize: 1024 ** 3 * 3, // 3Gb
  });
  useEffect(() => {
    if (fileRejections && fileRejections.length) {
      // const { errors } = fileRejections[0];
      showError('Tệp không hợp lệ');
    }
  }, [fileRejections]);
  const downloadFileExample = () => {
    setLoading(true);
    callApiExportFile(
      `${IAM_API_SRC}/guests/get-create-guest-template`,
      'GET',
      null,
    )
      .then((response) => {
        FileSaver.saveAs(response, `guest.xlsx`);
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const uploadFile = () => {
    if (!acceptedFiles || acceptedFiles.length <= 0) return;
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    postApi(`${IAM_API_SRC}/guests/create-by-file`, formData)
      .then((rs) => {
        if (rs.data) {
          const success = [];
          const errors = [];
          rs.data.forEach((item) => {
            if (item.id) {
              success.push(item);
            } else {
              errors.push(omit(item, 'deleted'));
            }
          });
          handleSuccess(success);
          if (errors.length > 0) {
            showError(
              `Thông tin ${errors.length} khách tải lên không hợp lệ, xem tệp kết quả tải về`,
            );
            const fileName = 'import-guest-result.xlsx';
            const ws = utils.json_to_sheet(errors);
            const wb = utils.book_new();
            utils.book_append_sheet(wb, ws, 'result');
            writeFile(wb, fileName);
          }
        }
        close();
      })
      .catch((error) => {
        showError(error);
      })
      .finally(setLoading(false));
  };

  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      onClose={() => {
        close();
      }}
    >
      {loading && <Loading />}
      <DialogTitle> Tải lên danh sách </DialogTitle>
      <DialogContent>
        <DropContainer {...getRootProps({ isDragReject })}>
          <input {...getInputProps()} />
          <FontAwesomeIcon icon={faFileUpload} size="5x" color="steelblue" />
          {acceptedFiles && acceptedFiles.length ? (
            <div>
              {React.Children.toArray(
                acceptedFiles.map((file) => (
                  <p>
                    {file.path} - {file.size} bytes
                  </p>
                )),
              )}
            </div>
          ) : (
            <p>Nhập file excel danh sách khách (*.xls, *.xlsx)</p>
          )}
        </DropContainer>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'space-between' }}>
        <ThemeProvider theme={theme}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<FontAwesomeIcon icon={faFileExcel} />}
            onClick={downloadFileExample}
            disabled={loading}
          >
            Dữ liệu mẫu
          </Button>
        </ThemeProvider>
        <div style={{ gap: '8px', display: 'flex' }}>
          <Button
            variant="contained"
            color="default"
            onClick={() => {
              close();
            }}
          >
            Hủy
          </Button>
          <Button
            disabled={!acceptedFiles || acceptedFiles.length <= 0}
            variant="contained"
            color="primary"
            onClick={uploadFile}
          >
            Thêm
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default DialogImport;
