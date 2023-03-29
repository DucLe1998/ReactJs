import {
  Box,
  Button,
  DialogActions,
  FormControl,
  FormHelperText,
  FormLabel,
  OutlinedInput,
  Paper,
  Tab,
  Tooltip,
  Typography,
} from '@material-ui/core';
import * as colors from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import HistoryIcon from '@material-ui/icons/History';
import InfoIcon from '@material-ui/icons/Info';
import {
  Autocomplete,
  TabContext,
  TabList,
  TabPanel,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@material-ui/lab';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import React, { useState, Fragment } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import Label from 'components/Label';
import { getAreaString } from 'utils/functions';
import btnMsg from '../Common/Messages/button';
import { WARNING_STATUS } from './constants';
import messages from './messages';

const WARNING_STATUS_MAP = WARNING_STATUS.reduce(
  (total, cur) => ({
    ...total,
    [cur.id]: cur,
  }),
  {},
);
const useStyles = makeStyles(() => ({
  note: {
    marginTop: '5px',
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': 4,
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
  },
}));

const LabelRenderer = ({ icon, text }) => (
  <Box display="flex" alignItems="center">
    {icon}
    <Box ml={1}>{text}</Box>
  </Box>
);

export default function Details(props) {
  const { formatMessage } = useIntl();
  const classes = useStyles();
  const { data, onSubmit } = props;
  const validationSchema = yup.object({
    description: yup
      .string('Ghi chú')
      .trim()
      .required(formatMessage({ id: 'app.invalid.required' }))
      // eslint-disable-next-line no-template-curly-in-string
      .max(255, formatMessage({ id: 'app.invalid.maxLength' }, { max: 255 })),
  });
  const historyData = [...(data.event_history_change_dtos || [])].concat([
    {
      atts: data.atts,
      description: data.description,
      status: data.status,
    },
  ]);
  const formik = useFormik({
    initialValues: {
      ids: [data.id],
      status: WARNING_STATUS_MAP[data.status],
      description: '',
    },
    validationSchema,
    onSubmit: values => {
      onSubmit(values);
    },
  });
  const [tabIndex, setTabIndex] = useState('1');
  const [act, setAct] = useState(false);
  const handleTabChange = (e, idx) => setTabIndex(idx);
  const ItemWrapper = ({ atts, status, description }) => {
    const statusObj = WARNING_STATUS_MAP[status];
    return (
      <TimelineItem>
        <TimelineOppositeContent>
          <Typography>{format(atts, 'HH:mm dd/MM/yyyy')}</Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot
            style={{ backgroundColor: colors[statusObj.color][500] }}
          />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3}>
            <Box px={2} py={1}>
              <Label
                color={statusObj.color}
                text={formatMessage(statusObj.text)}
                variant="ghost"
              />
              {description && (
                <Tooltip title={description} arrow placement="left">
                  <Typography color="textSecondary" className={classes.note}>
                    {description}
                  </Typography>
                </Tooltip>
              )}
            </Box>
          </Paper>
        </TimelineContent>
      </TimelineItem>
    );
  };
  return (
    <TabContext value={tabIndex}>
      <TabList
        onChange={handleTabChange}
        centered
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab
          label={
            <LabelRenderer
              icon={<InfoIcon />}
              text={formatMessage(messages.detail)}
            />
          }
          value="1"
        />
        <Tab
          label={
            <LabelRenderer
              icon={<HistoryIcon />}
              text={formatMessage(messages.history)}
            />
          }
          value="2"
        />
      </TabList>
      <TabPanel value="1">
        <form>
          <FormControl size="small" margin="dense" fullWidth disabled>
            <FormLabel>{formatMessage(messages.column_deviceName)}</FormLabel>
            <OutlinedInput
              value={data.device_res_dto.name}
              disabled
              margin="dense"
            />
          </FormControl>
          <FormControl size="small" margin="dense" fullWidth disabled>
            <FormLabel>{formatMessage(messages.column_deviceType)}</FormLabel>
            <OutlinedInput
              value={data.device_res_dto.type}
              disabled
              margin="dense"
            />
          </FormControl>
          <FormControl size="small" margin="dense" fullWidth disabled>
            <FormLabel>{formatMessage(messages.column_warningType)}</FormLabel>
            <OutlinedInput
              value={data.type_value_str}
              disabled
              margin="dense"
            />
          </FormControl>
          <FormControl size="small" margin="dense" fullWidth disabled>
            <FormLabel>{formatMessage({ id: 'app.column.area' })}</FormLabel>
            <OutlinedInput
              value={getAreaString(data.device_res_dto)}
              disabled
              margin="dense"
            />
          </FormControl>
          <FormControl fullWidth margin="dense">
            <FormLabel>{formatMessage({ id: 'app.column.status' })}</FormLabel>
            <Autocomplete
              id="combo-box-status"
              name="status"
              size="small"
              value={formik.values.status}
              disableClearable
              options={WARNING_STATUS}
              getOptionLabel={option => formatMessage(option.text) || ''}
              getOptionSelected={(option, selected) => option.id == selected.id}
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
              onChange={(e, newVal) => formik.setFieldValue('status', newVal)}
              noOptionsText={formatMessage({ id: 'app.no_data' })}
            />
          </FormControl>
          {act ? (
            <FormControl
              size="small"
              margin="dense"
              fullWidth
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
            >
              <FormLabel required>
                {formatMessage(messages.column_description)}
              </FormLabel>
              <OutlinedInput
                margin="dense"
                multiline
                rows={4}
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormHelperText>
                {formik.touched.description && formik.errors.description}
              </FormHelperText>
            </FormControl>
          ) : (
            <FormControl size="small" margin="dense" fullWidth>
              <FormLabel required>
                {formatMessage(messages.column_description)}
              </FormLabel>
              <OutlinedInput
                margin="dense"
                multiline
                rows={4}
                name="description"
                value={data.description}
                disabled
              />
              <FormHelperText />
            </FormControl>
          )}

          <DialogActions>
            {act ? (
              <Fragment>
                <Button
                  color="default"
                  variant="contained"
                  onClick={() => setAct(false)}
                >
                  {formatMessage(btnMsg.cancel)}
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => formik.handleSubmit()}
                >
                  {formatMessage(btnMsg.save)}
                </Button>
              </Fragment>
            ) : (
              <Fragment>
                <Button
                  color="default"
                  variant="contained"
                  onClick={() => onSubmit(0)}
                >
                  {formatMessage(btnMsg.close)}
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => setAct(true)}
                >
                  {formatMessage({ id: 'app.tooltip.edit' })}
                </Button>
              </Fragment>
            )}
          </DialogActions>
        </form>
      </TabPanel>
      <TabPanel value="2" style={{ padding: 0, height: '65vh' }}>
        <Timeline align="alternate">
          {React.Children.toArray(
            historyData.reverse().map(item => <ItemWrapper {...item} />),
          )}
        </Timeline>
      </TabPanel>
    </TabContext>
  );
}
