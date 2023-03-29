import React, { useEffect, useState } from 'react';
import TreeView from 'devextreme-react/tree-view';
import CtLoading from 'components/Custom/CtLoading';
import 'whatwg-fetch';
import { FiPlus } from 'react-icons/fi';
import { BiMap } from 'react-icons/bi';
import { BsDiamond } from 'react-icons/bs';
import 'components/Custom/camera/styles.css';
import IconBtn from 'components/Custom/IconBtn';
import utils, { uniqueElements } from 'utils/utils';
import { callApi } from 'utils/requestUtils';
import { API_ROUTE } from 'containers/apiUrl';

const colorGreen = '#40A574';
const colorGray = 'rgba(60, 60, 67, 0.6)';

const ViewTreeCamera = ({ callback, listCamera, dataDetail, isDisabled }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlerDragStart = (e, i) => {
    callback(i, 'dragStart');
  };

  useEffect(() => {
    if (dataDetail) {
      fetchData(dataDetail);
    } else {
      setData([]);
      callback(null, 'removeAll');
    }
  }, [dataDetail]);

  const fetchData = async v => {
    setLoading(true);
    try {
      const params = utils.queryString({
        index: 1,
        pageSize: 500,
        areaId: v?.areaId,
        zoneId: v?.zoneId,
        blockId: v?.blockId,
        floorId: v?.floorId,
        type: 'CAMERA',
        isFilterTree: true,
      });

      const fc = await callApi(`${API_ROUTE.LIST_NVR}?${params}`, 'GET');
      if (fc.code === 200) {
        const newData = uniqueElements(fc.data.data, 'id');

        if (newData.length === 0) {
          setLoading(false);
          callback(null, 'removeAll');
          setData([]);
          return;
        }

        const abc = newData.map(i => ({
          ...i,
          id: `cameraId_${v?.blockId ? 'blockId_' : ''}${
            v?.zoneId ? 'zoneId_' : ''
          }${v?.floorId ? 'floorId' : ''}${i.id}`,
          cameraId: i.id,
          name: i.name,
          hasItems: false,
          code: i.code,
          parentId: 1,
          type: i.type,
          status: i.status,
        }));

        if (listCamera && listCamera.length) {
          const cams = [];
          (listCamera || []).forEach(element => {
            const cam = abc.find(x => x.id === element.id);
            if (cam) {
              cams.push({ ...cam, timeAddToView: new Date().getTime() });
            }
          });
          if (cams.length > 0) {
            callback(cams, 'addMulti');
          }
        }

        const dto = await {
          id: 1,
          name: v?.location || 'Danh sách camera',
          hasItems: true,
          type: 'zone',
          expanded: true,
        };
        setLoading(false);
        setData([dto].concat(abc));
      }
    } catch (error) {
      setLoading(false);
      setData([]);
      utils.showToast(
        'Bạn không thể xem Camera vì không có quyền tại khu vực này',
        'error',
      );
    }
  };

  const renderTreeViewItem = item => {
    const foundExist = listCamera.find(i => i.id === item.id);

    const itemTypeCamera = item.type === 'CAMERA';

    const renderStatus = v => {
      switch (v) {
        case 'ACTIVE':
          return '#32D74B';
        case 'INACTIVE':
          return '#FF453A';
        default:
          return colorGray;
      }
    };

    const renderIcon = v => {
      switch (v) {
        case 'block':
          return <BsDiamond color={colorGray} />;
        case 'floor':
          return <BsDiamond color={colorGray} />;
        case 'unit':
          return <BsDiamond color={colorGray} />;
        case 'zone':
          return <BiMap size="1.3em" color={colorGray} />;
        default:
          return null;
      }
    };

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12,
        }}
        draggable={!foundExist && itemTypeCamera && !isDisabled}
        onDragStart={e => handlerDragStart(e, item)}
        onDragOver={e => e.preventDefault()}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            textTransform: 'none',
            fontWeight: !itemTypeCamera && 'bold',
            textAlign: 'left',
          }}
        >
          {itemTypeCamera && (
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: renderStatus(item.status),
                marginRight: 3,
                // marginLeft: 4,
              }}
            />
          )}
          <span style={{ marginRight: 5 }}>{renderIcon(item.type)}</span>
          <span style={{ marginTop: !itemTypeCamera && 3 }}>{item.name}</span>
        </div>
        {itemTypeCamera && !foundExist && (
          <div>
            <IconBtn
              onClick={() => {
                if (isDisabled) {
                  return;
                }
                callback(
                  { ...item, timeAddToView: new Date().getTime() },
                  'add',
                );
              }}
              style={{ padding: 3 }}
              icon={<FiPlus size={14} color={colorGreen} />}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      {loading && <CtLoading />}
      <TreeView
        dataStructure="plain"
        rootValue=""
        parentIdExpr="parentId"
        displayExpr="name"
        itemRender={renderTreeViewItem}
        dataSource={data}
        focusStateEnabled={false}
        className="cus-tree-view"
        noDataText="Không có dữ liệu"
        expandAllEnabled
      />
    </div>
  );
};

export default ViewTreeCamera;
