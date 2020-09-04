import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';

export default memo(({ data }) => {
  return (
    <>
      <Handle type="target" position="top" style={{zIndex: -9999, pointerEvents: 'none', opacity: 0, top: '50%'}} />
      <div>
            <br></br>
            <b>{data.course_code}</b>
            <br></br>
            {data.course_name}
      </div>
      <Handle type="source" position="bottom" style={{zIndex: -9999, pointerEvents: 'none', opacity: 0, bottom: '50%'}} />
    </>
  );
});
