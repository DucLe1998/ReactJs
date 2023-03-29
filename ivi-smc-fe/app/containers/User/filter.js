import {
  Button,
  DialogActions,
  FormControl,
  FormLabel,
  Grid,
} from '@material-ui/core';
import { Popup } from 'devextreme-react/popup';
import SelectBox from 'devextreme-react/select-box';
import { TextBox } from 'devextreme-react/text-box';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import VAutocomplete from '../../components/VAutocomplete';
import { getApi } from '../../utils/requestUtils';
import { API_IAM } from '../apiUrl';
import messages from './messages';
import OptionExpAccount from './render/OptionExpAccount';

const initialExpAccountCustom = {
  label: 'Tùy chỉnh',
  startUpdatedAt: '',
  endUpdatedAt: '',
  value: '',
};
export function FilterUser({
  close,
  initValue,
  // units,
  // positions,
  // authorities,
  handleSetValueFilter,
}) {
  const intl = useIntl();
  const { control, setValue } = useForm({
    defaultValues: initValue,
  });
  const typeAccount = [
    {
      label: 'Tài khoản hệ thống (Local)',
      value: 'LOCAL',
    },
  ];
  const statuses = [
    { key: null, value: 'Tất cả' },
    { key: 'ACTIVE', value: 'Hoạt động' },
    { key: 'INACTIVE', value: 'Không hoạt động' },
  ];
  const [openExpAccount, setOpenExpAccount] = useState(false);
  const expAccountList = [
    {
      label: 'Không xác định',
      startUpdatedAt: '',
      endUpdatedAt: '',
      value: 'undefined',
    },
    {
      label: 'Trên 6 tháng',
      startUpdatedAt: '',
      endUpdatedAt: '',
      value: '6m',
    },
    {
      label: 'Trên 9 tháng',
      startUpdatedAt: '',
      endUpdatedAt: '',
      value: '9m',
    },
    {
      label: 'Trên 12 tháng',
      startUpdatedAt: '',
      endUpdatedAt: '',
      value: '12m',
    },
  ];
  const [expAccountCustom, setExpAccountCustom] = useState(
    initValue.expAccount?.value == ''
      ? initValue.expAccount
      : initialExpAccountCustom,
  );
  const mergeTimePeriod = [...expAccountList, expAccountCustom];
  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth size="small" margin="dense">
            <FormLabel>
              {intl.formatMessage({
                id: 'app.containers.User.email',
              })}
            </FormLabel>
            <Controller
              name="email"
              control={control}
              render={(props) => (
                <TextBox
                  value={props.value}
                  placeholder={intl.formatMessage({
                    id: 'app.containers.User.email',
                  })}
                  stylingMode="outlined"
                  onValueChanged={(e) => {
                    props.onChange(e.event);
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth size="small" margin="dense">
            <FormLabel>
              {intl.formatMessage({
                id: 'app.containers.User.empCode',
              })}
            </FormLabel>
            <Controller
              name="employeeCodes"
              control={control}
              render={(props) => (
                <TextBox
                  value={props.value}
                  placeholder={intl.formatMessage({
                    id: 'app.containers.User.empCode',
                  })}
                  stylingMode="outlined"
                  onValueChanged={(e) => {
                    props.onChange(e.event);
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth size="small" margin="dense">
            <FormLabel>
              {intl.formatMessage({
                id: 'app.containers.User.phoneNumber',
              })}
            </FormLabel>
            <Controller
              name="phoneNumber"
              control={control}
              render={(props) => (
                <TextBox
                  value={props.value}
                  placeholder={intl.formatMessage({
                    id: 'app.containers.User.phoneNumber',
                  })}
                  stylingMode="outlined"
                  onValueChanged={(e) => {
                    props.onChange(e.event);
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth size="small" margin="dense">
            <FormLabel>
              {intl.formatMessage({
                id: 'app.containers.User.unit',
              })}
            </FormLabel>
            <Controller
              control={control}
              name="orgUnitIds"
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  fullWidth
                  getOptionLabel={(option) => option?.orgUnitName || ''}
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      const params = {
                        limit: 50,
                        page,
                      };
                      if (keyword !== '') {
                        params.keyword = keyword;
                      }
                      getApi(API_IAM.ORG_UNIT, params)
                        .then((result) => {
                          resolve({
                            data: result.data.rows,
                            totalCount: result.data.count,
                          });
                        })
                        .catch((err) => reject(err));
                    })
                  }
                  getOptionSelected={(option, selected) =>
                    option.orgUnitId === selected.orgUnitId
                  }
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                  placeholder="Chọn đơn vị"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth size="small" margin="dense">
            <FormLabel>
              {intl.formatMessage({
                id: 'app.containers.User.position',
              })}
            </FormLabel>
            <Controller
              control={control}
              name="positionIds"
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  fullWidth
                  getOptionLabel={(option) => option?.positionName || ''}
                  firstIndex={1}
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      const params = {
                        limit: 50,
                        page,
                      };
                      if (keyword !== '') {
                        params.keyword = keyword;
                      }
                      getApi(API_IAM.POSITION, params)
                        .then((result) => {
                          resolve({
                            data: result.data.rows,
                            totalCount: result.data.count,
                          });
                        })
                        .catch((err) => reject(err));
                    })
                  }
                  getOptionSelected={(option, selected) =>
                    option.positionId === selected.positionId
                  }
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                  placeholder="Chọn chức vụ"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth size="small" margin="dense">
            <FormLabel>
              {intl.formatMessage({
                id: 'app.containers.User.authority',
              })}
            </FormLabel>
            <Controller
              control={control}
              name="policyIds"
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  fullWidth
                  getOptionLabel={(option) => option?.policyName || ''}
                  firstIndex={1}
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      const params = {
                        limit: 50,
                        page,
                      };
                      if (keyword !== '') {
                        params.keyword = keyword;
                      }
                      getApi(API_IAM.POLICY_LIST, params)
                        .then((result) => {
                          resolve({
                            data: result.data.rows,
                            totalCount: result.data.count,
                          });
                        })
                        .catch((err) => reject(err));
                    })
                  }
                  getOptionSelected={(option, selected) =>
                    option.policyId === selected.policyId
                  }
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                  placeholder="Chọn vai trò"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl
            fullWidth
            size="small"
            margin="dense"
            style={{ position: 'relative' }}
          >
            <FormLabel>
              {intl.formatMessage({
                id: 'app.containers.User.status',
              })}
            </FormLabel>
            <Controller
              control={control}
              name="statuses"
              render={(props) => (
                <SelectBox
                  value={props.value}
                  items={statuses}
                  width="100%"
                  displayExpr="value"
                  valueExpr="key"
                  placeholder="Chọn trạng thái"
                  onValueChanged={(e) => {
                    props.onChange(e.value);
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth size="small" margin="dense">
            <FormLabel>
              {intl.formatMessage({
                id: 'app.containers.User.typeAccount',
              })}
            </FormLabel>
            <Controller
              control={control}
              name="identityProviderType"
              render={(props) => (
                <SelectBox
                  value={props.value}
                  items={typeAccount}
                  placeholder={intl.formatMessage({
                    id: 'app.containers.User.typeAccount',
                  })}
                  width="100%"
                  displayExpr="label"
                  valueExpr="value"
                  onValueChanged={(e) => {
                    props.onChange(e.value);
                  }}
                  showClearButton
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth size="small" margin="dense">
            <FormLabel>
              {intl.formatMessage({
                id: 'app.containers.User.expAccount',
              })}
            </FormLabel>
            <Controller
              control={control}
              name="expAccount"
              render={(props) => (
                <SelectBox
                  items={mergeTimePeriod}
                  placeholder={intl.formatMessage({
                    id: 'app.containers.User.expAccount',
                  })}
                  width="100%"
                  displayExpr="label"
                  value={mergeTimePeriod.find(
                    (el) => el.value === props?.value?.value,
                  )}
                  showClearButton
                  onItemClick={(e) => {
                    if (e.itemData.value === '') {
                      setOpenExpAccount(true);
                    }
                  }}
                  onValueChanged={(e) => {
                    if (
                      e.value?.value != '' &&
                      e?.previousValue?.value !== e?.value?.value
                    ) {
                      props.onChange(e.value);
                      setExpAccountCustom(initialExpAccountCustom);
                    }
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>
      </Grid>
      <DialogActions>
        <Button onClick={close} variant="contained">
          {intl.formatMessage(messages.btnCancel)}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleSetValueFilter(control.getValues());
          }}
        >
          {intl.formatMessage(messages.btnFilter)}
        </Button>
      </DialogActions>
      {openExpAccount && (
        <Popup
          className="popup"
          visible
          title="Tùy chỉnh thời gian hiệu lực của tài khoản"
          showTitle
          onHidden={() => {
            setOpenExpAccount(false);
          }}
          dragEnabled
          width={600}
          height={200}
        >
          <OptionExpAccount
            confirmText="Chọn"
            cancelText="Hủy"
            startDateInput={initValue.availableAt}
            endDateInput={initValue.expiredAt}
            confirm={(startDate, endDate) => {
              const start = format(startDate, 'dd/MM/yyyy');
              const end = format(endDate, 'dd/MM/yyyy');
              const newState = {
                label: `${start} - ${end}`,
                startUpdatedAt: startDate,
                endUpdatedAt: endDate,
                value: '',
              };
              setExpAccountCustom(newState);
              setValue('expAccount', newState);
              setOpenExpAccount(false);
            }}
            close={() => {
              setOpenExpAccount(false);
            }}
          />
        </Popup>
      )}
    </form>
  );
}

export default FilterUser;
