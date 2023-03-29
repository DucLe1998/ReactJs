/* eslint-disable consistent-return */
/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import {
  FormControl,
  FormHelperText,
  OutlinedInput,
  Paper,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { TimePicker } from '@material-ui/pickers';
import DatePicker from 'components/DatePicker';
import LoadingIndicator from 'components/LoadingIndicator';
import PageHeader from 'components/PageHeader';
import UploadInput from 'components/UploadInput';
import Loading from 'containers/Loading';
import { addMinutes } from 'date-fns';
import { format } from 'date-fns/esm';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { getApi, postApi, putApi } from 'utils/requestUtils';
import { showError, showSuccess } from '../../utils/toast-utils';
import { ARTICLES_SRC } from '../apiUrl';
import CustomAutoComplete from './components/CustomAutoComplete';
// import utils, {
//   addTokenToViewTinyMceContent,
//   removeTokenBeforeUploadTinyMceContent,
// } from 'utils/utils';
import TextFieldController from './components/TextFieldController';
import { statusNewsManagement } from './data';
import { useStyles } from './styles';
import './styles.css';

const TinyEditor = React.lazy(() => import('components/CustomTextEditor'));

const Add = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [
  //   disableListNewsDisplayOrder,
  //   setDisableListNewsDisplayOrder,
  // ] = useState(true);

  const {
    handleSubmit,
    control,
    setValue,
    // watch,
    // clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  // const displayPosition = watch('displayPosition', [false, false]);

  const fetchData = async () => {
    try {
      const categoriesRes = await getApi(`${ARTICLES_SRC}/article-categories`);
      const temp = categoriesRes.data.rows.map(item => ({
        label: item.name,
        value: item.id,
      }));
      setCategories(temp);
      if (id) {
        const detailRes = await getApi(`${ARTICLES_SRC}/articles/${id}`);
        reset({
          category: {
            value: detailRes.data.categoryId,
            label: detailRes.data.categoryName,
          },
          status: {
            value: detailRes.data.status,
            label:
              statusNewsManagement.find(
                status => status.value === detailRes.data.status,
              )?.label || '',
          },
          publishedDate: detailRes.data.publishedDate,
          publishedTime: detailRes.data.publishedDate,
          displayPosition: [
            detailRes.data.isDisplayInBanner,
            detailRes.data.isDisplayInNews,
          ],
          bannerDisplayOrder: detailRes?.data?.bannerDisplayOrder || null,
          newsDisplayOrder: detailRes?.data?.newsDisplayOrder || null,
          newsListDisplayOrder: detailRes?.data?.newsListDisplayOrder || null,
          bannerDisplayFile: {
            id: detailRes.data.bannerDisplayFileId
              ? detailRes.data.bannerDisplayFileId
              : '',
            name: detailRes.data.bannerDisplayFileName
              ? detailRes.data.bannerDisplayFileName
              : detailRes.data.isDisplayInBanner
              ? 'Ảnh.png'
              : '',
          },
          newsDisplayFile: {
            id: detailRes.data.newsDisplayFileId
              ? detailRes.data.newsDisplayFileId
              : '',
            name: detailRes.data.newsDisplayFileName
              ? detailRes.data.newsDisplayFileName
              : detailRes.data.isDisplayInNews
              ? 'Ảnh đại diện.png'
              : '',
          },
          newsListDisplayFile: {
            id: detailRes.data.newsListDisplayFileId
              ? detailRes.data.newsListDisplayFileId
              : '',
            name: detailRes.data.newsListDisplayFileName
              ? detailRes.data.newsListDisplayFileName
              : detailRes.data.isDisplayInNews
              ? 'Ảnh.png'
              : '',
          },
          title: detailRes.data.title,
          news: {
            value: detailRes.data.content,
          },
        });
        // if (detailRes?.data?.newsListDisplayOrder) {
        //   setDisableListNewsDisplayOrder(false);
        // }
      } else {
        // eslint-disable-next-line no-restricted-syntax
        for (const item of temp) {
          if (item.label === 'Tin tức chung') {
            setValue('category', item);
            return;
          }
        }
      }
    } catch (error) {
      showError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const convertDate = (date, time) => {
    const d = format(date, 'MM/dd/yyyy');
    const t = format(time, 'HH:mm');
    return new Date(`${d} ${t}`).getTime();
  };

  const handleCreate = async payload => {
    setLoading(true);
    try {
      await postApi(`${ARTICLES_SRC}/articles`, payload);
      onBack();
      showSuccess('Bạn đã thêm mới tin tức thành công');
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async payload => {
    setLoading(true);
    try {
      await putApi(`${ARTICLES_SRC}/articles/${id}`, payload);
      onBack();
      showSuccess('Bạn đã cập nhật tin tức thành công');
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = data => {
    if (data?.news?.length > 1000) {
      showError('Độ dài nội dung tin tức không vượt quá 1000 ký tự');
      return null;
    }
    const payload = {
      // bannerDisplayFileId: data.bannerDisplayFile?.id,
      // bannerDisplayOrder: data.displayPosition[0]
      //   ? data.bannerDisplayOrder
      //     ? parseInt(data.bannerDisplayOrder, 10)
      //     : 1
      //   : null,
      categoryId: data.category.value,
      content: data.news.value,
      // displayInBanner: data.displayPosition[0],
      displayInNews: true,
      newsDisplayFileId: data.newsDisplayFile.id,
      newsDisplayOrder: data.newsDisplayOrder
        ? parseInt(data.newsDisplayOrder, 10)
        : 1,
      newsListDisplayFileId: data.newsListDisplayFile.id,
      newsListDisplayOrder: data.newsListDisplayOrder
        ? parseInt(data.newsListDisplayOrder, 10)
        : 1,
      status: data.status.value,
      title: data.title,
      publishedDate: convertDate(data.publishedDate, data.publishedTime),
    };
    if (id) {
      handleUpdate(_.pickBy(payload));
    } else {
      handleCreate(_.pickBy(payload));
    }
  };

  const handleChangeNewsDisplayOrder = value => {
    // setDisableListNewsDisplayOrder(!value);
    setValue('newsDisplayOrder', value);
    setValue('newsListDisplayOrder', value);
  };

  const onUploadImg = (value, field) => {
    setValue(field, value, { shouldValidate: true });
  };

  const onBack = () => {
    if (history.length > 1) {
      history.goBack();
    } else {
      history.replace('/management/app/new-management');
    }
  };

  return (
    <div className={classes.root}>
      {loading && <Loading />}
      <Helmet>
        <title>{id ? 'Cập nhật tin tức' : 'Thêm mới tin tức'}</title>
        <meta name="description" content="Description of ManageGuests" />
      </Helmet>
      <PageHeader
        showBackButton
        title={id ? 'Cập nhật tin tức' : 'Thêm mới tin tức'}
        onBack={onBack}
      >
        <div style={{ display: 'flex' }}>
          <button
            type="button"
            className={classes.button}
            onClick={onBack}
            style={{
              border: '1px solid #dddddd',
              color: 'rgba(0, 0, 0, 0.8)',
            }}
          >
            Hủy
          </button>
          <button
            form="news-management-form"
            className={classes.button}
            type="submit"
            style={{
              background: '#00554A',
              boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
              color: '#ffffff',
              marginRight: '30px',
              marginLeft: '24px',
            }}
          >
            {id ? 'Lưu' : 'Thêm mới'}
          </button>
        </div>
      </PageHeader>
      <Paper style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit(onSubmit)} id="news-management-form">
          <Grid container spacing={4}>
            {id && (
              <Grid item sm={12} md={6} lg={4} xl={3}>
                <p className={classes.label}> ID</p>
                <OutlinedInput
                  disabled
                  value={id}
                  className={classes.input}
                  fullWidth
                />
              </Grid>
            )}
            <Grid item sm={12} md={6} lg={4} xl={3}>
              <Controller
                control={control}
                name="category"
                defaultValue={{ value: '', label: '' }}
                rules={{ required: true }}
                render={props => (
                  <CustomAutoComplete
                    label="Danh mục"
                    options={categories}
                    placeholder="Chọn danh mục"
                    error={!!errors.category}
                    helperText={
                      errors.category ? 'Trường thông tin bắt buộc' : ''
                    }
                    value={props.value}
                    onChange={(e, newValue) => props.onChange(newValue)}
                  />
                )}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={4} xl={3}>
              <Controller
                control={control}
                defaultValue={{
                  value: 'DRAFT',
                  label: 'Lưu nháp',
                }}
                rules={{ required: true }}
                name="status"
                render={props => (
                  <CustomAutoComplete
                    label="Trạng thái"
                    placeholder="Trạng thái"
                    value={props.value}
                    error={!!errors.status}
                    helperText={
                      errors.status ? 'Trường thông tin bắt buộc' : ''
                    }
                    onChange={(e, newValue) => props.onChange(newValue)}
                    options={statusNewsManagement}
                  />
                )}
              />
            </Grid>
            {!id && <Grid item sm={12} md={6} lg={4} xl={3} />}
            <Grid item sm={12} md={6} lg={4} xl={3}>
              <Grid container direction="column">
                <p className={classes.label}>
                  Ngày xuất bản{<span style={{ color: 'red' }}>*</span>}
                </p>
                <Controller
                  control={control}
                  rules={{ required: true }}
                  defaultValue={new Date()}
                  name="publishedDate"
                  render={props => (
                    <FormControl>
                      <DatePicker
                        disablePast
                        minDateMessage="Ngày xuất bản không được là quá khứ"
                        placeholder="Ngày xuất bản"
                        value={props.value}
                        onChange={props.onChange}
                        variant="inline"
                      />
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
            <Grid item sm={12} md={6} lg={4} xl={3}>
              <Grid container direction="column">
                <p className={classes.label}>
                  Giờ xuất bản{<span style={{ color: 'red' }}>*</span>}
                </p>
                <Controller
                  control={control}
                  name="publishedTime"
                  defaultValue={addMinutes(new Date(), 2)}
                  rules={{ required: true }}
                  render={props => (
                    <TimePicker
                      value={props.value}
                      format="HH:mm"
                      onChange={props.onChange}
                      inputVariant="outlined"
                      variant="inline"
                    />
                  )}
                />
              </Grid>
            </Grid>
            {/* <Grid item sm={12} md={6} lg={4} xl={3}> */}
            {/* <Grid container direction="column">
                <p className={classes.label}>
                  Vị trí trên ứng dụng - Home (Nâng cao)
                  {<span style={{ color: 'red' }}>*</span>}
                </p>
                <Controller
                  control={control}
                  rules={{
                    validate: value => value[0] || value[1],
                  }}
                  defaultValue={[false, false]}
                  name="displayPosition"
                  render={props => (
                    <FormControl fullWidth error={!!errors.displayPosition}>
                      <Grid
                        container
                        spacing={2}
                        className={classes.displayPosition}
                      >
                        <Grid item xs={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={props.value[0]}
                                onChange={e => {
                                  const { value } = props;
                                  value[0] = e.target.checked;
                                  if (!value[0]) {
                                    setValue('bannerDisplayOrder', '');
                                    setValue('bannerDisplayFile', {
                                      id: '',
                                      name: '',
                                    });
                                    clearErrors('bannerDisplayFile');
                                  }
                                  props.onChange([...value]);
                                }}
                                color="primary"
                              />
                            }
                            label="Home - Banner"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={props.value[1]}
                                onChange={e => {
                                  const { value } = props;
                                  value[1] = e.target.checked;
                                  if (!value[1]) {
                                    setValue('newsDisplayOrder', '');
                                    setValue('newsListDisplayOrder', '');
                                    setValue('newsDisplayFile', {
                                      id: '',
                                      name: '',
                                    });
                                    setValue('newsListDisplayFile', {
                                      id: '',
                                      name: '',
                                    });
                                    clearErrors('newsDisplayFile');
                                    clearErrors('newsListDisplayFile');
                                  }
                                  props.onChange([...value]);
                                }}
                                color="primary"
                              />
                            }
                            label="Home - tin tức"
                          />
                        </Grid>
                        {errors.displayPosition && (
                          <FormHelperText>
                            Trường thông tin bắt buộc
                          </FormHelperText>
                        )}
                      </Grid>
                    </FormControl>
                  )}
                />
              </Grid> */}
            {/* </Grid> */}
            {/* <Grid item sm={12} md={6} lg={4} xl={3}>
              <TextFieldController
                type="number"
                control={control}
                disabled={!displayPosition[0]}
                label="Thứ tự hiển thị tại Banner"
                placeholder="Thứ tự hiển thị tại Banner"
                name="bannerDisplayOrder"
              />
            </Grid> */}
            <Grid item sm={12} md={6} lg={4} xl={3}>
              <TextFieldController
                type="number"
                // disabled={!displayPosition[1]}
                control={control}
                label="Thứ tự hiển thị tại mục tin tức"
                handleChange={handleChangeNewsDisplayOrder}
                placeholder="Thứ tự hiển thị tại mục tin tức"
                name="newsDisplayOrder"
              />
            </Grid>
            {/* <Grid item sm={12} md={6} lg={4} xl={3}>
              <TextFieldController
                type="number"
                control={control}
                disabled={disableListNewsDisplayOrder}
                placeholder="Thứ tự trong danh sách tin tức"
                label="Thứ tự trong danh sách tin tức"
                name="newsListDisplayOrder"
              />
            </Grid> */}
            {/* <Grid item sm={12} md={6} lg={4} xl={3} /> */}
            {/* <Grid item sm={12} md={6} lg={4} xl={3}>
              <Controller
                control={control}
                rules={{
                  validate: value => {
                    if (!!value.id || !displayPosition[0]) {
                      return true;
                    }
                    return false;
                  },
                }}
                defaultValue={{
                  id: '',
                  name: '',
                }}
                name="bannerDisplayFile"
                render={props => (
                  <UploadInput
                    label="Ảnh đại diện Banner (PNG, JPG - max 2MB)"
                    onUpload={value => onUploadImg(value, 'bannerDisplayFile')}
                    value={props.value.name}
                    placeholder="Ảnh đại diện Banner"
                    error={!!errors.bannerDisplayFile}
                    disabled={!displayPosition[0]}
                  />
                )}
              />
            </Grid> */}
            <Grid item sm={12} md={6} lg={4} xl={3}>
              <Controller
                control={control}
                rules={{
                  validate: value => {
                    if (
                      value.id
                      // || !displayPosition[1]
                    ) {
                      return true;
                    }
                    return false;
                  },
                }}
                defaultValue={{
                  id: '',
                  name: '',
                }}
                name="newsDisplayFile"
                render={props => (
                  <UploadInput
                    label="Ảnh đại diện tin tức (PNG, JPG - max 2MB)"
                    onUpload={value => onUploadImg(value, 'newsDisplayFile')}
                    value={props.value.name}
                    placeholder="Ảnh đại diện tin tức"
                    error={!!errors.newsDisplayFile}
                    // disabled={!displayPosition[1]}
                  />
                )}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={4} xl={3}>
              <Controller
                control={control}
                rules={{
                  validate: value => {
                    if (
                      value.id
                      //  || !displayPosition[1]
                    ) {
                      return true;
                    }
                    return false;
                  },
                }}
                defaultValue={{
                  id: '',
                  name: '',
                }}
                name="newsListDisplayFile"
                render={props => (
                  <UploadInput
                    label="Ảnh minh họa tin tức (PNG, JPG - max 2MB)"
                    onUpload={value =>
                      onUploadImg(value, 'newsListDisplayFile')
                    }
                    value={props.value.name}
                    placeholder="Ảnh minh họa tin tức"
                    error={!!errors.newsListDisplayFile}
                    // disabled={!displayPosition[1]}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextFieldController
                error={!!errors.title}
                control={control}
                label="Tiêu đề tin tức"
                placeholder="Nhập tiêu đề..."
                name="title"
                required
                maxLength={100}
              />
            </Grid>
            <React.Suspense fallback={<LoadingIndicator />}>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  defaultValue={{ value: '', length: 0 }}
                  rules={{
                    validate: value => {
                      if (!value.length) {
                        return 'Trường thông tin bắt buộc';
                      }
                      // if (value.length > 1000) {
                      //   return 'Độ dài vượt quá 1000 kí tự';
                      // }
                      return true;
                    },
                  }}
                  name="news"
                  render={props => (
                    <FormControl error={Boolean(errors.news)} fullWidth>
                      <Grid container direction="column">
                        <p className={classes.label}>
                          Nội dung tin tức ({props.value?.length}/1000)
                          {<span style={{ color: 'red' }}>*</span>}
                        </p>
                        <TinyEditor
                          error={errors.news}
                          value={props.value.value}
                          onChangeValue={props.onChange}
                          // sizelimit={1000}
                        />
                      </Grid>
                      {Boolean(errors.news) && (
                        <FormHelperText>
                          {Boolean(errors?.news?.message) &&
                            errors?.news?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </React.Suspense>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default Add;
