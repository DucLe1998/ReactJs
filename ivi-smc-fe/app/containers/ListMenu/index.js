/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import Loading from 'containers/Loading/Loadable';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {} from '../Common/actions';
import {} from '../Common/selectors';
import { Template } from 'devextreme-react/core/template';
import Swal from 'sweetalert2';
import TreeList, { Column } from 'devextreme-react/tree-list';
import { loadData, showLoading, loadParentMenu, clearError } from './actions';
import {
  makeSelectError,
  makeSelectListMenu,
  makeSelectListParentMenu,
  makeSelectLoading,
} from './selectors';
import reducerCommon from '../Common/reducer';
import sagaCommon from '../Common/sagaCommon';
import saga from './saga';
import reducer from './reducer';

const cloneDeep = require('clone-deep');
const key = 'listMenu';

const ControlBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  grid-gap: 20px;
  justify-content: center;
  align-items: flex-start;
  margin: 0px 0px 0px 0px;
  max-width: 1000px;
  @media (max-width: 900px) {
    & {
      max-width: 700px;
      grid-template-columns: 1fr 1fr;
    }
  }
`;
function buildFilterQuery({
  status,
  orderBy,
  order,
  parentMenu,
  menuCode,
  menuName,
}) {
  let query = '';
  if (status && status.id !== null) {
    query += `&isActive=${status.id}`;
  }
  if (parentMenu) {
    query += `&parentId=${parentMenu.id}`;
  }
  if (menuCode) {
    query += `&functionCode=${menuCode}`;
  }
  if (menuName) {
    query += `&functionName=${menuName}`;
  }
  if (orderBy) query += `&sort=${order == 'asc' ? '' : '-'}${orderBy}`;
  // pageNumber && (query += `&page=${pageNumber + 1}`);
  query += `&isMenu=true`;
  if (query.indexOf('&') == 0) {
    query = query.slice(1);
  }
  if (query) {
    query = `?${query}`;
  }
  return query;
}

function iconCell(options) {
  if (options.data.functionIcon)
    return (
      <img
        alt=""
        src={options.data.functionIcon}
        style={{ width: '24px', height: '24px' }}
      />
    );
  return '';
}

export function ListMenu({
  loading,
  onShowLoading,
  listMenu,
  listParentMenu,
  onLoadData,
  onLoadParentMenu,
  error,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useInjectReducer({ key: 'common', reducer: reducerCommon });
  useInjectSaga({ key: 'common', saga: sagaCommon });
  const [status, setStatus] = React.useState('');
  const orderBy = '';
  const order = 'asc';
  const [parentMenu, setParentMenu] = React.useState(null);
  const [menuCode, setMenuCode] = React.useState('');
  const [menuName, setMenuName] = React.useState('');
  const handleChangeParentMenu = (event, value) => {
    setParentMenu(value);
  };
  const handleChangeStatus = (event, value) => {
    setStatus(value);
  };

  const [page, setPage] = React.useState(0);
  const rowsPerPage = 25;
  const loadData = newPage => {
    onShowLoading(true);
    const query = buildFilterQuery({
      rowsPerPage,
      parentMenu,
      pageNumber: newPage,
      status,
      orderBy,
      order,
      menuCode,
      menuName,
    });
    onLoadData(query);
  };

  let rootNode = '';
  rootNode = listMenu.data.find(item => item.parentId === null);
  rootNode = rootNode ? rootNode.id : '';
  const treeRef = useRef(null);
  if (treeRef.current && rootNode) {
    treeRef.current.instance.expandRow(rootNode);
  }
  useEffect(() => {
    onLoadParentMenu(``);
  }, []);
  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, orderBy, order]);
  const filteredData = cloneDeep(listMenu.data);
  if (parentMenu && filteredData) {
    const node = filteredData.find(item => item.id == parentMenu.id);
    if (node) {
      // set parentID of search node is null for devextream an drawtree
      node.parrentId = null;
    }
  }
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
    });
  }
  return (
    <React.Fragment>
      <ControlBox>
        <Autocomplete
          id="cmb-parent-menu"
          options={[...[], ...listParentMenu]}
          getOptionLabel={option => option.name}
          renderInput={params => (
            <TextField
              {...params}
              label="Chọn chức năng cha"
              variant="outlined"
              size="small"
            />
          )}
          onChange={handleChangeParentMenu}
          noOptionsText="Không có dữ liệu"
        />
        <TextField
          id="txtCode"
          label="Mã chức năng"
          variant="outlined"
          size="small"
          value={menuCode}
          onChange={e => {
            setMenuCode(e.target.value);
          }}
        />
        <TextField
          id="txtName"
          label="Tên chức năng"
          variant="outlined"
          size="small"
          value={menuName}
          onChange={e => {
            setMenuName(e.target.value);
          }}
        />
        <Autocomplete
          id="cmb-status"
          options={[
            { id: true, name: 'Hoạt động' },
            { id: false, name: 'Không hoạt động' },
          ]}
          getOptionLabel={option => option.name}
          renderInput={params => (
            <TextField
              {...params}
              label="Trạng thái"
              variant="outlined"
              size="small"
            />
          )}
          onChange={handleChangeStatus}
          noOptionsText="Không có dữ liệu"
        />
        <IconButton
          aria-label="Tìm kiếm"
          color="primary"
          onClick={() => {
            setPage(0);
            loadData();
          }}
          style={{ marginLeft: '-15px', marginTop: '-5px', padding: '8px' }}
        >
          <SearchOutlinedIcon fontSize="large" />
        </IconButton>
      </ControlBox>
      {loading && <Loading />}
      <TreeList
        style={{ marginTop: '20px' }}
        ref={treeRef}
        id="employees"
        dataSource={listMenu.data}
        showRowLines
        showBorders
        columnAutoWidth
        keyExpr="id"
        parentIdExpr="parentId"
        autoExpandAll
        noDataText="Không có dữ liệu"
      >
        <Column dataField="functionName" caption="Tên chức năng" />
        <Column dataField="functionCode" caption="Mã chức năng" />
        <Column dataField="functionUrl" caption="Đường dẫn" />
        <Column
          dataField="functionIcon"
          caption="Icon"
          cellTemplate="iconTemplate"
        />
        <Column dataField="isActive" caption="Hoạt động" />
        <Column dataField="isShowMenu" caption="Hiển thị" />
        <Template name="iconTemplate" render={iconCell} />
      </TreeList>
    </React.Fragment>
  );
}

ListMenu.propTypes = {
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  listMenu: makeSelectListMenu(),
  listParentMenu: makeSelectListParentMenu(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadData: evt => {
      dispatch(loadData(evt));
    },
    onLoadParentMenu: evt => {
      dispatch(loadParentMenu(evt));
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

export default compose(withConnect)(ListMenu);
