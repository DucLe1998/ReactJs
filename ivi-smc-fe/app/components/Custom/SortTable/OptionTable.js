/* eslint-disable consistent-return */
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import utils from 'utils/utils';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ViewOptionTable from './ViewOptionTable';

const OptionTable = ({
  open,
  onClose,
  dataColumnTable,
  onSave,
  keySaveLocal,
  dataColumnDefault,
}) => {
  const [data, setData] = useState([]);

  const handleClose = () => {
    onClose(false);
  };

  const handleDone = () => {
    if (data && data.length > 0) {
      if (data[0]?.type === 'title' && data[0]?.caption === 'Không hiển thị') {
        return utils.showToast(
          'Không thể ẩn toàn bộ các trường thông tin',
          'error',
        );
      }
      onClose(false);
      const newData = data.map((o) => ({ key: o.key, type: o.type || null }));
      localStorage.setItem(keySaveLocal, JSON.stringify(newData));
      return onSave(newData);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Tùy chỉnh</DialogTitle>
        <DialogContent>
          <ViewOptionTable
            dataColumnDefault={dataColumnDefault || null}
            dataColumnTable={dataColumnTable}
            callback={(e) => setData(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDone} color="primary">
            Xong
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OptionTable;
