/* eslint-disable no-unused-expressions */
/**
 *
 * Autocomplete
 *
 */

import { OutlinedInput, Checkbox } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, {
  memo,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useIntl } from 'react-intl';
import { Virtuoso } from 'react-virtuoso';
import { showError } from 'utils/toast-utils';
import { debounce } from 'lodash';
const OuterElementContext = React.createContext({});
const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});
const ListboxComponent = forwardRef(function ListboxComponent(props, ref) {
  const { children, loadMore, multiple, itemSize, ...other } = props;
  const itemData = React.Children.toArray(children);
  const itemCount = itemData.length;
  let size = itemSize;
  if (!size) {
    size = multiple ? 42 : 36;
  }
  const listHeight = size * itemCount;
  const renderRow = (index) => {
    const data = itemData[index];
    return (
      data &&
      React.cloneElement(
        data,
        multiple
          ? {
              style: {
                padding: 0,
              },
            }
          : undefined,
      )
    );
  };
  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <Virtuoso
          style={{
            padding: 0,
            width: '100%',
            height: `${listHeight}px`,
            maxHeight: '40vh',
          }}
          overscan={50}
          totalCount={itemCount}
          components={{
            Scroller: OuterElementType,
          }}
          itemContent={renderRow}
          endReached={() => loadMore()}
        />
      </OuterElementContext.Provider>
    </div>
  );
});

const VAutocomplete = forwardRef((props, ref) => {
  const {
    loadData, // function return Promise
    value,
    multiple = false,
    placeholder = '',
    firstIndex = 1,
    options,
    onInputChange,
    onClose,
    itemSize,
    virtual = true,
    autoFocus = false,
    ...other
  } = props;
  const intl = useIntl();
  const [inputValue, setInputValue] = useState('');
  const [endReached, setEndReached] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(firstIndex);
  const [open, setOpen] = React.useState(false);
  const [change, setChange] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let isMounted = true;
    if (!open) {
      if (virtual) {
        setPage(firstIndex);
        setDataSource([]);
      }
      return undefined;
    }
    if (!virtual && endReached) {
      return undefined;
    }
    const controller = new AbortController();
    const { signal } = controller;
    (async () => {
      try {
        setLoading(true);
        const result = await loadData(page, inputValue, signal);
        setLoading(false);
        if (isMounted) {
          if (page == firstIndex) {
            setDataSource(result.data);
            if (result.data.length == result.totalCount) {
              setEndReached(true);
            } else setEndReached(false);
          } else {
            setDataSource([...dataSource, ...result.data]);
            if (dataSource.length + result.data.length == result.totalCount) {
              setEndReached(true);
            } else setEndReached(false);
          }
        }
      } catch (err) {
        setLoading(false);
        if (err.message != 'canceled') {
          showError(err);
        }
      }
    })();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [page, open, change]);
  const debounceInputChange = debounce(() => {
    setPage(firstIndex);
    setChange(change + 1);
  }, 1000);
  useEffect(() => {
    if (virtual) debounceInputChange();
  }, [inputValue]);
  const onQueryChange = () => {
    setPage(firstIndex);
  };
  useImperativeHandle(ref, () => ({
    onQueryChange,
  }));

  const loadMore = () => {
    if (!endReached) setPage(page + 1);
  };
  const defaultProps = {
    size: 'small',
    getOptionLabel: (option) => option.name || '',
    noOptionsText: intl.formatMessage({ id: 'app.no_data' }),
    disableCloseOnSelect: multiple,
    renderInput: (params) => (
      <OutlinedInput
        ref={params.InputProps.ref}
        inputProps={params.inputProps}
        {...params.InputProps}
        fullWidth
        margin="dense"
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    ),
  };
  if (virtual) {
    defaultProps.ListboxComponent = ListboxComponent;
    defaultProps.ListboxProps = { loadMore, multiple, itemSize };
    defaultProps.filterOptions = (x) => x;
  }
  const mergeProps = { ...defaultProps, ...other };
  if (multiple) {
    if (!mergeProps.renderOption) {
      mergeProps.renderOption = (option, { selected }) => (
        <>
          <Checkbox
            style={{ marginRight: 8 }}
            checked={selected}
            color="primary"
          />
          {mergeProps.getOptionLabel(option)}
        </>
      );
    }
    mergeProps.inputValue = inputValue;
  }
  return (
    <Autocomplete
      {...mergeProps}
      value={value}
      multiple={multiple}
      options={dataSource}
      onInputChange={(event, newInputValue, reason) => {
        if (reason != 'reset') {
          setInputValue(newInputValue);
        } else if (!multiple) {
          setInputValue('');
        }
        onInputChange && onInputChange();
      }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
        if (multiple) setInputValue('');
        onClose && onClose();
      }}
      loading={loading}
      loadingText="Đang tải ..."
      // debug
    />
  );
});

VAutocomplete.propTypes = {};

export default memo(VAutocomplete);
// example loadData props
// loadData={(page, keyword) =>
//   new Promise((resolve, reject) => {
//     getApi(EVENT_API.GET_LIST, {
//       deviceName: keyword,
//       pageSize: 50,
//       index: page,
//     })
//       .then(result => {
//         resolve({
//           data: result.data.data,
//           totalCount: result.data.totalRow,
//         });
//       })
//       .catch(err => reject(err));
//   })
// }
