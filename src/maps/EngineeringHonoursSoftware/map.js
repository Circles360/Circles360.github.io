import React, {useState} from 'react';
import ReactFlow, {Controls, getConnectedEdges, isNode, isEdge, useStoreState, useStoreActions, ReactFlowProvider, EdgeText} from 'react-flow-renderer';
import CustomNode1 from '../../components/customnode1.js';
import CustomNode2 from '../../components/customnode2.js';
import HeaderNode1 from '../../components/headernode1.js';

import positionHelper from '../../components/positionhelper.js';
import selectNode from '../../components/selectnode.js';
import showPrerequisites from '../../components/showprerequisites.js';
import highlightElements from '../../components/highlightelements.js';
import getPrerequisites from '../../components/getprerequisites.js';

var elementsData = require("./data.json");
var nodesData = elementsData.filter(e => isNode(e));
var edgesData = elementsData.filter(e => isEdge(e));
var selectedNodes = {
    'SENGAH': 1
}
var selectedEdges = {};
var selectableNodes = {};
var potentialEdges = {};

// Load up the chart with initial selectable nodes and edges
for (const headerNode of nodesData) {
    if (headerNode.id === 'SENGAH') {
        for (const course of headerNode.data.unlocks) {
            console.log(course);
            selectableNodes[course] = 1;
            potentialEdges['eSENGAH-' + course] = 1;
        }
        break;
    }
}

elementsData = highlightElements(elementsData, selectedNodes, selectedEdges, selectableNodes, potentialEdges);

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

    const onElementClick = (event, element) => {
        console.log("ONELEMENTCLICK");
        if (isEdge(element)) return; // Don't care about edges
        if (element.id === 'SENGAH') return; // Cannot click on main node
        if ((! selectableNodes.hasOwnProperty(element.id)) && (! selectedNodes.hasOwnProperty(element.id))) return; // Cannot select non selectable nodes

        // 1. Select the node and fill in edges.
        // - Deal with unselecting nodes
        selectNode(elements, element, selectedNodes, selectedEdges, selectableNodes, potentialEdges);

        // After selecting node:
        console.log("==========SelectedNodes==========");
        console.log(selectedNodes);
        console.log("==========SelectedEdges==========");
        console.log(selectedEdges);
        console.log("==========SelectableNodes==========");
        console.log(selectableNodes);
        console.log("==========PotentialEdges==========");
        console.log(potentialEdges);

        // 2. Determine which nodes are now selectable
        // - Determine which previously selectable nodes are now unselectable
        

        // Render graph accordingly
        setElements(highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges));
        

        // 1. Fill in the edges (maybe make non opaque grey show potential edges?)
        // 2. Highlight the selected node
        // 3. Determine children to unlock and new potential edges
        // 4. Fill in potential edges



        //getPrerequisites(elements, element, selectedNodes, selectedEdges)
        //setElements(showPrerequisites(elements, element, selectedNodes, nodesData), [, console.log("PREREQ CALLBACK")]);
        
        //setElements(selectNode(elements, elements), [, console.log("SELECTED CALLBACK")]);

        //setElements(highlightElements(elements, selectedNodes, selectedEdges), [, console.log("HIGHLIGHTED")]);
        for (var e of elements) {
            if (e.id === element.id) {
                e.position.x = element.position.x;
                e.position.y = element.position.y;
                break;
            }
        }
    };

    const highlightEdges = (element) => {
        if (isEdge(element)) return;
        const connectedEdges = getConnectedEdges([element], edgesData);
        const connectedEdgeIds = connectedEdges.map(e => e.id);
        
        setElements((els) => 
            els.map((e) => {
                //if (isEdge(e)) console.log(e.id);
                if (connectedEdgeIds.includes(e.id)) {
                    var stroke_colour;
                    if (e.style.stroke === 'grey') return {...e, style: {...e.style, stroke: 'red', opacity: 1}, animated: true};
                    else if (e.style.stroke === 'red') return {...e, style: {...e.style, stroke: 'grey', opacity: 0.2}, animated: false};
                }
                return e;
            })
        )
    }

    return (
        <div>
            <ReactFlowProvider>
                <ReactFlow
                    elements={elements}
                    style={{width: '100%', height: '90vh'}}
                    onLoad={onLoad}
                    nodeTypes={nodeTypes}
                    onElementClick={onElementClick}
                    nodesConnectable={false}
                    minZoom={0.1}
                    //setInitTransform={TransformUpdater({x: 100, y: 100, z: 1})}
                    nodesDraggable={false}
                >
                    <Controls />
                </ReactFlow>
                <button type="button">
                    Generate position
                </button>
            </ReactFlowProvider>
        </div>
    );
};

export default BESengah;