import {
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import DataGrid, { Column, Paging } from 'devextreme-react/data-grid';
import { Popup } from 'devextreme-react/popup';
import AddIcon from 'images/icon-button/add.svg';
import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import { IconButtonSquare } from '../../../components/CommonComponent';
import { showError, showSuccess } from '../../../utils/toast-utils';
import { API_IAM } from '../../apiUrl';
import { getErrorMessage } from '../../Common/function';
import messages from '../messages';
import { useStyles } from '../style';
import AddAuthorities from './AddAuthorities';
import Delete from './Delete';

export const RenderAuthority = ({
  authorities,
  setAuthorities,
  isEdit,
  isAdd,
  fullNameUser,
  user,
}) => {
  const intl = useIntl();
  const classes = useStyles();

  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState({
    isOpen: false,
    id: '',
    name: '',
  });

  const handleCloseDelete = () => {
    setOpenDelete({
      isOpen: false,
      id: '',
      name: '',
    });
  };
  const handleSaveDelete = () => {
    // case view detail
    if (!isEdit && !isAdd) {
      const payload = {
        piId: user.piId,
        policyId: openDelete.id,
      };
      axios
        .delete(API_IAM.POLICY_DELETE_USER, {
          data: payload,
        })
        .then(() => {
          const list = authorities.filter(
            item => item.policyId !== openDelete.id,
          );
          setAuthorities([...list]);
          showSuccess('Xóa vai trò người dùng thành công');
          handleCloseDelete();
        })
        .catch(err => {
          showError(getErrorMessage(err));
        });
    } else {
      // case add or edit
      const list = authorities.filter(item => item.policyId !== openDelete.id);
      setAuthorities([...list]);
      // showSuccess('Xóa vai trò người dùng thành công');
      handleCloseDelete();
    }
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
      <Tooltip title={intl.formatMessage({ id: 'app.tooltip.delete' })}>
        <IconButton
          onClick={() => {
            setOpenDelete({
              isOpen: true,
              id: data.policyId,
              name: data.policyName,
            });
          }}
        >
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </Fragment>
  );

  const columns = [
    {
      dataField: 'policyCode',
      caption: intl.formatMessage(messages.codeRole),
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      dataField: 'policyName',
      caption: intl.formatMessage(messages.nameRole),
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      dataField: 'description',
      caption: intl.formatMessage({ id: 'app.column.description' }),
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      caption: intl.formatMessage({ id: 'app.column.action' }),
      cssClass: 'valign-center',
      cellRender: renderActionCell,
    },
  ];

  return (
    <Box>
      <Card className={classes.card}>
        <CardContent>
          <Box className={classes.header}>
            <div className={classes.leftHeader}>
              <Typography className={classes.titleHeader}>
                {intl.formatMessage(messages.authority)}
              </Typography>
            </div>
            {(isEdit || isAdd) && (
              <div className={classes.rightHeader}>
                <span className={classes.headerAdd}>
                  {intl.formatMessage(messages.addRole)}
                </span>
                <Tooltip title={intl.formatMessage({ id: 'app.tooltip.add' })}>
                  <IconButtonSquare
                    icon={AddIcon}
                    onClick={() => {
                      setOpenAdd(true);
                    }}
                  />
                </Tooltip>
              </div>
            )}
          </Box>
          <DataGrid
            dataSource={authorities}
            keyExpr="policyId"
            noDataText={intl.formatMessage({ id: 'app.no_data' })}
            style={{
              height: '100%',
              minHeight: '250px',
              maxHeight: `350px`,
              width: '100%',
              maxWidth: '100%',
            }}
            showRowLines
            columnAutoWidth={false}
            showColumnLines={false}
            rowAlternationEnabled
          >
            <Paging enabled={false} />
            {React.Children.toArray(columns.map(defs => <Column {...defs} />))}
          </DataGrid>
        </CardContent>
      </Card>
      {openAdd && (
        <Popup
          className={`${classes.popupZIndex} popup`}
          visible
          title={intl.formatMessage(messages.addRoleUser)}
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
            currentAuthorities={authorities}
          />
        </Popup>
      )}
      {openDelete.isOpen && (
        <Popup
          className="popup"
          visible
          title={`Xóa người dùng khỏi vai trò ${openDelete.name}`}
          showTitle
          onHidden={handleCloseDelete}
          dragEnabled
          width={600}
          height={180}
        >
          <Delete
            isDeleteUser
            btnConfirm={handleSaveDelete}
            close={handleCloseDelete}
            text={`Người dùng ${fullNameUser} sẽ bị xóa khỏi vai trò ${
              openDelete.name
            }. Bạn có chắc chắn?`}
          />
        </Popup>
      )}
    </Box>
  );
};
