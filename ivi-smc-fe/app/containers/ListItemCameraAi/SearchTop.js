import React, { useEffect, useState, useRef } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import SelectBox from 'devextreme-react/select-box';
import DateBox from 'devextreme-react/date-box';
import IconBtn from 'components/Custom/IconBtn';
import { BsCalendar } from 'react-icons/bs';
import { endOfDay, format } from 'date-fns';
import ImageCropper from 'containers/ListUserCameraAi/items/ImageCropperPopup';
import ClearImage from 'images/Icon-Clear.svg';

// import moment from 'moment';
import PageHeader from 'components/PageHeader';
import BtnSearch from 'components/Button/BtnSearch';
import { FileUploader } from 'devextreme-react';
import Icon from '@material-ui/core/Icon';
import IconUpload from 'containers/ListMeetingRoom/icons/IconUpload';
import InputAdornment from '@material-ui/core/InputAdornment';

import { TextField } from '@material-ui/core';

import { useForm, Controller } from 'react-hook-form';
import messages from './messages';
import { getApiCustom } from '../../utils/requestUtils';
import { API_CAMERA_AI } from '../apiUrl';
import {
  validateFileChunkSize,
  validateFileSize,
  validateFileType,
} from './validate';

const fileTypes = '.jpeg,.gif,.png,.jpg,.tiff,.bmp';
const maxChunkFileSize = 5;

