import React from 'react';

const ColumnChart = ({
  dataChart = [],
  listColor = null,
  title,
  dataDetail,
}) => {
  const listColorState = listColor || ['#4B67E2', '#E4E9FF'];

  const data =
    dataChart && dataChart.length > 0
      ? dataChart?.map((e, index) => ({
          ...e,
          color: listColorState[index],
        }))
      : [
          {
            color: '#4B67E2',
            title: 'Số người đang hoạt động ',
            value: 30,
            percen: 30,
            zIndex: 3,
          },
          {
            color: '#E4E9FF',
            title: 'Số người không hoạt động ',
            value: 100,
            percen: 100,
            zIndex: 1,
          },
        ];

  return (
    <div
      style={{
        marginTop: 10,
        // paddingRight: 80,
      }}
    >
      {title ? (
        <div
          style={{
            marginBottom: 20,
            fontSize: 14,
            fontWeight: 500,
            color: '#11194C',
            width: '80%',
          }}
        >
          {title || ''}
        </div>
      ) : null}
      <div
        className="ct-flex-row"
        style={{
          //   justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div
          style={{
            position: 'relative',
            height: 180,
            borderRadius: 4,
            minWidth: 67,
            display: 'flex',
            flexDirection: 'column-reverse',
            backgroundColor: '#E4E9FF',
          }}
        >
          {data.map((item, index) => (
            <div
              style={{
                backgroundColor: item.color,
                height: `${item.value}%`,
                width: 67,
                bottom: 0,
                boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.04)',
                borderRadius: 4,
                position: 'relative',
              }}
              key={index.toString()}
            >
              <div
                style={{
                  height: '100%',
                  position: 'absolute',
                  left: 72,
                  width: 150,
                  fontSize: 12,
                  fontWeight: 400,
                  fontStyle: 'normal',
                  opacity: 0.68,
                  // top: `${item.value / 2}%`,
                }}
                className="ct-flex-row"
              >
                <div>__</div>
                <div style={{ marginLeft: 4 }}>
                  <div
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {item.total || 0}
                  </div>
                  <div>{item.value || 0}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 140,
            fontSize: 12,
            fontWeight: 400,
            marginLeft: 70,
          }}
        >
          <div style={{ marginBottom: 10, fontWeight: 900 }}>
            Tổng số: {dataDetail?.totalUser || 0}
          </div>
          {data.map((item, index) => (
            <div
              key={index.toString()}
              className="ct-flex-row"
              style={{ marginBottom: 16 }}
            >
              <div
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: '100%',
                  backgroundColor: item.color,
                  marginRight: 8,
                }}
              />
              <div style={{ maxWidth: 86 }}>{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColumnChart;
