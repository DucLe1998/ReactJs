/**
 *
 * ListUserCameraAi
 *
 */

import React, { Fragment, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import styled from 'styled-components';
import SeparateImage from 'images/Icon-Separate.svg';
import SearchImage from 'images/Icon-Search.svg';
import Search2Image from 'images/Icon-Search2.svg';
import CameraImage from 'images/Icon-Camera.svg';
import ClearImage from 'images/Icon-Clear.svg';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import CommonPageHeader from 'components/PageHeader';

import { useIntl } from 'react-intl';
import Tooltip from '@material-ui/core/Tooltip';
import Loading from 'containers/Loading';
import reducer from '../reducer';
import saga from '../saga';
import makeSelectListUserCameraAi from '../selectors';
import {
  loadAutoCompleteSearch,
  loadSearchHistory,
  loadUserDetectedEvent,
  loadFileImage,
  loadFileImageSearch,
  loadUserDetectedImage,
} from '../actions';
import messages from '../messages';
import { MAX_FILE_SIZE, SUPPORTED_FILE_TYPE } from '../constants';
// import ImageCropper from './ImageCropperPopup';
import { postApi } from '../../../utils/requestUtils';
import { API_CAMERA_AI } from '../../apiUrl';
import InvaliteImagePopup from './InvalidImagePopup';
// import UserOption from './UserOption';

const key = 'listUserCameraAi';

export function CustomPageHeader({
  // listUserCameraAI,
  // onLoadSearchHistory,
  // onLoadPreviewData,
  onSearch,
  pageIndex,
  totalCount,
  rowsPerPage,
  handlePageSize,
  handleChangePageIndex,
}) {
  const intl = useIntl();
  // const { previewData } = listUserCameraAI;
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  // const [fileRaw, setFileRaw] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  // const [showImageCropper, setShowImageCropper] = useState(false);
  const [showDropImage, setShowDropImage] = useState(false);
  const [showInvalidPopup, setShowInvalidPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [needSubmit, setNeedSubmit] = useState(0);

  const [fileCropped, setFileCropped] = useState(null);
  const [keyword, setKeyword] = useState('');

  const node = useRef();

  // const [open, setOpen] = useState(false);

  const invalidPopup = () => (
    <InvaliteImagePopup
      onClose={() => {
        setShowInvalidPopup(false);
      }}
      title="Ảnh không hợp lệ"
      content="Ảnh tải lên phải có định dạng: .jpeg, .gif, .png, .jpg, .tiff, .bmp và dung lượng ảnh không quá 5MB. Đồng thời ảnh cần có khuôn mặt để nhận dạng"
      txtButton="Đồng ý"
    />
  );

  // const handleClick = e => {
  //   if (node.current.querySelector('input[type=text]').contains(e.target)) {
  //     setOpen(true);
  //     return;
  //   }
  //   setOpen(false);
  // };

  // useEffect(() => {
  //   document.addEventListener('click', handleClick);
  //   return () => {
  //     document.removeEventListener('click', handleClick);
  //   };
  // }, []);

  const onClearImage = () => {
    setFileCropped(null);
  };

  const onSubmit = () => {
    if (fileCropped || keyword) {
      onSearch({
        keyword,
        file: fileCropped,
        page: 1,
        limit: 50,
      });
    }
  };

  const onDragOver = e => {
    e.stopPropagation();
    e.preventDefault();
    setShowDropImage(true);
  };

  const onDragLeave = e => {
    e.preventDefault();
    setShowDropImage(false);
  };

  const onGetFile = e => {
    e.preventDefault();
    setShowDropImage(false);
    // validate
    let file = null;
    let isValid = true;
    if (e.dataTransfer) {
      file = e.dataTransfer.files;
    } else if (e.target) {
      file = e.target.files;
    }
    if (file?.length > 1) {
      isValid = false;
    }

    if (file[0].size > MAX_FILE_SIZE) {
      isValid = false;
    }

    if (
      !SUPPORTED_FILE_TYPE.map(type => type.slice(1)).includes(
        file[0].type.split('/')[1],
      )
    ) {
      isValid = false;
    }

    if (!isValid) {
      setShowInvalidPopup(true);
      return;
    }
    setLoading(true);
    // call API validate image
    const formData = new FormData();
    formData.append('detectedImages', file[0]);
    postApi(API_CAMERA_AI.VALIDATE_USER_DETECTED_UPLOAD_IMAGE, formData)
      .then(() => {
        setFileCropped(file[0]);
        setNeedSubmit(needSubmit + 1);
        // setFileRaw(file[0]);
        // setShowImageCropper(true);
      })
      .catch(() => {
        setShowInvalidPopup(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (fileCropped !== null) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        setKeyword('');
      };
      reader.readAsDataURL(fileCropped);
    } else {
      setPreviewImage(null);
    }
  }, [fileCropped]);

  useEffect(() => {
    if (needSubmit > 0) {
      onSubmit();
    }
  }, [needSubmit]);

  return (
    <Fragment>
      {showInvalidPopup && invalidPopup()}
      {loading && <Loading />}
      <CommonPageHeader
        title={intl.formatMessage(messages.header)}
        showPager
        pageIndex={pageIndex}
        totalCount={totalCount}
        rowsPerPage={rowsPerPage}
        handlePageSize={handlePageSize}
        handleChangePageIndex={handleChangePageIndex}
      >
        <Center
          style={{
            alignItems: `${!showDropImage ? 'center' : ''}`,
            marginTop: `${showDropImage ? '18px' : ''}`,
          }}
          onDragOver={onDragOver}
        >
          {showDropImage && (
            <div
              style={{
                width: '100%',
                minWidth: '400px',
                height: '244px',
                background: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                boxSizing: 'border-box',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                borderRadius: '8px',
                padding: '20px 30px',
                zIndex: 1,
                marginTop: '160px',
              }}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onGetFile}
            >
              <p
                style={{
                  pointerEvents: 'none',
                  marginTop: '0px',
                  fontSize: '18px',
                  color: 'rgba(0, 0, 0, 0.84)',
                }}
              >
                {intl.formatMessage(messages.search_image_title)}
              </p>
              <div
                style={{
                  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                  alignItems: 'center',
                  display: 'flex',
                  width: '100%',
                  height: 'calc(100% - 40px)',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    fontSize: '20px',
                    color: 'rgba(0, 0, 0, 0.6)',
                  }}
                >
                  <p>{intl.formatMessage(messages.drop_image_title)}</p>
                </div>
              </div>
            </div>
          )}
          {!showDropImage && (
            <TextField
              ref={node}
              disabled={!!previewImage}
              variant="outlined"
              value={keyword}
              placeholder="Tìm kiếm theo tên, mã ID hoặc cả hai (VD: “Nguyễn Văn An - 365520214”)"
              onChange={e => {
                if (typeof e.target.value === 'string') {
                  setKeyword(e.target.value);
                } else if (e.target.value && e.target.value.inputValue) {
                  setKeyword(e.target.value.inputValue);
                } else {
                  setKeyword(e.target.value);
                }
              }}
              onKeyDown={e => {
                if (e.keyCode === 13 && e.target.value) {
                  onSubmit();
                  // setOpen(false);
                }
              }}
              InputProps={{
                inputProps: {
                  maxLength: 255,
                },
                endAdornment: (
                  <InputAdornment position="end">
                    {keyword && ClearIcon(setKeyword)}
                    {SlatIcon}
                    {SearchImageIcon(onGetFile)}
                    {SearchIcon(onSubmit)}
                  </InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    {previewImage
                      ? AvatarImageIcon(previewImage, onClearImage, fileCropped)
                      : Search2Icon}
                  </InputAdornment>
                ),
              }}
            />
            // <Autocomplete
            //   open={previewImage ? false : open}
            //   freeSolo
            //   disabled={!!previewImage || loading}
            //   id="free-solo-2-demo"
            //   options={previewData.rows}
            //   value={keyword}
            //   getOptionLabel={option => {
            //     if (typeof option === 'string') {
            //       return option;
            //     }
            //     if (option.inputValue) {
            //       return option.inputValue;
            //     }
            //     return `${
            //       option?.userDetectedName && option?.code
            //         ? `${option.userDetectedName || ''} - ${option.code || ''}`
            //         : ''
            //     }`;
            //   }}
            //   renderInput={params => (
            //     <TextField
            //       ref={node}
            //       {...params}
            //       disabled={!!previewImage}
            //       variant="outlined"
            //       placeholder={intl.formatMessage(
            //         messages.search_box_placeholder,
            //       )}
            //       onChange={e => {
            //         if (typeof e.target.value === 'string') {
            //           setKeyword(e.target.value);
            //         } else if (e.target.value && e.target.value.inputValue) {
            //           setKeyword(e.target.value.inputValue);
            //         } else {
            //           setKeyword(e.target.value);
            //         }
            //       }}
            //       onKeyDown={e => {
            //         if (e.keyCode === 13 && e.target.value) {
            //           onSubmit();
            //           setOpen(false);
            //         }
            //       }}
            //       InputProps={{
            //         ...params.InputProps,
            //         inputProps: {
            //           ...params.inputProps,
            //           maxLength: 255,
            //         },
            //         endAdornment: (
            //           <InputAdornment position="end">
            //             {keyword && ClearIcon(setKeyword)}
            //             {SlatIcon}
            //             {SearchImageIcon(onGetFile)}
            //             {SearchIcon(onSubmit, setOpen)}
            //           </InputAdornment>
            //         ),
            //         startAdornment: (
            //           <InputAdornment position="start">
            //             {previewImage
            //               ? AvatarImageIcon(
            //                   previewImage,
            //                   onClearImage,
            //                   fileCropped,
            //                 )
            //               : Search2Icon}
            //           </InputAdornment>
            //         ),
            //       }}
            //     />
            //   )}
            //   renderOption={(option, { inputValue }) => (
            //     <React.Fragment key={Math.random() + option?.id}>
            //       <UserOption
            //         option={option}
            //         inputValue={inputValue}
            //         setKeyword={setKeyword}
            //         onSearch={() => setNeedSubmit(needSubmit + 1)}
            //       />
            //     </React.Fragment>
            //   )}
            //   ListboxProps={{
            //     style: {
            //       maxHeight: '390px',
            //     },
            //   }}
            // />
          )}
        </Center>
      </CommonPageHeader>
      {/* {showImageCropper && (
         <ImageCropper
           fileImage={fileRaw}
           setCroppedFileImage={event => {
             setFileCropped(event);
             setShowImageCropper(false);
             setNeedSubmit(needSubmit + 1);
           }}
           onClose={() => {
             setShowImageCropper(false);
           }}
         />
       )} */}
    </Fragment>
  );
}

const OverFlowText = styled.p`
  margin: 0px;
  width: 91px;
  margin: 0px 6px 0px 7.25px;
  align-self: center;
  white-space: nowrap;
  & span {
    display: inline-block;
    vertical-align: bottom;
    white-space: nowrap;
    width: 100%;
    max-width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

// const Center = styled.div`
//   flex: 0 1 100%;
//   display: flex;
//   grid-gap: 10px;
//   & .dx-texteditor.dx-editor-outlined {
//     display: inline-block;
//   }
//   & .MuiAutocomplete-inputRoot[class*='MuiOutlinedInput-root'] {
//     background: rgba(116, 116, 128, 0.08);
//     border: 1px solid rgba(60, 60, 67, 0.1);
//     box-sizing: border-box;
//     border-radius: 70px;
//     height: 48px;
//     padding: 0px 20px;
//     background-color: #fafafa;
//   }
//   & .MuiAutocomplete-root {
//     width: 100%;
//     min-width: 400px;
//   }
// `;

const Center = styled.div`
  flex: 0 1 100%;
  display: flex;
  grid-gap: 10px;
  & .MuiInputBase-root {
    background: rgba(116, 116, 128, 0.08);
    border: 1px solid rgba(60, 60, 67, 0.1);
    box-sizing: border-box;
    border-radius: 70px;
    height: 48px;
    padding: 0px 20px;
    background-color: #fafafa;
  }
  & .MuiFormControl-root.MuiTextField-root {
    width: 100%;
    min-width: 400px;
  }
`;

const AvatarImageIcon = (previewImage, clearPreviewImage, fileCropped) => (
  <div
    style={{
      marginLeft: '-16px',
      padding: '0px 10px',
      width: '182px',
      height: '40px',
      border: '1px solid rgba(60, 60, 67, 0.1)',
      borderRadius: '100px',
      display: 'flex',
      background: 'rgba(10, 132, 255, 0.2)',
      alignItems: 'center',
    }}
  >
    <div
      style={{
        // maxHeight: '33.65px',
        // maxWidth: '33.65px',
        margin: '2.17px 0px 2.17px 8px',
      }}
    >
      <img
        alt="edit"
        src={previewImage}
        style={{
          maxWidth: '100%',
          maxHeight: '40px',
          borderRadius: '3px',
        }}
      />
    </div>

    <Tooltip title={fileCropped?.name || ''}>
      <OverFlowText>
        <span>{fileCropped?.name}</span>
      </OverFlowText>
    </Tooltip>
    {/* eslint-disable-next-line react/button-has-type */}
    <Icon
      style={{
        textAlign: 'center',
        cursor: 'pointer',
        alignSelf: 'center',
        width: '12px',
      }}
      onClick={() => {
        clearPreviewImage(null);
      }}
    >
      <img
        alt="edit"
        src={ClearImage}
        style={{
          width: '6.5px',
          height: '6.5px',
        }}
      />
    </Icon>
  </div>
);

const Search2Icon = (
  <Icon style={{ textAlign: 'center' }}>
    <img alt="edit" src={Search2Image} />
  </Icon>
);

const SlatIcon = (
  <Icon style={{ textAlign: 'center' }}>
    <img alt="edit" src={SeparateImage} />
  </Icon>
);

const SearchIcon = onSearch => (
  <Icon
    style={{
      textAlign: 'center',
      marginLeft: '22.5px',
      cursor: 'pointer',
    }}
    onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      onSearch();
      // setOpen(false);
    }}
  >
    <img
      alt="edit"
      src={SearchImage}
      style={{
        width: '16px',
        height: '16px',
      }}
    />
  </Icon>
);

