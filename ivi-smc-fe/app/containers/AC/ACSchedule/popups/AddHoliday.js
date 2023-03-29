/* eslint-disable no-unused-expressions */
import {
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  OutlinedInput,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import MultiDatePicker from 'components/MultiDatePicker';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import Btn from 'components/Custom/Btn';
import Dialog from 'components/Dialog';
import { callApi } from 'utils/requestUtils';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import utils from 'utils/utils';
import Loading from 'containers/Loading';
import moment from 'moment';

export const REPEAT_TYPE_LIST = [
  {
    id: 'ONCE',
    text: '1 lần',
  },
  {
    id: 'EVERY_YEAR',
    text: 'Hàng năm',
  },
];

const REPEAT_TYPE_MAP = REPEAT_TYPE_LIST.reduce(
  (total, cur) => ({ ...total, [cur.id]: cur }),
  {},
);
const defaultNew = {
  name: '',
  description: '',
  type: REPEAT_TYPE_LIST[0],
  holidayDetails: [],
};
const AddHoliday = ({ data, onClose, onCloseSuccess, listHoliday }) => {
  const { formatMessage } = useIntl();

  const [loading, setLoading] = useState(false);
  const [isOpenConfirmCancelAdd, setIsOpenConfirmCancelAdd] = useState(false);
  const [isOpenConfirmUpdate, setIsOpenConfirmUpdate] = useState(false);
  const [dtoUpdate, setdtoUpdate] = useState('');

  const validationSchema = yup.object({
    name: yup
      .string()
      .trim()
      .required(formatMessage({ id: 'app.invalid.required' }))
      .max(100, formatMessage({ id: 'app.invalid.maxLength' }, { max: 100 })),
    description: yup
      .string()
      .trim()
      .max(250, formatMessage({ id: 'app.invalid.maxLength' }, { max: 250 })),
    holidayDetails: yup.array().min(1, 'Cần chọn tối thiểu 1 ngày'),
  });

  function getData(data) {
    const { type, holidayDetails, ...other } = data;
    return {
      ...other,
      type: REPEAT_TYPE_MAP[type],
      holidayDetails: holidayDetails.map(
        (d) =>
          new Date(type == 'ONCE' ? d.year : 2020, d.month - 1, d.dayOfMonth),
      ),
    };
  }

  const onActions = async (v) => {
    const { type, holidayDetails, ...other } = v;
    const dto = {
      ...other,
      type: type.id,
      holidayDetails: holidayDetails.map((d) => ({
        dayOfMonth: d.getDate(),
        month: d.getMonth() + 1,
        year: type.id == 'ONCE' ? d.getFullYear() : null,
      })),
    };
    const arrayListHoliday = listHoliday.rows
      .map((e) => e.holidayCurrentYear)
      .filter((e) => e.length > 0);
    const stringListHoliday = JSON.stringify(arrayListHoliday);
    const checkAbc = holidayDetails
      .map((i) => {
        const aaa = moment(i).format('YYYY-MM-DD');
        if (stringListHoliday.search(aaa) !== -1) {
          return aaa;
        }
        return null;
      })
      .filter((e) => e);

    if (checkAbc?.length > 0) {
      return utils.showToast(
        `Có các ngày: ${checkAbc.toString()} đã được chọn ở nhóm ngày nghỉ khác. Xin vui lòng kiểm tra lại`,
        'error',
      );
    }

    if (listHoliday.count === 24) {
      return utils.showToast(
        'Tổng số lượng ngày nghỉ vượt quá 24 ngày. Vui lòng thử lại. ',
        'error',
      );
    }
    if (data?.id) {
      setdtoUpdate(dto);
      setIsOpenConfirmUpdate(true);
    } else {
      setLoading(true);
      try {
        await callApi(`${ACCESS_CONTROL_API_SRC}/holidays`, 'POST', dto);
        utils.showToast('Thành công');
        onCloseSuccess();
      } catch (error) {
        utils.showToastErrorCallApi(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formik = useFormik({
    initialValues: data ? getData(data) : defaultNew,
    validationSchema,
    onSubmit: (values) => onActions(values),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div style={{ padding: 16 }}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl
                size="small"
                margin="dense"
                fullWidth
                error={formik.touched.name && Boolean(formik.errors.name)}
              >
                <FormLabel required>Tên</FormLabel>
                <OutlinedInput
                  value={formik.values.name}
                  margin="dense"
                  name="name"
                  placeholder="Nhập tên"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormHelperText>
                  {formik.touched.name && formik.errors.name}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl
                fullWidth
                margin="dense"
                required
                error={Boolean(formik.errors.repeat)}
              >
                <FormLabel>Lặp lại</FormLabel>
                <Autocomplete
                  id="combo-box-type"
                  name="type"
                  size="small"
                  value={formik.values.type}
                  disableClearable
                  options={REPEAT_TYPE_LIST}
                  getOptionLabel={(option) => option.text || ''}
                  getOptionSelected={(option, value) => option.id == value.id}
                  renderInput={(params) => (
                    <OutlinedInput
                      ref={params.InputProps.ref}
                      inputProps={params.inputProps}
                      {...params.InputProps}
                      fullWidth
                      margin="dense"
                    />
                  )}
                  onChange={(e, newVal) => {
                    formik.setFieldValue('type', newVal);
                    formik.setFieldValue('holidayDetails', []);
                  }}
                  noOptionsText={formatMessage({ id: 'app.no_data' })}
                />
                <FormHelperText>{formik.errors.type}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <FormControl
            size="small"
            margin="dense"
            fullWidth
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
          >
            <FormLabel>
              {formatMessage({ id: 'app.column.description' })}
            </FormLabel>
            <OutlinedInput
              margin="dense"
              multiline
              rows={4}
              placeholder="Nhập mô tả"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div
              style={{
                position: 'absolute',
                right: 10,
                bottom: 10,
                opacity: 0.7,
              }}
            >
              {formik.values.description.length || 0}/250
            </div>
            <FormHelperText>
              {formik.touched.description && formik.errors.description}
            </FormHelperText>
          </FormControl>
          <FormControl
            size="small"
            margin="dense"
            fullWidth
            error={Boolean(formik.errors.holidayDetails)}
          >
            <FormLabel required>Ngày nghỉ</FormLabel>
            <FormHelperText>{formik.errors.holidayDetails}</FormHelperText>
          </FormControl>
          <MultiDatePicker
            value={formik.values.holidayDetails}
            year={formik.values.type.id == 'ONCE'}
            onChange={(newVal) =>
              formik.setFieldValue('holidayDetails', newVal)
            }
          />
        </DialogContent>
        <div style={{ marginTop: 24 }}>
          <DialogActions>
            <Btn
              onClick={() => setIsOpenConfirmCancelAdd(true)}
              className="btn-cancel"
              label="Hủy"
              colorText="#000"
            />
            <Btn
              className="btn-save"
              label={data?.id ? 'Sửa' : 'Thêm'}
              onClick={formik.handleSubmit}
            />
          </DialogActions>
        </div>
      </div>
      {loading && <Loading />}

      <Dialog
        open={isOpenConfirmCancelAdd}
        maxWidth="sm"
        fullWidth
        onClose={() => setIsOpenConfirmCancelAdd(false)}
        title={data ? 'Bỏ qua cập nhật?' : 'Hủy tạo quản lý nhóm ngày nghỉ?'}
      >
        <div style={{ padding: 24 }}>
          {data ? null : (
            <div>
              Các thông tin vừa nhập sẽ không được lưu, bạn có chắc chắn muốn
              huỷ bỏ quá trình tạo mới nhóm ngày nghỉ?
            </div>
          )}

          <div
            style={{ marginTop: 40, justifyContent: 'flex-end' }}
            className="ct-flex-row"
          >
            <Btn
              colorText="#000"
              style={styles.btnCancel}
              label="Ở lại"
              onClick={() => setIsOpenConfirmCancelAdd(false)}
            />

            <Btn
              style={styles.btnSave}
              colorText="#FFF"
              label="Đồng ý"
              onClick={() => {
                setIsOpenConfirmCancelAdd(false);
                onClose();
              }}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        open={isOpenConfirmUpdate}
        maxWidth="sm"
        fullWidth
        onClose={() => setIsOpenConfirmUpdate(false)}
        title="Xác nhận lưu thay đổi quản lý nhóm ngày nghỉ"
      >
        <div style={{ padding: 24 }}>
          <div>
            Thay đổi quản lý nhóm ngày nghỉ sẽ bị ảnh hưởng đến hệ thống vận
            hành, bạn có chắc chắn lưu {dtoUpdate?.holidayDetails?.length || 0}{' '}
            quản lý nhóm ngày nghỉ này không?
          </div>
          <div
            style={{ marginTop: 40, justifyContent: 'flex-end' }}
            className="ct-flex-row"
          >
            <Btn
              colorText="#000"
              style={styles.btnCancel}
              label="Hủy"
              onClick={() => setIsOpenConfirmUpdate(false)}
            />

            <Btn
              style={styles.btnSave}
              disabled={loading}
              colorText="#FFF"
              label={loading ? 'Đang lưu ...' : 'Lưu'}
              onClick={async () => {
                setLoading(true);
                try {
                  await callApi(
                    `${ACCESS_CONTROL_API_SRC}/holidays/${data?.id}`,
                    'PUT',
                    dtoUpdate,
                  );
                  utils.showToast('Thành công');
                  onClose();
                } catch (error) {
                  utils.showToastErrorCallApi(error);
                } finally {
                  onCloseSuccess();
                  setLoading(false);
                  setIsOpenConfirmUpdate(false);
                }
              }}
            />
          </div>
        </div>
      </Dialog>
    </form>
  );
};

const styles = {
  btnCancel: {
    borderRadius: 8,
    width: 116,
    height: 40,
    background: '#E2E2E2',
    marginRight: 36,
  },
  btnSave: {
    width: 116,
    height: 40,
    background: '#4B67E2',
    borderRadius: 8,
  },
};

export default AddHoliday;
