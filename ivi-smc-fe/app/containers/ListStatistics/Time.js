import React, { useState } from 'react';
import { format } from 'date-fns';
import { useInterval } from 'ahooks';

export default function Time({ setIsLoad }) {
  const [time, setTime] = useState(new Date());

  useInterval(() => {
    setIsLoad(prev => prev + 1);
    setTime(new Date());
  }, 10 * 60 * 1000);

  return (
    <div>
      <span
        style={{
          color: 'rgba(0, 0, 0, 0.6)',
          fontWeight: 700,
          fontSize: 22,
        }}
      >
        Cập nhật lúc {format(time, 'HH:mm:ss - dd/MM/yyyy')}
      </span>
    </div>
  );
}
