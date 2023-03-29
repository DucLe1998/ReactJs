import { Badge, IconButton, Tooltip, Popover } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import {
  IconAdd,
  IconFilter,
  IconDelete,
  IconEdit,
  IconPrint,
} from 'constant/ListIcons';
import { ScrollView } from 'devextreme-react';
import { Popup } from 'devextreme-react/popup';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useMemo, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import QRCode from 'react-qr-code';
import moment from 'moment';
import A from '../../components/A';
import { IconButtonHeader } from '../../components/CommonComponent';
import IconBtn from '../../components/Custom/IconBtn';
import PopupDelete from '../../components/Custom/popup/PopupDelete';
import PageSearch from '../../components/PageHeader';
import TableCustom from '../../components/TableCustom';
import { getApi } from '../../utils/requestUtils';
import { showError, showSuccess } from '../../utils/toast-utils';
import { buildUrlWithToken } from '../../utils/utils';
import { API_PARKING_LOT, API_FILE } from '../apiUrl';
import { getErrorMessage } from '../Common/function';
import ModalImage from '../ListUserCameraAi/items/ModalImage';
import Loading from '../Loading';
import AddHmi from './creens/Add';
import { useStyles } from './styled';
import BtnSuccess from '../../components/Button/BtnSuccess';
import Filter from './creens/FilterPromote';
const initialFilter = {
  keyword: null,
  state: null,
  money: null,
  moneyMin: null,
  moneyMax: null,
  limit: 25,
  page: 1,
};

export function ParkingPromote({ location }) {
  const classes = useStyles();
  const state = location?.state || {};
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [deleteId, setDeleteid] = useState(null);
  const [deleteName, setDeleteName] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showPopupAdd, setShowPopupAdd] = useState(false);
  const [reload, setReload] = useState(0);
  const [filter, setFilter] = useState(initialFilter);
  const [printId, setPrintId] = useState({});
  const { id } = useParams();
  const { search } = useLocation();
  const history = useHistory();
  const isFilter = (filterOp) => {
    const { keyword, limit, page, ...filter } = filterOp;
    return Object.values(filter).filter((v) => !!v && String(v).length).length;
  };
  const [showFilter, setShowFilter] = useState(isFilter(filter));
  const componentRef = useRef();
  const fetchDataSource = async () => {
    setLoading(true);
    const params = {
      keyword: filter.keyword || '',
      limit: filter.limit,
      state: filter?.state || '',
      money: filter?.money || '',
      moneyMin: filter?.moneyMin || '',
      moneyMax: filter?.moneyMax || '',
      page: filter.page,
    };

    await getApi(`${API_PARKING_LOT.PARKING_PROMOTE}`, _.pickBy(params))
      .then((response) => {
        // setDataSource(dataRow);
        setDataSource(response);
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });

    setShowFilter(isFilter(params));
  };

  useEffect(() => {
    fetchDataSource();
  }, [reload, filter]);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    copyStyles: true,
  });
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
      title="Thêm gói khuyến mại"
      width="80%"
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
  const deletePopup = () => (
    <PopupDelete
      onClickSave={() => handlerDelete()}
      onClose={() => setDeleteid(null)}
      textFollowTitle={`Bạn chắc chắn muốn xóa ${deleteName}?`}
      title="Xác nhận xóa"
    />
  );

  const handlerDelete = () => {
    const payload = {
      forceDelete: true,
      id: deleteId,
    };
    setLoading(true);
    axios
      .delete(`${API_PARKING_LOT.PARKING_PROMOTE}/${deleteId}`)
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
  const onSuccessFilter = (values) => {
    const newParams = { ...filter, ...values, page: 1 };
    setFilter(newParams);
    setShowPopupFilter(false);
    setShowFilter(isFilter(newParams));
  };

  const renderActionCell = ({ data }) => (
    <div className="center-content">
      <Tooltip title="Sửa">
        <Badge color="primary">
          <IconBtn
            icon={<img src={IconEdit} style={{ maxHeight: 18 }} />}
            onClick={() => {
              setEditId(data.id);
              setEditName(data.name);
            }}
            style={{ padding: 5 }}
          />
        </Badge>
      </Tooltip>
      <Tooltip title="In">
        <Badge color="primary">
          <IconBtn
            icon={<img src={IconPrint} style={{ maxHeight: 18 }} />}
            onClick={() => {
              setPrintId(data);
              setTimeout(() => {
                handlePrint();
              }, 500);
            }}
            style={{ padding: 5 }}
          />
        </Badge>
      </Tooltip>
    </div>
  );

  const renderDownload = ({ data }) => {
    if (data?.fileId) {
      return (
        <a
          href={API_FILE.DOWNLOAD_PUBLIC_FILE(data?.fileId)}
          target="_blank"
          download
        >
          {data?.name}
        </a>
      );
    }
    return data?.name;
  };
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
      dataField: 'name',
      caption: 'Tên gói',
      // cellRender: renderDownload,
      minWidth: 100,
      width: 'auto',
    },
    {
      dataField: 'code',
      caption: 'ID gói',
      width: 'auto',
      minWidth: 100,
    },
    {
      dataField: 'dscr',
      caption: 'Mô tả',
      alignment: 'left',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'availableAt',
      caption: 'Ngày bắt đầu',
      dataType: 'date',
      format: 'dd/MM/yyyy',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'expiredAt',
      caption: 'Ngày kết thúc',
      dataType: 'date',
      format: 'dd/MM/yyyy',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'usedCount',
      caption: 'Số lượt đã dùng',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'maxUseLimit',
      caption: 'Số lượng tối đa',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'wlvehComs',
      caption: 'Các hãng xe áp dụng',
      cellTemplate: (container, options) => {
        const textStr = options.value ? options.value.map((x) => x.name).join`,` : 'Tất cả';
        container.title = textStr;
        container.textContent = textStr;
      },
      width: 240,
    },
    {
      dataField: 'wlpkLs',
      caption: 'Phạm vi',
      cellTemplate: (container, options) => {
        const textStr = options.value.map((x) => x.name).join`,` || '';
        container.title = textStr;
        container.textContent = textStr;
      },
      width: 240,
    },
    {
      dataField: 'wlservices.name',
      caption: 'Loại vé',
      cellRender: ({ data }) =>
        data.wlservices ? data.wlservices.map((x) => x.name).join`,` : '',
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
      minWidth: 100,
      width: 'auto',
      fixed: true,
      fixedPosition: 'right',
    },
  ];
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
  const handleChangeFilter = (data) => {
    setFilter({ ...filter, ...data });
    setReload(reload + 1);
  };
  const filterPopup = () => (
    <Popup
      visible={showPopupFilter}
      onHiding={() => setShowPopupFilter(false)}
      title="Lọc danh sách gói khuyến mại"
      dragEnabled
      showTitle
      maxWidth="652"
      height="auto"
      className={classes.popup}
    >
      <Filter
        onClose={() => setShowPopupFilter(false)}
        handleChangeFilter={handleChangeFilter}
        initValues={filter}
      />
    </Popup>
  );
  return (
    <>
      <Helmet>
        <title>Quản lý dịch vụ </title>
      </Helmet>
      <>
        {loading && <Loading />}
        {showPopupFilter && filterPopup()}
      </>

      <div className={classes.tableContent}>
        <h3> Danh sách gói khuyến mại</h3>
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
export default ParkingPromote;
