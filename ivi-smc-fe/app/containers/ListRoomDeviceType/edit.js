/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import Loading from 'containers/Loading/Loadable';
import { Button } from 'devextreme-react/button';
import moment from 'moment';
import VAutocomplete from 'components/VAutocomplete';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import { TextBox } from 'devextreme-react/text-box';
import {
  Validator,
  RequiredRule,
  PatternRule,
  CustomRule,
} from 'devextreme-react/validator';
import reducer from './reducer';
import saga from './saga';
import sagaCommon from '../Common/sagaCommon';
import reducerCommon from '../Common/reducer';
import {
  RowItem,
  RowLabel,
  RowContent,
} from '../../components/CommonComponent';
import { callApi } from 'utils/requestUtils';
import { API_BOOKING } from 'containers/apiUrl';
import { getErrorMessage } from 'containers/Common/function';
import { showError, showSuccess } from 'utils/toast-utils';
const key = 'roomDeviceType';
//----------------------------------------------------------------
export function EditDeviceType({
  edittingItem,
  loading,
  onClose,
  filterValue = {},
}) {
  const intl = useIntl();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useInjectReducer({ key: 'common', reducer: reducerCommon });
  useInjectSaga({ key: 'common', saga: sagaCommon });
  const editForm = useFormik({
    initialValues: {
      code: filterValue.code || edittingItem.code,
      name: filterValue.name || edittingItem.name,
    },
    onSubmit: values => {
      callApi(API_BOOKING.DEVICE_TYPE_API + `/${edittingItem.id}`, 'put', values).then(response => {
        showSuccess(intl.formatMessage({
          id: 'app.ROOM_DEVICE_TYPE.message.edit_success',
        }));
        onClose(true);
      }).catch(err => {
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
                placeholder={intl.formatMessage({
                  id: 'app.ROOM_DEVICE_TYPE.column.name',
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
                placeholder={intl.formatMessage({
                  id: 'app.ROOM_DEVICE_TYPE.column.code',
                })}
                stylingMode="outlined"
                defaultValue=""
                value={editForm.values.code}
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
                    pattern={
                      /^[a-zA-Z0-9]+$/
                    }
                  />
                </Validator>
              </TextBox>
            </RowContent>
          </RowItem>
        </RowItem>
        <RowItem direction="column">
          <RowLabel style={{width:'250px'}}>
            {intl.formatMessage({
              id: 'app.ROOM_DEVICE_TYPE.column.createdAt',
            })}
          </RowLabel>
          <RowContent>
            <div style={{ backgroundColor: '#E2E2E2', padding: '10px',borderRadius:'6px',width:'275px' }}>
              {
                moment(edittingItem.createdAt).format("DD/MM/YYYY")
              }
            </div>
          </RowContent>
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

EditDeviceType.propTypes = {
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

export default compose(withConnect)(EditDeviceType);
