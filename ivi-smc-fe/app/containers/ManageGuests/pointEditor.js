import React, { useState, useEffect } from 'react';
import TagBox from 'devextreme-react/tag-box';
import { showError } from 'utils/toast-utils';

export default function PointEditor({ value, onChange, loadData }) {
  const [dataSource, setDataSource] = useState([]);
  const [hash, setHash] = useState({});
  const values = value.map((v) => v.pointId);
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const { signal } = controller;
    (async () => {
      try {
        const result = await loadData(signal);
        if (isMounted) {
          setDataSource(result);
          setHash(
            result.reduce(
              (total, cur) => ({
                ...total,
                [cur.pointId]: cur,
              }),
              {},
            ),
          );
        }
      } catch (err) {
        if (err.message != 'canceled') {
          showError(err);
        }
      }
    })();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <TagBox
      dataSource={dataSource}
      defaultValue={values}
      displayExpr="pointName"
      showSelectionControls
      showMultiTagOnly={false}
      valueExpr="pointId"
      applyValueMode="useButtons"
      searchEnabled
      onValueChanged={(e) => {
        const data = e.value.map((v) => hash[v]);
        onChange(data);
      }}
    />
  );
}
