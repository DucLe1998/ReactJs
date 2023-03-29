/* eslint-disable no-unused-vars */
import { Controller, useForm } from 'react-hook-form';
import React, { Fragment, useEffect, useState } from 'react';
import DragdropBG from 'images/dragndrop-1.svg';
import ClearIcon from '@material-ui/icons/Clear';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import * as yup from 'yup';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';
import FileUploader from 'devextreme-react/file-uploader';
import CustomUploadFile from 'components/CustomUploadFile';
import DatePicker from 'components/DatePicker';
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box';
import SearchIcon from 'images/icon-button/Search.svg';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import {
  IconAdd,
  IconFilter,
  IconDelete,
  IconEdit,
  IconImport,
  IconExport,
} from 'constant/ListIcons';
import _ from 'lodash';
import MultiSelect from '../../../components/MultiSelect';
import { useStyles } from '../styled';
import { API_PARKING_LOT, API_ROUTE, SAP_SRC } from '../../apiUrl';
import VAutocomplete from '../../../components/VAutocomplete';
import {
  callApiWithConfig,
  getApi,
  METHODS,
  postApi,
  putApi,
} from '../../../utils/requestUtils';
import { getErrorMessage } from '../../Common/function';
import { validationSchema } from '../../../utils/utils';
import { showError, showSuccess } from '../../../utils/toast-utils';
import Loading from '../../Loading';
import BtnCancel from '../../../components/Button/BtnCancel';
import BtnSuccess from '../../../components/Button/BtnSuccess';
import TableCustom from '../../../components/TableCustom';
import IconBtn from '../../../components/Custom/IconBtn';
const initValues = {
  area: null,
  zone: null,
  block: null,
  status: null,
  floor: null,
  forceUpdate: false,
  map: null,
  zipData: null,
};
const Center = styled.div`
  flex: 1;
  display: flex;
  align-items: left;
  margin: 10px 0px 25px 0px;
  && .no-border-button {
    max-width: 425px;
  }
  && input {
    max-width: 340px;
  }
`;

const ButtonSearch = styled.button`
  background: #007bff;
  border-radius: 0px 4px 4px 0px;
  width: 98px;
  height: 42px;
  cursor: pointer;
  display: flex;
  color: #fff;
  right: 0px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid #007bff;
`;
const initialFilter = {
  keyword: null,
  limit: 25,
  page: 1,
};

export const AddUser = ({
  onClose,
  id,
  setReload,
  valueSearch,
  defaultSearch = '',
  placeholderSearch,
  dataOnChange,
  onSuccess,
  initialData,
  searchPlaceholderId = 'app.title.placeholder.search',
}) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [valueInput, setValueInput] = useState('');
  // const fetchDataSource = () => {
  //   setLoading(true);
  //   getApi(`${API_PARKING_LOT.PARKING_USER}`, _.pickBy(filter))
  //     .then((response) => {
  //       console.log(response.data);dataSource
  //       setDataSource(response.data);
  //     })
  //     .catch((err) => {
  //       showError(getErrorMessage(err));
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  const schema = validationSchema({});
  const {
    handleSubmit,
    control,
    getValues,
    watch,
    setError,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (initialData) {
      setDataSource(initialData);
    }
  }, [initialData]);
  const exportIcon = (icon) => <img src={icon} style={{ maxHeight: 18 }} />;
  const renderActionCell = ({ data }) => (
    <div className="center-content">
      <BtnSuccess
        onClick={() => {
          // console.log(data)
          dataOnChange(data);
        }}
      >
        Thêm
      </BtnSuccess>
    </div>
  );
  const onSubmitForm = (values) => {
    clearErrors();
    onSuccess(dataSource);
  };
  useEffect(() => {
    const params = { keyword: valueInput };
    getApi(`${API_PARKING_LOT.PARKING_USER}`, _.pickBy(params))
      .then((response) => {
        setDataSearch(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [valueInput]);
  const checkValue = (value) => {
    let ret = true;
    if (dataSource) {
      dataSource.map((row) => {
        if (value == row.id) ret = false;
      });
    }

    return ret;
  };
  const handleDelete = (row) => {
    const newData = [];
    if (dataSource) {
      dataSource.map((x) => (x.id != row.id ? newData.push(x) : ''));
    }

    setDataSource(newData);
  };
  const handleAdd = (row) => {
    if (dataSource.length < 5) {
      const newData = [...dataSource, row];
      setDataSource(newData);
    } else {
      showError('Đã đủ số lượng chủ xe');
    }
  };
  return (
    <div>
      {loading && <Loading />}
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogTitle className="title">Thêm chủ xe</DialogTitle>
        <DialogContent style={{ overflowY: 'unset' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <p className={classes.label}>Tìm kiếm</p>
              <Controller
                control={control}
                name="users"
                render={(props) => (
                  <TextField
                    autoComplete="off"
                    autoFocus
                    fullWidth
                    showClearButton
                    value={valueInput}
                    inputProps={{
                      maxLength: 150,
                    }}
                    placeholder={placeholderSearch || 'Nhập thông tin tìm kiếm'}
                    variant="outlined"
                    size="small"
                    onChange={(e) => {
                      setValueInput(e.target.value || '');
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TableContainer style={{ maxHeight: 350 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow className={classes.tableRow}>
                      <TableCell>STT</TableCell>
                      <TableCell>Họ tên</TableCell>
                      <TableCell>Mã định danh</TableCell>
                      <TableCell>Số điện thoại</TableCell>
                      <TableCell>Mã thẻ</TableCell>
                      <TableCell>Ảnh khuôn mặt</TableCell>
                      <TableCell>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataSearch.length > 0 &&
                      dataSearch.map((row, index) => (
                        <TableRow className={classes.tableRow}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.fullName}</TableCell>
                          <TableCell>{row.employeeCode}</TableCell>
                          <TableCell>{row.mobile}</TableCell>
                          <TableCell>{row.csn}</TableCell>
                          <TableCell>{row.avatarUrl}</TableCell>
                          <TableCell>
                            {checkValue(row.id) ? (
                              <Tooltip title="Thêm">
                                <IconButton
                                  onClick={() => handleAdd(row)}
                                  size="medium"
                                >
                                  <AddIcon fontSize="medium" />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip
                                title="Xóa"
                                style={{ marginLeft: '8px' }}
                              >
                                <IconButton
                                  onClick={() => handleDelete(row)}
                                  size="medium"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            type="button"
            variant="contained"
            onClick={() => {
              onClose();
            }}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            onClick={onSubmitForm}
            variant="contained"
            color="primary"
          >
            Lưu
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};

const FormUploadWrap = styled.div`
  display: flex;
  width: 100%;

  .img-choose-file {
    text-align: center;
    align-self: center;
  }
  & .dx-texteditor.dx-editor-outlined {
    border: none;
  }
`;

export default AddUser;
