import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  OutlinedInput,
  Checkbox,
} from '@material-ui/core';
import TreeSelect from 'components/TreeSelect';
import { useFormik } from 'formik';
import React from 'react';
import { useIntl } from 'react-intl';
import { getApi } from 'utils/requestUtils';
import * as yup from 'yup';
import { API_IAM } from '../apiUrl';
import btnMsg from '../Common/Messages/button';
import { defaultNew } from './contants';

export default function Add({ parent, onSubmit }) {
  const { formatMessage } = useIntl();
  const validationSchema = yup.object().shape({
    groupName: yup
      .string()
      .trim()
      .required(formatMessage({ id: 'app.invalid.required' }))
      .max(255, formatMessage({ id: 'app.invalid.maxLength' }, { max: 255 })),
    groupCode: yup
      .string()
      .trim()
      .required(formatMessage({ id: 'app.invalid.required' }))
      .max(255, formatMessage({ id: 'app.invalid.maxLength' }, { max: 255 })),
    description: yup
      .string()
      .trim()
      .max(255, formatMessage({ id: 'app.invalid.maxLength' }, { max: 255 })),
  });
  const formik = useFormik({
    initialValues: { ...defaultNew, parent },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });
  return (
    <>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item sm={12} md={6}>
            <FormControl
              size="small"
              margin="dense"
              fullWidth
              error={
                formik.touched.groupName && Boolean(formik.errors.groupName)
              }
            >
              <FormLabel required>Tên đơn vị</FormLabel>
              <OutlinedInput
                value={formik.values.groupName}
                margin="dense"
                name="groupName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormHelperText>
                {formik.touched.groupName && formik.errors.groupName}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item sm={12} md={6}>
            <FormControl
              size="small"
              margin="dense"
              fullWidth
              error={
                formik.touched.groupCode && Boolean(formik.errors.groupCode)
              }
            >
              <FormLabel required>Mã đơn vị</FormLabel>
              <OutlinedInput
                value={formik.values.groupCode}
                margin="dense"
                name="groupCode"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormHelperText>
                {formik.touched.groupCode && formik.errors.groupCode}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item sm={12} md={6}>
            <FormControl
              size="small"
              margin="dense"
              fullWidth
              variant="outlined"
            >
              <FormLabel>Thuộc đơn vị</FormLabel>
              <TreeSelect
                value={formik.values.parent}
                onValueChanged={(newVal) =>
                  formik.setFieldValue('parent', newVal)
                }
                keyExpr="groupId"
                displayExpr="groupName"
                searchEnabled
                hasItemsExpr={(node) => !node?.isLeaf}
                loadData={(node) =>
                  new Promise((resolve, reject) => {
                    if (node?.id) {
                      resolve([]);
                    }
                    getApi(API_IAM.LIST_DEPARTMENT)
                      .then((ret) => {
                        resolve(ret.data);
                      })
                      .catch((err) => reject(err));
                  })
                }
              />
            </FormControl>
          </Grid>
          <Grid item sm={12} md={6}>
            <FormControl size="small" margin="dense">
              <FormLabel>&nbsp;</FormLabel>
              <FormControlLabel
                label="Là đơn vị thuộc "
                control={
                  <Checkbox
                    color="primary"
                    checked={formik.values.isPnLVGR}
                    onChange={(e) =>
                      formik.setFieldValue('isPnLVGR', e.target.checked)
                    }
                  />
                }
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="default" variant="contained" onClick={() => onSubmit(0)}>
          {formatMessage(btnMsg.cancel)}
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => formik.handleSubmit()}
        >
          {formatMessage(btnMsg.save)}
        </Button>
      </DialogActions>
    </>
  );
}
