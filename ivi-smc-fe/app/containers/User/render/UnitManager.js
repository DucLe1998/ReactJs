import {
  Box,
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DataGrid, { Column, Paging } from 'devextreme-react/data-grid';
import { Popup } from 'devextreme-react/popup';
import AddIcon from 'images/icon-button/add.svg';
import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import { IconButtonSquare } from '../../../components/CommonComponent';
import { putApi, showError } from '../../../utils/requestUtils';
import { showSuccess } from '../../../utils/toast-utils';
import { API_IAM } from '../../apiUrl';
import messages from '../messages';
import { useStyles } from '../style';
import Delete from './Delete';
import EditUnit from './EditUnit';

export const RenderUnitManager = ({ isEdit, DVKN, setDVKN, DVKNOrigin }) => {
  const intl = useIntl();
  const classes = useStyles();
  const [openCreate, setOpenCreate] = useState({
    isOpen: false,
    data: {},
  });
  const [openEdit, setOpenEdit] = useState({
    isOpen: false,
    data: {},
  });
  const [openDelete, setOpenDelete] = useState({
    isOpen: false,
    data: {},
  });

  const userData = JSON.parse(localStorage.getItem('userData'));
  const isAddDisabled =
    !userData.isRoot && userData?.concurrentlyUnits.length <= 0;

  const handleCloseDelete = () => {
    setOpenDelete({
      isOpen: false,
      data: {},
    });
  };

  const handleConfirmDelete = () => {
    const list = DVKN.filter(
      item => item.orgUnitId !== openDelete.data.orgUnitId,
    );
    setDVKN([...list]);
    handleCloseDelete();
  };
  const handleCloseEdit = () => {
    setOpenEdit({
      isOpen: false,
      data: {},
    });
  };
  const handleSaveEdit = data => {
    const oldData = openEdit.data;
    const newData = data;
    const list = [...DVKN];
    list.forEach((item, index) => {
      if (item.orgUnitId === oldData.orgUnitId) {
        list[index] = { ...item, ...newData };
      }
    });
    setDVKN([...list]);
    showSuccess('Sửa đơn vị kiêm nhiệm thành công');
    handleCloseEdit();
  };

  const handleCloseCreate = () => {
    setOpenCreate({
      isOpen: false,
      data: {},
    });
  };
  const handleSaveCreate = data => {
    setDVKN([...DVKN, data]);
    showSuccess('Thêm đơn vị kiêm nhiệm thành công');
    handleCloseCreate();
  };

  const renderActionCell = ({ data }) => (
    <Fragment>
      <Tooltip title={intl.formatMessage({ id: 'app.tooltip.delete' })}>
        <IconButton
          onClick={() => {
            setOpenDelete({
              isOpen: true,
              data,
            });
          }}
        >
          <CloseIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={intl.formatMessage({ id: 'app.tooltip.edit' })}>
        <IconButton
          onClick={() =>
            setOpenEdit({
              isOpen: true,
              data,
            })
          }
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Fragment>
  );

  const renderIsLanhDaoDonViCell = ({ data }) => (
    <div style={{ textAlign: 'center' }}>
      <Checkbox
        disable
        checked={data.isLeader}
        onChange={() => {
          const list = [...DVKN];
          let value;
          list.forEach(item => {
            if (
              item.orgUnitId === data.orgUnitId &&
              item.positionId === data.positionId
            ) {
              item.isLeader = !data.isLeader;
              value = item;
            }
          });
          if (!isEdit) {
            const payload = {
              isDefault: false,
              userId: value.userId,
              orgUnitId: value.orgUnitId,
              positionId: value.positionId,
              isLeader: value.isLeader,
              leader: value.isLeader,
            };
            putApi(API_IAM.USER_ORG_UNIT, payload)
              .then(() => {
                showSuccess('Cập nhật đơn vị kiêm nhiệm thành công');
              })
              .catch(err => showError(err));
          }
          setDVKN([...list]);
        }}
        name="isLanhDaoDonVi"
        color="primary"
      />
    </div>
  );

  // const columnsDeTail = [
  //   {
  //     dataField: 'orgUnitCode',
  //     caption: intl.formatMessage(messages.unitCode),
  //     cssClass: 'valign-center',
  //     allowSorting: false,
  //   },
  //   {
  //     dataField: 'orgUnitName',
  //     caption: intl.formatMessage(messages.unitName),
  //     cssClass: 'valign-center',
  //     allowSorting: false,
  //   },
  //   {
  //     dataField: 'positionName',
  //     caption: intl.formatMessage(messages.position),
  //     cssClass: 'valign-center',
  //     allowSorting: false,
  //   },
  //   {
  //     dataField: 'isLeader',
  //     caption: intl.formatMessage(messages.leadershipUnit),
  //     cssClass: 'valign-center text-align-center',
  //     allowSorting: false,
  //     cellRender: renderIsLanhDaoDonViCell,
  //   },
  // ];

  const columnsEdit = [
    {
      dataField: 'orgUnitCode',
      caption: intl.formatMessage(messages.unitCode),
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      dataField: 'orgUnitName',
      caption: intl.formatMessage(messages.unitName),
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      dataField: 'positionName',
      caption: intl.formatMessage(messages.position),
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      dataField: 'isLeader',
      caption: intl.formatMessage(messages.leadershipUnit),
      cssClass: 'valign-center text-align-center',
      allowSorting: false,
      cellRender: renderIsLanhDaoDonViCell,
    },
    {
      caption: intl.formatMessage({ id: 'app.column.action' }),
      cssClass: 'valign-center text-align-center',
      cellRender: renderActionCell,
      visible: isEdit,
    },
  ];

  return (
    <Box>
      <Card className={classes.card}>
        <CardContent>
          <Box className={classes.header}>
            <div className={classes.leftHeader}>
              <Typography className={classes.titleHeader}>
                {intl.formatMessage(messages.partTimeUnit)}
              </Typography>
            </div>
            {isEdit && (
              <div className={classes.rightHeader}>
                <span className={classes.headerAdd}>
                  {intl.formatMessage(messages.addPartTimeUnit)}
                </span>
                <Tooltip title={intl.formatMessage({ id: 'app.tooltip.add' })}>
                  <IconButtonSquare
                    icon={AddIcon}
                    onClick={() => {
                      setOpenCreate({
                        isOpen: true,
                        data: null,
                      });
                    }}
                    disabled={isAddDisabled}
                  />
                </Tooltip>
              </div>
            )}
          </Box>
          <DataGrid
            dataSource={DVKN}
            keyExpr="orgUnitId"
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
            {React.Children.toArray(
              columnsEdit.map(defs => <Column {...defs} />),
            )}
          </DataGrid>
        </CardContent>
      </Card>
      {openCreate.isOpen && (
        <Popup
          className={`${classes.popupZIndex} popup`}
          visible
          title={intl.formatMessage(messages.addPartTimeUnit)}
          showTitle
          onHidden={handleCloseCreate}
          dragEnabled
          width={600}
          height={250}
        >
          <EditUnit
            isCreateNew
            currentUnits={DVKN}
            confirm={handleSaveCreate}
            close={handleCloseCreate}
            DVKNOrigin={DVKNOrigin}
          />
        </Popup>
      )}
      {openEdit.isOpen && (
        <Popup
          className={`${classes.popupZIndex} popup`}
          visible
          title={intl.formatMessage(messages.editPartTimeUnit)}
          showTitle
          onHidden={handleCloseEdit}
          dragEnabled
          width={600}
          height={250}
        >
          <EditUnit
            isCreateNew={false}
            data={openEdit.data}
            currentUnits={DVKN}
            confirm={handleSaveEdit}
            close={handleCloseEdit}
            DVKNOrigin={DVKNOrigin}
          />
        </Popup>
      )}
      {openDelete.isOpen && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage(messages.deleteTitleTimeUnit)}
          showTitle
          onHidden={handleCloseDelete}
          dragEnabled
          width={600}
          height={180}
        >
          <Delete
            isDeleteUser
            btnConfirm={handleConfirmDelete}
            close={handleCloseDelete}
            text={intl.formatMessage(messages.deleteTimeUnit)}
          />
        </Popup>
      )}
    </Box>
  );
};