const SearchImageIcon = onGetFile => (
  <Fragment>
    <input
      accept={`${SUPPORTED_FILE_TYPE.join(',')}`}
      id="icon-button-photo"
      onChange={e => {
        onGetFile(e);
      }}
      onClick={e => {
        e.target.value = null;
      }}
      type="file"
      hidden
    />
    <label htmlFor="icon-button-photo">
      <Icon
        style={{
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <img
          alt="edit"
          src={CameraImage}
          style={{
            width: '24px',
            height: '24px',
          }}
        />
      </Icon>
    </label>
  </Fragment>
);

const ClearIcon = clearText => (
  <Icon
    style={{
      textAlign: 'center',
      cursor: 'pointer',
    }}
    onClick={() => {
      clearText('');
    }}
  >
    <img
      alt="edit"
      src={ClearImage}
      style={{
        width: '14px',
        height: '14px',
      }}
    />
  </Icon>
);

CustomPageHeader.propTypes = {
  onSearch: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  listUserCameraAI: makeSelectListUserCameraAi(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onLoadSearchHistory: evt => {
      dispatch(loadSearchHistory(evt));
    },
    onLoadPreviewData: evt => {
      dispatch(loadAutoCompleteSearch(evt));
    },
    onLoadUserDetectedEvent: evt => {
      dispatch(loadUserDetectedEvent(evt));
    },
    onSetFileImage: evt => {
      dispatch(loadFileImage(evt));
    },
    onClearFileImageSearch: () => {
      dispatch(loadFileImageSearch(null));
    },
    onLoadUserDetectedImage: evt => {
      dispatch(loadUserDetectedImage(evt));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(CustomPageHeader);
