// HELPER FUNCTION to highlight prerequisites in purple on hover
// When hovering over an unselected node, show a path of edges
// which will stop at a selected/selectable node
import getElement from './getelement.js';

export default function hoverPrerequisites(node, elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges) {
    if (node.data.conditions.prerequisites === null) return;
    console.log("123123123123===== " + node.id);
    var prereqQueue = [node.id];
    while (prereqQueue.length !== 0) {
        console.log("=====================");
        console.log(prereqQueue[0]);
        const current = getElement(prereqQueue.unshift(), elements);
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
