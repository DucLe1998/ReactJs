import { Dialog, IconButton, Tooltip } from '@material-ui/core';
import {
  IconDownLoad,
  IconEdit,
  IconTime,
} from 'components/Custom/Icon/ListIcon';
import IconBtn from 'components/Custom/IconBtn';
import PopupDelete from 'components/Custom/popup/PopupDelete';
import CustomTable from 'components/Custom/table/CustomTable';
import PageHeader from 'components/PageHeader';
import { ARTICLES_SRC } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import { endOfDay, startOfDay } from 'date-fns';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { BiFilterAlt, BiPlus } from 'react-icons/bi';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import gui from 'utils/gui';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { patchApi } from 'utils/requestUtils';
import { showError, showSuccess } from 'utils/toast-utils';
import { changeField, deleteArticle, loadData } from './actions';
import { statusNewsManagement } from './data';
import PopupFilter from './PopupFilter';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectData,
  makeSelectIsReloading,
  makeSelectLoading,
} from './selectors';

const key = 'newmanagement';
const defSearchValue = {
  keyword: '',
  page: 1,
  limit: gui.optionsPageSize[0],
  status: [],
  date: [],
  displayLocation: null,
  categoryIds: [],
};
const NewsManagement = ({
  loading,
  // error,
  data,
  onLoadData,
  isReloading,
  onDeleteArticle,
  onChangeField,
  history,
}) => {
  const intl = useIntl();
  const refNewManagement = useRef({});

  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [openViewFilter, setOpenViewFilter] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenUnPublicConfirmPopup, setIsOpenUnPublicConfirmPopup] =
    useState(false);
  const [searchValue, setSearchValue] = useState({ ...defSearchValue });
  const [id, setId] = useState();

  useEffect(() => {
    fetchData();
  }, [searchValue]);

  useEffect(() => {
    if (isReloading) {
      fetchData();
      setIsOpenDelete(false);
    }
  }, [isReloading]);

  const fetchData = () => {
    const payload = {
      ...searchValue,
      categoryIds: searchValue?.categoryIds?.map((cat) => cat.value) || [],
      statuses: searchValue?.status?.map((st) => st.value) || [],
      isDisplayInBanner:
        searchValue?.displayLocation?.value === 1 ? true : null,
      isDisplayInNews: searchValue?.displayLocation?.value === 2 ? true : null,
      startPublishedDate: searchValue.date[0]
        ? startOfDay(searchValue?.date[0].valueOf()).valueOf()
        : null,
      endPublishedDate: searchValue?.date[1]
        ? endOfDay(searchValue?.date[1].valueOf()).valueOf()
        : searchValue.date[0]
        ? endOfDay(searchValue?.date[0].valueOf()).valueOf()
        : null,
    };
    delete payload.date;
    delete payload.displayLocation;
    onLoadData(payload);
  };

  const handleChangePageIndex = (pageIndex) => {
    setSearchValue((e) => ({ ...e, page: pageIndex }));
  };

  const handlePageSize = (e) => {
    setSearchValue({ ...searchValue, page: 1, limit: e.target.value });
  };

  const onFilter = (value) => {
    const newParams = { ...searchValue, ...value, page: 1 };
    setSearchValue(newParams);
    setOpenViewFilter(false);
    const { keyword, limit, page, ...filterOp } = newParams;
    setIsFilter(
      Boolean(
        Object.values(filterOp).filter((v) => !!v && String(v).length).length,
      ),
    );
  };

  const handleChangeNewsStatus = async () => {
    onChangeField('loading', true);
    try {
      await patchApi(`${ARTICLES_SRC}/articles/${id}/change-status`, {
        status: 'NONE_PUBLISH',
      });
      showSuccess('Gỡ tin tức thành công');
      setIsOpenUnPublicConfirmPopup(false);
      setId(null);
      fetchData();
    } catch (error) {
      showError(error);
    } finally {
      onChangeField('loading', false);
    }
  };

  const cellAction = (item) => (
    <Fragment>
      {item.data.status != 'PUBLISHED' && (
        <Tooltip title="Cập nhật">
          <IconButton
            component={Link}
            to={`/management/app/new-management/${item.data.id}/edit`}
          >
            <IconEdit />
          </IconButton>
        </Tooltip>
      )}
      {item.data.status === 'PUBLISHED' && (
        <Tooltip title="Gỡ tin tức">
          <IconButton
            onClick={() => {
              setId(item.data.id);
              setIsOpenUnPublicConfirmPopup(true);
            }}
          >
            <IconDownLoad />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Xóa">
        <IconButton
          onClick={() => {
            setId(item.data.id);
            setIsOpenDelete(true);
          }}
        >
          <IconTime />
        </IconButton>
      </Tooltip>
    </Fragment>
  );

  // if (error) showAlertError();

  return (
    <>
      <Helmet>
        <title>Danh sách tin tức</title>
        <meta name="description" content="Danh sách tin tức" />
      </Helmet>
      <PageHeader
        title={searchValue.keyword ? 'Kết quả tìm kiếm' : 'Danh sách tin tức'}
        showSearch
        showPager
        pageIndex={searchValue.page}
        totalCount={data?.count || 0}
        rowsPerPage={searchValue.limit}
        handlePageSize={handlePageSize}
        handleChangePageIndex={handleChangePageIndex}
        onSearchValueChange={(e) => {
          setSearchValue((v) => ({ ...v, keyword: e, page: 1 }));
        }}
        showFilter={isFilter}
        onBack={() => {
          setSearchValue({
            ...defSearchValue,
            limit: searchValue.limit,
            keyword: searchValue.keyword,
          });
          setIsFilter(false);
        }}
      >
        <IconBtn
          style={styles.iconBtnHeader}
          onClick={() => setOpenViewFilter((v) => !v)}
          icon={<BiFilterAlt color="gray" />}
          showTooltip={intl.formatMessage({ id: 'app.tooltip.filter' })}
        />

        <IconBtn
          style={styles.iconBtnHeader}
          onClick={() => history.push('/management/app/new-management/add')}
          icon={<BiPlus color="gray" />}
          showTooltip={intl.formatMessage({ id: 'app.tooltip.add' })}
        />
      </PageHeader>

      <CustomTable
        data={(data && data.rows) || []}
        innerRef={refNewManagement}
        disabledSelect
        row={[
          {
            caption: 'STT',
            cellRender: (props) =>
              props?.row.rowIndex +
              1 +
              searchValue.limit * (searchValue.page - 1),
            width: 'auto',
          },
          {
            dataField: 'name',
            cellRender: (props) => (
              <Link
                to={`/management/app/new-management/${props.data.id}/detail`}
              >
                {props.data.title}
              </Link>
            ),
            caption: 'Tin tức',
          },
          {
            dataField: 'status',
            caption: 'Trạng thái xuất bản ',
            cellRender: (props) => (
              <span>
                {statusNewsManagement.find(
                  (status) => status.value === props?.data?.status,
                )?.label || ''}
              </span>
            ),
          },
          {
            dataField: 'publishedDate',
            caption: 'Ngày xuất bản',
            dataType: 'datetime',
            format: 'dd/MM/yyyy',
          },
          // {
          //   caption: 'Vị trí hiển thị trên ứng dụng',
          //   cellRender: props => {
          //     const displayLocation = [];
          //     if (props.data.isDisplayInBanner) {
          //       displayLocation.push('Banner');
          //     }
          //     if (props.data.isDisplayInNews) {
          //       displayLocation.push('Tin tức');
          //     }
          //     return <span>{displayLocation.join(', ')}</span>;
          //   },
          //   alignment: 'center',
          // },
          {
            dataField: 'categoryName',
            caption: 'Danh mục',
            // alignment: 'center',
          },
          {
            caption: 'Hành động',
            cellRender: cellAction,
            alignment: 'center',
            width: 'auto',
          },
        ]}
      />

      {isOpenDelete && (
        <PopupDelete
          onClickSave={() => {
            onDeleteArticle(id);
            setIsOpenDelete(false);
            setId(null);
          }}
          onClose={(v) => setIsOpenDelete(v)}
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
      {isOpenUnPublicConfirmPopup && (
        <PopupDelete
          onClickSave={() => {
            handleChangeNewsStatus();
          }}
          onClose={(v) => setIsOpenUnPublicConfirmPopup(v)}
          typeTxt="tin tức"
          textFollowTitle="Bạn có muốn gỡ tin tức"
        />
      )}

      {openViewFilter && (
        <Dialog
          maxWidth="sm"
          fullWidth
          open={openViewFilter}
          onClose={() => setOpenViewFilter(false)}
        >
          <PopupFilter
            onClose={() => setOpenViewFilter(false)}
            onSuccess={onFilter}
            defaultValues={searchValue}
          />
        </Dialog>
      )}

      {loading && <Loading />}
    </>
  );
};

const styles = {
  iconBtnHeader: {
    backgroundColor: 'rgba(116, 116, 128, 0.08)',
    height: 36,
    width: 36,
    borderRadius: 6,
  },
};

const mapStateToProps = createStructuredSelector({
  data: makeSelectData(),
  loading: makeSelectLoading(),
  isReloading: makeSelectIsReloading(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadData: (evt) => {
      dispatch(loadData(evt));
    },
    onDeleteArticle: (id) => {
      dispatch(deleteArticle(id));
    },
    onChangeField: (evt, id) => {
      dispatch(changeField(evt, id));
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(NewsManagement);
