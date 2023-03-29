/* eslint-disable camelcase */
import {
  Box,
  Button,
  Container,
  DialogActions,
  FormControl,
  // FormHelperText,
  FormControlLabel,
  FormLabel,
  OutlinedInput,
  Paper,
  Checkbox,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import useAxios from 'axios-hooks';
import PageHeader from 'components/PageHeader';
import { getErrorMessage } from 'containers/Common/function';
import Loading from 'containers/Loading/Loadable';
import { set, cloneDeep } from 'lodash';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import {
  getAreaObjectForTree,
  getAreaObjectFromTree,
  getAreaString,
} from 'utils/functions';
import { showSuccess } from 'utils/toast-utils';
import { showAlertError } from 'utils/utils';
import { CAMERA_API } from '../apiUrl';
import AreaTreeList from '../Common/AreaTree/Loadable';
import btnMsg from '../Common/Messages/button';
import { LIST_EVENTS } from './constants';
import messages from './messages';
const LIST_EVENTS_MAP = LIST_EVENTS.reduce(
  (total, cur) => ({
    ...total,
    [cur.id]: cur,
  }),
  {},
);
export default function Details(props) {
  const intl = useIntl();
  const { history, match, location } = props;
  const id = match?.params?.id;
  const [act, setAct] = useState(false);
  // const [errors, setErrors] = useState({});
  const [newData, setNewData] = useState({
    type: 'CAMERA',
    name: '',
    parent: {},
    location: {},
    config: {
      restricted_area: false,
      event_ai: null,
    },
  });
  const [{ data: getData, loading: getLoading, error: getError }] = useAxios(
    CAMERA_API.INFO(id),
    {
      useCache: false,
    },
  );
  const [
    { data: putData, loading: putLoading, error: putError },
    executePut,
  ] = useAxios(
    {
      url: CAMERA_API.EDIT(id),
      method: 'PUT',
    },
    { manual: true },
  );
  useEffect(() => {
    if (getData)
      setNewData({
        ...getData,
        location: getAreaObjectForTree(getData),
        config: {
          restricted_area: getData?.config?.restricted_area || false,
          event_ai: getData?.config?.event_ai
            ? LIST_EVENTS_MAP[(getData?.config?.event_ai)]
            : null,
        },
      });
  }, [getData]);
  useEffect(() => {
    if (putData) {
      showSuccess('Chỉnh sửa thành công');
      goBack();
    }
  }, [putData]);
  useEffect(() => {
    const err = getError || putError;
    if (err) {
      showAlertError(getErrorMessage(err), intl).then(() => {
        switch (err.response.status) {
          default:
            break;
          case 404:
            goBack();
            break;
        }
      });
    }
  }, [getError, putError]);
  const handleChange = (key, value) => {
    const newState = { ...newData };
    set(newState, key, value);
    setNewData(newState);
    // validate(newState);
  };
  // function validate(data) {
  //   const err = {};
  //   if (!data.location) {
  //     err.location = intl.formatMessage({ id: 'app.invalid.required' });
  //   }
  //   setErrors(err);
  // }
  function goBack() {
    const nvrDetail = location?.state?.nvrDetail;
    if (nvrDetail) {
      history.push(nvrDetail);
    } else {
      history.push(`/list-camera`);
    }
  }
  function handleSubmit() {
    // const invalid = Object.keys(errors).length;
    // if (!invalid) {
    const { id, location, ...other } = newData;
    const payload = cloneDeep(other);
    const obj = getAreaObjectFromTree(location);
    const event = payload?.config?.event_ai;
    if (event) {
      payload.config.event_ai = event.id;
    }
    executePut({
      data: {
        ...payload,
        ...obj,
      },
    });
    // }
  }
  return (
    <Fragment>
      <Helmet>
        <title>{intl.formatMessage(messages.detail)}</title>
        <meta name="description" content="Description of AcConfigLevel" />
      </Helmet>
      {(getLoading || putLoading) && <Loading />}
      <PageHeader
        showBackButton
        title={intl.formatMessage(messages.detail)}
        onBack={() => goBack()}
      />
      <Container
        maxWidth="sm"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Paper>
          <Box px={4} py={3}>
            <FormControl size="small" margin="dense" fullWidth disabled>
              <FormLabel>
                {intl.formatMessage({ id: 'app.column.name' })}
              </FormLabel>
              <OutlinedInput value={newData.name} disabled margin="dense" />
            </FormControl>
            <FormControl size="small" margin="dense" fullWidth disabled>
              <FormLabel>NVR</FormLabel>
              <OutlinedInput
                value={(newData.parent || {}).name}
                disabled
                margin="dense"
              />
            </FormControl>
            <FormControl
              fullWidth
              margin="dense"
              // error={act && Boolean(errors.location)}
            >
              <FormLabel>
                {intl.formatMessage({ id: 'app.column.area' })}
              </FormLabel>
              {act ? (
                <AreaTreeList
                  value={newData.location}
                  onValueChanged={newVal => {
                    handleChange('location', newVal);
                  }}
                />
              ) : (
                <OutlinedInput
                  value={getAreaString(getData)}
                  disabled
                  margin="dense"
                />
              )}
              {/* <FormHelperText>{act && errors.location}</FormHelperText> */}
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={newData.config.restricted_area}
                  onChange={e =>
                    handleChange('config.restricted_area', e.target.checked)
                  }
                  name="restricted_area"
                  disabled={!act}
                />
              }
              label="Camera thuộc khu vực cấm"
            />
            <FormControl fullWidth margin="dense">
              <FormLabel>Sự kiện AI</FormLabel>
              <Autocomplete
                id="combo-box-status"
                name="status"
                size="small"
                value={newData.config?.event_ai || null}
                disableClearable
                options={LIST_EVENTS}
                getOptionLabel={option => option.text || ''}
                getOptionSelected={(option, selected) =>
                  option.id == selected.id
                }
                renderInput={params => (
                  <OutlinedInput
                    ref={params.InputProps.ref}
                    inputProps={params.inputProps}
                    {...params.InputProps}
                    fullWidth
                    disabled={!act}
                    margin="dense"
                  />
                )}
                disabled={!act}
                onChange={(e, newVal) =>
                  handleChange('config.event_ai', newVal)
                }
                noOptionsText={intl.formatMessage({ id: 'app.no_data' })}
              />
            </FormControl>
            <DialogActions>
              {act ? (
                <Fragment>
                  <Button
                    color="default"
                    variant="contained"
                    onClick={() => setAct(false)}
                  >
                    {intl.formatMessage(btnMsg.cancel)}
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => handleSubmit()}
                  >
                    {intl.formatMessage(btnMsg.save)}
                  </Button>
                </Fragment>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => setAct(true)}
                >
                  {intl.formatMessage({ id: 'app.tooltip.edit' })}
                </Button>
              )}
            </DialogActions>
          </Box>
        </Paper>
      </Container>
    </Fragment>
  );
}
