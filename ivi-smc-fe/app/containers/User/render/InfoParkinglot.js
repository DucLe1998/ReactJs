import {
  Box,
  Card,
  CardContent,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DataGrid, { Column, Paging } from 'devextreme-react/data-grid';
import { Popup } from 'devextreme-react/popup';
import AddIcon from 'images/icon-button/add.svg';
import React, { Fragment, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { IconButtonSquare } from '../../../components/CommonComponent';
import { delApi, getApi, putApi, showError } from '../../../utils/requestUtils';
import { showSuccess } from '../../../utils/toast-utils';
import { API_IAM } from '../../apiUrl';
import messages from '../messages';
import { useStyles } from '../style';
import Delete from './Delete';
import EditParkinglot from './EditParkinglot';

export const RenderInfoParkingLot = ({
  isEdit,
  dataParking,
  setDataParking,
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const [openAdding, setOpenAdding] = useState(false);
  const [openEdit, setOpenEdit] = useState({
    isOpen: false,
    data: {},
  });
  const [openDelete, setOpenDelete] = useState({
    isOpen: false,
    data: {},
  });
  const [dataCarType, setDataCarType] = useState([]);

  const handleCloseEdit = () => {
    setOpenEdit({
      isOpen: false,
      data: {},
    });
  };

  const editParking = data => {
    const oldData = openEdit.data;
    const list = [...dataParking];
    list.map((item, index) => {
      if (item.cardNumber === oldData.cardNumber) {
        list[index] = { ...item, ...data };
      }
      return item;
    });
    if (!isEdit) {
      // call api
      putApi(API_IAM.VEHICLE_UPDATE(data.id), data)
        .then(() => {
          setDataParking([...list]);
          showSuccess('Cập nhật thông tin gửi xe thành công');
        })
        .catch(err => {
          showError(err);
        });
    } else {
      setDataParking([...list]);
      showSuccess('Cập nhật thông tin gửi xe thành công');
    }
    handleCloseEdit();
  };

  const handleCloseDelete = () => {
    setOpenDelete({
      isOpen: false,
      data: null,
    });
  };

  const deleteParking = () => {
    const list = dataParking.filter(
      item => item.cardNumber !== openDelete.data.cardNumber,
    );

    if (!isEdit) {
      // call api
      delApi(API_IAM.VEHICLE_UPDATE(openDelete.data.id))
        .then(() => {
          setDataParking([...list]);
          showSuccess('Xóa thông tin gửi xe thành công');
        })
        .catch(err => {
          showError(err);
        });
    } else {
      setDataParking([...list]);
      showSuccess('Xóa thông tin gửi xe thành công');
    }
    handleCloseDelete();
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
          <DeleteOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={intl.formatMessage({ id: 'app.tooltip.edit' })}>
        <IconButton
          onClick={() => {
            setOpenEdit({
              isOpen: true,
              data,
            });
          }}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Fragment>
  );

  const renderStatusCell = ({ data }) => (
    <div>
      <Switch
        readOnly
        checked={data.status === 'ACTIVE'}
        onChange={() => {
          const list = [...dataParking];
          let payload = {};
          list.map(item => {
            if (item.cardNumber === data.cardNumber) {
              item.status = data.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
              payload = { ...item };
            }
            return item;
          });
          // chi tiết
          if (!isEdit) {
            // call api
            putApi(API_IAM.VEHICLE_UPDATE(data.id), payload)
              .then(() => {
                setDataParking([...list]);
                showSuccess('Cập nhật trạng thái thông tin gửi xe thành công');
              })
              .catch(err => {
                showError(err);
              });
          } else {
            setDataParking([...list]);
          }
        }}
        color="primary"
        name="status"
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
    </div>
  );

  const columns = [
    {
      dataField: 'cardNumber',
      caption: intl.formatMessage(messages.vehicleCardCode),
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      dataField: 'vehicleTypeName',
      caption: intl.formatMessage(messages.carType),
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      dataField: 'name',
      caption: intl.formatMessage(messages.carName),
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      dataField: 'plateNumber',
      caption: intl.formatMessage(messages.licensePlate),
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      dataField: 'status',
      caption: intl.formatMessage(messages.status),
      cssClass: 'valign-center',
      allowSorting: false,
      cellRender: renderStatusCell,
    },
    {
      caption: intl.formatMessage({ id: 'app.column.action' }),
      cssClass: 'valign-center',
      cellRender: renderActionCell,
    },
  ];

  const addParking = data => {
    setDataParking([...dataParking, data]);
    setOpenAdding(false);
  };

  useEffect(() => {
    getApi(API_IAM.VEHICLE)
      .then(res => {
        setDataCarType(res?.data);
      })
      .catch(() => {});
  }, []);

  return (
    <Box>
      <Card className={classes.card}>
        <CardContent>
          <Box className={classes.header}>
            <div className={classes.leftHeader}>
              <Typography className={classes.titleHeader}>
                {intl.formatMessage(messages.parkingInformation)}
              </Typography>
            </div>
            {isEdit && (
              <div className={classes.rightHeader}>
                <span className={classes.headerAdd}>
                  {intl.formatMessage(messages.addParkingInformation)}
                </span>
                <Tooltip title={intl.formatMessage({ id: 'app.tooltip.add' })}>
                  <IconButtonSquare
                    icon={AddIcon}
                    onClick={() => {
                      setOpenAdding(true);
                    }}
                  />
                </Tooltip>
              </div>
            )}
          </Box>
          <DataGrid
            dataSource={dataParking}
            keyExpr="cardNumber"
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
      {openDelete.isOpen && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage(messages.deleteParkingInformation)}
          showTitle
          onHidden={handleCloseDelete}
          dragEnabled
          width={600}
          height={180}
        >
          <Delete
            isDeleteUser
            btnConfirm={deleteParking}
            close={handleCloseDelete}
            text={intl.formatMessage(messages.deleteContentParkingInformation)}
          />
        </Popup>
      )}
      {openEdit.isOpen && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage(messages.editParkingInformation)}
          showTitle
          onHidden={handleCloseEdit}
          dragEnabled
          width={600}
          height="auto"
        >
          <EditParkinglot
            isEdit
            value={openEdit.data}
            confirm={editParking}
            close={handleCloseEdit}
            data={dataCarType}
          />
        </Popup>
      )}
      {openAdding && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage(messages.addParkingInformation)}
          showTitle
          onHidden={() => {
            setOpenAdding(false);
          }}
          dragEnabled
          width={600}
          height="auto"
        >
          <EditParkinglot
            isAdd
            confirm={addParking}
            close={() => {
              setOpenAdding(false);
            }}
            data={dataCarType}
          />
        </Popup>
      )}
    </Box>
  );
};
