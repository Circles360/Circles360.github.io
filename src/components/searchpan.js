import React, {useState} from 'react';
import { useStoreActions } from 'react-flow-renderer';
import getElement from './getelement.js';

export default function SearchPan(props) {
    const { updateTransform } = useStoreActions((actions) => actions);
    const [name, setName] = useState("");
    
    const TransformUpdater = (x, y, zoom) => {
        updateTransform({x, y, k: zoom});
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            // uppertransform the name
            var id = name.toUpperCase();
            const element = getElement(id, props.elements);
            if (element === null) {
                alert("NOTHING");
            } else {
                console.log("X: " + element.position.x);
                console.log("Y: " + element.position.y);
                TransformUpdater(-element.position.x + 500, -element.position.y + 500, 1);
            }
        }
    }

    return <input 
        type="text"
        onKeyDown={handleKeyDown}
        onChange={e => setName(e.target.value)}
        name="title"
    />
}