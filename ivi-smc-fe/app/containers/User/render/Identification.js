import {
  Box,
  Card,
  CardContent,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { IconButtonSquare } from 'components/CommonComponent';
import DataGrid, { Column, Paging } from 'devextreme-react/data-grid';
import { Popup } from 'devextreme-react/popup';
import AddIcon from 'images/icon-button/add.svg';
import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import { showError, showSuccess } from 'utils/toast-utils';
import {
  delApi,
  postApiCustom,
  putApi,
  putApiCustom,
} from 'utils/requestUtils';
import { API_DETAIL_USER_IDENTITY } from '../../apiUrl';
import { IDENTIFY_TYPES } from '../constants';
import messages from '../messages';
import { useStyles } from '../style';
import AddIdentification from './AddIdentification';
import Delete from './Delete';
import InformationDetail from './InformationDetail';
import { NotFoundPage } from './NotFoundPage';
import VerifyIdentifi from './VerifyIdentifi';

const initialValue = {
  isOpen: false,
  data: null,
};

export const RenderIdentify = ({
  isAdd,
  isEdit,
  // originIdentify,
  reload,
  identifications,
  setIdentifications,
  userId, // case update + detail only
}) => {
  const intl = useIntl();
  const classes = useStyles();

  const method = [
    intl.formatMessage(messages.face),
    intl.formatMessage(messages.fingerprint),
    intl.formatMessage(messages.card),
  ];
  // const [data, setData] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDetail, setOpenDetail] = useState({
    open: false,
    type: null,
    value: null,
  });
  const [openDelete, setOpenDelete] = useState(initialValue);
  const [openIdentifi, setOpenIdentifi] = useState(initialValue);
  const handleCloseDelete = () => {
    setOpenDelete(initialValue);
  };
  const deleteCard = async cardId => {
    try {
      await delApi(API_DETAIL_USER_IDENTITY.DELETE_CARD(cardId));

      await putApi(
        API_DETAIL_USER_IDENTITY.AUTHENTICATION_MODE(userId),
        getAllStatusIdentification(identifications[0]),
      );
      const data = identifications.filter(
        item => item.identifyMethod !== IDENTIFY_TYPES.CARD.id,
      );
      setIdentifications(data);
      showSuccess('Xóa thành công');
      reload();
    } catch (error) {
      showError(error);
    }
  };
  const deleteFace = async () => {
    try {
      await delApi(API_DETAIL_USER_IDENTITY.DELETE_FACE(userId));

      // await putApi(
      //   API_DETAIL_USER_IDENTITY.AUTHENTICATION_MODE(userId),
      //   getAllStatusIdentification(identifications[0]),
      // );
      const data = identifications.filter(
        item => item.identifyMethod !== IDENTIFY_TYPES.FACES.id,
      );
      setIdentifications(data);
      showSuccess('Xóa thành công');
      reload();
    } catch (error) {
      showError(error);
    }
  };
  const getAllStatusIdentification = value => ({
    enableCardIdentification: false,
    enableFaceIdentification: value.enableFaceIdentification,
    enableFingerprintIdentification: value.enableFingerprintIdentification,
  });
  const deleteIdentify = () => {
    switch (openDelete?.type) {
      default:
      case 2:
        if (isAdd || isEdit) {
          const data = identifications.filter(
            item => item.identifyMethod !== IDENTIFY_TYPES.CARD.id,
          );
          setIdentifications(data);
          // showSuccess('Xóa thành công');
        } else {
          // const status = getAllStatusIdentification(identifications[0]);
          const cardId = identifications.filter(
            i => i.identifyMethod === IDENTIFY_TYPES.CARD.id,
          )[0].identifyId;
          deleteCard(cardId);
        }
        break;
      case 0:
        deleteFace();
        break;
    }
    handleCloseDelete();
  };
  const handleCloseIdentifi = () => {
    setOpenIdentifi(initialValue);
  };

  const renderActionCell = ({ data }) => (
    <Fragment>
      {/* 0: Khuôn mặt, 1: Thẻ, 2: Vân tay */}
      {data?.identifyMethod != IDENTIFY_TYPES.FINGERPRINTS.id && (
        <Tooltip title={intl.formatMessage({ id: 'app.tooltip.delete' })}>
          <IconButton
            onClick={() => {
              setOpenDelete({
                isOpen: true,
                data,
                type: data?.identifyMethod,
              });
            }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      )}
      {data?.identifyMethod == IDENTIFY_TYPES.CARD.id && (
        <Tooltip title={intl.formatMessage(messages.identifyCard)}>
          <IconButton
            onClick={() => {
              setOpenIdentifi({
                ...data,
                isOpen: true,
                userId,
                isAdd,
                isEdit,
              });
            }}
          >
            <GroupOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title={intl.formatMessage({ id: 'app.tooltip.info' })}>
        <IconButton
          onClick={() => {
            const value = data?.identifyId;
            setOpenDetail({
              open: true,
              type: data?.identifyMethod,
              value,
            });
          }}
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Fragment>
  );

  const renderStatusCell = ({ data }) => (
    <div>
      <Switch
        readOnly
        checked={
          isAdd
            ? true
            : data?.identifyMethod === IDENTIFY_TYPES.CARD.id
            ? data.enableCardIdentification
            : data?.identifyMethod === IDENTIFY_TYPES.FINGERPRINTS.id
            ? data.enableFingerprintIdentification
            : data.enableFaceIdentification
        }
        onChange={(e, checked) => {
          if (userId) {
            if (isAdd) {
              return;
            }
            const type = data.identifyMethod;
            const res = [...identifications];
            // eslint-disable-next-line array-callback-return
            res.map(item => {
              if (type === IDENTIFY_TYPES.CARD.id) {
                item.enableCardIdentification = checked;
              } else if (type === IDENTIFY_TYPES.FACES.id) {
                item.enableFaceIdentification = checked;
              } else if (type === IDENTIFY_TYPES.FINGERPRINTS.id) {
                item.enableFingerprintIdentification = checked;
              }
            });
            const status = {
              enableCardIdentification: res[0].enableCardIdentification,
              enableFaceIdentification: res[0].enableFaceIdentification,
              enableFingerprintIdentification:
                res[0].enableFingerprintIdentification,
            };

            if (!isEdit) {
              // detail thay đổi trạng thái
              putApiCustom(
                {
                  url: API_DETAIL_USER_IDENTITY.AUTHENTICATION_MODE(userId),
                  payload: status,
                },
                response => {
                  const {
                    cardIdentificationUpdatedAt,
                    fingerprintIdentificationUpdatedAt,
                    faceIdentificationUpdatedAt,
                  } = response?.data;
                  res.map(item => {
                    if (type === IDENTIFY_TYPES.CARD.id) {
                      item.updatedAt =
                        cardIdentificationUpdatedAt || item.updatedAt;
                    } else if (type === IDENTIFY_TYPES.FACES.id) {
                      item.updatedAt =
                        faceIdentificationUpdatedAt || item.updatedAt;
                    } else if (type === IDENTIFY_TYPES.FINGERPRINTS.id) {
                      item.updatedAt =
                        fingerprintIdentificationUpdatedAt || item.updatedAt;
                    }
                  });
                  setIdentifications([...res]);
                  showSuccess('Cập nhật trạng thái định danh thành công');
                },
              );
            } else {
              setIdentifications([...res]);
              showSuccess('Cập nhật trạng thái định danh thành công');
            }
          }
        }}
        color="primary"
        name="status"
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
    </div>
  );

  const renderMethodCell = ({ data }) => method[data.identifyMethod];

  const columns = [
    {
      dataField: 'identifyMethod',
      caption: intl.formatMessage(messages.methodIdentify),
      cellRender: renderMethodCell,
      alignment: 'left',
      cssClass: 'valign-center',
    },
    {
      dataField: 'updatedAt',
      caption: intl.formatMessage(messages.updatedDateIdentify),
      dataType: 'datetime',
      format: 'dd/MM/yyyy HH:mm:ss',
      cssClass: 'valign-center',
    },
    {
      dataField: 'status',
      caption: intl.formatMessage(messages.status),
      cellRender: renderStatusCell,
      cssClass: 'valign-center',
    },
    {
      caption: intl.formatMessage({ id: 'app.column.action' }),
      alignment: 'center',
      cellRender: renderActionCell,
    },
  ];

  const add = val => {
    switch (val.identifyMethod) {
      case IDENTIFY_TYPES.CARD.id:
        setOpenAdd(false);
        setOpenIdentifi({
          ...initialValue.data,
          isOpen: true,
          userId,
          isAdd,
          isEdit,
        });
        break;
      default:
        break;
    }
  };

  const handleVerifyCard = val => {
    let tmp = [...identifications];
    const isCardExists =
      tmp.filter(i => i.identifyMethod === IDENTIFY_TYPES.CARD.id).length > 0;
    if (isCardExists) {
      // case da co card
      tmp.forEach(i => {
        if (i.identifyMethod === IDENTIFY_TYPES.CARD.id) {
          i.cardNumber = val.cardNumber;
          i.cardType = val.cardType;
        }
      });
    } else {
      // case chua co card nao
      tmp = [...tmp, { ...val }];
    }

    if (!(isAdd || isEdit)) {
      // BE lo het -> update hay tao moi gi deu vao post
      postApiCustom(
        {
          url: API_DETAIL_USER_IDENTITY.ADD_CARD,
          payload: {
            cardNumber: val.cardNumber,
            cardType: val.cardType,
            userId,
          },
        },
        () => {
          setIdentifications(tmp);
          setOpenIdentifi(false);
        },
        error => showError(error),
      );
    } else {
      // case edit hoac case tao moi -> Khi nao click btn save moi thuc hien luu
      setIdentifications(tmp);
    }
  };

  return (
    <Box>
      <Card className={classes.card}>
        <CardContent>
          <Box className={classes.header}>
            <div className={classes.leftHeader}>
              <Typography className={classes.titleHeader}>
                {intl.formatMessage(messages.identificationInformation)}
              </Typography>
            </div>
            {(isAdd || isEdit) && (
              <div className={classes.rightHeader}>
                <span className={classes.headerAdd}>
                  {intl.formatMessage(messages.addIdentificationInformation)}
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
            dataSource={identifications}
            keyExpr="identifyMethod"
            noDataText={intl.formatMessage({ id: 'app.no_data' })}
            style={{
              height: '100%',
              maxHeight: `350px`,
              width: '100%',
              maxWidth: '100%',
            }}
            showRowLines
            columnAutoWidth={false}
            showColumnLines={false}
            rowAlternationEnabled
            sorting={{ mode: 'none' }}
          >
            <Paging enabled={false} />
            {React.Children.toArray(columns.map(defs => <Column {...defs} />))}
          </DataGrid>
          {identifications.length === 0 && <NotFoundPage />}
        </CardContent>
      </Card>
      {openAdd && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage(messages.chooseMethodIdentify)}
          showTitle
          onHidden={() => {
            setOpenAdd(false);
          }}
          dragEnabled
          width={600}
          height={280}
        >
          <AddIdentification
            confirm={add}
            close={() => {
              setOpenAdd(false);
            }}
            confirmText={intl.formatMessage(messages.btnOK)}
            cancelText={intl.formatMessage(messages.btnCancel)}
          />
        </Popup>
      )}
      {openDetail.open && (
        <Popup
          className="popup"
          visible
          title={
            openDetail.type === IDENTIFY_TYPES.CARD.id
              ? 'Thông tin thẻ'
              : openDetail.type === IDENTIFY_TYPES.FINGERPRINTS.id
              ? 'Thông tin vân tay'
              : 'Thông tin khuôn mặt'
          }
          showTitle
          onHidden={() => {
            setOpenDetail({
              open: false,
              type: null,
              value: null,
            });
          }}
          dragEnabled
          width={openDetail.type === IDENTIFY_TYPES.FACES.id ? 1000 : 600}
          height="auto"
        >
          {/* 0: Khuôn mặt, 1: Vân tay, 2: Thẻ */}
          <InformationDetail
            isAdd={isAdd}
            type={openDetail.type}
            data={identifications || []}
            identifyId={openDetail.value}
            close={() => {
              setOpenDetail({
                open: false,
                type: null,
                value: null,
              });
            }}
          />
        </Popup>
      )}
      {openDelete?.isOpen && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage(messages.deleteIdentificationInformation)}
          showTitle
          onHidden={() => {
            setOpenDelete(initialValue);
          }}
          dragEnabled
          width={600}
          height={180}
        >
          <Delete
            isDeleteUser
            btnConfirm={deleteIdentify}
            close={handleCloseDelete}
            text={intl.formatMessage(
              messages.deleteContentIdentificationInformation,
              {
                type: openDelete?.type,
              },
            )}
          />
        </Popup>
      )}
      {openIdentifi?.isOpen && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage(messages.identifyCard)}
          showTitle
          onHidden={handleCloseIdentifi}
          dragEnabled
          width={600}
          height="auto"
        >
          <VerifyIdentifi
            close={handleCloseIdentifi}
            data={openIdentifi}
            verifyCard={handleVerifyCard}
          />
        </Popup>
      )}
    </Box>
  );
};
