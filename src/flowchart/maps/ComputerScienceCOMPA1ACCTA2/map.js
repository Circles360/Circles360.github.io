import React, {useState, useRef} from 'react';

import dataJSON from "./data.json"
import mapDataInit from "../../initialisation/mapDataInit.js";
import MapTemplate from '../../mapTemplate.js';

var mapData = mapDataInit(['COMPA1', 'ACCTA2'], '3778', dataJSON);

const ComputerScienceCOMPA1ACCTA2 = () => {
    return <MapTemplate mapData={mapData}/>
};

export default ComputerScienceCOMPA1ACCTA2;