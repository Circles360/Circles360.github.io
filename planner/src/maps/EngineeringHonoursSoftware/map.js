import React, {useState} from 'react';
import ReactFlow from 'react-flow-renderer';
import CustomNode1 from '../../components/customnode1.js';
const elementsData = require("./data.json");
//const eng_data = require("../../webscraper/engineering_degrees.json");
console.log(elementsData);

//Temporary generator for positioning

const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
};

const nodeTypes = {
    custom1: CustomNode1
};

const BESengah = () => {
    const [elements, setElements] = useState(elementsData);
    
    return (
        <div>
            <ReactFlow
                elements={elements}
                style={{width: '100%', height: '90vh'}}
                onLoad={onLoad}
                nodeTypes={nodeTypes}
            >
                
            </ReactFlow>
        </div>
    );
};

export default BESengah;