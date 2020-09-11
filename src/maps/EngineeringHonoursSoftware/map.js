import React, {useState} from 'react';
import ReactFlow, {Background, Controls, getConnectedEdges, isNode, isEdge, useStoreState, useStoreActions, ReactFlowProvider, EdgeText} from 'react-flow-renderer';

import CustomNode1 from '../../components/customnode1.js';
import CustomNode2 from '../../components/customnode2.js';
import HeaderNode1 from '../../components/headernode1.js';

import HoverInfo from '../../components/hoverinfo.js';
import hoverPrerequisites from '../../components/hoverprerequisites.js';
import unhoverPrerequisites from '../../components/unhoverprerequisites.js';

import DropdownD from "../../components/dropdownDegrees.js"
import { Segment } from 'semantic-ui-react'
import Sidebar from "../../components/sidebar.js"
import pkg from 'semantic-ui-react/package.json'

import positionHelper from '../../components/positionhelper.js';
import selectNode from '../../components/selectnode.js';
import unselectNode from '../../components/unselectnode.js';
import highlightElements from '../../components/highlightelements.js';
import getSelectable from '../../components/getselectable.js';
import checkPrerequisites from '../../components/checkprerequisites';
import DropdownDegrees from '../../components/dropdownDegrees';

var elementsData = require("./data.json");
var nodesData = elementsData.filter(e => isNode(e));
var edgesData = elementsData.filter(e => isEdge(e));
var selectedNodes = {
    'SENGAH': 1
}
var selectedEdges = {};
var selectableNodes = {};
var potentialEdges = {};
var hoverEdges = {};

// Load up the chart with initial selectable nodes and edges
for (const node of nodesData) {
    if (selectedNodes.hasOwnProperty(node.id)) {
        if (node.data.unlocks === null) continue;
        for (const unlockCourse of node.data.unlocks) {
            potentialEdges['e' + node.id + '-' + unlockCourse] = 1;
        }
    } else if (checkPrerequisites(node, nodesData)) {
        selectableNodes[node.id] = 1;
    }
}

// console.log("==========SelectedNodes==========");
// console.log(selectedNodes);
// console.log("==========SelectedEdges==========");
// console.log(selectedEdges);
// console.log("==========SelectableNodes==========");
// console.log(selectableNodes);
// console.log("==========PotentialEdges==========");
// console.log(potentialEdges);

elementsData = highlightElements(elementsData, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges);

const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
};

const nodeTypes = {
    custom1: CustomNode1,
    custom2: CustomNode2,
    header1: HeaderNode1
};

const BESengah = () => {
    const [elements, setElements] = useState(elementsData);
    const [hoverText, setHoverText] = useState(false);
    const [hoverNode, setHoverNode] = useState();
    const [sidebarOpen, setSidebarOpen] = useState(false);


    // ==========ONCLICK==========
    const onElementClick = (event, element) => {
        console.log("ONELEMENTCLICK");
        if (isEdge(element)) return; // Don't care about edges
        if (element.id === 'SENGAH') return; // Cannot click on main node
        if ((! selectableNodes.hasOwnProperty(element.id)) && (! selectedNodes.hasOwnProperty(element.id))) return; // Cannot select non selectable nodes

        // NOTE: Might not need this?????
        // Unhover edges which lit up on nodeMouseEnter
        unhoverPrerequisites(hoverEdges);

        // 1. Select the node and fill in edges.
        // - Deal with unselecting nodes
        if (selectableNodes.hasOwnProperty(element.id)) {
            selectNode(elements, element, selectedNodes, selectedEdges, selectableNodes, potentialEdges);
        } else if (selectedNodes.hasOwnProperty(element.id)) {
            unselectNode(elements, element, selectedNodes, selectedEdges, selectableNodes, potentialEdges);
        }

        // 2. Determine which nodes are now selectable
        // - Determine which previously selectable nodes are now unselectable
        getSelectable(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges);

        // After selecting node:
        console.log("==========SelectedNodes==========");
        console.log(selectedNodes);
        console.log("==========SelectedEdges==========");
        console.log(selectedEdges);
        console.log("==========SelectableNodes==========");
        console.log(selectableNodes);
        console.log("==========PotentialEdges==========");
        console.log(potentialEdges);

        // Render graph accordingly
        setElements(highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges));

        for (var e of elements) {
            if (e.id === element.id) {
                e.position.x = element.position.x;
                e.position.y = element.position.y;
                break;
            }
        }
    };
    // ===========================

    // ==========ONHOVER==========
    const onNodeMouseEnter = (event, node) => {
        // Display node information in top left
        setHoverText(true);
        setHoverNode(node);

        // If the node is unselected, highlight prerequisite edges in purple
        //if ((!selectedNodes.hasOwnProperty(node.id)) && (!selectableNodes.hasOwnProperty(node.id))) {
        hoverPrerequisites(node, elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges);
        //}
        setElements(highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges));
    }
    const onNodeMouseLeave = (event, node) => {
        setHoverText(false);
        unhoverPrerequisites(hoverEdges);
        setElements(highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges));
    }

    let hoverDisplay;
    if (hoverText) {
        hoverDisplay = <HoverInfo node={hoverNode}/>
    }
    // ===========================

    return (
        <Segment.Group horizontal>
            <Segment
                style={{width: "90%"}}
            >
                <ReactFlowProvider>
                    <ReactFlow
                        elements={elements}
                        style={{width: '100%', height: '90vh'}}
                        onLoad={onLoad}
                        nodeTypes={nodeTypes}
                        nodesConnectable={false}
                        onElementClick={onElementClick}
                        minZoom={0.1}
                        //setInitTransform={TransformUpdater({x: 100, y: 100, z: 1})}
                        nodesDraggable={false}
                        onNodeMouseEnter={onNodeMouseEnter}
                        onNodeMouseLeave={onNodeMouseLeave}
                        />
                </ReactFlowProvider>
            </Segment>
            <Sidebar style={{width: "10%", maxWidth: "10%"}}/>
        </Segment.Group>
    );
};

export default BESengah;