/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React, { useState, useEffect } from 'react';
// import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { DialogActions } from '@material-ui/core';
import CustomSelect from 'containers/CamAiConfigHumanFaceModule/components/CustomSelect';
import CustomUploadFile from 'containers/CamAiConfigHumanFaceModule/components/CustomUploadFile';
import { validationSchema } from 'utils/utils';
import { showError } from 'utils/toast-utils';
import * as yup from 'yup';
import { Popup, ScrollView } from 'devextreme-react';
import BtnCancel from 'components/Button/BtnCancel';
import BtnSuccess from 'components/Button/BtnSuccess';
import { CAMERA_AI_API_SRC } from '../../../../../apiUrl';
import { getApi } from '../../../../../../utils/requestUtils';
import CustomTextArea from '../../../../../CamAiConfigHumanFaceModule/components/CustomTextArea';
import { useStyles } from '../../styled';

const initValues = {
  baseVersion: null,
  fileVersion: null,
  defaultConfig: null,
  description: null,
};

const PopupFormOsFile = ({
  isAdd,
  itemDevice,
  emgineTypeId,
  onClose,
  onClickSave,
}) => {
  // const intl = useIntl();
  const classes = useStyles();
  const [baseVersios, setBaseVersions] = useState([]);

  const schema = validationSchema({
    baseVersion: yup
      .object()
      .shape()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    fileVersion: yup.mixed().required('Trường này bắt buộc nhập'),
    defaultConfig: yup
      .string()
      .trim()
      .nullable()
      .test('json', 'Invalid JSON format', (value) => {
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

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: initValues,
    resolver: schema,
    mode: 'onChange',
  });

  const onSave = (v) => {
    v.baseVersion = v.baseVersion.id;
    onClickSave(v, 'os_file');
  };

  const fetchBaseVersion = async () => {
    try {
      const res = await getApi(
        `${CAMERA_AI_API_SRC}/fpga-version-file/search`,
        {
          emgineTypeId,
          typeVersion: 'full',
        },
      );
      setBaseVersions(res?.data?.rows || []);
    } catch (error) {
      showError(error);
    }
  };

  const handleUploadFileVersion = (e) => {
    if (
      ![
        'zip',
        'application/octet-stream',
        'application/zip',
        'application/x-zip',
        'application/x-zip-compressed',
      ].includes(e.value[0].type)
    ) {
      setError('fileVersion', {
        type: 'type',
        message: 'Không đúng định dạng ( chỉ chấp nhận file zip)',
      });
      return;
    }
    clearErrors('fileVersion');
    setValue('fileVersion', e.value[0]);
  };

  useEffect(() => {
    fetchBaseVersion();
  }, []);

  useEffect(() => {
    if (itemDevice) {
      console.log(itemDevice);
      // debugger;
      // reset({});
    }
  }, [itemDevice]);

  return (
    <React.Fragment>
      <Popup
        visible
        onHiding={() => onClose()}
        dragEnabled
        title={isAdd ? 'Create SO file' : 'Edit SO file'}
        showTitle
        width="40%"
        height="80vh"
        maxHeight="100vh"
        className={classes.popup}
      >
        <ScrollView width="100%" height="100%">
          <form className={classes.root}>
            <div className="custom-label-imput">
              EDGE Version File <span style={{ color: 'red' }}>*</span>
            </div>
            <CustomSelect
              control={control}
              errors={errors}
              name="baseVersion"
              noOptionsText="Không có dữ liệu"
              getOptionLabel={(option) => option?.name || ''}
              getOptionSelected={(option, selected) =>
                option.id === selected.id
              }
              options={baseVersios}
              showloading={false}
              renderOption={(option) => (
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>{`${option.name}`}</span>
                  </div>
                  <div
                    style={{
                      background: 'rgba(236, 236, 236, 0.6)',
                      border: '0.5px solid rgba(0, 0, 0, 0.12)',
                      boxSizing: 'border-box',
                      borderRadius: 4,
                      padding: '2px 8px',
                    }}
                  >
                    {option.version}
                  </div>
                </div>
              )}
            />
            <div className="custom-label-imput">
              Upload File <span style={{ color: 'red' }}>*</span>
            </div>
            <CustomUploadFile
              control={control}
              errors={errors}
              name="fileVersion"
              acceptType=".zip"
              handleUploadFile={handleUploadFileVersion}
            />
            <div className="custom-label-imput">
              Default Config <span style={{ color: 'red' }}>*</span>
            </div>
            <CustomTextArea
              control={control}
              errors={errors}
              name="defaultConfig"
              rowsMin={10}
            />
            <div className="custom-label-imput">Change Log</div>
            <CustomTextArea
              control={control}
              errors={errors}
              name="description"
              rowsMin={10}
            />
            <DialogActions>
              <BtnCancel
                onClick={() => {
                  onClose();
                }}
              >
                Hủy
              </BtnCancel>
              <BtnSuccess onClick={handleSubmit(onSave)}>Lưu</BtnSuccess>
            </DialogActions>
          </form>
        </ScrollView>
      </Popup>
    </React.Fragment>
  );
};

export default PopupFormOsFile;
