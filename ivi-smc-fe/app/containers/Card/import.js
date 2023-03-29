import { faFileExcel, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  createTheme,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  ThemeProvider,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { USER_CARD_API } from 'containers/apiUrl';
import FileSaver from 'file-saver';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { getApi } from 'utils/requestUtils';
import { showError } from 'utils/toast-utils';
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
const radioBtns = {
  input: {
    value: 'input',
    label: 'Nhập thẻ mới',
    btn: 'Nhập thẻ',
    url: USER_CARD_API.TEMPLATE(false),
    fileName: 'VF_card-template',
  },
  transfer: {
    value: 'transfer',
    label: 'Cấp thẻ cho người dùng',
    btn: 'Cấp thẻ',
    url: USER_CARD_API.TEMPLATE(true),
    fileName: 'VF_Import_Assign_Card',
  },
  block: {
    value: 'block',
    label: 'Khóa/mở thẻ',
    btn: 'Khóa/mở thẻ',
    url: USER_CARD_API.TEMPLATE_BLOCK,
    fileName: 'VF_card-block-unblock',
  },
};
export default function Import({ onSubmit }) {
  const [typeInput, setTypeInput] = useState('input');
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
  const downloadFileExample = async () => {
    const type = radioBtns[typeInput];
    try {
      const response = await getApi(
        type.url,
        {},
        {
          responseType: 'blob',
        },
      );
      FileSaver.saveAs(response, `${type.fileName}.xlsx`);
    } catch (err) {
      showError(err);
    }
  };
  return (
    <>
      <DialogContent>
        <RadioGroup
          row
          aria-label="input"
          name="input"
          value={typeInput || 'input'}
          onChange={(e) => {
            setTypeInput(e.target.value);
          }}
        >
          {Object.values(radioBtns).map((defs) => (
            <FormControlLabel
              key={defs.value}
              value={defs.value}
              control={<Radio color="primary" />}
              label={defs.label}
              style={{ flex: 1 }}
            />
          ))}
        </RadioGroup>
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
            <p>Nhập file excel danh sách thẻ (*.xls, *.xlsx)</p>
          )}
        </DropContainer>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'space-between' }}>
        <ThemeProvider theme={theme}>
          <Button
            color="primary"
            endIcon={<FontAwesomeIcon icon={faFileExcel} />}
            variant="contained"
            onClick={downloadFileExample}
          >
            File mẫu {radioBtns[typeInput].btn}
          </Button>
        </ThemeProvider>
        <div style={{ gap: '8px', display: 'flex' }}>
          <Button
            color="default"
            variant="contained"
            onClick={() => onSubmit(0)}
          >
            Hủy
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => onSubmit({ file: acceptedFiles[0], typeInput })}
            disabled={!acceptedFiles || acceptedFiles.length <= 0}
          >
            Nhập thẻ
          </Button>
        </div>
      </DialogActions>
    </>
  );
}
