/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import Loading from 'containers/Loading/Loadable';
import { Button } from 'devextreme-react/button';
import { TextBox } from 'devextreme-react/text-box';
import SelectBox from 'devextreme-react/select-box';
import FileUploader from 'devextreme-react/file-uploader';
import styled from 'styled-components';
import { useFormik } from 'formik';
import {
  Validator,
  RequiredRule,
  PatternRule,
  CustomRule,
} from 'devextreme-react/validator';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  RowItem,
  RowLabel,
  RowContent,
  CustomFileUploadContainer,
} from '../../components/CommonComponent';
import reducer from './reducer';
import saga from './saga';
import sagaCommon from '../Common/sagaCommon';
import reducerCommon from '../Common/reducer';
import { makeSelectEditingItem } from './selectors';
import { addNewRow, downloadTemplate, importFile } from './actions';
import AttachIcon from 'images/icon-button/attach.svg';
import AreaTreeList from '../Common/AreaTree/Loadable';
const key = 'nvr';
//----------------------------------------------------------------
const FileContainer = styled.div`
  background: #fff;
  border:${props => props.error ? '1px solid #e24545' : '1px solid #ddd'};
  position: relative;
  border-radius: 4px;
  padding: 0px 0px 0px 0px;
  color:rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-between;
  & .file-name{
    display: flex;
    align-items: center;
    padding: 7px 9px 8px;
    height:100%;
    overflow: hidden;
    white-space:no-wrap;
    text-overflow: ellipses;
  }
`;
const ErrorMessage = styled.div`
  margin-top:5px;
  color: #e24545;
  font-size:12px;
`;
const UploadButton = styled.div`
  background-color: #fff;
  border-radius: 0px 6px 6px 0px;
  padding: 8px;
  display: flex;
  height:100%;
  grid-gap: 10px;
  color:rgba(0, 122, 255, 1);
  cursor:pointer;
  &:hover{
    background-color: #e2e9f7;
  }
`;
const UploadIcon = styled.div`
  width: 22px;
  height: 22px;   
  background-color: #D0DDF7;
`;
export function AddNVR({
  loading,
  onAddNewRow,
  onDownloadTemplate,
  onImportFile,
  onClose,
}) {
  const intl = useIntl();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useInjectReducer({ key: 'common', reducer: reducerCommon });
  useInjectSaga({ key: 'common', saga: sagaCommon });
  const fileUpload = useRef(null);
  const [addMode, setAddMode] = useState('SINGLE');
  const [disabledImport, setDisabledImport] = useState(true);
  const [fileUploadName, setFileUploadName] = useState('');
  const [fileUploadError, setFileUploadError] = useState('');
  const validateTree = () => {
    if (
      !addByIPForm.values.ip ||
      !addByIPForm.values.port ||
      !addByIPForm.values.name ||
      !addByIPForm.values.username ||
      !addByIPForm.values.password ||
      !addByIPForm.values.area ||
      !addByIPForm.values.area.type
    )
      return false;
    return true;
  };
  const addByIPForm = useFormik({
    initialValues: {
      ip: '',
      port: '',
      name: '',
      username: '',
      password: '',
      area: {},
    },
    onSubmit: values => {
      const data = {
        // area_id: values.area.id,
        config: {},
        information: {
          ip: values.ip,
          port: values.port,
          username: values.username,
          password: values.password,
        },
        name: values.name,
        type: 'NVR',
      };
      // eslint-disable-next-line prefer-destructuring
      // data[values.area.id.split('_')[0]] = Number(values.area.id.split('_')[1]);
      if (values.area.areaId) {
        data.areaId = Number(values.area.areaId);
      }
      if (values.area.zoneId) {
        data.zoneId = Number(values.area.zoneId);
      }
      if (values.area.blockId) {
        data.blockId = Number(values.area.blockId);
      }
      if (values.area.floorId) {
        data.floorId = Number(values.area.floorId);
      }
      if (values.area.unitId) {
        data.unitId = Number(values.area.unitId);
      }
      onAddNewRow(data, onClose);
    },
  });
  const handleSave = () => {
    if (
      fileUpload &&
      fileUpload.current &&
      // eslint-disable-next-line no-underscore-dangle
      fileUpload.current.instance._files.length > 0
    ) {
      if (
        // eslint-disable-next-line no-underscore-dangle
        !fileUpload.current.instance._files.find(el => el.isValid() == false) &&
        // eslint-disable-next-line no-underscore-dangle
        fileUpload.current.instance._files.length <= 3
        && !fileUpload.current.instance._files[0]._isLoaded
      ) {
        // neeus cos file phair upload file xong sau ddos mowis luu
        // eslint-disable-next-line no-underscore-dangle
        fileUpload.current.instance._isCustomClickEvent = true;
        // eslint-disable-next-line no-underscore-dangle
        fileUpload.current.instance._uploadButton._$element[0].click();
        // eslint-disable-next-line no-underscore-dangle
      } else {
        onImportFile(fileUpload.current.instance._files[0].value);
      }
    }
  };
  return (
    <React.Fragment>
      {loading && <Loading />}
      <RowItem direction="column">
        <RowLabel>
          {' '}
          <FormattedMessage id="app.NVR.add_mode" />
        </RowLabel>
        <RowContent>
          <SelectBox
            items={[
              {
                id: 'SINGLE',
                name: intl.formatMessage({
                  id: 'app.NVR.add_mode.item1',
                }),
              },
              {
                id: 'BATCH',
                name: intl.formatMessage({
                  id: 'app.NVR.add_mode.item2',
                }),
              },
            ]}
            placeholder={intl.formatMessage({
              id: 'app.NVR.add_mode',
            })}
            width="100%"
            displayExpr="name"
            valueExpr="id"
            defaultValue="SINGLE"
            onValueChanged={e => {
              setAddMode(e.value);
            }}
          />
        </RowContent>
      </RowItem>
      <div style={{ display: addMode == 'SINGLE' ? 'none' : 'block' }}>
        <RowItem direction="column">
          <RowLabel>
            {<FormattedMessage id="app.NVR.select_file" />}
          </RowLabel>
          <RowContent style={{ flexDirection: 'column' }}>
            <FileContainer error={fileUploadError}
              onClick={(e) => {
                fileUpload.current.instance._isCustomClickEvent = true;
                fileUpload?.current?.instance?._$fileInput[0].click();
              }}>
              <div className="file-name" style={{ color: fileUploadName ? "#000" : 'inherit' }}>
                {fileUploadName || 'Chọn file từ máy tính'}
              </div>
              <UploadButton>
                <img src={AttachIcon} />
              </UploadButton>
            </FileContainer>
            <ErrorMessage>
              {fileUploadError}
            </ErrorMessage>
            <div style={{
              border: '0px', backgroundColor: '#fff', textAlign: 'left',
              padding: '0px',
              marginTop: '6px'
            }}>
              <Button
                style={{
                  border: '0px', backgroundColor: '#fff',
                  paddingLeft: '0px',
                  marginLeft: '-15px'
                }}
                text={intl.formatMessage({
                  id: 'app.NVR.button.dowload_template',
                })}
                type="success"
                stylingMode="text"
                onClick={onDownloadTemplate}
              />
            </div>

          </RowContent>
        </RowItem>
        <RowItem style={{ display: 'none' }}>
          <RowContent style={{ position: 'relative', marginBottom: '10px' }}>
            <CustomFileUploadContainer>
              <FileUploader
                width="300px"
                name="file"
                ref={fileUpload}
                uploadMode="useButtons"
                onValueChanged={e => {
                  setDisabledImport(e.value.length <= 0);
                  if (e.value.length > 0) {
                    setFileUploadName(e.value[0].name);
                    if (!fileUpload.current.instance._files[0].isValid()) {
                      setDisabledImport(true);
                      setFileUploadError(fileUpload.current.instance._files[0].$statusMessage.text());
                    }
                    else {
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
                selectButtonText={intl.formatMessage({
                  id: 'app.button.file_upload',
                })}
                labelText=""
                accept=".xls,.xlsx"
                allowedFileExtensions={['.xls', '.xlsx']}
                readyToUploadMessage={intl.formatMessage({
                  id: 'app.file_upload.message.ready_upload',
                })}
                invalidMaxFileSizeMessage={intl.formatMessage(
                  {
                    id: 'app.file_upload.message.ready_upload',
                  },
                  { size: '10MB' },
                )}
                invalidFileExtensionMessage={intl.formatMessage({
                  id: 'app.invalid.file_upload.file_type',
                })}
              />
            </CustomFileUploadContainer>
            <Button
              style={{ border: '0px', backgroundColor: '#fff' }}
              text={intl.formatMessage({
                id: 'app.NVR.button.dowload_template',
              })}
              type="success"
              stylingMode="text"
              onClick={onDownloadTemplate}
            />
          </RowContent>
        </RowItem>
        <RowItem>
          <RowLabel />
          <RowContent
            className="button-container"
            style={{ justifyContent: 'flex-end' }}
          >
            <Button
              id="btnClsoe"
              text={intl.formatMessage({
                id: 'app.button.cancel',
              })}
              onClick={onClose}
            />
            <Button
              id="btnSaveAndContinue_batch"
              disabled={disabledImport}
              text={intl.formatMessage({
                id: 'app.button.save',
              })}
              type="default"
              onClick={handleSave}
            />

          </RowContent>
        </RowItem>
      </div>
      <form
        onSubmit={addByIPForm.handleSubmit}
        autoComplete="off"
        style={{ display: addMode == 'SINGLE' ? 'block' : 'none' }}
      >
        <RowItem direction="column">
          <RowLabel>
            {<FormattedMessage id="app.NVR.column.IP" />}
            <span className="required">*</span>
          </RowLabel>
          <RowContent>
            <TextBox
              width="100%"
              id="ip"
              name="ip"
              placeholder={intl.formatMessage({
                id: 'app.NVR.ip.placeholder',
              })}
              stylingMode="outlined"
              defaultValue=""
              className="no-border-button"
              onValueChanged={e => {
                addByIPForm.handleChange(e.event);
              }}
            >
              <Validator>
                <RequiredRule
                  message={intl.formatMessage({
                    id: 'app.NVR.message.require_input',
                  })}
                />
                <PatternRule
                  message={intl.formatMessage({
                    id: 'app.NVR.message.ip_invalid',
                  })}
                  pattern={
                    /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/
                  }
                />
              </Validator>
            </TextBox>
          </RowContent>
        </RowItem>
        <RowItem direction="column">
          <RowLabel>
            {<FormattedMessage id="app.NVR.column.port" />}
            <span className="required">*</span>
          </RowLabel>
          <RowContent>
            <TextBox
              width="100%"
              id="port"
              name="port"
              placeholder={intl.formatMessage({
                id: 'app.NVR.port.placeholder',
              })}
              stylingMode="outlined"
              defaultValue=""
              className="no-border-button"
              onValueChanged={e => {
                addByIPForm.handleChange(e.event);
              }}
            >
              <Validator>
                <RequiredRule
                  message={intl.formatMessage({
                    id: 'app.NVR.message.require_input',
                  })}
                />
              </Validator>
            </TextBox>
          </RowContent>
        </RowItem>
        <RowItem direction="column">
          <RowLabel>
            {<FormattedMessage id="app.NVR.column.name" />}
            <span className="required">*</span>
          </RowLabel>
          <RowContent>
            <TextBox
              width="100%"
              id="name"
              name="name"
              placeholder={intl.formatMessage({
                id: 'app.NVR.name.placeholder',
              })}
              stylingMode="outlined"
              defaultValue=""
              className="no-border-button"
              onValueChanged={e => {
                addByIPForm.handleChange(e.event);
              }}
            >
              <Validator>
                <RequiredRule
                  message={intl.formatMessage({
                    id: 'app.NVR.message.require_input',
                  })}
                />
              </Validator>
            </TextBox>
          </RowContent>
        </RowItem>
        <RowItem direction="column">
          <RowLabel>
            Username
            <span className="required">*</span>
          </RowLabel>
          <RowContent>
            <TextBox
              width="100%"
              inputAttr={{ autocomplete: 'new-password' }}
              id="username"
              name="username"
              placeholder={intl.formatMessage({
                id: 'app.NVR.username.placeholder',
              })}
              stylingMode="outlined"
              defaultValue=""
              className="no-border-button"
              onValueChanged={e => {
                addByIPForm.handleChange(e.event);
              }}
            >
              <Validator>
                <RequiredRule
                  message={intl.formatMessage({
                    id: 'app.NVR.message.require_input',
                  })}
                />
              </Validator>
            </TextBox>
          </RowContent>
        </RowItem>
        <RowItem direction="column">
          <RowLabel>
            {<FormattedMessage id="app.NVR.password" />}
            <span className="required">*</span>
          </RowLabel>
          <RowContent style={{ position: 'relative' }}>
            <TextBox
              width="100%"
              id="password"
              name="password"
              inputAttr={{ autocomplete: 'new-password' }}
              placeholder={intl.formatMessage({
                id: 'app.NVR.password.placeholder',
              })}
              stylingMode="outlined"
              defaultValue=""
              mode="password"
              className="no-border-button"
              onValueChanged={e => {
                addByIPForm.handleChange(e.event);
              }}
            >
              <Validator>
                <RequiredRule
                  message={intl.formatMessage({
                    id: 'app.NVR.message.require_input',
                  })}
                />
              </Validator>
            </TextBox>
          </RowContent>
        </RowItem>
        <RowItem direction="column">
          <RowLabel>
            {<FormattedMessage id="app.NVR.column.area" />}
            <span className="required">*</span>
          </RowLabel>
          <RowContent className="tree-single-select">
            {/* tree here */}
            <AreaTreeList
              level={2}
              required
              allowSelectParentLevel
              value={addByIPForm.values.area}
              onValueChanged={e => {
                addByIPForm.setFieldValue('area', e);
              }}
            />
          </RowContent>
        </RowItem>
        <RowItem>
          <RowLabel />
          <RowContent
            className="button-container"
            style={{ justifyContent: 'flex-end' }}
          >
            <Button
              id="btnClsoe"
              icon="close"
              text={intl.formatMessage({
                id: 'app.button.cancel',
              })}
              onClick={onClose}
            />
            <Button
              id="btnSave"
              icon="todo"
              disabled={!validateTree()}
              text={intl.formatMessage({
                id: 'app.button.save',
              })}
              type="default"
              useSubmitBehavior
            />
          </RowContent>
        </RowItem>
      </form>
    </React.Fragment>
  );
}

AddNVR.propTypes = {
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  detailInfo: makeSelectEditingItem(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onAddNewRow: (data, onClose) => dispatch(addNewRow(data, onClose)),
    onDownloadTemplate: () => dispatch(downloadTemplate()),
    onImportFile: file => dispatch(importFile(file)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(AddNVR);
