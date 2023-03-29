/**
 *
 * ListUserCameraAi
 *
 */

import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import styled from 'styled-components';
import NotFoundImage from 'images/NotFound.svg';
import ScrollView from 'devextreme-react/scroll-view';
import { showError } from 'utils/toast-utils';
import { getApi, postApi } from 'utils/requestUtils';
import { API_CAMERA_AI } from 'containers/apiUrl';
import { Grid } from '@material-ui/core';
import { useIntl } from 'react-intl';
import axios from 'axios';
import reducer from './reducer';
import saga from './saga';
import makeSelectListUserCameraAi from './selectors';
import {
  loadSearchHistory,
  loadUserDetectedEvent,
  loadFileImageSearch,
  loadUserDetectedImage,
} from './actions';
import Loading from '../Loading';
import ModalImage from './items/ModalImage';
import PageHeader from './items/CustomePageHeader';
import { DetailCardUser } from './items/DetailCardUser';
import messages from './messages';

const key = 'listUserCameraAi';
const initialParams = {
  keyword: '', // for search text
  file: null, // for search image
  limit: 50,
  page: 1,
};

export function ListUserCameraAi() {
  const intl = useIntl();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [searchParams, setSearchParams] = useState(initialParams);
  const [showModalImage, setShowModalImage] = useState(null);
  const [reload, setReload] = useState(0);

  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSearch = value => {
    const newParams = { ...searchParams, ...value };
    setReload(reload + 1);
    setSearchParams(newParams);
  };

  const handlePageSize = e => {
    if (!e || !e.target) return;
    // const { value } = e.target;
    const newParams = {
      ...searchParams,
      page: initialParams.page,
      limit: e.target.value,
    };
    setSearchParams(newParams);
  };

  const handleChangePageIndex = pageIndex => {
    if (!pageIndex) return;
    const newParams = { ...searchParams, page: pageIndex };
    setSearchParams(newParams);
  };

  const fetchDataByText = async () => {
    setLoading(true);
    try {
      const payload = {
        keyword: searchParams.keyword,
        limit: searchParams.limit,
        page: searchParams.page,
      };
      const res = await getApi(API_CAMERA_AI.SEARCH_AUTOCOMPLETE_3_10, payload);
      setUsers(res.data);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataByImage = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', searchParams.file);
      const params = {
        limit: searchParams.limit,
        page: searchParams.page,
      };
      const res = await axios.post(
        API_CAMERA_AI.SEARCH_USER_DETECTED_BY_IMAGE_3_10,
        formData,
        {
          params,
        },
      );
      setUsers(res.data);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = () => {
    if (searchParams.file === null) {
      // search by text
      fetchDataByText();
    } else {
      // search by image
      fetchDataByImage();
    }
  };

  useEffect(() => {
    if (reload > 0) {
      fetchData();
    }
  }, [searchParams]);

  return (
    <Fragment>
      <React.Fragment>
        {loading && <Loading />}
        {showModalImage && (
          <ModalImage
            onClose={() => {
              setShowModalImage(null);
            }}
            imageUrl={showModalImage}
          />
        )}

        <Container>
          <PageHeader
            onSearch={onSearch}
            setReload={setReload}
            reload={reload}
            pageIndex={searchParams.page}
            totalCount={users?.count || 0}
            rowsPerPage={searchParams.limit}
            handlePageSize={handlePageSize}
            handleChangePageIndex={handleChangePageIndex}
          />
          {users && (
            <ScrollView width="100%" height="calc(100vh - 160px)">
              <ContentContainer>
                {listDetectedEvent(users)}
                {users?.count === 0 &&
                  notFoundPage(intl.formatMessage(messages.not_found_text))}
              </ContentContainer>
            </ScrollView>
          )}
        </Container>
      </React.Fragment>
    </Fragment>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`;
const ContentContainer = styled.div`
  max-height: 'calc(100vh - 160px)';
  background: #ffffff;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  padding: 20px 35px;
`;
// const ContentHeader = styled.div``;
const ContentContent = styled.div`
  width: 100%;
  background-color: #fff;
`;

const notFoundPage = text => (
  <div
    style={{
      height: 'calc(100vh - 300px)',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        position: 'relative',
        top: '50%',
        transform: 'translateY(-50%)',
        alignSelf: 'baseline',
      }}
    >
      <img alt="edit" src={NotFoundImage} />
      <p style={{ textAlign: 'center' }}>
        {/* Không có dữ liệu */}
        {text}
      </p>
    </div>
  </div>
);

const listDetectedEvent = data => (
  <ContentContent>
    {data.count !== 0 && (
      <div style={{ marginTop: 16 }}>
        <Grid container>
          {data &&
            data.rows &&
            data.rows.map(elem => (
              <DetailCardUser elem={elem} key={data.rows.indexOf(elem)} />
            ))}
        </Grid>
      </div>
    )}
  </ContentContent>
);

ListUserCameraAi.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  listUserCameraAI: makeSelectListUserCameraAi(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onLoadSearchHistory: evt => {
      dispatch(loadSearchHistory(evt));
    },
    onLoadUserDetectedEvent: evt => {
      dispatch(loadUserDetectedEvent(evt));
    },
    onClearFileImageSearch: () => {
      dispatch(loadFileImageSearch(null));
    },
    onLoadUserDetectedImage: evt => {
      dispatch(loadUserDetectedImage(evt));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ListUserCameraAi);
