import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormLabel,
  ListItemText,
} from '@material-ui/core';
import VAutocomplete from 'components/VAutocomplete';
import React, { useState } from 'react';
import { getApi } from 'utils/requestUtils';
import { API_IAM } from '../../apiUrl';
export function AddAuthorities({ policies = [], onSubmit }) {
  const [data, setData] = useState(null);
  return (
    <>
      <DialogContent>
        <FormControl size="small" margin="dense" fullWidth>
          <FormLabel>Vai trò</FormLabel>
          <VAutocomplete
            itemSize={68}
            value={data}
            fullWidth
            placeholder="Vai trò"
            getOptionLabel={(option) => option?.policyName || ''}
            loadData={(page, keyword) =>
              new Promise((resolve, reject) => {
                const params = {
                  keyword,
                  limit: 50,
                  page,
                };
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
            renderOption={(option) => (
              <ListItemText
                primary={option.policyName}
                secondary={option.policyCode}
              />
            )}
            getOptionDisabled={(option) => {
              const found = policies.find(
                (item) => item.policyId == option.policyId,
              );
              return Boolean(found);
            }}
            onChange={(e, value) => {
              setData(value);
            }}
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
          disabled={!data}
        >
          Thêm
        </Button>
      </DialogActions>
    </>
  );
}

export default AddAuthorities;
