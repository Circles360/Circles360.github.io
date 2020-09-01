import React, {useState} from 'react';
import ReactFlow from 'react-flow-renderer';
import CustomNode1 from '../../components/customnode1.js';
import HeaderNode1 from '../../components/headernode1.js';

var elementsData = require("./data.json");
//const eng_data = require("../../webscraper/engineering_degrees.json");
console.log(elementsData);

//Temporary generator for positioning

const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
};

const nodeTypes = {
    custom1: CustomNode1,
    header1: HeaderNode1
};

const onElementClick = (event, element) => {
    if (element.id.match(/^e/)) return; // Don't care about edges

    console.log(element.id);
    console.log(element.position.x + ' ' + element.position.y);
    for (var e of elementsData) {
        if (e.id == element.id) {
            e.position.x = element.position.x;
            e.position.y = element.position.y;
        }
    }
}

// HELPER FUNCTION FOR POSITIONING
var positioning_data = [];
const positionHelper = () => {
    for (const e of elementsData) {
        if (!e.id.match(/^e/)) {
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
        console.log('{' + '"id": ' + '"' + e.id + '"' + ', position: {"x": ' + e.position.x + ', "y": ' + e.position.y + '}},');
    }
    console.log(']');
}


const BESengah = () => {
    const [elements, setElements] = useState(elementsData);

    return (
        <div>
            <ReactFlow
                elements={elements}
                style={{width: '100%', height: '100vh'}}
                onLoad={onLoad}
                nodeTypes={nodeTypes}
                onElementClick={onElementClick}
                nodesConnectable={false}
            >
            </ReactFlow>
            {/* <button type="button" onClick={positionHelper}> */}
                {/* Generate position */}
            {/* </button> */}
        </div>
    );
};

export default BESengah;