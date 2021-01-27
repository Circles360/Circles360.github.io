import {isNode, isEdge} from 'react-flow-renderer';

import CustomNode1 from '../../components/customnode1.js';
import CustomNode2 from '../../components/customnode2.js';
import HeaderNode1 from '../../components/headernode1.js';

import dropdownSearchInit from './dropdownSearchInit';
import selectableInit from './selectableInit';
import hiddenInit from './hiddenInit';
import additionalSearchInit from './additionalSearchInit';
import coursesInit from './coursesInit';

import coursesJSON from "../../webscraper/courses.json";

import dataExclusionJSON from "../maps/ComputerScienceCOMPA1/data_exclusion.json";

export default function mapDataInit(specialisations, program, dataJSON) {
    var mapData = {};

    const elementsData = dataJSON.slice(); // TODO: Do we need to shallow copy via slice???
    
    // Initialise dropdown search data
    var searchNodeOptions = [];
    dropdownSearchInit(elementsData, specialisations, searchNodeOptions);
    
    // Initialise dropdown degree data
    var searchAdditionalOptions = [];
    additionalSearchInit(dataJSON, coursesJSON, searchAdditionalOptions);
    
    var nodesData = elementsData.filter(e => isNode(e));
    var edgesData = elementsData.filter(e => isEdge(e));
    
    var selectedNodes = {};
    for (const specialisation of specialisations) selectedNodes[specialisation] = 1;
    
    var selectedEdges = {};
    var selectableNodes = {};
    var potentialEdges = {};
    var hoverEdges = {};
    var hiddenNodes = {};
    var hiddenEdges = {};
    
    // Load up the chart with initial selectable nodes and edges
    selectableInit(elementsData, nodesData, selectedNodes, selectableNodes, potentialEdges);
    
    // Load up the chart with initial hidden nodes and edges
    var exclusionGroups = dataExclusionJSON.slice();
    const exclusionNodes = {};
    hiddenInit(elementsData, exclusionGroups, exclusionNodes, hiddenNodes, hiddenEdges);
    
    // Update coursesJSON with dataJSON data to be passed down to degree planner
    const updatedCoursesJSON = coursesInit(coursesJSON, dataJSON);
    
    const nodeTypes = {
        custom1: CustomNode1,
        custom2: CustomNode2,
        header1: HeaderNode1
    };
    
    const layoutStyle = {overflowX: "hidden", overflowY: "overlay", width: "100vw", height: "100vh"};
    
    mapData.specialisations = specialisations;
    mapData.program = program;
    mapData.elementsData = elementsData;
    mapData.searchNodeOptions = searchNodeOptions;
    mapData.searchAdditionalOptions = searchAdditionalOptions;
    mapData.nodesData = nodesData;
    mapData.edgesData = edgesData;
    mapData.selectedNodes = selectedNodes;
    mapData.selectedEdges = selectedEdges;
    mapData.selectableNodes = selectableNodes;
    mapData.potentialEdges = potentialEdges;
    mapData.hoverEdges = hoverEdges;
    mapData.hiddenNodes = hiddenNodes;
    mapData.hiddenEdges = hiddenEdges;
    mapData.exclusionGroups = exclusionGroups;
    mapData.exclusionNodes = exclusionNodes;
    mapData.updatedCoursesJSON = updatedCoursesJSON;
    mapData.nodeTypes = nodeTypes;
    mapData.layoutStyle = layoutStyle;

    return mapData;
}
