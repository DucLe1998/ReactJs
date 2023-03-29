/* eslint-disable no-restricted-globals */
import { Grid } from '@material-ui/core';
import DateTimeBox from 'components/TextInput/DateTimeBox';
import SelectInput from 'components/TextInput/SelectInput';
import React, { useState } from 'react';

import PopupCustom from '../../components/Custom/popup/PopupCustom';

const PopupFilter = ({ onClose, onClickSave, searchValue }) => {
  const [dataFilter, setDataFilter] = useState(searchValue);

  const onSave = () => {
    onClickSave(dataFilter);
    onClose(false);
  };

  return (
    <PopupCustom
      onClose={onClose}
      title="Bộ lọc"
      width={770}
      body={
        <Grid container spacing={2}>
          <Grid item sm={6}>
            <DateTimeBox
              title="Ngày bắt đầu"
              onValueChanged={(e) => {
                const abc = e?.value || '';
                setDataFilter({
                  ...dataFilter,
                  startDate: abc,
                });
              }}
              style={{ marginRight: 16 }}
              showClearButton
              defaultValue={searchValue?.startDate || ''}
              max={dataFilter?.endDate || null}
            />
          </Grid>
          <Grid item sm={6}>
            <DateTimeBox
              title="Ngày kết thúc"
              onValueChanged={(e) => {
                const abc = e?.value || '';
                setDataFilter({
                  ...dataFilter,
                  endDate: abc,
                });
              }}
              style={{ marginRight: 16 }}
              showClearButton
              defaultValue={searchValue?.endDate || ''}
              min={dataFilter?.startDate || null}
            />
          </Grid>
          <Grid item sm={6}>
            <SelectInput
              label="Loại yêu cầu"
              data={listType}
              defaultValue={searchValue?.repeatType || listType[0].key}
              onValueChanged={(e) =>
                setDataFilter({
                  ...dataFilter,
                  repeatType: e || '',
                })
              }
            />
          </Grid>
        </Grid>
      }
      listBtnFooter={[
        {
          colorText: '#000',
          className: 'btn-cancel',
          label: 'Hủy',
          onClick: () => onClose(false),
        },
        {
          className: 'btn-save',
          label: 'Lưu',
          onClick: onSave,
        },
      ]}
    />
  );
};

const listType = [
  { name: 'Tất cả', key: '' },
  { name: 'Một lần', key: 'ONCE' },
  { name: 'Lặp lại', key: 'WEEKLY' },
];

export default PopupFilter;
