// Helper functions to highlight nodes and edges
// Will highlight/unhighlight nodes based on selectedNodes dictionary
import { isEdge } from "react-flow-renderer";

export default function highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges) {
    const newElements = elements.map((e) => {
        // It is an edge
        if (isEdge(e)) {
            if (selectedEdges.hasOwnProperty(e.id)) {
                return {...e, style: {...e.style, stroke: 'red', strokeWidth: 5, opacity: 1}, animated: true};
            } else if (potentialEdges.hasOwnProperty(e.id)) {
                return {...e, style: {...e.style, stroke: 'blue', strokeWidth: 1, opacity: 0.3}, animated: false};
            } else if (hoverEdges.hasOwnProperty(e.id)) {
                return {...e, style: {...e.style, stroke: 'purple', strokeWidth: 1, opacity: 1}, animated: true};
            } else {
                return {...e, style: {...e.style, stroke: 'grey', strokeWidth: 1, opacity: 0.2}, animated: false};
            } 
        }

        // It is a node
        if (selectedNodes.hasOwnProperty(e.id)) {
            if (e.style.background === 'white') {
                // It was previously a selectable node. Adjust colours accordingly
                const backgroundColour = e.style.color;
                return {...e, style: {...e.style, color: 'white', background: backgroundColour, filter: 'brightness(1)'}}
            } else {
                // It was an unselected node or an already selected node. Simply make sure its brightness is adjusted
                return {...e, style: {...e.style, filter: 'brightness(1)'}};
            }
        } else if (selectableNodes.hasOwnProperty(e.id)) {
            if (e.style.background === 'white') {
                // It was already a selectable node. Do not need to adjust
                return {...e};
            } else {
                // It was an unselected node or an already selected node. Adjust text colour and background
                const textColour = e.style.background;
                return {...e, style: {...e.style, color: textColour, background: 'white', filter: 'brightness(1)'}};
            }
        } else {
            if (e.style.background === 'white') {
                // It was a selectable node previously. Adjust colours accordingly
                const backgroundColour = e.style.color;
                return {...e, style: {...e.style, color: 'white', background: backgroundColour, filter: 'brightness(0.75)'}}; 
            } else {
                // It was either unselected or an already selected node. Simply adjust brightness
                return {...e, style: {...e.style, filter: 'brightness(0.75)'}};
            }
        }
    })

    return newElements;
}