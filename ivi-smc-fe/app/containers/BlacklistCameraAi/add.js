/**
 *
 * BlacklistCameraAi
 *
 */

import React, { Fragment, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Button } from 'devextreme-react/button';
import { IconButton } from '@material-ui/core';
import MaskGroup from 'images/MaskGroup.svg';
import PlusIcon from 'images/Icon_Plus.svg';
import FileUploader from 'devextreme-react/file-uploader';
import DragdropBG from 'images/dragndrop-1.svg';
import IconBack from 'images/icon-button/ic_back.svg';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import { TextBox } from 'devextreme-react/text-box';
import makeSelectBlacklistCameraAi from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Loading from '../Loading';
import 'cropperjs/dist/cropper.css';
import './Demo.css';
import { ALLOWED_FILE_EXTENSIONS } from './constants';
import { addBlackList, loadRelatedImage, setForm } from './actions';
import ImageCropper from './ImageCropperPopup';
import { postApi } from '../../utils/requestUtils';
import { API_CAMERA_AI } from '../apiUrl';
import InvaliteImagePopup from '../ListUserCameraAi/items/InvalidImagePopup';
import { showError, showSuccess } from '../../utils/toast-utils';

const key = 'blacklistCameraAi';

export function NewBlacklist({
  blacklistCameraAi,
  // onAddUserToBlacklist,
  // onSetForm,
}) {
  const { loading } = blacklistCameraAi;
  const classes = useStyles();
  const intl = useIntl();
  const history = useHistory();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const [listFileUpload, setListFileUpload] = useState([]);
  const [listImage, setListImage] = useState([]);
  const [avatarImage, setAvatarImage] = useState(null);
  const [fileAvatarImg, setFileAvatarImg] = useState(null);
  const [name, setName] = useState(null);
  const [showCropper, setShowCopper] = useState(false);
  const [showInvalidImagePopup, setShowInvalidImagePopup] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const fileUploader1 = useRef(null);
  const fileUploader2 = useRef(null);

  const fileListToBase64 = async fileList => {
    function getBase64(file) {
      const reader = new FileReader();
      return new Promise(resolve => {
        reader.onload = ev => {
          resolve(ev.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
    const promises = [];
    for (let i = 0; i < fileList.length; i++) {
      promises.push(getBase64(fileList[i]));
    }
    const data = await Promise.all(promises);
    return data;
  };

  const invalidPopup = () => (
    <InvaliteImagePopup
      onClose={() => {
        setShowInvalidImagePopup(null);
      }}
      title={showInvalidImagePopup.title}
      content={showInvalidImagePopup.content}
      txtButton="Đồng ý"
    />
  );

  const renderImage = listFileUpload.length > 0 && listImage.length > 0 && (
    <div className={classes.cardImageContainer}>
      {listImage.length < 5 && (
        <div className="add-btn card-img" id="dropzone-external-2">
          <div style={{ alignSelf: 'center', margin: 'auto' }}>
            <img src={PlusIcon} alt="" />
          </div>
          <FileUploader
            id="file-uploader-2"
            dialogTrigger="#dropzone-external-2"
            dropZone="#dropzone-external-2"
            multiple
            allowedFileExtensions={ALLOWED_FILE_EXTENSIONS}
            uploadMode="useButtons"
            visible={false}
            onValueChanged={e => {
              onDragDropImage(e);
            }}
            ref={fileUploader2}
          />
        </div>
      )}
      {listImage.map(image => (
        <div className="card-img" key={listImage.indexOf(image)}>
          <img
            src={image}
            alt=""
            className="hover-image"
            onDoubleClick={() => {
              // setAvatarImage(image);
              setFileAvatarImg(listFileUpload[listImage.indexOf(image)]);
              setShowCopper(true);
            }}
          />
          <IconButton
            className="close"
            onClick={() => {
              const listFileUploadTmp = [...listFileUpload];
              listFileUploadTmp.splice(listImage.indexOf(image), 1);
              setListFileUpload(listFileUploadTmp);
            }}
          >
            -
          </IconButton>
        </div>
      ))}
    </div>
  );
  useEffect(() => {
    async function fetchData() {
      const arrayOfBase64 = await fileListToBase64(listFileUpload);
      setListImage(arrayOfBase64);
    }
    if (listFileUpload.length > 0) {
      fetchData();
    }
  }, [listFileUpload]);

  const onDragDropImage = e => {
    if (e.value.length > 0) {
      if (e.value.length + listFileUpload.length > 5) {
        Swal.fire({
          text: 'Tối đa 5 file',
          icon: 'error',
          // imageWidth: 213,
          showCancelButton: false,
          showCloseButton: false,
          showConfirmButton: true,
          focusConfirm: true,
          confirmButtonColor: '#40a574',
          confirmButtonText: 'Đóng',
          customClass: {
            content: 'content-class',
          },
        });
      } else {
        const files = listFileUpload.concat(e.value);
        // call API validate file
        const formData = new FormData();
        // eslint-disable-next-line no-restricted-syntax
        for (const file of files) {
          formData.append('detectedImages', file, file.name);
        }
        setShowLoading(true);
        postApi(API_CAMERA_AI.VALIDATE_BLACKLIST_UPLOAD_IMAGE, formData)
          .then(() => {
            setListFileUpload(files);
          })
          .catch(err => {
            if (
              err.response.data.code == '400104' ||
              err.response.data.code == '400111'
            ) {
              // ko co mat trong anh
              setShowInvalidImagePopup({
                title: 'Ảnh không hợp lệ',
                content:
                  'Ảnh tải lên không hợp lệ. Vui lòng chọn ảnh rõ nét, đủ độ sáng, không qua chỉnh sửa',
              });
            } else if (err.response.data.code == '401104') {
              // mat da duoc dang ky
              setShowInvalidImagePopup({
                title: 'Đối tượng đã tồn tại',
                content:
                  'Đã tồn tại đối tượng có khuôn mặt trùng với khuôn mặt đối tượng mà bạn vừa tải lên. Vui lòng chọn ảnh khác.',
              });
            } else {
              showError(err);
            }
          })
          .finally(() => {
            setShowLoading(false);
          });
      }
      if (fileUploader2?.current?.instance) {
        fileUploader2.current.instance.reset();
      }
      if (fileUploader1?.current?.instance) {
        fileUploader1.current.instance.reset();
      }
    }
  };

  const handleAddBlacklist = () => {
    // const data = {
    //   image: fileAvatarImg,
    //   blacklistUser: {
    //     name,
    //   },
    //   detectedImages: listFileUpload,
    // };
    const formData = new FormData();
    formData.append('image', fileAvatarImg);
    formData.append(
      'blacklistUser ',
      JSON.stringify({
        name,
      }),
    );
    // eslint-disable-next-line no-restricted-syntax
    for (const file of listFileUpload) {
      formData.append('detectedImages', file, file.name);
    }
    setShowLoading(true);
    postApi(API_CAMERA_AI.ADD_USER_BLACKLIST_3_7, formData)
      .then(() => {
        history.push('/camera-ai/black-list');
        showSuccess('Thêm đối tượng vào danh sách đen thành công');
      })
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setShowLoading(false);
      });
    // onAddUserToBlacklist(data);
  };

  return (
    <Fragment>
      {(showLoading || loading) && <Loading />}
      {showInvalidImagePopup && invalidPopup()}
      {showCropper && (
        <ImageCropper
          onClose={() => {
            setShowCopper(false);
          }}
          fileAvatar={fileAvatarImg}
          avatarImage={avatarImage}
          setAvatarImage={setAvatarImage}
          setFileAvatar={setFileAvatarImg}
        />
      )}
      <div
        className="page-header"
        style={{
          marginTop: '20px',
        }}
      >
        <Button
          icon={IconBack}
          style={{
            fontSize: '24px',
            color: 'var(--main-bg-color)',
            backgroundColor: 'transparent',
            border: '0px',
          }}
          onClick={() => {
            // onSetForm(FORM_TYPE.LIST);
            history.push('/camera-ai/black-list');
          }}
        />
        <div className="page-title">
          {intl.formatMessage(messages.new_blacklist_title)}
        </div>
        <div className="page-action button-container">
          <Button
            className={classes.cancelBtn}
            text={intl.formatMessage(messages.new_blacklist_cancel_btn)}
            onClick={() => {
              // onSetForm(FORM_TYPE.LIST);
              history.push('/camera-ai/black-list');
            }}
          />
          <Button
            disabled={
              name === null ||
              avatarImage === null ||
              listFileUpload.length === 0
            }
            className={classes.addBtn}
            text={intl.formatMessage(messages.new_blacklist_add_btn)}
            onClick={handleAddBlacklist}
          />
        </div>
      </div>
      <div className={classes.container}>
        <div className={classes.avatar_container}>
          <div
            style={{
              textAlign: 'center',
              width: '192px',
            }}
          >
            <p
              style={{
                fontSize: '18px',
                lineHeight: '22px',
                color: 'rgba(0, 0, 0, 0.6)',
                margin: '0px',
              }}
            >
              {intl.formatMessage(messages.new_blacklist_avt_title)}
            </p>
            <div
              style={{
                background: '#CED1D7',
                borderRadius: '8px',
                display: 'flex',
                margin: 'auto',
                width: '192px',
                height: '192px',
              }}
            >
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events */}
              <img
                alt=""
                src={avatarImage || MaskGroup}
                style={{
                  marginBottom: `${avatarImage ? '' : '-10%'}`,
                  objectFit: 'contain',
                  width: `${avatarImage ? '100%' : ''}`,
                  height: `${avatarImage ? '100%' : ''}`,
                }}
              />
            </div>
            <TextBox
              id="username"
              name="username"
              placeholder={intl.formatMessage(
                messages.new_blacklist_name_placeholder,
              )}
              stylingMode="outlined"
              defaultValue=""
              mode="text"
              showClearButton
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '4px',
                marginTop: '10px',
              }}
              onInput={e => {
                setName(e.event.target.value);
              }}
            />
          </div>
        </div>
        {listFileUpload.length === 0 && (
          <p style={{ margin: '35px 0px 0px 0px' }}>
            {intl.formatMessage(messages.new_blacklist_total_image_title, {
              title: '(Tối đa 5 ảnh)',
            })}
          </p>
        )}
        {listFileUpload.length > 0 && (
          <p style={{ margin: '35px 0px 0px 0px' }}>
            {intl.formatMessage(messages.new_blacklist_total_image_title, {
              title: `(${listFileUpload.length}/5)`,
            })}
          </p>
        )}
        <div
          style={{
            marginTop: '20px',
            minHeight: '422px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {listFileUpload.length === 0 && (
            <Fragment>
              <div
                className="cropper"
                style={{
                  display: 'flex',
                }}
                id="dropzone-external"
              >
                <div
                  style={{
                    margin: 'auto',
                    alignSelf: 'center',
                    textAlign: 'center',
                  }}
                >
                  <div>
                    <img alt="" src={DragdropBG} />
                  </div>
                  <p
                    style={{
                      fontSize: '16px',
                      lineHeight: '19px',
                      color: 'rgba(37, 37, 37, 0.6)',
                    }}
                  >
                    {intl.formatMessage(
                      messages.new_blacklist_drag_drop_image_title,
                    )}
                  </p>
                  <p
                    style={{
                      fontSize: '16px',
                      lineHeight: '19px',
                      color: 'rgba(37, 37, 37, 0.84)',
                    }}
                  >
                    {intl.formatMessage(messages.new_blacklist_or)}
                  </p>
                  {/* eslint-disable-next-line react/button-has-type */}
                  <button
                    style={{
                      background: '#00554A',
                      boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
                      borderRadius: '8px',
                      width: '104px',
                      height: '40px',
                      border: 'none',
                      color: '#fff',
                    }}
                  >
                    {intl.formatMessage(
                      messages.new_blacklist_upload_image_btn,
                    )}
                  </button>
                </div>
              </div>
              <FileUploader
                id="file-uploader"
                dialogTrigger="#dropzone-external"
                dropZone="#dropzone-external"
                multiple
                allowedFileExtensions={ALLOWED_FILE_EXTENSIONS}
                uploadMode="useButtons"
                visible={false}
                onValueChanged={onDragDropImage}
                ref={fileUploader1}
              />
            </Fragment>
          )}
          {renderImage}
        </div>
      </div>
    </Fragment>
  );
}

