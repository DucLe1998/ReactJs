/* eslint-disable import/no-cycle */
/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import Board from '@asseinfo/react-kanban';
import '@asseinfo/react-kanban/dist/styles.css';
import { IconOption } from 'components/Custom/Icon/ListIcon';
// import { COLUMNSLISTUSER } from '../constants';

const ViewOptionTable = ({ callback, dataColumnTable, dataColumnDefault }) => {
  const abc = dataColumnDefault
    ? dataColumnDefault.length !== dataColumnTable.length
    : null;

  const board = {
    columns: [
      {
        id: 1,
        key: 1,
        cards: abc ? dataColumnDefault : dataColumnTable,
      },
    ],
  };
  return (
    <div style={{ width: 400, borderRadius: 6 }}>
      <div style={{ fontWeight: 400, fontSize: 14 }}>
        Điều chỉnh các thông tin hiển thị trong danh sách hiển thị trạng thái
        người dùng.
      </div>

      <Board
        renderCard={(item) => {
          if (item?.type === 'title') {
            return (
              <div
                style={{ marginBottom: 16, marginTop: 8 }}
                key={item.key.toString()}
              >
                <div>{item.caption}</div>
              </div>
            );
          }
          return (
            <div
              key={item.key.toString()}
              style={{
                width: 350,
                backgroundColor: '#F5F5FA',
                marginBottom: 10,
                padding: '6px 12px 6px 12px',
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 400,
                justifyContent: 'space-between',
              }}
              className="ct-flex-row"
            >
              <div>{item.caption || item.headerCellRender()}</div>
              <div>
                <IconOption />
              </div>
            </div>
          );
        }}
        disableColumnDrag
        initialBoard={board}
        onCardDragEnd={(e) => callback(e.columns[0].cards)}
      />
    </div>
  );
};

export default ViewOptionTable;
