// HELPER FUNCTION to initialise selectable nodes and edges
import checkPrerequisites from '../flowLogic/checkPrerequisites';

export default function selectableInit(elements, nodesData, selectedNodes, selectableNodes, potentialEdges) {
    for (const node of nodesData) {
        if (selectedNodes.hasOwnProperty(node.id)) {
            if (node.data.unlocks === null) continue;
            for (const unlockCourse of node.data.unlocks) {
                potentialEdges['e' + node.id + '-' + unlockCourse] = 1;
            }
        } else if (checkPrerequisites(node, elements, selectedNodes)) {
            selectableNodes[node.id] = 1;
        }
    }
}