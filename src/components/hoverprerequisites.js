// HELPER FUNCTION to highlight prerequisites in purple on hover
// When hovering over an unselected node, show a path of edges
// which will stop at a selected/selectable node
import getElement from './getelement.js';

export default function hoverPrerequisites(node, elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges) {
    if (node.data.conditions.prerequisites === null) return;
    var prereqQueue = [node.id];
    while (prereqQueue.length !== 0) {
        const current = getElement(prereqQueue.shift(), elements);
        
        // Make sure this course exists as a node in our map
        if (current === null) continue;

        if (current.data.conditions.prerequisites === null) continue;

        for (const prereq of current.data.conditions.prerequisites) {
            if ((!selectedEdges.hasOwnProperty('e' + prereq + '-' + current.id)) && (!potentialEdges.hasOwnProperty('e' + prereq + '-' + current.id))) {
                hoverEdges['e' + prereq + '-' + current.id] = 1;
            }

            if ((!selectedNodes.hasOwnProperty(prereq)) && (!selectableNodes.hasOwnProperty(prereq))) {
                prereqQueue.push(prereq);
            }
        }
    }
}
