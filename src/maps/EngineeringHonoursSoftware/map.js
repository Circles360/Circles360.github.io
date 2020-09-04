import React, {useState} from 'react';
import ReactFlow, {Controls, getConnectedEdges, isNode, isEdge, useStoreState, useStoreActions, ReactFlowProvider, EdgeText} from 'react-flow-renderer';
import CustomNode1 from '../../components/customnode1.js';
import CustomNode2 from '../../components/customnode2.js';
import HeaderNode1 from '../../components/headernode1.js';

var elementsData = require("./data.json");
var elementsNode = elementsData.filter(e => isNode(e));
var elementsEdge = elementsData.filter(e => isEdge(e));
var selectedNodes = {
    'SENGAH': 1
};

var selectedEdges = [];
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
        // highlightEdges(element);

        showPrerequisites(element);
        // Update the element's position for position helper
        for (var e of elements) {
            if (e.id === element.id) {
                e.position.x = element.position.x;
                e.position.y = element.position.y;
                console.log(e);
                break;
            }
        }
    };

    const showPrerequisites = (element) => {
        // only works when clicking an unselected node
        if (isEdge(element)) return;
        if (selectedNodes.hasOwnProperty(element.id)) return;
        if (element.data.conditions.prerequisites === null) return;

        var changeEdges = {};
        // Build a path of prerequisites until it hits a selected node.
        // Get list of all prerequisites
        // Get prerequisites of prerequisites, etc.
        var parentList = [];

        // TODO: DOES NOT DEAL WITH EXCLUSION PREREQUISITES PROPERLY. NEED TO
        // CHANGE IN GENERATOR
        
        // Populate list with non-selected prerequisites we need to investigate
        var flat_prereqs = element.data.conditions.prerequisites.flat(Infinity);
        for (var prereq of flat_prereqs) {
            console.log("PREREQUISITE", prereq);

            // FOR NOW: Light up all these edges regardless of their current state
            changeEdges['e' + prereq + '-' + element.id] = 1;
            if (selectedNodes.hasOwnProperty(prereq)) continue;
            parentList.push(prereq);
            console.log("PUSHED", prereq);
        }

        console.log("================================");
        console.log(parentList);
        console.log("================================");

        // Keep adding prerequisites until we hit selected nodes. Go until
        // parentList is empty
        while (parentList.length !== 0) {
            var current = getElement(parentList.shift());
            console.log("CURRENT IS", current);
            if (selectedNodes.hasOwnProperty(current)) continue;
            if (current.data.conditions.prerequisites === null) continue;

            var flat_prereqs = current.data.conditions.prerequisites.flat(Infinity);
            for (var prereq of flat_prereqs) {
                console.log("PREREQUISITE", prereq);
                if (! changeEdges.hasOwnProperty('e') + prereq.id + '-' + current.id) {
                    changeEdges['e' + prereq + '-' + current.id] = 1;
                }

                if (selectedNodes.hasOwnProperty(prereq)) continue;
                parentList.push(prereq);
            }
        }

        console.log("==================");
        console.log(changeEdges);
        console.log("==================");
        // For each edge, highlight it (FOR NOW. TODO)
        setElements((els) =>
            els.map((e) => {
                if (changeEdges.hasOwnProperty(e.id)) {
                    if (e.style.stroke === 'grey') return {...e, style: {...e.style, stroke: 'red', opacity: 1}, animated: true};
                    else if (e.style.stroke === 'red') return {...e, style: {...e.style, stroke: 'grey', opacity: 0.2}, animated: false};
                }
                return e;
            })
        )
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
                    //nodesDraggable={false}
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