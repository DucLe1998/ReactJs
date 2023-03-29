import { FormHelperText } from '@material-ui/core';
import styled from 'styled-components';
import React, { Fragment } from 'react';
import { Controller } from 'react-hook-form';
import { FileUploader } from 'devextreme-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { useStyles } from '../styled';

const CustomUploadFile = ({
  control,
  errors,
  name,
  acceptType,
  handleUploadFile,
  disabled,
}) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Controller
        control={control}
        name={name}
        render={({ value }) => (
          <FormUploadWrap>
            <Fragment>
              <div
                id="dropzone-upload-item-map"
                style={{
                  border: `2px dashed ${errors[name] ? '#FF0000' : '#787878'}`,
                }}
                className={classes.uploadImageContainer}
              >
                <div className="img-choose-file">
                  {value ? (
                    value.name
                  ) : (
                    <FontAwesomeIcon color="#687ddb" icon={faCloudUploadAlt} />
                  )}
                </div>
              </div>
              <FileUploader
                multiple={false}
                onValueChanged={handleUploadFile}
                accept={acceptType}
                visible={false}
                disabled={disabled}
                dialogTrigger="#dropzone-upload-item-map"
                dropZone="#dropzone-upload-item-map"
                uploadMode="useButtons"
              />
            </Fragment>
          </FormUploadWrap>
        )}
      />
      {errors[name] && (
        <FormHelperText style={{ color: '#f44336' }}>
          {errors[name].message}
        </FormHelperText>
      )}
    </React.Fragment>
  );
};
const FormUploadWrap = styled.div`
  display: flex;
  width: 100;
  margin-bottom: 15px;
  .img-choose-file {
    text-align: center;
    align-self: center;
  }
  & .dx-texteditor.dx-editor-outlined {
    border: none;
  }
`;
export default CustomUploadFile;
