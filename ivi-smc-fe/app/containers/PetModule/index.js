import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import ClearIcon from '@material-ui/icons/DeleteOutlineOutlined';
import * as yup from 'yup';
import BtnCancel from 'components/Button/BtnCancel';
import BtnSuccess from 'components/Button/BtnSuccess';
import { Button } from 'devextreme-react';
import styled from 'styled-components';
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
import PageHeader from '../../components/PageHeader';
import { useStyles } from './styled';
import CustomSelect from './components/CustomSelect';
import IconBtn from '../../components/Custom/IconBtn';
import CustomTextArea from './components/CustomTextArea';
import ConfigNewCamera from './dialogs/ConfigNewCamera';
import { getApi, postApi, putApi } from '../../utils/requestUtils';
import { API_ROUTE, CAM_AI_CONFIG_HUMAN_MODULE } from '../apiUrl';
import { showError, showSuccess } from '../../utils/toast-utils';
import PopupDelete from '../../components/Custom/popup/PopupDelete';

const typeProcess = 'vsmpet';

const initValues = {
  name: null,
  versionFile: null,
  minioIp: null,
  minioBucket: null,
  kafkaIp: null,
  kafkaTopicFace: null,
  kafkaTopicHuman: null,
  kafkaTopicVinAI: null,
  cameras: [],
  devConfig: null,
};

