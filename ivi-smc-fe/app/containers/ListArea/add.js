import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  FormLabel,
  OutlinedInput,
} from '@material-ui/core';
import TreeSelect from 'components/TreeSelect';
import { useFormik } from 'formik';
import React from 'react';
import { useIntl } from 'react-intl';
import { getApi } from 'utils/requestUtils';
import * as yup from 'yup';
import { SAP_API } from '../apiUrl';
import btnMsg from '../Common/Messages/button';
import { defaultNew } from './constants';

export default function Add({ initialValues, onSubmit }) {
  const { formatMessage } = useIntl();
  const validationSchema = yup.object().shape({
    areaName: yup
      .string()
      .trim()
      .required(formatMessage({ id: 'app.invalid.required' }))
      .max(255, formatMessage({ id: 'app.invalid.maxLength' }, { max: 255 })),
    areaCode: yup
      .string()
      .trim()
      .required(formatMessage({ id: 'app.invalid.required' }))
      .max(255, formatMessage({ id: 'app.invalid.maxLength' }, { max: 255 })),
  });
  const formik = useFormik({
    initialValues: initialValues || defaultNew,
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });
  return (
    <>
      <DialogContent>
        <FormControl
          size="small"
          margin="dense"
          fullWidth
          error={formik.touched.areaName && Boolean(formik.errors.areaName)}
        >
          <FormLabel required>Tên phân khu</FormLabel>
          <OutlinedInput
            value={formik.values.areaName}
            margin="dense"
            name="areaName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <FormHelperText>
            {formik.touched.areaName && formik.errors.areaName}
          </FormHelperText>
        </FormControl>
        <FormControl
          size="small"
          margin="dense"
          fullWidth
          error={formik.touched.areaCode && Boolean(formik.errors.areaCode)}
        >
          <FormLabel required>Mã phân khu</FormLabel>
          <OutlinedInput
            value={formik.values.areaCode}
            margin="dense"
            name="areaCode"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <FormHelperText>
            {formik.touched.areaCode && formik.errors.areaCode}
          </FormHelperText>
        </FormControl>
        <FormControl size="small" margin="dense" fullWidth variant="outlined">
          <FormLabel>Thuộc phân khu</FormLabel>
          <TreeSelect
            value={formik.values.parent}
            onValueChanged={(newVal) => formik.setFieldValue('parent', newVal)}
            keyExpr="id"
            displayExpr="areaName"
            searchEnabled
            hasItemsExpr={(node) => !node?.isLeaf}
            loadData={(node) =>
              new Promise((resolve, reject) => {
                let url = SAP_API.ROOT_AREA;
                if (node?.key) {
                  url = SAP_API.CHILD_AREA(node.key);
                }
                getApi(url)
                  .then((ret) => {
                    resolve(ret.data);
                  })
                  .catch((err) => reject(err));
              })
            }
          />
        </FormControl>
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
