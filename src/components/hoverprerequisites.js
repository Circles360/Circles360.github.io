// HELPER FUNCTION to highlight prerequisites in purple on hover
// When hovering over an unselected node, show a path of edges
// which will stop at a selected/selectable node
import getElement from './getelement.js';

export default function hoverPrerequisites(node, elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges) {
    if (node.data.conditions.prerequisites === null) return;
    // Get all selected edges one layer down and add to hover edges
    for (const prereq of node.data.conditions.prerequisites) {
        if (selectedEdges.hasOwnProperty('e' + prereq + '-' + node.id)) {
            hoverEdges['e' + prereq + '-' + node.id] = 1;
        }
    }

    // hoverEdge all unselected (AND POTENTIAL???) edges until we hit selected node (NO LONGER STOPS AT SELECTABLE NODE)
    var prereqQueue = [node.id];
    while (prereqQueue.length !== 0) {
        console.log("GET ELEMENT FROM QUEUE + ", prereqQueue[0]);
        const current = getElement(prereqQueue.shift(), elements);
        
        // Make sure this course exists as a node in our map
        if (current === null) continue;

        if (current.data.conditions.prerequisites === null) continue;

        for (const prereq of current.data.conditions.prerequisites) {
            if (!selectedEdges.hasOwnProperty('e' + prereq + '-' + current.id)) {
                hoverEdges['e' + prereq + '-' + current.id] = 1;
            }
            /*if ((!selectedEdges.hasOwnProperty('e' + prereq + '-' + current.id)) && (!potentialEdges.hasOwnProperty('e' + prereq + '-' + current.id))) {
                hoverEdges['e' + prereq + '-' + current.id] = 1;
            }*/

            if ((!selectedNodes.hasOwnProperty(prereq))) {
                prereqQueue.push(prereq);
            }
        }
    }
}
