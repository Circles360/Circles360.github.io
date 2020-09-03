import React, {useState} from 'react';
import ReactFlow, {Controls, getConnectedEdges, isNode, isEdge, useStoreState, useStoreActions, ReactFlowProvider} from 'react-flow-renderer';
import CustomNode1 from '../../components/customnode1.js';
import HeaderNode1 from '../../components/headernode1.js';
import '../../styles/nodeclass.css';

var elementsData = require("./data.json");
var elementsNode = elementsData.filter(e => isNode(e));
var elementsEdge = elementsData.filter(e => isEdge(e));
var selectedNodes = [elementsData[0]];
var selectedEdges = [];
//const eng_data = require("../../webscraper/engineering_degrees.json");

console.log(elementsData);

const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
};

const nodeTypes = {
    custom1: CustomNode1,
    header1: HeaderNode1
};

const BESengah = () => {
    const [elements, setElements] = useState(elementsData);
    // HELPER FUNCTION FOR POSITIONING
    var positioning_data = [];
    const positionHelper = () => {
        for (const e of elements) {
            if (isNode(e)) {
                positioning_data.push({
                    id: e.id,
                    position: {x: e.position.x, y: e.position.y},
                });
            }
        }
        // Write data to position output file. Note we have to do this ourselves as we
        // are making a server write to a local file.
        console.log('[');
        for (const e of positioning_data) {
            console.log('{"id": "' + e.id + '", "position": {"x": ' + e.position.x + ', "y": ' + e.position.y + '}},');
        }
        console.log(']');
    }

    const onElementClick = (event, element) => {
        if (isEdge(element)) return; // Don't care about edges
        //useStoreActions(action => actions.updateTransform(useStoreState(state => state.transform)), [100, 100, 1]);
        highlightEdges(element);

        // Update the element's position for position helper
        for (var e of elements) {
            if (e.id === element.data.course_code) {
                e.position.x = element.position.x;
                e.position.y = element.position.y;
                console.log(e);
                break;
            }
        }
    };

    const showPrerequisites = (element) => {
        if (isEdge(element)) return;
        var changeEdges = {};
        // Build a path of prerequisites until it hits a selected node.
        // Get list of all prerequisites
        // Get prerequisites of prerequisites, etc.

        var parentList = [];

        // Populate list with prerequisites we need to investigate
        for (var parent of element.data.conditions.prerequisites) {
            if (selectedNodes.hasOwnProperty(child)) continue;
            parentList.push(parent);
        }

        // Keep adding prerequisites until we hit selected nodes. Go until
        // List is empty
        while (parentList.length !== 0) {
            
        }


    }

    const highlightEdges = (element) => {
        if (isEdge(element)) return;
        const connectedEdges = getConnectedEdges([element], elementsEdge);
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
                <button type="button" onClick={positionHelper}>
                    Generate position
                </button>
            </ReactFlowProvider>
        </div>
    );
};

export default BESengah;