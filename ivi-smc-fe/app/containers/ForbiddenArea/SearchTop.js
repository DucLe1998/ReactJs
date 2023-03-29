import React, { useEffect, useState } from 'react';
import PageHeader from 'components/PageHeader';
import { SelectBox, TextBox } from 'devextreme-react';
import { getApiCustom } from 'utils/requestUtils';
import BtnSearch from 'components/Button/BtnSearch';
import { API_FORBIDDEN_AREA } from '../apiUrl';
import { SearchTopWrap } from './styled';

export default function SearchTop({ onFilter, loading }) {
  const [blocks, setBlocks] = useState([]);
  const [floors, setFloors] = useState([]);
  const [blockSelected, setBlockSelected] = useState();
  const [floorSelected, setFloorSelected] = useState();
  const [keyword, setKeyword] = useState('');

  const onSubmit = () => {
    onFilter({ blockId: blockSelected, floorId: floorSelected, keyword });
  };

  useEffect(() => {
    getApiCustom({ url: API_FORBIDDEN_AREA.LIST_BLOCKS }, setBlocks);
  }, []);

  useEffect(() => {
    setFloorSelected('');
    setFloors([]);
    if (blockSelected) {
      getApiCustom(
        {
          url: API_FORBIDDEN_AREA.LIST_FLOORS,
          params: {
            blockId: blockSelected,
          },
        },
        setFloors,
      );
    }
  }, [blockSelected]);

  return (
    <PageHeader title="Danh sách khu vực cấm">
      <SearchTopWrap>
        <TextBox
          placeholder="Tìm kiếm theo tên camera, mã ID camera"
          width={300}
          onChange={e => setKeyword(e?.event?.target?.value)}
        />
        <SelectBox
          items={blocks}
          placeholder="Chọn tòa nhà"
          width="150"
          displayExpr="blockName"
          valueExpr="blockId"
          defaultValue="ALL"
          onValueChanged={e => setBlockSelected(e?.value)}
          disabled={!blocks.length}
          showClearButton
        />
        <SelectBox
          items={floors}
          placeholder="Chọn tòa nhà"
          width="120"
          displayExpr="floorName"
          valueExpr="floorId"
          onValueChanged={e => setFloorSelected(e?.value)}
          disabled={!floors.length}
          showClearButton
        />
        <BtnSearch onClick={onSubmit} disabled={loading} />
      </SearchTopWrap>
    </PageHeader>
  );
}
