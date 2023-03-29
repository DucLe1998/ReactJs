/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextInput from 'components/TextInput/TextInput';
import { callApi } from 'utils/requestUtils';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import utils from 'utils/utils';

const FormGroup = ({
  open,
  onClose,
  data,
  item,
  callback,
  api,
  textApi,
  allUrlApi,
}) => {
  const [name, setName] = useState(data?.name || `Nhóm ${textApi} mới`);

  const handleClose = () => {
    onClose(false);
  };

  useEffect(() => {
    if (data?.name) {
      setName(data.name);
    } else {
      setName(`Nhóm ${textApi} mới`);
    }
  }, [data]);

  const handleDone = async () => {
    if (name) {
      if (name?.length > 50) {
        return utils.showToast('Độ dài vượt quá 50 ký tự', 'error');
      }
      if (data?.id) {
        try {
          await callApi(
            `${allUrlApi || ACCESS_CONTROL_API_SRC}/${api}-groups/${data?.id}`,
            'PUT',
            {
              name,
              parentId: data?.categoryId === 1 ? '' : data?.categoryId || '',
            },
          );
          utils.showToast('Sửa thành công');
          handleClose();
          callback();
        } catch (error) {
          utils.showToastErrorCallApi(error);
        }
      } else {
        try {
          await callApi(
            `${allUrlApi || ACCESS_CONTROL_API_SRC}/${api}-groups`,
            'POST',
            {
              name,
              parentId: item?.id === 1 ? null : item.id,
            },
          );
          utils.showToast('Tạo mới thành công');
          handleClose();
          callback();
        } catch (error) {
          utils.showToastErrorCallApi(error);
        }
      }
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {data?.id ? 'Đổi tên nhóm' : 'Tạo nhóm mới'}
        </DialogTitle>
        <DialogContent>
          <div style={{ marginTop: 16, width: 500 }}>
            <TextInput
              defaultValue={data?.name || `Nhóm ${textApi} mới`}
              label="Tên nhóm"
              onChange={(e) => setName(e)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDone} color="primary">
            {data?.id ? 'Sửa' : 'Tạo'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FormGroup;
