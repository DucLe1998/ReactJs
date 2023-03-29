import React, { useState } from 'react';
import { Button } from 'devextreme-react/button';
import { Checkbox, Grid } from '@material-ui/core';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { useFormik } from 'formik';
import TextField from '@material-ui/core/TextField';
import messages from '../messages';
import {
  RowContent,
  RowItem,
  RowLabel,
} from '../../../components/CommonComponent';
import { Label } from '../../Login/style';
import { useStyles } from '../style';
import { getApi } from '../../../utils/requestUtils';
import { API_IAM } from '../../apiUrl';
import VAutocomplete from '../../../components/VAutocomplete';

export function EditUnit({
  close,
  currentUnits,
  data,
  confirm,
  isCreateNew,
  DVKNOrigin,
}) {
  const intl = useIntl();
  const classes = useStyles();
  const formik = useFormik({
    initialValues: {
      default: false,
      isLeader: isCreateNew ? false : data.isLeader,
      leader: isCreateNew ? false : data.leader,
      orgUnitId: isCreateNew ? null : data.orgUnitId,
      orgUnitCode: isCreateNew ? null : data.orgUnitCode,
      positionId: isCreateNew ? null : data.positionId ? data.positionId : null,
      username: '',
      orgUnitName: isCreateNew ? null : data.orgUnitName,
      positionName: isCreateNew
        ? null
        : data.positionName
        ? data.positionName
        : null,
    },
  });
  const [disable, setDisable] = useState(true);
  const isValidOrgUnit = (orgUnitId, positionId) =>
    currentUnits.filter(u => {
      if (
        isCreateNew &&
        u.orgUnitId === orgUnitId &&
        u.positionId === positionId
      ) {
        return true;
      }
      // TH khong thay doi gi ca
      if (
        !isCreateNew &&
        u.orgUnitId === orgUnitId &&
        u.positionId === positionId &&
        u.orgUnitId !== data.orgUnitId // TH chon lai chinh no
      ) {
        return true;
      }
      return false;
    }).length > 0;

  return (
    <React.Fragment>
      <Grid container spacing={3} className={classes.gridMargin}>
        <Grid container item xs={6}>
          <div className={classes.fullWidth}>
            <Label className={classes.label}>
              {intl.formatMessage(messages.unitName)}
            </Label>
            <VAutocomplete
              value={{
                orgUnitId: formik.values.orgUnitId || '',
                orgUnitName: formik.values.orgUnitName || '',
                orgUnitCode: formik.values.orgUnitCode || '',
              }}
              virtual={false}
              fullWidth
              getOptionLabel={option => option?.orgUnitName || ''}
              firstIndex={1}
              loadData={() =>
                new Promise((resolve, reject) => {
                  getApi(API_IAM.ORG_UNIT_ME)
                    .then(result => {
                      const idsCurrent = currentUnits.map(
                        item => item.orgUnitId,
                      );
                      const ids = [...idsCurrent, DVKNOrigin];
                      const res = DVKNOrigin
                        ? result.data.filter(
                            item => !ids.includes(item.orgUnitId),
                          )
                        : result.data;

                      resolve({
                        data: res,
                        totalCount: DVKNOrigin
                          ? res.length
                          : result.data.length,
                      });
                    })
                    .catch(err => reject(err));
                })
              }
              getOptionSelected={(option, selected) =>
                option.orgUnitId === selected.orgUnitId
              }
              onChange={(e, value) => {
                formik.setFieldValue('orgUnitId', value?.orgUnitId || '');
                formik.setFieldValue('orgUnitName', value?.orgUnitName || '');
                formik.setFieldValue('orgUnitCode', value?.orgUnitCode || '');
                if (value) {
                  if (formik.values.positionId) {
                    if (
                      isValidOrgUnit(value.orgUnitId, formik.values.positionId)
                    ) {
                      formik.setFieldValue('positionId', '');
                      formik.setFieldValue('positionName', '');
                      setDisable(true);
                    } else if (formik.values.positionId) {
                      setDisable(false);
                    }
                  }
                } else {
                  setDisable(true);
                }
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder={intl.formatMessage(messages.orgUnitPlaceholder)}
                />
              )}
            />
          </div>
        </Grid>
        <Grid container item xs={6}>
          <div className={classes.fullWidth}>
            <Label className={classes.label}>
              {intl.formatMessage(messages.position)}
            </Label>
            <VAutocomplete
              value={{
                positionId: formik.values.positionId,
                positionName: formik.values.positionName,
              }}
              fullWidth
              getOptionLabel={option => option?.positionName || ''}
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
                    .then(result => {
                      resolve({
                        data: result.data.rows,
                        totalCount: result.data.count,
                      });
                    })
                    .catch(err => reject(err));
                })
              }
              getOptionSelected={(option, selected) =>
                option.positionId === selected.positionId
              }
              onChange={(e, value) => {
                formik.setFieldValue('positionId', value?.positionId || '');
                formik.setFieldValue('positionName', value?.positionName || '');
                if (value) {
                  if (formik.values.orgUnitId) {
                    setDisable(false);
                  }
                } else {
                  setDisable(true);
                }
              }}
              getOptionDisabled={option => {
                if (
                  isValidOrgUnit(formik.values.orgUnitId, option.positionId)
                ) {
                  return true;
                }
                return false;
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder={intl.formatMessage(messages.positionPlaceholder)}
                />
              )}
            />
          </div>
        </Grid>
        <Grid container item xs={12}>
          <Checkbox
            style={{ padding: 0 }}
            name="isLanhDaoDonVi"
            color="primary"
            defaultChecked={formik.values.isLeader}
            onChange={e => {
              formik.values.isLeader = e.target.checked;
            }}
          />
          <span style={{ margin: 'auto 0' }}>
            {intl.formatMessage(messages.leadershipUnit)}
          </span>
        </Grid>
      </Grid>
      <RowItem style={{ float: 'right', marginBottom: 20 }}>
        <RowLabel />
        <RowContent>
          <Button
            style={{ marginRight: 10 }}
            className={clsx(classes.button, classes.buttonCancel)}
            onClick={close}
          >
            {intl.formatMessage(messages.btnCancel)}
          </Button>
          <Button
            disabled={disable}
            className={clsx(classes.button, classes.buttonFilter)}
            onClick={() => {
              // getName();
              confirm(formik.values);
            }}
          >
            {isCreateNew
              ? intl.formatMessage({ id: 'app.tooltip.add' })
              : intl.formatMessage({ id: 'app.tooltip.edit' })}
          </Button>
        </RowContent>
      </RowItem>
    </React.Fragment>
  );
}

export default EditUnit;
