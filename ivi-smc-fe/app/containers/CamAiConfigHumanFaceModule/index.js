/**
 *
 * CamAiConfigHumanFaceModule
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import ClearIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { compose } from 'redux';
import * as yup from 'yup';
import BtnCancel from 'components/Button/BtnCancel';
import BtnSuccess from 'components/Button/BtnSuccess';
import { Button } from 'devextreme-react';
import styled from 'styled-components';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { useHistory, useParams } from 'react-router-dom';
import { FormHelperText, Grid, Paper } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import EditIcon from '@material-ui/icons/Edit';
import Loading from 'containers/Loading/Loadable';
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  Sorting,
} from 'devextreme-react/data-grid';
import CustomTextField from './components/CustomTextField';
import makeSelectCamAiConfigHumanFaceModule from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';
import PageHeader from '../../components/PageHeader';
import { useStyles } from './styled';
import CustomSelect from './components/CustomSelect';
import IconBtn from '../../components/Custom/IconBtn';
import CustomTextArea from './components/CustomTextArea';
import ConfigNewCamera from './dialogs/ConfigNewCamera';
import { getApi, postApi, putApi } from '../../utils/requestUtils';
import { CAMERA_AI_API_SRC, CAM_AI_CONFIG_HUMAN_MODULE } from '../apiUrl';
import { showError, showSuccess } from '../../utils/toast-utils';
// import { FAKE_DATA } from './constants';
import PopupDelete from '../../components/Custom/popup/PopupDelete';

const key = 'camAiConfigHumanFaceModule';

const typeProcess = 'vsmhumanface'; // Man khac xem data de thay doi

const initValues = {
  name: null,
  versionFile: null,
  minio: null,
  minioBucket: null,
  kafka: null,
  kafkaTopic: 'UAT_TNP_FACE_REQUEST',
  // kafkaTopicHuman: null,
  // kafkaTopicVinAI: null,
  cam_infor: [],
  devconfig: null,
};

export function CamAiConfigHumanFaceModule() {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const { humanFaceId, edgeId } = useParams();
  const history = useHistory();
  const intl = useIntl();
  const classes = useStyles();

  const [rawMode, setRawMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingFileVersion, setLoadingFileVersion] = useState(false);
  const [loadingMinioStorage, setLoadingMinioStorage] = useState(false);
  const [loadingMinioBuckets, setLoadingMinioBuckets] = useState(false);
  const [loadingKafkaIp, setLoadingKafkaIp] = useState(false);

  const [fileVersions, setFileVersions] = useState([]);
  const [minioStorages, setMinioStorages] = useState([]);
  const [minioBuckets, setMinioBuckets] = useState([]);
  const [kafkaIps, setKafkaIps] = useState([]);

  const [isOpenAddCamPopup, setIsOpenAddCamPopup] = useState(false);

  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
  const [editData, setEditData] = useState(null);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [detail, setDetail] = useState(null);

  const useYupValidationResolver = validationSchema =>
    useCallback(
      async data => {
        try {
          const values = await validationSchema.validate(data, {
            abortEarly: false,
          });

          return {
            values,
            errors: {},
          };
        } catch (errors) {
          return {
            values: {},
            errors: errors.inner.reduce(
              (allErrors, currentError) => ({
                ...allErrors,
                [currentError.path]: {
                  type: currentError.type ?? 'validation',
                  message: currentError.message,
                },
              }),
              {},
            ),
          };
        }
      },
      [schema],
    );

  const schema = yup.object({
    name: yup
      .string()
      .trim()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    versionFile: yup
      .object()
      .shape()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    minio: !rawMode
      ? yup
          .object()
          .shape()
          .nullable()
          .required('Trường này bắt buộc nhập')
      : false,
    minioBucket: !rawMode
      ? yup
          .object()
          .shape()
          .nullable()
          .required('Trường này bắt buộc nhập')
      : false,
    kafka: !rawMode
      ? yup
          .object()
          .shape()
          .nullable()
          .required('Trường này bắt buộc nhập')
      : false,
    kafkaTopic: !rawMode
      ? yup
          .string()
          .trim()
          .nullable()
          .required('Trường này bắt buộc nhập')
      : false,
    // kafkaTopicHuman: !rawMode
    //   ? yup
    //       .string()
    //       .trim()
    //       .nullable()
    //       .required('Trường này bắt buộc nhập')
    //   : false,
    // kafkaTopicVinAI: !rawMode
    //   ? yup
    //       .string()
    //       .trim()
    //       .nullable()
    //       .required('Trường này bắt buộc nhập')
    //   : false,
    cam_infor: !rawMode ? yup.array().min(1, 'Bắt buộc add camera') : false,
    devconfig: yup
      .string()
      .trim()
      .nullable()
      .test('json', 'Invalid JSON format', value => {
        let item = typeof value !== 'string' ? JSON.stringify(value) : value;
        try {
          item = JSON.parse(item);
        } catch (e) {
          return false;
        }
        if (typeof item === 'object' && item !== null) {
          return true;
        }
        return false;
      })
      .required('Trường này bắt buộc nhập'),
  });

  const resolver = useYupValidationResolver(schema);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: initValues,
    resolver,
    mode: 'onChange',
  });

  const convertConfig = config => {
    if (rawMode) {
      return { ...JSON.parse(config.devconfig), rawMode: true };
    }
    const tmpData = {
      ...config,
      devconfig: JSON.parse(config.devconfig),
      kmsdisplay: false, // khong biet truong gi nhung o con truoc co
      kafka: {
        ...config.kafka, // cac truong chi dung de hien thi khi update
        address: `${config.kafka?.host || ''}:${config.kafka?.port || ''}`, // truong dung de config
        topic_face: config.kafkaTopic, // truong dung de config
        // topic_human: config.kafkaTopicHuman, // truong dung de config
        // topic_vinai: config.kafkaTopicVinAI, // truong dung de config
      },
      minio: {
        ...config.minio, // cac truong chi dung de hien thi khi update
        access_key: config.minio?.username, // truong dung de config
        address: `http://${config.minio?.host || ''}:${
          config.minio?.port || '' // truong dung de config
        }`,
        secret_key: config.minio?.password, // truong dung de config
        bucket: config.minioBucket.name, // truong dung de config
      },
    };
    return tmpData;
  };

  const onSubmit = values => {
    const { name, versionFile, ...config } = values;
    const payload = {
      name,
      versionFileId: versionFile.id,
      config: JSON.stringify(convertConfig(config)),
      typeProcess,
      fpgaManagerId: edgeId,
    };
    if (humanFaceId) {
      handleUpdate(payload);
    } else {
      handleCreate(payload);
    }
  };

  const onBack = () => {
    history.push(`/camera-ai/configs/edge/${edgeId}/processes`);
  };

  const handleAddCam = val => {
    const { fps, ...other } = val;
    other.camera.fps = fps;
    other.camera.camName = other.camera.camName || other.camera.deviceName;
    other.camera.camId = other.camera.camId || other.camera.deviceId;
    // some hardcode value -> BE request
    other.camera.modeProcess = 1;
    other.camera.vinai = false;
    other.camera.violentType = [];

    setValue('cam_infor', [...getValues().cam_infor, other.camera]);
    setIsOpenAddCamPopup(false);
  };

  const handleEditCam = val => {
    const cloneCameras = getValues().cam_infor;
    const { index, fps, ...other } = val;
    other.camera.fps = fps;
    other.camera.camName = other.camera.camName || other.camera.deviceName;
    other.camera.camId = other.camera.camId || other.camera.id;
    // some hardcode value -> BE request
    other.camera.modeProcess = 1;
    other.camera.vinai = false;
    other.camera.violentType = [];

    cloneCameras[val.index] = other.camera;
    setValue('cam_infor', [...cloneCameras]);
    setEditData(null);
    setIsOpenEditPopup(false);
  };

  const handleDelete = () => {
    const cloneCameras = getValues().cam_infor.filter(
      (cam, index) => index != deleteIndex,
    );
    setValue('cam_infor', [...cloneCameras]);
    setDeleteIndex(null);
    setIsOpenDeletePopup(false);
  };

  const handleChangeRawMode = () => {
    if (humanFaceId && detail) {
      const tmp = { ...detail };
      const config = JSON.parse(tmp.config);
      if (rawMode) {
        if (config.devconfig) {
          const devConfig = JSON.stringify(config.devconfig, undefined, '\t');
          setValue('devconfig', devConfig);
        }
      } else {
        setValue('devconfig', JSON.stringify(config, undefined, '\t'));
      }
    }
    setRawMode(!rawMode);
  };

  const fetchFileVersions = async () => {
    setLoadingFileVersion(true);
    try {
      const res = await getApi(
        CAM_AI_CONFIG_HUMAN_MODULE.GET_FILE_VERSIONS(edgeId),
      );
      setFileVersions(res?.data?.versionFile || []);
      setLoadingFileVersion(false);
    } catch (error) {
      showError(error);
      setLoadingFileVersion(false);
    }
  };

  const fetchMinioStorages = async () => {
    setLoadingMinioStorage(true);
    try {
      const res = await getApi(`${CAMERA_AI_API_SRC}/server-infor`, {
        type: 'minio',
      });
      setMinioStorages(res?.data?.rows || []);
      setLoadingMinioStorage(false);
    } catch (error) {
      showError(error);
      setLoadingMinioStorage(false);
    }
  };

  const fetchKafkaIps = async () => {
    setLoadingKafkaIp(true);
    try {
      const res = await getApi(`${CAMERA_AI_API_SRC}/server-infor`, {
        type: 'kafka',
      });
      setKafkaIps(res?.data?.rows || []);
      setLoadingKafkaIp(false);
    } catch (error) {
      showError(error);
      setLoadingKafkaIp(false);
    }
  };

  const fetchMinioBucket = async id => {
    if (isFirstLoad) {
      return;
    }
    setLoadingMinioBuckets(true);
    setValue('minioBucket', null);
    setMinioBuckets([]);
    try {
      const res = await getApi(CAM_AI_CONFIG_HUMAN_MODULE.GET_MINIOS(id));
      setMinioBuckets(res?.data || []);
      setLoadingMinioBuckets(false);
    } catch (error) {
      showError(error);
      setLoadingMinioBuckets(false);
    }
  };

  const fetchDetail = async () => {
    try {
      const res = await getApi(
        CAM_AI_CONFIG_HUMAN_MODULE.GET_FPGA_PROCESS(humanFaceId),
      );
      return res.data;
      // return await FAKE_DATA;
    } catch (error) {
      showError(error);
      return null;
      // eslint-disable-next-line no-return-await
      // return await FAKE_DATA;
    }
  };

  const handleCreate = value => {
    setLoading(true);
    postApi(CAM_AI_CONFIG_HUMAN_MODULE.ADD_FPGA_PROCESS, value)
      .then(() => {
        showSuccess('Tạo mới thành công');
        onBack();
      })
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdate = value => {
    setLoading(true);
    putApi(CAM_AI_CONFIG_HUMAN_MODULE.UPDATE_FPGA_PROCESS(humanFaceId), value)
      .then(() => {
        showSuccess('Cập nhật thành công');
        // fetchDetail();
        onBack();
      })
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onResetForm = async () => {
    const detail = await fetchDetail();
    setDetail(detail);
    const config = JSON.parse(detail.config);
    let devConfig = JSON.stringify(config.devconfig, undefined, '\t');
    if (config.rawMode) {
      const mode = config.rawMode;
      delete config.rawMode;
      devConfig = JSON.stringify(config, undefined, '\t');
      setRawMode(mode);
    }
    reset({
      name: detail.name,
      versionFile: detail.versionFile,
      minio: config.minio || null,
      minioBucket: config.minioBucket || null,
      kafka: config.kafka || null,
      kafkaTopic: config.kafkaTopic || null,
      // kafkaTopicHuman: config.kafkaTopicHuman,
      // kafkaTopicVinAI: config.kafkaTopicVinAI,
      cam_infor: config.cam_infor || [],
      devconfig: devConfig, // Cho no gian cach dong
    });
  };

  const deletePopup = () => (
    <PopupDelete
      onClickSave={() => handleDelete()}
      title="Delete camera"
      textFollowTitle="Are you sure you want to delete this camera?"
      closeTxt="Cancel"
      saveTxt="Delete"
      onClose={() => {
        setDeleteIndex(null);
        setIsOpenDeletePopup(false);
      }}
    />
  );

  useEffect(() => {
    setIsFirstLoad(false);
  }, []);

  useEffect(() => {
    fetchFileVersions();
    fetchMinioStorages();
    fetchKafkaIps();
  }, [edgeId]);

  useEffect(() => {
    if (humanFaceId) onResetForm();
  }, [humanFaceId]);

  const renderActionCell = ({ data, rowIndex }) => {
    const detailData = { ...data, index: rowIndex };
    return (
      <React.Fragment>
        <div className="center-content">
          <IconBtn
            icon={<EditIcon fontSize="small" />}
            onClick={() => {
              setEditData(detailData);
              setIsOpenEditPopup(true);
            }}
            showTooltip={intl.formatMessage({
              id: 'app.tooltip.edit',
            })}
          />
          <IconBtn
            icon={<ClearIcon fontSize="small" />}
            onClick={() => {
              setDeleteIndex(rowIndex);
              setIsOpenDeletePopup(true);
            }}
            showTooltip={intl.formatMessage({
              id: 'app.tooltip.delete',
            })}
          />
        </div>
      </React.Fragment>
    );
  };
  const columns = [
    {
      dataField: 'camName',
      caption: 'Camera name',
      alignment: 'left',
      cssClass: 'valign-left',
    },
    {
      caption: 'Action',
      alignment: 'center',
      cellRender: renderActionCell,
    },
  ];

  return (
    <React.Fragment>
      <Helmet>
        <title>Human Face Module - vsmhumanface</title>
        <meta name="description" content="Human Face Module" />
      </Helmet>
      {loading && <Loading />}
      <PageHeader
        title={
          humanFaceId ? `Edit process: 'EDGE_Humanface'` : 'Create new process'
        }
        showBackButton
        onBack={() => {
          onBack();
        }}
      >
        <BtnCancel
          id="btnClsoe"
          text="Cancel"
          onClick={() => {
            onBack();
          }}
          style={{ marginRight: '16px', fontWeight: '500' }}
        />
        <BtnSuccess
          type="success"
          id="btnSaveAndContinue"
          text="Save"
          onClick={handleSubmit(onSubmit)}
        />
      </PageHeader>
      <form className={classes.root}>
        <Paper>
          <Grid container spacing={2}>
            <Grid item container xs={6} justify="flex-start">
              <p style={{ fontSize: '20px', margin: '0' }}>Human Face Module</p>
            </Grid>
            <Grid item container xs={6} justify="flex-end">
              <Button
                type="success"
                text="Raw config mode"
                style={{
                  background: '#fff',
                  color: '#117B5B',
                  border: '2px solid #117B5B',
                  fontWeight: '600',
                  borderRadius: '10px',
                }}
                onClick={() => handleChangeRawMode()}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <p className={classes.label}>
                Instance name <span style={{ color: 'red' }}>*</span>
              </p>
              <CustomTextField control={control} errors={errors} name="name" />
            </Grid>
            <Grid item xs={4}>
              <p className={classes.label}>
                File version<span style={{ color: 'red' }}>*</span>
              </p>
              <CustomSelect
                control={control}
                errors={errors}
                name="versionFile"
                noOptionsText="Không có dữ liệu"
                getOptionLabel={option => option?.name || ''}
                getOptionSelected={(option, selected) =>
                  option.id === selected.id
                }
                options={fileVersions}
                showloading={loadingFileVersion}
              />
            </Grid>
            {!rawMode && (
              <React.Fragment>
                <Grid item container spacing={3}>
                  <Grid item xs={12}>
                    <p className={classes.label}>
                      Minio storage <span style={{ color: 'red' }}>*</span>
                    </p>
                  </Grid>
                  <Grid item xs={4}>
                    <CustomSelect
                      control={control}
                      errors={errors}
                      name="minio"
                      noOptionsText="Không có dữ liệu"
                      getOptionLabel={option => option?.host || ''}
                      getOptionSelected={(option, selected) =>
                        option.id === selected.id
                      }
                      options={minioStorages}
                      showloading={loadingMinioStorage}
                      handleChange={fetchMinioBucket}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomSelect
                      control={control}
                      errors={errors}
                      name="minioBucket"
                      noOptionsText="Không có dữ liệu"
                      getOptionLabel={option => option?.name || ''}
                      getOptionSelected={(option, selected) =>
                        option.name === selected.name
                      }
                      options={minioBuckets}
                      showloading={loadingMinioBuckets}
                    />
                  </Grid>
                </Grid>
                <Grid item container spacing={3}>
                  <Grid item xs={12}>
                    <p className={classes.label}>KAFKA</p>
                  </Grid>
                  <Grid item container spacing={3}>
                    <Grid item container spacing={3}>
                      <Grid item xs={4}>
                        <p className={classes.label}>
                          IP <span style={{ color: 'red' }}>*</span>
                        </p>
                        <CustomSelect
                          control={control}
                          errors={errors}
                          name="kafka"
                          noOptionsText="Không có dữ liệu"
                          getOptionLabel={option => option?.host || ''}
                          getOptionSelected={(option, selected) =>
                            option.id === selected.id
                          }
                          options={kafkaIps}
                          showloading={loadingKafkaIp}
                        />
                      </Grid>
                    </Grid>
                    <Grid item container spacing={3}>
                      <Grid item xs={4}>
                        <p className={classes.label}>
                          Topic <span style={{ color: 'red' }}>*</span>
                        </p>
                        <CustomTextField
                          control={control}
                          errors={errors}
                          name="kafkaTopic"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <p className={classes.label}>
                    CAMERAS <span style={{ color: 'red' }}>*</span>
                  </p>
                  <Controller
                    control={control}
                    name="cam_infor"
                    defaultValue=""
                    render={props => (
                      <TableCustomWrap>
                        <DataGrid
                          dataSource={props.value || []}
                          columnAutoWidth
                          style={{
                            maxHeight: `500px`,
                          }}
                          showRowLines={false}
                          showColumnLines={false}
                          onRowPrepared={e => {
                            e.rowElement.style.height = '56px';
                            if (e.rowType == 'header') {
                              e.rowElement.style.backgroundColor =
                                'rgba(194, 207, 224, 0.08)';
                            } else {
                              e.rowElement.style.backgroundColor =
                                e.rowIndex % 2 ? '#F2F5F7' : '#FFFFFF';
                            }
                          }}
                        >
                          <Sorting mode="none" />
                          <Paging enabled={false} />
                          <Scrolling mode="infinite" />
                          {/* <LoadPanel enabled={false} /> */}
                          {(columns || []).map(defs => (
                            <Column
                              {...defs}
                              key={defs.dataField || Math.random()}
                            />
                          ))}
                        </DataGrid>
                      </TableCustomWrap>
                    )}
                  />
                  {errors.cam_infor && (
                    <FormHelperText style={{ color: '#f44336' }}>
                      {errors.cam_infor.message}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="success"
                    text="Config new camera"
                    className={classes.btnRawConfig}
                    onClick={() => {
                      setIsOpenAddCamPopup(true);
                    }}
                  />
                </Grid>
              </React.Fragment>
            )}
            <Grid item xs={12}>
              <p className={classes.label}>
                {rawMode ? 'Config' : 'Dev config'}
                <span style={{ color: 'red' }}>*</span>
              </p>
              <CustomTextArea
                control={control}
                errors={errors}
                name="devconfig"
                rowsMin={15}
              />
            </Grid>
          </Grid>
        </Paper>
      </form>
      {isOpenAddCamPopup && (
        <ConfigNewCamera
          onClose={() => {
            setIsOpenAddCamPopup(false);
          }}
          submit={handleAddCam}
          data={null}
          selectedCams={getValues().cam_infor}
        />
      )}
      {isOpenEditPopup && (
        <ConfigNewCamera
          onClose={() => {
            setEditData(null);
            setIsOpenEditPopup(false);
          }}
          submit={handleEditCam}
          data={editData}
          selectedCams={getValues().cam_infor}
        />
      )}
      {isOpenDeletePopup && deletePopup()}
    </React.Fragment>
  );
}

const TableCustomWrap = styled.div`
  .dx-datagrid-nodata {
    display: none
  }
  .dx-datagrid-content {
    .dx-datagrid-table {
      tbody {
        tr {
          //  height:56px;
        }
        td {
          &[role="columnheader"] {
            .dx-datagrid-text-content {
              font-family: Roboto;
              font-style: normal;
              font-weight: bold;
              font-size: 14px;
              color: rgba(37, 37, 37, 0.6);
              text-align: left;
            }
          }
          font-weight: 400;
          vertical-align: middle;
        }
        }
      }
    }
  }
  .dx-datagrid-search-text {
    color: #109CF1;
    background-color: transparent;
  }
`;
CamAiConfigHumanFaceModule.propTypes = {};

const mapStateToProps = createStructuredSelector({
  camAiConfigHumanFaceModule: makeSelectCamAiConfigHumanFaceModule(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(CamAiConfigHumanFaceModule);
