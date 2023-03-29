/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import { OutlinedInput, Paper } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import PopupDelete from 'components/Custom/popup/PopupDelete';
import PageHeader from 'components/PageHeader';
import Loading from 'containers/Loading';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ReactHtmlParser from 'react-html-parser';
import { Link, useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { delApi, getApi } from 'utils/requestUtils';
// import { addTokenToViewTinyMceContent } from 'utils/utils';
import { showError, showSuccess } from '../../utils/toast-utils';
import { ARTICLES_SRC } from '../apiUrl';
import { statusNewsManagement } from './data';
import { useStyles } from './styles';
// import './styles.css';
const ContentContainer = styled.div`
  img {
    max-width: 100%;
    height: auto;
  }
`;
const Add = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getApi(`${ARTICLES_SRC}/articles/${id}`);
      setDetail(res.data);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onBack = () => {
    history.replace('/management/app/new-management');
  };

  const handleDeleteNews = async () => {
    setLoading(true);
    try {
      await delApi(`${ARTICLES_SRC}/articles/${id}`);
      onBack();
      showSuccess('Xóa tin tức thành công');
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      {loading && <Loading />}
      <Helmet>
        <title>Chi tiết tin tức</title>
        <meta name="description" content="Description of ManageGuests" />
      </Helmet>
      <PageHeader showBackButton title="Chi tiết tin tức" onBack={onBack}>
        <div style={{ display: 'flex' }}>
          <button
            type="button"
            className={classes.button}
            onClick={() => setIsOpenDelete(true)}
            style={{
              border: '1px solid #dddddd',
              background: '#FF0000',
              color: '#ffffff',
            }}
          >
            Xóa tin tức
          </button>
          {detail?.status != 'PUBLISHED' && (
            <Link to={`/management/app/new-management/${id}/edit`}>
              <button
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
                Cập nhật
              </button>
            </Link>
          )}
        </div>
      </PageHeader>
      <Paper style={{ padding: '32px' }}>
        <Grid container spacing={4}>
          {/* <Grid item sm={12} md={6} lg={4} xl={3}>
            <p className={classes.label}> ID</p>
            <OutlinedInput
              disabled
              value={detail?.id || ''}
              className={classes.input}
              fullWidth
            />
          </Grid> */}
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <p className={classes.label}> Thời gian tạo</p>
            <OutlinedInput
              disabled
              value={
                detail?.createdAt
                  ? format(detail.createdAt, 'HH:mm:ss dd/MM/yyyy')
                  : ''
              }
              className={classes.input}
              fullWidth
            />
          </Grid>
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <p className={classes.label}> Danh mục</p>
            <OutlinedInput
              disabled
              value={detail?.categoryName ? detail.categoryName : ''}
              className={classes.input}
              fullWidth
            />
          </Grid>
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <p className={classes.label}> Trạng thái</p>
            <OutlinedInput
              disabled
              value={
                detail?.status
                  ? statusNewsManagement.find(
                      status => status.value === detail.status,
                    )?.label
                  : ''
              }
              className={classes.input}
              fullWidth
            />
          </Grid>
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <p className={classes.label}> Thời gian xuất bản</p>
            <OutlinedInput
              disabled
              value={
                detail?.publishedDate
                  ? format(detail.publishedDate, 'HH:mm:ss dd/MM/yyyy')
                  : ''
              }
              className={classes.input}
              fullWidth
            />
          </Grid>
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <p className={classes.label}> Thời gian cập nhật gần nhất</p>
            <OutlinedInput
              disabled
              value={
                detail?.updatedAt ? format(detail.updatedAt, 'dd/MM/yyyy') : ''
              }
              className={classes.input}
              fullWidth
            />
          </Grid>
          {/* <Grid item xs={12}>
            <p className={classes.configTitle}>
              Cấu hình hiển thị trên ứng dụng
            </p>
          </Grid>
          <Grid item xs={4}>
            <Grid container direction="column">
              <p className={classes.label}>
                Vị trí trên ứng dụng - Home (Nâng cao)
              </p>
              <Grid container spacing={2} className={classes.displayPosition}>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          detail?.isDisplayInBanner
                            ? detail.isDisplayInBanner
                            : false
                        }
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
                        checked={
                          detail?.isDisplayInNews
                            ? detail.isDisplayInNews
                            : false
                        }
                        color="primary"
                      />
                    }
                    label="Home - tin tức"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid> */}
          {/* <Grid item sm={12} md={6} lg={4} xl={3}>
            <p className={classes.label}> Thứ tự hiển thị tại Banner</p>
            <OutlinedInput
              disabled
              value={
                detail?.bannerDisplayOrder ? detail.bannerDisplayOrder : ''
              }
              className={classes.input}
              fullWidth
            />
          </Grid> */}
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <p className={classes.label}> Thứ tự hiển thị tại mục Tin tức</p>
            <OutlinedInput
              disabled
              value={detail?.newsDisplayOrder ? detail.newsDisplayOrder : ''}
              className={classes.input}
              fullWidth
            />
          </Grid>
          {/* <Grid item sm={12} md={6} lg={4} xl={3}>
            <p className={classes.label}> Thứ tự trong danh sách Tin tức</p>
            <OutlinedInput
              disabled
              value={
                detail?.newsListDisplayOrder ? detail.newsListDisplayOrder : ''
              }
              className={classes.input}
              fullWidth
            />
          </Grid> */}
          {/* <Grid item sm={12} md={6} lg={4} xl={3}>
            <p className={classes.label}> Ảnh đại diện Banner</p>
            <OutlinedInput
              disabled
              value={
                detail?.bannerDisplayFileName
                  ? detail.bannerDisplayFileName
                  : 'API chưa trả tên'
              }
              className={classes.input}
              fullWidth
            />
          </Grid> */}
        </Grid>
        <Grid container spacing={4}>
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <p className={classes.label}> Ảnh đại diện mục Tin tức</p>
            <img
              src={detail?.newsDisplayFileUrl}
              style={{ maxWidth: '100%' }}
              alt="anh dai dien"
            />
          </Grid>
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <p className={classes.label}> Ảnh minh họa tin tức</p>
            <img
              src={detail?.newsListDisplayFileUrl}
              style={{ maxWidth: '100%' }}
              alt="anh dai dien"
            />
          </Grid>
          <Grid item xs={12}>
            <p className={classes.title}>{detail?.title ? detail.title : ''}</p>
          </Grid>
          <Grid item xs={12}>
            <ContentContainer>
              {ReactHtmlParser(detail?.content)}
            </ContentContainer>
          </Grid>
        </Grid>
      </Paper>
      {isOpenDelete && (
        <PopupDelete
          onClickSave={() => {
            handleDeleteNews();
          }}
          onClose={v => setIsOpenDelete(v)}
          typeTxt="tin tức"
          noteTxt={() => (
            <div style={{ marginTop: 12 }}>
              <span className="color-red">Lưu ý:</span>
              Tin tức đã xoá sẽ không thể phục hồi và không còn hiển thị trên
              ứng dụng
            </div>
          )}
        />
      )}
    </div>
  );
};

export default Add;
