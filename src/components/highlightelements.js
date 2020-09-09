// Helper functions to highlight nodes and edges
// Will highlight/unhighlight nodes based on selectedNodes dictionary
import { isEdge } from "react-flow-renderer";

export default function highlightElements(elements, selectedNodes, selectedEdges) {
    const newElements = elements.map((e) => {
        // It is an edge
        if (selectedEdges.hasOwnProperty(e.id)) {
            return {...e, style: {...e.style, stroke: 'red', opacity: 1}, animated: true};
        } else if (isEdge(e)) {
            return {...e, style: {...e.style, stroke: 'grey', opacity: 0.2}, animated: false};
        }

        // It is a node
        if (selectedNodes.hasOwnProperty(e.id)) {
            return {...e, style: {...e.style, filter: 'brightness(1.15)'}}
        } else {
            return {...e, style: {...e.style, filter: 'brightness(0.75)'}}
        }
    })

    return newElements;
}