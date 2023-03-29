/* eslint-disable no-unused-vars */

import { Badge, IconButton, Tooltip, Popover } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import { IconAdd, IconFilter, IconDelete, IconEdit } from 'constant/ListIcons';
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
import AddHmi from './creens/Add';
import FilterHmi from './creens/Filter';
import reducer from './reducer';
import saga from './saga';
import makeSelectMapIndoorManagement from './selectors';
import { useStyles } from './styled';
import BtnSuccess from '../../components/Button/BtnSuccess';

const initialFilter = {
  keyword: null,
  pklot: {pkLotId: null, pkLotName: null },
  limit: 25,
  page: 1,
};

export function ParkingCardTypeManagement() {
  const classes = useStyles();
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [deleteId, setDeleteid] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showPopupAdd, setShowPopupAdd] = useState(false);
  const [reload, setReload] = useState(0);
  const [filter, setFilter] = useState(initialFilter);
  const { id } = useParams();
  const { search } = useLocation();
  const pkLotId = new URLSearchParams(search).get('pkLotId');
  const history = useHistory();
  const fetchDataSource = async () => {
    setLoading(true);
    if (pkLotId) {
      let filterUpdate = filter;
      filterUpdate.pklot = {
        pkLotId: pkLotId,
        pkLotName: '',
      };
      setFilter({ ...filter, ...filterUpdate });
    }
    const params = {
      keyword: filter.keyword || '',
      pkLotId: filter?.pklot.pkLotId || '',
      limit: filter.limit,
      page: filter.page,
    };

    await getApi(`${API_PARKING_LOT.PARKING_ENTRY_POINTS}`, _.pickBy(params))
      .then((response) => {
        //setDataSource(dataRow);
        setDataSource(response.data);
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangeFilter = (data) => {
    if (filter.pklot?.pkLotId != data.pklot?.pkLotId) {
      const historyPush = data.pklot?.pkLotId
        ? `/parking/entry-points/${data.pklot?.pkLotId}`
        : '/parking/entry-points';
      history.push(historyPush);
    }
    setFilter({ ...filter, ...data });
    setReload(reload + 1);
  };

  useEffect(() => {
    fetchDataSource();
  }, [reload, filter]);

  const editPopup = () => (
    <Popup
      visible={editId !== null}
      onHiding={() => setEditId(null)}
      dragEnabled
      showTitle
      width="50%"
      height="auto"
      className={classes.popup}
    >
      <AddHmi
        onClose={() => setEditId(false)}
        id={editId}
        setReload={() => setReload(reload + 1)}
      />
    </Popup>
  );
  const addPopup = () => (
    <Popup
      visible={showPopupAdd}
      onHiding={() => setShowPopupAdd(!showPopupAdd)}
      dragEnabled
      showTitle
      width="50%"
      height="auto"
      maxHeight="100%"
      className={classes.popup}
    >
      <ScrollView width="100%" height="100%">
        <AddHmi
          onClose={() => setShowPopupAdd(false)}
          setReload={() => setReload(reload + 1)}
        />
      </ScrollView>
    </Popup>
  );

  const filterPopup = () => (
    <Popup
      visible={showPopupFilter}
      onHiding={() => setShowPopupFilter(false)}
      title="Lọc danh sách entry point"
      dragEnabled
      showTitle
      maxWidth="350"
      height="auto"
      className={classes.popup}
    >
      <FilterHmi
        onClose={() => setShowPopupFilter(false)}
        handleChangeFilter={handleChangeFilter}
        initValues={filter}
      />
    </Popup>
  );

  const renderActionCell = ({ data }) => (
    <div className="center-content">
      <IconBtn
        icon={<img src={IconEdit} style={{ maxHeight: 18 }} />}
        onClick={() => {
          setEditId(data.id);
        }}
        style={{ padding: 5 }}
      />
    </div>
  );
  const renderLinkLanes = ({ data }) => (
    <Link
      to={{
        pathname: '/parking/lanes',
        search: `?pkLotId=${data?.pkLotId}&entryptId=${data?.id}`,
      }}
    >
      {data.name}
    </Link>
  );
  const columns = [
    {
      caption: 'STT',
      alignment: 'center',
      cellRender: (props) => props?.rowIndex + 1,
      width: '5%',
    },
    {
      dataField: 'name',
      caption: 'Tên entry point',
      cellRender: renderLinkLanes,
    },
    {
      dataField: 'pkLotName',
      caption: 'Tên bãi gửi xe',
      alignment: 'left',
    },
    {
      dataField: 'ip',
      caption: 'Địa chỉ IP',
    },
    {
      dataField: 'state',
      caption: 'Trạng thái',
      cellRender: ({ data }) => <div>{data?.state?.value}</div>,
    },
    {
      caption: 'Hành động',
      cellRender: renderActionCell,
      alignment: 'center',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Quản lý bãi xe</title>
      </Helmet>
      <>
        {loading && <Loading />}
        {editId && editPopup()}
        {showPopupFilter && filterPopup()}
        {showPopupAdd && addPopup()}
        <PageSearch
          title="Quản lý bãi xe"
          showSearch
          showPager
          totalCount={0}
          // onSearchValueChange={newVal => {
          //   setFilter({ ...filter, keyword: newVal });
          // }}
          onSearchValueChange={(newVal) => {
            setFilter({ ...filter, keyword: newVal });
            setReload(reload + 1);
          }}
        >
          <Tooltip title="Lọc">
            <IconButtonHeader
              onClick={() => {
                setShowPopupFilter(true);
              }}
            >
              <img src={IconFilter} alt="" style={{ width: 14, height: 14 }} />
            </IconButtonHeader>
          </Tooltip>
          <Tooltip title="Lọc">
            <Badge color="primary">
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
        </PageSearch>
      </>

      <div className={classes.tableContent}>
        <h3> Danh sách entry point</h3>
        <TableCustom
          data={dataSource || []}
          columns={columns}
          pushClass="table-grid center-row-grid"
        />
      </div>
    </>
  );
}
export default ParkingCardTypeManagement;
