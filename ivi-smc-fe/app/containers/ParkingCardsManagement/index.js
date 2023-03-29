/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-vars */

import { Badge, IconButton, Tooltip, Popover } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import {
  IconAdd,
  IconFilter,
  IconDelete,
  IconEdit,
  IconImport,
} from 'constant/ListIcons';
import { ScrollView } from 'devextreme-react';
import { Popup } from 'devextreme-react/popup';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import FileSaver from 'file-saver';
import A from '../../components/A';
import { IconButtonHeader } from '../../components/CommonComponent';
import IconBtn from '../../components/Custom/IconBtn';
import PopupDelete from '../../components/Custom/popup/PopupDelete';
import PageSearch from '../../components/PageHeader';
import TableCustom from '../../components/TableCustom';
import { getApi } from '../../utils/requestUtils';
import { showError, showSuccess } from '../../utils/toast-utils';
import { buildUrlWithToken } from '../../utils/utils';
import { API_PARKING_LOT } from '../apiUrl';
import { getErrorMessage } from '../Common/function';
import ModalImage from '../ListUserCameraAi/items/ModalImage';
import Loading from '../Loading';
import AddCard from './creens/Add';
import ImportCard from './creens/ImportCard';
import Filter from './creens/Filter';
import reducer from './reducer';
import saga from './saga';
import makeSelectMapIndoorManagement from './selectors';
import { useStyles } from './styled';
import BtnSuccess from '../../components/Button/BtnSuccess';
const initialFilter = {
  keyword: null,
  service: null,
  limit: 25,
  page: 1,
};

