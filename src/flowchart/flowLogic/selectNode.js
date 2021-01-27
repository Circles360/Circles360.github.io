// HELPER FUNCTION for selecting nodes
// Given a selectable node, highlights potential edges and fills in prereq edges
// import checkPrerequisites from './checkprerequisites.js';
// import getElement from './getElement.js';

export default function selectNode(elements, node, selectedNodes, selectedEdges, selectableNodes, potentialEdges) {
    selectedNodes[node.id] = 1;
    delete selectableNodes[node.id];

    // Turn its prerequisite potential edges into actual edges
    // Keep grey edges as grey
    if (node.data.conditions.prerequisites !== null) {
        for (const prereq of node.data.conditions.prerequisites) {
            if (potentialEdges.hasOwnProperty('e' + prereq + '-' + node.id)) {
                selectedEdges['e' + prereq + '-' + node.id] = 1;
                delete potentialEdges['e' + prereq + '-' + node.id];
            }
        }
    }

    // Unlock its future edges
    if (node.data.unlocks !== null) {
        for (const unlockCourse of node.data.unlocks) {
            // Edges from node to unlocks should be unselected
            if (selectedNodes.hasOwnProperty(unlockCourse)) {
                // This course is already selected. Make the edge a selected edge
                selectedEdges['e' + node.id + '-' + unlockCourse] = 1;
            } else {
                // This course is either unselected or selectable
                // In either case, add potential edge
                potentialEdges['e' + node.id + '-' + unlockCourse] = 1;
            }
        }            
    }

    return;
}
