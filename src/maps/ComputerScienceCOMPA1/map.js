import React, {useState, useRef} from 'react';

import dataJSON from "./data.json"
import initialiseMapData from "../initialiseMapData.js";
import MapTemplate from '../mapTemplate.js';

var mapData = initialiseMapData(['COMPA1'], '3778', dataJSON);

const ComputerScienceCOMPA1 = () => {
    return <MapTemplate mapData={mapData}/>
};

export default ComputerScienceCOMPA1;