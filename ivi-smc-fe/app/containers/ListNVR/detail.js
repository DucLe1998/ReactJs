/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import Loading from 'containers/Loading/Loadable';
import { Popup } from 'devextreme-react/popup';
import Swal from 'sweetalert2';
import { FormattedMessage, useIntl } from 'react-intl';
import DataGrid, {
  Column,
  Paging,
  SearchPanel,
} from 'devextreme-react/data-grid';
import { getAreaObjectForTree, getAreaString } from 'utils/functions';
import { TextBox } from 'devextreme-react/text-box';
// eslint-disable-next-line no-unused-vars
import SmchPagination from 'components/SmchPagination';
import { get } from 'lodash';
import styled from 'styled-components';
import PageHeader from 'components/PageHeader';
import {
  Validator,
  RequiredRule,
  PatternRule,
} from 'devextreme-react/validator';
import { NumberBox } from 'devextreme-react/number-box';
import { useFormik } from 'formik';
import { Button } from 'devextreme-react/button';
import { Link } from '@material-ui/core';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import {
  RowItem,
  RowLabel,
  RowContent,
  HeaderText,
} from '../../components/CommonComponent';
import reducer from './reducer';
import saga from './saga';
import sagaCommon from '../Common/sagaCommon';
import reducerCommon from '../Common/reducer';
import { makeSelectEditingItem, makeSelectLoading } from './selectors';
import { loadDetail, loadNVRCameras, updateRow } from './actions';
import AreaTreeList from '../Common/AreaTree/Loadable';
import ChangePassword from './changePassword';
const NoImageGrid = styled.div`
  tbody tr {
    height: 50px;
  }
  .dx-datagrid-headers {
    color: rgba(60, 60, 67, 0.4) !important;
  }
`;
const InfoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 10px 15px;
`;
const key = 'nvr';
//----------------------------------------------------------------
export function DetailNVR({
  loading,
  error,
  detailInfo,
  onLoadDetail,
  onLoadListCamera,
  onUpdateRow,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useInjectReducer({ key: 'common', reducer: reducerCommon });
  useInjectSaga({ key: 'common', saga: sagaCommon });
  const history = useHistory();
  const dataGridRef = useRef({});
  const intl = useIntl();
  const [pageSize, setPageSize] = useState(25);
  const [pageIndex, setPageIndex] = useState(0);
  const [openEditMode, setOpenEditMode] = useState(false);
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
  const defaultArea = getAreaObjectForTree(detailInfo);
  // eslint-disable-next-line no-unused-vars
  const [totalCount, setTotalCount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [totalPage, setTotalPage] = useState(0);
  const editForm = useFormik({
    initialValues: {
      ip: '',
      port: '',
      name: '',
      username: '',
      password: '',
      area: getAreaObjectForTree(detailInfo),
    },
    onSubmit: values => {
      const data = {
        information: {
          ip: values.ip,
          port: values.port,
          username: values.username,
          password: values.password,
        },
        name: values.name,
        type: 'NVR',
      };
      if (values.area.areaId) {
        data.areaId = Number(values.area.areaId);
      }
      if (values.area.zoneId) {
        data.zoneId = Number(values.area.zoneId);
      }
      if (values.area.blockId) {
        data.blockId = Number(values.area.blockId);
      }
      if (values.area.floorId) {
        data.floorId = Number(values.area.floorId);
      }
      if (values.area.unitId) {
        data.unitId = Number(values.area.unitId);
      }
      onUpdateRow(detailInfo.id, data);
    },
  });
  if (error) {
    Swal.fire({
      title: 'Có lỗi xảy ra',
      text: error,
      icon: 'info',
      imageWidth: 213,
      dangerMode: true,
      showCancelButton: false,
      showCloseButton: true,
      showConfirmButton: true,
      focusConfirm: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không',
      customClass: {
        content: 'content-class',
      },
    });
  }
  // eslint-disable-next-line no-unused-vars
  const buildQuery = () => {
    let query = '';
    // if (searchValue) {
    //   query += `&SearchValue=${encodeURIComponent(searchValue)}`;
    // }
    query += `&page=${pageIndex + 1}`;
    query += `&limit=${pageSize}`;
    if (query.indexOf('&') == 0) {
      query = query.replace('&', '?');
    }
    return query;
  };

  // const loadData = () => {
  //   const query = buildQuery();
  //   onLoadListCamera(query);
  // };
  // console.log('detailInfo.....', detailInfo);
  const nameRenderer = ({ data, value }) => (
    <Link
      style={{ color: 'rgb(16, 156, 241)' }}
      component={RouterLink}
      variant="body2"
      to={{
        pathname: `/list-camera/details/${data.id}`,
        state: { nvrDetail: `/list-nvr/detail?id=${detailInfo.id}` },
      }}
    >
      {value}
    </Link>
  );
  const renderArea = ({ data }) => <div>{getAreaString(data)}</div>;
  const getStatusCell = status => {
    if (['OFFLINE', 'INACTIVE'].includes(status))
      return intl.formatMessage({
        id: 'app.status.disabled',
      });
    return intl.formatMessage({
      id: 'app.status.enabled',
    });
  };

  const renderStatusCell = item => {
    if (['OFFLINE', 'INACTIVE'].includes(item.status))
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            color: 'rgba(226, 69, 69, 1)',
          }}
        >
          <span style={{ width: '100%' }}>
            {intl.formatMessage({
              id: 'app.status.disabled',
            })}
          </span>
        </div>
      );
    return (
      <div style={{ display: 'flex', color: 'rgba(16, 156, 241, 1)' }}>
        <span style={{ width: '100%' }}>
          {intl.formatMessage({
            id: 'app.status.enabled',
          })}
        </span>
      </div>
    );
  };
  const handleOptionChange = e => {
    if (e.fullName === 'searchPanel.text' || e.name === 'columns') {
      setPageIndex(e.component.pageIndex());
      setPageSize(e.component.pageSize());
      setTimeout(() => {
        setTotalCount(e.component.totalCount());
      }, 500);
    }
    if (e.fullName === 'paging.pageSize') {
      setPageSize(e.value);
    }
    if (e.fullName === 'paging.pageIndex') {
      setPageIndex(e.value);
    }
    // if (e.fullName === 'selectedRowKeys') {

    // }
  };

  const handleContentReady = e => {
    if (e.component.shouldSkipNextReady) {
      e.component.shouldSkipNextReady = false;
    } else {
      e.component.shouldSkipNextReady = true;
      e.component.columnOption('command:select', 'visibleIndex', 99);
      e.component.updateDimensions();
    }
  };
  // eslint-disable-next-line no-unused-vars
  const handleChangePageIndex = pageIndex => {
    if (dataGridRef && dataGridRef.current) {
      dataGridRef.current.instance.pageIndex(pageIndex);
    }
    setPageIndex(pageIndex);
  };
  // eslint-disable-next-line no-unused-vars
  const handlePageSize = e => {
    const { value } = e.target;
    if (dataGridRef && dataGridRef.current) {
      dataGridRef.current.instance.pageSize(value);
    }
    setPageSize(value);
  };
  const renderOrderCell = item => (
    <div style={{ textAlign: 'right' }}>{item.rowIndex + 1}</div>
  );
  const setInitDataToForm = detailInfo => {
    editForm.setFieldValue('name', detailInfo.name);
    editForm.setFieldValue('ip', detailInfo.information.ip);
    editForm.setFieldValue('port', Number(detailInfo.information.port));
    editForm.setFieldValue('username', detailInfo.information.username);
    editForm.setFieldValue('password', detailInfo.information.password);
    editForm.setFieldValue('area', getAreaObjectForTree(detailInfo));
  };
  // const renderName = item => (
  //   <a
  //     href={`technopark.vn/camera/${item.data.id}`}
  //     target="_blank"
  //     className="no-border-button link-style"
  //   >
  //     {item.data.name}
  //   </a>
  // );
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    onLoadDetail(id);
    onLoadListCamera(id);
  }, []);
  // useEffect(() => {
  //   if (detailInfo.id) {
  //     loadData();
  //   }
  // }, [pageIndex, pageSize]);
  useEffect(() => {
    setInitDataToForm(detailInfo);
    setOpenEditMode(false);
  }, [detailInfo]);

  useEffect(() => {
    // setTotalCount(detailInfo.listCamera.totalCount);
    // setTotalPage(detailInfo.listCamera.totalPage);
    if (dataGridRef && dataGridRef.current) {
      dataGridRef.current.instance.clearSorting();
    }
  }, [detailInfo.listCamera]);
  return (
    <React.Fragment>
      <PageHeader
        title={detailInfo.name}
        showBackButton
        onBack={() => {
          // onClose();
          history.push('/list-nvr');
        }}
      />
      {loading && <Loading />}
      <div className="bold">
        {!loading && detailInfo.id && (
          <form onSubmit={editForm.handleSubmit}>
            <InfoContainer>
              <RowItem direction="column">
                <RowLabel>
                  {<FormattedMessage id="app.NVR.column.name" />}
                  {openEditMode && <span className="required">*</span>}
                </RowLabel>
                <RowContent>
                  <TextBox
                    disabled={!openEditMode}
                    width="100%"
                    id="NVRName"
                    name="name"
                    placeholder={intl.formatMessage({
                      id: 'app.NVR.name.placeholder',
                    })}
                    stylingMode="outlined"
                    defaultValue=""
                    value={editForm.values.name}
                    className="no-border-button"
                    onValueChanged={e => {
                      editForm.setFieldValue('name', e.value);
                    }}
                  >
                    <Validator>
                      <RequiredRule
                        message={intl.formatMessage({
                          id: 'app.NVR.message.require_input',
                        })}
                      />
                    </Validator>
                  </TextBox>
                </RowContent>
              </RowItem>
              <RowItem direction="column">
                <RowLabel>
                  {<FormattedMessage id="app.NVR.column.IP" />}
                  {openEditMode && <span className="required">*</span>}
                </RowLabel>
                <RowContent>
                  <TextBox
                    disabled={!openEditMode}
                    width="100%"
                    id="ip"
                    name="ip"
                    placeholder={intl.formatMessage({
                      id: 'app.NVR.ip.placeholder',
                    })}
                    stylingMode="outlined"
                    defaultValue=""
                    value={editForm.values.ip}
                    className="no-border-button"
                    onValueChanged={e => {
                      editForm.setFieldValue('ip', e.value);
                    }}
                  >
                    <Validator>
                      <RequiredRule
                        message={intl.formatMessage({
                          id: 'app.NVR.message.require_input',
                        })}
                      />
                      <PatternRule
                        message={intl.formatMessage({
                          id: 'app.NVR.message.ip_invalid',
                        })}
                        pattern={
                          /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/
                        }
                      />
                    </Validator>
                  </TextBox>
                </RowContent>
              </RowItem>
              <RowItem direction="column">
                <RowLabel>
                  {<FormattedMessage id="app.NVR.column.port" />}
                  {openEditMode && <span className="required">*</span>}
                </RowLabel>
                <RowContent>
                  <NumberBox
                    disabled={!openEditMode}
                    width="100%"
                    id="port"
                    name="port"
                    placeholder={intl.formatMessage({
                      id: 'app.NVR.port.placeholder',
                    })}
                    stylingMode="outlined"
                    defaultValue=""
                    value={Number(editForm.values.port)}
                    className="no-border-button"
                    onValueChanged={e => {
                      editForm.setFieldValue('port', e.value);
                    }}
                  >
                    <Validator>
                      <RequiredRule
                        message={intl.formatMessage({
                          id: 'app.NVR.message.require_input',
                        })}
                      />
                    </Validator>
                  </NumberBox>
                </RowContent>
              </RowItem>
              <RowItem direction="column">
                <RowLabel>
                  {<FormattedMessage id="app.NVR.column.area" />}
                  {openEditMode && <span className="required">*</span>}
                </RowLabel>
                <RowContent>
                  {/* tree here */}
                  <AreaTreeList
                    level={2}
                    required
                    allowSelectParentLevel
                    disabled={!openEditMode}
                    value={editForm.values.area || defaultArea}
                    onValueChanged={e => {
                      editForm.setFieldValue('area', e);
                    }}
                  />
                </RowContent>
              </RowItem>
              <RowItem direction="column">
                <RowLabel>
                  {<FormattedMessage id="app.NVR.column.version" />}
                </RowLabel>
                <RowContent style={{ position: 'relative' }}>
                  <TextBox
                    disabled
                    width="100%"
                    placeholder={intl.formatMessage({
                      id: 'app.NVR.column.version',
                    })}
                    stylingMode="outlined"
                    defaultValue=""
                    value={get(detailInfo, 'information._version', '')}
                  />
                </RowContent>
              </RowItem>
              <RowItem direction="column">
                <RowLabel>
                  {<FormattedMessage id="app.column.status" />}
                </RowLabel>
                <RowContent style={{ position: 'relative' }}>
                  <TextBox
                    disabled
                    width="100%"
                    placeholder={intl.formatMessage({
                      id: 'app.no_data',
                    })}
                    stylingMode="outlined"
                    defaultValue=""
                    value={getStatusCell(get(detailInfo, 'status', ''))}
                  />
                </RowContent>
              </RowItem>
              <RowItem direction="column">
                <RowLabel>
                  {<FormattedMessage id="app.NVR.column.serial" />}
                </RowLabel>
                <RowContent style={{ position: 'relative' }}>
                  <TextBox
                    className="CCC"
                    disabled
                    width="340px"
                    placeholder={intl.formatMessage({
                      id: 'app.no_data',
                    })}
                    title={get(detailInfo, 'information.serialNumber', '')}
                    stylingMode="outlined"
                    defaultValue=""
                    value={get(detailInfo, 'information.serialNumber', '')}
                  />
                </RowContent>
              </RowItem>
              <RowItem direction="column" style={{ marginBottom: '15px' }}>
                <RowLabel>Username</RowLabel>
                <RowContent style={{ position: 'relative' }}>
                  <TextBox
                    disabled
                    width="100%"
                    placeholder={intl.formatMessage({
                      id: 'app.no_data',
                    })}
                    stylingMode="outlined"
                    defaultValue=""
                    value={get(detailInfo, 'information.username', '')}
                  />
                </RowContent>
              </RowItem>
            </InfoContainer>
            <RowItem>
              <RowLabel />
              <RowContent
                className="button-container"
                style={{ justifyContent: 'flex-end' }}
              >
                {!openEditMode && (
                  <React.Fragment>
                    <Button
                      id="btnChangePassword"
                      text={intl.formatMessage({
                        id: 'app.NVR.button.change_pasword',
                      })}
                      type="default"
                      onClick={() => {
                        setIsOpenChangePassword(true);
                      }}
                    />
                    <Button
                      id="btnEdit"
                      text={intl.formatMessage({
                        id: 'app.button.edit',
                      })}
                      type="default"
                      onClick={() => {
                        setOpenEditMode(true);
                      }}
                    />
                  </React.Fragment>
                )}

                {openEditMode && (
                  <React.Fragment>
                    <Button
                      id="btnClsoe"
                      text={intl.formatMessage({
                        id: 'app.button.cancel',
                      })}
                      onClick={() => {
                        setInitDataToForm(detailInfo);
                        setOpenEditMode(false);
                      }}
                    />
                    <Button
                      id="btnSave"
                      text={intl.formatMessage({
                        id: 'app.button.save',
                      })}
                      type="default"
                      useSubmitBehavior
                    />
                  </React.Fragment>
                )}
              </RowContent>
            </RowItem>
          </form>
        )}
        <RowItem>
          <HeaderText style={{ marginBottom: '20px' }}>
            {' '}
            {intl.formatMessage({
              id: 'app.NVR.camera_list',
            })}
            <span style={{ fontWeight: '500' }}>
              {' '}
              ({detailInfo.listCamera ? detailInfo.listCamera.length : 0}{' '}
              {intl.formatMessage({
                id: 'app.NVR.device',
              })}
              )
            </span>
          </HeaderText>
        </RowItem>
        <NoImageGrid>
          <DataGrid
            ref={dataGridRef}
            className="center-row-grid"
            dataSource={detailInfo.listCamera}
            showColumnLines={false}
            noDataText="Không có dữ liệu"
            columnAutoWidth
            rowAlternationEnabled
            allowColumnResizing
            showBorders={false}
            onOptionChanged={handleOptionChange}
            onContentReady={handleContentReady}
            height="40vh"
          >
            <SearchPanel
              width={500}
              placeholder="Tìm theo tên"
              highlightSearchText={false}
            />
            <Paging enabled={false} />
            <Column
              dataField="order"
              caption="STT"
              allowSorting={false}
              width="auto"
              dataType="number"
              cellRender={renderOrderCell}
            />
            <Column
              dataField="name"
              caption="Tên Camera"
              allowSearch
              cellRender={nameRenderer}
            />
            <Column dataField="type" caption="Loại Camera" allowSearch />
            <Column
              dataField="status"
              caption="Trạng thái"
              cellRender={e => renderStatusCell(e.data)}
              allowSearch
            />
            <Column caption="Khu vực" allowSearch cellRender={renderArea} />
          </DataGrid>
        </NoImageGrid>
      </div>
      {isOpenChangePassword && (
        <Popup
          className="popup"
          visible
          title={detailInfo.name}
          showTitle
          onHidden={() => {
            setIsOpenChangePassword(false);
          }}
          dragEnabled
          width="600"
          height="auto"
        >
          <ChangePassword
            editingRow={detailInfo}
            onClose={() => {
              setIsOpenChangePassword(false);
            }}
          />
        </Popup>
      )}
    </React.Fragment>
  );
}

DetailNVR.propTypes = {
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  detailInfo: makeSelectEditingItem(),
  loading: makeSelectLoading(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadDetail: id => dispatch(loadDetail(id)),
    onLoadListCamera: id => dispatch(loadNVRCameras(id)),
    onUpdateRow: (id, data) => dispatch(updateRow(id, data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(DetailNVR);
