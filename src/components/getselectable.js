// HELPER FUNCTION to determine which previously unselectable nodes
// are now selectable
import checkPrerequisites from './checkprerequisites.js';
// import getElement from './getelement.js';
import {isNode} from 'react-flow-renderer';

export default function getSelectable(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges) {
    // TODO: Deal with outsider nodes

    const analyseNodesKeys = [];
    for (const e of elements) {
        if (isNode(e)) {
            analyseNodesKeys.push(e);
        }
    }

    // Analyse the target of potential edges for potential nodes
    /*var analyseNodes = {};
    const potentialEdgesKeys = Object.keys(potentialEdges);
    for (var edge of potentialEdgesKeys) {
        // Get the target course
        const target = edge.split('-')[1];

        if ((! selectedNodes.hasOwnProperty(target)) && (! selectableNodes.hasOwnProperty(target))) {
            analyseNodes[edge.split('-')[1]] = 1;
        }
    }*/

    
    //const analyseNodesKeys = Object.keys(analyseNodes);
    //console.log("==========ANALYSE NODES KEYS===========");
    //console.log(analyseNodesKeys);
    //console.log("==============ELEMENTS===============");
    //console.log(elements);

    for (const node of analyseNodesKeys) {
        // Determine if the prerequisite has been met
        //const node = getElement(nodeID, elements);
        //console.log(node);
        
        // If the node is already selected, don't bother making it selectable
        if (selectedNodes.hasOwnProperty(node.id)) continue;


        if (checkPrerequisites(node, elements, selectedNodes)) {
            //console.log("SELECTABLE");
            //console.log(node.id);
            selectableNodes[node.id] = 1;
        } else {
            if (selectableNodes.hasOwnProperty(node.id)) delete selectableNodes[node.id];
            //console.log("DELETE UNSELECTABLE");
            //console.log(node.id);
            // TODO: Deal with selected nodes cases? (e.g. unselecting a child???)

        }
    }
}