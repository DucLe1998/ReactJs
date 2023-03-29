/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import Loading from 'containers/Loading/Loadable';
import { Popup } from 'devextreme-react/popup';
import { Button } from 'devextreme-react/button';
import { TextBox } from 'devextreme-react/text-box';
import { NumberBox } from 'devextreme-react/number-box';
import { useFormik } from 'formik';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Validator,
  RequiredRule,
  PatternRule,
} from 'devextreme-react/validator';
import {
  RowItem,
  RowLabel,
  RowContent,
} from '../../components/CommonComponent';
import reducer from './reducer';
import saga from './saga';
import sagaCommon from '../Common/sagaCommon';
import reducerCommon from '../Common/reducer';
import { makeSelectEditingItem } from './selectors';
import { loadDetail, updateRow } from './actions';
import ChangePassword from './changePassword';
import AreaTreeList from '../Common/AreaTree/Loadable';
const key = 'nvr';
//----------------------------------------------------------------
export function EditNVR({
  editingRow,
  detailInfo,
  onLoadDetail,
  onUpdateRow,
  onClose,
}) {
  const intl = useIntl();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useInjectReducer({ key: 'common', reducer: reducerCommon });
  useInjectSaga({ key: 'common', saga: sagaCommon });
  const [loading, setLoading] = useState(true);
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
  const editForm = useFormik({
    initialValues: {
      ip: '',
      port: '',
      name: '',
      username: '',
      password: '',
      area: undefined,
    },
    onSubmit: values => {
      const data = {
        area_id: values.area.id,
        information: {
          ip: values.ip,
          port: values.port,
          username: values.username,
          password: values.password,
        },
        name: values.name,
        type: 'NVR',
      };
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
      onUpdateRow(detailInfo.id, data);
    },
  });
  useEffect(() => {
    onLoadDetail(editingRow.id);
  }, []);
  useEffect(() => {
    if (detailInfo.id == editingRow.id) {
      setLoading(false);
      editForm.setFieldValue('name', detailInfo.name);
      editForm.setFieldValue('ip', detailInfo.information.ip);
      editForm.setFieldValue('port', Number(detailInfo.information.port));
      editForm.setFieldValue('username', detailInfo.information.username);
      editForm.setFieldValue('password', detailInfo.information.password);
      editForm.setFieldValue('area', detailInfo.area);
    }
  }, [detailInfo]);

  return (
    <div>
      {loading && <Loading />}
      {!loading && detailInfo.id == editingRow.id && (
        <form onSubmit={editForm.handleSubmit}>
          <RowItem>
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
                value={editForm.values.ip}
                className="no-border-button"
                onValueChanged={e => {
                  editForm.handleChange(e.event);
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
          <RowItem>
            <RowLabel>
              {<FormattedMessage id="app.NVR.column.port" />}
              <span className="required">*</span>
            </RowLabel>
            <RowContent>
              <NumberBox
                width="100%"
                id="port"
                name="port"
                placeholder={intl.formatMessage({
                  id: 'app.NVR.port.placeholder',
                })}
                stylingMode="outlined"
                defaultValue=""
                value={editForm.values.port}
                className="no-border-button"
                onValueChanged={e => {
                  editForm.handleChange(e.event);
                }}
              >
                <Validator>
                  <RequiredRule
                    message={intl.formatMessage({
                      id: 'app.NVR.message.require_input',
                    })}
                  />
                </Validator>
              </NumberBox>
            </RowContent>
          </RowItem>
          <RowItem>
            <RowLabel>
              {<FormattedMessage id="app.NVR.column.name" />}
              <span className="required">*</span>
            </RowLabel>
            <RowContent>
              <TextBox
                width="100%"
                id="NVRName"
                name="name"
                placeholder={intl.formatMessage({
                  id: 'app.NVR.name.placeholder',
                })}
                stylingMode="outlined"
                defaultValue=""
                value={editForm.values.name}
                className="no-border-button"
                onValueChanged={e => {
                  editForm.handleChange(e.event);
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
          <RowItem>
            <RowLabel>
              Username
              <span className="required">*</span>
            </RowLabel>
            <RowContent>
              <TextBox
                width="100%"
                id="username"
                name="username"
                placeholder={intl.formatMessage({
                  id: 'app.NVR.username.placeholder',
                })}
                stylingMode="outlined"
                defaultValue=""
                value={editForm.values.username}
                className="no-border-button"
                onValueChanged={e => {
                  editForm.handleChange(e.event);
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
          <RowItem>
            <RowLabel>
              {<FormattedMessage id="app.NVR.password" />}
              <span className="required">*</span>
            </RowLabel>
            <RowContent style={{ position: 'relative' }}>
              <TextBox
                disabled
                width="100%"
                id="password"
                name="password"
                placeholder={intl.formatMessage({
                  id: 'app.NVR.password.placeholder',
                })}
                stylingMode="outlined"
                defaultValue=""
                value={editForm.values.password}
                mode="password"
                className="no-border-button"
                onValueChanged={e => {
                  editForm.handleChange(e.event);
                }}
              />
              <div style={{ position: 'absolute', right: '0px' }}>
                <Button
                  text={intl.formatMessage({
                    id: 'app.NVR.button.change_pasword',
                  })}
                  type="default"
                  icon="key"
                  onClick={() => {
                    setIsOpenChangePassword(true);
                  }}
                />
              </div>
            </RowContent>
          </RowItem>
          <RowItem>
            <RowLabel>
              {<FormattedMessage id="app.NVR.column.area" />}
              <span className="required">*</span>
            </RowLabel>
            <RowContent>
              {/* tree here */}
              <AreaTreeList
                value={editForm.values.area}
                required
                onValueChanged={e => {
                  editForm.setFieldValue('area', e);
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
                  id: 'app.button.close',
                })}
                onClick={onClose}
              />
              <Button
                id="btnSave"
                icon="todo"
                text={intl.formatMessage({
                  id: 'app.button.save',
                })}
                type="default"
                useSubmitBehavior
              />
            </RowContent>
          </RowItem>
        </form>
      )}
      {isOpenChangePassword && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage({
            id: 'app.NVR.header.title',
          })}
          showTitle
          onHidden={() => {
            setIsOpenChangePassword(false);
          }}
          dragEnabled
          width={400}
          height={330}
        >
          <ChangePassword
            editingRow={editingRow}
            onClose={() => {
              setIsOpenChangePassword(false);
            }}
          />
        </Popup>
      )}
    </div>
  );
}

// EditNVR.propTypes = {
//   loading: PropTypes.bool,
// };

const mapStateToProps = createStructuredSelector({
  detailInfo: makeSelectEditingItem(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadDetail: id => dispatch(loadDetail(id)),
    onUpdateRow: (id, data) => dispatch(updateRow(id, data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(EditNVR);
