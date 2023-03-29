import React from 'react';

import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropzone from 'react-dropzone';
import LabelInput from './element/LabelInput';

const CtDropzone = ({
  onDrop,
  onCancel,
  file,
  loading,
  label,
  showNameMaxlength,
  placeholder,
  height,
  multiple = false,
  disabled = false,
}) => (
  <>
    <LabelInput label={label} />
    <div
      style={{
        height: height || 55,
        borderRadius: 10,
        marginBottom: 16,
      }}
      className="dropzone-wrapper"
    >
      <Dropzone
        onDrop={onDrop}
        onFileDialogCancel={onCancel}
        multiple={multiple}
        disabled={disabled}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <div>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <FontAwesomeIcon color="#687ddb" icon={faCloudUploadAlt} />
              )}
              <div style={{ marginLeft: 8 }}>
                {file
                  ? `${
                      file.name.length > (showNameMaxlength || 50)
                        ? `${file.name.slice(0, showNameMaxlength || 50)}...`
                        : file.name
                    }`
                  : placeholder || ''}
              </div>
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  </>
);

export default CtDropzone;
