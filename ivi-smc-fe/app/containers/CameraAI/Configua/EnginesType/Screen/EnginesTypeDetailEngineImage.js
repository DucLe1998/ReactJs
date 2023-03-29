/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PageHeader from 'components/PageHeader';
import Loading from 'containers/Loading/Loadable';
import { BiPlus } from 'react-icons/bi';
import gui from 'utils/gui';

import IconBtn from 'components/Custom/IconBtn';
import CustomTable from 'components/Custom/table/CustomTable';

import { IconDelete, IconEdit } from 'components/Custom/Icon/ListIcon';
import utils from 'utils/utils';
import PopupDelete from 'components/Custom/popup/PopupDelete';
import TitlePage from 'components/Custom/TitlePage';
// import PopupFormEngineImage from './EngineImage/PopupFormEngineImage';
import { CAMERA_AI_API_SRC } from '../../../../apiUrl';
import { getApi } from '../../../../../utils/requestUtils';

const EnginesTypeDetailEngineImage = ({ data, match }) => {
  const t = useHistory();

  const [itemDevice, setItemDevice] = useState('');
  const [pageSize, setPageSize] = useState(gui.optionsPageSize[0]);
  const [pageIndex, setPageIndex] = useState(1);
  const [openViewDelete, setOpenViewDelete] = useState(false);
  // const [isOpenViewAdd, setIsOpenViewAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataDetail, setDataDetail] = useState('');

  useEffect(() => {
    fetchData();
  }, [data]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getApi(`${CAMERA_AI_API_SRC}/engine-images`, {
        engineTypeId: match.params.id,
      });
      setLoading(false);
      if (res.code === 200) {
        setDataDetail(res.data);
      }
    } catch (error) {
      setLoading(false);
      utils.showToast(error.response?.data?.message, 'error');
    }
  };

  console.log('dataDetail', dataDetail);

  const handleChangePageIndex = pageIndex => {
    setPageIndex(pageIndex);
  };

  const handlePageSize = e => {
    const { value } = e.target;
    setPageSize(value);
    setPageIndex(1);
  };

  const handlerDeleteItem = () => {
    const dto = {
      id: itemDevice.id,
    };
    console.log('dto ------------------> delete', dto);
    // deleteItem(dto);
  };

  const handlerAddItem = v => {
    // addItem(v);
    console.log('v------------->', v);
  };

  return (
    <>
      <div style={{ marginTop: 32 }}>
        <TitlePage
          title={`Chi tiết: ${match.params.name}`}
          urlBack="/camera-ai/configs/engines-type"
          onCLick={() => {
            t.push('/camera-ai/configs/engines-type');
          }}
        />
      </div>

      <PageHeader
        title="Engine image"
        showSearch={false}
        showPager
        pageIndex={pageIndex}
        totalCount={(data && data.count) || 0}
        rowsPerPage={pageSize}
        handlePageSize={handlePageSize}
        handleChangePageIndex={handleChangePageIndex}
      >
        <IconBtn
          style={styles.iconBtnHeader}
          onClick={() => {
            t.push({
              pathname: `/camera-ai/configs/engines-type/${match.params.id}/${
                match.params.name
              }/engine-image/add`,
              state: {
                beforeUrl: window.location.pathname,
                detailEngineImage: null,
              },
            });
            // setIsOpenViewAdd(true);
          }}
          icon={<BiPlus color="gray" />}
          showTooltip="Create Full file"
        />
      </PageHeader>

      <CustomTable
        data={[]}
        disabledSelect
        maxHeight={`calc(100vh - ${225}px)`}
        row={[
          {
            caption: 'STT',
            cellRender: item => (
              <div style={{ textAlign: 'center' }}>
                {(pageIndex - 1) * pageSize + (item.rowIndex + 1)}
              </div>
            ),
            alignment: 'center',
            width: 50,
          },
          {
            dataField: 'name',
            caption: 'Name',
          },
          {
            dataField: 'Version',
            caption: 'Phiên bản',
          },
          {
            dataField: 'Tag',
            caption: 'Tag',
          },
          {
            dataField: 'Repository',
            caption: 'Repository',
          },
          {
            dataField: 'Lastupdate',
            caption: 'Last update',
          },

          {
            caption: 'Hành động',
            cellRender: v => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <IconBtn
                  icon={<IconEdit />}
                  onClick={() => {
                    setItemDevice(v.data);
                    // setIsOpenAddNew(true);
                  }}
                  showTooltip="Edit"
                />
                <IconBtn
                  icon={<IconDelete />}
                  onClick={() => {
                    setItemDevice(v.data);
                    setOpenViewDelete(true);
                  }}
                  showTooltip="Delete"
                />
              </div>
            ),
            alignment: 'center',
          },
        ]}
      />

      {openViewDelete && (
        <PopupDelete
          typeTxt={`Engine Image: ${itemDevice?.name || ''}`}
          onClickSave={handlerDeleteItem}
          onClose={v => setOpenViewDelete(v)}
        />
      )}

      {/* {isOpenViewAdd && (
        <PopupFormEngineImage
          onClickSave={handlerAddItem}
          onClose={v => setIsOpenViewAdd(v)}
        />
      )} */}

      {loading && <Loading />}
    </>
  );
};

const styles = {
  iconBtnHeader: {
    backgroundColor: 'rgba(116, 116, 128, 0.08)',
    height: 36,
    width: 36,
    borderRadius: 6,
  },
};

export default EnginesTypeDetailEngineImage;
