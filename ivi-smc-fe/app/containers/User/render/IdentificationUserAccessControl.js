import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  makeStyles,
  Paper,
  Switch,
  Tooltip,
} from '@material-ui/core';
import PageHeader from 'components/PageHeader';
import CustomTable from 'components/Custom/table/CustomTable';
import { useParams } from 'react-router-dom';
import utils, { buildUrlWithToken, showAlertConfirm } from 'utils/utils';
import { ACCESS_CONTROL_API_SRC, IAM_API_SRC } from 'containers/apiUrl';
import Loading from 'containers/Loading';
import { useIntl } from 'react-intl';
import useAxios from 'axios-hooks';
import { showError } from 'utils/toast-utils';
import ClearIcon from '@material-ui/icons/DeleteOutlineOutlined';
import AddIcon from '@material-ui/icons/AddOutlined';
import RenderDetails from 'components/RenderDetails';
import { format } from 'date-fns';
import fingerprintImg from 'images/vantay.png';
import VAutocomplete from 'components/VAutocomplete';
import { callApi, getApi } from 'utils/requestUtils';
import { DateTimePicker } from '@material-ui/pickers';
import { setLoading } from 'containers/BlacklistCameraAi/actions';
import { Popup } from 'devextreme-react/popup';
import messages from 'containers/User/messages';
import Delete from 'containers/User/render/Delete';

const messageStatusCard = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Ngừng Hoạt động',
  NEW: 'Chưa cấp phát',
};

const ImgCards = ({ data, imgTitle }) => (
  <div style={{ display: 'flex', gap: '34px' }}>
    {React.Children.toArray(
      data.map((item, index) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Img
            src={
              item
                ? item.imageFileUrl
                  ? buildUrlWithToken(item.imageFileUrl)
                  : `data:image/jpeg;base64,${item.imageBase64}`
                : null
            }
          />
          <p style={{ margin: 0, marginTop: '5px', whiteSpace: 'nowrap' }}>
            {imgTitle} {index + 1}
          </p>
        </div>
      )),
    )}
  </div>
);

const Img = React.memo((props) => {
  const [loaded, setLoaded] = useState(false);
  const { src } = props;
  return (
    <>
      <div
        style={
          loaded
            ? { display: 'none' }
            : {
                width: '100px',
                height: '100px',
                display: 'grid',
                backgroundColor: '#C4C4C4',
                placeItems: 'center',
              }
        }
      >
        <CircularProgress size={20} />
      </div>
      <img
        {...props}
        src={src}
        alt="Ảnh"
        onLoad={() => setLoaded(true)}
        style={
          loaded ? { width: '100px', height: '100px' } : { display: 'none' }
        }
      />
    </>
  );
});

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  btnWraper: {
    display: 'flex',
    height: '67px',
    alignItems: 'end',
    marginLeft: '32px',
  },
  backgroundBorder: {
    borderRadius: '10px',
    borderBlockStyle: 'solid',
  },
}));

const initialValuePopupDelete = {
  isOpen: false,
  data: null,
};

