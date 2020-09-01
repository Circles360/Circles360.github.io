import React, {useState} from 'react';
import ReactFlow, {Background, Controls, MiniMap} from 'react-flow-renderer';

var initialElements = [
    {id: '1', style: {opacity: 1}, position: {x: 0, y: 0}, data: {label: 'VINCENT'}, type: 'default'},
    {id: '2', style: {opacity: 1}, position: {x: 0, y: 100}, data: {label: 'HAYES'}, type: 'default'},
    {id: '3', style: {opacity: 1}, position: {x: 0, y: -100}, data: {label: 'JAMES'}, type: 'default'},
    
    {id: 'e1-2', source: '1', target: '2', type: 'step', animated: true}
];

const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
}

const Teaching = () => {
    const [elements, setElements] = useState(initialElements);
    const [isDraggable, setIsDraggable] = useState(true);

    const addNode = () => {
        setElements(e => e.concat({
            id: (e.length+1).toString(),
            data: {label: 'new node' + e.length},
            position: {x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight}
        }));
    };
    

    const onClick = (event, element) => {
        setElements((els) =>
            els.map((e) => {
                if (e.id === element.id) {
                    e.style.opacity = 0;
                    return e;
                }
                return e;
            })
        )
    }


    return (
        <div>
            <ReactFlow
                elements={elements}
                onLoad={onLoad}
                style={{width: "100%", height: "99vh"}}
                onElementClick={onClick}
            >
                <Background />
                <MiniMap 
                    nodeColor = {n=>{
                        if (n.data.label === 'VINCENT') return 'red';
                        return 'blue';
                    }}
                />
                <Controls />
            </ReactFlow>
            <div>
                <button type="button" onClick={addNode}>
                    ADD NEW NODE HERE!!!!
                </button>
            </div>
        </div>
    );
}

export default Teaching;