const useStyles = makeStyles(() => ({
  cancelBtn: {
    width: '116px',
    height: '40px',
    background: '#E2E2E2',
    border: '1px solid #DDDDDD',
    boxSizing: 'border-box',
    borderRadius: '8px',
    '& .dx-button-content': { display: 'block' },
  },
  addBtn: {
    width: '104px',
    height: '40px',
    background: '#00554A',
    boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
    borderRadius: '8px',
    color: '#fff',
    '& .dx-button-content': { display: 'block' },
  },
  container: {
    padding: '30px 50px 0px 50px',
    background: '#FFFFFF',
    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.06)',
    borderRadius: '10px',
  },
  avatar_container: {
    width: '100%',
    '& .cropper': {
      height: '422px',
    },
    '& .cropper .box': {
      display: 'inline-block',
      padding: '10px',
      boxSizing: 'border-box',
    },
    '& .cropper .img-preview': {
      overflow: 'hidden',
    },
  },
  related_image: {
    height: '179px',
    width: '100%',
    marginTop: '28px',
  },
  vertical: {
    height: '180px',
    position: 'relative',
    float: 'right',
    marginTop: '-226.04px',
    marginRight: '28.9px',
  },
  icon: {
    float: 'right',
    position: 'relative',
    marginTop: '-420px',
    padding: '10px',
    color: '#fff',
  },
  cardImageContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexFlow: 'wrap',
    '& .add-btn': {
      border: '1.5px dashed rgba(0, 0, 0, 0.48)',
    },
    '& .card-img': {
      position: 'relative',
      width: '230px',
      height: '230px',
      display: 'flex',
      margin: '10px',
      '& .hover-image': {
        width: '100%',
        height: '100%',
        background: 'rgb(206, 209, 215)',
        objectFit: 'contain',
        borderRadius: '8px',
      },
    },
    '& .card-img .close': {
      display: 'none',
      padding: '0px',
      position: 'absolute',
      top: '10px',
      right: '10px',
      color: '#000',
      backgroundColor: '#fff',
      '& .MuiIconButton-label': {
        width: '24px',
        height: '24px',
      },
    },
    '& .card-img:hover .close': {
      display: 'block',
    },
  },
}));

NewBlacklist.propTypes = {};

const mapStateToProps = createStructuredSelector({
  blacklistCameraAi: makeSelectBlacklistCameraAi(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onLoadRelatedImage: evt => {
      dispatch(loadRelatedImage(evt));
    },
    onAddUserToBlacklist: evt => {
      dispatch(addBlackList(evt));
    },
    onSetForm: evt => {
      dispatch(setForm(evt));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(NewBlacklist);
