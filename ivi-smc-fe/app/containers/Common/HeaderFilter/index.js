import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import sagaCommon from '../sagaCommon';
import reducerCommon from '../reducer';
import { makeSelectListSystems } from '../selectors';
import { loadSystem } from '../actions';
function buildQuery() {}
export function HeaderFilter({
  onLoadSystem,
  searchBoxPlaceholder,
  isFilterSystem,
}) {
  useInjectReducer({ key: 'common', reducer: reducerCommon });
  useInjectSaga({ key: 'common', saga: sagaCommon });
  const filterData = {};
  useEffect(() => {
    if (isFilterSystem) onLoadSystem();
  }, []);
  return (
    <div>
      <FormControl variant="outlined" margin="dense" className="w-100">
        <InputLabel htmlFor="search-role">{searchBoxPlaceholder}</InputLabel>
        <OutlinedInput
          id="smc-search"
          label={searchBoxPlaceholder}
          value={filterData.text || ''}
          onChange={buildQuery()}
          labelWidth={70}
        />
      </FormControl>
      <IconButton title="Thêm điều kiện lọc">
        <FilterListRoundedIcon fontSize="small" />
      </IconButton>
    </div>
  );
}

HeaderFilter.propTypes = {};

const mapStateToProps = createStructuredSelector({
  listSystem: makeSelectListSystems(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadSystem: () => {
      dispatch(loadSystem());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(HeaderFilter);
