import React, {useState, useRef} from 'react';

import dataJSON from "./data.json"
import mapDataInit from "../../initialisation/mapDataInit.js";
import MapTemplate from '../../mapTemplate.js';

var mapData = mapDataInit(['SENGAH'], '3707', dataJSON);

const EngineeringSENGAH = () => {
    return <MapTemplate mapData={mapData}/>
};

export default EngineeringSENGAH;