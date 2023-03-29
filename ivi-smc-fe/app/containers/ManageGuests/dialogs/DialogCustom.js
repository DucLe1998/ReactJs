/* eslint-disable import/no-unresolved */
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormGroup,
} from '@material-ui/core';
import React, { useState } from 'react';
export default function DialogCustom({
  handleCloseCustom,
  onSuccess,
  initialValues,
}) {
  const [data, setData] = useState(initialValues);
  const handleCustomChange = (event) => {
    const newdata = { ...data };
    newdata[event.target.name].display = event.target.checked;
    setData({ ...newdata });
  };
  return (
    <>
      <DialogContent>
        {Object.keys(data).map((x) => (
          <FormGroup key={x}>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={data[x].display}
                  disabled={data[x].require}
                  onChange={handleCustomChange}
                  name={x}
                  sx={{
                    '& .MuiSvgIcon-root': { fontSize: 28 },
                  }}
                />
              }
              label={data[x].label}
            />
          </FormGroup>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseCustom} variant="contained">
          Hủy
        </Button>
        <Button
          onClick={() => onSuccess(data)}
          variant="contained"
          color="primary"
        >
          Xong
        </Button>
      </DialogActions>
    </>
  );
}
