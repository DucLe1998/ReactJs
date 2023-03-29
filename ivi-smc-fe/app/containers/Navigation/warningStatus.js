import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  OutlinedInput,
  DialogActions,
  DialogContent,
  Button,
} from '@material-ui/core';
const STATUS_LIST = [
  { id: 'PENDING', label: 'Chưa xử lý' }, // Chua xu ly
  { id: 'PROCESSING', label: 'Đang xử lý' }, // Dang xu ly
  { id: 'FINISHED', label: 'Đã xử lý' },
];
export default function WarningStatus({ initValue, onSubmit }) {
  const [data, setData] = useState({
    note: '',
    status: initValue.status,
  });
  return (
    <>
      <DialogContent>
        <FormControl fullWidth>
          <FormLabel>Trạng thái</FormLabel>
          <RadioGroup
            value={data.status}
            onChange={(e) => setData({ ...data, status: e.target.value })}
          >
            {React.Children.toArray(
              STATUS_LIST.map((item) => (
                <FormControlLabel
                  value={item.id}
                  control={<Radio color="primary" />}
                  label={item.label}
                />
              )),
            )}
          </RadioGroup>
        </FormControl>
        <FormControl fullWidth>
          <FormLabel>Ghi chú</FormLabel>
          <OutlinedInput
            multiline
            rows={4}
            placeholder="Nhập ghi chú"
            value={data.note}
            onChange={(e) => setData({ ...data, note: e.target.value })}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => onSubmit(0)}>
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSubmit(data)}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </>
  );
}
