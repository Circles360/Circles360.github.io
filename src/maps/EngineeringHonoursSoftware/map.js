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
};

var selectedEdges = {};
//const eng_data = require("../../webscraper/engineering_degrees.json");

console.log(elementsData);

console.log("=====SELECTED=====");
console.log(selectedNodes);

const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
};

const nodeTypes = {
    custom1: CustomNode1,
    custom2: CustomNode2,
    header1: HeaderNode1
};

// Given an id, get the corresponding element from the elementsData
const getElement = (id) => {
    for (var e of elementsData) {
        if (e.id === id) {
            return e;
        }
    }
    return null;
}

// Breaks down prerequisite list 


const BESengah = () => {
    const [elements, setElements] = useState(elementsData);

    const onElementClick = (event, element) => {
        console.log("ONELEMENTCLICK");
        if (isEdge(element)) return; // Don't care about edges

        getPrerequisites(elements, element, selectedNodes, selectedEdges)
        //setElements(showPrerequisites(elements, element, selectedNodes, nodesData), [, console.log("PREREQ CALLBACK")]);
        
        //setElements(selectNode(elements, elements), [, console.log("SELECTED CALLBACK")]);

        setElements(highlightElements(elements, selectedNodes, selectedEdges), [, console.log("HIGHLIGHTED")]);
        /*for (var e of elements) {
            if (e.id === element.id) {
                e.position.x = element.position.x;
                e.position.y = element.position.y;
                break;
            }
        }*/
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
                <button type="button" onClick={positionHelper(elements)}>
                    Generate position
                </button>
            </ReactFlowProvider>
        </div>
    );
};

export default BESengah;