export default function SearchTop({ params, onSubmit }) {
  const intl = useIntl();
  const [maxDate, setMaxDate] = useState();
  const [minDate, setMinDate] = useState(params?.fromDate);
  const [listType, setListType] = useState([]);
  const [file, setFile] = useState(null);
  const [showCropper, setShowCropper] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  // const { register, handleSubmit, setValue, reset } = useForm();
  const { handleSubmit, control } = useForm({
    defaultValues: { ...params },
  });
  const refFileUpload = useRef(null);

  const onSubmitSearch = e => {
    const newParams = {
      ...params,
      ...e,
      image: file,
      page: 1,
      fromDate: (e?.fromDate && format(e?.fromDate, 'T')) || null,
      toDate: (e?.toDate && format(e?.toDate, 'T')) || null,
    };
    onSubmit(newParams);
  };

  const onChangeImage = async e => {
    if (e?.value?.[0]) {
      const fileTmp = e?.value?.[0];
      Promise.all([
        validateFileType(fileTmp),
        validateFileSize(fileTmp),
        validateFileChunkSize(fileTmp),
      ])
        .then(e => {
          if (e.every(o => o)) {
            setShowCropper(fileTmp);
            // setFile(fileTmp);
            refFileUpload.current.instance.reset();
            return;
          }
          refFileUpload.current.instance.reset();
          setFile(null);
        })
        .catch(() => {
          refFileUpload.current.instance.reset();
          setFile(null);
        });
    }
  };

  const onChangeTextBoxUpload = () => {
    setFile(null);
    refFileUpload.current.instance.reset();
  };

  useEffect(() => {
    getApiCustom(
      {
        url: API_CAMERA_AI.LIST_ITEMS_TYPE_3_12,
      },
      setListType,
    );
  }, []);

  useEffect(() => {
    if (file !== null) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  }, [file]);

  return (
    <React.Fragment>
      {showCropper && (
        <ImageCropper
          // fileImage={searchImageData.fileImageUpload[0]}
          fileImage={showCropper}
          setCroppedFileImage={event => {
            setFile(event);
            setShowCropper(null);
          }}
          onClose={() => {
            setShowCropper(null);
          }}
        />
      )}
      <PageHeader title={intl.formatMessage(messages.header)} />
      <FormSearchWrap>
        <div style={{ width: '100%' }}>
          <Controller
            control={control}
            name="codeType"
            render={props => (
              <SelectBox
                items={listType}
                placeholder="Loại đồ vật"
                displayExpr="name"
                valueExpr="code"
                onValueChanged={e => props.onChange(e?.value)}
                disabled={!listType.length}
                showClearButton
                style={{
                  minWidth: 200,
                  flex: 1,
                }}
              />
            )}
          />
        </div>
        <div style={{ width: '100%' }}>
          <Controller
            control={control}
            name="fromDate"
            render={props => (
              <DateBox
                useMaskBehavior
                dateOutOfRangeMessage={intl.formatMessage(
                  messages.invalidValue,
                )}
                showAnalogClock={false}
                type="datetime"
                style={{
                  backgroundColor: 'inherit',
                  background: '#FFFFFF',
                  border: '1px solid #DDDDDD',
                  boxSizing: 'border-box',
                  minWidth: 200,
                  flex: 1,
                }}
                showClearButton
                dropDownButtonRender={() => (
                  <IconBtn
                    style={{ padding: '5px' }}
                    icon={<BsCalendar color="#93C198" />}
                  />
                )}
                value={props.value}
                displayFormat="dd/MM/yyyy - h:mm a"
                onValueChanged={c => {
                  props.onChange(c?.value);
                  // setValue('fromDate', moment(c?.value).valueOf());
                  setMinDate(c?.value);
                }}
                max={maxDate || endOfDay(new Date())}
              />
            )}
          />
        </div>
        <div style={{ width: '100%' }}>
          <Controller
            control={control}
            name="toDate"
            render={props => (
              <DateBox
                useMaskBehavior
                dateOutOfRangeMessage={intl.formatMessage(
                  messages.invalidValue,
                )}
                showAnalogClock={false}
                type="datetime"
                style={{
                  backgroundColor: 'inherit',
                  background: '#FFFFFF',
                  border: '1px solid #DDDDDD',
                  boxSizing: 'border-box',
                  minWidth: 200,
                  flex: 1,
                }}
                showClearButton
                dropDownButtonRender={() => (
                  <IconBtn
                    style={{ padding: '5px' }}
                    icon={<BsCalendar color="#93C198" />}
                  />
                )}
                displayFormat="dd/MM/yyyy - h:mm a"
                onValueChanged={c => {
                  // setValue('toDate', moment(c?.value).valueOf());
                  props.onChange(c?.value);
                  setMaxDate(c?.value);
                }}
                value={props.value}
                min={minDate}
                max={endOfDay(new Date())}
              />
            )}
          />
        </div>
        <FormUploadWrap>
          <div>
            <TextField
              id="dropzone-upload-item"
              // className={clsx(classes.textField, classes.placeholder)}
              value={
                file?.name ||
                '(File ảnh có định dạng: .jpeg, .gif, .png, .jpg, .tiff, .bmp và dung lượng tối đa 5MB)'
              }
              style={{
                minWidth: 500,
                flex: 3,
              }}
              // disabled={uploading}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    {previewImage && (
                      <img
                        src={previewImage}
                        style={{
                          maxHeight: '30px',
                          maxWidth: '30px',
                        }}
                        alt=""
                      />
                    )}
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end" style={{ cursor: 'pointer' }}>
                    {file && (
                      <Icon
                        style={{
                          textAlign: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          onChangeTextBoxUpload();
                        }}
                      >
                        <img
                          alt="edit"
                          src={ClearImage}
                          style={{
                            width: '14px',
                            height: '14px',
                          }}
                        />
                      </Icon>
                    )}
                    <IconBtn
                      icon={<IconUpload />}
                      onClick={() => {
                        document.querySelector('#dropzone-upload-item').click();
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </div>
          <FileUploader
            showClearButton
            multiple={false}
            onValueChanged={onChangeImage}
            accept={fileTypes}
            visible={false}
            maxFileSize={maxChunkFileSize}
            uploadMode="useForm"
            dialogTrigger="#dropzone-upload-item"
            dropZone="#dropzone-upload-item"
            ref={refFileUpload}
          />
        </FormUploadWrap>
        <BtnSearch onClick={handleSubmit(onSubmitSearch)} />
      </FormSearchWrap>
    </React.Fragment>
  );
}

const FormUploadWrap = styled.div`
  display: flex;
  #dropzone-upload-item {
    position: relative;
    font-size: 11px;
  }
  #btn-choose-file {
    position: absolute;
    top: 4px;
    right: 4px;
    border: 1px solid #00695c;
    color: #00695c;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    color: #00695c;
  }
  .dx-texteditor-input-container {
    font-size: 11px;
  }
  .MuiFormControl-root.MuiTextField-root {
    background-color: #fff;
  }
  .MuiInputBase-root {
    height: 40px;
  }
  .MuiInputBase-input {
    box-sizing: border-box;
    height: 100%;
  }
  .MuiPaper-rounded {
    border-radius: 8px;
  }
  .MuiDialogActions-root {
    padding: 32px;
  }
  .MuiOutlinedInput-adornedEnd.MuiOutlinedInput-adornedEnd {
    padding: 0px 12px !important;
  }
  .MuiIconButton-sizeSmall {
    padding: 0px !important;
  }
`;

const FormSearchWrap = styled.div`
  display: flex;
  gap: 10px;
`;
