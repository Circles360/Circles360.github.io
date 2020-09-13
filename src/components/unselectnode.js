// HELPER FUNCTION for unselecting nodes
// Given a selected node, unselects it and pushes it onto a queue to be analysed
// ==================ON THE QUEUE==========================
// Unshift node and Manages its prerequisites as follows:
//  - if the prereq node is selected, turn selected edges into potential edges
//  - if otherwise, do nothing
// Determine the status of the current node:
//  - if it meets prerequisites, leave it as is.
//  - if it does not meet prerequisites, make it unselectable (delete from selectable/selected)
// For each unlock:
// - if the current node is not selected, turn edge grey no matter what
// - if the current node is selected, keep edge as it is
// - push the unlock onto queue if it was selectable/selected
import getElement from './getelement.js';
import checkPrerequisites from './checkprerequisites.js';

export default function unselectNode(elements, node, selectedNodes, selectedEdges, selectableNodes, potentialEdges) {
    // Unselect this node
    delete selectedNodes[node.id];
    var unselectQueue = [node.id];
    while (unselectQueue.length !== 0) {
        // Unshift and get the node
        const current = getElement(unselectQueue.shift(), elements);
        
        // Analyse its prerequisites
        // If the prereq node is selected, turn selected edge into potential edges
        if (current.data.conditions.prerequisites !== null) {
            for (const prereq of current.data.conditions.prerequisites) {
                if (selectedNodes.hasOwnProperty(prereq)) {
                    if (selectedEdges.hasOwnProperty('e' + prereq + '-' + current.id)) {
                        delete selectedEdges['e' + prereq + '-' + current.id];
                        potentialEdges['e' + prereq + '-' + current.id] = 1;
                    }
                }
            }
        }

        // Determine the status of the current node
        if (! checkPrerequisites(current, elements, selectedNodes)) {
            // Does not meet prerequisites. Make it unselectable
            if (selectableNodes.hasOwnProperty(current.id)) delete selectableNodes[current.id];
            else if (selectedNodes.hasOwnProperty(current.id)) delete selectedNodes[current.id];
        } else {
            // Meets prerequisites. Make it selectable
            if (selectedNodes.hasOwnProperty(current.id)) delete selectedNodes[current.id];
            selectableNodes[current.id] = 1;
        }

        // Analyse its unlocks
        if (current.data.unlocks !== null) {
            for (const unlockCourse of current.data.unlocks) {
                if (! selectedNodes.hasOwnProperty(current.id)) {
                    // Make edge grey
                    if (potentialEdges.hasOwnProperty('e' + current.id + '-' + unlockCourse)) delete potentialEdges['e' + current.id + '-' + unlockCourse];
                    else if (selectedEdges.hasOwnProperty('e' + current.id + '-' + unlockCourse)) delete selectedEdges['e' + current.id + '-' + unlockCourse];
                }

                if (selectedNodes.hasOwnProperty(unlockCourse) || selectableNodes.hasOwnProperty(unlockCourse)) {
                    unselectQueue.push(unlockCourse);
                }
            }
        }
    }
}