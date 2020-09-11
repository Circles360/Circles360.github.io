// HELPER FUNCTION to determine which previously unselectable nodes
// are now selectable
import checkPrerequisites from './checkprerequisites.js';
import getElement from './getelement.js';

export default function getSelectable(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges) {
    // TODO: Deal with outsider nodes

    // Analyse the target of potential edges for potential nodes
    var analyseNodes = {};
    const potentialEdgesKeys = Object.keys(potentialEdges);
    for (var edge of potentialEdgesKeys) {
        // Get the target course
        const target = edge.split('-')[1];

        if ((! selectedNodes.hasOwnProperty(target)) && (! selectableNodes.hasOwnProperty(target))) {
            analyseNodes[edge.split('-')[1]] = 1;
        }
    }

    const analyseNodesKeys = Object.keys(analyseNodes);
    //console.log("==========ANALYSE NODES KEYS===========");
    //console.log(analyseNodesKeys);
    //console.log("==============ELEMENTS===============");
    //console.log(elements);

    for (const nodeID of analyseNodesKeys) {
        // Determine if the prerequisite has been met
        // For now, assume prerequisites are met
        const node = getElement(nodeID, elements);
        //console.log(node);
        
        if (checkPrerequisites(node, selectedNodes)) {
            selectableNodes[nodeID] = 1;
        } else {
            if (selectableNodes.hasOwnProperty(nodeID)) delete selectableNodes[nodeID];
            // TODO: Deal with selected nodes cases? (e.g. unselecting a child???)
        }
    }
}