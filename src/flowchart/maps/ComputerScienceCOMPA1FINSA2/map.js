import React from 'react';

import dataJSON from "./data.json"
import mapDataInit from "../../initialisation/mapDataInit.js";
import MapTemplate from '../../mapTemplate.js';

var mapData = mapDataInit(['COMPA1', 'FINSA2'], '3778', dataJSON);

const ComputerScienceCOMPA1FINSA2 = () => {
    return <MapTemplate mapData={mapData}/>
};

export default ComputerScienceCOMPA1FINSA2;