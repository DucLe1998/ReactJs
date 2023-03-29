import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  OutlinedInput,
  Paper,
  Typography,
  Container,
  List,
  ListItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { Autocomplete, Pagination } from '@material-ui/lab';
import useAxios from 'axios-hooks';
// import Label from 'components/Label';
import PageHeader from 'components/PageHeader';
import { FEEDBACK_API } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import { format, isSameDay, isSameYear } from 'date-fns';
import { useFormik } from 'formik';
// import faker from 'faker';
import { isEmpty, set } from 'lodash';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { showError, showSuccess } from 'utils/toast-utils';
import { buildUrlWithToken } from 'utils/utils';
import * as yup from 'yup';
import NotFound from 'images/no-image.png';
import styled from 'styled-components';
import {
  STATUS_LIST,
  STATUS_LIST_MAP,
  TYPE_LIST,
  TYPE_LIST_MAP,
} from './constants';
import messages from './messages';
const useStyles = makeStyles(theme => ({
  historyItem: {
    flexDirection: 'column',
  },
  historyTop: {
    marginBottom: theme.spacing(2),
  },
}));
const ImgContainer = styled.div`
  width: 450px;
  margin-right: 16px;
  .image-gallery {
    width: 100%;
    height: auto;
  }

  .image-gallery-slide img {
    height: 450px;
  }
  .image-gallery-thumbnail .image-gallery-thumbnail-image {
    height: 82px;
    object-fit: contain;
  }

  .fullscreen .image-gallery-slide img {
    height: 100%;
    max-height: 100vh;
  }
`;
export default function Details(props) {
  const intl = useIntl();
  const classes = useStyles();
  const { history, match, location } = props;
  const id = match?.params?.id;
  const [info, setInfo] = useState(null);
  const [page, setPage] = useState(1);
  const [statusList, setStatusList] = useState(STATUS_LIST);
  const params = {
    limit: 5,
    sort: '-createdAt',
  };
  function goBack() {
    history.push({ pathname: '/feedback', state: location.state });
  }
  const validationSchema = yup.object({
    content: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' }))
      // eslint-disable-next-line no-template-curly-in-string
      .max(
        255,
        intl.formatMessage({ id: 'app.invalid.maxLength' }, { max: 255 }),
      ),
  });

  const [{ data: getData, loading: getLoading, error: getError }] = useAxios(
    FEEDBACK_API.INFO(id),
    {
      useCache: false,
    },
  );
  useEffect(() => {
    if (getData) {
      const state = {
        ...getData,
        type: TYPE_LIST_MAP[getData.type],
        status: STATUS_LIST_MAP[getData.status],
      };
      setInfo(state);
      setStatusList(STATUS_LIST.filter(v => v.level >= state.status.level));
    }
  }, [getData]);
  const [
    { data: putData, loading: putLoading, error: putError },
    executePut,
  ] = useAxios(
    {
      url: FEEDBACK_API.REPLY(id),
      method: 'POST',
    },
    { manual: true },
  );
  useEffect(() => {
    if (putData) {
      showSuccess('Chỉnh sửa thành công');
      goBack();
    }
  }, [putData]);
  const [
    { data: getHistory, loading: getHistoryLoading, error: getHistoryError },
    executeGetHistory,
  ] = useAxios(FEEDBACK_API.HISTORY, {
    manual: true,
  });
  useEffect(() => {
    if (getData) {
      executeGetHistory({
        params: {
          ...params,
          page,
          id,
        },
      });
    }
  }, [getData, page]);
  useEffect(() => {
    if (getError) showError(getError);
  }, [getError]);
  useEffect(() => {
    if (putError) showError(putError);
  }, [putError]);
  useEffect(() => {
    if (getHistoryError) showError(getHistoryError);
  }, [getHistoryError]);

  const formik = useFormik({
    initialValues: {
      content: '',
    },
    validationSchema,
    onSubmit: values => {
      executePut({
        data: {
          ...values,
          type: info.type.id,
          status: info.status.id,
        },
      });
    },
  });
  const onSaveBtnClick = () => {
    formik.handleSubmit();
  };

  const handleChange = (key, value) => {
    const newState = { ...info };
    set(newState, key, value);
    setInfo(newState);
  };
  const ItemWrapper = ({ updatedAt, status, content, fullname = 'Admin' }) => {
    const statusObj = STATUS_LIST_MAP[status];
    const today = new Date();
    const date = new Date(updatedAt);
    let formatString = 'HH:mm dd/MM/yyyy';
    if (isSameDay(date, today)) formatString = 'HH:mm';
    else if (isSameYear(date, today)) formatString = 'HH:mm dd/MM';
    return (
      <ListItem
        divider
        disableGutters
        alignItems="flex-start"
        classes={{ root: classes.historyItem }}
      >
        <div className={classes.historyTop}>
          <Typography variant="h6" component="div">
            {fullname}
          </Typography>
          <Typography color="textSecondary" variant="caption" component="span">
            Trạng thái: {statusObj.text} &bull;&nbsp;
            {format(date, formatString)}
          </Typography>
        </div>
        {content && (
          <Typography color="textPrimary" component="p" variant="subtitle1">
            {content}
          </Typography>
        )}
      </ListItem>
    );
  };

  return (
    <Fragment>
      <Helmet>
        <title>{intl.formatMessage(messages.detail)}</title>
        <meta name="description" content="Description of AcConfigLevel" />
      </Helmet>
      {(getLoading || putLoading || getHistoryLoading) && <Loading />}
      <PageHeader
        showBackButton
        title={intl.formatMessage(messages.detail)}
        onBack={() => goBack()}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={onSaveBtnClick}
          disabled={isEmpty(info)}
        >
          Gửi
        </Button>
      </PageHeader>
      <Container maxWidth="lg">
        {!isEmpty(info) && (
          <Paper style={{ padding: '16px', display: 'flex' }}>
            {info.evidences.length > 0 && (
              <ImgContainer>
                <ImageGallery
                  showBullets={info.evidences.length > 1}
                  showPlayButton={false}
                  showThumbnails={info.evidences.length > 1}
                  onErrorImageURL={NotFound}
                  items={info.evidences.map(i => ({
                    original: buildUrlWithToken(i.evidenceUrl),
                    thumbnail: buildUrlWithToken(i.evidenceUrl),
                  }))}
                />
              </ImgContainer>
            )}
            <div style={{ flex: 1 }}>
              <Typography component="div" variant="h4">
                {info?.title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                component="div"
              >
                {info?.username} &bull;&nbsp;
                {format(info?.createdAt, 'HH:mm dd/MM/yyyy')}
              </Typography>
              <Typography
                variant="body1"
                component="p"
                style={{ margin: '16px 0' }}
              >
                {info?.content}
              </Typography>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <FormControl fullWidth margin="dense">
                  <FormLabel>Phân loại góp ý</FormLabel>
                  <Autocomplete
                    id="combo-box-type"
                    size="small"
                    value={info.type}
                    options={TYPE_LIST}
                    getOptionLabel={option => option.name || ''}
                    getOptionSelected={(option, value) => option.id == value.id}
                    renderInput={params => (
                      <OutlinedInput
                        ref={params.InputProps.ref}
                        inputProps={params.inputProps}
                        {...params.InputProps}
                        fullWidth
                        margin="dense"
                      />
                    )}
                    onChange={(e, newVal) => handleChange('type', newVal)}
                    noOptionsText={intl.formatMessage({
                      id: 'app.no_data',
                    })}
                  />
                </FormControl>
                <FormControl fullWidth margin="dense">
                  <FormLabel>
                    {intl.formatMessage({ id: 'app.column.status' })}
                  </FormLabel>
                  <Autocomplete
                    id="combo-box-status"
                    size="small"
                    value={info.status}
                    options={statusList}
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
                        margin="dense"
                      />
                    )}
                    onChange={(e, newVal) => handleChange('status', newVal)}
                    noOptionsText={intl.formatMessage({
                      id: 'app.no_data',
                    })}
                  />
                </FormControl>
              </div>
              <FormControl
                fullWidth
                size="small"
                margin="dense"
                error={formik.touched.content && Boolean(formik.errors.content)}
              >
                <FormLabel required>
                  Nội dung phản hồi ({formik.values.content.length}/255)
                </FormLabel>
                <OutlinedInput
                  multiline
                  name="content"
                  rows={4}
                  placeholder="Nhập nội dung phản hồi"
                  value={formik.values.content}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormHelperText>
                  {formik.touched.content && formik.errors.content}
                </FormHelperText>
              </FormControl>
              {(getHistory?.count || 0) > 0 && (
                <div>
                  <List>
                    <ListItem divider disableGutters alignItems="flex-start">
                      <Typography variant="h6" component="div">
                        Phản hồi ({getHistory?.count})
                      </Typography>
                    </ListItem>
                    {React.Children.toArray(
                      getHistory.rows.map(item => <ItemWrapper {...item} />),
                    )}
                  </List>
                  {(getHistory?.totalPage || 0) > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                      <Pagination
                        showFirstButton
                        showLastButton
                        count={getHistory.totalPage}
                        page={page}
                        color="primary"
                        onChange={(e, val) => setPage(val)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Paper>
        )}
      </Container>
    </Fragment>
  );
}
