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
import SelectBox from 'devextreme-react/select-box';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import { TextBox } from 'devextreme-react/text-box';
import VAutocomplete from 'components/VAutocomplete';
import { TextField } from '@material-ui/core';
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
export function FilterDevice({
  loading,
  onClose,
  onFilter,
  filterValue = {},
  listDeviceType = [],
}) {
  const intl = useIntl();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useInjectReducer({ key: 'common', reducer: reducerCommon });
  useInjectSaga({ key: 'common', saga: sagaCommon });
  const editForm = useFormik({
    initialValues: {
      deviceCategoryId: filterValue.categoryIds || '',
      room: filterValue.room || '',
    },
    onSubmit: values => {
      console.log('adasdas');
      onFilter(values);
    },
  });
  return (
    <React.Fragment>
      {loading && <Loading />}
      <form onSubmit={editForm.handleSubmit} id="filter-form-device">
        <RowItem direction="row">
          <RowItem direction="column">
            <RowLabel>
              {intl.formatMessage({
                id: 'app.ROOM_DEVICE.column.room_name',
              })}
            </RowLabel>
            <RowContent>
              <VAutocomplete
                fullWidth
                value={editForm.values.room || ''}
                firstIndex={1}
                loadData={(page, keyword) =>
                  new Promise((resolve, reject) => {
                    callApi(
                      `${
                        API_BOOKING.LIST_ROOM
                      }?page=${page}&limit=25&keyword=${encodeURIComponent(
                        keyword,
                      )}`,
                      'get',
                    )
                      .then(result => {
                        resolve({
                          data: result.data.rows,
                          totalCount: result.data.count,
                        });
                      })
                      .catch(err => reject(err));
                  })
                }
                disableClearable={!editForm.values.room}
                getOptionLabel={option => option.name || ''}
                getOptionSelected={(option, selected) =>
                  option.id == selected.id
                }
                onChange={(e, newVal) => editForm.setFieldValue('room', newVal)}
                renderInput={params => (
                  <TextField
                    {...params}
                    placeholder="Phòng họp"
                    variant="outlined"
                  />
                )}
              />
            </RowContent>
          </RowItem>
          <RowItem direction="column">
            <RowLabel>
              {intl.formatMessage({
                id: 'app.ROOM_DEVICE.column.type',
              })}
            </RowLabel>
            <RowContent>
              <SelectBox
                items={listDeviceType}
                placeholder={intl.formatMessage({
                  id: 'app.ROOM_DEVICE.column.type',
                })}
                searchEnabled
                width="100%"
                displayExpr="name"
                valueExpr="id"
                value={editForm.values.deviceCategoryId}
                onValueChanged={e => {
                  editForm.setFieldValue('deviceCategoryId', e.value);
                }}
              />
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
              onClick={editForm.handleSubmit}
            />
          </RowContent>
        </RowItem>
      </form>
    </React.Fragment>
  );
}

FilterDevice.propTypes = {
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

export default compose(withConnect)(FilterDevice);
