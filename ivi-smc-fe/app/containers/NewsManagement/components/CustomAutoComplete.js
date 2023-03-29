import React, { useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useStyles } from '../styles';
import { showError } from '../../../utils/toast-utils';

const CustomAutoComplete = props => {
  const classes = useStyles();
  const {
    label,
    placeholder,
    helperText,
    error,
    options = [],
    loadData,
    ...otherProps
  } = props;

  const [loading, setLoading] = useState(false);
  const [loadedOptions, setLoadedOptions] = useState(options);
  const [needLoadData, setNeedLoadData] = useState(true);

  const onLoadData = () => {
    // only try loadData on first open or options empty
    if (needLoadData && !options.length) {
      (async () => {
        try {
          setLoading(true);
          const result = await loadData();
          setLoading(false);
          setLoadedOptions(result);
          setNeedLoadData(false);
        } catch (err) {
          setLoading(false);
          showError(err);
        }
      })();
    }
  };
  return (
    <Grid container direction="column">
      <p className={classes.label}>
        {label}
        {<span style={{ color: 'red' }}>*</span>}
      </p>
      <Autocomplete
        {...otherProps}
        onOpen={onLoadData}
        loading={loading}
        options={options.length ? options : loadedOptions}
        loadingText="Đang tải ..."
        noOptionsText="Không có dữ liệu"
        getOptionLabel={option => option.label}
        getOptionSelected={(option, selected) =>
          option.value === selected.value
        }
        renderInput={params => (
          <TextField
            {...params}
            error={error}
            helperText={helperText}
            placeholder={placeholder}
            variant="outlined"
            fullWidth
          />
        )}
      />
    </Grid>
  );
};
export default React.memo(CustomAutoComplete);