export default function Identity() {
  const { id } = useParams();
  const accessCodeUser = useRef('');
  const availableAtUser = useRef(0);
  const intl = useIntl();
  const [identityData, setIdentityData] = useState(null);
  const originIdentityData = useRef();
  const classes = useStyles();
  const [openDelete, setOpenDelete] = useState(initialValuePopupDelete);

  let [
    { data: getData, loading: getLoading, error: getError },
    executeGetData,
  ] = useAxios(`${ACCESS_CONTROL_API_SRC}/user-access/${id}/authentications`, {
    useCache: false,
    manual: true,
  });

  useEffect(() => {
    if (id) {
      updateAccessCodeAndAvaibleAtByIdUser();
      executeGetData();
    }
  }, [id]);
  useEffect(() => {
    if (getData) {
      accessCodeUser.current = getData.accessCode;
      if (getData.cards) {
        getData.cards = getData.cards.map((item, index) => ({
          ...item,
          key: index,
          isDisable: true,
        }));
      } else {
        getData.cards = [];
      }
    } else {
      getData = {
        cards: [],
      };
    }

    setIdentityData(getData);
    originIdentityData.current = getData;
  }, [getData]);
  useEffect(() => {
    if (getError) {
      if (getError.response?.status === 404) {
        setIdentityData({
          cards: [],
        });
      } else showError(getError);
    }
  }, [getError]);

  const onShowPopupConfirm = (data) => {
    if(data.cardNumber) {
      setOpenDelete({
        isOpen: true,
        ...data,
      });
    } else {
      onDeleteCard(data);
    }
  };

  const onDeleteCard = (data) => {
    if (identityData && identityData.cards) {
      if (data) {
        setIdentityData({
          ...identityData,
          cards: identityData.cards.filter((o) => o.key !== data.key),
        });
      } else {
        setIdentityData({
          ...identityData,
          cards: identityData.cards.filter((o) => o.key !== openDelete.key),
        });
      }
    }

    setOpenDelete(initialValuePopupDelete);
  };

  const handleCloseDelete = () => {
    setOpenDelete(initialValuePopupDelete);
  };

  const handleChangeIdentity = (e) => {
    const { name, checked } = e.target;
    if (identityData) {
      identityData[name] = checked;
      setIdentityData({ ...identityData });
    }
    console.log(`handleChangeIdentity ${name}, ${checked}`);
  };

  const actionRenderer = ({ data }) => (
    // <Fragment>
    <Tooltip title={intl.formatMessage({ id: 'app.tooltip.delete' })}>
      <IconButton
        onClick={() => {
          onShowPopupConfirm(data);
        }}
      >
        <ClearIcon fontSize="small" />
      </IconButton>
    </Tooltip>
    // </Fragment>
  );

  const onAddCard = () => {
    if (identityData && identityData.cards) {
      const data = {
        ...identityData,
        cards: [
          ...(identityData?.cards || []),
          {
            key:
              identityData.cards.length > 0
                ? identityData.cards[identityData.cards.length - 1].key + 1
                : 0,
            isDisable: false,
            availableAt: availableAtUser.current || Date.now(),
            userId: id,
          },
        ],
      };

      setIdentityData(data);
    }
  };

  const onHandleSubmit = () => {
    if (identityData && identityData.cards) {
      const listCardAssign = identityData.cards
        .filter((item) => item.cardStatus === 'NEW')
        .map((cardAssign) => ({
          availableAt: cardAssign.availableAt,
          cardId: cardAssign.cardId,
          userId: cardAssign.userId,
          cardUserType: detectUserType(accessCodeUser.current),
        }));
      const listCardOther = identityData.cards.filter(
        (item) => item.cardStatus != 'NEW',
      );

      const listIdCardReturn = originIdentityData.current.cards
        .filter((item) => {
          const resultFind = listCardOther.find(
            (it) => it.cardNumber === item.cardNumber,
          );
          return !resultFind;
        })
        .map((item) => item.cardId);

      callApiUpdateAuthenSettings({
        enableCardAuthen: identityData.isEnableCard || false,
        enableFaceAuthen: identityData.isEnableFace || false,
        enableFingerprintAuthen: identityData.isEnableFingerprint || false,
        listUpdateReturnCardIds: listIdCardReturn || [],
        listUpdateAssignCards: listCardAssign || [],
      });
    }
  };

  const updateAccessCodeAndAvaibleAtByIdUser = async () => {
    const res = await callApi(`${IAM_API_SRC}/users/${id}/detail`, 'GET', id);
    if (res && res.data) {
      accessCodeUser.current = res.data.accessCode;
      availableAtUser.current = res.data.availableAt;
    }
  };

  const callApiUpdateAuthenSettings = async (dto) => {
    setLoading(true);
    try {
      await callApi(
        `${ACCESS_CONTROL_API_SRC}/user-access/${id}/authen-settings`,
        'POST',
        dto,
      );
      utils.showToast('Cập nhật thành công');
      executeGetData();
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const callApiReturnCards = async (dto) => {
    setLoading(true);
    try {
      await callApi(`${IAM_API_SRC}/cards/return-back`, 'PUT', dto);
    } finally {
      setLoading(false);
    }
  };

  const callApiAssginCards = async (dto) => {
    setLoading(true);
    try {
      await callApi(`${IAM_API_SRC}/cards/assign`, 'POST', dto);
    } finally {
      setLoading(false);
    }
  };

  function detectUserType(accessCode) {
    if (accessCode && accessCode.startsWith('000')) {
      return 'USER';
    }
    return 'GUEST';
  }

  const faceDetails = identityData && (
    <div
      style={{
        border: '1px solid #f5f5fa',
        borderRadius: '6px',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontWeight: 500, fontSize: 20 }}>
          Thông tin định danh khuôn mặt
        </span>
        {identityData?.faces?.length > 0 && (
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={identityData?.isEnableFace}
                onChange={(e) => handleChangeIdentity(e)}
                name="isEnableFace"
              />
            }
          />
        )}
      </div>
      <div className="ct-flex-row">
        <div style={{ width: '80%' }}>
          <RenderDetails
            nopaper
            data={[
              {
                field: 'Thời gian cập nhật',
                width: 6,
                content: identityData?.faceIdentifyUpdatedAt
                  ? format(
                      new Date(identityData?.faceIdentifyUpdatedAt),
                      'HH:mm dd/MM/yyyy',
                    )
                  : '',
              },
              {
                field: 'Trạng thái',
                width: 6,
                content: identityData?.faces?.length
                  ? identityData?.isEnableFace
                    ? 'Hoạt động'
                    : 'Không hoạt động'
                  : 'Chưa định danh',
              },
            ]}
          />
        </div>
      </div>
      <div>
        {(identityData?.faces?.length && (
          <>
            <h4 style={{ fontSize: '16px' }}>Hình ảnh khuôn mặt</h4>
            <div style={{ display: 'flex' }}>
              <ImgCards data={identityData?.faces} imgTitle="Ảnh" />
            </div>
          </>
        )) ||
          null}
      </div>
    </div>
  );

  const fingerprintDetails = identityData && (
    <div
      style={{
        marginTop: 24,
        border: '1px solid #f5f5fa',
        borderRadius: '6px',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontWeight: 500, fontSize: 20 }}>
          Thông tin định danh vân tay
        </span>
        {identityData?.fingerprints?.length > 0 && (
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={identityData?.isEnableFingerprint}
                onChange={(e) => handleChangeIdentity(e)}
                name="isEnableFingerprint"
              />
            }
          />
        )}
      </div>
      <div className="ct-flex-row">
        <div style={{ width: '80%' }}>
          <RenderDetails
            nopaper
            data={[
              {
                field: 'Thời gian cập nhật',
                width: 6,
                content: identityData?.fingerIdentifyUpdatedAt
                  ? format(
                      new Date(identityData?.fingerIdentifyUpdatedAt),
                      'HH:mm dd/MM/yyyy',
                    )
                  : '',
              },
              {
                field: 'Trạng thái',
                width: 6,
                content: identityData?.fingerprints?.length
                  ? identityData?.isEnableFingerprint
                    ? 'Hoạt động'
                    : 'Không hoạt động'
                  : 'Chưa định danh',
              },
            ]}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          height: '300px',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <img
          src={fingerprintImg}
          alt="Ảnh vân tay"
          style={{
            width: '200px',
            height: '200px',
          }}
        />

        <span style={{ marginTop: '10px' }}>
          {identityData?.fingerprints?.length
            ? `Đã có ${identityData?.fingerprints?.length} vân tay được định danh`
            : 'Chưa có định danh vân tay cho người này'}
        </span>
      </div>
    </div>
  );

  const onClickChangeCard = (item, newValue) => {
    if (identityData && identityData.cards) {
      let indexChange;
      const itemChange = identityData.cards.find((e, index) => {
        indexChange = index;
        return e?.key === item?.key;
      });
      if (itemChange) {
        const newCarsArr = [...identityData.cards];
        newCarsArr[indexChange] = {
          ...itemChange,
          ...newValue,
        };

        console.log(`item change ${JSON.stringify(newCarsArr[indexChange])}`);

        setIdentityData({
          ...identityData,
          cards: [...newCarsArr],
        });
      }
    }
  };

  const cardDetails = identityData && (
    <div
      style={{
        border: '1px solid #f5f5fa',
        borderRadius: '6px',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontWeight: 500, fontSize: 20 }}>
          Danh sách thẻ
          {identityData?.cards?.length ? ` (${identityData.cards.length})` : ''}
        </span>
        <div>
          {identityData?.cards?.length > 0 && (
            <div>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={identityData?.isEnableCard}
                    onChange={(e) => handleChangeIdentity(e)}
                    name="isEnableCard"
                  />
                }
              />
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'right',
        }}
      >
        <div>
          <label
            style={{
              marginTop: '4px',
              padding: 0,
              color: 'blue',
            }}
          >
            Thêm thẻ
          </label>
          <IconButton
            size="small"
            onClick={() => {
              onAddCard();
            }}
          >
            <AddIcon fontSize="inherit" />
          </IconButton>
        </div>
      </div>

      <CustomTable
        data={identityData?.cards || []}
        disabledSelect
        height={333}
        row={[
          {
            caption: 'STT',
            cellRender: (item) =>
              item.rowIndex +
              item.component.pageIndex() * item.component.pageSize() +
              1,
            alignment: 'center',
            width: 50,
          },
          {
            caption: 'Thời gian',
            dataType: 'datetime',
            format: 'HH:mm:ss dd/MM/yyyy',
            width: '30%',
            alignment: 'center',
            cellRender: (v) => (
              <DateTimePicker
                variant="inline"
                disabled
                fullWidth
                inputVariant="outlined"
                format="HH:mm - dd/MM/yyyy"
                value={v.data.availableAt}
                inputProps={{
                  style: {
                    height: 5,
                  },
                }}
              />
            ),
          },
          {
            caption: 'Mã số thẻ',
            width: '30%',
            alignment: 'center',
            cellRender: (v) => (
              <VAutocomplete
                defaultValue={v.data || undefined}
                disableClearable
                disabled={v.data.isDisable}
                firstIndex={1}
                loadData={(page, keyword) =>
                  new Promise((resolve, reject) => {
                    getApi(`${IAM_API_SRC}/cards/search`, {
                      keyword,
                      limit: 50,
                      page,
                    })
                      .then((result) => {
                        if (identityData && identityData.cards) {
                          const mapExistCardNumIds = identityData.cards
                            .map((item) => item.cardId)
                            .reduce((map, obj) => {
                              map[obj] = true;
                              return map;
                            }, {});

                          resolve({
                            data: result.data?.rows?.filter(
                              (card) =>
                                card.cardStatus === 'NEW' &&
                                mapExistCardNumIds[card.cardId] !== true,
                            ),
                            totalCount: result.data?.count,
                          });
                        }
                      })

                      .catch((err) => reject(err));
                  })
                }
                getOptionLabel={(option) => (option ? option.cardNumber : '')}
                getOptionSelected={(option, selected) =>
                  option.cardId === selected.cardId
                }
                onChange={(e, newVal) => onClickChangeCard(v.data, newVal)}
              />
            ),
          },
          {
            dataField: 'cardStatus',
            caption: 'Trạng thái',
            alignment: 'center',
            width: '30%',
            cellRender: (v) => (
              <div>
                {v.data && v.data.cardStatus
                  ? messageStatusCard[v.data.cardStatus]
                  : ''}
              </div>
            ),
          },
          {
            caption: 'Hành động',
            cellRender: actionRenderer,
            width: '10%',
            alignment: 'center',
          },
        ]}
      />
    </div>
  );

  if (identityData && identityData.cards) {
    console.log(`render ${identityData.cards.length}`);
  }

  return (
    <Paper className={classes.paper}>
      <PageHeader title="Thông tin định danh">
        <>
          <Button
            variant="contained"
            color="default"
            onClick={() => {
              executeGetData();
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onHandleSubmit();
            }}
          >
            Lưu
          </Button>
        </>
      </PageHeader>

      {getLoading && <Loading />}
      {faceDetails}
      {fingerprintDetails}
      {cardDetails}

      {openDelete?.isOpen && (
        <Popup
          className="popup"
          visible
          title="Xóa thẻ"
          showTitle
          onHidden={() => {
            setOpenDelete(initialValuePopupDelete);
          }}
          dragEnabled
          width={600}
          height={180}
        >
          <Delete
            isDeleteUser
            btnConfirm={onDeleteCard}
            close={handleCloseDelete}
            text={`${openDelete?.cardNumber} sẽ bị xóa khỏi định danh của người dùng này.
              Bạn có chắc chắn xóa?`}
          />
        </Popup>
      )}
    </Paper>
  );
}
