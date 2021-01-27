// For toggleable nodes
import React, { memo } from 'react';
import { Handle } from 'react-flow-renderer';

import Refresh from '../../assets/refresh.svg';

const style = {zIndex: -9999, pointerEvents: 'none', opacity: 0, top: '50%'};
const iconSize = {width: 12, position: 'relative', bottom: 2};

export default memo(({ data }) => {
  return (
    <>
      <Handle type="target" position="top" style={style} />
      <div>
            <br></br>
            <b>{data.course_code}</b>
            <div>
              <img src={Refresh} alt={data.course_code} style={iconSize}/>
            </div>
      </div>
      <Handle type="source" position="top" style={style} />
    </>
  );
});
