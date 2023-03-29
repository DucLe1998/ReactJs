/* eslint-disable no-unused-expressions */
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import styled from 'styled-components';
import Loading from 'containers/Loading/Loadable';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import { H4 } from '../../components/CommonComponent';
import {
  makeSelectError,
  makeSelectListNotification,
  makeSelectLoading,
} from './selectors';
import { clearError, loadData, showLoading, markAsRead } from './actions';
import saga from './saga';
import reducer from './reducer';
import SmchPagination from '../../components/SmchPagination';
import Img from './Img';
import IssueIcon from '../../images/Icon_Event_HIGH.svg';
import { getHTMLTimeCountDown } from '../../utils/statusHTMLGenerate';
const key = 'notification';

const NoData = styled.div`
  font-size: 16px;
  display: flex;
  justify-content: center;
  margin: 15px;
  min-width: 100%;
`;
const NotifyBlock = styled.ul`
  list-style-type: none;
  padding: 0px;
  .block-header {
    font-weight: bold;
    text-transform: uppercase;
    flex: 1;
  }
  .notify-header {
    display: flex;
    align-items: center;
    padding: 5px 30px 10px;
  }
  .view-btn {
    font-size: 12px;
    line-height: 2.25;
    letter-spacing: normal;
    text-align: left;
    color: #5993fd;
  }
  .MuiDivider-inset {
    margin-left: 0px;
  }
  .item-header {
    display: flex;
    font-weight: bold;
    font-size: 16px;
    text-transform: uppercase;
  }
  .item-header img {
    width: 20px;
    margin-right: 16px;
  }
  .item-content {
    padding: 10px 20px;
    list-style-type: disc;
  }
  .item-time {
    font-size: 12px;
    line-height: 16px;
  }
  .item-time * {
    color: #bababa !important;
  }
  .list-item {
    cursor: pointer;
  }
  .list-item:hover {
    background-color: #efefef !important;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
function getImageByTypeNotify(type) {
  switch (type) {
    case 'canhbao':
      return IssueIcon;
    case 'thongtin':
      return IssueIcon;
    default:
      return IssueIcon;
  }
}
function buildFilterQuery({ rowsPerPage, pageNumber }) {
  let query = '';
  query += `&areaId=${process.env.AREA_ID}`;
  pageNumber && (query += `&page=${pageNumber + 1}`);
  query += `&limit=${rowsPerPage}`;
  query.indexOf('&') === 0 && (query = query.slice(1));
  query && (query = `?${query}`);
  return query;
}
export function ListNotifications({
  loading,
  listNotification,
  onShowLoading,
  onLoadData,
  onClearError,
  error,
  onMarkAsRead,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const history = useHistory();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const handleChangePage = newPage => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const loadData = () => {
    onShowLoading(true);
    const query = buildFilterQuery({
      rowsPerPage,
      pageNumber: page,
    });
    onLoadData(query);
  };

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage]);

  if (error) {
    Swal.fire({
      title: 'Có lỗi xảy ra',
      text: error,
      icon: 'info',
      imageWidth: 213,
      dangerMode: true,
      showCancelButton: false,
      showCloseButton: true,
      showConfirmButton: true,
      focusConfirm: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không',
      customClass: {
        content: 'content-class',
      },
    }).then(() => {
      onClearError();
    });
  }
  return (
    <React.Fragment>
      <Helmet>
        <title>Danh sách thông báo</title>
        <meta name="description" content="Smart city" />
      </Helmet>
      {loading && <Loading />}
      <ButtonContainer>
        <H4 className="pb-10">Danh sách thông báo</H4>
        <Button
          variant="contained"
          onClick={() => {
            history.push(`/list-task`);
          }}
          style={{ marginLeft: '8px' }}
        >
          Quay lại danh sách công việc
        </Button>
      </ButtonContainer>
      <NotifyBlock>
        {listNotification.rows.map((item, index) => (
          <React.Fragment key={item.id}>
            <ListItem
              className="list-item"
              alignItems="flex-start"
              style={{
                flexDirection: 'column',
                padding: '15px 30px',
                backgroundColor: !item.isRead ? '#efefef' : '#fff',
              }}
              onClick={() => {
                onMarkAsRead(`?notificationIds=${item.id}`);
                history.push(`/task-config?id=${item.taskId}`);
              }}
            >
              {/* <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src={getImageByTypeNotify(item.type)}
                        />
                      </ListItemAvatar> */}
              <div className="item-header">
                <Img alt="Remy Sharp" src={getImageByTypeNotify(item.type)} />
                <div className="item-title">{item.title}</div>
              </div>
              <ul className="item-content">
                <li>{item.content}</li>
              </ul>
              <div className="item-time">
                {getHTMLTimeCountDown(item.createdAt)}
              </div>
            </ListItem>
            {index < listNotification.rows.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
        {listNotification.rows.length > 0 && (
          <SmchPagination
            totalCount={listNotification.count}
            totalPage={listNotification.totalPage}
            pageIndex={page + 1}
            pageSize={rowsPerPage}
            changePageIndex={handleChangePage}
            changePageSize={handleChangeRowsPerPage}
            optionsPageSize={[25, 50, 100]}
          />
        )}
      </NotifyBlock>
      {listNotification.rows.length === 0 && (
        <NoData>Bạn không có thông báo nào cần xử lý</NoData>
      )}
      <ButtonContainer />
    </React.Fragment>
  );
}

ListNotifications.propTypes = {
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  listNotification: makeSelectListNotification(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadData: evt => {
      dispatch(loadData(evt));
    },
    onMarkAsRead: evt => {
      dispatch(markAsRead(evt));
    },
    onShowLoading: evt => {
      dispatch(showLoading(evt));
    },
    onClearError: evt => {
      dispatch(clearError(evt));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ListNotifications);
