// HELPER FUNCTION to hide and reveal nodes based on toggle
import {isNode} from 'react-flow-renderer';

export default function toggleMapHidden(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, toggleHiddenNodes, toggleHiddenEdges, hideMap) {
    if (hideMap === true) {
        // Hide all the nodes
        for (const e of elements) {
            if (isNode(e)) {
                // Is a node
                if (!(selectedNodes.hasOwnProperty(e.id)) && !(selectableNodes.hasOwnProperty(e.id))) {
                    // Hide this node as it is unselected and cannot be selected
                    toggleHiddenNodes[e.id] = 1;
                }
            } else {
                // It is an edge
                if (!(selectedEdges.hasOwnProperty(e.id)) && !potentialEdges.hasOwnProperty(e.id)) {
                    toggleHiddenEdges[e.id] = 1;
                }
            }
        }
    } else {
        //  Delete everything from toggleHdidenNodes and toggleHiddenEdges
        for (var node in toggleHiddenNodes) {
            if (toggleHiddenNodes.hasOwnProperty(node)) delete toggleHiddenNodes[node];
        }
        for (var edge in toggleHiddenEdges) {
            if (toggleHiddenEdges.hasOwnProperty(edge)) delete toggleHiddenEdges[edge];
        }
    }
}
