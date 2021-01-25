import React, {useState, useRef} from 'react';
import ReactFlow, { isNode, isEdge, ReactFlowProvider } from 'react-flow-renderer';


import HoverInfo from '../../components/hoverinfo.js';
import hoverPrerequisites from '../../components/hoverprerequisites.js';
import unhoverPrerequisites from '../../components/unhoverprerequisites.js';

import { Grid, Segment, Container, Dropdown, Header, Checkbox } from 'semantic-ui-react'
import Sidebar from "../../components/sidebar.js"

import DegreePlanner from "../../components/degreeplanner.js"
import DropdownSearch from "../../components/dropdownsearch.js"

// Initialisation helper functions
import dropdownSearchInit from '../../components/initialisation/dropdownSearchInit';
import selectableInit from '../../components/initialisation/selectableInit';
import hiddenInit from '../../components/initialisation/hiddenInit';
import additionalSearchInit from '../../components/initialisation/additionalSearchInit';
import coursesInit from '../../components/initialisation/coursesInit';

// import positionHelper from '../../components/positionhelper.js';
import selectNode from '../../components/selectnode.js';
import unselectNode from '../../components/unselectnode.js';
import highlightElements from '../../components/highlightelements.js';
import getSelectable from '../../components/getselectable.js';
import checkPrerequisites from '../../components/checkprerequisites';
import exclusionSwap from '../../components/exclusionswap.js';

import unselectUnconnected from '../../components/unselectunconnected.js';
import coursesJSON from "../../webscraper/courses.json";
import dataJSON from "./data.json"

import initialiseMapData from "./initialiseMapData.js";
import MapTemplate from './mapTemplate.js';

var mapData = initialiseMapData(['COMPA1'], '3778', dataJSON);

const ComputerScienceCOMPA1 = () => {
    console.log("INSIDE COMPA1 map");
    console.log(mapData.selectedNodes);
    return <MapTemplate mapData={mapData}/>
};

export default ComputerScienceCOMPA1;