import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import MultiSelect from 'components/MultiSelect';
import DatePicker from 'react-multi-date-picker';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import { getApi } from 'utils/requestUtils';
import { ARTICLES_SRC } from 'containers/apiUrl';

import {
  DialogContent,
  Grid,
  DialogActions,
  DialogTitle,
  makeStyles,
  Button,
} from '@material-ui/core';

import { statusNewsManagement } from './data';

const useStyles = makeStyles({
  root: {
    '& .MuiDialogActions-root': {
      padding: '32px',
    },
    '& .MuiDialogContent-root': {
      overflowY: 'unset',
    },
    '& .MuiPaper-rounded': {
      borderRadius: '8px',
    },
    '& .rmdp-input': {
      width: '100%',
      height: '40px',
      borderRadius: '4px',
      paddingLeft: '10px',
      paddingRight: '16px',
    },
  },

  button: {
    padding: '12px 16px',
    border: 'none',
    outline: 'none',
    lineHeight: '16px',
    boxSizing: 'border-box',
    borderRadius: '8px',
    cursor: 'pointer',
    minWidth: '104px',
  },
  label: {
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#999999',
    margin: '5px 0',
  },
});

export default function PopupFilter({ onClose, onSuccess, defaultValues }) {
  const classes = useStyles();
  const { handleSubmit, control } = useForm({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSuccess)} className={classes.root}>
      <DialogTitle>Lọc tin tức</DialogTitle>
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container direction="column">
              <p className={classes.label}>Trạng thái xuất bản</p>
              <Controller
                control={control}
                name="status"
                defaultValue={[]}
                render={props => (
                  <MultiSelect
                    value={props.value}
                    placeholder="Trạng thái"
                    selectAllLabel="Tất cả"
                    onChangeValue={props.onChange}
                    options={statusNewsManagement}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="column">
              <p className={classes.label}>Ngày xuất bản</p>
              <Controller
                control={control}
                name="date"
                defaultValue={[]}
                render={props => (
                  <DatePicker
                    format="DD/MM/YYYY"
                    range
                    placeholder="Ngày xuất bản"
                    plugins={[<DatePanel />]}
                    value={props.value}
                    onChange={props.onChange}
                  />
                )}
              />
            </Grid>
          </Grid>
          {/* <Grid item xs={12}>
            <Grid container direction="column">
              <p className={classes.label}>
                Vị trí hiển thị trên ứng dụng (Home)
              </p>
              <Controller
                control={control}
                name="displayLocation"
                defaultValue={null}
                render={props => (
                  <Autocomplete
                    id="combo-box-status"
                    size="small"
                    value={props.value}
                    options={[
                      { label: 'Tất cả', value: null },
                      { label: 'Banner', value: 1 },
                      { label: 'Tin tức', value: 2 },
                    ]}
                    getOptionLabel={option => option.label || ''}
                    getOptionSelected={(option, selected) =>
                      option.value == selected.value
                    }
                    renderInput={params => (
                      <OutlinedInput
                        ref={params.InputProps.ref}
                        inputProps={params.inputProps}
                        {...params.InputProps}
                        fullWidth
                        margin="dense"
                        placeholder="Vị trí"
                      />
                    )}
                    onChange={(e, value) => {
                      props.onChange(value);
                    }}
                    noOptionsText="Không có data"
                  />
                )}
              />
            </Grid>
          </Grid> */}
          <Grid item xs={12}>
            <Grid container direction="column">
              <p className={classes.label}>Danh mục</p>
              <Controller
                control={control}
                name="categoryIds"
                defaultValue={[]}
                render={props => (
                  <MultiSelect
                    placeholder="Danh mục"
                    value={props.value}
                    selectAllLabel="Tất cả"
                    onChangeValue={props.onChange}
                    loadData={() =>
                      new Promise((resolve, reject) => {
                        getApi(`${ARTICLES_SRC}/article-categories`)
                          .then(result => {
                            resolve(
                              result.data.rows.map(item => ({
                                value: item.id,
                                label: item.name,
                              })),
                            );
                          })
                          .catch(err => reject(err));
                      })
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="contained" type="submit" color="primary">
          Lọc
        </Button>
      </DialogActions>
    </form>
  );
}