export function ParkingCardsManagement() {
  const classes = useStyles();
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [deleteId, setDeleteid] = useState(null);
  const [deleteName, setDeleteName] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showPopupAdd, setShowPopupAdd] = useState(false);
  const [showPopupImport, setShowPopupImport] = useState(false);
  const [reload, setReload] = useState(0);
  const [filter, setFilter] = useState(initialFilter);
  const history = useHistory();
  const { search } = useLocation();
  const serviceId = new URLSearchParams(search).get('serviceId');
  const isFilter = (filterOp) => {
    const { keyword, limit, page, ...filter } = filterOp;
    return Object.values(filter).filter((v) => !!v && String(v).length).length;
  };
  const [showFilter, setShowFilter] = useState(isFilter(filter));
  const addFilter = async () => {
    if (serviceId) {
      getApi(`${API_PARKING_LOT.PARKING_SERVICES}/${serviceId}`)
        .then((response) => {
          const filterUpdate = filter;
          filterUpdate.service = {
            id: response.data?.id,
            name: response.data?.name,
          };
          setFilter({ ...filter, ...filterUpdate });
        })
        .catch((err) => {
          showError(getErrorMessage(err));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const fetchDataSource = async () => {
    setLoading(true);
    const params = {
      keyword: filter.keyword || null,
      serviceId: filter?.service?.id || '',
      limit: filter.limit,
      page: filter.page,
    };
    await getApi(`${API_PARKING_LOT.PARKING_CARDS}`, _.pickBy(params))
      .then((response) => {
        setDataSource(response);
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    addFilter();
  }, [serviceId]);

  useEffect(() => {
    fetchDataSource();
  }, [reload, filter]);

  const editPopup = () => (
    <Popup
      visible={editId !== null}
      onHiding={() => setEditId(null)}
      dragEnabled
      showTitle
      title={editName}
      width="50%"
      height="auto"
      className={classes.popup}
    >
      <AddCard
        onClose={() => setEditId(false)}
        id={editId}
        setReload={() => setReload(reload + 1)}
      />
    </Popup>
  );
  const ImportPopup = () => (
    <Popup
      visible={showPopupImport}
      onHiding={() => setShowPopupImport(!showPopupImport)}
      dragEnabled
      showTitle
      title="Thêm vé"
      width="340"
      height="auto"
      maxHeight="100%"
      className={classes.popup}
    >
      <ScrollView width="100%" height="100%">
        <ImportCard
          onClose={() => setShowPopupImport(false)}
          setReload={() => setReload(reload + 1)}
        />
      </ScrollView>
    </Popup>
  );
  const addPopup = () => (
    <Popup
      visible={showPopupAdd}
      onHiding={() => setShowPopupAdd(!showPopupAdd)}
      dragEnabled
      showTitle
      title="Thêm vé"
      width="50%"
      height="auto"
      maxHeight="100%"
      className={classes.popup}
    >
      <ScrollView width="100%" height="100%">
        <AddCard
          onClose={() => setShowPopupAdd(false)}
          setReload={() => setReload(reload + 1)}
        />
      </ScrollView>
    </Popup>
  );
  const deletePopup = () => (
    <PopupDelete
      onClickSave={() => handlerDelete()}
      onClose={() => setDeleteid(null)}
      textFollowTitle={`Bạn chắc chắn muốn xóa vé ${deleteName}?`}
      title="Xác nhận xóa"
    />
  );
  const onSuccessFilter = (values) => {
    const newParams = { ...filter, ...values, page: 1 };
    setFilter(newParams);
    setShowPopupFilter(false);
    setShowFilter(isFilter(newParams));
  };
  const filterPopup = () => (
    <Popup
      visible={showPopupFilter}
      onHiding={() => setShowPopupFilter(false)}
      title="Lọc danh sách"
      dragEnabled
      showTitle
      maxWidth="350"
      height="auto"
      className={classes.popup}
    >
      <Filter
        onSuccess={onSuccessFilter}
        handleCloseFilter={() => setShowPopupFilter(false)}
        initialValues={filter}
      />
    </Popup>
  );
  const handlerDelete = () => {
    const payload = {
      forceDelete: true,
      id: deleteId,
    };
    setLoading(true);
    axios
      .delete(`${API_PARKING_LOT.PARKING_CARDS}/${deleteId}`)
      .then(() => {
        setDeleteid(null);
        showSuccess('Cập nhật thành công', {
          text: 'Dữ liệu đã được cập nhật',
        });
        setReload(reload + 1);
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderActionCell = ({ data }) => (
    <div className="center-content">
      <IconBtn
        showTooltip="Sửa"
        icon={<img src={IconEdit} style={{ maxHeight: 18 }} />}
        onClick={() => {
          setEditId(data.id);
          setEditName(data.csn);
        }}
        style={{ padding: 5 }}
      />
      <IconBtn
        showTooltip="Xóa"
        icon={<img src={IconDelete} style={{ maxHeight: 18 }} />}
        onClick={() => {
          setDeleteid(data.id);
          setDeleteName(data.csn);
        }}
        style={{ padding: 5 }}
      />
    </div>
  );
  const columns = [
    {
      caption: 'STT',
      alignment: 'center',
      cellRender: (props) =>
        props?.rowIndex + 1 + filter.limit * (filter.page - 1),
      minWidth: 40,
      width: 'auto',
    },
    {
      dataField: 'csn',
      caption: 'Mã vé',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'serviceName',
      caption: 'Loại vé',
      alignment: 'left',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'authRuleName',
      caption: 'Rule',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'state.value',
      caption: 'Trạng thái',
      minWidth: 120,
      width: 'auto',
    },
    {
      caption: 'Hành động',
      cellRender: renderActionCell,
      alignment: 'center',
      fixed: true,
      fixedPosition: 'right',
      minWidth: 100,
      width: 'auto',
    },
  ];
  const downloadFileExample = async () => {
    try {
      const response = await getApi(
        `/cards/download/template`,
        {},
        {
          responseType: 'blob',
        },
      );
      FileSaver.saveAs(response, 'card-template.xlsx');
    } catch (err) {
      showError(err);
    }
  };
  const onChangePage = (e) => {
    if (!e) return;
    if (e !== filter.page) {
      setFilter({ ...filter, page: e });
      setReload(reload + 1);
    }
  };
  const onChangeLimit = (e) => {
    if (!e || !e.target) return;
    if (e.target.value !== filter.limit) {
      const lastPage = Math.ceil(dataSource?.count / e.target.value);
      setFilter({
        ...filter,
        page: filter.page > lastPage ? lastPage : filter.page,
        limit: e.target.value,
      });
      setReload(reload + 1);
    }
  };
  return (
    <>
      <Helmet>
        <title>Quản lý vé</title>
      </Helmet>
      <>
        {loading && <Loading />}
        {editId && editPopup()}
        {deleteId && deletePopup()}
        {showPopupImport && ImportPopup()}
        {showPopupFilter && filterPopup()}
        {showPopupAdd && addPopup()}
        <PageSearch
          title="Quản lý vé"
          showSearch
          showPager
          placeholderSearch="Nhập mã vé"
          defaultSearch={filter.keyword}
          pageIndex={filter.page || 0}
          totalCount={dataSource?.count || 0}
          rowsPerPage={filter.limit || 0}
          handleChangePageIndex={onChangePage}
          handlePageSize={onChangeLimit}
          onSearchValueChange={(newVal) => {
            setFilter({ ...filter, keyword: newVal, page: 1 });
            setReload(reload + 1);
          }}
          showFilter={Boolean(showFilter)}
          showBackButton={false}
          onBack={() => {
            setFilter({ ...initialFilter, page: 1 });
            setReload(reload + 1);
          }}
        >
          <Tooltip title="Lọc">
            <Badge color="primary" badgeContent={showFilter}>
              <IconButtonHeader
                onClick={() => {
                  setShowPopupFilter(true);
                }}
              >
                <img
                  src={IconFilter}
                  alt=""
                  style={{ width: 14, height: 14 }}
                />
              </IconButtonHeader>
            </Badge>
          </Tooltip>
          <Tooltip title="Thêm mới">
            <Badge color="primary">
              <IconButtonHeader
                onClick={() => {
                  setShowPopupAdd(true);
                }}
              >
                <img src={IconAdd} alt="" style={{ width: 14, height: 14 }} />
              </IconButtonHeader>
            </Badge>
          </Tooltip>
          <Tooltip title="Nhập vé">
            <Badge color="primary">
              <IconButtonHeader
                style={{ padding: 0 }}
                onClick={() => {
                  setShowPopupImport(true);
                }}
              >
                <img src={IconImport} alt="" />
              </IconButtonHeader>
            </Badge>
          </Tooltip>
        </PageSearch>
      </>

      <div className={classes.tableContent}>
        <h3> Danh sách vé</h3>
        <TableCustom
          data={dataSource?.data || []}
          columns={columns}
          style={{
            maxHeight: 'calc(100vh - 215px)',
            width: '100%',
          }}
        />
      </div>
    </>
  );
}
export default ParkingCardsManagement;
