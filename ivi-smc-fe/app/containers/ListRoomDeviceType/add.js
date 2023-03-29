/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import { API_BOOKING } from 'containers/apiUrl';
import { getErrorMessage } from 'containers/Common/function';
import Loading from 'containers/Loading/Loadable';
import { Button } from 'devextreme-react/button';
import { TextBox } from 'devextreme-react/text-box';
import {
  PatternRule,
  RequiredRule,
  Validator,
} from 'devextreme-react/validator';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { callApi } from 'utils/requestUtils';
import { showError, showSuccess } from 'utils/toast-utils';
import {
  RowContent,
  RowItem,
  RowLabel,
} from '../../components/CommonComponent';
import reducerCommon from '../Common/reducer';
import sagaCommon from '../Common/sagaCommon';
import reducer from './reducer';
import saga from './saga';
const key = 'roomDeviceType';
//----------------------------------------------------------------
export function AddDeviceType({ loading, onClose, filterValue = {} }) {
  const intl = useIntl();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useInjectReducer({ key: 'common', reducer: reducerCommon });
  useInjectSaga({ key: 'common', saga: sagaCommon });
  const editForm = useFormik({
    initialValues: {
      code: filterValue.code || null,
      name: filterValue.name || null,
    },
    onSubmit: values => {
      callApi(API_BOOKING.DEVICE_TYPE_API, 'post', values)
        .then(() => {
          showSuccess(
            intl.formatMessage({
              id: 'app.ROOM_DEVICE_TYPE.message.add_success',
            }),
          );
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
                id: 'app.ROOM_DEVICE_TYPE.column.name',
              })}
              <span className="required">*</span>
            </RowLabel>
            <RowContent>
              <TextBox
                width="100%"
                id="name"
                name="name"
                placeholder="Nhập tên nhóm"
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
                id: 'app.ROOM_DEVICE_TYPE.column.code',
              })}
              <span className="required">*</span>
            </RowLabel>
            <RowContent>
              <TextBox
                width="100%"
                id="code"
                name="code"
                placeholder="Nhập mã nhóm"
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
                      id: 'app.ROOM_DEVICE_TYPE.message.code_invalid',
                    })}
                    pattern={/^[a-zA-Z0-9]+$/}
                  />
                </Validator>
              </TextBox>
            </RowContent>
          </RowItem>
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

AddDeviceType.propTypes = {
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

export default compose(withConnect)(AddDeviceType);