export default function PetModule() {
  const { petId, edgeId } = useParams();
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
    minioIp: !rawMode
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
    kafkaIp: !rawMode
      ? yup
          .object()
          .shape()
          .nullable()
          .required('Trường này bắt buộc nhập')
      : false,
    kafkaTopicFace: !rawMode
      ? yup
          .string()
          .trim()
          .nullable()
          .required('Trường này bắt buộc nhập')
      : false,
    kafkaTopicHuman: !rawMode
      ? yup
          .string()
          .trim()
          .nullable()
          .required('Trường này bắt buộc nhập')
      : false,
    kafkaTopicVinAI: !rawMode
      ? yup
          .string()
          .trim()
          .nullable()
          .required('Trường này bắt buộc nhập')
      : false,
    cameras: !rawMode ? yup.array().min(1, 'Bắt buộc add camera') : false,
    devConfig: yup
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
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: initValues,
    resolver,
    mode: 'onChange',
  });

  const watchFields = watch(['minioIp']);

  const onSubmit = values => {
    const { name, versionFile, ...config } = values;
    const payload = {
      name,
      versionFileId: versionFile.id,
      config: JSON.stringify(config),
      typeProcess,
      fpgaManagerId: edgeId,
    };
    if (petId) {
      handleUpdate(payload);
    } else {
      handleCreate(payload);
    }
  };

  const onBack = () => {
    history.goBack();
  };

  const handleAddCam = val => {
    const { fps, ...other } = val;
    other.camera.fps = fps;
    other.camera.camName = other.camera.camName || other.camera.deviceName;
    setValue('cameras', [...getValues().cameras, other.camera]);
    setIsOpenAddCamPopup(false);
  };

  const handleEditCam = val => {
    const cloneCameras = getValues().cameras;
    const { index, fps, ...other } = val;
    other.camera.fps = fps;
    other.camera.camName = other.camera.camName || other.camera.deviceName;
    cloneCameras[val.index] = other.camera;
    setValue('cameras', [...cloneCameras]);
    setEditData(null);
    setIsOpenEditPopup(false);
  };
  const handleDelete = () => {
    const cloneCameras = getValues().cameras.filter(
      (cam, index) => index != deleteIndex,
    );
    setValue('cameras', [...cloneCameras]);
    setDeleteIndex(null);
    setIsOpenDeletePopup(false);
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
      const res = await getApi(API_ROUTE.CAMERA_AI_SERVER_INFORMATION, {
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
      const res = await getApi(API_ROUTE.CAMERA_AI_SERVER_INFORMATION, {
        type: 'kafka',
      });
      setKafkaIps(res?.data?.rows || []);
      setLoadingKafkaIp(false);
    } catch (error) {
      showError(error);
      setLoadingKafkaIp(false);
    }
  };

  const fetchMinioBucket = async () => {
    setLoadingMinioBuckets(true);
    try {
      const res = await getApi(
        CAM_AI_CONFIG_HUMAN_MODULE.GET_MINIOS(watchFields.minioIp.id),
      );
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
        CAM_AI_CONFIG_HUMAN_MODULE.GET_FPGA_PROCESS(petId),
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
    putApi(CAM_AI_CONFIG_HUMAN_MODULE.UPDATE_FPGA_PROCESS(petId), value)
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
    const config = JSON.parse(detail.config);
    const devConfigObj = JSON.parse(config.devConfig);

    reset({
      name: detail.name,
      versionFile: detail.versionFile,
      minioIp: config.minioIp,
      minioBucket: config.minioBucket,
      kafkaIp: config.kafkaIp,
      kafkaTopicFace: config.kafkaTopicFace,
      kafkaTopicHuman: config.kafkaTopicHuman,
      kafkaTopicVinAI: config.kafkaTopicVinAI,
      cameras: config.cameras,
      devConfig: JSON.stringify(devConfigObj, undefined, '\t'), // Cho no gian cach dong
    });
  };

  const deletePopup = () => (
    <PopupDelete
      onClickSave={() => handleDelete()}
      typeTxt="Camera"
      onClose={() => {
        setDeleteIndex(null);
        setIsOpenDeletePopup(false);
      }}
    />
  );

  useEffect(() => {
    if (watchFields?.minioIp?.id) fetchMinioBucket();
  }, [watchFields.minioIp]);

  useEffect(() => {
    fetchFileVersions();
    fetchMinioStorages();
    fetchKafkaIps();
  }, [edgeId]);

  useEffect(() => {
    if (petId) onResetForm();
  }, [petId]);

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
        <title>Pet Module - vsmpet</title>
        <meta name="description" content="Pet Module" />
      </Helmet>
      {loading && <Loading />}
      <PageHeader
        title={petId ? `Edit process: 'EDGE_PetModule'` : 'Create new process'}
        showBackButton
        onBack={() => {
          onBack();
        }}
      >
        <Button
          type="success"
          text="Raw config mode"
          style={{
            background: `${rawMode ? '#00554a' : '#fff'}`,
            color: `${rawMode ? '#fff' : '#000'}`,
            borderRadius: '8px !important',
            '&:hover': {
              opacity: '0.9',
              boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
              background: '#00554a',
            },
          }}
          onClick={() => setRawMode(!rawMode)}
        />
      </PageHeader>
      <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
        <Paper>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <p className={classes.label}>
                Instance name <span style={{ color: 'red' }}>*</span>
              </p>
              <CustomTextField control={control} errors={errors} name="name" />
            </Grid>
            <Grid item xs={12}>
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
                <Grid item xs={12} container>
                  <Grid item xs={12}>
                    <p className={classes.label}>
                      Minio storage <span style={{ color: 'red' }}>*</span>
                    </p>
                  </Grid>
                  <Grid item xs={12} sm={6} style={{ paddingRight: '24px' }}>
                    <CustomSelect
                      control={control}
                      errors={errors}
                      name="minioIp"
                      noOptionsText="Không có dữ liệu"
                      getOptionLabel={option => option?.host || ''}
                      getOptionSelected={(option, selected) =>
                        option.id === selected.id
                      }
                      options={minioStorages}
                      showloading={loadingMinioStorage}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} style={{ paddingLeft: '24px' }}>
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
                <Grid item xs={12} container>
                  <Grid item xs={12}>
                    <p className={classes.label}>
                      KAFKA <span style={{ color: 'red' }}>*</span>
                    </p>
                  </Grid>
                  <Grid container style={{ paddingLeft: '50px' }} spacing={3}>
                    <Grid item xs={12}>
                      <p className={classes.label}>
                        IP <span style={{ color: 'red' }}>*</span>
                      </p>
                      <CustomSelect
                        control={control}
                        errors={errors}
                        name="kafkaIp"
                        noOptionsText="Không có dữ liệu"
                        getOptionLabel={option => option?.host || ''}
                        getOptionSelected={(option, selected) =>
                          option.id === selected.id
                        }
                        options={kafkaIps}
                        showloading={loadingKafkaIp}
                      />
                    </Grid>
                    <Grid item xs={12} container>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        style={{ paddingRight: '16px' }}
                      >
                        <p className={classes.label}>
                          Topic face <span style={{ color: 'red' }}>*</span>
                        </p>
                        <CustomTextField
                          control={control}
                          errors={errors}
                          name="kafkaTopicFace"
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        style={{ paddingRight: '16px' }}
                      >
                        <p className={classes.label}>
                          Topic human <span style={{ color: 'red' }}>*</span>
                        </p>
                        <CustomTextField
                          control={control}
                          errors={errors}
                          name="kafkaTopicHuman"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <p className={classes.label}>
                          Topic VinAi<span style={{ color: 'red' }}>*</span>
                        </p>
                        <CustomTextField
                          control={control}
                          errors={errors}
                          name="kafkaTopicVinAI"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <p className={classes.label}>CAMERAS</p>
                  <Controller
                    control={control}
                    name="cameras"
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
                  {errors.cameras && (
                    <FormHelperText style={{ color: '#f44336' }}>
                      {errors.cameras.message}
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
                name="devConfig"
                rowsMin={15}
              />
            </Grid>
            <Grid item container xs={12} justify="flex-end">
              <BtnCancel
                id="btnClsoe"
                text={intl.formatMessage({
                  id: 'app.button.cancel',
                })}
                onClick={() => {}}
                style={{ marginRight: '16px' }}
              />
              <BtnSuccess
                type="success"
                id="btnSaveAndContinue"
                text={intl.formatMessage({
                  id: 'app.title.confirm',
                })}
                useSubmitBehavior
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
