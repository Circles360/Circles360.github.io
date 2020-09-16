import React, {useState} from 'react';
import ReactFlow, {isNode, isEdge, ReactFlowProvider} from 'react-flow-renderer';
import TutorialNode1 from './tutorialnode1.js';
import TutorialNode2 from './tutorialnode2.js';

import hoverPrerequisites from './hoverprerequisites.js';
import unhoverPrerequisites from './unhoverprerequisites.js';
import highlightElements from './highlightelements.js';
import checkPrerequisites from './checkprerequisites.js';

import selectNode from './selectnode.js';
import unselectNode from './unselectnode.js';
import getSelectable from './getselectable.js';
import exclusionSwap from './exclusionswap.js';
import unselectUnconnected from './unselectunconnected.js';

var elementsData = [
    {id: "CODE0000", type: "tutorial1", data: {instructions: "Circles is an interactive graph to aid with your degree planning. Our timetable will automatically generate an plan for you which you can then adjust.", course_level: null, units: 0, terms: ["Term1, Term2, Term3"], conditions: {raw: "RAW", prereqs_executable: null, prerequisites: null, corequisites: null, units_required: null, level_for_units_required: null, core_year: null, other: null}, equivalents: null, exclusions: null, unlocks: ["CODE1111"]}, position: {x: 0, y: -100}, style: {display: "flex", textAlign: "center", alignItems: "center", justifyContent: "center", fontSize: 6, color: "white", background: "black", width: 64, height: 64, borderRadius: 32, filter: "brightness(1.15)", border: "2px dashed black"}, isHidden: false},
    {id: "CODE1111", type: "tutorial1", data: {instructions: "Click on a node to take the course", course_level: null, units: 6, terms: ["Term1, Term2, Term3"], conditions: {raw: "RAW", prereqs_executable: "CODE0000", prerequisites: ["CODE0000"], corequisites: null, units_required: null, level_for_units_required: null, core_year: null, other: null}, equivalents: null, exclusions: null, unlocks: ["CODE2222"]}, position: {x: -150, y: 0}, style: {display: "flex", textAlign: "center", alignItems: "center", justifyContent: "center", fontSize: 6, color: "white", background: "black", width: 64, height: 64, borderRadius: 32, filter: "brightness(1.15)", border: "2px dashed black"}, isHidden: false},
    {id: "CODE2222", type: "tutorial1", data: {instructions: "Courses light up when you meet all the prerequisites", course_level: null, units: 6, terms: ["Term1, Term2, Term3"], conditions: {raw: "RAW", prereqs_executable: "CODE1111", prerequisites: ["CODE1111"], corequisites: null, units_required: null, level_for_units_required: null, core_year: null, other: null}, equivalents: null, exclusions: null, unlocks: ["CODE3333", "CODE4444"]}, position: {x: 0, y: 0}, style: {display: "flex", textAlign: "center", alignItems: "center", justifyContent: "center", fontSize: 6, color: "white", background: "black", width: 64, height: 64, borderRadius: 32, filter: "brightness(1.15)", border: "2px dashed black"}, isHidden: false},
    {id: "CODE3333", type: "tutorial2", data: {instructions: "Some courses are togglable. Double click to try!", course_level: null, units: 6, terms: ["Term1, Term2, Term3"], conditions: {raw: "RAW", prereqs_executable: "CODE2222", prerequisites: ["CODE2222"], corequisites: null, units_required: null, level_for_units_required: null, core_year: null, other: null}, equivalents: null, exclusions: ["CODE4444"], unlocks: null}, position: {x: 150, y: 0}, style: {display: "flex", textAlign: "center", alignItems: "center", justifyContent: "center", fontSize: 6, color: "white", background: "black", width: 64, height: 64, borderRadius: 32, filter: "brightness(1.15)", border: "2px dashed black"}, isHidden: false},
    {id: "CODE4444", type: "tutorial2", data: {instructions: "SOME COURSES ARE TOGGLABLE. DOUBLE CLICK TO TRY!", course_level: null, units: 6, terms: ["Term1, Term2, Term3"], conditions: {raw: "RAW", prereqs_executable: "CODE2222", prerequisites: ["CODE2222"], corequisites: null, units_required: null, level_for_units_required: null, core_year: null, other: null}, equivalents: null, exclusions: ["CODE3333"], unlocks: null}, position: {x: 150, y: 0}, style: {display: "flex", textAlign: "center", alignItems: "center", justifyContent: "center", fontSize: 6, color: "white", background: "black", width: 64, height: 64, borderRadius: 32, filter: "brightness(1.15)", border: "2px dashed black"}, isHidden: false},
    {id: "CODE5555", type: "tutorial1", data: {instructions: "This course has a prerequisite of 18UOC. It will become selectable once you have taken enough units.", course_level: null, units: 6, terms: ["Term1, Term2, Term3"], conditions: {raw: "RAW", prereqs_executable: null, prerequisites: null, corequisites: null, units_required: 18, level_for_units_required: null, core_year: null, other: null}, equivalents: null, unlocks: null}, position: {x: 0, y: 100}, style: {display: "flex", textAlign: "center", alignItems: "center", justifyContent: "center", fontSize: 6, color: "white", background: "black", width: 64, height: 64, borderRadius: 32, filter: "brightness(1.15)", border: "2px dashed black"}, isHidden: false},

    {id: 'eCODE0000-CODE1111', source: 'CODE0000', target: 'CODE1111', type: 'straight', style: {opacity: '0.2', stroke: 'grey'}, animated: false, isHidden: false},
    {id: 'eCODE1111-CODE2222', source: 'CODE1111', target: 'CODE2222', type: 'straight', style: {opacity: '0.2', stroke: 'grey'}, animated: false, isHidden: false},
    {id: 'eCODE2222-CODE3333', source: 'CODE2222', target: 'CODE3333', type: 'straight', style: {opacity: '0.2', stroke: 'grey'}, animated: false, isHidden: false},
    {id: 'eCODE2222-CODE4444', source: 'CODE2222', target: 'CODE4444', type: 'straight', style: {opacity: '0.2', stroke: 'grey'}, animated: false, isHidden: false},
];

