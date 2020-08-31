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
    if (element.id.match(/^e/)) return;
    console.log(element.data.course_code);
    console.log(element.position.x + ' ' + element.position.y);
    for (var e of elementsData) {
        if (e.id == element.data.course_code) {
            e.position.x = element.position.x;
            e.position.y = element.position.y;
        }
    }
}

// HELPER FUNCTION FOR POSITIONING
var positioning_data = [];
/*const positionHelper = () => {
    for (const e of elements) {
        if (!e.id.match(/^e/)) {
            position=()
        } else {
            positioning_data.push(e);
        }
    }
}*/


const BESengah = () => {
    const [elements, setElements] = useState(elementsData);
    const positionHelper = () => {
        console.log(elementsData);
    }

    return (
        <div>
            <ReactFlow
                elements={elements}
                style={{width: '100%', height: '90vh'}}
                onLoad={onLoad}
                nodeTypes={nodeTypes}
                onElementClick={onElementClick}
            >
            </ReactFlow>
            <button type="button" onClick={positionHelper}>
                Generate position
            </button>
        </div>
    );
};

export default BESengah;