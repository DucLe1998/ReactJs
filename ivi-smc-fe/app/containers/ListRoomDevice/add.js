/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import Loading from 'containers/Loading/Loadable';
import { Button } from 'devextreme-react/button';
import SelectBox from 'devextreme-react/select-box';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import { TextBox } from 'devextreme-react/text-box';
import {
  Validator,
  RequiredRule,
  PatternRule,
} from 'devextreme-react/validator';
import { callApi } from 'utils/requestUtils';
import { API_BOOKING } from 'containers/apiUrl';
import { getErrorMessage } from 'containers/Common/function';
import { showError, showSuccess } from 'utils/toast-utils';
import reducer from './reducer';
import saga from './saga';
import sagaCommon from '../Common/sagaCommon';
import reducerCommon from '../Common/reducer';
import {
  RowItem,
  RowLabel,
  RowContent,
} from '../../components/CommonComponent';
const key = 'ListRoomDevice';

//----------------------------------------------------------------
export function AddDevice({
  loading,
  onClose,
  filterValue = {},
  listDeviceType = [],
  IpAddressDefault,
  fetchData,
}) {
  const intl = useIntl();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useInjectReducer({ key: 'common', reducer: reducerCommon });
  useInjectSaga({ key: 'common', saga: sagaCommon });
  const [isIpAddress, setIsIpAddress] = useState(null);
  const editForm = useFormik({
    initialValues: {
      code: filterValue.code || null,
      name: filterValue.name || null,
      deviceCategoryId: filterValue.deviceCategoryId || null,
      ipAddress: filterValue.ipAddress || null,
    },
    onSubmit: values => {
      callApi(API_BOOKING.DEVICE_API, 'post', values)
        .then(() => {
          showSuccess(
            intl.formatMessage({
              id: 'app.ROOM_DEVICE.message.add_success',
            }),
          );
          fetchData();
          onClose(true);
        })
        .catch(err => {
          showError(getErrorMessage(err));
        });
    },
  });
  return (
    <React.Fragment>
      {loading && <Loading />}
      <form onSubmit={editForm.handleSubmit}>
        <RowItem direction="row">
          <RowItem direction="column">
            <RowLabel>
              {intl.formatMessage({
                id: 'app.ROOM_DEVICE.column.name',
              })}
              <span className="required"> *</span>
            </RowLabel>
            <RowContent>
              <TextBox
                width="100%"
                id="name"
                name="name"
                placeholder={intl.formatMessage({
                  id: 'app.ROOM_DEVICE.column.name',
                })}
                stylingMode="outlined"
                defaultValue=""
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
          <RowItem direction="column">
            <RowLabel>
              {intl.formatMessage({
                id: 'app.ROOM_DEVICE.column.code',
              })}
              <span className="required"> *</span>
            </RowLabel>
            <RowContent>
              <TextBox
                width="100%"
                id="code"
                name="code"
                placeholder={intl.formatMessage({
                  id: 'app.ROOM_DEVICE.column.code',
                })}
                stylingMode="outlined"
                defaultValue=""
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
                      id: 'app.ROOM_DEVICE.message.code_invalid',
                    })}
                    pattern={/^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]*$/}
                  />
                </Validator>
              </TextBox>
            </RowContent>
          </RowItem>
        </RowItem>
        <RowItem direction="row">
          <RowItem direction="column">
            <RowLabel>
              {intl.formatMessage({
                id: 'app.ROOM_DEVICE.column.type',
              })}
              <span className="required"> *</span>
            </RowLabel>
            <RowContent>
              <SelectBox
                items={listDeviceType}
                placeholder={intl.formatMessage({
                  id: 'app.ROOM_DEVICE.column.type',
                })}
                width="100%"
                displayExpr="name"
                valueExpr="id"
                onValueChanged={e => {
                  const { code } = listDeviceType.filter(
                    item => item.id === e.value,
                  )[0];
                  setIsIpAddress(code);
                  editForm.setFieldValue('deviceCategoryId', e.value);
                }}
              >
                <Validator>
                  <RequiredRule
                    message={intl.formatMessage({
                      id: 'app.NVR.message.require_input',
                    })}
                  />
                </Validator>
              </SelectBox>
            </RowContent>
          </RowItem>
          {isIpAddress === IpAddressDefault && (
            <RowItem direction="column">
              <RowLabel>
                Ip Address<span className="required"> *</span>
              </RowLabel>
              <RowContent>
                <TextBox
                  width="100%"
                  id="ipAddress"
                  name="ipAddress"
                  placeholder="Ip Address"
                  stylingMode="outlined"
                  defaultValue=""
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
          )}
        </RowItem>
        <RowItem>
          <RowLabel />
          <RowContent className="button-container" justifyContent="flex-end">
            <Button
              id="btnClsoe"
              text={intl.formatMessage({
                id: 'app.button.cancel',
              })}
              onClick={() => onClose(false)}
            />
            <Button
              id="btnSaveAndContinue"
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

AddDevice.propTypes = {
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({});

export function mapDispatchToProps() {
  return {};
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(AddDevice);
