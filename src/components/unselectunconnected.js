// HELPER FUNCTION FOR unselecting nodes
// Determines if any nodes not connected to unselect node needs to be unselected.
// For example, nodes which rely on N units completed
import checkPrerequisites from './checkprerequisites.js';
import unselectNode from './unselectnode.js';
import getElement from './getelement.js';

export default function unselectUnconnected(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges) {
    const selectedNodesList = Object.keys(selectedNodes);
    for (const selected of selectedNodesList) {
        // Determine if prerequisites are met
        const selectedNode = getElement(selected, elements);
        if (! checkPrerequisites(selectedNode, elements, selectedNodes)) {
            // Prerequisites are not met
            unselectNode(elements, selectedNode, selectedNodes, selectedEdges, selectableNodes, potentialEdges);
        }
    }

    const selectableNodesList = Object.keys(selectableNodes);
    for (const selectable of selectableNodesList) {
        // Determine if prerequisites are met
        const selectableNode = getElement(selectable, elements);
        if (! checkPrerequisites(selectableNode, elements, selectedNodes)) {
            // Prerequisites are not met
            delete selectableNode[selectable];
        }
    }
}