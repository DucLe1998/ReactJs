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
import VAutocomplete from 'components/VAutocomplete';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import TextField from '@material-ui/core/TextField';
import reducer from './reducer';
import saga from './saga';
import sagaCommon from '../Common/sagaCommon';
import reducerCommon from '../Common/reducer';
import {
  RowItem,
  RowLabel,
  RowContent,
} from '../../components/CommonComponent';
const key = 'room';
//----------------------------------------------------------------
export function FilterPopUp({
  listNVRStatus,
  loading,
  onClose,
  onFilter,
  filterValue = {},
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useInjectReducer({ key: 'common', reducer: reducerCommon });
  useInjectSaga({ key: 'common', saga: sagaCommon });
  const intl = useIntl();
  const editForm = useFormik({
    initialValues: {
      status: filterValue.status || null,
    },
    onSubmit: values => {
      onFilter(values);
      onClose();
    },
  });
  return (
    <React.Fragment>
      {loading && <Loading />}
      <form onSubmit={editForm.handleSubmit}>
        <RowItem direction="column">
          <RowLabel>
            {intl.formatMessage({
              id: 'app.NVR.column.status',
            })}
          </RowLabel>
          <RowContent>
            <VAutocomplete
              value={editForm.values.status || []}
              fullWidth
              multiple
              id="cmbStatusNVR"
              getOptionLabel={option =>
                option.name
                  ? intl.formatMessage({
                      id: option.name,
                    })
                  : ''
              }
              renderInput={params => (
                <TextField
                  {...params}
                  label=""
                  variant="outlined"
                  size="small"
                />
              )}
              firstIndex={1}
              loadData={() =>
                new Promise((resolve, reject) => {
                  resolve({
                    data: listNVRStatus,
                    totalCount: listNVRStatus.length,
                  }).catch(err => reject(err));
                })
              }
              onChange={(e, value) => {
                editForm.setFieldValue('status', value);
              }}
            />
          </RowContent>
        </RowItem>
        <RowItem>
          <RowLabel />
          <RowContent className="button-container" justifyContent="flex-end">
            <Button
              id="btnClsoe"
              text={intl.formatMessage({
                id: 'app.button.close',
              })}
              onClick={onClose}
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

FilterPopUp.propTypes = {
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

export default compose(withConnect)(FilterPopUp);
