/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { Checkbox } from '@material-ui/core';
import { showAlertError } from 'utils/utils';

const MultiSelect = props => {
  const {
    options = [],
    placeholder = '',
    value = [],
    selectAllLabel,
    onChangeValue,
    loadData,
  } = props;

  const [loading, setLoading] = useState(false);
  const [needLoadData, setNeedLoadData] = useState(true);
  const [dataOptions, setDataOptions] = useState(options);

  const onLoadData = () => {
    if (needLoadData && !options.length) {
      (async () => {
        try {
          setLoading(true);
          const result = await loadData();
          setLoading(false);
          setDataOptions(result);
          setNeedLoadData(false);
        } catch (err) {
          setLoading(false);
          showAlertError(err);
        }
      })();
    }
  };

  const allSelected = dataOptions.length === value.length;

  const onToggleOption = selectedOptions => onChangeValue(selectedOptions);
  const onClearOptions = () => onChangeValue([]);
  const onSelectAll = isSelected => {
    if (isSelected) {
      onChangeValue(dataOptions);
    } else {
      onClearOptions();
    }
  };

  const handleToggleSelectAll = () => {
    onSelectAll(!allSelected);
  };

  const handleChange = (event, selectedOptions, reason) => {
    if (reason === 'select-option' || reason === 'remove-option') {
      if (selectedOptions.find(option => option.value === 'select-all')) {
        handleToggleSelectAll();
      } else {
        onToggleOption(selectedOptions);
      }
    } else if (reason === 'clear') {
      onClearOptions();
    }
  };
  const optionRenderer = (option, { selected }) => {
    const selectAllProps =
      option.value === 'select-all' ? { checked: allSelected } : {};
    return (
      <>
        <Checkbox
          color="primary"
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          checkedIcon={<CheckBoxIcon fontSize="small" />}
          style={{ marginRight: 8 }}
          checked={selected}
          {...selectAllProps}
        />
        {option.label}
      </>
    );
  };
  const inputRenderer = params => (
    <TextField
      {...params}
      placeholder={placeholder}
      variant="outlined"
      fullWidth
    />
  );
  const filter = createFilterOptions();

  return (
    <div>
      <Autocomplete
        {...props}
        multiple
        size="small"
        onOpen={onLoadData}
        limitTags={3}
        options={dataOptions}
        value={value}
        disableCloseOnSelect
        getOptionLabel={option => option.label}
        getOptionSelected={(option, selected) =>
          option.value === selected.value
        }
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          if (filtered.length === 0 || params.inputValue) return filtered;
          return [{ label: selectAllLabel, value: 'select-all' }, ...filtered];
        }}
        onChange={handleChange}
        renderOption={optionRenderer}
        renderInput={inputRenderer}
        loading={loading}
        loadingText="Đang tải ..."
        noOptionsText="Không có dữ liệu"
      />
    </div>
  );
};

export default React.memo(MultiSelect);