var nodesData = elementsData.filter(e => isNode(e));
var edgesData = elementsData.filter(e => isEdge(e));
var selectedNodes = {"CODE0000": 1};
var selectedEdges = {};
var selectableNodes = {"CODE1111": 1};
var potentialEdges = {"CODE0000-CODE1111": 1};
var hoverEdges = {};
var exclusionGroups = [["CODE3333", "CODE4444"]];
var exclusionNodes = {};

const nodeTypes = {
    tutorial1: TutorialNode1,
    tutorial2: TutorialNode2,
};

var exclusionNodes = {};
for (const group of exclusionGroups) {
    for (const exclusion of group) {
        exclusionNodes[exclusion] = 1;
    }
}

elementsData = highlightElements(elementsData, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges);

const onLoad = (reactFlowInstance) => {
    for (var group of exclusionGroups) {
        const last = group.pop();
        for (var course of elementsData) {
            if (last === course.id) {
                course.isHidden = true;
                for (var edge of elementsData) {
                    if (isNode(edge)) continue;
                    if (edge.source === last || edge.target === last) {
                        edge.isHidden = true;
                    }
                }
                break;
            }
        }
        group.push(last);
    }
    reactFlowInstance.fitView();
};


const InteractiveTutorial = () => {
    const [elements, setElements] = useState(elementsData);
    const [hoverNode, setHoverNode] = useState();
    var clickCount = 0;
    var singleClickTimer = '';

    const selectUnselect = (element) => {
        unhoverPrerequisites(hoverEdges);
        if (selectableNodes.hasOwnProperty(element.id)) {
            selectNode(elements, element, selectedNodes, selectedEdges, selectableNodes, potentialEdges);
        } else if (selectedNodes.hasOwnProperty(element.id)) {
            unselectNode(elements, element, selectedNodes, selectedEdges, selectableNodes, potentialEdges);
            unselectUnconnected(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges);
        }
        getSelectable(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges);
        setElements(highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges));
    }
    
    const toggleExclusion = (element) => {
        setElements(exclusionSwap(element, elements, edgesData, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges, exclusionGroups));
        setElements(highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges));
    }

    const onElementClick = (event, element) => {
        if (element.id === "CODE0000") return;
        if (isEdge(element)) return;
        if ((! selectableNodes.hasOwnProperty(element.id)) && (! selectedNodes.hasOwnProperty(element.id))) return;

        if (exclusionNodes.hasOwnProperty(element.id)) {
            clickCount++;
            if (clickCount === 1) {
                singleClickTimer = setTimeout(function() {
                    clickCount = 0;
                    selectUnselect(element);
                }, 200);
            } else if (clickCount === 2) {
                clearTimeout(singleClickTimer);
                clickCount = 0;
                toggleExclusion(element);
            }
        } else {
            selectUnselect(element);
        }
    }

    const onNodeMouseEnter = (event, node) => {
        setHoverNode(node);
        hoverPrerequisites(node, elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges);
        setElements(highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges));
    }

    const onNodeMouseLeave = (event, node) => {
        unhoverPrerequisites(hoverEdges);
        setElements(highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges));
    }

    return (
        <ReactFlow
            elements={elements}
            style={{width: "100%", height: "90vh"}}
            onLoad={onLoad}
            nodeTypes={nodeTypes}
            nodesConnectable={false}
            onElementClick={onElementClick}
            paneMoveable={false}
            selectNodesOnDrag={false}
            elementsSelectable={false}
            nodesDraggable={false}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseLeave={onNodeMouseLeave}
        >
        </ReactFlow>
    );
}

export default InteractiveTutorial;