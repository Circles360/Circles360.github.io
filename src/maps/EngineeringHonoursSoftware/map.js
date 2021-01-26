import React, {useState, useRef} from 'react';

import dataJSON from "./data.json"
import initialiseMapData from "../initialiseMapData.js";
import MapTemplate from '../mapTemplate.js';

var mapData = initialiseMapData(['SENGAH'], '3707', dataJSON);

const EngineeringSENGAH = () => {
    return <MapTemplate mapData={mapData}/>
};

export default EngineeringSENGAH;