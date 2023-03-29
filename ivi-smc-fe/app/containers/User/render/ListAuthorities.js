import { useIntl } from 'react-intl';
import React, { Fragment, useState } from 'react';
import { Box, InputAdornment, OutlinedInput } from '@material-ui/core';
import DataGrid, {
  Column,
  LoadPanel,
  Paging,
  Scrolling,
} from 'devextreme-react/data-grid';
import { Popup } from 'devextreme-react/popup';
import clsx from 'clsx';
import { Button } from 'devextreme-react/button';
import SearchIcon from '@material-ui/icons/Search';
import { useStyles } from '../style';
import Delete from './Delete';
import AddAuthorities from './AddAuthorities';
import { showSuccess } from '../../../utils/toast-utils';
import { NotFoundPage } from './NotFoundPage';

export const ListAuthorities = ({
  user,
  authorities,
  setAuthorities,
  authority,
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState({
    isOpen: false,
    id: '',
  });
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');

  const handleCloseDelete = () => {
    setOpenDelete({
      isOpen: false,
      id: '',
    });
  };
  const handleSaveDelete = () => {
    // deleteRole(openDelete.id);
    // setTimeout(() => {
    //   onLoadAuthorities();
    //   handleCloseDelete();
    // }, 1000);
    const list = authorities.filter(item => item.policyId !== openDelete.id);
    setAuthorities([...list]);
    showSuccess('Xóa vai trò người dùng thành công');
    handleCloseDelete();
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };
  const handleSaveAdd = data => {
    setAuthorities([...authorities, data]);
    showSuccess('Thêm vai trò người dùng thành công');
    handleCloseAdd();
  };

  const renderActionCell = ({ data }) => (
    <Fragment>
      <Button
        className={clsx(classes.button, classes.buttonFilter)}
        style={{ maxWidth: 80 }}
        onClick={() => {
          setName(data.policyName);
          setOpenDelete({
            isOpen: true,
            id: data.policyId,
          });
        }}
      >
        Xóa
      </Button>
    </Fragment>
  );

  const renderOrderCell = item => (
    <div style={{ textAlign: 'left' }}>{item.rowIndex + 1}</div>
  );

  const columns = [
    {
      dataField: 'index',
      caption: 'STT',
      cssClass: 'valign-center',
      allowSorting: false,
      cellRender: renderOrderCell,
    },
    {
      dataField: 'policyId',
      caption: 'Mã vai trò',
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      dataField: 'policyName',
      caption: 'Tên vai trò',
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      dataField: 'description',
      caption: 'Mô tả',
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      caption: 'Hành động',
      cssClass: 'valign-center',
      cellRender: renderActionCell,
    },
  ];

  return (
    <Box className={classes.card}>
      <div
        style={{
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <OutlinedInput
          style={{
            width: '20%',
            height: 40,
            background: 'rgba(116, 116, 128, 0.08)',
            border: '1px solid rgba(60, 60, 67, 0.1)',
            boxSizing: 'border-box',
            borderRadius: 70,
          }}
          id="search"
          placeholder="Tìm kiếm"
          value={search}
          onChange={e => setSearch(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
        <Button
          className={clsx(classes.button, classes.buttonFilter)}
          style={{ margin: '0 5px' }}
          onClick={() => {
            setOpenAdd(true);
          }}
        >
          Thêm
        </Button>
        <Button
          className={clsx(classes.button, classes.buttonFilter)}
          onClick={() => {
            showSuccess('Lưu vai trò người dùng thành công');
          }}
        >
          Lưu
        </Button>
      </div>
      <DataGrid
        dataSource={authorities}
        keyExpr="policyId"
        noDataText={intl.formatMessage({ id: 'app.no_data' })}
        style={{
          height: '100%',
          maxHeight: `calc(100vh - ${50 + 84 + 25}px)`,
          width: '100%',
          maxWidth: '100%',
        }}
        showRowLines
        columnAutoWidth={false}
        showColumnLines={false}
        rowAlternationEnabled
      >
        <Paging enabled={false} />
        <Scrolling mode="infinite" />
        <LoadPanel enabled={false} />
        {columns.map((defs, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Column key={index} {...defs} />
        ))}
      </DataGrid>
      {authorities.length === 0 && <NotFoundPage />}
      {openAdd && (
        <Popup
          className={`${classes.popupZIndex} popup`}
          visible
          title="Thêm vai trò cho người dùng"
          showTitle
          onHidden={() => {
            setOpenAdd(false);
          }}
          dragEnabled
          width={600}
          height={300}
        >
          <AddAuthorities
            close={handleCloseAdd}
            confirm={handleSaveAdd}
            authorities={authority}
            currentAuthorities={authorities}
          />
        </Popup>
      )}
      {openDelete.isOpen && (
        <Popup
          className="popup"
          visible
          title={`Xóa người dùng khỏi vai trò ${name}`}
          showTitle
          onHidden={handleCloseDelete}
          dragEnabled
          width={600}
          height={200}
        >
          <Delete
            isDeleteUser
            btnConfirm={handleSaveDelete}
            close={handleCloseDelete}
            text={`Người dùng ${
              user?.fullName
            } sẽ bị xóa khỏi vai trò ${name}. Bạn có chắc chắn?`}
          />
        </Popup>
      )}
    </Box>
  );
};
