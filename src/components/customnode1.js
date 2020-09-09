// For normal nodes
import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';

const style = {zIndex: -9999, pointerEvents: 'none', opacity: 0, top: '50%'};
export default memo(({ data }) => {
  return (
    <>
      <Handle type="target" position="top" style={style} />
      <div>
            <br></br>
            <b>{data.course_code}</b>
            <br></br>
            {data.course_name}
      </div>
      <Handle type="source" position="bottom" style={style} />
    </>
  );
});
