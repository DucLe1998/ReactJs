import { Controller, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { DialogActions, DialogTitle, Grid, TextField } from '@material-ui/core';
import _ from 'lodash';
import { useStyles } from '../styled';
import { SAP_SRC } from '../../apiUrl';
import VAutocomplete from '../../../components/VAutocomplete';
import { getApi } from '../../../utils/requestUtils';
import { getErrorMessage } from '../../Common/function';
import BtnCancel from '../../../components/Button/BtnCancel';
import BtnSuccess from '../../../components/Button/BtnSuccess';

export const FilterMap = ({ onClose, handleChangeFilter, initValues }) => {
  const classes = useStyles();

  const { handleSubmit, control, reset, getValues, watch } = useForm({
    defaultValues: initValues,
  });

  const setDetailFormValue = () => {
    reset({
      area: initValues.area,
      zone: initValues.zone,
      block: initValues.block,
      floor: initValues.floor,
    });
  };

  useEffect(() => {
    setDetailFormValue();
  }, [initValues]);

  const onSubmit = values => {
    handleChangeFilter(values);
    onClose();
  };

  const watchFields = watch(['zone', 'block']);

  return (
    <form className={classes.root}>
      {/* <DialogTitle className="title">Thêm bản đồ</DialogTitle> */}
      <Grid container spacing={2}>
        {/* <Grid item xs={12} sm={6}> */}
        {/*  <p className={classes.label}>Phân khu</p> */}
        {/*  <Controller */}
        {/*    control={control} */}
        {/*    name="zone" */}
        {/*    defaultValue="" */}
        {/*    render={props => ( */}
        {/*      <VAutocomplete */}
        {/*        value={props.value} */}
        {/*        fullWidth */}
        {/*        noOptionsText="Không có dữ liệu" */}
        {/*        getOptionLabel={option => option?.zoneName || ''} */}
        {/*        firstIndex={1} */}
        {/*        loadData={page => */}
        {/*          new Promise((resolve, reject) => { */}
        {/*            getApi(`${SAP_SRC}/zones/search`, { */}
        {/*              areaId: 19, */}
        {/*            }) */}
        {/*              .then(result => { */}
        {/*                const data = [...result]; */}
        {/*                if (page === 1 && data?.length) { */}
        {/*                  data.unshift({ zoneId: null, zoneName: 'Tất cả' }); */}
        {/*                } */}
        {/*                resolve({ */}
        {/*                  data, */}
        {/*                  totalCount: data?.length || 0, */}
        {/*                }); */}
        {/*              }) */}
        {/*              .catch(err => reject(getErrorMessage(err))); */}
        {/*          }) */}
        {/*        } */}
        {/*        getOptionSelected={(option, selected) => */}
        {/*          option.zoneId === selected.zoneId */}
        {/*        } */}
        {/*        onChange={(e, value) => { */}
        {/*          props.onChange(value); */}
        {/*        }} */}
        {/*        renderInput={params => ( */}
        {/*          <TextField */}
        {/*            {...params} */}
        {/*            variant="outlined" */}
        {/*            placeholder="Chọn phân khu" */}
        {/*          /> */}
        {/*        )} */}
        {/*      /> */}
        {/*    )} */}
        {/*  /> */}
        {/* </Grid> */}
        {/* <Grid item xs={12} sm={6}> */}
        {/*  <p className={classes.label}>Tòa nhà</p> */}
        {/*  <Controller */}
        {/*    control={control} */}
        {/*    name="block" */}
        {/*    defaultValue="" */}
        {/*    render={props => ( */}
        {/*      <VAutocomplete */}
        {/*        value={props.value} */}
        {/*        fullWidth */}
        {/*        noOptionsText="Không có dữ liệu" */}
        {/*        getOptionLabel={option => option?.blockName || ''} */}
        {/*        firstIndex={1} */}
        {/*        loadData={(page, keyword) => */}
        {/*          new Promise((resolve, reject) => { */}
        {/*            if (!watchFields.zone) { */}
        {/*              resolve({ */}
        {/*                data: [], */}
        {/*                totalCount: 0, */}
        {/*              }); */}
        {/*              return; */}
        {/*            } */}
        {/*            const params = { */}
        {/*              blockName: keyword, */}
        {/*              page, */}
        {/*              limit: 50, */}
        {/*              zoneCode: watchFields?.zone?.zoneCode || '', */}
        {/*            }; */}
        {/*            getApi(`${SAP_SRC}/blocks`, _.pickBy(params)) */}
        {/*              .then(result => { */}
        {/*                const data = [...result.rows]; */}
        {/*                if (page === 1 && data?.length) { */}
        {/*                  data.unshift({ blockId: null, blockName: 'Tất cả' }); */}
        {/*                } */}
        {/*                resolve({ */}
        {/*                  data, */}
        {/*                  totalCount: result?.count + 1 || 0, */}
        {/*                }); */}
        {/*              }) */}
        {/*              .catch(err => reject(getErrorMessage(err))); */}
        {/*          }) */}
        {/*        } */}
        {/*        getOptionSelected={(option, selected) => */}
        {/*          option.blockId === selected.blockId */}
        {/*        } */}
        {/*        onChange={(e, value) => { */}
        {/*          props.onChange(value); */}
        {/*        }} */}
        {/*        renderInput={params => ( */}
        {/*          <TextField */}
        {/*            {...params} */}
        {/*            variant="outlined" */}
        {/*            placeholder="Chọn phân khu" */}
        {/*          /> */}
        {/*        )} */}
        {/*      /> */}
        {/*    )} */}
        {/*    VAutocomple */}
        {/*  /> */}
        {/* </Grid> */}
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Tầng</p>
          <Controller
            control={control}
            name="floor"
            defaultValue=""
            render={props => (
              <VAutocomplete
                value={props.value}
                fullWidth
                noOptionsText="Không có dữ liệu"
                getOptionLabel={option => option?.floorName || ''}
                firstIndex={1}
                loadData={(page, keyword) =>
                  new Promise((resolve, reject) => {
                    // if (!watchFields.block) {
                    //   resolve({
                    //     data: [],
                    //     totalCount: 0,
                    //   });
                    //   return;
                    // }
                    const params = {
                      page,
                      searchValue: keyword,
                      limit: 50,
                      blockId: process.env.BLOCK_ID || '',
                    };
                    getApi(`${SAP_SRC}/floors`, _.pickBy(params))
                      .then(result => {
                        const data = [...result.rows];
                        if (page === 1 && data?.length) {
                          data.unshift({ floorId: null, floorName: 'Tất cả' });
                        }
                        resolve({
                          data,
                          totalCount: result?.count + 1 || 0,
                        });
                      })
                      .catch(err => reject(getErrorMessage(err)));
                  })
                }
                getOptionSelected={(option, selected) =>
                  option.floorId === selected.floorId
                }
                onChange={(e, value) => {
                  props.onChange(value);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Chọn tầng"
                  />
                )}
              />
            )}
          />
        </Grid>
      </Grid>
      <DialogActions>
        <BtnCancel onClick={onClose}>Hủy</BtnCancel>
        <BtnSuccess onClick={handleSubmit(onSubmit)}>Lọc</BtnSuccess>
      </DialogActions>
    </form>
  );
};

export default FilterMap;
